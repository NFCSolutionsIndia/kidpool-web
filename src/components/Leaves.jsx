/* Decorative floating leaves (brand lime only). Pass an array of
   { x, y, size, rot, blur, delay, tone } — x/y are CSS positions. */
export function Leaf({ size = 60, rot = 0, tone = "lime" }) {
  const id = `leaf-${tone}`;
  return (
    <svg viewBox="0 0 100 60" width={size} height={size * 0.6} style={{ transform: `rotate(${rot}deg)` }} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: tone === "deep" ? "var(--g-mid)" : "#E4FA96" }} />
          <stop offset="1" style={{ stopColor: tone === "deep" ? "var(--g-deep)" : "var(--lime)" }} />
        </linearGradient>
      </defs>
      <path d="M2 30 C 20 2, 70 -4, 98 30 C 70 64, 20 58, 2 30 Z" fill={`url(#${id})`} />
      <path d="M8 30 C 40 26, 70 26, 94 30" stroke="rgba(255,255,255,.55)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function Leaves({ items = [] }) {
  return (
    <div className="leaves" aria-hidden="true">
      {items.map((l, i) => (
        <span
          key={i}
          className="leaf"
          style={{ left: l.x, top: l.y, right: l.r, bottom: l.b, filter: l.blur ? `blur(${l.blur}px)` : undefined, animationDelay: `${l.delay ?? -i * 1.3}s` }}
        >
          <Leaf size={l.size} rot={l.rot} tone={l.tone} />
        </span>
      ))}
    </div>
  );
}
