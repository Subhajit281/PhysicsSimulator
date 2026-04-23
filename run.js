

const { spawn } = require('child_process')
const path = require('path')
const readline = require('readline')

const BUILD_DIR = path.join(__dirname, 'build')

const SIMS = [
  { key: '1',  name: 'Ball Physics',    exe: 'Ball.exe'        },
  { key: '2',  name: 'Boid Swarm',      exe: 'Boid.exe'        },
  { key: '3',  name: 'Ramp & Friction', exe: 'Friction.exe'    },
  { key: '4',  name: 'Atwood Machine',  exe: 'Pulley.exe'      },
  { key: '5',  name: 'Spring & SHM',    exe: 'Oscillation.exe' },
  { key: '6',  name: 'Sandbox',         exe: 'Sandbox.exe'     },
  { key: '7',  name: 'Wave Lab',        exe: 'Wave.exe'        },
  { key: '8',  name: 'Electric Field',  exe: 'Electric.exe'    },
  { key: '9',  name: 'Magnetic Field',  exe: 'Magnetic.exe'    },
  { key: '10', name: 'Optics Lab',      exe: 'Light.exe'       },
  { key: '11', name: 'Universe Sandbox',exe: 'Universe.exe'    },
]

function printMenu() {
  console.clear()
  console.log('╔════════════════════════════════════╗')
  console.log('║      Physics Simulator Launcher    ║')
  console.log('╠════════════════════════════════════╣')
  SIMS.forEach(s => {
    console.log(`║  ${s.key.padStart(2)}.  ${s.name.padEnd(28)}║`)
  })
  console.log('╠════════════════════════════════════╣')
  console.log('║   0.  Exit                         ║')
  console.log('╚════════════════════════════════════╝')
}

function launch(sim) {
  const exePath = path.join(BUILD_DIR, sim.exe)
  console.log(`\nLaunching ${sim.name}...`)

  const proc = spawn(exePath, [], {
    cwd: BUILD_DIR,
    detached: true,
    stdio: 'ignore',
  })

  proc.on('error', err => {
    console.error(`Failed to launch: ${err.message}`)
  })

  proc.unref()
  console.log(`✓ ${sim.name} opened (pid: ${proc.pid})`)
}

function prompt() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  printMenu()
  rl.question('\nEnter number: ', (answer) => {
    rl.close()
    const trimmed = answer.trim()
    if (trimmed === '0') {
      console.log('Bye!')
      process.exit(0)
    }
    const sim = SIMS.find(s => s.key === trimmed)
    if (sim) {
      launch(sim)
    } else {
      console.log(`Unknown option: "${trimmed}"`)
    }
    // Ask again after a short delay
    setTimeout(prompt, 1200)
  })
}

prompt()
