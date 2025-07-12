import { Link } from "react-router-dom";
import AnimatedText from "../utils/AnimatedText";

export default function CenterMenu() {
  return (
    <>
      <div className="nav-links fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 h-[66px] overflow-hidden backdrop-blur-[500px] w-full flex justify-center items-center font-medium z-1000">
        <Link className="flex-1 text-center text-[10vh]" to="/">
          <AnimatedText text="Index" duration={0.4} />
        </Link>
        <Link className="flex-1 text-center text-[10vh]" to="/work">
          <AnimatedText text="Work" duration={0.5} />
        </Link>
        <Link className="flex-1 text-center text-[10vh]" to="/contact">
          <AnimatedText text="Contact" duration={0.4} />
        </Link>
      </div>
    </>
  );
}
