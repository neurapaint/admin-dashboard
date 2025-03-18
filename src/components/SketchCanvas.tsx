import React, { useRef, useState, useEffect } from 'react';

interface SketchCanvasProps {
  width: number;
  height: number;
  className?: string;
  onSketchData?: (dataUrl: string) => void;
}

const SketchCanvas: React.FC<SketchCanvasProps> = ({
  width,
  height,
  className,
  onSketchData
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  
  // Initialize canvas context
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 5;
        setCtx(context);
      }
    }
  }, []);
  
  // Clear canvas function
  const clearCanvas = () => {
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      // If a callback is provided, send empty canvas data
      if (onSketchData) {
        onSketchData(canvasRef.current.toDataURL('image/png'));
      }
    }
  };
  
  // Start drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    
    if (ctx) {
      ctx.beginPath();
      
      // Get coordinates
      let x, y;
      
      if ('touches' in e) {
        // Touch event
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          x = e.touches[0].clientX - rect.left;
          y = e.touches[0].clientY - rect.top;
        }
      } else {
        // Mouse event
        x = e.nativeEvent.offsetX;
        y = e.nativeEvent.offsetY;
      }
      
      if (x !== undefined && y !== undefined) {
        ctx.moveTo(x, y);
      }
    }
  };
  
  // Draw
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx) return;
    
    // Get coordinates
    let x, y;
    
    if ('touches' in e) {
      // Touch event
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
      }
    } else {
      // Mouse event
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }
    
    if (x !== undefined && y !== undefined) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };
  
  // Stop drawing
  const stopDrawing = () => {
    if (isDrawing && ctx) {
      ctx.closePath();
      setIsDrawing(false);
      
      // If a callback is provided, send canvas data
      if (onSketchData && canvasRef.current) {
        onSketchData(canvasRef.current.toDataURL('image/png'));
      }
    }
  };
  
  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={className}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      <button 
        onClick={clearCanvas}
        className="absolute bottom-4 right-4 bg-white/80 text-black px-4 py-2 rounded-md shadow-sm hover:bg-white transition-colors"
      >
        Clear
      </button>
    </div>
  );
};

export default SketchCanvas;
