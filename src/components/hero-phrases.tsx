"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const PHRASES = ["Stalwart", "the 21st Century", "everyone", "your privacy", "power users"];

export function HeroPhrases() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % PHRASES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={PHRASES[phraseIndex]}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="inline-block bg-gradient-to-r from-primary via-primary to-primary bg-clip-text text-transparent"
      >
        {PHRASES[phraseIndex]}
      </motion.span>
    </AnimatePresence>
  );
}
