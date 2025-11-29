import React from 'react';
import { ChevronDown, ChevronRight, Hash, Type, ImageIcon, Layers, Lock, Eye } from './Icons';

interface LayerItemProps {
  label: string;
  type: 'frame' | 'text' | 'image' | 'group';
  active?: boolean;
  indent?: number;
}

const LayerItem: React.FC<LayerItemProps> = ({ label, type, active, indent = 0 }) => {
  const getIcon = () => {
    switch (type) {
      case 'frame': return <Hash size={12} className="text-gray-500" />;
      case 'text': return <Type size={12} className="text-gray-500" />;
      case 'image': return <ImageIcon size={12} className="text-gray-500" />;
      case 'group': return <Layers size={12} className="text-gray-500" />;
      default: return <div className="w-3 h-3 border border-gray-400 rounded-[2px]"></div>;
    }
  };
  return (
    <div className={`flex items-center h-8 px-2 hover:bg-blue-50 cursor-default group ${active ? 'bg-blue-100 text-blue-900' : 'text-gray-700'}`}>
      <div style={{ width: indent * 16 }}></div>
      <div className="flex items-center flex-1 min-w-0">
        <ChevronRight size={12} className={`mr-1 text-gray-400 ${type === 'text' || type === 'image' ? 'invisible' : ''}`} />
        <span className="mr-2">{getIcon()}</span>
        <span className="text-xs font-medium truncate select-none">{label}</span>
      </div>
      <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-2 mr-1">
        <Lock size={10} className="text-gray-400" /><Eye size={10} className="text-gray-400" />
      </div>
    </div>
  );
};

const Sidebar: React.FC<{ selectedPosters: string[] }> = ({ selectedPosters }) => {
  return (
    <div className="hidden md:flex w-48 bg-white border-r border-gray-200 flex-col z-20 shadow-sm shrink-0">
      <div className="border-b border-gray-200"><div className="h-10 flex items-center px-4 justify-between hover:bg-gray-50 cursor-pointer"><span className="text-xs font-bold text-gray-800">Page 1</span><ChevronDown size={12} className="text-gray-500" /></div></div>
      <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
        <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Layers</div>
        <LayerItem label="Frame 1 (Canvas)" type="frame" active={selectedPosters.includes('A')} />
        <LayerItem label="Headline" type="text" indent={1} />
        <LayerItem label="TV Stack" type="group" indent={1} />
        <LayerItem label="Frame 2 (Canvas)" type="frame" active={selectedPosters.includes('B')} />
        <LayerItem label="Date Block" type="text" indent={1} />
        <LayerItem label="Grid System" type="group" indent={1} />
        <LayerItem label="Background" type="image" />
      </div>
    </div>
  );
};

export default Sidebar;
