import { useEffect } from "react";
import gsap from "gsap";

export function useCursor(cursorRef) {
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "sine.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "sine.out" });

    const move = (e) => {
      xTo(e.clientX - cursor.offsetWidth / 2);
      yTo(e.clientY - cursor.offsetHeight / 2);
    };

    const hide = () => gsap.to(cursor, { opacity: 0 });
    const show = () => gsap.to(cursor, { opacity: 0.8 });

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseout", hide);
    window.addEventListener("mouseover", show);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseout", hide);
      window.removeEventListener("mouseover", show);
    };
  }, [cursorRef]);
}
