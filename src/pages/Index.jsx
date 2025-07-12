import { useState } from "react";
import { motion as M } from "framer-motion";
import NavBar from "../components/NavBar";
import CenterMenu from "../components/CenterMenu";
import Footer from "../components/Footer";
import DraggableGallery from "../components/IndexGallery";

export default function Index() {
  const [animationComplete, setAnimationComplete] = useState(false);

  return (
    <>
      <NavBar />
      <CenterMenu />
      <div className="font-bold flex flex-col items-center justify-center h-screen w-screen">
        <div className="relative font-bold flex items-center justify-center h-screen w-screen no-repeat bg-cover">
          <M.p
            initial={{ scale: 5, opacity: 0 }}
            animate={{
              scale: [5, 4, 3, 2, 2],
              opacity: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
              transition: { duration: 0.8, delay: 0.2 },
            }}
            onAnimationComplete={() => setAnimationComplete(true)}
            className={`text-[12rem] absolute mix-blend-difference ${
              animationComplete ? "" : "z-102"
            }`}
          >
            Index
          </M.p>
        </div>
        <M.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <DraggableGallery />
        </M.div>
      </div>
      <Footer />
    </>
  );
}
