"use client";

import React from 'react';
import { MousePointer2, Square, Circle, Type, Pencil, Image as ImageIcon, Clipboard } from 'lucide-react';

export type ToolType = 'select' | 'rectangle' | 'circle' | 'text' | 'pencil' | 'image' | 'clipboard';

interface ToolsPanelProps {
  isSidebarCollapsed: boolean;
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
}

export default function ToolsPanel({ isSidebarCollapsed, activeTool, onToolChange }: ToolsPanelProps) {
  const tools: { id: ToolType; icon: React.ReactNode }[] = [
    { id: 'select', icon: <MousePointer2 size={20} /> },
    { id: 'rectangle', icon: <Square size={20} /> },
    { id: 'circle', icon: <Circle size={20} /> },
    { id: 'text', icon: <Type size={20} /> },
    { id: 'pencil', icon: <Pencil size={20} /> },
    { id: 'image', icon: <ImageIcon size={20} /> },
    { id: 'clipboard', icon: <Clipboard size={20} /> },
  ];

  return (
    <div 
      className={`absolute top-1/2 -translate-y-1/2 bg-white rounded-lg p-2 shadow-lg flex flex-col gap-2 transition-all duration-300 z-40
        ${isSidebarCollapsed ? 'left-4' : 'left-10'}
      `}
    >
      {tools.map((tool) => (
        <button 
          key={tool.id}
          onClick={() => onToolChange(tool.id)}
          className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors
            ${activeTool === tool.id 
              ? 'bg-blue-50 text-blue-600' 
              : 'text-gray-500 hover:bg-gray-100'
            }
          `}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
}
