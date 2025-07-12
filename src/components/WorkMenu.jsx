import React, { useRef } from "react";
import "../assets/styles/WorkMenu.css";
import { gsap } from "gsap";
import { motion as M } from "framer-motion";
import { BsArrowUpRightSquare, BsArrowDownLeftSquare } from "react-icons/bs";

export default function WorkMenu({ items = [] }) {
  return (
    <div className="w-full relative z-100">
      <M.nav variants={containerVariants} initial="hidden" animate="show">
        {items.map((item, idx) => (
          <MenuItem key={idx} {...item} />
        ))}
      </M.nav>
    </div>
  );
}

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.6,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -60,
    transition: {
      duration: 0.5,
      ease: "easeIn",
    },
  },
};

function MenuItem({ link, text, image }) {
  const itemRef = useRef(null);
  const marqueeRef = useRef(null);
  const marqueeInnerRef = useRef(null);
  const sliceRef = useRef([]);
  const animationDefaults = { duration: 0.6, ease: "expo" };

  const findClosestEdge = (mouseX, mouseY, width, height) => {
    const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0);
    const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height);
    return topEdgeDist < bottomEdgeDist ? "top" : "bottom";
  };

  const distMetric = (x, y, x2, y2) => {
    const xDiff = x - x2;
    const yDiff = y - y2;
    return xDiff * xDiff + yDiff * yDiff;
  };

  const handleMouseEnter = (ev) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current)
      return;
    const rect = itemRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" }, 0)
      .set(marqueeInnerRef.current, { y: edge === "top" ? "101%" : "-101%" }, 0)
      .to(
        sliceRef.current,
        {
          xPercent: 100,
          scaleX: 0,
          stagger: {
            amount: 0.5,
            from: "start",
          },
          // duration: 0.5,
          // ease: "expo.out",
        },
        0
      )
      .to([marqueeRef.current, marqueeInnerRef.current], { y: "0%" }, 0)
  };

  const handleMouseLeave = (ev) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current)
      return;
    const rect = itemRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .to(
        sliceRef.current,
        {
          xPercent: 0,
          scaleX: 1,
          // duration: 0.05,
          // ease: "expo.inOut",
          stagger: {
            amount: 0.05,
            from: "end",
          },
        },
        0
      )
      .to(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" }, 0)
      .to(marqueeInnerRef.current, { y: edge === "top" ? "101%" : "-101%" }, 0)
  };

  const slices = 24;

  const repeatedMarqueeContent = Array.from({ length: 1 }).map((_, idx) => (
    <React.Fragment key={idx}>
      <M.div
        className="flex relative items-center w-full justify-between"
        initial="hidden"
        animate="show"
      >
        {Array.from({ length: slices }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 h-full bg-white"
            style={{
              width: `${100 / slices}%`,
              left: `${(100 / slices) * i}%`,
              zIndex: 100,
            }}
            ref={(el) => {
              if (el) sliceRef.current[i] = el;
            }}
          />
        ))}
        <span className="flex justify-start  w-[100%] px-8">
          <a>{text}</a>
        </span>
        <div
          className="marquee__img relative"
          style={{ width: "500px", height: "400px" }}
        >
          <img className="w-full h-full object-cover" src={image} alt="" />
        </div>
        <span className="relative  px-7 z-101">
          <BsArrowDownLeftSquare size={200} />
        </span>
      </M.div>
    </React.Fragment>
  ));

  return (
    <M.div
      variants={itemVariants}
      className="menu__item flex items-center h-30"
      ref={itemRef}
      href={link}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="flex items-center w-full justify-between px-7">
        <a className="menu__item-link ">{text}</a>
        <BsArrowUpRightSquare size={200} />
      </span>
      <div className="marquee" ref={marqueeRef}>
        <div className="marquee__inner-wrap" ref={marqueeInnerRef}>
          <div className="marquee__inner" aria-hidden="true">
            {repeatedMarqueeContent}
          </div>
        </div>
      </div>
    </M.div>
  );
}
