import { lazy, Suspense, useEffect, useState } from "react";

/* The 3D scenes (and three.js, ~500 KB) load after the page has rendered, so they
   never block the first paint. Until then an empty placeholder of the same size holds
   the space, so nothing shifts when the scene appears.
   The placeholder is also what the build-time pre-render outputs; the lazy scene only
   mounts after hydration, so the server HTML and the first client render match. */
const lazyScene = (load, cls) => {
  const Scene = lazy(load);
  const placeholder = <div className={`scene ${cls}`} aria-hidden="true" />;
  return function LazyScene(props) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return placeholder;
    return (
      <Suspense fallback={placeholder}>
        <Scene {...props} />
      </Suspense>
    );
  };
};

export const HeroScene = lazyScene(() => import("./HeroScene"), "scene--hero");
export const StepsScene = lazyScene(() => import("./StepsScene"), "scene--steps");
export const CommunityScene = lazyScene(() => import("./CommunityScene"), "scene--community");
