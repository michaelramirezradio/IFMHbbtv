import React, { useEffect, useRef } from 'react';

interface AudioVisualizerCanvasProps {
  isPlaying: boolean;
  barColor?: string;
  height?: number;
}

export const AudioVisualizerCanvas: React.FC<AudioVisualizerCanvasProps> = ({
  isPlaying,
  barColor = '#3b82f6',
  height = 90,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const barCount = 36;
    const bars: number[] = new Array(barCount).fill(10);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const ch = canvas.height;
      const barWidth = (width / barCount) - 3;

      for (let i = 0; i < barCount; i++) {
        if (isPlaying) {
          // Dynamic random frequency simulation with smooth wave effect
          const targetHeight = Math.sin(Date.now() * 0.005 + i * 0.3) * (ch * 0.35) + (ch * 0.4) + Math.random() * 15;
          bars[i] += (targetHeight - bars[i]) * 0.2;
        } else {
          bars[i] += (4 - bars[i]) * 0.1;
        }

        const barH = Math.max(4, Math.min(ch - 4, bars[i]));
        const x = i * (barWidth + 3);
        const y = ch - barH;

        // Gradient bar
        const gradient = ctx.createLinearGradient(0, ch, 0, y);
        if (i % 3 === 0) {
          gradient.addColorStop(0, 'rgba(239, 68, 68, 0.8)'); // Red accent
          gradient.addColorStop(1, 'rgba(245, 158, 11, 0.9)'); // Yellow accent
        } else if (i % 3 === 1) {
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.8)'); // Green accent
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0.9)'); // Blue accent
        } else {
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
          gradient.addColorStop(1, 'rgba(147, 51, 234, 0.9)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
        ctx.fill();

        // Reflection
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(x, ch - 2, barWidth, 2);
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, barColor]);

  return (
    <div className="w-full relative overflow-hidden rounded-xl bg-slate-950/80 p-2 border border-slate-800/80 shadow-inner">
      <canvas
        ref={canvasRef}
        width={500}
        height={height}
        className="w-full h-auto block"
      />
    </div>
  );
};
