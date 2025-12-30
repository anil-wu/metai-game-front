"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, RotateCw } from 'lucide-react';

  interface CanvasElementProps {
  children: React.ReactNode;
  initialWidth?: number;
  initialHeight?: number;
  initialX?: number;
  initialY?: number;
  isSelected?: boolean;
  onSelect?: () => void;
  onChange?: (attrs: { x: number; y: number; width: number; height: number; rotation: number }) => void;
  label?: string;
}

export default function CanvasElement({
  children,
  initialWidth = 400,
  initialHeight = 600,
  initialX = 100,
  initialY = 100,
  isSelected = false,
  onSelect,
  onChange,
  label = "image"
}: CanvasElementProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
  const [rotation, setRotation] = useState(0);
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  // Ref to track latest values for event handlers
  const stateRef = useRef({
    x: initialX,
    y: initialY,
    width: initialWidth,
    height: initialHeight,
    rotation: 0
  });

  // Update ref when state changes (except during drag/resize to avoid lag, but here we need it for mouseUp)
  useEffect(() => {
    stateRef.current = { x: position.x, y: position.y, width: size.width, height: size.height, rotation };
  }, [position, size, rotation]);

  const dragRef = useRef<{ startX: number; startY: number; initialLeft: number; initialTop: number } | null>(null);
  const resizeRef = useRef<{
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startLeft: number;
    startTop: number;
    startRatio: number;
    startCenterX: number;
    startCenterY: number;
    direction: string;
  } | null>(null);
  const rotateRef = useRef<{
    startX: number;
    startY: number;
    startRotation: number;
    centerX: number;
    centerY: number;
    startAngle: number;
  } | null>(null);

  // --- Drag Logic ---
  const handleDragStart = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    e.stopPropagation();
    onSelect?.();
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialLeft: position.x,
      initialTop: position.y
    };
  };

  // --- Resize Logic ---
  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    setIsResizing(true);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: size.width,
      startHeight: size.height,
      startLeft: position.x,
      startTop: position.y,
      startRatio: size.width / size.height,
      startCenterX: position.x + size.width / 2,
      startCenterY: position.y + size.height / 2,
      direction
    };
  };

  // --- Rotation Logic ---
  const handleRotateStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRotating(true);
    
    // Calculate center point relative to viewport
    const rect = (e.currentTarget.parentNode as HTMLElement).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);

    rotateRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startRotation: rotation,
      centerX,
      centerY,
      startAngle
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Handle Dragging
      if (isDragging && dragRef.current) {
        const deltaX = e.clientX - dragRef.current.startX;
        const deltaY = e.clientY - dragRef.current.startY;
        setPosition({
          x: dragRef.current.initialLeft + deltaX,
          y: dragRef.current.initialTop + deltaY
        });
        return;
      }

      // Handle Resizing
      if (isResizing && resizeRef.current) {
        // ... (existing resize logic) ...
        const { startX, startY, startWidth, startHeight, startRatio, startCenterX, startCenterY, direction } = resizeRef.current;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        let newWidth = startWidth;
        let newHeight = startHeight;

        // Simplified for brevity, same logic as before
        if (direction.includes('e')) newWidth = startWidth + deltaX * 2;
        else if (direction.includes('w')) newWidth = startWidth - deltaX * 2;
        
        if (direction.includes('s')) newHeight = startHeight + deltaY * 2;
        else if (direction.includes('n')) newHeight = startHeight - deltaY * 2;

        if (direction === 'n' || direction === 's') newWidth = newHeight * startRatio;
        else newHeight = newWidth / startRatio;

        if (newWidth < 50) { newWidth = 50; newHeight = newWidth / startRatio; }

        const newLeft = startCenterX - newWidth / 2;
        const newTop = startCenterY - newHeight / 2;

        setSize({ width: newWidth, height: newHeight });
        setPosition({ x: newLeft, y: newTop });
      }

      // Handle Rotation
      if (isRotating && rotateRef.current) {
        const { centerX, centerY, startRotation, startAngle } = rotateRef.current;
        
        // Calculate angle between center and mouse
        const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
        const deltaAngle = currentAngle - startAngle;
        
        setRotation(startRotation + deltaAngle);
      }
    };

    const handleMouseUp = () => {
      if (isDragging || isResizing || isRotating) {
        setIsDragging(false);
        setIsResizing(false);
        setIsRotating(false);
        dragRef.current = null;
        resizeRef.current = null;
        rotateRef.current = null;

        if (onChange) {
          onChange(stateRef.current);
        }
      }
    };

    if (isDragging || isResizing || isRotating) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, isRotating, rotation]);

  const handleElementClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.();
  };

  const handleStyle = (cursor: string) => ({
    width: '10px',
    height: '10px',
    backgroundColor: 'white',
    border: '1px solid #3b82f6',
    borderRadius: '50%',
    position: 'absolute' as const,
    cursor,
    zIndex: 20,
  });

  const rotateCursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3'/%3E%3C/svg%3E") 12 12, move`;

  const rotationZoneStyle = {
    width: '30px',
    height: '30px',
    position: 'absolute' as const,
    cursor: rotateCursor,
    zIndex: 15,
  };

  return (
    <div 
      className="absolute group" 
      style={{ 
        width: size.width, 
        height: size.height,
        left: position.x,
        top: position.y,
        transform: `rotate(${rotation}deg)`,
        cursor: isDragging ? 'move' : 'default' 
      }}
      onMouseDown={handleDragStart}
      onClick={handleElementClick}
    >
      {/* Label Tag */}
      {isSelected && (
        <div className="absolute -top-5 left-0 flex items-center gap-1 text-xs text-gray-600 bg-transparent select-none pointer-events-none">
           <ImageIcon size={12} />
           <span>{label}</span>
        </div>
      )}

      {/* Dimensions Tag */}
      {isSelected && (
        <div className="absolute -top-5 right-0 text-xs text-gray-500 bg-transparent select-none pointer-events-none font-medium">
           {Math.round(size.width)} × {Math.round(size.height)}
        </div>
      )}

      {/* Main Content */}
      <div className="w-full h-full overflow-hidden pointer-events-none">
        {children}
      </div>

      {/* Selection Border & Handles */}
      {isSelected && (
        <>
          <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none z-10" />

          {/* Rotation Zones */}
          <div style={{ ...rotationZoneStyle, top: '-15px', left: '-15px' }} onMouseDown={handleRotateStart} />
          <div style={{ ...rotationZoneStyle, top: '-15px', right: '-15px' }} onMouseDown={handleRotateStart} />
          <div style={{ ...rotationZoneStyle, bottom: '-15px', left: '-15px' }} onMouseDown={handleRotateStart} />
          <div style={{ ...rotationZoneStyle, bottom: '-15px', right: '-15px' }} onMouseDown={handleRotateStart} />

          {/* Corners */}
          <div style={{ ...handleStyle('nw-resize'), top: '-6px', left: '-6px' }} onMouseDown={(e) => handleResizeStart(e, 'nw')} />
          <div style={{ ...handleStyle('ne-resize'), top: '-6px', right: '-6px' }} onMouseDown={(e) => handleResizeStart(e, 'ne')} />
          <div style={{ ...handleStyle('sw-resize'), bottom: '-6px', left: '-6px' }} onMouseDown={(e) => handleResizeStart(e, 'sw')} />
          <div style={{ ...handleStyle('se-resize'), bottom: '-6px', right: '-6px' }} onMouseDown={(e) => handleResizeStart(e, 'se')} />

          {/* Edges */}
          <div style={{ ...handleStyle('n-resize'), top: '-6px', left: '50%', transform: 'translateX(-50%)', borderRadius: '2px', width: '6px', height: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'n')} />
          <div style={{ ...handleStyle('s-resize'), bottom: '-6px', left: '50%', transform: 'translateX(-50%)', borderRadius: '2px', width: '6px', height: '6px' }} onMouseDown={(e) => handleResizeStart(e, 's')} />
          <div style={{ ...handleStyle('w-resize'), left: '-6px', top: '50%', transform: 'translateY(-50%)', borderRadius: '2px', width: '6px', height: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'w')} />
          <div style={{ ...handleStyle('e-resize'), right: '-6px', top: '50%', transform: 'translateY(-50%)', borderRadius: '2px', width: '6px', height: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'e')} />
          
          {/* Rotation Handle */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 -top-8 w-6 h-6 flex items-center justify-center bg-white border border-blue-500 rounded-full cursor-grab active:cursor-grabbing shadow-sm z-30"
            onMouseDown={handleRotateStart}
          >
            <RotateCw size={14} className="text-blue-500" />
          </div>
          
          {/* Edge Hover Areas */}
          {/* ... (keep existing hover areas) ... */}
          <div className="absolute top-0 left-0 right-0 h-2 -mt-1 cursor-n-resize z-10" onMouseDown={(e) => handleResizeStart(e, 'n')} />
          <div className="absolute bottom-0 left-0 right-0 h-2 -mb-1 cursor-s-resize z-10" onMouseDown={(e) => handleResizeStart(e, 's')} />
          <div className="absolute top-0 bottom-0 left-0 w-2 -ml-1 cursor-w-resize z-10" onMouseDown={(e) => handleResizeStart(e, 'w')} />
          <div className="absolute top-0 bottom-0 right-0 w-2 -mr-1 cursor-e-resize z-10" onMouseDown={(e) => handleResizeStart(e, 'e')} />
        </>
      )}
      
      <div 
        className="absolute inset-0 z-0"
        style={{ cursor: isSelected ? 'move' : 'pointer' }}
      />
    </div>
  );
}
