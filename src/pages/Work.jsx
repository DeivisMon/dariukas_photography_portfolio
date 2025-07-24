import NavBar from "../components/NavBar";
import WorkMenu from "../components/WorkMenu";
import Footer from "../components/Footer";
import { motion as M } from "framer-motion";

const mockImages = Array.from({ length: 30 }, (_, i) => ({
    src: `https://picsum.photos/1000/750?random=${i + 1}`
  }));

  const imageUrls = mockImages.map((image) => image.src);

const workLinks = [
  { link: '#', text: 'Renginai', image: imageUrls[0, 3] },
  { link: '#', text: 'Portretai', image: imageUrls[4, 7] },
  { link: '#', text: 'Diskotekos', image: imageUrls[2] },
  { link: '#', text: 'Veiksmas', image: imageUrls[3] },
  { link: '#', text: 'Koncertai', image: imageUrls[4] },
];


export default function Work() {
  return (
    <>
      <NavBar />
      <div className="relative font-thin flex items-center justify-center h-screen w-screen">
        <M.p
          initial={{ scale: 10, opacity: 0 }}
          animate={{
            scale: [10, 8, 6, 5, 4, 3, 3],
            opacity: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            transition: { duration: 0.7, delay: 0.1 },
          }}
          className="text-[12rem] font-medium text-shadow-lg absolute z-100"
        >
          Work
        </M.p>
        <M.div
          className="w-full"
          initial={{ opacity: 0, y: 150 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
        <WorkMenu items={workLinks} />
      </M.div>
      </div>
      <Footer />
    </>
  );
}
