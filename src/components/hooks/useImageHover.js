import { useEffect } from "react";
import gsap from "gsap";

export function useImageHover(cursorRef, defaultSize = 12) {
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let hoverTween = null;

    const span = cursor.querySelector(".cursor-text");

    const bind = () => {
      const images = document.querySelectorAll(".image-hover");

      images.forEach((image) => {
        const enter = () => {
          if (hoverTween) hoverTween.kill();
          hoverTween = gsap.to(cursor, {
            width: 50,
            height: 50,
            backgroundColor: "white",
            border: "none",
            borderRadius: "50%",
            filter: "none",
            backdropFilter: "none",
            mixBlendMode: "difference",
            duration: 0.3,
            ease: "power2.out",
            onStart: () => {
              if (span) gsap.to(span, { opacity: 1, duration: 0.2 });
            },
          });
        };

        const leave = () => {
          if (hoverTween) hoverTween.kill();
          hoverTween = gsap.to(cursor, {
            width: defaultSize,
            height: defaultSize,
            backgroundColor: "rgba(255, 255, 255, 0)",
            border: "1px solid white",
            borderRadius: "50%",
            filter: "blur(1px)",
            backdropFilter: "blur(0)",
            mixBlendMode: "difference",
            duration: 0.2,
            ease: "power2.in",
            onStart: () => {
              if (span) gsap.to(span, { opacity: 0, duration: 0.05 });
            },
          });
        };

        image.addEventListener("mouseenter", enter);
        image.addEventListener("mouseleave", leave);
      });
    };

    bind();

    const observer = new MutationObserver(bind);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      document.querySelectorAll(".image-hover").forEach((el) => {
        const cloned = el.cloneNode(true);
        el.replaceWith(cloned);
      });
    };
  }, [cursorRef, defaultSize]);
}
