import NavBar from "../components/NavBar";
import { motion as M } from "framer-motion";

export default function Work() {
  return (
    <>
      <NavBar />
      <div className="relative font-bold flex items-center justify-center h-screen w-screen bg-[url('ttps://images.unsplash.com/photo-1750365866655-e712abd3ad46?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] no-repeat bg-cover">
        <M.p
          animate={{
            scale: [10, 8, 6, 5, 4, 3, 3],
            opacity: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            transition: { duration: 0.7, delay: 0.1 },
          }}
          className="text-[12rem] absolute text-white z-101 "
        >
          Work
        </M.p>
      </div>
    </>
  );
}
