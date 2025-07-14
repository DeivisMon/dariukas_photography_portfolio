import { useEffect } from "react";
import Lenis from "lenis";
import { useMotionValue } from "framer-motion";

export default function useLenisScroll() {
  const scrollY = useMotionValue(0);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      scrollY.set(lenis.scroll); // Sync value
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [scrollY]);

  return scrollY;
}
