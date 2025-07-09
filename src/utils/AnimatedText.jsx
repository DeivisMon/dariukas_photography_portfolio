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
  hidden: { x: "-100%", skewX: 45, opacity: 0 },
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
}) => {
  const container = getContainer(delayChildren, staggerChildren)
  const letter = getLetter(duration)

  return (
    <div className="inline-block">
      <M.span
        className="inline-flex overflow-hidden"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {text.split("").map((char, i) => (
          <M.span
            key={char + i}
            className="block overflow-hidden"
            style={{ display: "inline-block", lineHeight: "1em" }}
          >
            <M.span
              variants={letter}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </M.span>
          </M.span>
        ))}
      </M.span>
    </div>
  )
}

export default AnimatedText
