import * as THREE from "three";
import { C, LI, reducedMotion, rBox, mat, mesh, shadows, makeCar, makeSchool, addLights } from "../lib/threeKit";
import { useThree } from "../hooks/useThreeScene";

/* ================= HOW IT WORKS — cinematic night drive =================
   Dark set, fog, glowing road edges, headlights, a spotlight beam on the
   active step, fireflies, and a tracking camera that dollies in on arrival. */
const NIGHT = 0x161b11; // matches the section background so fog melts into it

export default function StepsScene({ stepRef }) {
  const ref = useThree(({ scene, camera }) => {
    scene.fog = new THREE.Fog(NIGHT, 10, 22);
    addLights(scene, { shadow: true, hemi: 0.32, dir: 0.42, ground: 0x0e110b });
    const world = new THREE.Group(); scene.add(world);

    // ground slab: dark set floor
    const slab = mesh(rBox(46, 16, 0.3, 0.8), mat(0x22291b, { roughness: 0.9 }), 0, -0.15, 0);
    slab.rotation.x = -Math.PI / 2; slab.receiveShadow = true; world.add(slab);

    // the four step points sit in the middle; the road keeps winding off both
    // edges of the frame into the fog, so it never visibly ends
    const STEP_PTS = [
      new THREE.Vector3(-5, 0, 0.9), new THREE.Vector3(-1.7, 0, -0.9),
      new THREE.Vector3(1.7, 0, 0.9), new THREE.Vector3(5, 0, -0.9),
    ];
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-19, 0, -1.2), new THREE.Vector3(-13.5, 0, 1.0), new THREE.Vector3(-8.6, 0, -0.6),
      ...STEP_PTS,
      new THREE.Vector3(8.6, 0, 0.6), new THREE.Vector3(13.5, 0, -1.0), new THREE.Vector3(19, 0, 1.2),
    ], false, "centripetal");
    // arc-length position (0..1) of each step point on the long road
    const uStep = STEP_PTS.map((pt) => {
      let best = 0, bd = Infinity;
      for (let i = 0; i <= 4000; i++) { const d = curve.getPointAt(i / 4000).distanceToSquared(pt); if (d < bd) { bd = d; best = i / 4000; } }
      return best;
    });
    const span = uStep[3] - uStep[0];

    // ribbon helper along the curve (offset from centre, width w, height y)
    const ribbon = (offset, w, y, material) => {
      const S = 900, pos = [], idx = [], up = new THREE.Vector3(0, 1, 0);
      for (let i = 0; i <= S; i++) {
        const pt = curve.getPointAt(i / S);
        const side = new THREE.Vector3().crossVectors(curve.getTangentAt(i / S), up).normalize();
        const a = side.clone().multiplyScalar(offset + w / 2), b = side.clone().multiplyScalar(offset - w / 2);
        pos.push(pt.x + a.x, y, pt.z + a.z, pt.x + b.x, y, pt.z + b.z);
        if (i < S) { const k = i * 2; idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); }
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
      return new THREE.Mesh(g, material);
    };
    const road = ribbon(0, 1.0, 0.02, mat(0x0d0f10, { roughness: 0.55, side: THREE.DoubleSide }));
    road.receiveShadow = true; world.add(road);
    const glow = new THREE.MeshBasicMaterial({ color: C.lime, side: THREE.DoubleSide });
    world.add(ribbon(0.53, 0.045, 0.03, glow), ribbon(-0.53, 0.045, 0.03, glow));
    // soft halo under the edge lines
    const halo = new THREE.MeshBasicMaterial({ color: C.lime, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    world.add(ribbon(0.53, 0.35, 0.025, halo), ribbon(-0.53, 0.35, 0.025, halo));

    const dashG = rBox(0.22, 0.02, 0.06, 0.02), dashM = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const DASHES = 92;
    for (let i = 1; i < DASHES; i++) {
      const pt = curve.getPointAt(i / DASHES), tg = curve.getTangentAt(i / DASHES);
      const d = mesh(dashG, dashM, pt.x, 0.04, pt.z); d.rotation.y = Math.atan2(-tg.z, tg.x); world.add(d);
    }

    // step markers (light-coloured so they read on the dark set)
    const pads = [], markers = [], beams = [];
    const buildMarker = (i) => {
      const g = new THREE.Group();
      if (i === 0) { const s = makeSchool(C.lime); s.scale.setScalar(0.42); g.add(s); }
      if (i === 1) {
        [[-0.16, 0.95, C.white], [0.18, 0.8, C.lime]].forEach(([x, s, c]) => {
          const k = new THREE.Group();
          k.add(mesh(rBox(0.26, 0.38, 0.22, 0.1), mat(c), 0, 0.19, 0));
          k.add(mesh(new THREE.SphereGeometry(0.13, 16, 12), mat(0xf3d9c4), 0, 0.5, 0));
          k.position.x = x; k.scale.setScalar(s); g.add(k);
        });
      }
      if (i === 2) {
        g.add(mesh(rBox(0.5, 0.14, 0.45, 0.06), mat(C.white), 0, 0.12, 0));
        g.add(mesh(rBox(0.14, 0.55, 0.45, 0.06), mat(C.white), -0.2, 0.4, 0));
      }
      if (i === 3) {
        const m = mat(C.lime, { emissive: C.lime, emissiveIntensity: 0.25 });
        g.add(mesh(new THREE.TorusGeometry(0.28, 0.06, 12, 40), m, 0, 0.42, 0));
        const t1 = mesh(rBox(0.08, 0.2, 0.08, 0.03), m, -0.06, 0.38, 0); t1.rotation.z = 0.8;
        const t2 = mesh(rBox(0.08, 0.34, 0.08, 0.03), m, 0.06, 0.44, 0); t2.rotation.z = -0.6;
        g.add(t1, t2);
      }
      shadows(g); return g;
    };
    const beamGeo = new THREE.CylinderGeometry(0.35, 0.75, 4.2, 40, 1, true);
    beamGeo.translate(0, 2.1, 0);
    for (let i = 0; i < 4; i++) {
      const pt = curve.getPointAt(uStep[i]);
      const pad = mesh(new THREE.CylinderGeometry(0.62, 0.66, 0.16, 44),
        mat(0x3a4230, { emissive: C.lime, emissiveIntensity: 0 }), pt.x, 0.08, pt.z + (i % 2 ? -1.0 : 1.0));
      pad.receiveShadow = true; pad.castShadow = true; world.add(pad); pads.push(pad);
      const m = buildMarker(i); m.position.set(pad.position.x, 0.16, pad.position.z); world.add(m); markers.push(m);
      const beam = new THREE.Mesh(beamGeo, new THREE.MeshBasicMaterial({
        color: C.lime, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false,
      }));
      beam.position.set(pad.position.x, 0.1, pad.position.z); world.add(beam); beams.push(beam);
    }

    // hero car with headlights + a lime "key light" that rides along
    const car = makeCar(C.lime, 0.55); world.add(car);
    const head = new THREE.SpotLight(0xffffff, LI(2.2), 7, 0.5, 0.6, 1);
    head.position.set(0.5, 0.35, 0); head.target.position.set(4, 0, 0);
    car.add(head, head.target);
    const beamCone = new THREE.Mesh(new THREE.ConeGeometry(0.55, 2.4, 24, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xfffbe0, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    beamCone.rotation.z = Math.PI / 2; beamCone.position.set(1.65, 0.28, 0); car.add(beamCone);
    const key = new THREE.PointLight(C.lime, LI(1.4), 4.5, 1.2); key.position.set(0, 1.4, 0); world.add(key);

    // fireflies
    const FN = 90, fPos = new Float32Array(FN * 3), fSeed = [];
    for (let i = 0; i < FN; i++) {
      const x = (Math.random() - 0.5) * 15, y = 0.3 + Math.random() * 2.6, z = (Math.random() - 0.5) * 7;
      fPos.set([x, y, z], i * 3); fSeed.push([x, y, z, Math.random() * 6.28]);
    }
    const fGeo = new THREE.BufferGeometry(); fGeo.setAttribute("position", new THREE.BufferAttribute(fPos, 3));
    const flies = new THREE.Points(fGeo, new THREE.PointsMaterial({
      color: C.lime, size: 0.07, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    world.add(flies);

    let u = uStep[0], settle = 0, base = { y: 6.2, z: 7.4, k: 1 };
    // the car only ever drives forward: going "back" a step means driving on
    // into the fog, re-entering from the far end of the road, and carrying on
    let wrapping = false, lastTarget = 0, speed = 0, bounce = 0, wasMoving = false;
    const camPos = new THREE.Vector3(0, 6.2, 7.4), camT = new THREE.Vector3(), look = new THREE.Vector3(), lookT = new THREE.Vector3();
    return {
      onResize: (w, h) => {
        const k = w / h < 1 ? 1.6 : w / h < 1.6 ? 1.3 : 1;
        base = { y: 6.3 * k, z: 8.4 * k, k };
        camPos.set(0, base.y, base.z); camera.position.copy(camPos); camera.lookAt(0, 0, 0);
      },
      update: (t, dt, p) => {
        const reduce = reducedMotion();
        const goal = uStep[stepRef.current];
        if (goal !== lastTarget) { if (goal < u - 0.002) wrapping = true; lastTarget = goal; }
        let step = 0;
        if (reduce) { u = goal; wrapping = false; }
        else {
          // ease toward the goal (or toward the road's end while wrapping); speed is smoothed so it accelerates and brakes
          const aim = wrapping ? 1.02 : goal;
          const diff = aim - u;
          const want = Math.max(0, Math.min(diff, dt * (0.3 * span + diff * 1.4)));
          speed += (want - speed) * Math.min(1, dt * 6);
          step = Math.min(speed, Math.max(0, diff));
          u += step;
          if (wrapping && u >= 0.995) { u = 0.005; wrapping = false; speed *= 0.6; } // hidden in the fog
        }
        const pos = curve.getPointAt(Math.min(1, u)), tan = curve.getTangentAt(Math.min(1, u));
        // small suspension bob when the car comes to rest
        const moving = wrapping || Math.abs(goal - u) > 0.004 * span;
        if (wasMoving && !moving) bounce = 1;
        wasMoving = moving;
        bounce = Math.max(0, bounce - dt * 1.6);
        car.position.set(pos.x, 0.03 + Math.sin(bounce * Math.PI * 3) * 0.035 * bounce, pos.z);
        car.rotation.y = Math.atan2(-tan.z, tan.x);
        car.rotation.z = Math.sin(bounce * Math.PI * 3) * 0.03 * bounce;
        car.userData.wheels.forEach((w) => (w.rotation.y -= step * 60));
        key.position.set(pos.x, 1.4, pos.z);

        // cinematic tracking camera: follow the car (kept within the step area so the wrap doesn't whip it), dolly in when it parks
        pos.x = Math.max(-6, Math.min(6, pos.x));
        settle += ((moving ? 0 : 1) - settle) * Math.min(1, dt * 1.2);
        const dolly = 1 - settle * 0.22;
        const sway = reduce ? 0 : Math.sin(t * 0.35) * 0.6;
        const tx = pos.x * (base.k > 1.2 ? 0.35 : 0.6) + sway + p.x * 0.8;
        camPos.lerp(camT.set(tx, base.y * dolly + p.y * 0.3, base.z * dolly), Math.min(1, dt * 1.6));
        camera.position.copy(camPos);
        lookT.set(pos.x * (base.k > 1.2 ? 0.45 : 0.75), 0.2, pos.z * 0.5);
        look.lerp(lookT, Math.min(1, dt * 2.2));
        camera.lookAt(look);
        world.rotation.y = p.drag * 0.35;

        pads.forEach((pad, i) => {
          const on = i === stepRef.current;
          const m = pad.material;
          m.emissiveIntensity += ((on ? 0.85 : 0) - m.emissiveIntensity) * 0.1;
          pad.position.y += ((on ? 0.2 : 0.08) - pad.position.y) * 0.12;
          markers[i].position.y = pad.position.y + 0.08 + (on ? Math.sin(t * 3) * 0.05 : 0);
          markers[i].rotation.y += on ? dt * 1.2 : (0 - markers[i].rotation.y) * 0.08;
          const bm = beams[i].material;
          bm.opacity += ((on ? 0.16 + Math.sin(t * 4) * 0.02 : 0) - bm.opacity) * 0.08;
        });

        if (!reduce) {
          const a = fGeo.attributes.position.array;
          for (let i = 0; i < FN; i++) {
            const [x, y, z, s] = fSeed[i];
            a[i * 3] = x + Math.sin(t * 0.4 + s) * 0.35;
            a[i * 3 + 1] = y + Math.sin(t * 0.9 + s * 2) * 0.25;
            a[i * 3 + 2] = z + Math.cos(t * 0.3 + s) * 0.3;
          }
          fGeo.attributes.position.needsUpdate = true;
          flies.material.opacity = 0.65 + Math.sin(t * 2) * 0.2;
        }
      },
    };
  }, { shadow: true, drag: true, fov: 30 });
  return <div className="scene scene--steps" ref={ref} role="img" aria-label="Illustration: a car drives along a night road and stops at each of the four steps: join a pool, add your children, request or offer a seat, and confirm the plan." />;
}
