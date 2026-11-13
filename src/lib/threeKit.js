/* Shared three.js toolkit: brand colours, toy-like geometry builders and lights. */
import * as THREE from "three";

// Works with three r128 through current releases while keeping the same look
export const NEW_LIGHTS = parseInt(THREE.REVISION, 10) >= 155;
export const LI = (v) => (NEW_LIGHTS ? v * Math.PI : v);
if (THREE.ColorManagement) THREE.ColorManagement.enabled = false;

/* ---------- brand tokens used inside 3D (defined in brand.js, re-exported here) ---------- */
import { C, reducedMotion } from "./brand";
export { C, reducedMotion };

/* ---------- geometry helpers ---------- */
export function rrShape(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}
export function rBox(w, h, d, r = 0.12) {
  const b = Math.min(r, d / 2) * 0.6;
  const g = new THREE.ExtrudeGeometry(rrShape(w - 2 * b, h - 2 * b, Math.max(0.001, r - b)), {
    depth: Math.max(0.001, d - 2 * b), bevelEnabled: true, bevelSize: b,
    bevelThickness: b, bevelSegments: 3, curveSegments: 6,
  });
  g.center();
  return g;
}
export const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0, ...o });
export const mesh = (g, m, x = 0, y = 0, z = 0) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); return o; };
export const shadows = (obj) => obj.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });

