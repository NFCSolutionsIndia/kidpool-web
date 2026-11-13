/* Lightweight shared helpers with no three.js dependency, so sections can use them
   without pulling the 3D library into the first page load. */

/* brand tokens (also used inside the 3D scenes) */
export const C = {
  lime: 0xcbf34b, ink: 0x14171a, white: 0xffffff, pale: 0xf4fae6,
  sky: 0xe4f5b8, road: 0xd8dccf, gray: 0xd5dbe0, mid: 0x9aa7b2, tree: 0xd9f58a,
};

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
