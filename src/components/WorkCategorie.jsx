import { useParams } from "react-router-dom";
import { motion as M } from "framer-motion";

export default function WorkCategorie() {
  const { slug } = useParams();

  return (
    <M.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      className="min-h-screen flex flex-col items-center justify-center"
    >
      <h1 className="text-4xl font-bold mb-4">{slug}</h1>
      <p className="text-gray-500">More content for {slug} here...</p>
    </M.div>
  );
}
