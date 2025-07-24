import {
  motion as Motion,
  useScroll,
  useTransform,
  useSpring,
  //   useInView,
  //   useAnimation,
} from "framer-motion";
import { useRef } from "react";

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
  const y = useSpring(rawY, { damping: 20, stiffness: 500 });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const grayscale = useTransform(scrollYProgress, [0, 1], [50, 0]);
  const blur = useTransform(scrollYProgress, [0, 1], [0.5, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.25, 0.8]);
  const hue = useTransform(scrollYProgress, [0, 1], [180, 0]);
  const finalFilter = useTransform(
    [grayscale, blur, hue],
    ([g, b, h]) => `grayscale(${g}%) blur(${b}px) hue-rotate(${h}deg)`
  );
  const opacity = useTransform(scrollYProgress, [0, 1], [0.4, 1]);

  return (
    <Motion.div
      ref={ref}
      className="overflow-hidden shadow-lg transition-all duration-300 ease-in-out"
    >
      <Motion.img
        src={src}
        alt="Gallery"
        style={{
          y,
          scale,
          opacity,
          filter: finalFilter,
          blur,
        }}
        className="image-hover w-full h-auto ease-in object-contain will-change-transform scale-125 hover:grayscale-0"
      />
    </Motion.div>
  );
}
