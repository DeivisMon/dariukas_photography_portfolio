import { useLocation } from "react-router-dom";
import AnimatedText from "../utils/AnimatedText";

export default function Footer() {
  const location = useLocation();

  return (
    <div className="footer fixed bottom-0 w-full flex items-end justify-start text-center bg-black/25 backdrop-blur h-4 border-t border-indigo-80/10 z-100">
      <footer className="w-full flex justify-center items-end">
        <span className="absolute mask-b-from-20% mask-b-to-95% left-3 bottom-2 text-7xl font-thin  text-black flex-2 text-start ml-12 mix-blend-difference">
          <AnimatedText text={location.pathname === "/" ? "/index" : location.pathname} duration={0.8} enableHover={false} />
        </span>
        <span className="text-center capitalize px-4 font-normal relative z-101">
          Darius Žvinklys. Copyright &copy; {new Date().getFullYear()} 
          {" "}
        </span>
      </footer>
    </div>
  );
}
