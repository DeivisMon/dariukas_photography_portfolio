import { motion as M } from "framer-motion";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import DraggableGallery from "../components/IndexGallery";
import MasonryGallery from "../components/MasonryGallery";
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
        <div className="absolute top-0 left-0 font-bold flex items-center justify-center h-screen w-screen pointer-events-none">
          <M.p
            initial={{ scale: 5, opacity: 0 }}
            animate={{
              scale: [5, 4, 3, 2, 2],
              opacity: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
              transition: { duration: 0.7, delay: 0.1 },
            }}
            className={`text-[12rem] absolute mix-blend-difference `}
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
          {/* <DraggableGallery /> */}
          {/* <MasonryGallery /> */}
          <div className="columns-1 sm:columns-2 lg:columns-4 gap-1 space-y-1 w-full">
            {mockImages.map((img, idx) => (
              <div
                key={`${idx}-${Math.random()}`}
                className="break-inside-avoid"
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
