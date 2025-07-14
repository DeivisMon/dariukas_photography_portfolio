import { useEffect } from "react";
import gsap from "gsap";

export function useNavHover(cursorRef, defaultSize = 12) {
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let hoverTween = null;

    const handleHover = () => {
      if (hoverTween) hoverTween.kill();
      hoverTween = gsap.to(cursor, {
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "2px solid white",
        backdropFilter: "blur(1px)",
        filter: "blur(0)",
        duration: 0.3,
        ease: "bounce.in",
      });
    };

    const handleLeave = () => {
      if (hoverTween) hoverTween.kill();
      hoverTween = gsap.to(cursor, {
        width: defaultSize,
        height: defaultSize,
        borderRadius: "50%",
        filter: "blur(1px)",
        backdropFilter: "blur(0)",
        border: "1px solid white",
        duration: 0.15,
        ease: "bounce.in",
      });
    };

    const bindListeners = () => {
      const navItems = document.querySelectorAll(".nav-list, .social-icons, .close-btn");
      navItems.forEach((el) => {
        el.addEventListener("mouseenter", handleHover);
        el.addEventListener("mouseleave", handleLeave);
      });
      return navItems;
    };

    let navItems = bindListeners();

    // Observe DOM changes to rebind if nav items are replaced dynamically
    const observer = new MutationObserver(() => {
      // Remove old listeners
      navItems.forEach((el) => {
        el.removeEventListener("mouseenter", handleHover);
        el.removeEventListener("mouseleave", handleLeave);
      });
      // Rebind new elements
      navItems = bindListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      navItems.forEach((el) => {
        el.removeEventListener("mouseenter", handleHover);
        el.removeEventListener("mouseleave", handleLeave);
      });
      observer.disconnect();
    };
  }, [cursorRef, defaultSize]);
}
