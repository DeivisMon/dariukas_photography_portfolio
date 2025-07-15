import { createContext, useContext, useRef, useEffect } from "react";
import { useMotionValue } from "framer-motion";
import Lenis from "lenis";

const LenisContext = createContext(null);

export const LenisProvider = ({ children }) => {
  const scrollY = useMotionValue(0);
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smooth: true,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      scrollY.set(lenis.scroll);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <LenisContext.Provider value={{ scrollY }}>
      {children}
    </LenisContext.Provider>
  );
};

export const useLenisScroll = () => {
  const context = useContext(LenisContext);
  if (!context) {
    throw new Error("useLenisScroll must be used inside LenisProvider");
  }
  return context.scrollY;
};