export function makeCar(color = C.lime, scale = 1) {
  const g = new THREE.Group();
  g.add(mesh(rBox(1.7, 0.5, 0.95, 0.2), mat(color, { roughness: 0.45 }), 0, 0.42, 0));
  g.add(mesh(rBox(0.95, 0.42, 0.85, 0.17), mat(C.white), -0.12, 0.82, 0));
  g.add(mesh(rBox(0.99, 0.2, 0.89, 0.08), mat(0x2a3640, { roughness: 0.25 }), -0.12, 0.86, 0));
  const wheels = [];
  const wg = new THREE.CylinderGeometry(0.21, 0.21, 0.18, 20);
  const wm = mat(0x1d2226, { roughness: 0.8 });
  [[0.55, 0.45], [0.55, -0.45], [-0.55, 0.45], [-0.55, -0.45]].forEach(([x, z]) => {
    const w = mesh(wg, wm, x, 0.21, z); w.rotation.x = Math.PI / 2; g.add(w); wheels.push(w);
  });
  const lg = new THREE.SphereGeometry(0.07, 12, 12);
  const lm = mat(0xfff6c8, { emissive: 0xfff2a8, emissiveIntensity: 0.6 });
  g.add(mesh(lg, lm, 0.86, 0.48, 0.28)); g.add(mesh(lg, lm, 0.86, 0.48, -0.28));
  g.userData.wheels = wheels;
  g.scale.setScalar(scale);
  shadows(g);
  return g;
}
export function makeHouse(wall = C.white, roof = C.mid) {
  const g = new THREE.Group();
  g.add(mesh(rBox(0.8, 0.6, 0.8, 0.08), mat(wall), 0, 0.3, 0));
  const r = mesh(new THREE.ConeGeometry(0.66, 0.45, 4), mat(roof), 0, 0.82, 0);
  r.rotation.y = Math.PI / 4; g.add(r);
  g.add(mesh(rBox(0.2, 0.3, 0.05, 0.04), mat(C.ink), 0, 0.16, 0.41));
  shadows(g); return g;
}
export function makeTree(s = 1, leaf = C.tree, trunk = 0x8c7b6b) {
  const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.3, 8), mat(trunk), 0, 0.15, 0));
  g.add(mesh(new THREE.SphereGeometry(0.28, 16, 12), mat(leaf), 0, 0.48, 0));
  g.scale.setScalar(s); shadows(g); return g;
}
export function makeSchool(glass = 0xeefbc4) {
  const g = new THREE.Group();
  g.add(mesh(rBox(1.7, 0.95, 1.1, 0.1), mat(C.white), 0, 0.48, 0));
  g.add(mesh(rBox(1.85, 0.12, 1.25, 0.05), mat(C.ink), 0, 1.0, 0));
  g.add(mesh(rBox(0.5, 0.55, 0.5, 0.06), mat(C.white), 0, 1.33, 0));
  const clock = mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.05, 28), mat(C.lime), 0, 1.36, 0.27);
  clock.rotation.x = Math.PI / 2; g.add(clock);
  g.add(mesh(rBox(0.32, 0.45, 0.05, 0.04), mat(C.ink), 0, 0.23, 0.56));
  [-0.55, 0.55].forEach((x) => g.add(mesh(rBox(0.3, 0.26, 0.04, 0.04), mat(glass), x, 0.6, 0.56)));
  g.add(mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.7, 8), mat(C.mid), 0.7, 1.4, 0.3));
  const flag = mesh(rBox(0.32, 0.2, 0.02, 0.03), mat(C.lime), 0.87, 1.64, 0.3);
  g.add(flag); g.userData.flag = flag;
  shadows(g); return g;
}
/* community meeting point: a white plaza, a floating lime map pin and families gathered around it */
export function makeHub() {
  const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(1.08, 1.12, 0.1, 64), mat(C.ink, { roughness: 0.5 }), 0, 0.05, 0));
  g.add(mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.13, 64), mat(C.white, { roughness: 0.5 }), 0, 0.065, 0));
  const inlay = mesh(new THREE.TorusGeometry(0.74, 0.03, 10, 72), mat(C.lime, { emissive: C.lime, emissiveIntensity: 0.3 }), 0, 0.125, 0);
  inlay.rotation.x = Math.PI / 2; g.add(inlay);
  // soft contact shadow under the pin
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.5, 40), new THREE.MeshBasicMaterial({ color: C.ink, transparent: true, opacity: 0.22, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.13; g.add(shadow);
  // pulse ring on the plaza
  const pulse = new THREE.Mesh(new THREE.RingGeometry(0.3, 0.36, 48), new THREE.MeshBasicMaterial({ color: C.lime, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }));
  pulse.rotation.x = -Math.PI / 2; pulse.position.y = 0.135; g.add(pulse);
  // the pin: lime head + tapered point + white eye
  const pin = new THREE.Group();
  const lime = mat(C.lime, { roughness: 0.35, emissive: C.lime, emissiveIntensity: 0.12 });
  pin.add(mesh(new THREE.SphereGeometry(0.42, 40, 28), lime, 0, 0.62, 0));
  const tip = mesh(new THREE.ConeGeometry(0.36, 0.62, 40, 1, true), lime, 0, 0.18, 0);
  tip.rotation.x = Math.PI; pin.add(tip);
  const eye = mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.86, 32), mat(C.white, { roughness: 0.4 }), 0, 0.64, 0);
  eye.rotation.x = Math.PI / 2; pin.add(eye);
  pin.add(mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.88, 24), mat(C.ink), 0, 0.64, 0).rotateX(Math.PI / 2));
  pin.scale.setScalar(1.6); pin.position.y = 0.42; g.add(pin);
  // families gathered around the plaza
  const body = new THREE.CapsuleGeometry(0.075, 0.14, 6, 14), head = new THREE.SphereGeometry(0.07, 18, 14);
  const tones = [C.ink, C.white, C.lime, C.ink, C.white, C.lime];
  const sizes = [1, 0.72, 1, 0.75, 1, 0.7]; // adults and kids
  tones.forEach((c, i) => {
    const a = (i / 6) * Math.PI * 2 + 0.3, p = new THREE.Group(), m = mat(c, { roughness: 0.5 });
    p.add(mesh(body, m, 0, 0.15, 0), mesh(head, m, 0, 0.34, 0));
    p.scale.setScalar(sizes[i] * 1.35);
    p.position.set(Math.cos(a) * 0.86, 0.12, Math.sin(a) * 0.86); g.add(p);
  });
  g.userData = { pin, pulse, shadow };
  shadows(g); shadow.castShadow = false; pulse.castShadow = false;
  return g;
}

