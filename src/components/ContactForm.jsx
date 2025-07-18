import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";

export default function ContactFrom() {
  const [isContactVisible, setIsContactVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getTransform = () => {
    if (isContactVisible) return "translate(0, 0)";
    return isMobile ? "translateY(100%)" : "translateX(100%)";
  };
  

  return (
    <Motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.8 } }}
      exit={{ opacity: 1, y: -50, transition: { duration: 0.5 } }}
      className="relative w-full h-[80vh] md:h-[80vh] overflow-hidden shadow-xl flex flex-col md:flex-row z-100 my-8"
    >
      {/* Slankiojantis Image */}
      <div
        className="absolute bg-cover bg-center bg-no-repeat transition-transform delay-300 duration-500 ease-[cubic-bezier(0.5, 0, 0.75, 0)] z-20 w-full h-1/2 md:w-1/2 md:h-full"
        style={{
          backgroundImage: "url('/images/contact.jpg')",
          transform: getTransform(),
        }}
      />

      {/* Form */}
      <div className="relative z-10 flex flex-col md:flex-row w-full h-full min-h-0">
        <div className="w-full flex-1 md:w-1/2 md:h-full flex flex-col items-center justify-center bg-gray-400 px-10 min-h-0">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Message Sent
            </h2>
            <p>Thank you! We’ll be in touch soon.</p>
            <button
              className="text-gray-600 font-bold py-2 mt-2 cursor-pointer"
              type="button"
              onClick={() => setIsContactVisible(!isContactVisible)}
            >
              Contact Again?
            </button>
        </div>

        <div className="w-full flex-1 md:w-1/2 md:h-full flex items-center justify-center bg-gray-400 px-10 min-h-0">
          <form className="flex flex-col lg:gap-2 w-full max-w-sm">
            <h2 className="text-5xl font-thin lg:mb-4 text-center">Contact Me</h2>
            <input
              className="p-2 border-b rounded-t-md font-thin focus:outline-none focus:bg-none" 
              placeholder="Name"
            />
            <input
              className="p-2 border-b rounded-t-md font-thin focus:outline-none focus:bg-none"
              type="email"
              placeholder="Email"
            />
            <input
              className="p-2 border-b rounded-t-md font-thin focus:outline-none focus:bg-none"
              placeholder="Your message"
            />
            <button
              className="bg-gray-300 group rounded-xs text-white font-bold mt-2 hover:bg-gray-200 cursor-pointer transition duration-300 ease-in-out"
              type="button"
              style={{padding: '8px 0'}}
              onClick={() => setIsContactVisible(!isContactVisible)}
            >
              <span className="group-hover:text-gray-500 transition duration-300 ease-in-out">
               Send
              </span>
            </button>
          </form>
        </div>
      </div>
    </Motion.div>
  );
}
