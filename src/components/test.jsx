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

//   const x = useTransform(scrollYProgress, [0, 1], ["5%", "10%"]);
  const y = useTransform(scrollYProgress, [0, 1], ["-35%", "35%"]);
  //   const y = useSpring(rawY, { damping: 20, stiffness: 100 });

  // Add grayscale from 100% to 0% as it enters
  const grayscale = useTransform(scrollYProgress, [0, 1], [50, 100]); // output numeric
  const blur = useTransform(scrollYProgress, [0, 1], [0.5, 0]);
const filter = useTransform(
  [grayscale, blur],
  ([g, b]) => `grayscale(${g}%) blur(${b}px)`
);

  // Optional: scale from 1.1 to 1
  const scale = useTransform(scrollYProgress, [0, 1], [1.25, 0.8]);

  // Optional: fade in
    // const opacity = useTransform(scrollYProgress, [0, 1], [0.4, 1]);

  return (
    <Motion.div
      ref={ref}
      className="overflow-hidden shadow-lg transition-all duration-300 ease-in-out"
      // initial={{ opacity: 0, y: 100 }}
      // animate={controls}
      style={{}}
    >
      <Motion.img
        src={src}
        alt="Gallery"
        // whileHover={{
        //   scale: 0.9,
        //   transition: { duration: 0.5, ease: [0.36, 0, 0.66, -0.56] },
        // }}
        style={{
          y,
          scale,
            // opacity,
          filter,
          blur
        }}
        className="image-hover w-full h-auto ease-in object-contain will-change-transform scale-125"
      />
    </Motion.div>
  );
}
