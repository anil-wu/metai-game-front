import React from 'react';
import CanvasElement from './CanvasElement';

interface ImageElementProps {
  isSelected?: boolean;
  onSelect?: () => void;
  onChange?: (attrs: { x: number; y: number; width: number; height: number; rotation: number }) => void;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export default function ImageElement({ 
  isSelected, 
  onSelect,
  onChange,
  x,
  y,
  width,
  height
}: ImageElementProps) {
  return (
    <CanvasElement 
      isSelected={isSelected} 
      onSelect={onSelect} 
      onChange={onChange}
      label="image"
      initialX={x}
      initialY={y}
      initialWidth={width}
      initialHeight={height}
    >
      <svg width="100%" height="100%" viewBox="0 0 400 600" preserveAspectRatio="none">
        {/* Character illustration */}
        <rect width="400" height="600" fill="#000" fillOpacity="0" />
        
        {/* Dress */}
        <ellipse cx="200" cy="380" rx="90" ry="140" fill="#FF7F50"/>
        <path d="M 140 320 Q 200 340 260 320 L 280 400 Q 200 420 120 400 Z" fill="#FF6347"/>
        
        {/* Body */}
        <ellipse cx="200" cy="280" rx="35" ry="45" fill="#FFD1B3"/>
        
        {/* Head */}
        <circle cx="200" cy="180" r="60" fill="#FFE4D0"/>
        
        {/* Hair */}
        <ellipse cx="200" cy="160" rx="70" ry="50" fill="#2C1810"/>
        <path d="M 150 160 Q 130 180 140 200 Q 150 190 160 180" fill="#2C1810"/>
        <path d="M 250 160 Q 270 180 260 200 Q 250 190 240 180" fill="#2C1810"/>
        
        {/* Bow */}
        <ellipse cx="180" cy="130" rx="25" ry="15" fill="#FF6347"/>
        <ellipse cx="220" cy="130" rx="25" ry="15" fill="#FF6347"/>
        <circle cx="200" cy="130" r="8" fill="#FF4500"/>
        
        {/* Eyes */}
        <ellipse cx="180" cy="180" rx="15" ry="18" fill="#4A2511"/>
        <ellipse cx="220" cy="180" rx="15" ry="18" fill="#4A2511"/>
        <circle cx="182" cy="178" r="6" fill="#000"/>
        <circle cx="222" cy="178" r="6" fill="#000"/>
        <circle cx="185" cy="176" r="3" fill="#fff"/>
        <circle cx="225" cy="176" r="3" fill="#fff"/>
        
        {/* Smile */}
        <path d="M 185 200 Q 200 210 215 200" stroke="#E8967B" strokeWidth="2" fill="none" strokeLinecap="round"/>
        
        {/* Arms */}
        <ellipse cx="160" cy="320" rx="18" ry="60" fill="#FFD1B3"/>
        <ellipse cx="240" cy="320" rx="18" ry="60" fill="#FFD1B3"/>
        
        {/* Legs */}
        <rect x="175" y="480" width="20" height="100" rx="10" fill="#FFD1B3"/>
        <rect x="205" y="480" width="20" height="100" rx="10" fill="#FFD1B3"/>
        
        {/* Shoes */}
        <ellipse cx="185" cy="585" rx="20" ry="12" fill="#E0E0E0"/>
        <ellipse cx="215" cy="585" rx="20" ry="12" fill="#E0E0E0"/>
      </svg>
    </CanvasElement>
  );
}
