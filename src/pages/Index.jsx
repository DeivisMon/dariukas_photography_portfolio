import { useState } from "react";
import NavBar from "../components/NavBar";
import AnimatedText from "../utils/AnimatedText";
import { motion as M } from "framer-motion";
import DraggableGallery from "../components/IndexGallery";

export default function Index() {
  const [animationComplete, setAnimationComplete] = useState(false);

  return (
    <>
      <NavBar />
      <div className=" font-bold flex flex-col items-center justify-center h-screen w-screen">
        <div className="relative font-bold flex items-center justify-center h-screen w-screen no-repeat bg-cover">
          <M.p
            initial={{ scale: 6, opacity: 0 }}
            animate={{
              scale: [6, 5, 4, 3, 3],
              opacity: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
              transition: { duration: 0.8, delay: 0.2 },
            }}
            onAnimationComplete={() => setAnimationComplete(true)}
  className={`text-[12rem] absolute text-white ${animationComplete ? '' : 'z-102'}`}>
            Index
          </M.p>
        </div>
        <DraggableGallery />
      </div>
    </>
  );
}

