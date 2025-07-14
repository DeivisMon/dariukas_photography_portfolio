import { useEffect } from "react";
import Lenis from "lenis";

export default function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.05,
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);

      window.dispatchEvent(new Event("scroll"));

      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);
}
