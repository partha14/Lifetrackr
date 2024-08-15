import React, { useState, useEffect } from 'react';

interface TypingEffectProps {
  texts: string[];
  typingSpeed?: number;
  eraseSpeed?: number;
  eraseDelay?: number;
  typeDelay?: number;
}

const TypingEffect: React.FC<TypingEffectProps> = ({
  texts,
  typingSpeed = 100, // Adjusted for a more user-friendly speed
  eraseSpeed = 50, // Adjusted for a smoother erase effect
  eraseDelay = 1500, // Delay before erasing
  typeDelay = 500, // Delay before typing the next text
}) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const typeText = () => {
      if (currentText.length < texts[currentIndex].length) {
        setCurrentText(texts[currentIndex].slice(0, currentText.length + 1));
        timeout = setTimeout(typeText, typingSpeed);
      } else {
        setIsTyping(false);
        timeout = setTimeout(pauseBeforeErase, eraseDelay);
      }
    };

    const pauseBeforeErase = () => {
      timeout = setTimeout(eraseText, 2000); // 2-second pause before erasing
    };

    const eraseText = () => {
      if (currentText.length > 0) {
        setCurrentText(currentText.slice(0, -1));
        timeout = setTimeout(eraseText, eraseSpeed);
      } else {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsTyping(true);
        timeout = setTimeout(typeText, typeDelay);
      }
    };

    if (isTyping) {
      typeText();
    } else if (currentText.length === 0) {
      timeout = setTimeout(typeText, typeDelay);
    } else {
      eraseText();
    }

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isTyping, texts, typingSpeed, eraseSpeed, eraseDelay, typeDelay]);

  return <span>{currentText}</span>;
};

export default TypingEffect;import React, { useEffect, useState } from 'react';
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
      duration: 3,
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
      onTextChange(v);
    });
    return unsubscribe;
  }, [displayText, onTextChange]);

  return (
    <motion.input
      value={displayText.get()}
      onChange={(e) => onTextChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className={className}
    />
  );
};

export default TypingEffect;
