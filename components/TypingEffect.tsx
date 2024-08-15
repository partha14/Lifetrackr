import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface TypingEffectProps {
  texts: string[];
  onTextChange: (text: string) => void;
  placeholder: string;
  required: boolean;
  className: string;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ texts, onTextChange, placeholder, required, className }) => {
  const textIndex = useMotionValue(0);
  const baseText = useTransform(textIndex, (latest) => texts[latest] || "");
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) => baseText.get().slice(0, latest));
  const updatedThisRound = useMotionValue(true);

  useEffect(() => {
    const controls = animate(count, 60, {
      type: "tween",
      duration: 6, // Increased duration for slower typing
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse",
      repeatDelay: 1,
      onUpdate(latest) {
        if (updatedThisRound.get() === true && latest > 0) {
          updatedThisRound.set(false);
        } else if (updatedThisRound.get() === false && latest === 0) {
          if (textIndex.get() === texts.length - 1) {
            textIndex.set(0);
          } else {
            textIndex.set(textIndex.get() + 1);
          }
          updatedThisRound.set(true);
        }
      }
    });

    return controls.stop;
  }, []);

  useEffect(() => {
    const unsubscribe = displayText.onChange((v) => {
      if (typeof onTextChange === 'function') {
        onTextChange(v);
      }
    });
    return unsubscribe;
  }, [displayText, onTextChange]);

  return (
    <motion.input
      value={displayText.get()}
      onChange={(e) => {
        if (typeof onTextChange === 'function') {
          onTextChange(e.target.value);
        }
      }}
      placeholder={placeholder}
      required={required}
      className={`${className} bg-transparent border-none outline-none`}
    />
  );
};

export default TypingEffect;
