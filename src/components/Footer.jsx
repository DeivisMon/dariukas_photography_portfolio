import { useLocation } from "react-router-dom";
import AnimatedText from "../utils/AnimatedText";

export default function Footer() {
  const location = useLocation();

  return (
    <div className="footer fixed bottom-0 w-full flex items-end justify-start text-center bg-[#262626] h-4 border-t border-indigo-80/10 z-100">
      <footer className="w-full flex justify-center items-end">
        <span className="absolute mask-b-from-20% mask-b-to-80% left-3 text-7xl text-shadow-lg text-shadow-[#262626] flex-2 text-start ml-12">
          <AnimatedText text={location.pathname === "/" ? "/index" : location.pathname} duration={0.8} enableHover={false} />
        </span>
        <span className="text-center capitalize px-4 relative z-101">
          Darius Žvinklys. Copyright &copy; {new Date().getFullYear()} 
          {" "}
        </span>
      </footer>
    </div>
  );
}
