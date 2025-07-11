import React from 'react';
import '../assets/styles/WorkMenu.css';
import { gsap } from 'gsap';
import { motion as M } from 'framer-motion';


export default function WorkMenu({ items = [] }) {
  return (
    <div className="menu-wrap fixed inset-0 m-auto z-102">
      <nav className="menu">
        {items.map((item, idx) => (
          <MenuItem key={idx} {...item} />
        ))}
      </nav>
    </div>
  );
}

function MenuItem({ link, text, image }) {
  const itemRef = React.useRef(null);
  const marqueeRef = React.useRef(null);
  const marqueeInnerRef = React.useRef(null);

  const animationDefaults = { duration: 0.6, ease: 'expo' };

  const findClosestEdge = (mouseX, mouseY, width, height) => {
    const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0);
    const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height);
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  };

  const distMetric = (x, y, x2, y2) => {
    const xDiff = x - x2;
    const yDiff = y - y2;
    return xDiff * xDiff + yDiff * yDiff;
  };

  const handleMouseEnter = (ev) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    gsap.timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
  };

  const handleMouseLeave = (ev) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    gsap.timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0);
  };

  const repeatedMarqueeContent = Array.from({ length: 1 }).map((_, idx) => (
    <React.Fragment key={idx}>
        <div className="flex items-center justify-between">
            <span className='flex justify-center items-center px-8' >{text}</span>
            <div
                className="marquee__img flex items-center justify-center"
                // style={{ backgroundImage: `url(${image})` }}
            >
                <img src={image} alt="" />
            </div>
        </div>
    </React.Fragment>
  ));

  const intoView = {
    initial: { opacity: 0, y: 200 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  };
  

  return (
    <M.div variants={intoView} className="menu__item group flex items-center" ref={itemRef}>
      <div className='text-[6vh] mx-2 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition ease-in-out duration-200'>{'>>'}</div>
      <a
        className="menu__item-link px-7"
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {text}
      </a>
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

