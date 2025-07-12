import { Link } from "react-router-dom";
import { motion as M } from "framer-motion";
import AnimatedText from "../utils/AnimatedText";

export default function CenterMenu() {

  const shrinkAnimation = {
    initial: { scaleY: 0 },
    animate: { scaleY: 1 },
    transition: { duration: 0.4, delay: 1.2, ease: "easeInOut" },
  };

  return (
    <>
      <M.div 
        {...shrinkAnimation}
        className="nav-links fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 h-[66px] overflow-hidden backdrop-blur-[500px] w-full flex justify-center items-center font-medium z-101"
      >
        <Link className="flex-1 text-center text-[10vh]" to="/">
          <AnimatedText text="Index" duration={0.4} delayChildren={1.5} hoverStagger={0.05} />
        </Link>
        <Link className="flex-1 text-center text-[10vh]" to="/work">
          <AnimatedText text="Work" duration={0.5} delayChildren={1.5} />
        </Link>
        <Link className="flex-1 text-center text-[10vh]" to="/contact">
          <AnimatedText text="Contact" duration={0.4} delayChildren={1.5} />
        </Link>
      </M.div>
    </>
  );
}