/* activity venues on the ring, each with a floating sign: "sports" (tennis + pool), "music", "school".
   Ink bases + deep greens so they stand out against the white disc. */
const DEEP = 0x3f5222, GRASS = 0x5e7330, WATER = 0x5fd0de;
function tennisCourt(white, ink) {
  const g = new THREE.Group();
  g.add(mesh(rBox(1.0, 0.04, 0.74, 0.03), mat(GRASS, { roughness: 0.8 }), 0, 0.02, 0));
  g.add(mesh(rBox(0.82, 0.02, 0.54, 0.02), mat(DEEP, { roughness: 0.8 }), 0, 0.04, 0));
  const line = (w, d, x, z) => g.add(mesh(new THREE.BoxGeometry(w, 0.012, d), white, x, 0.055, z));
  line(0.82, 0.022, 0, 0.27); line(0.82, 0.022, 0, -0.27); line(0.022, 0.56, 0.41, 0); line(0.022, 0.56, -0.41, 0);
  line(0.82, 0.018, 0, 0.19); line(0.82, 0.018, 0, -0.19); line(0.44, 0.018, 0, 0);
  line(0.018, 0.38, 0.22, 0); line(0.018, 0.38, -0.22, 0);
  g.add(mesh(new THREE.BoxGeometry(0.02, 0.14, 0.62), mat(C.ink, { transparent: true, opacity: 0.75 }), 0, 0.12, 0));
  g.add(mesh(new THREE.BoxGeometry(0.03, 0.022, 0.64), white, 0, 0.2, 0));
  return g;
}
function swimPool(white) {
  const g = new THREE.Group();
  g.add(mesh(rBox(0.86, 0.04, 0.6, 0.08), mat(WATER, { roughness: 0.08, metalness: 0.1, emissive: 0x2fb6c8, emissiveIntensity: 0.35 }), 0, 0.03, 0));
  [-0.1, 0.1].forEach((z) => g.add(mesh(new THREE.BoxGeometry(0.78, 0.012, 0.02), white, 0, 0.055, z)));
  const rail = new THREE.TorusGeometry(0.06, 0.013, 6, 16, Math.PI);
  [-0.05, 0.05].forEach((x) => { const r = mesh(rail, white, 0.44 + x, 0.07, -0.26); r.rotation.y = Math.PI / 2; g.add(r); });
  return g;
}
export function makeVenue(kind) {
  const g = new THREE.Group();
  const white = mat(C.white), ink = mat(C.ink, { roughness: 0.55 });
  const lime = mat(C.lime, { roughness: 0.4, emissive: C.lime, emissiveIntensity: 0.18 });
  const sign = new THREE.Group();
  if (kind === "sports") {
    // one sports centre: tennis court + pool side by side on an ink base
    g.add(mesh(rBox(2.15, 0.12, 0.92, 0.06), ink, 0, 0.06, 0));
    const court = tennisCourt(white, ink); court.position.set(-0.52, 0.12, 0); g.add(court);
    const pool = swimPool(white); pool.position.set(0.58, 0.12, 0); g.add(pool);
    // signs: racket over the court, swim ring over the pool
    const racket = new THREE.Group();
    const frame = mesh(new THREE.TorusGeometry(0.17, 0.028, 10, 40), lime, 0, 0.08, 0); frame.scale.set(1, 1.28, 1); racket.add(frame);
    for (let k = -2; k <= 2; k++) {
      racket.add(mesh(new THREE.BoxGeometry(0.008, 0.38, 0.008), white, k * 0.055, 0.08, 0));
      racket.add(mesh(new THREE.BoxGeometry(0.3, 0.008, 0.008), white, 0, 0.08 + k * 0.065, 0));
    }
    racket.add(mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.12, 8), lime, 0, -0.19, 0));
    racket.add(mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.2, 10), ink, 0, -0.34, 0));
    racket.add(mesh(new THREE.SphereGeometry(0.07, 18, 14), white, 0.22, -0.16, 0.04));
    racket.position.x = -0.42; racket.rotation.z = 0.25; sign.add(racket);
    const ring = new THREE.Group();
    ring.add(mesh(new THREE.TorusGeometry(0.17, 0.07, 14, 36), mat(WATER, { roughness: 0.4, emissive: 0x2fb6c8, emissiveIntensity: 0.2 })));
    for (let i = 0; i < 4; i++) {
      const band = mesh(new THREE.TorusGeometry(0.074, 0.016, 6, 16), white);
      const a = (i / 4) * Math.PI * 2; band.position.set(Math.cos(a) * 0.17, Math.sin(a) * 0.17, 0);
      band.rotation.y = Math.PI / 2; band.rotation.x = a; ring.add(band);
    }
    ring.position.x = 0.42; sign.add(ring);
    // racket sits over the court (left), ring over the pool (right); hover just above the flat centre
    racket.position.x = -0.36; ring.position.x = 0.38; g.userData.signY = 0.95;
  } else if (kind === "music") {
    g.add(mesh(rBox(1.1, 0.1, 0.85, 0.05), mat(GRASS), 0, 0.05, 0));
    g.add(mesh(rBox(0.98, 0.62, 0.72, 0.08), ink, 0, 0.41, 0));
    const roof = mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.02, 32, 1, false, 0, Math.PI), lime, 0, 0.72, 0);
    roof.rotation.z = Math.PI / 2; roof.rotation.y = Math.PI / 2; roof.scale.set(1, 1, 0.6); g.add(roof);
    g.add(mesh(rBox(0.24, 0.32, 0.05, 0.05), lime, 0, 0.26, 0.37));
    [-0.3, 0.3].forEach((x) => g.add(mesh(rBox(0.17, 0.17, 0.04, 0.04), white, x, 0.48, 0.37)));
    for (let k = 0; k < 7; k++) g.add(mesh(new THREE.BoxGeometry(0.06, 0.08, 0.03), k % 2 ? ink : white, -0.18 + k * 0.06, 0.5, 0.375));
    // round lime badge with an ink note on the front, above the door
    const badge = mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.04, 32), lime, 0, 0.62, 0.37); badge.rotation.x = Math.PI / 2; g.add(badge);
    const bh = mesh(new THREE.SphereGeometry(0.045, 14, 10), ink, -0.03, 0.57, 0.4); bh.scale.set(1.3, 1, 0.6); g.add(bh);
    g.add(mesh(new THREE.BoxGeometry(0.022, 0.16, 0.02), ink, 0.02, 0.645, 0.4));
    g.add(mesh(new THREE.BoxGeometry(0.07, 0.03, 0.02), ink, 0.05, 0.71, 0.4));
    // sign: a bold beamed double note (ink notes, lime beam), larger than the other signs
    [-0.16, 0.16].forEach((x, n) => {
      const head = mesh(new THREE.SphereGeometry(0.11, 22, 16), ink, x - 0.05, -0.24 + n * 0.06, 0);
      head.scale.set(1.4, 1, 0.75); head.rotation.z = 0.4; sign.add(head);
      sign.add(mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5 - n * 0.06, 10), ink, x + 0.08, 0.02 + n * 0.03, 0));
    });
    const beam = mesh(rBox(0.42, 0.1, 0.07, 0.03), lime, 0, 0.27, 0); beam.rotation.z = 0.14; sign.add(beam);
    const beamEdge = mesh(rBox(0.44, 0.12, 0.05, 0.03), ink, 0, 0.27, -0.02); beamEdge.rotation.z = 0.14; sign.add(beamEdge);
    g.userData.signScale = 1.55; g.userData.signY = 1.8;
  } else if (kind === "school") {
    g.add(mesh(rBox(1.45, 0.1, 0.95, 0.05), mat(GRASS), 0, 0.05, 0));
    const s = makeSchool(0xeefbc4); s.scale.setScalar(0.72); s.position.y = 0.1; g.add(s);
    g.userData.flag = s.userData.flag;
    g.userData.signY = 1.95;
    // sign: graduation cap
    sign.add(mesh(new THREE.BoxGeometry(0.46, 0.035, 0.46), ink, 0, 0.06, 0).rotateY(Math.PI / 4));
    sign.add(mesh(new THREE.CylinderGeometry(0.15, 0.17, 0.12, 24), ink, 0, -0.03, 0));
    sign.add(mesh(new THREE.SphereGeometry(0.03, 10, 8), lime, 0, 0.09, 0));
    sign.add(mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.2, 6), lime, 0.2, -0.02, 0));
    sign.add(mesh(new THREE.SphereGeometry(0.035, 10, 8), lime, 0.2, -0.13, 0));
  }
  g.userData.sign = sign;
  shadows(g); return g;
}

