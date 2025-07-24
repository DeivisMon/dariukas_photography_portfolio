import { motion as M } from "framer-motion";
import { useEffect, useState } from "react";

const blockDelay = (rowIndex, totalRows) => {
  const blockDelay = Math.random() * 0.25;
  const rowDelay = (totalRows - rowIndex - 1) * 0.05;
  return blockDelay + rowDelay;
};

export default function PageTransitions({ children }) {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      {/* Transition-in (will animate on enter) */}
      {isAnimating && (
        <div className="blocks-container transition-in fixed top-0 left-0 w-full h-full flex flex-col pointer-events-none z-100">
          {Array.from({ length: 8 }).map((_, rowIndex) => (
            <div key={rowIndex} className="row flex flex-1 w-full ">
              {Array.from({ length: 16 }).map((_, blockIndex) => (
                <M.div
                  key={blockIndex}
                  className="block relative flex-1 bg-black/85 m-[-0.25px] origin-top inset-shadow-xl mix-blend-difference"
                  initial={{ scaleY: 1, rotateX: 0 }}
                  animate={{ scaleY: 0, rotateX: 360 }}
                  transition={{
                    duration: 1.25,
                    ease: "easeInOut",
                    delay: blockDelay(rowIndex, 8),
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      <M.div
        className="relative z-10"
        // initial={{ y: -100, opacity: 0 }}
        // animate={{
        //   y: 0,
        //   opacity: 1,
        //   transition: { duration: 0.25, delay: 0.5 },
        // }}
        // exit={{
        //   y: -100,
        //   opacity: 0,
        //   transition: { duration: 0.25, delay: 0.5 },
        // }}
      >
        {children}
      </M.div>

      {/* Transition-out (will animate on exit) */}
      <div className="blocks-container transition-out fixed top-0 left-0 w-full h-full flex flex-col pointer-events-none z-100">
        {Array.from({ length: 8 }).map((_, rowIndex) => (
          <div key={rowIndex} className="row flex flex-1 w-full">
            {Array.from({ length: 16 }).map((_, blockIndex) => (
              <M.div
                key={blockIndex}
                className="block relative flex-1 bg-black m-[-0.25px] origin-bottom inset-shadow-xl mix-blend-difference"
                initial={{ scaleY: 0, rotateX: -360 }}
                animate={{ scaleY: 0, rotateX: -360 }}
                exit={{ scaleY: 1, rotateX: 0 }}
                transition={{
                  duration: 0.75,
                  ease: "easeInOut",
                  delay: blockDelay(rowIndex, 8),
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
