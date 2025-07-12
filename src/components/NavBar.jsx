import { useLocation } from "react-router-dom"
import { Link } from "react-router-dom"
import AnimatedText from "../utils/AnimatedText"
import SocialIcons from "./SocialIcons";

export default function NavBar() {
  const location = useLocation();

  return (
    <div className="navbar fixed top-0 left-0 w-full h-12 flex items-center justify-between backdrop-blur-[500px] px-8 z-1000 overflow-hidden">
      <div className="logo flex-1 h-full flex items-center text-2xl font-light px-4 py-2 rounded-full">
        <Link to="/">
          <AnimatedText text="Darius Žvinklys | Portfolio"  />
        </Link>
      </div>
      {location.pathname === "/work" || location.pathname === "/contact" ? (
      <div className="nav-links flex-1 px-4 rounded-full flex justify-center space-x-6 font-normal text-md">
        <Link to="/">
          <AnimatedText text="Index" duration={0.3} />
        </Link>
        <Link to="/work">
          <AnimatedText text="Work" duration={0.4} />
        </Link>
        <Link to="/contact">
          <AnimatedText text="Contact" duration={0.5} />
        </Link>
      </div>
      ) : null}
      <div className="email flex-1 px-4 py-2 rounded-full flex justify-end font-normal lowercase">
        <Link to="/contact">
          <SocialIcons />
        </Link>
      </div>
    </div>
  )
}
