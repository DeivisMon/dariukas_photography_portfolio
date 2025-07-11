import { Link } from "react-router-dom"
import AnimatedText from "../utils/AnimatedText"

export default function NavBar() {
  return (
    <div className="fixed top-0 left-0 w-full bg-black/85 nav flex items-center justify-between px-6 py-4 z-1000 ">
      <div className="logo text-lg font-medium">
        <Link to="/">
          <AnimatedText text="Darius Zvinklys | Portfolio"  />
        </Link>
      </div>
      <div className="nav-links flex space-x-6 font-medium text-sm">
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
