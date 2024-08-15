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
  typingSpeed = 50,
  eraseSpeed = 30,
  eraseDelay = 1500,
  typeDelay = 500,
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

export default TypingEffect;
