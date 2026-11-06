import React, { useRef, useState, useEffect } from 'react';
import { DrawingStroke, DrawingPoint } from '../../types/document';

interface DrawingCanvasProps {
  width: number;
  height: number;
  activeTool: 'pen' | 'highlighter' | 'eraser' | null;
  strokeColor: string;
  strokeWidth: number;
  strokes: DrawingStroke[];
  onUpdateStrokes: (strokes: DrawingStroke[]) => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  width,
  height,
  activeTool,
  strokeColor,
  strokeWidth,
  strokes,
  onUpdateStrokes,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<DrawingPoint[]>([]);

  // Redraw all strokes on canvas
  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Render saved strokes
    strokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = stroke.width;
      ctx.strokeStyle = stroke.color;
      ctx.globalAlpha = stroke.isHighlighter ? 0.35 : 1.0;

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });

    // Render current active stroke
    if (currentPoints.length > 1 && activeTool && activeTool !== 'eraser') {
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = strokeWidth;
      ctx.strokeStyle = strokeColor;
      ctx.globalAlpha = activeTool === 'highlighter' ? 0.35 : 1.0;

      ctx.moveTo(currentPoints[0].x, currentPoints[0].y);
      for (let i = 1; i < currentPoints.length; i++) {
        ctx.lineTo(currentPoints[i].x, currentPoints[i].y);
      }
      ctx.stroke();
    }
  };

  useEffect(() => {
    redraw();
  }, [strokes, currentPoints, width, height]);

  if (!activeTool && strokes.length === 0) {
    return null;
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!activeTool) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'eraser') {
      // Remove strokes near (x, y)
      const threshold = 16;
      const filtered = strokes.filter(s =>
        !s.points.some(p => Math.hypot(p.x - x, p.y - y) < threshold)
      );
      if (filtered.length !== strokes.length) {
        onUpdateStrokes(filtered);
      }
      return;
    }

    setIsDrawing(true);
    setCurrentPoints([{ x, y }]);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !activeTool) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentPoints(prev => [...prev, { x, y }]);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentPoints.length > 1 && activeTool) {
      const newStroke: DrawingStroke = {
        id: `stroke-${Date.now()}`,
        points: currentPoints,
        color: strokeColor,
        width: strokeWidth,
        isHighlighter: activeTool === 'highlighter',
      };
      onUpdateStrokes([...strokes, newStroke]);
    }
    setCurrentPoints([]);
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`absolute inset-0 z-20 ${
        activeTool ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'
      }`}
    />
  );
};
