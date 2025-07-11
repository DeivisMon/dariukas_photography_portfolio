import { motion as M } from "framer-motion"

const getContainer = (delayChildren, staggerChildren) => ({
  hidden: {},
  show: {
    transition: {
      delayChildren,
      staggerChildren,
    },
  },
})

const getLetter = (duration) => ({
  hidden: {
    x: "-100%",
    skewX: 45,
    opacity: 0
  },
  show: {
    x: "0%",
    skewX: 0,
    opacity: 1,
    transition: {
      duration,
      ease: [0.25, 1, 0.5, 1],
    },
  },
})


const AnimatedText = ({ 
  text, 
  duration = 0.35, 
  delayChildren = 1.2, 
  staggerChildren = 0.025,
  hoverStagger = 0.025,
  className = "",
  enableHover = true
}) => {
  const container = getContainer(delayChildren, staggerChildren)
  const letter = getLetter(duration)

  return (
    <div className={`inline-block ${className}`}>
      <M.span
        className="inline-flex overflow-hidden relative cursor-pointer"
        variants={container}
        initial="hidden"
        animate="show"
        whileHover={enableHover ? "hover" : undefined}
      >
        {/* Main text with entry animation */}
        <span className="block">
          {text.split("").map((char, i) => (
            <M.span
              key={`main-${char}-${i}`}
              className="block overflow-hidden relative"
              style={{ display: "inline-block", lineHeight: "1em" }}
            >
              <M.span
                variants={{
                  ...letter,
                  hover: enableHover ? { y: "-100%" } : {},
                }}
                className="inline-block"
                transition={{
                  ...letter.show.transition,
                  ...(enableHover && {
                    duration: 0.18,
                    ease: "easeInOut",
                    delay: hoverStagger * i,
                  })
                }}
              >
                {char === " " ? "\u00A0" : char}
              </M.span>
            </M.span>
          ))}
        </span>

        {/* Hover duplicate text */}
        {enableHover && (
          <span className="absolute inset-0 block">
            {text.split("").map((char, i) => (
              <M.span
                key={`hover-${char}-${i}`}
                className="block overflow-hidden"
                style={{ display: "inline-block", lineHeight: "1em" }}
              >
                <M.span
                  variants={{
                    hidden: { y: "100%" },
                    show: { y: "100%" },
                    hover: { y: 0 },
                  }}
                  className="inline-block"
                  transition={{
                    duration: 0.25,
                    ease: "easeInOut",
                    delay: hoverStagger * i,
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </M.span>
              </M.span>
            ))}
          </span>
        )}
      </M.span>
    </div>
  )
}

export default AnimatedText