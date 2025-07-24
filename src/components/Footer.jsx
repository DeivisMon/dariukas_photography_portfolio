import { useLocation } from "react-router-dom";
import AnimatedText from "../utils/AnimatedText";

export default function Footer() {
  const location = useLocation();

  return (
    <div className="footer fixed bottom-0 w-full flex items-start justify-start text-center bg-black/25 backdrop-blur h-4 z-100">
      <footer className="w-full flex justify-center items-start">
        <span className="absolute left-3 -bottom-1 text-7xl font-medium text-black flex-2 text-start ml-12 mix-blend-difference">
          <AnimatedText text={location.pathname === "/" ? "/index" : location.pathname} duration={0.8} enableHover={false} />
        </span>
        <span className="text-center capitalize px-4 -my-1 font-normal relative z-101">
          Darius Žvinklys. Copyright &copy; {new Date().getFullYear()} 
          {" "}
        </span>
      </footer>
    </div>
  );
}
