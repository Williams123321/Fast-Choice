import React from 'react';
import { PosterProps } from '../types';

const RetroTV = ({ width, height, rotate = 0, scale = 1, casingColor = "#eab308", screenColor = "#fefce8", accentColor = "black" }: any) => (
  <svg width={width} height={height} viewBox="0 0 100 80" style={{ transform: `rotate(${rotate}deg) scale(${scale})` }} className="drop-shadow-sm pointer-events-none">
    <rect x="2" y="5" width="96" height="70" rx="5" fill={casingColor} stroke={accentColor} strokeWidth="2" />
    <rect x="8" y="10" width="65" height="60" rx="5" fill={screenColor} stroke={accentColor} strokeWidth="2" />
    <rect x="78" y="15" width="16" height="50" rx="2" fill="none" />
    <circle cx="86" cy="25" r="5" fill="none" stroke={accentColor} strokeWidth="1.5" />
    <circle cx="86" cy="40" r="5" fill="none" stroke={accentColor} strokeWidth="1.5" />
    <line x1="80" y1="55" x2="92" y2="55" stroke={accentColor} strokeWidth="1" />
    <line x1="80" y1="60" x2="92" y2="60" stroke={accentColor} strokeWidth="1" />
  </svg>
);

const Poster: React.FC<PosterProps> = ({ type, variant, size = "large", noShadow = false }) => {
  const isSmall = size === "small";
  const scaleClass = isSmall ? "scale-[0.4] origin-top-left" : "scale-100";
  const containerClass = isSmall ? "w-[88px] h-[128px]" : "w-[220px] h-[320px]";
  const shadowClass = noShadow ? "" : "shadow-md";

  if (type === 'setA') {
    if (variant === 'A') {
      const bg = "bg-[#E3C565]";
      return (
        <div className={`${containerClass} bg-white ${shadowClass} relative overflow-hidden pointer-events-none select-none`}>
          <div className={`w-[220px] h-[320px] ${bg} flex flex-col relative ${scaleClass} overflow-hidden`}>
            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%221%22/%3E%3C/svg%3E")' }}></div>
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-[#FDFBF7] transform rotate-12" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0% 80%)' }}></div>
            <div className="absolute top-4 right-2 w-8 h-64 flex flex-col items-center space-y-2 z-20">
              <div className="w-full h-24 bg-[#1e3a8a] opacity-80 mix-blend-multiply"></div>
              <div className="w-full h-4 bg-[#1e3a8a] opacity-60 mix-blend-multiply"></div>
              <div className="w-full h-32 bg-[#1e3a8a] opacity-80 mix-blend-multiply"></div>
            </div>
            <div className="absolute bottom-[-20px] left-[-20px] w-full h-full z-10">
              <div className="absolute bottom-2 left-2"><RetroTV width={70} height={50} casingColor="#eab308" accentColor="#06b6d4" /></div>
              <div className="absolute bottom-12 left-10"><RetroTV width={65} height={45} casingColor="#eab308" accentColor="#06b6d4" /></div>
              <div className="absolute bottom-24 left-16"><RetroTV width={60} height={40} casingColor="#eab308" accentColor="#06b6d4" /></div>
              <div className="absolute bottom-36 left-24"><RetroTV width={55} height={38} casingColor="#eab308" accentColor="#06b6d4" /></div>
            </div>
          </div>
        </div>
      );
    } else {
      const bg = "bg-[#F5F1E6]";
      return (
        <div className={`${containerClass} bg-white ${shadowClass} relative overflow-hidden pointer-events-none select-none`}>
          <div className={`w-[220px] h-[320px] ${bg} flex flex-col relative ${scaleClass} overflow-hidden`}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(0deg, transparent 50%, #111 50%)', backgroundSize: '1px 4px' }}></div>
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#F0D24C] transform -rotate-45 mix-blend-multiply opacity-90"></div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#F0D24C] transform rotate-45 mix-blend-multiply opacity-90"></div>
            <div className="absolute top-0 left-1/3 w-[1px] h-full bg-red-500 opacity-60 z-0"></div>
            <div className="absolute top-24 left-4 w-[25%] space-y-2 z-10">
              <div className="h-2 w-full bg-[#111]"></div>
              <div className="h-2 w-[80%] bg-[#111]"></div>
              <div className="h-2 w-[90%] bg-[#111]"></div>
              <div className="mt-4 h-16 w-full border-2 border-[#111]"></div>
            </div>
            <div className="absolute top-32 right-4 w-[50%] h-20 bg-[#111] opacity-10"></div>
            <div className="absolute bottom-4 left-0 w-full flex justify-center space-x-2 items-end z-20 px-4">
              <RetroTV width={50} height={35} casingColor="#F0D24C" accentColor="#1d4ed8" />
              <RetroTV width={60} height={42} casingColor="#F0D24C" accentColor="#1d4ed8" />
            </div>
          </div>
        </div>
      );
    }
  }
  if (type === 'setB') {
    const bg = "bg-gradient-to-br from-indigo-500 to-purple-600";
    return (
      <div className={`${containerClass} bg-white ${shadowClass} relative overflow-hidden pointer-events-none select-none`}>
        <div className={`w-[220px] h-[320px] ${bg} p-4 flex flex-col relative ${scaleClass}`}>
          {variant === 'A' ? (
            <div className="text-white font-sans font-thin text-4xl mt-10">Minimal<br />Future.<br /><span className="text-sm font-bold opacity-50">2025</span></div>
          ) : (
            <>
              <div className="absolute inset-0 flex items-center justify-center"><div className="w-32 h-32 border-8 border-white rounded-full opacity-20 animate-spin-slow"></div></div>
              <div className="text-white font-bold text-center mt-20 text-2xl relative z-10">CHAOS<br />THEORY</div>
            </>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default Poster;
