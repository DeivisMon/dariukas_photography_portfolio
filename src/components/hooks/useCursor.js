import { useEffect, useRef } from "react";

export function useCursor(cursorRef) {
  const mouse = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const updateCursor = () => {
      const { width, height } = cursor.getBoundingClientRect();
      cursor.style.transform = `translate3d(${mouse.current.x - width / 2}px, ${mouse.current.y - height / 2}px, 0)`;
    };

    const move = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const animate = () => {
      updateCursor();
      rafId.current = requestAnimationFrame(animate);
    };

    // ✅ Force an initial update using current pointer position if available
    const init = () => {
      // Try to grab current position from where the cursor "was" in the DOM
      const event = new MouseEvent("mousemove", {
        clientX: window.innerWidth / 2,
        clientY: window.innerHeight / 2,
      });
      document.dispatchEvent(event);
    };

    document.addEventListener("mousemove", move);
    init(); // 🟢 simulate position right away
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", move);
      cancelAnimationFrame(rafId.current);
    };
  }, [cursorRef]);
}
