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
  typingSpeed = 50, // Increased typing speed
  eraseSpeed = 30, // Increased erasing speed
  eraseDelay = 1500,
  typeDelay = 500,
}) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      if (currentText.length < texts[currentIndex].length) {
        timeout = setTimeout(() => {
          setCurrentText(texts[currentIndex].slice(0, currentText.length + 1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => setIsTyping(false), eraseDelay);
      }
    } else {
      if (currentText.length > 0) {
        timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, eraseSpeed);
      } else {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        timeout = setTimeout(() => setIsTyping(true), typeDelay);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isTyping, texts, typingSpeed, eraseSpeed, eraseDelay, typeDelay]);

  return <span>{currentText}</span>;
};

export default TypingEffect;
