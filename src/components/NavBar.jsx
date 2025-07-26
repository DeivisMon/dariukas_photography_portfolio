import { Link, useLocation } from "react-router-dom";
import AnimatedText from "../utils/AnimatedText";
import SocialIcons from "./SocialIcons";

export default function NavBar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="navbar fixed top-0 left-0 w-full h-18 flex items-center justify-between bg-black/25 backdrop-blur-[5px] px-8 z-1000 overflow-hidden">
      <div className="logo flex-2 h-full flex items-center  px-4">
        <div className="logo-name relative nav-item flex items-start">
          <Link to="/">
            <div className="text-3xl font-normal mix-blend-difference">
              <AnimatedText text="Darius Žvinklys" />
            </div>
            {/* <span className="absolute left-1/2 top-[35px] -translate-x-1/2 -translate-y-1/2 font-normal opacity-70">
              <AnimatedText text="Photography" enableHover={false} />
            </span> */}
          </Link>
        </div>
        <div className="location nav-item flex flex-col items-center flex-1 ml-8 text-[0.7rem]">
          <AnimatedText text="Based in Lithuania," enableHover={false} />
          <AnimatedText text="Klaipėda" enableHover={false} />
        </div>
      </div>
      <div className="nav-links nav-item flex-1 flex justify-center items-center font-normal text-md">
        <Link className={`flex-1 flex justify-center items-center p-1 ${isActive("/") ? "border-b border-t clippath" : ""}`} to="/">
          <AnimatedText text="Index" duration={0.3} />
        </Link>
        <Link className={`flex-1 flex justify-center items-center p-1 ${isActive("/work") ? "border-b border-t" : ""}`} to="/work">
          <AnimatedText text="Work" duration={0.4} />
        </Link>
        <Link className={`flex-1 flex justify-center items-center p-1 ${isActive("/contact") ? "border-b border-t" : ""}`} to="/contact">
          <AnimatedText text="Contact" duration={0.5} />
        </Link>
      </div>
      <div className="email nav-item flex-2 px-4 py-2 flex justify-end font-normal lowercase">
        <Link to="/contact">
          <SocialIcons />
        </Link>
      </div>
    </div>
  );
}
