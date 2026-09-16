"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const getTransformClass = () => {
    if (!isVisible) {
      switch (direction) {
        case "up":
          return "translate-y-12 opacity-0";
        case "down":
          return "-translate-y-12 opacity-0";
        case "left":
          return "translate-x-12 opacity-0";
        case "right":
          return "-translate-x-12 opacity-0";
        case "scale":
          return "scale-95 translate-y-8 opacity-0";
        default:
          return "translate-y-12 opacity-0";
      }
    }
    return "translate-y-0 translate-x-0 scale-100 opacity-100";
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${getTransformClass()} ${className}`}
    >
      {children}
    </div>
  );
}
