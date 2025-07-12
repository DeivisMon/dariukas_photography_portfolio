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
    transition: { duration: 0.5, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -60,
    transition: { duration: 0.5, ease: "easeIn" },
  },
};

function MenuItem({ link, text, image }) {
  const itemRef = useRef(null);
  const marqueeRef = useRef(null);
  const marqueeInnerRef = useRef(null);
  const sliceRefs = useRef([]);
  const ctx = useRef(null);
  const slices = 24;

  sliceRefs.current = [];

  const setSliceRef = (el, i) => {
    if (el) sliceRefs.current[i] = el;
  };

  const animationDefaults = { duration: 0.6, ease: "expo.out" };

  const findClosestEdge = (mouseX, mouseY, width, height) => {
    const top = dist(mouseX, mouseY, width / 2, 0);
    const bottom = dist(mouseX, mouseY, width / 2, height);
    return top < bottom ? "top" : "bottom";
  };

  const dist = (x, y, x2, y2) => {
    const dx = x - x2;
    const dy = y - y2;
    return dx * dx + dy * dy;
  };

  const handleMouseEnter = (ev) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current)
      return;

    if (ctx.current) ctx.current.revert();

    const rect = itemRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    ctx.current = gsap.context(() => {
      gsap
        .timeline({ defaults: animationDefaults })
        .set(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" }, 0)
        .set(marqueeInnerRef.current, { y: edge === "top" ? "101%" : "-101%" }, 0)
        .to(
          [marqueeRef.current, marqueeInnerRef.current],
          { y: "0%" },
          0
        )
        .to(
          sliceRefs.current,
          {
            xPercent: 100,
            scaleX: 0,
            stagger: { amount: 0.2, from: "start" },
            overwrite: "auto",
          },
          0
        );
    }, itemRef);
  };

  const handleMouseLeave = (ev) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current)
      return;

    if (ctx.current) ctx.current.revert();

    const rect = itemRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    ctx.current = gsap.context(() => {
      gsap
        .timeline({ defaults: animationDefaults })
        .to(
          marqueeRef.current,
          { y: edge === "top" ? "-101%" : "101%" },
          0
        )
        .to(
          marqueeInnerRef.current,
          { y: edge === "top" ? "101%" : "-101%" },
          0
        )
        .to(
          sliceRefs.current,
          {
            xPercent: 0,
            scaleX: 1,
            stagger: { amount: 0.2, from: "end" },
            overwrite: "auto",
          },
          0
        );
    }, itemRef);
  };

  const repeatedMarqueeContent = (
    <M.div
      className="flex relative items-center w-full justify-between"
      initial="hidden"
      animate="show"
    >
      {Array.from({ length: slices }).map((_, i) => (
        <div
          key={i}
          ref={(el) => setSliceRef(el, i)}
          className="absolute top-0 h-full bg-white"
          style={{
            width: `${100 / slices}%`,
            left: `${(100 / slices) * i}%`,
            zIndex: 100,
          }}
        />
      ))}
      <span className="flex justify-start w-full px-8">
        <a>{text}</a>
      </span>
      <div
        className="marquee__img relative"
        style={{ width: "500px", height: "400px" }}
      >
        <img className="w-full h-full object-cover" src={image} alt="" />
      </div>
      <span className="relative px-7 z-101">
        <BsArrowDownLeftSquare size={200} />
      </span>
    </M.div>
  );

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
        <a className="menu__item-link">{text}</a>
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
