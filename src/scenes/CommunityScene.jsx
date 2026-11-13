import * as THREE from "three";
import { C, mat, mesh, addLights, reducedMotion } from "../lib/threeKit";
import { useThree } from "../hooks/useThreeScene";

/* ================= 7. SAFETY — community sphere ================= */
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
const easeOutBack = (x) => { const c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };

export default function CommunityScene({ modeRef, activeRef }) {
  const ref = useThree(({ scene, camera }) => {
    addLights(scene, { hemi: 1, dir: 0.6 });
    const world = new THREE.Group(); scene.add(world);
    const shell = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.7, 1)),
      new THREE.LineBasicMaterial({ color: 0xa9c25a, transparent: true, opacity: 0.45 }));
    world.add(shell);
    const core = mesh(new THREE.IcosahedronGeometry(0.42, 2), mat(C.lime, { flatShading: true, emissive: C.lime, emissiveIntensity: 0.1 }));
    world.add(core);
    const nodes = [], N = 18, ride = [3, 11];
    const ng = new THREE.SphereGeometry(0.16, 20, 16);
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963;
      const v = new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r).multiplyScalar(1.75 + (i % 3) * 0.18);
      const n = mesh(ng, mat(C.white, { roughness: 0.4 }), v.x, v.y, v.z);
      n.userData.home = v.clone(); world.add(n); nodes.push(n);
    }
    const lineGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(N * 6); lineGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: 0x5f6b75, transparent: true, opacity: 0.35 }));
    world.add(lines);
    const outside = new THREE.Points(
      (() => { const g = new THREE.BufferGeometry(), a = new Float32Array(90);
        for (let i = 0; i < 30; i++) { const v = new THREE.Vector3().randomDirection ? new THREE.Vector3().randomDirection() : new THREE.Vector3(Math.random() - .5, Math.random() - .5, Math.random() - .5).normalize();
          v.multiplyScalar(3.4 + Math.random() * 1.2); a.set([v.x, v.y, v.z], i * 3); }
        g.setAttribute("position", new THREE.BufferAttribute(a, 3)); return g; })(),
      new THREE.PointsMaterial({ color: 0xcbf34b, size: 0.07, transparent: true }));
    world.add(outside);
    const lime = new THREE.Color(C.lime), white = new THREE.Color(C.white), dim = new THREE.Color(0xd5dde3);
    camera.position.set(0, 0.6, 9.5); camera.lookAt(0, 0, 0);
    // entrance: core pops, families burst out to their places, shell grows and spins in
    let intro = 0, wasActive = false;
    const INTRO = 2.2, reduce = reducedMotion();
    return {
      onResize: (w, h) => { camera.position.z = w / h < 1 ? 11.5 : 9.5; },
      update: (t, dt, p) => {
        const mode = modeRef.current;
        const on = activeRef ? activeRef.current : true;
        if (on && !wasActive) intro = 0;
        wasActive = on;
        intro = reduce ? INTRO : Math.min(INTRO, intro + dt);
        const k = intro / INTRO;
        const eShell = easeOutCubic(clamp01((k - 0.1) / 0.6));
        shell.scale.setScalar(Math.max(0.0001, 0.35 + 0.65 * eShell));
        shell.material.opacity = 0.45 * eShell;
        core.scale.setScalar(Math.max(0.0001, easeOutBack(clamp01(k / 0.3))));
        outside.material.opacity = clamp01((k - 0.55) / 0.45);
        world.rotation.y = t * 0.12 + p.x * 0.4 + p.drag - (1 - eShell) * 2.2;
        world.rotation.x = 0.15 + p.y * 0.18;
        core.rotation.y = -t * 0.4;
        nodes.forEach((n, i) => {
          const inRide = ride.includes(i);
          const focus = mode === 1 ? inRide : true;
          const target = mode === 1 && inRide ? lime : mode === 1 ? dim : white;
          n.material.color.lerp(target, 0.1);
          const s = mode === 1 ? (inRide ? 1.6 : 0.7) : 1;
          n.scale.setScalar(n.scale.x + (s - n.scale.x) * 0.1);
          const burst = easeOutBack(clamp01((k - 0.15 - i * 0.025) / 0.45));
          const h = n.userData.home, pull = (mode === 1 && inRide ? 0.72 : 1) * burst;
          n.position.set(h.x * pull, h.y * pull + Math.sin(t * 1.5 + i) * 0.04 * burst, h.z * pull);
          if (burst < 1) n.scale.setScalar(Math.max(0.0001, burst * s));
          const j = i * 6, show = focus ? 1 : 0;
          positions[j] = 0; positions[j + 1] = 0; positions[j + 2] = 0;
          positions[j + 3] = n.position.x * show; positions[j + 4] = n.position.y * show; positions[j + 5] = n.position.z * show;
        });
        lineGeo.attributes.position.needsUpdate = true;
        lines.material.opacity += ((mode === 1 ? 0.8 : 0.3) - lines.material.opacity) * 0.1;
        lines.material.color.set(mode === 1 ? C.ink : 0x5f6b75);
      },
    };
  }, { drag: true });
  return <div className="scene scene--community" ref={ref} />;
}
