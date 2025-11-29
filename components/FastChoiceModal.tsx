import React, { useState, useEffect, useRef } from 'react';
import { FastChoiceLogo, Minus, X, ArrowLeft, Search, MessageSquare, Send, Sparkles, FileText, Heart, ThumbsDown } from './Icons';
import Poster from './Poster';
import { WindowState, PosterType, Dimension, AnalysisResult, ChatMessage } from '../types';
import * as GeminiService from '../services/geminiService';

interface FastChoiceModalProps {
  windowState: WindowState;
  setWindowState: (s: WindowState) => void;
  posterData: PosterType | null;
  setPosterData: (t: PosterType | null) => void;
  handleClose: () => void;
}

const CaseCard = ({ title, style }: { title: string, style: string }) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const renderArt = () => {
    switch (style) {
      case 'swiss': return <div className="w-full h-full bg-[#E63946] relative overflow-hidden"><div className="absolute top-4 left-4 text-white font-bold text-3xl leading-none opacity-80 rotate-90 origin-top-left">SWISS<br />STYLE</div><div className="absolute bottom-[-20px] right-[-20px] w-32 h-32 rounded-full bg-white opacity-20"></div></div>;
      case 'bauhaus': return <div className="w-full h-full bg-[#F1FAEE] relative overflow-hidden flex flex-col"><div className="h-1/2 w-full bg-[#1D3557]"></div><div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-[#E63946]"></div><div className="absolute top-4 right-4 w-4 h-full bg-[#457B9D] opacity-50"></div></div>;
      case 'acid': return <div className="w-full h-full bg-black relative overflow-hidden"><div className="absolute inset-0 bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-500 opacity-80 mix-blend-exclusion"></div><div className="text-white font-mono text-4xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 italic tracking-tighter">ACID</div><div className="absolute w-full h-full border-4 border-lime-400 rounded-lg transform rotate-6 scale-90"></div></div>;
      case 'minimal': return <div className="w-full h-full bg-[#F8F9FA] relative flex items-center justify-center"><div className="w-24 h-24 border border-black rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-black rounded-full"></div></div></div>;
      case 'typo': return <div className="w-full h-full bg-yellow-300 relative overflow-hidden p-2 break-all leading-none text-2xl font-black text-black">TYPOGRAPHY<br />IS<br />IMAGE<br />TYPE<br />TYPE</div>;
      default: return <div className="w-full h-full bg-gray-200 flex items-center justify-center"><div className="text-gray-400 font-bold text-xl">IMG</div></div>;
    }
  };
  return (
    <div className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-white border border-gray-100">
      <div className="h-32 w-full">{renderArt()}</div>
      <div className="p-3 flex items-center justify-between">
        <span className="text-xs font-bold text-gray-800">{title}</span>
        <div className="flex space-x-2">
          <Heart size={14} className={`cursor-pointer transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'}`} onClick={() => { setLiked(!liked); setDisliked(false); }} />
          <ThumbsDown size={14} className={`cursor-pointer transition-colors ${disliked ? 'fill-black text-black' : 'text-gray-400 hover:text-gray-600'}`} onClick={() => { setDisliked(!disliked); setLiked(false); }} />
        </div>
      </div>
    </div>
  )
}

