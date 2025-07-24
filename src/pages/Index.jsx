import { motion as M } from "framer-motion";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ParallaxSection from "../components/test";
// import mockImages from "../data/images.json";

const mockImages = Array.from({ length: 100 }, (_, i) => {
  const width = 400;
  const height = Math.floor(Math.random() * (600 - 250) + 250); 

  return {
    src: `https://picsum.photos/${width}/${height}?random=${i + 1}`,
    width,
    height,
  };
});
export default function Index() {

  return (
    <>
      <main className="relative w-full">
        <NavBar />
        <div className="absolute top-0 left-0 font-thin flex items-center justify-center h-screen w-screen pointer-events-none">
          <M.p
            initial={{ scale: 5, opacity: 0 }}
            animate={{
              scale: [5, 4, 3, 2, 2],
              opacity: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
              transition: { duration: 0.7, delay: 0.1 },
            }}
            className="text-[12rem] font-medium text-shadow-lg absolute z-100"
          >
            Index
          </M.p>
        </div>

        <M.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 mb-100"
        >
          <div className="columns-1 sm:columns-2 lg:columns-4 gap-16 space-y-16 w-full">
            {mockImages.map((img, i) => (
              <div
                key={`${i}-${Math.random()}`}
                className="break-inside-avoid hover:grayscale-0"
              >
                <ParallaxSection src={img.src} />
              </div>
            ))}
          </div>
        </M.div>
        <Footer />
      </main>
    </>
  );
}
