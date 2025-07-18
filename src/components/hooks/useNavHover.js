import { useEffect } from "react";

export function useNavHover(cursorRef) {
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;


    const bind = () => {
      const images = document.querySelectorAll(".nav-item");

      images.forEach((image) => {
        const enter = () => {
          cursor.classList.add("cursor-image-hover");
        };

        const leave = () => {
          cursor.classList.remove("cursor-image-hover");
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
