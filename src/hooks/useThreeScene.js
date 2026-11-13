import { useEffect, useRef } from "react";
import * as THREE from "three";
import { reducedMotion } from "../lib/threeKit";
import { motionPaused } from "./useMotionPause";

/* ---------- reusable three.js hook ----------
   Creates one renderer per section, pauses when off screen, follows the pointer,
   supports drag to rotate, and respects reduced motion. */
export function useThree(setup, opts = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
    catch (e) { el.classList.add("no-webgl"); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if ("outputColorSpace" in renderer) renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    if (opts.shadow) { renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; }
    renderer.domElement.setAttribute("aria-hidden", "true");
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(opts.fov || 32, 1, 0.1, 100);
    const reduced = reducedMotion();
    const p = { x: 0, y: 0, tx: 0, ty: 0, drag: 0, dragV: 0 };
    const api = setup({ scene, camera, renderer, el }) || {};

    let pausedFrames = 0; // frames drawn while the site-wide pause is on
    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      api.onResize && api.onResize(w, h, camera);
      pausedFrames = 0; // a resize clears the canvas: redraw the settled frame even while paused
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(el);

    let raf = 0, last = performance.now(), t = 0;
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      // site-wide pause: the scene clock stops, but the entrance still finishes (~3 s of frames),
      // then the last frame is held so the picture stays visible and still
      const paused = motionPaused();
      if (paused && ++pausedFrames > 180) { last = now; return; }
      if (!paused) pausedFrames = 0;
      // while paused, big steps finish the entrance in a dozen frames (works even on slow devices)
      const dt = paused ? 0.25 : Math.min((now - last) / 1000, 0.05); last = now;
      if (!reduced && !paused) t += dt;
      p.x += (p.tx - p.x) * 0.06; p.y += (p.ty - p.y) * 0.06;
      if (!dragging) { p.drag += p.dragV; p.dragV *= 0.92; }
      api.update && api.update(t, dt, p);
      renderer.render(scene, camera);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
      else if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = 0; }
    }, { rootMargin: "80px" });
    io.observe(el);

    const onMove = (e) => {
      if (reduced) return;
      const r = el.getBoundingClientRect();
      p.tx = Math.max(-1.4, Math.min(1.4, ((e.clientX - r.left) / r.width) * 2 - 1));
      p.ty = Math.max(-1.4, Math.min(1.4, ((e.clientY - r.top) / r.height) * 2 - 1));
    };
    let dragging = false, lastX = 0;
    const down = (e) => { dragging = true; lastX = e.clientX; el.classList.add("is-dragging"); };
    const move = (e) => { if (!dragging) return; const dx = e.clientX - lastX; lastX = e.clientX; p.drag += dx * 0.01; p.dragV = dx * 0.01; };
    const up = () => { dragging = false; el.classList.remove("is-dragging"); };
    window.addEventListener("pointermove", onMove, { passive: true });
    if (opts.drag) {
      el.addEventListener("pointerdown", down);
      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("pointerup", up);
    }
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      scene.traverse((o) => { o.geometry && o.geometry.dispose(); if (o.material) [].concat(o.material).forEach((m) => m.dispose()); });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);
  return ref;
}
