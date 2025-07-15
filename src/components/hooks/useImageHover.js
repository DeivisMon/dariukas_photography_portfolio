import { useEffect } from "react";

export function useImageHover(cursorRef) {
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const span = cursor.querySelector(".cursor-text");

    const bind = () => {
      const images = document.querySelectorAll(".image-hover");

      images.forEach((image) => {
        const enter = () => {
          cursor.classList.add("cursor-image-hover");
          if (span) span.style.opacity = 1;
        };

        const leave = () => {
          cursor.classList.remove("cursor-image-hover");
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
