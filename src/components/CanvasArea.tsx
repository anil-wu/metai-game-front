"use client";

import React, { useState, useRef } from 'react';
import ToolsPanel, { ToolType } from './ToolsPanel';
import ImageToolbar from './ImageToolbar';
import ImageElement from './ImageElement';
import CanvasElement from './CanvasElement';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface CanvasAreaProps {
  isSidebarCollapsed: boolean;
}

interface CanvasItem {
  id: string;
  type: ToolType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color?: string;
}

export default function CanvasArea({ isSidebarCollapsed }: CanvasAreaProps) {
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [elements, setElements] = useState<CanvasItem[]>([
    { id: '1', type: 'image', x: 100, y: 100, width: 400, height: 600, rotation: 0 }
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleElementSelect = (id: string) => {
    if (activeTool === 'select') {
      setSelectedId(id);
    }
  };

  const handleElementChange = (id: string, attrs: { x: number; y: number; width: number; height: number; rotation: number }) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, ...attrs } : el));
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    // If clicking on background with select tool, deselect
    if (activeTool === 'select') {
      setSelectedId(null);
      return;
    }

    // Add new element based on tool
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newId = Date.now().toString();
    let newElement: CanvasItem | null = null;

    if (activeTool === 'rectangle') {
      newElement = { id: newId, type: 'rectangle', x: x - 50, y: y - 50, width: 100, height: 100, rotation: 0, color: '#3b82f6' };
    } else if (activeTool === 'circle') {
      newElement = { id: newId, type: 'circle', x: x - 50, y: y - 50, width: 100, height: 100, rotation: 0, color: '#ef4444' };
    }

    if (newElement) {
      setElements([...elements, newElement]);
      setActiveTool('select');
      setSelectedId(newId);
    }
  };

  return (
    <div 
      className="flex-1 relative bg-[#fafafa] overflow-hidden"
      onClick={handleBackgroundClick}
    >
      <ToolsPanel 
        isSidebarCollapsed={isSidebarCollapsed} 
        activeTool={activeTool}
        onToolChange={setActiveTool}
      />
      
      {/* Canvas Stage Layer */}
      <div className="w-full h-full relative">
        {selectedId && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
            <ImageToolbar />
          </div>
        )}
        
        {elements.map(el => {
          const isSelected = selectedId === el.id;
          
          if (el.type === 'image') {
            return (
              <ImageElement 
                key={el.id}
                isSelected={isSelected} 
                onSelect={() => handleElementSelect(el.id)}
                onChange={(attrs) => handleElementChange(el.id, attrs)}
                x={el.x}
                y={el.y}
                width={el.width}
                height={el.height}
              />
            );
          }

          return (
            <CanvasElement
              key={el.id}
              isSelected={isSelected}
              onSelect={() => handleElementSelect(el.id)}
              onChange={(attrs) => handleElementChange(el.id, attrs)}
              label={el.type}
              initialX={el.x}
              initialY={el.y}
              initialWidth={el.width}
              initialHeight={el.height}
            >
              <div 
                className="w-full h-full"
                style={{ 
                  backgroundColor: el.color || '#ccc',
                  borderRadius: el.type === 'circle' ? '50%' : '0'
                }}
              />
            </CanvasElement>
          );
        })}
      </div>

      <div className="absolute bottom-5 right-5 bg-white rounded-full px-3 py-1 shadow-md flex items-center gap-2 text-xs text-gray-600 z-50">
        <button className="p-1 hover:text-gray-900"><ZoomOut size={16} /></button>
        <span>100%</span>
        <button className="p-1 hover:text-gray-900"><ZoomIn size={16} /></button>
      </div>
    </div>
  );
}