/* a small kid figure for the pickup / drop-off animation */
export function makeKid(body = C.lime, head = C.ink) {
  const g = new THREE.Group();
  g.add(mesh(new THREE.CapsuleGeometry(0.075, 0.13, 6, 14), mat(body, { emissive: body === C.lime ? C.lime : 0x000000, emissiveIntensity: 0.15 }), 0, 0.15, 0));
  g.add(mesh(new THREE.SphereGeometry(0.075, 18, 14), mat(head), 0, 0.34, 0));
  g.add(mesh(rBox(0.13, 0.13, 0.06, 0.03), mat(C.ink), 0, 0.17, -0.08)); // backpack
  shadows(g); return g;
}

/* a camera-facing pill label (canvas sprite), e.g. "Picking up" above a car */
export function makeLabel(text, { bg = "#CBF34B", fg = "#14171A", dot = "#14171A", height = 0.42 } = {}) {
  const font = '700 64px "Bricolage Grotesque", Inter, system-ui, sans-serif';
  const c = document.createElement("canvas"), x = c.getContext("2d");
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
  sp.renderOrder = 10;
  let current = text;
  const draw = () => {
    const padL = 96, padR = 52, H = 120;
    x.font = font;
    const W = Math.ceil(padL + x.measureText(current).width + padR);
    c.width = W; c.height = H;
    x.font = font;
    x.fillStyle = bg; x.beginPath(); x.roundRect(4, 4, W - 8, H - 8, (H - 8) / 2); x.fill();
    x.lineWidth = 5; x.strokeStyle = "rgba(20,23,26,.9)"; x.stroke();
    x.fillStyle = dot; x.beginPath(); x.arc(56, H / 2, 17, 0, Math.PI * 2); x.fill();
    x.fillStyle = fg; x.textBaseline = "middle"; x.fillText(current, padL, H / 2 + 3);
    tex.dispose(); tex.image = c; tex.needsUpdate = true;
    sp.scale.set(height * (W / H), height, 1);
  };
  draw();
  document.fonts?.ready.then(draw);
  sp.userData.setText = (t) => { if (t !== current) { current = t; draw(); } };
  return sp;
}

export function makePin() {
  const g = new THREE.Group();
  const cone = mesh(new THREE.ConeGeometry(0.12, 0.28, 16), mat(C.ink), 0, 0, 0);
  cone.rotation.x = Math.PI; g.add(cone);
  g.add(mesh(new THREE.SphereGeometry(0.15, 18, 14), mat(C.lime, { emissive: C.lime, emissiveIntensity: 0.15 }), 0, 0.2, 0));
  return g;
}
export function addLights(scene, opts = {}) {
  scene.add(new THREE.HemisphereLight(0xffffff, opts.ground ?? 0xdde3cf, LI(opts.hemi ?? 0.75)));
  const d = new THREE.DirectionalLight(0xffffff, LI(opts.dir ?? 0.6));
  d.position.set(5, 10, 6);
  if (opts.shadow) {
    d.castShadow = true; d.shadow.mapSize.set(1024, 1024);
    const c = d.shadow.camera; c.left = -8; c.right = 8; c.top = 8; c.bottom = -8; c.near = 1; c.far = 30;
    d.shadow.radius = 4; d.shadow.bias = -0.0008;
  }
  scene.add(d);
  return d;
}

export { THREE };
