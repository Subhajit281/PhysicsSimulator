import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
   GLOBAL STYLES (injected once)
───────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+3:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --ink:     #1a1a2e;
  --ink2:    #2d2d4e;
  --ink3:    #4a4a6a;
  --paper:   #f8f6f0;
  --paper2:  #f0ede4;
  --paper3:  #e8e3d6;
  --accent:  #c8793a;
  --accent2: #4a7c9e;
  --accent3: #6b9e6b;
  --red:     #c84a4a;
  --gold:    #b8963a;
  --serif:   'Playfair Display', Georgia, serif;
  --sans:    'Source Sans 3', system-ui, sans-serif;
  --mono:    'JetBrains Mono', monospace;
  --r:       8px;
  --r2:      14px;
  --shadow:  0 2px 16px rgba(26,26,46,0.10);
  --shadow2: 0 4px 32px rgba(26,26,46,0.16);
}

body { font-family: var(--sans); background: var(--paper); color: var(--ink); }

.ps-root { display: flex; height: 100vh; overflow: hidden; }

/* ── Sidebar ── */
.ps-sidebar {
  width: 240px; min-width: 240px;
  background: var(--ink);
  color: var(--paper);
  display: flex; flex-direction: column;
  overflow-y: auto;
  border-right: 1px solid var(--ink2);
}
.ps-logo {
  padding: 28px 20px 20px;
  border-bottom: 1px solid var(--ink2);
}
.ps-logo h1 {
  font-family: var(--serif);
  font-size: 18px; font-weight: 700;
  color: var(--paper);
  line-height: 1.2;
}
.ps-logo span { color: var(--accent); }
.ps-logo p { font-size: 11px; color: var(--ink3); margin-top: 4px; letter-spacing: .06em; text-transform: uppercase; }

.ps-section-label {
  font-size: 10px; font-weight: 600; letter-spacing: .12em;
  text-transform: uppercase; color: var(--ink3);
  padding: 18px 20px 6px;
}

.ps-nav-btn {
  display: flex; align-items: center; gap: 10px;
  width: 100%; padding: 10px 20px;
  background: none; border: none; cursor: pointer;
  color: var(--paper); font-family: var(--sans);
  font-size: 13.5px; text-align: left;
  transition: background .15s;
  border-left: 3px solid transparent;
}
.ps-nav-btn:hover { background: var(--ink2); }
.ps-nav-btn.active {
  background: rgba(200,121,58,.15);
  border-left-color: var(--accent);
  color: #f5c9a0;
}
.ps-nav-btn .icon { font-size: 16px; width: 20px; text-align: center; }
.ps-nav-btn .badge {
  margin-left: auto; font-size: 10px;
  background: var(--accent); color: white;
  padding: 1px 6px; border-radius: 8px;
}

/* ── Main ── */
.ps-main {
  flex: 1; display: flex; flex-direction: column;
  overflow: hidden; background: var(--paper);
}
.ps-header {
  background: var(--paper);
  border-bottom: 1px solid var(--paper3);
  padding: 16px 28px;
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 16px;
}
.ps-header-title { font-family: var(--serif); font-size: 22px; font-weight: 700; color: var(--ink); }
.ps-header-sub { font-size: 13px; color: var(--ink3); margin-top: 2px; }

.ps-controls-bar {
  display: flex; gap: 8px; flex-wrap: wrap; align-items: center;
}

/* ── Simulation Area ── */
.ps-sim-wrap {
  flex: 1; display: flex; overflow: hidden; min-height: 0;
}
.ps-canvas-area {
  flex: 1; display: flex; align-items: stretch; justify-content: stretch;
  background: var(--paper2); position: relative; overflow: hidden; min-width: 0;
}
.ps-canvas-area canvas {
  display: block; width: 100% !important; height: 100% !important;
  object-fit: contain;
}

/* ── Electron launch overlay ── */
.ps-electron-overlay {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  background: rgba(10,12,26,.82);
  backdrop-filter: blur(4px);
  z-index: 10;
  gap: 14px;
}
.ps-electron-overlay p {
  color: rgba(255,255,255,.65);
  font-family: var(--mono); font-size: 12px;
  text-align: center; max-width: 280px; line-height: 1.6;
}
.ps-electron-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(74,124,158,.2); border: 1px solid rgba(74,124,158,.4);
  color: #8ab8d8; font-size: 11px; font-family: var(--mono);
  padding: 4px 10px; border-radius: 6px;
}
.ps-electron-error {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(200,74,74,.2); border: 1px solid rgba(200,74,74,.4);
  color: #e88080; font-size: 11px; font-family: var(--mono);
  padding: 4px 10px; border-radius: 6px;
  max-width: 340px; text-align: center;
}

/* ── Panel ── */
.ps-panel {
  width: 260px; min-width: 260px;
  background: var(--paper);
  border-left: 1px solid var(--paper3);
  overflow-y: auto; padding: 20px 16px;
  display: flex; flex-direction: column; gap: 16px;
}
.ps-panel-section { display: flex; flex-direction: column; gap: 8px; }
.ps-panel-section h3 {
  font-family: var(--serif); font-size: 13px; font-weight: 600;
  color: var(--ink); border-bottom: 1px solid var(--paper3);
  padding-bottom: 6px; margin-bottom: 2px;
}

/* Sliders */
.ps-field { display: flex; flex-direction: column; gap: 3px; }
.ps-field label {
  font-size: 11px; font-weight: 600; color: var(--ink3);
  text-transform: uppercase; letter-spacing: .06em;
  display: flex; justify-content: space-between;
}
.ps-field label span { font-family: var(--mono); color: var(--accent); font-weight: 400; font-size: 11px; }
.ps-slider {
  -webkit-appearance: none; appearance: none;
  width: 100%; height: 4px; border-radius: 2px;
  background: var(--paper3); outline: none; cursor: pointer;
}
.ps-slider::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 14px; height: 14px; border-radius: 50%;
  background: var(--accent); cursor: pointer;
  border: 2px solid white; box-shadow: 0 1px 4px rgba(0,0,0,.2);
}
.ps-slider::-moz-range-thumb {
  width: 14px; height: 14px; border-radius: 50%;
  background: var(--accent); cursor: pointer;
  border: 2px solid white;
}

/* Stat cards */
.ps-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.ps-stat {
  background: var(--paper2); border-radius: var(--r);
  padding: 8px 10px;
  border: 1px solid var(--paper3);
}
.ps-stat .label { font-size: 10px; color: var(--ink3); text-transform: uppercase; letter-spacing: .05em; margin-bottom: 2px; }
.ps-stat .value { font-family: var(--mono); font-size: 13px; font-weight: 500; color: var(--ink); }

