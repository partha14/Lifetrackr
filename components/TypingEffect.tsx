import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface TypingEffectProps {
  texts: string[];
  onTextChange?: (text: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  typingSpeed?: number;
  eraseSpeed?: number;
  eraseDelay?: number;
  typeDelay?: number;
}

const TypingEffect: React.FC<TypingEffectProps> = ({
  texts,
  onTextChange,
  placeholder = "",
  required = false,
  className = "",
  typingSpeed = 50,
  eraseSpeed = 50,
  eraseDelay = 2000,
  typeDelay = 1000
}) => {
  const [textIndex, setTextIndex] = useState(0);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) => texts[textIndex].slice(0, latest));

  useEffect(() => {
    const controls = animate(count, texts[textIndex].length, {
      type: "tween",
      duration: texts[textIndex].length * (60 / typingSpeed),
      ease: "linear",
      onComplete: () => {
        setTimeout(() => {
          animate(count, 0, {
            duration: texts[textIndex].length * (60 / eraseSpeed),
            ease: "linear",
            onComplete: () => {
              setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
            }
          });
        }, eraseDelay);
      }
    });

    return controls.stop;
  }, [textIndex, texts, typingSpeed, eraseSpeed, eraseDelay]);

  useEffect(() => {
    const unsubscribe = displayText.onChange((v) => {
      if (typeof onTextChange === 'function') {
        onTextChange(v);
      }
    });
    return unsubscribe;
  }, [displayText, onTextChange]);

  return (
    <motion.span
      className={`${className} inline-block w-full h-full`}
    >
      {displayText}
    </motion.span>
  );
};

export default TypingEffect;