const FastChoiceModal: React.FC<FastChoiceModalProps> = ({ windowState, setWindowState, posterData, setPosterData, handleClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDimension, setSelectedDimension] = useState<Dimension | null>(null);
  const [aiOutput, setAiOutput] = useState<AnalysisResult>({ code: '', critique: '' });
  const [streamingCode, setStreamingCode] = useState('');
  const [briefContent, setBriefContent] = useState('');
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleDimensionSelect = async (dimension: Dimension) => {
    if (!posterData) return;
    setSelectedDimension(dimension);
    setWindowState('analyzing');
    setStreamingCode('');
    setChatHistory([]);
    
    // API Call
    const result = await GeminiService.analyzeDesign(posterData, dimension);
    setAiOutput(result);

    // Simulate streaming for the "Code" part to look cool
    let i = 0;
    const interval = setInterval(() => {
      setStreamingCode(result.code.slice(0, i));
      i++;
      if (i > result.code.length) {
        clearInterval(interval);
        setTimeout(() => setWindowState('result'), 800);
      }
    }, 15);
  };

  const handleGenerateBrief = async () => {
    if (!posterData || !selectedDimension) return;
    setIsGeneratingBrief(true);
    const brief = await GeminiService.generateBrief(posterData, selectedDimension, aiOutput.critique);
    setBriefContent(brief);
    setIsGeneratingBrief(false);
    setWindowState('brief');
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !posterData) return;
    
    const userMsg: ChatMessage = { role: 'user', text: chatInput };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    const answer = await GeminiService.chatWithMentor(posterData, selectedDimension, userMsg.text);
    setChatHistory(prev => [...prev, { role: 'ai', text: answer }]);
    setIsChatLoading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('text/plain') as PosterType;
    if (type && windowState === 'empty') {
      setPosterData(type);
      setWindowState('content');
    }
  };

  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatHistory]);

  const heightClass = (windowState === 'empty' || windowState === 'cases') ? 'h-[500px]' : 'h-[85%] max-h-[800px]';

  return (
    <div className={`relative bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-40 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] w-[95%] max-w-[1100px] ${heightClass}`} onMouseDown={(e) => e.stopPropagation()}>
      
      {/* Header */}
      <div className="h-10 border-b border-gray-100 flex items-center justify-between px-4 bg-gray-50 shrink-0">
        <div className="flex space-x-2 items-center"><FastChoiceLogo size={24} /><span className="text-xs font-semibold text-gray-700">Fast Choice</span></div>
        <div className="flex items-center space-x-2"><Minus size={14} className="text-gray-400 cursor-pointer hover:text-black" /><X size={14} className="text-gray-400 cursor-pointer hover:text-red-500" onClick={handleClose} /></div>
      </div>

      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
        
        {/* Search Bar (Empty/Cases state) */}
        {(windowState === 'empty' || windowState === 'cases') && (
          <div className="px-8 pt-4 pb-8 transition-all duration-300">
            <div className="w-full h-12 bg-white border border-gray-200 shadow-sm rounded-lg flex items-center px-4 hover:shadow-md transition-shadow group focus-within:ring-2 focus-within:ring-blue-100">
              {windowState === 'cases' && <ArrowLeft size={20} className="mr-3 text-gray-400 hover:text-black cursor-pointer" onClick={() => setWindowState('empty')} />}
              <input type="text" className="flex-1 text-sm tracking-widest font-medium text-center outline-none bg-transparent placeholder-gray-400 group-focus-within:text-left group-focus-within:placeholder-gray-300" placeholder="QUERY DESIGN CASES" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && setWindowState('cases')} />
              <Search className="text-black cursor-pointer hover:scale-110 transition-transform" size={20} onClick={() => { if (searchQuery) setWindowState('cases'); }} />
            </div>
          </div>
        )}

        {/* Drop Zone */}
        {windowState === 'empty' && (
          <div className="flex-1 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50/50 transition-colors hover:bg-blue-50/30 hover:border-blue-300 animate-fade-in mx-8 mb-4" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-500 animate-bounce"><Search size={32} /></div>
            <p className="text-sm text-gray-400 mt-2 font-medium">Drag posters here to compare</p>
            <p className="text-xs text-gray-300 mt-1">or search for inspiration above</p>
          </div>
        )}

        {/* Search Results */}
        {windowState === 'cases' && (
          <div className="flex-1 overflow-y-auto px-8 pb-4 animate-slide-up custom-scrollbar">
            <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-bold text-gray-800">Results for "{searchQuery}"</h3><span className="text-xs text-gray-400">6 cases found</span></div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <CaseCard title="Swiss Intl Style" style="swiss" /><CaseCard title="Bauhaus 1923" style="bauhaus" /><CaseCard title="Acid Graphics" style="acid" /><CaseCard title="Minimalist Grid" style="minimal" /><CaseCard title="Kinetic Type" style="typo" /><CaseCard title="Brutalist Web" style="brutalist" />
            </div>
          </div>
        )}

        {/* Comparison Views */}
        {windowState !== 'empty' && windowState !== 'cases' && posterData && (
          <div className="flex h-full gap-6">
            
            {/* Left: Visuals */}
            <div className={`flex-1 flex items-center justify-center space-x-4 relative transition-all duration-500 ${(windowState === 'result' || windowState === 'brief') ? 'hidden lg:flex lg:flex-1' : 'flex'}`}>
              <div className="relative group"><div className="absolute -inset-4 rounded-xl ring-4 ring-blue-400/30 animate-pulse pointer-events-none"></div><Poster type={posterData} variant="A" /></div>
              <div className="relative group"><div className="absolute -inset-4 rounded-xl ring-4 ring-red-400/30 animate-pulse delay-75 pointer-events-none"></div><Poster type={posterData} variant="B" /></div>
            </div>

            {/* Right: Interaction Pane */}
            <div className={`flex flex-col justify-center animate-slide-in-right relative transition-all duration-500 ${windowState === 'brief' ? 'w-full lg:w-[60%]' : 'w-full md:w-[360px]'} h-full`}>
              
              {/* Selector */}
              {windowState === 'content' && (
                <div className="space-y-3 w-full max-w-sm mx-auto">
                  <div className="bg-yellow-100 border border-yellow-300 p-3 rounded-md text-xs font-bold text-yellow-800 text-center mb-6 shadow-sm">Select a dimension to analyze</div>
                  {['Feasibility', 'Advantages/Disadvantages', 'Originality', 'Cost'].map((dim) => (
                    <button key={dim} onClick={() => handleDimensionSelect(dim as Dimension)} className="w-full py-3 px-4 rounded-lg text-sm font-medium text-center bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:border-blue-400 hover:shadow-md hover:scale-[1.02] transition-all active:scale-95">{dim}</button>
                  ))}
                </div>
              )}

              {/* Analyzing Animation */}
              {windowState === 'analyzing' && (
                <div className="flex flex-col h-[400px] w-full">
                  <div className="flex items-center space-x-2 mb-2 text-gray-500"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div><span className="text-xs font-mono uppercase">AI Processing...</span></div>
                  <div className="flex-1 bg-[#1E1E1E] rounded-lg p-4 font-mono text-xs text-green-400 shadow-inner overflow-hidden border border-gray-700 relative"><div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50 animate-scan"></div><pre className="whitespace-pre-wrap break-all">{streamingCode}</pre></div>
                </div>
              )}

              {/* Result & Chat */}
              {windowState === 'result' && (
                <div className="flex flex-col h-full bg-[#F3F4F6] rounded-xl border border-white shadow-lg overflow-hidden animate-scale-in w-full">
                  <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center shrink-0"><h3 className="font-bold text-gray-800">Analysis Result</h3><button onClick={handleGenerateBrief} className="flex items-center space-x-1 text-[10px] bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-md hover:opacity-90 transition-opacity"><Sparkles size={10} /><span>{isGeneratingBrief ? 'Generating...' : 'Decision Brief'}</span></button></div>
                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar min-h-0" ref={scrollRef}>
                    <div className="prose prose-sm prose-p:text-xs prose-headings:text-sm max-w-none text-gray-600 mb-6">{aiOutput.critique.split('\n').map((line, i) => { if (line.startsWith('**')) return <strong key={i} className="block mt-3 text-gray-900">{line.replace(/\*\*/g, '')}</strong>; if (line.trim() === '') return <br key={i} />; return <p key={i} className="leading-relaxed">{line}</p>; })}</div>
                    <div className="border-t border-gray-200 pt-4 mt-2">
                      <div className="text-[10px] font-bold text-gray-400 uppercase mb-2 flex items-center"><MessageSquare size={10} className="mr-1" /> Ask AI Analyst</div>
                      <div className="space-y-2 mb-3">{chatHistory.map((msg, idx) => (<div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`text-[10px] p-2 rounded-lg max-w-[90%] ${msg.role === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-white border border-gray-200'}`}>{msg.text}</div></div>))} {isChatLoading && <div className="text-[10px] text-gray-400 italic">AI is typing...</div>}</div>
                      <form onSubmit={handleChatSubmit} className="flex gap-2"><input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ex: How to improve poster B?" className="flex-1 text-xs p-2 rounded border border-gray-300 focus:border-blue-500 outline-none" /><button type="submit" className="bg-gray-800 text-white p-2 rounded hover:bg-black"><Send size={12} /></button></form>
                    </div>
                  </div>
                  <button onClick={() => setWindowState('content')} className="m-4 mt-0 bg-white border border-gray-300 text-gray-700 py-2 rounded-md text-xs font-bold hover:bg-gray-50 transition-colors shrink-0">Analyze Different Dimension</button>
                </div>
              )}

              {/* Brief View */}
              {windowState === 'brief' && (
                <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden animate-slide-in-right z-10 w-full">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-4 text-white flex justify-between items-center shrink-0"><div className="flex items-center space-x-2"><FileText size={16} /><h3 className="font-bold text-sm">Decision Brief</h3></div><button onClick={() => setWindowState('result')} className="text-white/80 hover:text-white"><ArrowLeft size={16} /></button></div>
                  <div className="flex-1 overflow-y-auto p-6 custom-scrollbar min-h-0"><div className="prose prose-sm prose-p:text-xs prose-headings:text-sm prose-headings:font-bold prose-headings:text-gray-900 text-gray-600">{briefContent.split('\n').map((line, i) => { if (line.startsWith('# ')) return <h1 key={i} className="text-lg font-black mb-4 pb-2 border-b border-gray-100">{line.replace('# ', '')}</h1>; if (line.startsWith('## ')) return <h2 key={i} className="text-sm font-bold mt-4 mb-2 text-blue-700">{line.replace('## ', '')}</h2>; if (line.trim() === '') return <br key={i} />; return <p key={i} className="mb-2 text-xs leading-relaxed">{line}</p>; })}</div></div>
                  <div className="p-4 border-t border-gray-100 flex gap-2 shrink-0"><button className="flex-1 bg-black text-white py-2 rounded text-xs font-bold hover:bg-gray-800">Export PDF</button><button className="flex-1 bg-gray-100 text-gray-800 py-2 rounded text-xs font-bold hover:bg-gray-200">Copy Link</button></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FastChoiceModal;
