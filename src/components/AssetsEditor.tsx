"use client";

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import CanvasArea from './CanvasArea';
import RightPanel from './RightPanel';

export default function AssetsEditor() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={toggleSidebar} 
      />
      
      <div className="flex flex-1 flex-col bg-gray-50 overflow-hidden relative">
        <CanvasArea isSidebarCollapsed={isSidebarCollapsed} />
      </div>

      <RightPanel />
    </div>
  );
}
