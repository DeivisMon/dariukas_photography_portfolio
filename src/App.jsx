import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import Index from "./pages/Index"
import Work from "./pages/Work"
import Contact from "./pages/Contact"
import PageTransitions from "./components/PageTransitions"

export default function App() {
  const location = useLocation()

  return (
    <>
      <AnimatePresence mode="wait">
        <PageTransitions key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Index />} />
            <Route path="/work" element={<Work />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </PageTransitions>
      </AnimatePresence>
    </>
  )
}
