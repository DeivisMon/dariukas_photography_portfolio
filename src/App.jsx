import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import Index from "./pages/Index"
import Work from "./pages/Work"
import WorkCategorie from "./components/WorkCategorie"
import Contact from "./pages/Contact"
import PageTransitions from "./components/PageTransitions"
import useLenis from "./components/hooks/useLenis";
import BlurryCursor from "./components/BlurryCursor"
export default function App() {
  useLenis()
  const location = useLocation()

  return (
    <>
      <AnimatePresence mode="wait">
        <PageTransitions key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Index />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:slug" element={<WorkCategorie />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        <BlurryCursor />
        </PageTransitions>
      </AnimatePresence>
    </>
  )
}
