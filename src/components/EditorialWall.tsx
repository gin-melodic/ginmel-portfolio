import { Code2 } from 'lucide-react';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { prepareWithSegments, layoutNextLine, type LayoutCursor, type PreparedTextWithSegments } from '@chenglou/pretext';
import { ScrambleText } from './ui/ScrambleText';
import { RAW_EXPERIENCE_TEXT } from '../Constant';

type Interval = { left: number; right: number };

function carveTextLineSlots(base: Interval, blocked: Interval[]): Interval[] {
  let slots = [base];
  for (let i = 0; i < blocked.length; i++) {
    const interval = blocked[i];
    const next: Interval[] = [];
    for (let j = 0; j < slots.length; j++) {
      const slot = slots[j];
      if (interval.right <= slot.left || interval.left >= slot.right) {
        next.push(slot);
        continue;
      }
      if (interval.left > slot.left) next.push({ left: slot.left, right: interval.left });
      if (interval.right < slot.right) next.push({ left: interval.right, right: slot.right });
    }
    slots = next;
  }
  return slots.filter(slot => slot.right - slot.left >= 40);
}

function getGObstacles(cx: number, cy: number, y: number): Interval[] {
  const R = 150;
  const r = 85;

  const dy = y - cy;
  if (Math.abs(dy) >= R) return [];

  const dx_out = Math.sqrt(R * R - dy * dy);
  const dx_in = Math.abs(dy) < r ? Math.sqrt(r * r - dy * dy) : 0;

  const isGap = dy < -10;
  const isCrossbar = dy >= -10 && dy <= 25;

  if (dx_in > 0) {
    const leftBlock = { left: cx - dx_out, right: cx - dx_in };
    if (isGap) {
      return [leftBlock];
    }
    if (isCrossbar) {
      return [leftBlock, { left: cx, right: cx + dx_out }];
    }
    return [leftBlock, { left: cx + dx_in, right: cx + dx_out }];
  } else {
    return [{ left: cx - dx_out, right: cx + dx_out }];
  }
}

export const EditorialWall = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const [contentHeight, setContentHeight] = useState(800);

  // Buffer pool to bypass React for max performance
  const domCache = useRef<{ lines: HTMLSpanElement[] }>({ lines: [] });

  const targetPos = useRef({ x: -1000, y: -1000 });
  const currentPos = useRef({ x: -1000, y: -1000 });
  const frameRef = useRef<number | null>(null);
  const preparedRef = useRef<PreparedTextWithSegments | null>(null);

  const MEASURE_FONT = 'bold 15px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
  const LINE_HEIGHT = 26;

  // Calculate required height based on width
  const updateHeight = (width: number) => {
    if (!preparedRef.current) return;

    let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
    let y = 0;
    let exhausted = false;

    // We do a dry run without obstacles to find the "base" height
    // Then add a buffer for the "G" shape reflow
    while (!exhausted) {
      const line = layoutNextLine(preparedRef.current, cursor, width);
      if (!line) {
        exhausted = true;
        break;
      }
      cursor = line.end;
      y += LINE_HEIGHT;
    }

    setContentHeight(y);
  };

  useEffect(() => {
    preparedRef.current = prepareWithSegments(RAW_EXPERIENCE_TEXT, MEASURE_FONT);

    if (containerRef.current) {
      updateHeight(containerRef.current.clientWidth);
    }

    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        updateHeight(entries[0].contentRect.width);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const animate = () => {
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.12;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.12;

      if (preparedRef.current && containerRef.current) {
        const cx = currentPos.current.x;
        const cy = currentPos.current.y;

        let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
        let y = 0;
        let lineIndex = 0;
        let exhausted = false;

        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;

        while (y + LINE_HEIGHT <= containerHeight && !exhausted) {
          const blocked = getGObstacles(cx, cy, y + LINE_HEIGHT / 2);
          const slots = carveTextLineSlots({ left: 0, right: containerWidth }, blocked);

          for (const slot of slots) {
            if (exhausted) break;
            const slotWidth = slot.right - slot.left;
            const line = layoutNextLine(preparedRef.current, cursor, slotWidth);

            if (!line) {
              exhausted = true;
              break;
            }

            if (lineIndex >= domCache.current.lines.length) {
              const el = document.createElement('span');
              el.className = 'absolute font-bold text-emerald-400 whitespace-pre pointer-events-none';
              el.style.font = `${MEASURE_FONT}`;
              el.style.lineHeight = `${LINE_HEIGHT}px`;
              containerRef.current.appendChild(el);
              domCache.current.lines.push(el);
            }

            const el = domCache.current.lines[lineIndex];
            el.style.display = 'block';
            el.style.left = `${slot.left}px`;
            el.style.top = `${y}px`;
            el.textContent = line.text;

            const isNearObstacle = blocked.length > 0 && Math.abs((y + LINE_HEIGHT / 2) - cy) < 180;
            el.style.color = isNearObstacle ? '#34d399' : '#262626';

            cursor = line.end;
            lineIndex++;
          }
          y += LINE_HEIGHT;
        }

        for (let i = lineIndex; i < domCache.current.lines.length; i++) {
          domCache.current.lines[i].style.display = 'none';
        }
      }

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${currentPos.current.x}px, ${currentPos.current.y}px) translate(-50%, -50%)`;
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    targetPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseLeave = () => {
    targetPos.current = { x: -1000, y: -1000 };
  };

  return (
    <section className="py-12 border-none relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <h2 className="text-2xl font-bold text-white mb-2 font-mono flex items-center gap-3">
          <Code2 size={20} className="text-emerald-500" />
          <ScrambleText text="/raw_experience_matrix" delay={100} duration={800} />
        </h2>
        <p className="text-neutral-500 font-mono text-sm">Interactive DOM-free Text Reflow powered by <a href='https://github.com/chenglou/pretext' target='_blank' rel='noopener noreferrer'>@chenglou/pretext.</a></p>
      </div>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative max-w-6xl mx-auto cursor-crosshair overflow-hidden px-6"
        style={{ height: contentHeight }}
      >
        <div
          ref={glowRef}
          className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none transition-opacity duration-500 z-0"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 60%)',
            filter: 'blur(10px)',
            willChange: 'transform'
          }}
        />
        {/* DOM Cache engine will inject nodes here directly */}
      </div>
    </section>
  );
};
