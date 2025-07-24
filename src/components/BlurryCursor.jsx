import { useRef } from "react";
import { useCursor } from "./hooks/useCursor";
import { useImageHover } from "./hooks/useImageHover";
import { useMenuHover } from "./hooks/useMenuHover";
import { useNavHover } from "./hooks/useNavHover";
import { BsArrowUpRightSquare } from "react-icons/bs";
import { MdOutlineOpenWith } from "react-icons/md";
import { GiAbstract013 } from "react-icons/gi";

export default function BlurryCursor() {
  const cursorRef = useRef(null);

  useCursor(cursorRef);
  useImageHover(cursorRef);
  useMenuHover(cursorRef);
  useNavHover(cursorRef);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[1000] flex items-center justify-center w-4 h-4 rounded-full border-3 border-white mix-blend-difference transition-all duration-300 ease-out"
      style={{
        backgroundColor: "transparent",
        willChange: "transform, width, height, background-color",
      }}
    >
      <span
        className="cursor-text absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 transition-opacity duration-200 ease mix-blend-difference will-change-transform"
        style={{ color: "white", fontSize: "2.5rem", fontWeight: "900" }}
      >
        <MdOutlineOpenWith />
      </span>
      {/* <span
        className="cursor-text absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin pointer-events-none opacity-0 transition-opacity duration-200 ease mix-blend-difference will-change-transform"
        style={{ color: "white", fontSize: "2.8rem", fontWeight: "400" }}
      >
        <GiAbstract013 />
      </span> */}
       <span
        className="cursor-arrow absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 transition-opacity duration-200 ease mix-blend-difference will-change-transform"
        style={{ color: "white", fontSize: "4rem", fontWeight: "900" }}
      >
        <BsArrowUpRightSquare />
      </span>
    </div>
  );
}
