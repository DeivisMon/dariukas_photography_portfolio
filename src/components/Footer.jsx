import { useLocation } from "react-router-dom";
import AnimatedText from "../utils/AnimatedText";

export default function Footer() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 w-full flex items-end justify-start text-center backdrop-blur-[20px] h-16 bg-indigo-80 z-100">
      <footer className="w-full flex justify-between items-end">
        <span className="text-7xl flex-2 text-start ml-12">
          <AnimatedText text={location.pathname === "/" ? "/index" : location.pathname} duration={0.8} enableHover={false} />
        </span>
        <span className="flex-1 capitalize">
          Darius Žvinklys. Copyright &copy; {new Date().getFullYear()} 
          {" "}
        </span>
        <span className="text-2xl flex-2"></span>
      </footer>
    </div>
  );
}
