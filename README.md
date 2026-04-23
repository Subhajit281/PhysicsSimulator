#  Physics Simulator (C++ + Electron)

An interactive desktop-based **Physics Simulation Lab** combining high-performance C++ simulations (SFML) with a modern Electron + React UI.

---

##  Contributors

**Subhajit Sarkar**
**Luit Malay Das**
**Darshan Gupta**

---

##  Overview

This project provides a collection of physics simulations such as **Ball collisions, Boids (flocking), waves, electric fields, and more**, wrapped inside a clean and interactive UI.

*  **C++ (SFML)** → Core physics engine & rendering
*  **React + Vite** → UI layer
*  **Electron** → Desktop integration & IPC

---

##  Features

* Real-time physics simulations
* Interactive parameter controls
* Native C++ rendering (high performance)
* Modular simulation architecture
* Cross-platform desktop app (via Electron)

---

##  Implemented Simulations

###  Ball Physics (Sandbox)

A dynamic multi-ball collision simulation with gravity and elasticity.

#### Features:

*  Collision detection and resolution (currently unoptimized)
*  Gravity simulation
*  Wall collisions with restitution (elasticity)
*  Random color generation for each ball
*  Click-based ball spawning (sandbox mode)

#### File Structure:

* `objects/Ball.h`, `objects/Ball.cpp` → Ball class (OOP design)
* `sandbox.cpp` → Main simulation entry point

---

###  Boids (Flocking Algorithm)

Simulation of collective motion inspired by bird flocking behavior.

#### Core Rules:

* Separation (avoid crowding)
* Alignment (match velocity)
* Cohesion (move toward group center)

---

##  Project Structure

```bash
PhysicsSimulator/
│
├── build/                # Compiled C++ executables + SFML DLLs
├── ui/                   # Electron + React frontend
│   ├── electron/         # Main & preload scripts
│   ├── src/              # React components
│   └── dist/             # Built frontend
│
├── objects/              # Core physics objects (Ball, etc.)
├── engine/               # Physics engine logic
├── rendering/            # SFML rendering utilities
├── input/                # Input handling
├── include/              # Headers
└── CMakeLists.txt        # C++ build config
```

---

##  Installation & Setup

### 🔹 Prerequisites

* Node.js
* CMake
* SFML (2.x)
* MinGW / MSVC (C++ compiler)

---

### 🔹 Run in Development Mode

```bash
cd ui
npm install
npm run dev
```

---

### 🔹 Build Desktop App

```bash
cd ui
npm run dist
```

Output:

```
dist/Physics Simulator Setup 1.0.0.exe
```

---

##  Distribution

Share the generated installer:

```
Physics Simulator Setup 1.0.0.exe
```

>  Do NOT upload `dist/`, `.exe`, or `.dll` files to GitHub.

---

##  Architecture

* React UI communicates with Electron via IPC
* Electron launches native C++ simulations using `child_process.spawn`
* SFML handles rendering in separate native windows
* Parameters are controlled from UI but executed in native layer

---

##  Current Limitations

* Collision detection is not optimized (O(n²))
* Limited inter-process communication (UI ↔ C++)
* Some simulations still under development

---

##  Future Improvements

* Spatial partitioning (QuadTree / Grid) for collision optimization
* Real-time parameter syncing with C++ engine
* More simulations:

  * Electric & Magnetic fields
  * Wave mechanics
  * Optics lab
* Cross-platform builds (Linux/macOS)
* Auto-update system

---



##  Acknowledgements

* SFML (Simple and Fast Multimedia Library)
* Electron
* React

---

##  License

This project is for educational and experimental purposes.
