const { app, BrowserWindow, ipcMain } = require('electron')
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

// ui/electron/main.js → go up two levels to reach PhysicsSimulator/build
const BUILD_DIR = app.isPackaged
  ? path.join(process.resourcesPath, 'build')
  : path.resolve(__dirname, '..', '..', 'build')

// ── Keys MUST match exactly what App.jsx sends via SIM_EXECUTABLE map ──
// App.jsx SIM_EXECUTABLE = { boid: "Boid", ball: "Ball", ... }
// So the values sent over IPC are the capitalized names like "Boid", "Ball"
const SIM_EXES = {
  Ball:        'Ball.exe',
  Boid:        'Boid.exe',
  Friction:    'Friction.exe',
  Pulley:      'Pulley.exe',
  Oscillation: 'Oscillation.exe',
  Wave:        'Wave.exe',
  Electric:    'Electric.exe',
  Magnetic:    'Magnetic.exe',
  Light:       'Light.exe',
  Universe:    'Universe.exe',
  Sandbox:     'Sandbox.exe',
}

let activeProcess = null

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  const isDev = !app.isPackaged
  if (isDev) {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }
}

// ── IPC: launch a simulation exe ────────────────────────────────────────────
// Receives execName like "Boid", "Ball", "Electric" — capitalized, from App.jsx
ipcMain.handle('launch-sim', async (event, execName) => {
  console.log('\n=== launch-sim called ===')
  console.log('execName :', execName)
  console.log('BUILD_DIR:', BUILD_DIR)
  console.log('BUILD_DIR exists?', fs.existsSync(BUILD_DIR))

  // List all files in build dir so we can verify names
  if (fs.existsSync(BUILD_DIR)) {
    const files = fs.readdirSync(BUILD_DIR).filter(f => f.endsWith('.exe'))
    console.log('EXEs in build:', files.join(', '))
  }

  const exeFile = SIM_EXES[execName]
  if (!exeFile) {
    console.error(`ERROR: No entry in SIM_EXES for key "${execName}"`)
    console.error('Valid keys:', Object.keys(SIM_EXES).join(', '))
    return { error: `Unknown sim: "${execName}". Valid names: ${Object.keys(SIM_EXES).join(', ')}` }
  }

  const exePath = path.join(BUILD_DIR, exeFile)
  console.log('exeFile  :', exeFile)
  console.log('exePath  :', exePath)
  console.log('exe exists?', fs.existsSync(exePath))

  if (!fs.existsSync(exePath)) {
    console.error('ERROR: exe not found at', exePath)
    return { error: `Exe not found: ${exePath}` }
  }

  // Kill any previously running simulation
  if (activeProcess) {
    console.log('Killing previous process pid:', activeProcess.pid)
    activeProcess.kill()
    activeProcess = null
  }

  try {
    activeProcess = spawn(exePath, [], {
      cwd: BUILD_DIR,   // so SFML DLLs next to the exe are found
      detached: true,
      stdio: 'ignore',
    })

    activeProcess.on('error', (err) => {
      console.error('spawn error:', err.message)
      activeProcess = null
    })

    activeProcess.on('exit', (code, signal) => {
      console.log(`[${execName}] exited — code: ${code}, signal: ${signal}`)
      activeProcess = null
    })

    activeProcess.unref()

    console.log(`Spawned ${execName} — pid: ${activeProcess.pid}`)
    return { ok: true, pid: activeProcess.pid, exe: exeFile }

  } catch (err) {
    console.error('Failed to spawn:', err.message)
    return { error: `Spawn failed: ${err.message}` }
  }
})

// ── IPC: kill the active simulation ─────────────────────────────────────────
ipcMain.handle('kill-sim', async () => {
  if (activeProcess) {
    console.log('Killing process pid:', activeProcess.pid)
    activeProcess.kill()
    activeProcess = null
  }
  return { ok: true }
})

// ── App lifecycle ────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (activeProcess) { activeProcess.kill(); activeProcess = null }
  if (process.platform !== 'darwin') app.quit()
})