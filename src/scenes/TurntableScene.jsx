import * as THREE from "three";
import { LI, C, mat, mesh, makeCar, addLights } from "../lib/threeKit";
import { useThree } from "../hooks/useThreeScene";

/* ================= 10. FINAL CTA — turntable car ================= */
export default function TurntableScene() {
  const ref = useThree(({ scene, camera }) => {
    addLights(scene, { hemi: 1.1, dir: 0.9, shadow: true });
    const rim = new THREE.PointLight(C.lime, LI(0.8), 12, 1); rim.position.set(-3, 2, -2); scene.add(rim);
    const table = mesh(new THREE.CylinderGeometry(2.4, 2.5, 0.3, 64), mat(0x2a3036, { roughness: 0.5 }), 0, -0.15, 0);
    table.receiveShadow = true; scene.add(table);
    const ring = mesh(new THREE.TorusGeometry(2.45, 0.035, 8, 96), mat(C.lime, { emissive: C.lime, emissiveIntensity: 0.4 }), 0, 0.01, 0);
    ring.rotation.x = Math.PI / 2; scene.add(ring);
    const car = makeCar(C.lime, 1.55); scene.add(car);
    camera.position.set(0, 3.2, 7.4); camera.lookAt(0, 0.6, 0);
    return {
      onResize: (w, h) => { const k = w / h < 1 ? 1.35 : 1; camera.position.set(0, 3.2 * k, 7.4 * k); camera.lookAt(0, 0.6, 0); },
      update: (t, dt, p) => {
        car.rotation.y = -0.6 + t * 0.25 + p.x * 0.7 + p.drag;
        car.position.y = Math.sin(t * 1.6) * 0.03;
        table.rotation.y = car.rotation.y;
      },
    };
  }, { shadow: true, drag: true });
  return <div className="scene scene--cta" ref={ref} />;
}
