"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function TopLogos() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 left-4 sm:top-6 sm:left-6 z-30 pointer-events-none"
        aria-hidden
      >
        <Image
          src="/logo-vyncent.png"
          alt="Vyncent Ledoux"
          width={520}
          height={96}
          priority
          className="h-7 sm:h-9 w-auto"
          style={{ filter: "brightness(0) invert(1)", opacity: 0.92 }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-30 pointer-events-none"
        aria-hidden
      >
        <Image
          src="/logo-remax.png"
          alt="RE/MAX"
          width={300}
          height={188}
          priority
          className="h-6 sm:h-8 w-auto"
          style={{ filter: "brightness(0) invert(1)", opacity: 0.88 }}
        />
      </motion.div>
    </>
  );
}
