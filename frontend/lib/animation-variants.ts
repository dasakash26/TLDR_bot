import { motion, type Variants } from "framer-motion";

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

export const fadeInStagger: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const cardHoverVariant: Variants = {
  hover: { y: -2 },
  tap: { scale: 0.98 },
};

export const listItemSlideVariant: Variants = {
  hover: { x: 2 },
};