/* Buttons */
.ps-btn {
  padding: 7px 14px; border-radius: var(--r);
  border: 1px solid var(--paper3);
  background: var(--paper); color: var(--ink);
  font-family: var(--sans); font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all .15s;
  display: inline-flex; align-items: center; gap: 6px;
}
.ps-btn:hover { background: var(--paper3); border-color: var(--ink3); }
.ps-btn.primary { background: var(--accent); color: white; border-color: var(--accent); }
.ps-btn.primary:hover { background: #b5682a; }
.ps-btn.danger { background: var(--red); color: white; border-color: var(--red); }
.ps-btn.sm { padding: 5px 10px; font-size: 11px; }
.ps-btn.launch {
  background: linear-gradient(135deg,rgba(74,124,158,.15),rgba(74,124,158,.08));
  border-color: rgba(74,124,158,.5); color: #4a7c9e;
}
.ps-btn.launch:hover { background: rgba(74,124,158,.2); }
.ps-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Instruction card */
.ps-hint {
  background: linear-gradient(135deg, rgba(74,124,158,.06), rgba(200,121,58,.06));
  border: 1px solid rgba(74,124,158,.2);
  border-radius: var(--r);
  padding: 10px 12px;
  font-size: 11.5px; color: var(--ink3); line-height: 1.6;
}
.ps-hint strong { color: var(--accent2); font-weight: 600; }

/* ── Home Dashboard ── */
.ps-home {
  padding: 32px; overflow-y: auto; flex: 1;
}
.ps-home-hero {
  margin-bottom: 32px;
}
.ps-home-hero h2 {
  font-family: var(--serif); font-size: 32px; font-weight: 700;
  color: var(--ink); line-height: 1.2;
}
.ps-home-hero h2 em { color: var(--accent); font-style: italic; }
.ps-home-hero p { margin-top: 8px; color: var(--ink3); font-size: 15px; max-width: 520px; line-height: 1.6; }

.ps-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
.ps-card {
  background: var(--paper);
  border: 1px solid var(--paper3);
  border-radius: var(--r2);
  padding: 20px 18px;
  cursor: pointer;
  transition: all .18s;
  box-shadow: var(--shadow);
  position: relative; overflow: hidden;
}
.ps-card::before {
  content: ''; position: absolute;
  top: 0; left: 0; right: 0; height: 3px;
}
.ps-card:hover { transform: translateY(-2px); box-shadow: var(--shadow2); border-color: var(--paper3); }
.ps-card .card-icon { font-size: 28px; margin-bottom: 10px; }
.ps-card h3 { font-family: var(--serif); font-size: 15px; font-weight: 600; color: var(--ink); }
.ps-card p { font-size: 12px; color: var(--ink3); margin-top: 4px; line-height: 1.5; }
.ps-card .card-tag {
  display: inline-block; margin-top: 10px;
  font-size: 10px; font-weight: 600; letter-spacing: .06em;
  text-transform: uppercase; padding: 2px 8px; border-radius: 4px;
}

/* Colour strips for cards */
.accent-orange::before { background: var(--accent); }
.accent-blue::before   { background: var(--accent2); }
.accent-green::before  { background: var(--accent3); }
.accent-red::before    { background: var(--red); }
.accent-gold::before   { background: var(--gold); }
.accent-purple::before { background: #7a6eb8; }
.accent-teal::before   { background: #3a9e8c; }
.accent-coral::before  { background: #c8634a; }
.accent-indigo::before { background: #4a5ab8; }
.accent-slate::before  { background: #5a6a7a; }

/* Sub-tabs for Light */
.ps-tabs { display: flex; gap: 4px; flex-wrap: wrap; }
.ps-tab {
  padding: 6px 12px; border-radius: var(--r);
  border: 1px solid var(--paper3);
  background: var(--paper); color: var(--ink3);
  font-size: 12px; font-weight: 600; cursor: pointer;
  transition: all .15s;
}
.ps-tab.active { background: var(--accent2); color: white; border-color: var(--accent2); }

/* Status badge */
.ps-status {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11px; font-weight: 600; color: var(--accent3);
  padding: 3px 10px; border-radius: 20px;
  background: rgba(107,158,107,.12); border: 1px solid rgba(107,158,107,.25);
}
.ps-status.paused { color: var(--accent); background: rgba(200,121,58,.1); border-color: rgba(200,121,58,.25); }
.ps-status.native { color: #4a7c9e; background: rgba(74,124,158,.1); border-color: rgba(74,124,158,.25); }
.ps-status .dot { width:7px;height:7px;border-radius:50%;background:currentColor; }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--paper3); border-radius: 3px; }
`;

/* ─────────────────────────────────────────────
   ELECTRON BRIDGE
───────────────────────────────────────────── */
const isElectron = () =>
  typeof window !== "undefined" && !!window.electronAPI;

// Maps sim id → compiled executable name (must match CMakeLists.txt target)
// These CAPITALIZED values are what gets sent over IPC to main.js
const SIM_EXECUTABLE = {
  ball:        "Ball",
  wave:        "Wave",
  electric:    "Electric",
  friction:    "Friction",
  magnetic:    "Magnetic",
  oscillation: "Oscillation",
  pulley:      "Pulley",
  boid:        "Boid",
  sandbox:     "Sandbox",
  universe:    "Universe",
  light:       "Light",
};

/* ─────────────────────────────────────────────
   SIMULATION DEFINITIONS
───────────────────────────────────────────── */
const SIMS = [
  { id:"home",        label:"Dashboard",      icon:"", section:"main"                                                                                                          },
  { id:"ball",        label:"Ball Physics",   icon:"", section:"mechanics", accent:"accent-orange", tag:"Mechanics",   tagBg:"rgba(200,121,58,.1)",  tagColor:"var(--accent)",  desc:"Multi-ball collisions with gravity and restitution"            },
  { id:"boid",        label:"Boid Swarm",     icon:"", section:"mechanics", accent:"accent-teal",   tag:"Emergence",   tagBg:"rgba(58,158,140,.1)",  tagColor:"#3a9e8c",        desc:"Flocking AI using separation, alignment and cohesion"          },
  { id:"friction",    label:"Ramp & Friction",icon:"", section:"mechanics", accent:"accent-blue",   tag:"Forces",      tagBg:"rgba(74,124,158,.1)",  tagColor:"var(--accent2)", desc:"Block on inclined plane with real-time force vectors"          },
  { id:"pulley",      label:"Atwood Machine", icon:"", section:"mechanics", accent:"accent-gold",   tag:"Dynamics",    tagBg:"rgba(184,150,58,.1)",  tagColor:"var(--gold)",    desc:"Two-mass pulley with rotational inertia"                       },
  { id:"oscillation", label:"Spring & SHM",   icon:"", section:"mechanics", accent:"accent-green",  tag:"Oscillation", tagBg:"rgba(107,158,107,.1)", tagColor:"var(--accent3)", desc:"Damped spring-mass system with drag"                           },
  { id:"sandbox",     label:"Sandbox",        icon:"", section:"mechanics", accent:"accent-slate",  tag:"Free Play",   tagBg:"rgba(90,106,122,.1)",  tagColor:"#5a6a7a",        desc:"Free-form sandbox for experimenting with physics objects"      },
  { id:"wave",        label:"Wave Lab",       icon:"〰", section:"fields",    accent:"accent-coral",   tag:"Waves",       tagBg:"rgba(200,99,74,.1)",   tagColor:"#c8634a",        desc:"Interference patterns from multiple point sources"             },
  { id:"electric",    label:"Electric Field", icon:"", section:"fields",    accent:"accent-indigo",  tag:"EM Fields",   tagBg:"rgba(74,90,184,.1)",   tagColor:"#4a5ab8",        desc:"Charges and particle trajectories in E fields"                 },
  { id:"magnetic",    label:"Magnetic Field", icon:"", section:"fields",    accent:"accent-purple",  tag:"EM Fields",   tagBg:"rgba(122,110,184,.1)", tagColor:"#7a6eb8",        desc:"Vector field lines from magnetic dipoles"                      },
  { id:"light",       label:"Optics Lab",     icon:"", section:"optics",    accent:"accent-red",     tag:"Optics",      tagBg:"rgba(200,74,74,.1)",   tagColor:"var(--red)",     desc:"Plane, concave and convex mirror simulations"                  },
  { id:"universe",    label:"Universe Sandbox",icon:"",section:"gravity",   accent:"accent-blue",    tag:"Gravity",     tagBg:"rgba(74,124,158,.1)",  tagColor:"var(--accent2)", desc:"N-body gravity with trails and black holes"                    },
];

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const clamp = (v,lo,hi) => Math.max(lo, Math.min(hi, v));
const dist2 = (ax,ay,bx,by) => Math.sqrt((bx-ax)**2+(by-ay)**2);
const norm2 = (x,y) => { const l=dist2(0,0,x,y)||1; return [x/l,y/l]; };
const fmt   = (n,d=2) => typeof n==="number" ? n.toFixed(d) : n;

/* ─────────────────────────────────────────────
   BALL SIMULATION
───────────────────────────────────────────── */
function useBall(canvasRef, params, running) {
  const state  = useRef({ balls:[] });
  const animRef = useRef();

  const spawnBall = useCallback((x, y) => {
    const r = 12 + Math.random()*14;
    state.current.balls.push({
      x, y, r,
      vx: (Math.random()-0.5)*200,
      vy: -80 - Math.random()*80,
      color: `hsl(${Math.random()*360},70%,60%)`,
      e: params.current.restitution,
    });
  }, [params]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    let last = performance.now();

    const loop = (now) => {
      animRef.current = requestAnimationFrame(loop);
      const dt = Math.min((now-last)/1000, 0.033); last = now;
      const p = params.current;
      const { balls } = state.current;

      if (running.current) {
        for (const b of balls) {
          b.vy += p.gravity*500*dt;
          b.x  += b.vx*dt; b.y += b.vy*dt;
          if (b.x-b.r < 0)  { b.x=b.r;   b.vx= Math.abs(b.vx)*p.restitution; }
          if (b.x+b.r > W)  { b.x=W-b.r; b.vx=-Math.abs(b.vx)*p.restitution; }
          if (b.y-b.r < 0)  { b.y=b.r;   b.vy= Math.abs(b.vy)*p.restitution; }
          if (b.y+b.r > H)  { b.y=H-b.r; b.vy=-Math.abs(b.vy)*p.restitution; }
        }
        for (let i=0;i<balls.length;i++) {
          for (let j=i+1;j<balls.length;j++) {
            const a=balls[i], b2=balls[j];
            const dx=b2.x-a.x, dy=b2.y-a.y;
            const d=Math.sqrt(dx*dx+dy*dy);
            if (d < a.r+b2.r && d > 0) {
              const nx=dx/d, ny=dy/d;
              const dvx=b2.vx-a.vx, dvy=b2.vy-a.vy;
              const rel=dvx*nx+dvy*ny;
              if (rel < 0) {
                const e=Math.min(a.e,b2.e);
                const j2=-(1+e)*rel/2;
                a.vx-=j2*nx; a.vy-=j2*ny;
                b2.vx+=j2*nx; b2.vy+=j2*ny;
              }
              const ov=(a.r+b2.r)-d;
              a.x-=nx*ov/2; a.y-=ny*ov/2;
              b2.x+=nx*ov/2; b2.y+=ny*ov/2;
            }
          }
        }
      }

      ctx.clearRect(0,0,W,H);
      ctx.strokeStyle="rgba(26,26,46,.15)"; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(0,H); ctx.lineTo(W,H); ctx.stroke();
      for (const b of balls) {
        ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2);
        const g=ctx.createRadialGradient(b.x-b.r*.3,b.y-b.r*.3,1,b.x,b.y,b.r);
        g.addColorStop(0,"white"); g.addColorStop(.3,b.color); g.addColorStop(1,"rgba(0,0,0,.4)");
        ctx.fillStyle=g; ctx.fill();
        ctx.strokeStyle="rgba(0,0,0,.15)"; ctx.lineWidth=1; ctx.stroke();
      }
      ctx.fillStyle="rgba(26,26,46,.4)"; ctx.font="12px 'Source Sans 3'";
      ctx.fillText(`${balls.length} balls`,10,20);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [canvasRef,params,running]);

  const clear = () => { state.current.balls = []; };
  return { spawnBall, clear, count:()=>state.current.balls.length };
}

/* ─────────────────────────────────────────────
   BOID SIMULATION
───────────────────────────────────────────── */
function useBoid(canvasRef, params, running) {
  const state  = useRef({ boids:[] });
  const animRef = useRef();

  const init = useCallback((n=80) => {
    const canvas = canvasRef.current; if (!canvas) return;
    state.current.boids = Array.from({length:n}, ()=>({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      vx: (Math.random()-0.5)*100,
      vy: (Math.random()-0.5)*100,
    }));
  }, [canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    if (!state.current.boids.length) init();
    const ctx = canvas.getContext("2d");
    const W=canvas.width, H=canvas.height;
    let last=performance.now();

    const loop=(now)=>{
      animRef.current=requestAnimationFrame(loop);
      const dt=Math.min((now-last)/1000,.033); last=now;
      const p=params.current;
      const boids=state.current.boids;

      if (running.current) {
        const maxSpd=p.maxSpeed??100, maxFrc=50;
        const sepR=p.separation??25, aliR=p.alignment??50, cohR=p.cohesion??50;

        for (const b of boids) {
          let sx=0,sy=0,sc=0, ax=0,ay=0,ac=0, cx=0,cy=0,cc=0;
          for (const o of boids) {
            if (o===b) continue;
            const dx=o.x-b.x, dy=o.y-b.y;
            const d=Math.sqrt(dx*dx+dy*dy)||.001;
            if (d<sepR){ sx+=(b.x-o.x)/d; sy+=(b.y-o.y)/d; sc++; }
            if (d<aliR){ ax+=o.vx; ay+=o.vy; ac++; }
            if (d<cohR){ cx+=o.x; cy+=o.y; cc++; }
          }
          let fx=0,fy=0;
          if(sc>0){sx/=sc;sy/=sc;const m=Math.sqrt(sx*sx+sy*sy)||1;fx+=(sx/m*maxSpd-b.vx)*1.5;fy+=(sy/m*maxSpd-b.vy)*1.5;}
          if(ac>0){ax/=ac;ay/=ac;const m=Math.sqrt(ax*ax+ay*ay)||1;fx+=(ax/m*maxSpd-b.vx);fy+=(ay/m*maxSpd-b.vy);}
          if(cc>0){cx/=cc;cy/=cc;const dx=cx-b.x,dy=cy-b.y,m=Math.sqrt(dx*dx+dy*dy)||1;fx+=(dx/m*maxSpd-b.vx);fy+=(dy/m*maxSpd-b.vy);}
          const fl=Math.sqrt(fx*fx+fy*fy)||1;
          if(fl>maxFrc){fx=fx/fl*maxFrc;fy=fy/fl*maxFrc;}
          b.vx+=fx*dt; b.vy+=fy*dt;
          const spd=Math.sqrt(b.vx*b.vx+b.vy*b.vy)||1;
          if(spd>maxSpd){b.vx=b.vx/spd*maxSpd;b.vy=b.vy/spd*maxSpd;}
          b.x+=b.vx*dt; b.y+=b.vy*dt;
          if(b.x>W)b.x=0; if(b.x<0)b.x=W;
          if(b.y>H)b.y=0; if(b.y<0)b.y=H;
        }
      }

      ctx.fillStyle="rgba(5,8,20,.22)"; ctx.fillRect(0,0,W,H);
      for (const b of boids) {
        const ang=Math.atan2(b.vy,b.vx);
        ctx.save(); ctx.translate(b.x,b.y); ctx.rotate(ang);
        ctx.beginPath(); ctx.moveTo(7,0); ctx.lineTo(-4,3); ctx.lineTo(-4,-3); ctx.closePath();
        ctx.fillStyle="rgba(140,200,255,.85)"; ctx.fill();
        ctx.restore();
      }
    };
    animRef.current=requestAnimationFrame(loop);
    return ()=>cancelAnimationFrame(animRef.current);
  }, [canvasRef,params,running,init]);

  return { init };
}

/* ─────────────────────────────────────────────
   FRICTION
───────────────────────────────────────────── */
function useFriction(canvasRef, params, running) {
  const state  = useRef({ vel:0, pos:0 });
  const animRef = useRef();
  const reset = () => { state.current.vel=0; state.current.pos=0; };

  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d");
    const W=canvas.width,H=canvas.height;
    const cx=W/2, groundY=H*0.68;
    let last=performance.now();

    const drawArrow=(x1,y1,dx,dy,col)=>{
      if(Math.abs(dx)<1&&Math.abs(dy)<1) return;
      ctx.save(); ctx.strokeStyle=col; ctx.fillStyle=col; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x1+dx,y1+dy); ctx.stroke();
      const a=Math.atan2(dy,dx);
      ctx.translate(x1+dx,y1+dy); ctx.rotate(a);
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(-8,4); ctx.lineTo(-8,-4); ctx.closePath(); ctx.fill();
      ctx.restore();
    };

    const loop=(now)=>{
      animRef.current=requestAnimationFrame(loop);
      const dt=Math.min((now-last)/1000,.033); last=now;
      const p=params.current;
      const deg=p.angle??25, mass=p.mass??5, mu=p.mu??0.3;
      const r=deg*Math.PI/180, g=9.81;

      if(running.current){
        const gravPar=-mass*g*Math.sin(r);
        const normal=mass*g*Math.cos(r);
        let fric=mu*normal;
        if(state.current.vel>0) fric=-fric; else if(state.current.vel<0) fric=fric;
        const net=gravPar+fric;
        const acc=net/mass;
        state.current.vel+=acc*dt;
        state.current.pos+=state.current.vel*120*dt;
      }

      ctx.clearRect(0,0,W,H);
      const bg=ctx.createLinearGradient(0,0,0,H);
      bg.addColorStop(0,"#eef3f8"); bg.addColorStop(1,"#f8f6f0");
      ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);

      ctx.save();
      ctx.translate(cx,groundY); ctx.rotate(-deg*Math.PI/180);
      ctx.fillStyle="#c8c0b0"; ctx.fillRect(-W,-6,W*2,12);
      ctx.restore();

      const bx=cx+Math.cos(r)*state.current.pos;
      const by=groundY-Math.sin(r)*state.current.pos;
      ctx.save(); ctx.translate(bx,by); ctx.rotate(-r);
      ctx.fillStyle="#c84a4a"; ctx.fillRect(-30,-30,60,60);
      ctx.strokeStyle="rgba(0,0,0,.15)"; ctx.lineWidth=1; ctx.strokeRect(-30,-30,60,60);
      ctx.restore();

      const scale=5, grav=9.81*(params.current.mass??5);
      const nr=(params.current.mu??0.3)*grav*Math.cos(r);
      drawArrow(bx,by,0,grav*scale,"#e8c040");
      drawArrow(bx,by,-Math.sin(r)*nr*scale,-Math.cos(r)*nr*scale,"#4a9e4a");
      drawArrow(bx,by,-Math.cos(r)*nr*scale*0.6,Math.sin(r)*nr*scale*0.6,"#4a7cce");

      ctx.fillStyle="rgba(26,26,46,.5)"; ctx.font="11px 'Source Sans 3'";
      ctx.fillText("Gravity",bx+6,by+grav*scale+14);
      ctx.fillText("Normal",bx-Math.sin(r)*nr*scale-50,by-Math.cos(r)*nr*scale-6);
      ctx.fillText("Friction",bx-Math.cos(r)*nr*scale*0.6-50,by+Math.sin(r)*nr*scale*0.6);

      ctx.fillStyle="rgba(26,26,46,.06)"; ctx.fillRect(8,8,200,90);
      ctx.strokeStyle="rgba(26,26,46,.08)"; ctx.lineWidth=1; ctx.strokeRect(8,8,200,90);
      const acc2=(((-mass*g*Math.sin(r))+(mu*(mass*g*Math.cos(r))*(state.current.vel<0?1:-1)))/mass);
      ctx.fillStyle="#1a1a2e"; ctx.font="11px 'JetBrains Mono'";
      ctx.fillText(`vel:  ${state.current.vel.toFixed(2)} m/s`,16,28);
      ctx.fillText(`accel:${acc2.toFixed(2)} m/s²`,16,44);
      ctx.fillText(`pos:  ${state.current.pos.toFixed(1)}`,16,60);
    };
    animRef.current=requestAnimationFrame(loop);
    return ()=>cancelAnimationFrame(animRef.current);
  },[canvasRef,params,running]);
  return { reset };
}

/* ─────────────────────────────────────────────
   PULLEY
───────────────────────────────────────────── */
function usePulley(canvasRef, params, running) {
  const state  = useRef({ vel:0, y1:0, time:0, angle:0 });
  const animRef = useRef();
  const reset = () => { Object.assign(state.current,{vel:0,y1:0,time:0,angle:0}); };

  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d");
    const W=canvas.width,H=canvas.height;
    const pulleyY=120, pulleyR=60;
    const ropeLen=(H-pulleyY-30)*2;
    let last=performance.now();

    const loop=(now)=>{
      animRef.current=requestAnimationFrame(loop);
      const dt=Math.min((now-last)/1000,.033); last=now;
      const p=params.current;
      const m1=p.m1??5, m2=p.m2??3, g=p.gravity??9.81, pMass=8;
      const I=0.5*pMass*pulleyR*pulleyR;
      const accel=(m1-m2)*g/(m1+m2+I/(pulleyR*pulleyR));
      const T1=m1*(g-accel), T2=m2*(g+accel);
      const s=state.current;

      if(running.current){
        s.vel+=accel*dt; s.y1+=s.vel*dt*180;
        s.angle+=(s.vel/pulleyR)*dt*57.3; s.time+=dt;
        s.y1=clamp(s.y1,-ropeLen/2,ropeLen/2);
      }
      const y1Screen=pulleyY+pulleyR+Math.max(10,ropeLen/2+s.y1);
      const y2Screen=pulleyY+pulleyR+Math.max(10,ropeLen/2-s.y1);

      ctx.clearRect(0,0,W,H);
      const bg=ctx.createLinearGradient(0,0,0,H);
      bg.addColorStop(0,"#0d1117"); bg.addColorStop(1,"#161b22");
      ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
      ctx.strokeStyle="rgba(255,255,255,.03)"; ctx.lineWidth=1;
      for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}

      const px=W/2;
      ctx.strokeStyle="#e0d8c8"; ctx.lineWidth=3;
      ctx.beginPath(); ctx.arc(px,pulleyY,pulleyR,0,Math.PI*2); ctx.stroke();
      ctx.lineWidth=2; ctx.strokeStyle="rgba(224,216,200,.4)";
      for(let i=0;i<8;i++){
        const a=(s.angle+i*45)*Math.PI/180;
        ctx.beginPath(); ctx.moveTo(px,pulleyY); ctx.lineTo(px+Math.cos(a)*pulleyR,pulleyY+Math.sin(a)*pulleyR); ctx.stroke();
      }

      ctx.strokeStyle="#e0d8c8"; ctx.lineWidth=2;
      const lx=px-pulleyR, rx=px+pulleyR;
      ctx.beginPath(); ctx.moveTo(lx,pulleyY); ctx.lineTo(lx,y1Screen); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rx,pulleyY); ctx.lineTo(rx,y2Screen); ctx.stroke();
      ctx.beginPath();
      for(let i=0;i<=40;i++){
        const t=Math.PI+i*(Math.PI/40);
        const ax2=px+Math.cos(t)*pulleyR,ay=pulleyY+Math.sin(t)*pulleyR;
        i===0?ctx.moveTo(ax2,ay):ctx.lineTo(ax2,ay);
      }
      ctx.stroke();

      ctx.fillStyle="#4a9e4a"; ctx.strokeStyle="rgba(255,255,255,.1)"; ctx.lineWidth=1;
      ctx.fillRect(lx-40,y1Screen,80,70); ctx.strokeRect(lx-40,y1Screen,80,70);
      ctx.fillStyle="white"; ctx.font="bold 13px 'Source Sans 3'"; ctx.textAlign="center";
      ctx.fillText(`m₁=${m1.toFixed(1)}`,lx,y1Screen+40);

      ctx.fillStyle="#c84a4a";
      ctx.fillRect(rx-40,y2Screen,80,70);
      ctx.strokeStyle="rgba(255,255,255,.1)"; ctx.strokeRect(rx-40,y2Screen,80,70);
      ctx.fillStyle="white"; ctx.fillText(`m₂=${m2.toFixed(1)}`,rx,y2Screen+40);

      ctx.lineWidth=2;
      const drawA=(x1,y1,dx,dy,col)=>{
        ctx.strokeStyle=col; ctx.fillStyle=col;
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x1+dx,y1+dy); ctx.stroke();
        const a=Math.atan2(dy,dx);
        ctx.save(); ctx.translate(x1+dx,y1+dy); ctx.rotate(a);
        ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(-7,3); ctx.lineTo(-7,-3); ctx.closePath(); ctx.fill();
        ctx.restore();
      };
      drawA(lx,y1Screen+35,0,60,"#c84a4a"); drawA(lx,y1Screen+35,0,-60,"#4a9e4a");
      drawA(rx,y2Screen+35,0,60,"#c84a4a"); drawA(rx,y2Screen+35,0,-60,"#4a9e4a");

      ctx.textAlign="left"; ctx.fillStyle="rgba(224,216,200,.7)"; ctx.font="11px 'JetBrains Mono'";
      const lines=[`accel: ${accel.toFixed(3)} m/s²`,`T₁: ${T1.toFixed(2)} N`,`T₂: ${T2.toFixed(2)} N`,`t: ${s.time.toFixed(1)} s`];
      lines.forEach((l,i)=>ctx.fillText(l,14,20+i*16));
      p._accel=accel; p._T1=T1; p._T2=T2;
    };
    animRef.current=requestAnimationFrame(loop);
    return ()=>cancelAnimationFrame(animRef.current);
  },[canvasRef,params,running]);
  return { reset };
}

/* ─────────────────────────────────────────────
   OSCILLATION
───────────────────────────────────────────── */
function useOscillation(canvasRef, params, running) {
  const state  = useRef({ disp:400, vel:0 });
  const animRef = useRef();
  const reset = ()=>{ state.current.disp=400; state.current.vel=0; };

  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d");
    const W=canvas.width,H=canvas.height;
    const wallX=80, restLen=W*0.45, midY=H/2;
    let last=performance.now();
    let isDragging=false;
    const onDown=()=>{isDragging=true;};
    const onUp=()=>{isDragging=false;};
    const onMove=(e)=>{
      if(!isDragging) return;
      const rect=canvas.getBoundingClientRect();
      const mx=(e.clientX-rect.left)*(W/rect.width);
      state.current.disp=clamp(mx-wallX,80,W-150);
      state.current.vel=0;
    };
    canvas.addEventListener("mousedown",onDown);
    window.addEventListener("mouseup",onUp);
    canvas.addEventListener("mousemove",onMove);

    const loop=(now)=>{
      animRef.current=requestAnimationFrame(loop);
      const dt=Math.min((now-last)/1000,.033); last=now;
      const p=params.current;
      const k=p.stiffness??4, mass=p.mass??2, fric=p.friction??0.01, zeta=p.damping??0.2;
      const s=state.current;

      if(running.current&&!isDragging){
        const damp=zeta*2*Math.sqrt(k*mass);
        const ext=s.disp-restLen;
        const springF=-k*ext, dampF=-damp*s.vel;
        let net=springF+dampF;
        const stFric=fric*2;
        if(Math.abs(s.vel)<0.01){
          if(Math.abs(net)<stFric){s.vel=0;net=0;}
          else net-=stFric*Math.sign(net);
        } else { net-=fric*Math.sign(s.vel); }
        s.vel+=net/mass*dt; s.disp+=s.vel*dt;
        s.disp=Math.max(80,s.disp);
      }
      const blockX=wallX+s.disp;
      ctx.clearRect(0,0,W,H);
      const bg=ctx.createLinearGradient(0,0,0,H);
      bg.addColorStop(0,"#f0ede4"); bg.addColorStop(1,"#e8e3d6");
      ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
      ctx.fillStyle="#c8c0b0"; ctx.fillRect(0,midY+38,W,4);
      for(let x=0;x<W;x+=20){
        ctx.strokeStyle="rgba(180,170,150,.3)"; ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(x,midY+42); ctx.lineTo(x+10,midY+54); ctx.stroke();
      }
      ctx.fillStyle="#6a6058"; ctx.fillRect(wallX-22,midY-70,22,140);
      ctx.fillStyle="#4a4038"; ctx.fillRect(wallX-22,midY-70,6,140);

      ctx.strokeStyle="#8a8080"; ctx.lineWidth=2.5;
      ctx.beginPath();
      const coils=22, amp=10;
      ctx.moveTo(wallX,midY);
      for(let i=1;i<=coils;i++){
        const t=i/coils;
        ctx.lineTo(wallX+t*s.disp,midY+Math.sin(t*22*Math.PI)*amp);
      }
      ctx.stroke();

      const ext2=s.disp-restLen;
      ctx.setLineDash([4,3]); ctx.strokeStyle=ext2>0?"rgba(200,74,74,.4)":"rgba(74,158,107,.4)"; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(wallX+restLen,midY-50); ctx.lineTo(wallX+restLen,midY+50); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle="rgba(26,26,46,.35)"; ctx.font="10px 'Source Sans 3'"; ctx.textAlign="center";
      ctx.fillText("rest",wallX+restLen,midY-56);

      ctx.fillStyle="#c84a4a"; ctx.fillRect(blockX-35,midY-35,70,70);
      ctx.strokeStyle="rgba(0,0,0,.15)"; ctx.lineWidth=1; ctx.strokeRect(blockX-35,midY-35,70,70);
      ctx.fillStyle="white"; ctx.font="bold 12px 'Source Sans 3'"; ctx.textAlign="center";
      ctx.fillText(`${(params.current.mass??2).toFixed(1)}kg`,blockX,midY+5);

      if(Math.abs(s.vel)>1){
        const vscale=0.8;
        ctx.strokeStyle="#4a9e4a"; ctx.fillStyle="#4a9e4a"; ctx.lineWidth=2;
        ctx.beginPath(); ctx.moveTo(blockX,midY-50); ctx.lineTo(blockX+s.vel*vscale,midY-50); ctx.stroke();
        ctx.save(); ctx.translate(blockX+s.vel*vscale,midY-50); ctx.rotate(s.vel>0?0:Math.PI);
        ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(-7,3); ctx.lineTo(-7,-3); ctx.closePath(); ctx.fill();
        ctx.restore();
      }
      ctx.textAlign="left"; ctx.fillStyle="rgba(26,26,46,.55)"; ctx.font="11px 'JetBrains Mono'";
      ctx.fillText(`ext: ${ext2.toFixed(1)} px`,10,18);
      ctx.fillText(`vel: ${s.vel.toFixed(2)} px/s`,10,34);
    };
    animRef.current=requestAnimationFrame(loop);
    return ()=>{cancelAnimationFrame(animRef.current);canvas.removeEventListener("mousedown",onDown);window.removeEventListener("mouseup",onUp);canvas.removeEventListener("mousemove",onMove);};
  },[canvasRef,params,running]);
  return { reset };
}

/* ─────────────────────────────────────────────
   WAVE
───────────────────────────────────────────── */
function useWave(canvasRef, params, running) {
  const state  = useRef({ sources:[], time:0 });
  const animRef = useRef();
  const imgData = useRef(null);
  const addSource = useCallback((x,y)=>{ state.current.sources.push({x,y}); },[]);
  const clear = ()=>{ state.current.sources=[]; };

  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d");
    const W=canvas.width,H=canvas.height;
    imgData.current=ctx.createImageData(W,H);
    let last=performance.now();

    const loop=(now)=>{
      animRef.current=requestAnimationFrame(loop);
      const dt=Math.min((now-last)/1000,.033); last=now;
      const p=params.current, s=state.current;
      if(running.current) s.time+=0.03;
      const amp=p.amplitude??2, freq=p.frequency??3, spd=p.waveSpeed??0.04, damp=p.damping??0.002;
      const data=imgData.current.data;

      if(s.sources.length===0){
        ctx.clearRect(0,0,W,H);
        const bg=ctx.createLinearGradient(0,0,0,H);
        bg.addColorStop(0,"#0a0e1a"); bg.addColorStop(1,"#0d1220");
        ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
        ctx.fillStyle="rgba(255,255,255,.25)"; ctx.font="14px 'Source Sans 3'"; ctx.textAlign="center";
        ctx.fillText("Click on canvas to add wave sources",W/2,H/2);
        return;
      }

      for(let y=0;y<H;y++){
        for(let x=0;x<W;x++){
          let wave=0;
          for(const src of s.sources){
            const dx=x-src.x, dy=y-src.y;
            const dist=Math.sqrt(dx*dx+dy*dy);
            wave+=amp*Math.sin(dist*spd-s.time*freq)*Math.exp(-damp*dist);
          }
          const norm=clamp((wave+5)/10,0,1);
          const idx=(y*W+x)*4;
          data[idx]  =Math.round(255*norm);
          data[idx+1]=Math.round(255*(1-Math.abs(norm-0.5)*2));
          data[idx+2]=Math.round(255*(1-norm));
          data[idx+3]=255;
        }
      }
      ctx.putImageData(imgData.current,0,0);
      for(const src of s.sources){
        ctx.beginPath(); ctx.arc(src.x,src.y,7,0,Math.PI*2);
        ctx.fillStyle="white"; ctx.fill();
        ctx.beginPath(); ctx.arc(src.x,src.y,3,0,Math.PI*2);
        ctx.fillStyle="#ff6040"; ctx.fill();
      }
    };
    animRef.current=requestAnimationFrame(loop);
    return ()=>cancelAnimationFrame(animRef.current);
  },[canvasRef,params,running]);
  return { addSource, clear, count:()=>state.current.sources.length };
}

/* ─────────────────────────────────────────────
   ELECTRIC
───────────────────────────────────────────── */
function useElectric(canvasRef, params, running) {
  const state  = useRef({ charges:[], particles:[] });
  const animRef = useRef();
  const K=9000;
  const addCharge     =(x,y,q)=>state.current.charges.push({x,y,q});
  const addParticle   =()=>{ const c=canvasRef.current; if(c) state.current.particles.push({x:c.width/2,y:c.height/2,vx:0,vy:0}); };
  const clearCharges  =()=>{ state.current.charges=[]; };
  const clearParticles=()=>{ state.current.particles=[]; };

  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d");
    const W=canvas.width,H=canvas.height;
    let last=performance.now();

    const loop=(now)=>{
      animRef.current=requestAnimationFrame(loop);
      const dt=Math.min((now-last)/1000,.033); last=now;
      const p=params.current, s=state.current;
      const pq=p.particleCharge??1, pm=p.particleMass??1;

      if(running.current){
        for(const pt of s.particles){
          let fx=0,fy=0;
          for(const c of s.charges){
            const dx=pt.x-c.x, dy=pt.y-c.y;
            let d=Math.sqrt(dx*dx+dy*dy); if(d<20)d=20;
            const [nx,ny]=norm2(dx,dy);
            const fmag=K*pq*c.q/(d*d);
            fx+=nx*fmag; fy+=ny*fmag;
          }
          pt.vx+=(fx/pm)*dt; pt.vy+=(fy/pm)*dt;
          pt.x+=pt.vx*dt; pt.y+=pt.vy*dt;
        }
      }

      ctx.clearRect(0,0,W,H);
      const bg=ctx.createLinearGradient(0,0,0,H);
      bg.addColorStop(0,"#14162e"); bg.addColorStop(1,"#0e1028");
      ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);

      for(let gx=0;gx<W;gx+=40){
        for(let gy=0;gy<H;gy+=40){
          if(!s.charges.length) break;
          let fx=0,fy=0;
          for(const c of s.charges){
            const dx=gx-c.x,dy=gy-c.y;
            let d=Math.sqrt(dx*dx+dy*dy); if(d<1)d=1;
            const str=c.q/(d*d);
            fx+=(dx/d)*str; fy+=(dy/d)*str;
          }
          const l=Math.sqrt(fx*fx+fy*fy)||1;
          fx/=l; fy/=l;
          const intensity=Math.min(l*500,1);
          ctx.strokeStyle=`rgba(80,140,255,${0.15+intensity*0.35})`;
          ctx.lineWidth=1;
          ctx.beginPath(); ctx.moveTo(gx,gy); ctx.lineTo(gx+fx*18,gy+fy*18); ctx.stroke();
        }
      }

      for(const c of s.charges){
        const g2=ctx.createRadialGradient(c.x,c.y,2,c.x,c.y,14);
        if(c.q>0){g2.addColorStop(0,"#ff8060");g2.addColorStop(1,"rgba(200,60,40,.0)");}
        else{g2.addColorStop(0,"#6090ff");g2.addColorStop(1,"rgba(40,60,200,.0)");}
        ctx.beginPath(); ctx.arc(c.x,c.y,14,0,Math.PI*2); ctx.fillStyle=g2; ctx.fill();
        ctx.beginPath(); ctx.arc(c.x,c.y,8,0,Math.PI*2);
        ctx.fillStyle=c.q>0?"#ff6040":"#4060ff"; ctx.fill();
        ctx.fillStyle="white"; ctx.font="bold 11px sans-serif"; ctx.textAlign="center";
        ctx.fillText(c.q>0?"+":"−",c.x,c.y+4);
      }
      for(const pt of s.particles){
        ctx.beginPath(); ctx.arc(pt.x,pt.y,5,0,Math.PI*2);
        ctx.fillStyle="#e8e0d0"; ctx.fill();
        ctx.strokeStyle="rgba(255,255,255,.4)"; ctx.lineWidth=1; ctx.stroke();
      }
      ctx.fillStyle="rgba(180,180,220,.5)"; ctx.font="11px 'JetBrains Mono'"; ctx.textAlign="left";
      ctx.fillText(`charges: ${s.charges.length}  particles: ${s.particles.length}`,10,18);
    };
    animRef.current=requestAnimationFrame(loop);
    return ()=>cancelAnimationFrame(animRef.current);
  },[canvasRef,params,running]);
  return { addCharge, addParticle, clearCharges, clearParticles };
}

/* ─────────────────────────────────────────────
   MAGNETIC
───────────────────────────────────────────── */
function useMagnetic(canvasRef) {
  const state  = useRef({ magnets:[] });
  const animRef = useRef();
  const addMagnet   =(x,y,p)=>state.current.magnets.push({x,y,polarity:p});
  const clearMagnets=()=>{ state.current.magnets=[]; };

  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d");
    const W=canvas.width,H=canvas.height;

    const loop=()=>{
      animRef.current=requestAnimationFrame(loop);
      const mags=state.current.magnets;
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle="#0a0c18"; ctx.fillRect(0,0,W,H);

      for(let x=0;x<W;x+=38){
        for(let y=0;y<H;y+=38){
          let fx=0,fy=0;
          for(const m of mags){
            const dx=x-m.x,dy=y-m.y;
            const d=Math.sqrt(dx*dx+dy*dy)+1;
            const str=m.polarity/(d*d);
            fx+=(dx/d)*str; fy+=(dy/d)*str;
          }
          const l=Math.sqrt(fx*fx+fy*fy)||1;
          const intensity=Math.min(l*3000,1);
          const col=mags.length?`rgba(60,200,120,${0.1+intensity*0.55})`:"rgba(60,200,120,.08)";
          ctx.strokeStyle=col; ctx.lineWidth=1.5;
          ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+(fx/l)*20,y+(fy/l)*20); ctx.stroke();
          ctx.beginPath(); ctx.arc(x+(fx/l)*20,y+(fy/l)*20,1.5,0,Math.PI*2);
          ctx.fillStyle=col; ctx.fill();
        }
      }
      for(const m of state.current.magnets){
        const g=ctx.createRadialGradient(m.x,m.y,2,m.x,m.y,18);
        if(m.polarity>0){g.addColorStop(0,"#ff6040");g.addColorStop(1,"rgba(200,50,0,.0)");}
        else{g.addColorStop(0,"#4060ff");g.addColorStop(1,"rgba(0,40,200,.0)");}
        ctx.beginPath(); ctx.arc(m.x,m.y,18,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
        ctx.beginPath(); ctx.arc(m.x,m.y,9,0,Math.PI*2);
        ctx.fillStyle=m.polarity>0?"#ff4020":"#2040ff"; ctx.fill();
        ctx.fillStyle="white"; ctx.font="bold 12px sans-serif"; ctx.textAlign="center";
        ctx.fillText(m.polarity>0?"N":"S",m.x,m.y+4);
      }
    };
    animRef.current=requestAnimationFrame(loop);
    return ()=>cancelAnimationFrame(animRef.current);
  },[canvasRef]);
  return { addMagnet, clearMagnets };
}

/* ─────────────────────────────────────────────
   LIGHT
───────────────────────────────────────────── */
function useLightSim(canvasRef, params) {
  const animRef = useRef();
  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d");
    const W=canvas.width,H=canvas.height;
    const midY=H/2;

    const loop=()=>{
      animRef.current=requestAnimationFrame(loop);
      const p=params.current;
      const mode=p.mirrorMode??"concave";
      const objX=p.objectX??200;
      const objH=p.objectHeight??100;
      const f=mode==="plane"?0:(mode==="concave"?p.focalLength??200:-(p.focalLength??200));

      ctx.clearRect(0,0,W,H);
      const bg=ctx.createLinearGradient(0,0,0,H);
      bg.addColorStop(0,"#0a1020"); bg.addColorStop(1,"#0e1428");
      ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
      const mirrorX=W*0.68;

      ctx.strokeStyle="rgba(255,255,255,.2)"; ctx.lineWidth=1; ctx.setLineDash([6,4]);
      ctx.beginPath(); ctx.moveTo(0,midY); ctx.lineTo(W,midY); ctx.stroke();
      ctx.setLineDash([]);

      if(mode==="plane"){
        ctx.strokeStyle="#40d0d0"; ctx.lineWidth=4;
        ctx.beginPath(); ctx.moveTo(mirrorX,midY-160); ctx.lineTo(mirrorX,midY+160); ctx.stroke();
      } else if(mode==="concave"){
        ctx.strokeStyle="#40d0d0"; ctx.lineWidth=3;
        ctx.beginPath(); ctx.arc(mirrorX+500,midY,500,Math.PI*0.78,Math.PI*1.22); ctx.stroke();
      } else {
        ctx.strokeStyle="#40d0d0"; ctx.lineWidth=3;
        ctx.beginPath(); ctx.arc(mirrorX-500,midY,500,-Math.PI*0.22,Math.PI*0.22); ctx.stroke();
      }

      let v=0, imageH=objH, imageX=0;
      if(mode==="plane"){
        const u=mirrorX-objX; v=u; imageX=mirrorX+v; imageH=objH;
      } else {
        const u=mirrorX-objX;
        if(u-f===0){imageX=1e9;imageH=1e9;}
        else{ v=(u*f)/(u-f); const mag=-v/u; imageH=objH*mag; }
        if(mode==="concave") imageX=mirrorX-v;
        else imageX=mirrorX+Math.abs(v);
      }

      ctx.fillStyle="#40c840"; ctx.strokeStyle="#40c840"; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(objX,midY); ctx.lineTo(objX,midY-objH); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(objX,midY-objH); ctx.lineTo(objX-5,midY-objH+10);
      ctx.lineTo(objX+5,midY-objH+10); ctx.closePath(); ctx.fill();

      if(Math.abs(imageX)<W*2 && Math.abs(imageH)<H*2){
        ctx.fillStyle="rgba(200,60,60,.8)"; ctx.strokeStyle="rgba(200,60,60,.8)"; ctx.lineWidth=2;
        const ih=clamp(imageH,-H*.8,H*.8);
        ctx.beginPath(); ctx.moveTo(imageX,midY);
        ctx.lineTo(imageX,ih<0?midY+Math.abs(ih):midY-ih); ctx.stroke();
        ctx.beginPath();
        const tipY=ih<0?midY+Math.abs(ih):midY-ih;
        ctx.moveTo(imageX,tipY); ctx.lineTo(imageX-5,tipY+(ih<0?-10:10));
        ctx.lineTo(imageX+5,tipY+(ih<0?-10:10)); ctx.closePath(); ctx.fill();
      }
      if(mode!=="plane"){
        const focX=mode==="concave"?mirrorX-Math.abs(f):mirrorX+Math.abs(f);
        ctx.beginPath(); ctx.arc(focX,midY,6,0,Math.PI*2);
        ctx.fillStyle="#f0d040"; ctx.fill();
        ctx.fillStyle="rgba(240,208,64,.5)"; ctx.font="11px 'Source Sans 3'"; ctx.textAlign="center";
        ctx.fillText("F",focX,midY-12);
        if(mode==="concave"){
          const centX=mirrorX-Math.abs(f)*2;
          ctx.beginPath(); ctx.arc(centX,midY,5,0,Math.PI*2);
          ctx.fillStyle="#c060c0"; ctx.fill();
          ctx.fillStyle="rgba(192,96,192,.5)"; ctx.fillText("C",centX,midY-12);
        }
      }
      ctx.fillStyle="rgba(200,220,255,.4)"; ctx.font="11px 'JetBrains Mono'"; ctx.textAlign="left";
      ctx.fillText(`u = ${(mirrorX-objX).toFixed(0)} px`,10,18);
      if(mode!=="plane") ctx.fillText(`v = ${v.toFixed(0)} px  m = ${(imageH/objH).toFixed(2)}`,10,34);
    };
    animRef.current=requestAnimationFrame(loop);
    return ()=>cancelAnimationFrame(animRef.current);
  },[canvasRef,params]);
  return {};
}

/* ─────────────────────────────────────────────
   UNIVERSE
───────────────────────────────────────────── */
function useUniverse(canvasRef, params, running) {
  const state  = useRef({ bodies:[], trails:[] });
  const animRef = useRef();
  const G=3000;
  let dragStart=null;

  const spawnRandom=(n=5)=>{
    const c=canvasRef.current; if(!c) return;
    const W=c.width,H=c.height;
    for(let i=0;i<n;i++){
      const r=4+Math.random()*8;
      state.current.bodies.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-0.5)*10,vy:(Math.random()-0.5)*10,mass:r*10,radius:r,blackhole:false,color:`hsl(${Math.random()*360},70%,65%)`});
    }
  };
  const spawnBlackhole=()=>{
    const c=canvasRef.current; if(!c) return;
    state.current.bodies.push({x:c.width/2,y:c.height/2,vx:0,vy:0,mass:5000,radius:18,blackhole:true,color:"#c840c8"});
  };
  const clearAll=()=>{ state.current.bodies=[]; state.current.trails=[]; };

  const onMouseDown=(e)=>{
    const canvas=canvasRef.current; if(!canvas) return;
    const r=canvas.getBoundingClientRect();
    dragStart={x:(e.clientX-r.left)*(canvas.width/r.width),y:(e.clientY-r.top)*(canvas.height/r.height)};
  };
  const onMouseUp=(e)=>{
    if(!dragStart||!canvasRef.current) return;
    const canvas=canvasRef.current;
    const r=canvas.getBoundingClientRect();
    const ex=(e.clientX-r.left)*(canvas.width/r.width),ey=(e.clientY-r.top)*(canvas.height/r.height);
    const sz=params.current.planetSize??6;
    state.current.bodies.push({x:dragStart.x,y:dragStart.y,vx:(dragStart.x-ex)*0.4,vy:(dragStart.y-ey)*0.4,mass:sz*10,radius:sz,blackhole:false,color:`hsl(${Math.random()*360},70%,65%)`});
    dragStart=null;
  };

  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d");
    const W=canvas.width,H=canvas.height;
    let last=performance.now();
    canvas.addEventListener("mousedown",onMouseDown);
    canvas.addEventListener("mouseup",onMouseUp);

    const loop=(now)=>{
      animRef.current=requestAnimationFrame(loop);
      const dt=Math.min((now-last)/1000,.033); last=now;
      const s=state.current;

      if(running.current){
        for(let i=0;i<s.bodies.length;i++){
          for(let j=0;j<s.bodies.length;j++){
            if(i===j) continue;
            const a=s.bodies[i],b2=s.bodies[j];
            const dx=b2.x-a.x,dy=b2.y-a.y;
            const d=Math.sqrt(dx*dx+dy*dy)+1;
            a.vx+=dx/d*(G*b2.mass/(d*d))*dt;
            a.vy+=dy/d*(G*b2.mass/(d*d))*dt;
          }
        }
        for(const b of s.bodies){
          b.x+=b.vx*dt; b.y+=b.vy*dt;
          s.trails.push({x:b.x,y:b.y,a:0.6});
        }
        if(s.trails.length>3000) s.trails.splice(0,500);
      }

      ctx.fillStyle="rgba(5,5,20,.18)"; ctx.fillRect(0,0,W,H);
      for(const t of s.trails){
        ctx.beginPath(); ctx.arc(t.x,t.y,1,0,Math.PI*2);
        ctx.fillStyle=`rgba(160,160,255,${t.a*0.25})`; ctx.fill();
      }
      for(const b of s.bodies){
        if(b.blackhole){
          const g2=ctx.createRadialGradient(b.x,b.y,2,b.x,b.y,b.radius*3);
          g2.addColorStop(0,"rgba(220,60,220,1)"); g2.addColorStop(1,"rgba(80,0,80,.0)");
          ctx.beginPath(); ctx.arc(b.x,b.y,b.radius*3,0,Math.PI*2); ctx.fillStyle=g2; ctx.fill();
          ctx.beginPath(); ctx.arc(b.x,b.y,b.radius,0,Math.PI*2); ctx.fillStyle="#080010"; ctx.fill();
        } else {
          const g2=ctx.createRadialGradient(b.x-b.radius*.3,b.y-b.radius*.3,1,b.x,b.y,b.radius);
          g2.addColorStop(0,"rgba(255,255,255,.6)"); g2.addColorStop(.4,b.color); g2.addColorStop(1,"rgba(0,0,0,.5)");
          ctx.beginPath(); ctx.arc(b.x,b.y,b.radius,0,Math.PI*2); ctx.fillStyle=g2; ctx.fill();
        }
      }
      ctx.fillStyle="rgba(160,160,220,.5)"; ctx.font="11px 'JetBrains Mono'"; ctx.textAlign="left";
      ctx.fillText(`bodies: ${s.bodies.length}`,10,18);
    };
    animRef.current=requestAnimationFrame(loop);
    return ()=>{ cancelAnimationFrame(animRef.current); canvas.removeEventListener("mousedown",onMouseDown); canvas.removeEventListener("mouseup",onMouseUp); };
  },[canvasRef,params,running]);
  return { spawnRandom, spawnBlackhole, clearAll };
}

/* ─────────────────────────────────────────────
   SANDBOX  — preview canvas only
───────────────────────────────────────────── */
function useSandbox(canvasRef) {
  const animRef = useRef();
  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d");
    const W=canvas.width,H=canvas.height;
    let t=0;

    const loop=()=>{
      animRef.current=requestAnimationFrame(loop);
      t+=0.012;
      ctx.clearRect(0,0,W,H);
      const bg=ctx.createLinearGradient(0,0,W,H);
      bg.addColorStop(0,"#0d1117"); bg.addColorStop(1,"#1a1f2e");
      ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);

      for(let x=40;x<W;x+=60){
        for(let y=40;y<H;y+=60){
          const pulse=0.3+0.2*Math.sin(t+x*.02+y*.02);
          ctx.beginPath(); ctx.arc(x,y,2,0,Math.PI*2);
          ctx.fillStyle=`rgba(74,124,158,${pulse})`; ctx.fill();
        }
      }
      ctx.fillStyle="rgba(200,121,58,.6)"; ctx.font="bold 18px 'Playfair Display'"; ctx.textAlign="center";
      ctx.fillText("Free-form Sandbox",W/2,H/2-16);
      ctx.fillStyle="rgba(255,255,255,.25)"; ctx.font="13px 'Source Sans 3'";
      ctx.fillText("Launch native SFML window to use the sandbox",W/2,H/2+14);
    };
    animRef.current=requestAnimationFrame(loop);
    return ()=>cancelAnimationFrame(animRef.current);
  },[canvasRef]);
  return {};
}

/* ─────────────────────────────────────────────
   SIMULATION PAGE WRAPPER
───────────────────────────────────────────── */
function SimPage({ id }) {
  const canvasRef = useRef();
  const params    = useRef({});
  const running   = useRef(true);
  const [paused, setPaused]             = useState(false);
  const [electronAvail, setElectronAvail] = useState(false);
  useEffect(() => {
  if (window.electronAPI) {
    setElectronAvail(true);
    return;
  }

  let tries = 0;
  const interval = setInterval(() => {
    if (window.electronAPI) {
      setElectronAvail(true);
      clearInterval(interval);
    }
    tries++;
    if (tries > 20) clearInterval(interval);
  }, 100);

  return () => clearInterval(interval);
}, []);
  const [nativeLaunched, setNativeLaunched] = useState(false);
  const [launchError, setLaunchError]   = useState(null);
  const [launching, setLaunching]       = useState(false);
  const [tick, setTick]                 = useState(0);
  const rerender = () => setTick(t=>t+1);

  const togglePause = () => { running.current = !running.current; setPaused(!running.current); };
  const setParam = (k,v) => { params.current[k]=v; rerender(); };

  // ── Launch native C++ exe via Electron IPC ──────────────────────────────
  // FIXED: now awaits the IPC result before updating UI state.
  // execName = e.g. "Boid" — matches SIM_EXECUTABLE[id] and main.js SIM_EXES keys.
  const launchNative = useCallback(async () => {
    const execName = SIM_EXECUTABLE[id];
    if (!electronAvail || !execName || !window.electronAPI?.launchSim) return;

    setLaunching(true);
    setLaunchError(null);

    try {
      const result = await window.electronAPI.launchSim(execName);
      if (result?.ok) {
        setNativeLaunched(true);
        console.log(`Launched ${execName} — pid: ${result.pid}`);
      } else {
        const msg = result?.error || "Unknown error launching sim";
        setLaunchError(msg);
        console.error("Launch failed:", msg);
      }
    } catch (err) {
      const msg = `IPC error: ${err.message}`;
      setLaunchError(msg);
      console.error(msg);
    } finally {
      setLaunching(false);
    }
  }, [id, electronAvail]);

  // --- all simulation hooks (unconditional) ---
  const ballSim     = useBall(canvasRef, params, running);
  const boidSim     = useBoid(canvasRef, params, running);
  const fricSim     = useFriction(canvasRef, params, running);
  const pulleySim   = usePulley(canvasRef, params, running);
  const oscillSim   = useOscillation(canvasRef, params, running);
  const waveSim     = useWave(canvasRef, params, running);
  const electricSim = useElectric(canvasRef, params, running);
  const magnetSim   = useMagnetic(canvasRef);
  const lightSim    = useLightSim(canvasRef, params); // eslint-disable-line no-unused-vars
  const universeSim = useUniverse(canvasRef, params, running);
  const sandboxSim  = useSandbox(canvasRef); // eslint-disable-line no-unused-vars

  // Canvas click / right-click
  const handleCanvasClick = useCallback((e) => {
    const canvas=canvasRef.current; if(!canvas) return;
    const r=canvas.getBoundingClientRect();
    const x=(e.clientX-r.left)*(canvas.width/r.width);
    const y=(e.clientY-r.top)*(canvas.height/r.height);
    e.preventDefault();
    if(id==="ball")     ballSim.spawnBall(x,y);
    if(id==="wave")     waveSim.addSource(x,y);
    if(id==="electric"){ if(e.button===2) electricSim.addCharge(x,y,-500); else electricSim.addCharge(x,y,500); }
    if(id==="magnetic"){ if(e.button===2) magnetSim.addMagnet(x,y,-1);    else magnetSim.addMagnet(x,y,1); }
  },[id,ballSim,waveSim,electricSim,magnetSim]);

  // Canvas dimensions
  const canvasDims = ({
    ball:        {w:720,h:540},
    boid:        {w:720,h:540},
    friction:    {w:720,h:440},
    pulley:      {w:480,h:540},
    oscillation: {w:720,h:380},
    sandbox:     {w:720,h:440},
    wave:        {w:680,h:540},
    electric:    {w:720,h:520},
    magnetic:    {w:720,h:520},
    light:       {w:720,h:480},
    universe:    {w:720,h:540},
  })[id] || {w:720,h:540};

  // Set param defaults on mount
  useEffect(()=>{
    const defaults = {
      ball:        {gravity:1,restitution:.7},
      boid:        {maxSpeed:100,separation:25,alignment:50,cohesion:50},
      friction:    {angle:25,mass:5,mu:0.3},
      pulley:      {m1:5,m2:3,gravity:9.81},
      oscillation: {stiffness:4,mass:2,friction:0.01,damping:0.2},
      sandbox:     {},
      wave:        {amplitude:2,frequency:3,waveSpeed:0.04,damping:0.002},
      electric:    {particleCharge:1,particleMass:1},
      magnetic:    {},
      light:       {mirrorMode:"concave",objectX:200,objectHeight:100,focalLength:200},
      universe:    {planetSize:6},
    };
    Object.assign(params.current, defaults[id]||{});
    running.current=true;
    setPaused(false);
    setNativeLaunched(false);
    setLaunchError(null);
  },[id]);

  const isNativeSim = id==="sandbox";

  // ── Per-sim right panel ──
  const panels = {
    ball: (<>
      <div className="ps-panel-section"><h3>Parameters</h3>
        <SliderField label="Gravity"      min={0} max={4}  step={0.1}  defVal={1}   paramKey="gravity"      setParam={setParam} params={params}/>
        <SliderField label="Restitution"  min={0} max={1}  step={0.05} defVal={0.7} paramKey="restitution"  setParam={setParam} params={params}/>
      </div>
      <div className="ps-panel-section"><h3>Actions</h3>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          <button className="ps-btn primary sm" onClick={()=>ballSim.spawnBall(360,200)}>+ Ball</button>
          <button className="ps-btn danger sm"  onClick={ballSim.clear}>Clear</button>
        </div>
      </div>
      <div className="ps-hint"><strong>Click</strong> canvas to spawn a ball at cursor. Balls collide with each other and walls.</div>
    </>),

    boid: (<>
      <div className="ps-panel-section"><h3>Flocking Rules</h3>
        <SliderField label="Max Speed"         min={20}  max={250} step={5}  defVal={100} paramKey="maxSpeed"   setParam={setParam} params={params}/>
        <SliderField label="Separation Radius" min={10}  max={60}  step={1}  defVal={25}  paramKey="separation" setParam={setParam} params={params}/>
        <SliderField label="Alignment Radius"  min={20}  max={100} step={5}  defVal={50}  paramKey="alignment"  setParam={setParam} params={params}/>
        <SliderField label="Cohesion Radius"   min={20}  max={100} step={5}  defVal={50}  paramKey="cohesion"   setParam={setParam} params={params}/>
      </div>
      <div className="ps-panel-section"><h3>Actions</h3>
        <div style={{display:"flex",gap:6}}>
          <button className="ps-btn primary sm" onClick={()=>boidSim.init(80)}>Reset (80)</button>
          <button className="ps-btn sm"         onClick={()=>boidSim.init(200)}>200 Boids</button>
        </div>
      </div>
      <div className="ps-hint">Uses <strong>Reynolds flocking rules</strong>: separation avoids crowding, alignment steers with neighbours, cohesion moves toward centre.<br/><br/>Algorithm lives in <code style={{fontFamily:"var(--mono)",fontSize:11}}>boidsAlgorithm.cpp</code></div>
    </>),

    friction: (<>
      <div className="ps-panel-section"><h3>Ramp Parameters</h3>
        <SliderField label="Angle (°)"    min={-60} max={60}  step={1}    defVal={25}  paramKey="angle"  setParam={setParam} params={params}/>
        <SliderField label="Mass (kg)"    min={0.5} max={20}  step={0.5}  defVal={5}   paramKey="mass"   setParam={setParam} params={params}/>
        <SliderField label="μ (friction)" min={0}   max={1}   step={0.01} defVal={0.3} paramKey="mu"     setParam={setParam} params={params}/>
      </div>
      <div className="ps-panel-section"><h3>Live Forces</h3>
        <div className="ps-stats">
          {["Gravity","Normal","Friction","Net"].map(l=>(
            <div key={l} className="ps-stat">
              <div className="label">{l}</div>
              <div className="value">{computeFrictionForce(l,params.current)}</div>
            </div>
          ))}
        </div>
      </div>
      <button className="ps-btn primary" onClick={fricSim.reset}>↺ Reset Block</button>
      <div className="ps-hint"><strong>Arrows:</strong> Yellow=gravity, Green=normal, Blue=friction. Adjust μ for static vs kinetic effects.</div>
    </>),

    pulley: (<>
      <div className="ps-panel-section"><h3>Masses & Gravity</h3>
        <SliderField label="Mass 1 (kg)"    min={1}  max={20} step={0.5} defVal={5}    paramKey="m1"      setParam={setParam} params={params}/>
        <SliderField label="Mass 2 (kg)"    min={1}  max={20} step={0.5} defVal={3}    paramKey="m2"      setParam={setParam} params={params}/>
        <SliderField label="Gravity (m/s²)" min={1}  max={25} step={0.5} defVal={9.81} paramKey="gravity" setParam={setParam} params={params}/>
      </div>
      <div className="ps-panel-section"><h3>Computed Values</h3>
        <div className="ps-stats">
          {[["Accel","_accel"],["T₁ (N)","_T1"],["T₂ (N)","_T2"]].map(([l,k])=>(
            <div key={l} className="ps-stat">
              <div className="label">{l}</div>
              <div className="value">{fmt(params.current[k]??0,3)}</div>
            </div>
          ))}
        </div>
      </div>
      <button className="ps-btn primary" onClick={pulleySim.reset}>↺ Reset</button>
      <div className="ps-hint">Pulley has rotational inertia I = ½mr².<br/>a = (m₁−m₂)g / (m₁+m₂+I/r²)</div>
    </>),

    oscillation: (<>
      <div className="ps-panel-section"><h3>Spring Parameters</h3>
        <SliderField label="Stiffness k" min={0.5} max={20}  step={0.5}  defVal={4}   paramKey="stiffness" setParam={setParam} params={params}/>
        <SliderField label="Mass (kg)"   min={0.5} max={10}  step={0.5}  defVal={2}   paramKey="mass"      setParam={setParam} params={params}/>
        <SliderField label="Damping ζ"   min={0}   max={2}   step={0.05} defVal={0.2} paramKey="damping"   setParam={setParam} params={params}/>
        <SliderField label="Friction"    min={0}   max={0.2} step={0.005}defVal={0.01}paramKey="friction"  setParam={setParam} params={params}/>
      </div>
      <button className="ps-btn primary" onClick={oscillSim.reset}>↺ Reset to Rest</button>
      <div className="ps-hint"><strong>Drag</strong> the block to stretch/compress the spring.<br/>ζ&lt;1 underdamped · ζ=1 critical · ζ&gt;1 overdamped</div>
    </>),

    sandbox: (<>
      <div className="ps-panel-section"><h3>Sandbox</h3>
        <div className="ps-hint" style={{marginBottom:0}}>
          The sandbox is a <strong>free-form</strong> environment implemented in <code style={{fontFamily:"var(--mono)",fontSize:11}}>Sandbox.cpp</code>.<br/><br/>
          Launch the native SFML window for full interaction.
        </div>
      </div>
      <div className="ps-panel-section"><h3>Launch</h3>
        {electronAvail ? (
          <button className="ps-btn launch" onClick={launchNative} disabled={launching}>
            {launching ? "Launching…" : nativeLaunched ? "Re-launch native" : "⚡ Open Sandbox (native)"}
          </button>
        ) : (
          <div className="ps-hint">
            Native launch requires the <strong>Electron desktop app</strong>.<br/>
            Run via <code style={{fontFamily:"var(--mono)",fontSize:11}}>npm run dev</code> from the <code style={{fontFamily:"var(--mono)",fontSize:11}}>ui/</code> directory.
          </div>
        )}
        {launchError && (
          <div style={{fontSize:11,color:"var(--red)",fontFamily:"var(--mono)",marginTop:6,wordBreak:"break-all"}}>
            ✕ {launchError}
          </div>
        )}
      </div>
    </>),

    wave: (<>
      <div className="ps-panel-section"><h3>Wave Parameters</h3>
        <SliderField label="Amplitude"   min={0.2}  max={6}    step={0.2}   defVal={2}     paramKey="amplitude"  setParam={setParam} params={params}/>
        <SliderField label="Frequency"   min={0.5}  max={10}   step={0.3}   defVal={3}     paramKey="frequency"  setParam={setParam} params={params}/>
        <SliderField label="Wave Speed"  min={0.005}max={0.12}  step={0.005} defVal={0.04}  paramKey="waveSpeed"  setParam={setParam} params={params}/>
        <SliderField label="Damping"     min={0}    max={0.01} step={0.0005} defVal={0.002} paramKey="damping"    setParam={setParam} params={params}/>
      </div>
      <div className="ps-panel-section"><h3>Sources</h3>
        <div style={{display:"flex",gap:6}}>
          <button className="ps-btn sm" onClick={()=>{waveSim.addSource(200,270);waveSim.addSource(520,270);}}>Add 2 Sources</button>
          <button className="ps-btn danger sm" onClick={waveSim.clear}>Clear</button>
        </div>
      </div>
      <div className="ps-hint"><strong>Click</strong> canvas to add point sources. Red=crest · Blue=trough. Interference from superposition.</div>
    </>),

    electric: (<>
      <div className="ps-panel-section"><h3>Particle Properties</h3>
        <SliderField label="Particle Charge" min={0.1} max={5} step={0.1} defVal={1} paramKey="particleCharge" setParam={setParam} params={params}/>
        <SliderField label="Particle Mass"   min={0.1} max={5} step={0.1} defVal={1} paramKey="particleMass"   setParam={setParam} params={params}/>
      </div>
      <div className="ps-panel-section"><h3>Actions</h3>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          <button className="ps-btn primary sm" onClick={electricSim.addParticle}>+ Particle</button>
          <button className="ps-btn sm" onClick={()=>electricSim.addCharge(300,260,500)}>+ Charge</button>
          <button className="ps-btn danger sm" onClick={()=>{electricSim.clearCharges();electricSim.clearParticles();}}>Clear All</button>
        </div>
      </div>
      <div className="ps-hint"><strong>Left-click</strong> = +charge (red). <strong>Right-click</strong> = −charge (blue). K = 9000 N·m²/C²</div>
    </>),

    magnetic: (<>
      <div className="ps-panel-section"><h3>Actions</h3>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          <button className="ps-btn primary sm" onClick={()=>magnetSim.addMagnet(300,260,1)}>+ N Pole</button>
          <button className="ps-btn sm"         onClick={()=>magnetSim.addMagnet(480,260,-1)}>+ S Pole</button>
          <button className="ps-btn danger sm"  onClick={magnetSim.clearMagnets}>Clear</button>
        </div>
      </div>
      <div className="ps-hint"><strong>Left-click</strong> = North (red). <strong>Right-click</strong> = South (blue). Green arrows show field direction and magnitude.</div>
    </>),

    light: (<>
      <div className="ps-panel-section"><h3>Mirror Type</h3>
        <div className="ps-tabs">
          {["plane","concave","convex"].map(m=>(
            <button key={m} className={`ps-tab ${(params.current.mirrorMode??"concave")===m?"active":""}`}
              onClick={()=>setParam("mirrorMode",m)}>
              {m.charAt(0).toUpperCase()+m.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="ps-panel-section"><h3>Object & Optics</h3>
        <SliderField label="Object Position" min={50}  max={450} step={5}  defVal={200} paramKey="objectX"      setParam={setParam} params={params}/>
        <SliderField label="Object Height"   min={20}  max={200} step={5}  defVal={100} paramKey="objectHeight" setParam={setParam} params={params}/>
        {(params.current.mirrorMode??"concave")!=="plane" && (
          <SliderField label="Focal Length" min={50} max={350} step={10} defVal={200} paramKey="focalLength" setParam={setParam} params={params}/>
        )}
      </div>
      <div className="ps-hint">Green=object · Red=image · Yellow=focus F · Purple=centre C.<br/>Mirror formula: 1/v + 1/u = 1/f</div>
    </>),

    universe: (<>
      <div className="ps-panel-section"><h3>Planet Size</h3>
        <SliderField label="Drag Size" min={2} max={25} step={1} defVal={6} paramKey="planetSize" setParam={setParam} params={params}/>
      </div>
      <div className="ps-panel-section"><h3>Actions</h3>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          <button className="ps-btn primary sm" onClick={()=>universeSim.spawnRandom(5)}>+ 5 Bodies</button>
          <button className="ps-btn sm" style={{background:"rgba(200,64,200,.1)",borderColor:"#c840c8",color:"#c840c8"}} onClick={universeSim.spawnBlackhole}>☉ Black Hole</button>
          <button className="ps-btn danger sm" onClick={universeSim.clearAll}>Clear</button>
        </div>
      </div>
      <div className="ps-hint"><strong>Drag</strong> to launch body — velocity = drag vector. G = 3000. F = Gm₁m₂/r²</div>
    </>),
  };

  const sim = SIMS.find(s=>s.id===id);

  return (
    <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden"}}>
      <div className="ps-header">
        <div>
          <div className="ps-header-title">{sim?.icon} {sim?.label}</div>
          <div className="ps-header-sub">{sim?.desc}</div>
        </div>
        <div className="ps-controls-bar">
          {/* Running status */}
          <div className={`ps-status ${isNativeSim&&electronAvail?"native":paused?"paused":""}`}>
            <span className="dot"/>
            {isNativeSim&&electronAvail ? "Native" : paused ? "Paused" : "Running"}
          </div>

          {/* Pause/Resume — not shown for sandbox */}
          {!isNativeSim && (
            <button className="ps-btn" onClick={togglePause}>
              {paused?"▶ Resume":"⏸ Pause"}
            </button>
          )}

          {/* Launch native — shown for all sims when Electron is available */}
          {electronAvail && (
            <button
              className="ps-btn launch"
              onClick={launchNative}
              disabled={launching}
              title={`Launch ${SIM_EXECUTABLE[id]}.exe (SFML)`}
            >
              {launching ? "Launching…" : nativeLaunched ? "Re-launch native" : "⚡ Launch native"}
            </button>
          )}
        </div>
      </div>

      <div className="ps-sim-wrap">
        <div className="ps-canvas-area">
          <canvas
            ref={canvasRef}
            width={canvasDims.w}
            height={canvasDims.h}
            style={{cursor:"crosshair"}}
            onClick={handleCanvasClick}
            onContextMenu={handleCanvasClick}
          />

          {/* Success overlay — only shown after confirmed launch */}
          {nativeLaunched && electronAvail && !isNativeSim && (
            <div className="ps-electron-overlay" style={{pointerEvents:"none"}}>
              <div className="ps-electron-badge">⚡ SFML window open</div>
              <p>Native C++ simulation is running.<br/>This canvas remains as parameter preview.</p>
            </div>
          )}

          {/* Error overlay */}
          {launchError && !nativeLaunched && (
            <div className="ps-electron-overlay" style={{pointerEvents:"none"}}>
              <div className="ps-electron-error">✕ Launch failed</div>
              <p style={{color:"rgba(255,120,120,.8)"}}>{launchError}</p>
            </div>
          )}
        </div>
        <div className="ps-panel">
          {panels[id]}
          <div style={{marginTop:"auto",paddingTop:12,borderTop:"1px solid var(--paper3)"}}>
            <div style={{fontSize:11,color:"var(--ink3)",fontFamily:"var(--mono)"}}>
              {id==="boid"
                ? <>boid_main.cpp<br/>Boid.cpp · boidsAlgorithm.cpp</>
                : <>{id}_main.cpp · {id.charAt(0).toUpperCase()+id.slice(1)}.cpp</>
              }
              {id==="electric" && <><br/>Electric_Field.cpp</>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SLIDER FIELD COMPONENT
───────────────────────────────────────────── */
function SliderField({label,min,max,step,defVal,paramKey,setParam,params}) {
  const [val,setVal] = useState(defVal);
  useEffect(()=>{ params.current[paramKey]=defVal; },[]);
  return (
    <div className="ps-field">
      <label>{label}<span>{val}</span></label>
      <input type="range" className="ps-slider" min={min} max={max} step={step} value={val}
        onChange={e=>{const v=parseFloat(e.target.value);setVal(v);setParam(paramKey,v);}}/>
    </div>
  );
}

function computeFrictionForce(type,p){
  const m=p.mass??5, mu=p.mu??0.3, a=(p.angle??25)*Math.PI/180, g=9.81;
  const grav=m*g, normal=m*g*Math.cos(a), fric=mu*normal, gPar=m*g*Math.sin(a);
  const map={Gravity:grav,Normal:normal,Friction:fric,Net:Math.abs(gPar-fric)};
  return fmt(map[type]??0,1)+" N";
}

/* ─────────────────────────────────────────────
   HOME DASHBOARD
───────────────────────────────────────────── */
function Home({onNav}) {
  const sims = SIMS.filter(s=>s.id!=="home");
  const sections = [
    {key:"mechanics",label:"Classical Mechanics"},
    {key:"fields",   label:"Fields & Waves"},
    {key:"optics",   label:"Optics"},
    {key:"gravity",  label:"Gravity"},
  ];
  return (
    <div className="ps-home">
      <div className="ps-home-hero">
        <h2>Interactive <em>Physics</em><br/>Simulator</h2>
        <p>
          React canvas previews for all C++ SFML simulations.
          Each module maps directly to a compiled executable in <code style={{fontFamily:"var(--mono)",fontSize:12,background:"var(--paper3)",padding:"1px 5px",borderRadius:4}}>build/</code>.
          {isElectron() && <strong style={{color:"var(--accent2)"}}> ⚡ Electron detected — native launch is available.</strong>}
        </p>
      </div>
      {sections.map(sec=>{
        const items=sims.filter(s=>s.section===sec.key);
        if(!items.length) return null;
        return (
          <div key={sec.key} style={{marginBottom:28}}>
            <div style={{fontFamily:"var(--serif)",fontSize:13,fontWeight:600,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:12,borderBottom:"1px solid var(--paper3)",paddingBottom:6}}>
              {sec.label}
            </div>
            <div className="ps-grid">
              {items.map(sim=>(
                <div key={sim.id} className={`ps-card ${sim.accent}`} onClick={()=>onNav(sim.id)}>
                  <div className="card-icon">{sim.icon}</div>
                  <h3>{sim.label}</h3>
                  <p>{sim.desc}</p>
                  <span className="card-tag" style={{background:sim.tagBg,color:sim.tagColor}}>
                    {sim.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
export default function App() {
  const [active, setActive]           = useState("home");
  const [cssInjected, setCssInjected] = useState(false);

  useEffect(()=>{
    if(cssInjected) return;
    const style=document.createElement("style");
    style.textContent=GLOBAL_CSS;
    document.head.appendChild(style);
    setCssInjected(true);
  },[cssInjected]);

  // ── Electron-aware nav handler ──────────────────────────────────────────
  // NOTE: Navigation just switches the React view. The actual launch happens
  // only when the user explicitly clicks "Launch native" in the SimPage header.
  // We do NOT auto-launch on nav click to avoid spawning multiple processes.
  const handleNavClick = (simId) => {
    setActive(simId);
  };

  const sections = [
    {key:"main",     label:null},
    {key:"mechanics",label:"Mechanics"},
    {key:"fields",   label:"Fields & Waves"},
    {key:"optics",   label:"Optics"},
    {key:"gravity",  label:"Gravity"},
  ];

  return (
    <div className="ps-root">
      {/* Sidebar */}
      <aside className="ps-sidebar">
        <div className="ps-logo">
          <h1>Physics<br/><span>Simulator</span></h1>
          <p>Interactive Lab</p>
        </div>
        {sections.map(sec=>(
          <div key={sec.key}>
            {sec.label && <div className="ps-section-label">{sec.label}</div>}
            {SIMS.filter(s=>s.section===sec.key).map(s=>(
              <button key={s.id}
                className={`ps-nav-btn ${active===s.id?"active":""}`}
                onClick={()=>handleNavClick(s.id)}
              >
                <span className="icon">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        ))}
        <div style={{marginTop:"auto",padding:"16px 20px 20px",borderTop:"1px solid var(--ink2)"}}>
          <div style={{fontSize:10,color:"var(--ink3)",lineHeight:1.5}}>
            C++ SFML → React Canvas<br/>
            <span style={{color:"var(--accent)",fontFamily:"var(--mono)"}}>v1.0.0</span>
            {isElectron() && (
              <div style={{marginTop:4,color:"var(--accent2)"}}>⚡ Electron desktop</div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ps-main">
        {active==="home"
          ? <Home onNav={handleNavClick}/>
          : <SimPage key={active} id={active}/>
        }
      </main>
    </div>
  );
}