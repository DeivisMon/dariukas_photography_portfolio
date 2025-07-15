import { useEffect } from "react";

export function useMenuHover(cursorRef) {
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const span = cursor.querySelector(".cursor-arrow");
    const bind = () => {
      const images = document.querySelectorAll(".work-menu-item");

      images.forEach((image) => {
        const enter = () => {
          cursor.classList.add("work-menu-item-hover");
          if (span) span.style.opacity = 1;
        };

        const leave = () => {
          cursor.classList.remove("work-menu-item-hover");
          if (span) span.style.opacity = 0;
        };

        image.addEventListener("mouseenter", enter);
        image.addEventListener("mouseleave", leave);
      });
    };

    bind();

    const observer = new MutationObserver(bind);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [cursorRef]);
}
