// p5.js Visual für Startseite - Optimiert für schnelles Laden
// Farbe
const DOT = "#0013E6";
const BG  = "transparent";

// Abstände kompakter - skaliert für 140x140px Canvas (70% der Originalgröße)
const innerGap = 24.5;   // Mitte
const R1 = 31.5;         // Ring 1
const R2 = 49;           // Ring 2

// Größen - skaliert
const S_CENTER = 15.4;
const S_R1     = 11.2;
const S_R2     = 8.4;

// Animation
const BREATH   = 0.15;   // +-8% Größenatmung
const NOISE_S  = 0.25;   // Geschwindigkeit
const WOBBLE   = 1.05;   // px - angepasst für 140px Canvas

let t0;
let canvas;

function setup(){
  const container = document.getElementById('sketchContainer');
  if (!container) return;
  
  // Responsive canvas size
  const isMobile = window.innerWidth <= 480;
  const canvasSize = isMobile ? 110 : 140;
  
  canvas = createCanvas(canvasSize, canvasSize);
  canvas.parent('sketchContainer');
  noStroke();
  t0 = millis();
}

function draw(){
  clear();
  const t = (millis()-t0)/1000;

  // Mittelpunkt leicht wabern
  const cx = width/2  + (noise(t*NOISE_S, 11)-0.5)*2*WOBBLE;
  const cy = height/2 + (noise(t*NOISE_S, 23)-0.5)*2*WOBBLE;

  fill(DOT);

  // ---- Mitte: 4 Kreise ----
  const bC = 1 + BREATH * sin(t*2.1);
  const off = innerGap/2;
  drawDot(cx - off, cy - off, S_CENTER * bC);
  drawDot(cx + off, cy - off, S_CENTER * bC);
  drawDot(cx - off, cy + off, S_CENTER * bC);
  drawDot(cx + off, cy + off, S_CENTER * bC);

  // ---- Ring 1: 12 Kreise
  // oben/unten: je 4 Kreise, die mittleren 2 fluchten mit den 2 inneren
  // links/rechts: je 2 Kreise, die mit den 2 inneren fluchten
  const b1 = 1 + BREATH * sin(t*2.0 + 1.1);
  const outerPad = innerGap*0.9; // Abstand der äußeren Randpunkte relativ zu den inneren

  // X-Positionen für oben/unten: vier Punkte, die mittleren bei ±off
  const rowX = [-(off+outerPad), -off, off, (off+outerPad)];

  // oben (y = +R1)
  rowX.forEach(x => drawDot(cx + x, cy + R1, S_R1 * b1));
  // unten (y = -R1)
  rowX.forEach(x => drawDot(cx + x, cy - R1, S_R1 * b1));

  // linke Spalte (x = -R1), nur zwei Punkte bei ±off
  [-off, off].forEach(y => drawDot(cx - R1, cy + y, S_R1 * b1));
  // rechte Spalte (x = +R1)
  [-off, off].forEach(y => drawDot(cx + R1, cy + y, S_R1 * b1));

  // ---- Ring 2: 8 Kreise ----
  const b2 = 1 + BREATH * sin(t*1.9 + 2.2);
  const mid = R1/3; 
  [-mid, mid].forEach(x => {
    drawDot(cx + x, cy + R2, S_R2 * b2);
    drawDot(cx + x, cy - R2, S_R2 * b2);
  });
  [-mid, mid].forEach(y => {
    drawDot(cx - R2, cy + y, S_R2 * b2);
    drawDot(cx + R2, cy + y, S_R2 * b2);
  });
}

function drawDot(x, y, d){
  circle(x, y, d);
}

function windowResized(){
  if (canvas) {
    const isMobile = window.innerWidth <= 480;
    const canvasSize = isMobile ? 110 : 140;
    resizeCanvas(canvasSize, canvasSize);
  }
}
