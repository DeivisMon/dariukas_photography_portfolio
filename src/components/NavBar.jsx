import { Link } from "react-router-dom"
import AnimatedText from "../utils/AnimatedText"
import SocialIcons from "./SocialIcons";

export default function NavBar() {

  return (
    <div className="navbar fixed top-0 left-0 w-full h-18 flex items-center justify-between bg-[#262626] px-8 z-1000 overflow-hidden">
      <div className="logo flex-2 h-full flex items-center text-3xl font-light px-4">
        <Link to="/">
          <AnimatedText text="Darius Žvinklys"  />
        </Link>
      <div className="location flex flex-col items-start flex-1 px-4 text-[0.7rem]">
        <AnimatedText text="Based in Lithuania," enableHover={false} />
        <AnimatedText text="Klaipėda" enableHover={false} />
      </div>
      </div>
      <div className="nav-links flex-1 flex justify-center items-start font-normal text-md">
        <Link className="flex-1 flex justify-end" to="/">
          <AnimatedText text="Index" duration={0.3} />
        </Link>
        <Link className="flex-1 flex justify-center" to="/work">
          <AnimatedText text="Work" duration={0.4} />
        </Link>
        <Link className="flex-1 flex justify-start" to="/contact">
          <AnimatedText text="Contact" duration={0.5} />
        </Link>
      </div>
      <div className="email flex-2 px-4 py-2 flex justify-end font-normal lowercase">
        <Link to="/contact">
          <SocialIcons />
        </Link>
      </div>
    </div>
  )
}
