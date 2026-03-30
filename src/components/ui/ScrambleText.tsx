import { useState, useEffect, useRef, useCallback, type ElementType } from 'react';

const chars = '░▒▓█▄▀■abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>-_\\/[]{}—=+*^?#_';

export interface ScrambleTextProps {
  text: string;
  delay?: number;
  duration?: number;
  onHover?: boolean;
  className?: string;
  as?: ElementType;
}

export const ScrambleText = ({
  text,
  delay = 0,
  duration = 800,
  onHover = false,
  className = "",
  as: Component = "span"
}: ScrambleTextProps) => {
  const [content, setContent] = useState(onHover ? text : '');
  const isAnimating = useRef(false);
  const frameRef = useRef<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const nodeRef = useRef<HTMLElement | null>(null);

  const triggerAnimation = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    let start: number | undefined;
    let lastUpdate = 0;

    const tick = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;

      if (timestamp - lastUpdate < 30 && elapsed < delay + duration) {
        frameRef.current = requestAnimationFrame(tick);
        return;
      }
      lastUpdate = timestamp;

      let progress = 0;
      if (elapsed > delay) {
        const linearProgress = Math.min((elapsed - delay) / duration, 1);
        progress = 1 - Math.pow(1 - linearProgress, 4);
      }

      let newText = '';
      const revealIndex = Math.floor(progress * text.length);

      for (let i = 0; i < text.length; i++) {
        if (i < revealIndex) {
          newText += text[i];
        } else if (text[i] === ' ') {
          newText += ' ';
        } else {
          newText += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      setContent(newText);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setContent(text);
        isAnimating.current = false;
      }
    };

    frameRef.current = requestAnimationFrame(tick);
  }, [text, delay, duration]);

  useEffect(() => {
    if (!onHover) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            triggerAnimation();
            observerRef.current?.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      if (nodeRef.current && observerRef.current) {
        observerRef.current.observe(nodeRef.current);
      }
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [onHover, triggerAnimation]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const initialPlaceholder = text.replace(/[^\s]/g, '░');

  return (
    <Component
      ref={nodeRef}
      className={className}
      onMouseEnter={onHover ? triggerAnimation : undefined}
      style={{ display: 'inline-block', minWidth: onHover ? 'auto' : `${text.length}ch` }}
    >
      {content || initialPlaceholder}
    </Component>
  );
};
