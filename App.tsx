import React, { useState, useRef } from 'react';
import { ChevronDown, Maximize2, FastChoiceLogo, Copy, Clipboard, Trash2, ChevronRight, MousePointer2, LayoutGrid, Type, PenTool } from './components/Icons';
import Poster from './components/Poster';
import Sidebar from './components/Sidebar';
import FastChoiceModal from './components/FastChoiceModal';
import { WindowState, PosterType } from './types';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [pluginMenuOpen, setPluginMenuOpen] = useState(false);
  const [windowState, setWindowState] = useState<WindowState>('closed');
  const [posterData, setPosterData] = useState<PosterType | null>(null);
  const [selectedPosters, setSelectedPosters] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState<{ startX: number, startY: number, currentX: number, currentY: number } | null>(null);

  const dragItem = useRef<PosterType | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const posterARef = useRef<HTMLDivElement>(null);
  const posterBRef = useRef<HTMLDivElement>(null);

  const handleToolClick = (tool: string) => {
    setActiveTool(tool === 'plugin' && activeTool !== 'plugin' ? 'plugin' : null);
    setPluginMenuOpen(tool === 'plugin' && activeTool !== 'plugin');
  };

  const handlePluginSelect = () => {
    setPluginMenuOpen(false);
    setWindowState('empty');
    setActiveTool('plugin');
  };

  const handleDragStart = (e: React.DragEvent, type: PosterType) => {
    dragItem.current = type;
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', type);
  };

  const handleClose = () => {
    setWindowState('closed');
    setPosterData(null);
    setActiveTool(null);
    setSelectedPosters([]);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (selectedPosters.length > 0 || windowState === 'closed') {
      setContextMenu({ visible: true, x: Math.min(e.clientX, window.innerWidth - 200), y: Math.min(e.clientY, window.innerHeight - 300) });
    }
  };

  // Minimal Canvas Interaction Logic for Selection Box
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if ((e.target === canvasRef.current || (e.target as Element).classList.contains('canvas-background')) && !contextMenu.visible) {
      setIsSelecting(true);
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const startX = e.clientX - rect.left;
        const startY = e.clientY - rect.top;
        setSelectionBox({ startX, startY, currentX: startX, currentY: startY });
      }
      setSelectedPosters([]);
      setContextMenu({ ...contextMenu, visible: false });
    }
    if (contextMenu.visible) setContextMenu({ ...contextMenu, visible: false });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isSelecting || !canvasRef.current || !selectionBox) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    setSelectionBox(prev => prev ? ({ ...prev, currentX, currentY }) : null);

    // Simple collision detection
    const boxLeft = Math.min(selectionBox.startX, currentX);
    const boxRight = Math.max(selectionBox.startX, currentX);
    const boxTop = Math.min(selectionBox.startY, currentY);
    const boxBottom = Math.max(selectionBox.startY, currentY);

    const checkOverlap = (el: HTMLElement | null, id: string) => {
      if (!el) return false;
      const elRect = el.getBoundingClientRect();
      const itemLeft = elRect.left - rect.left;
      const itemRight = elRect.right - rect.left;
      const itemTop = elRect.top - rect.top;
      const itemBottom = elRect.bottom - rect.top;
      return !(boxRight < itemLeft || boxLeft > itemRight || boxBottom < itemTop || boxTop > itemBottom);
    };

    const newSel: string[] = [];
    if (checkOverlap(posterARef.current, 'A')) newSel.push('A');
    if (checkOverlap(posterBRef.current, 'B')) newSel.push('B');
    setSelectedPosters(newSel);
  };

  const handleCanvasMouseUp = () => {
    setIsSelecting(false);
    setSelectionBox(null);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#E5E5E5] font-sans text-[#333] overflow-hidden select-none" onClick={() => setContextMenu({ ...contextMenu, visible: false })}>
      
      {/* Top Bar */}
      <div className="h-10 bg-[#2C2C2C] flex items-center justify-between px-4 z-50 shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2 group cursor-pointer"><div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div><div className="w-3 h-3 rounded-full bg-[#FEBC2E]"></div><div className="w-3 h-3 rounded-full bg-[#28C840]"></div></div>
          <div className="flex items-center text-gray-400 text-xs font-medium hover:text-white cursor-pointer transition-colors"><span>Project 1</span><ChevronDown size={12} className="ml-2" /></div>
        </div>
        <div className="text-gray-400 text-xs font-medium hidden sm:block">Design Decider System</div>
        <div className="flex items-center space-x-4">
          <div className="flex -space-x-1"><div className="w-6 h-6 rounded-full bg-blue-500 border border-[#2C2C2C] flex items-center justify-center text-[10px] text-white font-bold">U</div></div>
          <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded transition-colors hidden sm:block">Share</button>
          <button className="text-white hover:bg-white/10 p-1 rounded"><Maximize2 size={14} /></button>
        </div>
      </div>

      <div className="flex-1 flex relative overflow-hidden">
        <Sidebar selectedPosters={selectedPosters} />

        {/* Asset Panel (Floating Left) */}
        <div className="absolute left-48 top-4 bottom-16 w-32 flex flex-col items-center py-4 z-10 space-y-6 pointer-events-none">
          <div className="pointer-events-auto">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 text-center bg-gray-100/80 px-2 py-1 rounded backdrop-blur-sm">Assets</div>
            <div className="group cursor-grab active:cursor-grabbing mb-4 flex flex-col items-center hover:scale-105 transition-transform" draggable onDragStart={(e) => handleDragStart(e, 'setA')}>
              <div className="flex -space-x-12 shadow-lg rounded-lg overflow-hidden border-2 border-white"><Poster type="setA" variant="A" size="small" /><Poster type="setA" variant="B" size="small" /></div>
              <span className="text-[9px] font-medium text-gray-500 mt-1 bg-white/80 px-1 rounded">Retro Set</span>
            </div>
            <div className="group cursor-grab active:cursor-grabbing flex flex-col items-center hover:scale-105 transition-transform" draggable onDragStart={(e) => handleDragStart(e, 'setB')}>
              <div className="flex -space-x-12 shadow-lg rounded-lg overflow-hidden border-2 border-white"><Poster type="setB" variant="A" size="small" /><Poster type="setB" variant="B" size="small" /></div>
              <span className="text-[9px] font-medium text-gray-500 mt-1 bg-white/80 px-1 rounded">Modern Set</span>
            </div>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 bg-[#F5F5F5] relative flex items-center justify-center p-4 cursor-default canvas-background" ref={canvasRef} onMouseDown={handleCanvasMouseDown} onMouseMove={handleCanvasMouseMove} onMouseUp={handleCanvasMouseUp} onContextMenu={handleContextMenu}>
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#999 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          {/* Selection Rect */}
          {isSelecting && selectionBox && <div className="absolute bg-blue-500/10 border border-blue-500 pointer-events-none z-50" style={{ left: Math.min(selectionBox.startX, selectionBox.currentX), top: Math.min(selectionBox.startY, selectionBox.currentY), width: Math.abs(selectionBox.currentX - selectionBox.startX), height: Math.abs(selectionBox.currentY - selectionBox.startY) }}></div>}

          {/* Canvas Content (Posters on Stage) */}
          {windowState === 'closed' && (
            <div className="relative flex space-x-12 p-8 ml-20">
              <div ref={posterARef} className={`transition-all duration-200 rounded-lg p-1 ${selectedPosters.includes('A') ? 'ring-2 ring-blue-500 bg-blue-50/10' : 'hover:ring-1 hover:ring-blue-300'}`} onClick={(e) => { e.stopPropagation(); if (e.shiftKey) setSelectedPosters(prev => prev.includes('A') ? prev.filter(p => p !== 'A') : [...prev, 'A']); else setSelectedPosters(['A']); }}>
                {selectedPosters.includes('A') && <div className="absolute -top-6 left-0 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-t-sm shadow-sm">Frame 1</div>}
                <Poster type="setA" variant="A" noShadow={false} />
              </div>
              <div ref={posterBRef} className={`transition-all duration-200 rounded-lg p-1 ${selectedPosters.includes('B') ? 'ring-2 ring-blue-500 bg-blue-50/10' : 'hover:ring-1 hover:ring-blue-300'}`} onClick={(e) => { e.stopPropagation(); if (e.shiftKey) setSelectedPosters(prev => prev.includes('B') ? prev.filter(p => p !== 'B') : [...prev, 'B']); else setSelectedPosters(['B']); }}>
                {selectedPosters.includes('B') && <div className="absolute -top-6 left-0 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-t-sm shadow-sm">Frame 2</div>}
                <Poster type="setA" variant="B" noShadow={false} />
              </div>
            </div>
          )}

          {/* The AI Modal Overlay */}
          {windowState !== 'closed' && (
            <FastChoiceModal 
              windowState={windowState} 
              setWindowState={setWindowState} 
              posterData={posterData} 
              setPosterData={setPosterData} 
              handleClose={handleClose} 
            />
          )}

          {/* Plugin Selection Menu (Bottom Center) */}
          {pluginMenuOpen && (
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-64 bg-[#2C2C2C] rounded-lg shadow-2xl border border-gray-700 overflow-hidden animate-slide-up origin-bottom z-50">
              <div className="p-2 border-b border-gray-600"><input type="text" placeholder="Search plugins..." className="w-full bg-[#1E1E1E] text-gray-300 text-xs px-2 py-1.5 rounded outline-none focus:ring-1 focus:ring-blue-500" /></div>
              <div className="py-1">
                <div onClick={handlePluginSelect} className="flex items-center px-4 py-2 cursor-pointer transition-colors hover:bg-blue-600 hover:text-white text-gray-200"><span className="w-6 text-center mr-2 flex items-center justify-center"><FastChoiceLogo size={20} /></span><span className="text-xs font-medium">Fast Choice</span><span className="ml-auto text-[10px] opacity-50">Plugin</span></div>
              </div>
            </div>
          )}

          {/* Context Menu (Right Click) */}
          {contextMenu.visible && (
            <div className="fixed z-[100] bg-[#222] border border-[#444] rounded-lg shadow-xl text-white text-xs py-1 w-48 overflow-visible animate-fade-in" style={{ top: contextMenu.y, left: contextMenu.x }} onMouseDown={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-3 py-1.5 hover:bg-blue-600 cursor-pointer group"><div className="flex items-center gap-2"><span className="opacity-70 group-hover:opacity-100"><Copy size={12} /></span><span>Copy</span></div><span className="text-[10px] opacity-50">⌘C</span></div>
              <div className="flex items-center justify-between px-3 py-1.5 hover:bg-blue-600 cursor-pointer group"><div className="flex items-center gap-2"><span className="opacity-70 group-hover:opacity-100"><Clipboard size={12} /></span><span>Paste</span></div><span className="text-[10px] opacity-50">⌘V</span></div>
              <div className="flex items-center justify-between px-3 py-1.5 hover:bg-blue-600 cursor-pointer group"><div className="flex items-center gap-2"><span className="opacity-70 group-hover:opacity-100"><Trash2 size={12} /></span><span>Delete</span></div></div>
              <div className="h-px bg-[#444] my-1"></div>
              <div className="relative group">
                <div className="flex items-center justify-between px-3 py-1.5 hover:bg-blue-600 cursor-pointer"><span className="flex items-center gap-2"><div className="w-3 h-3 grid grid-cols-2 gap-[1px] opacity-70"><div className="bg-white rounded-[0.5px]"></div><div className="bg-white rounded-[0.5px]"></div><div className="bg-white rounded-[0.5px]"></div><div className="bg-white rounded-[0.5px]"></div></div> Plugins</span><ChevronRight size={12} /></div>
                <div className="hidden group-hover:block absolute left-full top-0 -ml-1 bg-[#222] border border-[#444] rounded-lg shadow-xl w-48 py-1">
                  <div className="relative group/fastchoice">
                    <div onClick={handlePluginSelect} className="flex items-center justify-between px-3 py-1.5 hover:bg-blue-600 cursor-pointer"><span className="flex items-center gap-2"><FastChoiceLogo size={14} /> Fast Choice</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Tool Bar */}
      <div className="h-12 bg-[#2C2C2C] flex items-center justify-center shrink-0 border-t border-gray-700 relative z-50">
        <div className="flex items-center space-x-1">
          <button disabled className="w-10 h-10 flex items-center justify-center rounded transition-all duration-200 opacity-30 cursor-not-allowed hover:bg-transparent hover:text-gray-400 text-gray-400"><MousePointer2 size={18} /></button>
          <button disabled className="w-10 h-10 flex items-center justify-center rounded transition-all duration-200 opacity-30 cursor-not-allowed hover:bg-transparent hover:text-gray-400 text-gray-400"><LayoutGrid size={18} /></button>
          <button disabled className="w-10 h-10 flex items-center justify-center rounded transition-all duration-200 opacity-30 cursor-not-allowed hover:bg-transparent hover:text-gray-400 text-gray-400"><Type size={18} /></button>
          <button disabled className="w-10 h-10 flex items-center justify-center rounded transition-all duration-200 opacity-30 cursor-not-allowed hover:bg-transparent hover:text-gray-400 text-gray-400"><PenTool size={18} /></button>
          <button onClick={() => handleToolClick('plugin')} className={`w-10 h-10 flex items-center justify-center rounded transition-all duration-200 ${activeTool === 'plugin' ? 'bg-blue-600 text-white shadow-lg scale-105' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}><div className="grid grid-cols-2 gap-0.5 w-4 h-4"><div className="bg-current rounded-[1px]"></div><div className="bg-current rounded-[1px]"></div><div className="bg-current rounded-[1px]"></div><div className="bg-current rounded-[1px]"></div></div></button>
        </div>
      </div>
    </div>
  );
};

export default App;
