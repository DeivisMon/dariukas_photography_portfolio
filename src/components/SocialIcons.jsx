import { motion as Motion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, 
      delayChildren: 1.2,   
    },
  },
};

const iconVariants = {
  hidden: { x: '100%', opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.175, 0.885, 0.32, 1.275], // Approx. back.out(1)
    },
  },
};

export default function SocialIcons() {
  const icons = [
    { id: "facebook", icon: <FaFacebookF />, label: "Facebook" },
    { id: "instagram", icon: <FaInstagram />, label: "Instagram" },
    { id: "x", icon: <FaXTwitter />, label: "X" },
  ];

  return (
    <Motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="social-icons flex"
    >
      {icons.map(({ id, icon, label }) => (
        <Motion.div
          key={id}
          variants={iconVariants}
          whileHover={{ scale: 1.2, transition: { duration: 0.3, ease: "easeInOut" } }}
          className="hover:text-white"
          style={{ fontSize: 24, cursor: "pointer", padding: "0 10px",  }}
          aria-label={label}
        >
          {icon}
        </Motion.div>
      ))}
    </Motion.div>
  );
}
