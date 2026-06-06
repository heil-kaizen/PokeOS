import React, { useRef, useState, useEffect } from 'react';
import { Pencil, Eraser, Download, Trash2, PaintBucket } from 'lucide-react';

export const PaintApp = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const endDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use getBoundingClientRect for absolute position within the scaled canvas
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // Scale the coordinates to match the canvas internal resolution
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    // Fill background properly on init
    clearCanvas();
  }, []);

  const downloadCanvas = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'smeargle-art.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const colors = ['#000000', '#7f7f7f', '#880015', '#ed1c24', '#ff7f27', '#fff200', '#22b14c', '#00a2e8', '#3f48cc', '#a349a4', '#ffffff', '#c3c3c3', '#b97a57', '#ffaec9', '#ffc90e', '#efe4b0', '#b5e61d', '#99d9ea', '#7092be', '#c8bfe7'];

  return (
    <div className="flex bg-[#ece9d8] h-full flex-col font-sans">
      {/* Top Toolbar */}
      <div className="flex items-center p-1 bg-[#ece9d8] border-b border-[#716f64] gap-1">
        <div className="flex gap-1 border-r border-gray-400 pr-2 mr-1">
          <button onClick={() => setTool('pencil')} className={`p-1.5 border border-transparent rounded hover:border-gray-400 bg-white shadow-sm ${tool === 'pencil' ? 'bg-[#c3d1ec] border-blue-400 inset-shadow-sm' : ''}`}>
             <Pencil size={16} className="text-gray-700" />
          </button>
          <button onClick={() => setTool('eraser')} className={`p-1.5 border border-transparent rounded hover:border-gray-400 bg-white shadow-sm ${tool === 'eraser' ? 'bg-[#c3d1ec] border-blue-400 inset-shadow-sm' : ''}`}>
             <Eraser size={16} className="text-gray-700" />
          </button>
        </div>

        <div className="flex gap-1 border-r border-gray-400 pr-2 mr-1">
          <button onClick={clearCanvas} className="p-1.5 border border-transparent rounded hover:border-gray-400 hover:bg-white text-[#880015] flex items-center gap-1" title="Clear Canvas">
             <Trash2 size={16} /> <span className="text-xs">Clear</span>
          </button>
          <button onClick={downloadCanvas} className="p-1.5 border border-transparent rounded hover:border-gray-400 hover:bg-white text-[#22b14c] flex items-center gap-1" title="Save">
             <Download size={16} /> <span className="text-xs">Save</span>
          </button>
        </div>

        <div className="flex items-center gap-2 px-2 border-r border-gray-400 pr-2 mr-1">
          <span className="text-xs">Size:</span>
          <input type="range" min="1" max="25" value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} className="w-20" />
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Color Palette (Left side like old paint) */}
        <div className="w-[60px] bg-[#ece9d8] border-r border-[#716f64] flex flex-col items-center p-2 gap-2">
           <div className="w-10 h-10 border-2 border-gray-400 bg-white shadow-inner flex items-center justify-center mb-1">
              <div className="w-6 h-6 border" style={{ backgroundColor: color }} />
           </div>
           
           <div className="flex flex-wrap gap-1 justify-center">
             {colors.map(c => (
               <button 
                 key={c}
                 className={`w-4 h-4 border shadow-sm ${color === c ? 'border-2 border-black scale-110 z-10' : 'border-gray-400'}`}
                 style={{ backgroundColor: c }}
                 onClick={() => {
                   setColor(c);
                   setTool('pencil');
                 }}
               />
             ))}
           </div>
           
           <div className="mt-auto px-1 py-2 text-center border-t border-gray-400 w-full">
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/235.png" alt="Smeargle" className="w-[40px] mix-blend-multiply opacity-80 inline-block pixelated" style={{ imageRendering: 'pixelated' }} />
           </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-[#808080] overflow-auto p-4 flex items-start justify-start shadow-inner relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onMouseDown={startDrawing}
            onMouseUp={endDrawing}
            onMouseMove={draw}
            onMouseLeave={endDrawing}
            onTouchStart={startDrawing}
            onTouchEnd={endDrawing}
            onTouchMove={draw}
            className="bg-white shadow-[2px_2px_5px_rgba(0,0,0,0.5)] cursor-crosshair touch-none"
          />
        </div>
      </div>
    </div>
  );
}
