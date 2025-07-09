import NavBar from "../components/NavBar";
import ContactFrom from "../components/ContactForm";
import { motion as M } from "framer-motion";


export default function Contact() {
  return (
    <>
      <NavBar />
      <div className="relative font-bold flex flex-col items-center justify-center h-screen w-screen">
        <M.p animate={{scale: [8, 7, 5, 4, 3, 3], opacity: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0], transition: { duration: 0.7, delay: 0.05 }}} className="text-[12rem] text-shadow-lg absolute text-white z-100 ">Contact</M.p>
        <ContactFrom />
      </div>
    </>
  );
}
