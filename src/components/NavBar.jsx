import { Link } from "react-router-dom"
import AnimatedText from "../utils/AnimatedText"

export default function NavBar() {
  return (
    <div className="fixed top-0 left-0 w-full nav flex items-center justify-between px-6 py-4 z-1000 ">
      <div className="logo h-full backdrop-blur-[500px] flex items-center text-lg px-4 py-2 rounded-full font-medium">
        <Link to="/">
          <AnimatedText text="Darius Zvinklys | Portfolio"  />
        </Link>
      </div>
      <div className="nav-links px-4 py-2 backdrop-blur-[500px] rounded-full flex space-x-6 font-medium text-sm">
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
    </div>
  )
}
