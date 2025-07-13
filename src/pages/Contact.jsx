import NavBar from "../components/NavBar";
import ContactFrom from "../components/ContactForm";
import Footer from "../components/Footer";
import { motion as M } from "framer-motion";

export default function Contact() {
  return (
    <>
      <NavBar />
      <div className="relative font-bold flex flex-col items-center justify-center h-screen w-screen">
        <M.p
          initial={{ scale: 6, opacity: 0 }}
          animate={{
            scale: [ 6, 5, 4, 3, 3],
            opacity: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            transition: { duration: 0.7, delay: 0.05 },
          }}
          className="text-[8rem] text-shadow-lg absolute z-100 "
        >
          Contact
        </M.p>
        <ContactFrom />
      </div>
      <Footer />
    </>
  );
}
