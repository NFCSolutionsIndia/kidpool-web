import * as THREE from "three";
import { C, LI, rBox, mat, mesh, makeCar, makeHouse, makeTree, makeHub, makeVenue, makeKid, makeLabel, makePin, addLights, reducedMotion } from "../lib/threeKit";
import { useThree } from "../hooks/useThreeScene";

/* Hero palette: brand lime, ink and white only */
const LIME_SOFT = 0xeefbc4;
const DISC_R = 4.8;              // plinth radius; houses sit inside it
const CAM_DIR = new THREE.Vector3(0, 8.4, 12.4).normalize();
const Y_AXIS = new THREE.Vector3(0, 1, 0);
const CAM_LOW = new THREE.Vector3(0, 2.6, 12.4).normalize();
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
const easeOutBack = (x) => { const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };

/* ================= 2. HERO — the town diorama =================
   activeRef.current flips true when the hero is on screen; each time it does,
   the town plays its build-up intro again. */
export default function HeroScene({ activeRef }) {
  const ref = useThree(({ scene, camera }) => {
    addLights(scene, { shadow: true, ground: 0xe9f2d0 });
    const world = new THREE.Group(); scene.add(world);
    // ink plinth + white top + lime park in the middle
    const plinth = mesh(new THREE.CylinderGeometry(DISC_R - 0.02, DISC_R - 0.02, 0.42, 72), mat(C.ink, { roughness: 0.5 }), 0, -0.24, 0);
    world.add(plinth);
    const ground = mesh(new THREE.CylinderGeometry(4.7, 4.7, 0.12, 72), mat(C.white), 0, -0.06, 0);
    ground.receiveShadow = true; world.add(ground);
    const park = mesh(new THREE.CircleGeometry(2.55, 72), mat(LIME_SOFT), 0, 0.004, 0);
    park.rotation.x = -Math.PI / 2; park.receiveShadow = true; world.add(park);
    const road = mesh(new THREE.RingGeometry(2.55, 3.45, 96), mat(C.ink, { roughness: 0.75 }), 0, 0.006, 0);
    road.rotation.x = -Math.PI / 2; road.receiveShadow = true; world.add(road);
    const edge = mesh(new THREE.RingGeometry(3.45, 3.53, 96), mat(C.lime), 0, 0.007, 0);
    edge.rotation.x = -Math.PI / 2; world.add(edge);
    const dash = rBox(0.28, 0.02, 0.07, 0.02), dm = mat(C.white);
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2, d = mesh(dash, dm, Math.cos(a) * 3, 0.02, Math.sin(a) * 3);
      d.rotation.y = -a + Math.PI / 2; world.add(d);
    }

    // everything that "pops" in during the intro, in order
    const props = [];
    const hub = makeHub(); world.add(hub); props.push({ o: hub, at: 0.15 });
    [[1.6, 0.9], [-1.5, 1.1], [-1.3, -1.3], [1.4, -1.2], [0.2, 1.9], [-0.3, -1.95]].forEach(([x, z], i) => {
      const t = makeTree(0.8 + (i % 3) * 0.15, i % 2 ? C.white : C.lime, C.ink); t.position.set(x, 0, z); world.add(t);
      props.push({ o: t, at: 0.3 + i * 0.06 });
    });
    const houseAngles = [0.4, 1.55, 2.6, 3.7, 4.75, 5.7];
    const pins = [];
    const VENUES = ["sports", "music", "school"];
    const signs = [];
    let schoolFlag = null;
    houseAngles.forEach((a, i) => {
      // homes (with pickup pins) alternate with activity venues (with floating signs)
      if (i % 2) {
        const v = makeVenue(VENUES[(i - 1) / 2]);
        v.position.set(Math.cos(a) * 4.05, 0, Math.sin(a) * 4.05);
        v.rotation.y = -a - Math.PI / 2; world.add(v);
        if (v.userData.flag) schoolFlag = v.userData.flag;
        props.push({ o: v, at: 0.4 + i * 0.06 });
        const sg = v.userData.sign; sg.scale.setScalar(v.userData.signScale || 1.5); sg.position.set(v.position.x, 1.45, v.position.z); world.add(sg);
        sg.userData = { a, i, y: v.userData.signY || 1.45 }; sg.position.y = sg.userData.y; props.push({ o: sg, at: 0.6 + i * 0.04 }); signs.push(sg);
        return;
      }
      const h = makeHouse(C.white, C.ink);
      h.position.set(Math.cos(a) * 4.05, 0, Math.sin(a) * 4.05);
      h.rotation.y = -a - Math.PI / 2; world.add(h);
      props.push({ o: h, at: 0.4 + i * 0.06 });
      if (i % 2 === 0) {
        const pin = makePin(); pin.position.set(h.position.x, 1.5, h.position.z);
        pin.userData = { a, base: 1.5, at: 0.55 + i * 0.035 }; world.add(pin); pins.push(pin);
      }
    });
    const car = makeCar(C.lime, 0.62); world.add(car);
    const car2 = makeCar(C.white, 0.55); world.add(car2);
    props.push({ o: car, at: 0.7, s: 0.62 }, { o: car2, at: 0.74, s: 0.55 });
    // what each car is doing, floating above its roof (sizes divided by the car's own scale)
    const lblUp = makeLabel("Picking up", { bg: "#CBF34B", fg: "#14171A", dot: "#14171A", height: 0.38 / 0.62 });
    lblUp.position.set(0, 1.9, 0); car.add(lblUp);
    const lblDrop = makeLabel("Dropping home", { bg: "#14171A", fg: "#FFFFFF", dot: "#CBF34B", height: 0.38 / 0.55 });
    lblDrop.position.set(0, 2.0, 0); car2.add(lblDrop);
    props.forEach((p) => { p.s = p.s ?? p.o.scale.x; });

    /* ---------- the carpool story ----------
       Lime car (outer lane): picks a kid up at each home and drops them at the next activity.
       White car (inner lane): picks a kid up at each activity and drops them at the next home.
       Both stop at every place in turn; the white car runs half a loop behind. */
    const PLACE_NAMES = { sports: "Tennis & swim", music: "Music", school: "School" };
    const SPEED = 0.42, DWELL = 2.6, STOP_BACK = 0.13;
    const polar = (a, r) => new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r);
    const makeRoute = (c, laneR, pickAtHome, kidBody, kidHead) => {
      const stops = houseAngles.map((a, i) => ({ a, home: i % 2 === 0, at: a - STOP_BACK, name: PLACE_NAMES[VENUES[(i - 1) / 2]] }))
        .map((st) => ({ ...st, pickup: st.home === pickAtHome }));
      let tl = 0;
      const legs = stops.map((st, j) => {
        const prev = j === 0 ? stops[stops.length - 1].at - Math.PI * 2 : stops[j - 1].at;
        const drive = (st.at - prev) / SPEED;
        const leg = { st, from: prev, t0: tl, drive };
        tl += drive + DWELL; return leg;
      });
      const kid = makeKid(kidBody, kidHead); kid.scale.setScalar(0.0001); world.add(kid);
      return { car: c, laneR, legs, loop: tl, kid, spin: 0 };
    };
    const routes = [
      makeRoute(car, 3.22, true, C.lime, C.ink),
      makeRoute(car2, 2.78, false, C.ink, C.lime),
    ];
    routes[0].label = lblUp; routes[1].label = lblDrop;
    // label wording follows the trip: on the way -> at the stop
    const labelFor = (pickAtHome, d, stopped) => pickAtHome
      ? (d.home ? (stopped ? "Picking up" : "Heading to pickup") : (stopped ? `Dropped at ${d.name}` : `Off to ${d.name}`))
      : (d.home ? (stopped ? "Dropped home" : "Taking kid home") : (stopped ? `Pickup at ${d.name}` : `Heading to ${d.name}`));
    const storyAt = (r, tau) => {
      // car angle, how fast it is moving (0..1), and the kid's state at time tau
      for (const lg of r.legs) {
        if (tau >= lg.t0 + lg.drive + DWELL) continue;
        const u = tau - lg.t0;
        if (u < lg.drive) {
          const x = easeInOut(u / lg.drive);
          return { a: lg.from + (lg.st.at - lg.from) * x, moving: Math.sin(Math.PI * (u / lg.drive)), kid: null, dest: lg.st, stopped: false };
        }
        return { a: lg.st.at, moving: 0, kid: { q: (u - lg.drive) / DWELL, st: lg.st }, dest: lg.st, stopped: true };
      }
      return { a: r.legs[0].st.at, moving: 0, kid: null, dest: r.legs[0].st, stopped: true };
    };
    let wheelSpin = 0;

    const place = (c, a, r) => {
      c.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
      c.rotation.y = Math.atan2(-Math.cos(a), -Math.sin(a));
    };

    /* ---------- cinematic set dressing ---------- */
    // lime rim light from behind + soft fill that pulses over the hub
    const rim = new THREE.DirectionalLight(C.lime, LI(0.55)); rim.position.set(-6, 4, -8); scene.add(rim);
    const glowLight = new THREE.PointLight(C.lime, LI(0.9), 7, 1.4); glowLight.position.set(0, 2.2, 0); world.add(glowLight);
    // floating-island glow under the disc (radial gradient sprite)
    const gc = document.createElement("canvas"); gc.width = gc.height = 128;
    const gx = gc.getContext("2d"), gr = gx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, "rgba(203,243,75,0.9)"); gr.addColorStop(0.45, "rgba(203,243,75,0.35)"); gr.addColorStop(1, "rgba(203,243,75,0)");
    gx.fillStyle = gr; gx.fillRect(0, 0, 128, 128);
    const glowTex = new THREE.CanvasTexture(gc);
    const underGlow = new THREE.Mesh(new THREE.PlaneGeometry(11, 11), new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.55 }));
    underGlow.rotation.x = -Math.PI / 2; underGlow.position.y = -0.9; world.add(underGlow);
    // light trail behind the lime car
    const trailMat = new THREE.MeshBasicMaterial({ color: C.lime, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    const TRAIL = 1.1;
    const trail = new THREE.Mesh(new THREE.RingGeometry(3.06, 3.38, 48, 1, 0, TRAIL), trailMat);
    trail.rotation.x = -Math.PI / 2; trail.position.y = 0.03; world.add(trail);
    // headlight glows on both cars
    const hlMat = new THREE.MeshBasicMaterial({ color: 0xfffbe0, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    [car, car2].forEach((c) => { const cone = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.6, 20, 1, true), hlMat); cone.rotation.z = Math.PI / 2; cone.position.set(1.65, 0.45, 0); c.add(cone); });
    // pulse rings fired when a car passes a pinned house
    const pulses = pins.map((pin) => {
      const m = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.62, 48), new THREE.MeshBasicMaterial({ color: C.lime, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      m.rotation.x = -Math.PI / 2; m.position.set(pin.position.x, 0.05, pin.position.z); world.add(m);
      return { m, life: 1, armed: true };
    });
    // twinkling sparkles
    const SN = 70, sPos = new Float32Array(SN * 3), sSeed = [];
    for (let i = 0; i < SN; i++) {
      const a = Math.random() * Math.PI * 2, r = 1 + Math.random() * 4.6, y = 0.6 + Math.random() * 3.2;
      sPos.set([Math.cos(a) * r, y, Math.sin(a) * r], i * 3); sSeed.push([a, r, y, Math.random() * 6.28]);
    }
    const sGeo = new THREE.BufferGeometry(); sGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
    const sparkles = new THREE.Points(sGeo, new THREE.PointsMaterial({ color: C.lime, size: 0.08, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }));
    world.add(sparkles);
    let fitDist = 15, camAngle = 0;
    const camTmp = new THREE.Vector3();

    // intro clock: restarts each time the hero becomes active
    let intro = 0, wasActive = false;
    const INTRO = 2.4; // seconds
    const reduce = reducedMotion();

    return {
      onResize: (w, h) => {
        // fit the whole disc horizontally (and vertically) with a margin
        const vHalf = THREE.MathUtils.degToRad(camera.fov / 2);
        const hHalf = Math.atan(Math.tan(vHalf) * (w / h));
        const needW = (DISC_R * 1.16) / Math.tan(hHalf);
        const needH = (DISC_R * 0.95) / Math.tan(vHalf);
        const dist = Math.max(needW, needH, 13.5);
        fitDist = dist;
        camera.position.copy(CAM_DIR).multiplyScalar(dist);
        camera.lookAt(0, 0.1, 0);
      },
      update: (t, dt, p) => {
        const active = activeRef ? activeRef.current : true;
        if (active && !wasActive) intro = 0;           // replay on each visit
        wasActive = active;
        intro = reduce ? INTRO : Math.min(INTRO, intro + dt);
        const k = intro / INTRO;

        // whole town: rises, scales up and spins into place
        const e = easeOutCubic(clamp01(k / 0.55));
        world.scale.setScalar(0.6 + 0.4 * e);
        world.position.y = (1 - e) * -0.45 + (reduce ? 0 : Math.sin(t * 0.8) * 0.08);
        const spinIn = (1 - e) * -1.6;
        world.rotation.y = 0.35 + t * 0.04 + p.x * 0.28 + p.drag + spinIn;
        world.rotation.x = p.y * 0.06;

        // props pop in one after another
        props.forEach(({ o, at, s }) => {
          const x = clamp01((k - at) / 0.22);
          o.scale.setScalar(Math.max(0.0001, s * (x <= 0 ? 0 : easeOutBack(x))));
        });

        // both carpool routes: drive, stop, kid walks between the place and the car
        const stories = routes.map((r, ri) => {
          const tau = reduce ? r.legs[ri ? 3 : 0].t0 + r.legs[ri ? 3 : 0].drive + DWELL * 0.4 : (t + ri * r.loop / 2) % r.loop;
          const st = storyAt(r, tau);
          r.label?.userData.setText(labelFor(ri === 0, st.dest, st.stopped));
          place(r.car, st.a, r.laneR);
          r.spin += dt * 8 * st.moving;
          r.car.userData.wheels.forEach((w) => (w.rotation.y = -r.spin));
          const kid = r.kid;
          if (st.kid && k >= 1) {
            const { q, st: stop } = st.kid;
            const carDoor = polar(stop.at, r.laneR + 0.36);
            const spot = polar(stop.a, stop.home ? 3.62 : 3.68);
            const [from, to] = stop.pickup ? [spot, carDoor] : [carDoor, spot];
            const w = clamp01((q - 0.12) / 0.58);
            kid.position.lerpVectors(from, to, easeInOut(w));
            kid.position.y = w > 0 && w < 1 ? Math.abs(Math.sin(w * Math.PI * 6)) * 0.06 : 0;
            kid.rotation.y = Math.atan2(to.x - from.x, to.z - from.z);
            const appear = clamp01(q / 0.12), vanish = 1 - clamp01((q - 0.72) / 0.1);
            kid.scale.setScalar(Math.max(0.0001, 1.8 * Math.min(easeOutBack(appear), vanish)));
          } else kid.scale.setScalar(0.0001);
          return st;
        });
        const story = stories[0];
        const a1 = stories[0].a, a2 = stories[1].a;
        if (schoolFlag) schoolFlag.rotation.y = Math.sin(t * 3) * 0.25;
        // activity signs bob and turn, and lift when the lime car arrives
        signs.forEach((sg) => {
          const diff = Math.abs(Math.atan2(Math.sin(a1 - sg.userData.a), Math.cos(a1 - sg.userData.a)));
          const near = Math.max(0, 1 - diff / 0.5);
          sg.position.y = sg.userData.y + (reduce ? 0 : Math.sin(t * 1.8 + sg.userData.i) * 0.08) + near * 0.25;
          sg.rotation.y = -sg.userData.a - Math.PI / 2 + (reduce ? 0 : Math.sin(t * 0.9 + sg.userData.i) * 0.25);
        });
        // meeting-point pin floats and turns; its shadow and a pulse ring answer on the plaza
        const { pin, pulse, shadow } = hub.userData;
        const bob = reduce ? 0 : Math.sin(t * 1.6) * 0.1;
        pin.position.y = 0.42 + bob;
        pin.rotation.y = reduce ? 0.6 : t * 0.7;
        shadow.scale.setScalar(1 - bob * 0.9);
        shadow.material.opacity = 0.2 - bob * 0.5;
        const pl = reduce ? 0.5 : (t * 0.55) % 1;
        pulse.scale.setScalar(1 + pl * 2);
        pulse.material.opacity = (1 - pl) * 0.7 * clamp01((k - 0.6) / 0.4);

        // cinematic camera: low + close swoop up to the fitted framing, then a slow drift
        const ce = easeInOut(clamp01(k));
        camTmp.copy(CAM_LOW).lerp(CAM_DIR, ce).normalize();
        camAngle = (1 - ce) * -0.9 + (reduce ? 0 : Math.sin(t * 0.15) * 0.05);
        camTmp.applyAxisAngle(Y_AXIS, camAngle);
        camera.position.copy(camTmp.multiplyScalar(fitDist * (0.8 + 0.2 * ce)));
        camera.lookAt(0, 0.1 + (1 - ce) * 0.3, 0);

        // light trail follows the lime car, glow + sparkles breathe
        trail.rotation.z = -a1;
        trailMat.opacity = 0.42 * clamp01((k - 0.75) / 0.25) * story.moving;
        glowLight.intensity = LI(0.7 + Math.sin(t * 1.6) * 0.25);
        underGlow.material.opacity = 0.35 + 0.2 * e + Math.sin(t * 1.2) * 0.06;
        if (!reduce) {
          const sp = sGeo.attributes.position.array;
          for (let i = 0; i < SN; i++) {
            const [a, r, y, sd] = sSeed[i], aa = a + t * 0.05;
            sp[i * 3] = Math.cos(aa) * r; sp[i * 3 + 1] = y + Math.sin(t * 0.9 + sd) * 0.2; sp[i * 3 + 2] = Math.sin(aa) * r;
          }
          sGeo.attributes.position.needsUpdate = true;
          sparkles.material.opacity = (0.55 + Math.sin(t * 2.3) * 0.25) * clamp01((k - 0.6) / 0.4);
        }

        // pulse ring when either car passes a pinned house
        pulses.forEach((pu, i) => {
          const pa = pins[i].userData.a;
          const dist = Math.min(...[a1, a2].map((ca) => Math.abs(Math.atan2(Math.sin(ca - pa), Math.cos(ca - pa)))));
          if (pu.armed && dist < 0.16 && k >= 1) { pu.life = 0; pu.armed = false; }
          if (dist > 0.6) pu.armed = true;
          pu.life = Math.min(1, pu.life + dt / 1.4);
          pu.m.scale.setScalar(1 + pu.life * 2.6);
          pu.m.material.opacity = (1 - pu.life) * 0.75;
        });

        // pins drop from the sky, then bob
        pins.forEach((pin) => {
          const d = clamp01((k - pin.userData.at) / 0.3);
          const drop = (1 - easeOutBack(d)) * 3;
          const diff = Math.abs(Math.atan2(Math.sin(a1 - pin.userData.a), Math.cos(a1 - pin.userData.a)));
          const near = Math.max(0, 1 - diff / 0.5);
          pin.position.y = pin.userData.base + drop + Math.sin(t * 2 + pin.userData.a) * 0.08 + near * 0.25;
          pin.scale.setScalar(Math.max(0.0001, (d > 0 ? 1 : 0) * (1 + near * 0.35)));
          pin.rotation.y = t * 1.2;
        });
      },
    };
  }, { shadow: true, drag: true });
  return <div className="scene scene--hero" ref={ref} />;
}
