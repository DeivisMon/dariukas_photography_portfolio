import {
  motion as Motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
//   useAnimation,
} from "framer-motion";
import { useRef, useEffect } from "react";

export default function ParallaxSection({ src }) {
  const ref = useRef(null);
//   const inView = useInView(ref, { once: false, margin: "0px 0px -100px 0px" });
//   const controls = useAnimation();

// useEffect(() => {
//   if (inView) {
//     controls.start({
//     //   scaleY: 1,
//     //   rotateX: 0,
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.5, ease: "easeOut" },
//     });
//   } else {
//     controls.start({
//     //   scaleY: 0.98,
//     //   rotateX: 10,
//       opacity: 0.5,
//       y: 50,
//       transition: { duration: 0.5, ease: "easeOut" },
//     });
//   }
// }, [inView, controls]);


  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], ["-35%", "35%"]);
  const y = useSpring(rawY, { damping: 25, stiffness: 100 });

  return (
        <div
        ref={ref}
        className="overflow-hidden shadow-lg"
        // initial={{ opacity: 0, y: 100 }}
        // animate={controls}
        >
        <Motion.img
            src={src}
            alt="Gallery"
            whileHover={{ scale: 0.9, transition: { duration: 0.5, ease: "easeInOut" } }}
            style={{ y }}
            className="w-full h-auto grayscale ease-in object-contain will-change-transform scale-150"
        />
        </div>
  );
}
