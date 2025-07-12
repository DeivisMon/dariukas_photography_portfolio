import { useLocation } from "react-router-dom";
import AnimatedText from "../utils/AnimatedText";

export default function Footer() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 w-full flex items-end justify-start text-center backdrop-blur-[20px] h-16 bg-indigo-80 z-10">
      <footer className="w-full flex justify-evenly items-end">
        <span className="text-7xl flex-1">
          <AnimatedText text={location.pathname} duration={0.8} enableHover={false} />
        </span>
        <span className="flex-2 capitalize">
          Darius Žvinklys. Copyright &copy; 2025 --- dariuszvinklys.com ---
          dariuszvinklys@gmail.com{" "}
        </span>
        <span className="text-2xl flex-1"></span>
      </footer>
    </div>
  );
}
