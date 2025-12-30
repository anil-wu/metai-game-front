"use client";

import React from 'react';
import { ChevronLeft, ChevronRight, History } from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  if (isCollapsed) {
    return (
      <button 
        onClick={toggleSidebar}
        className="fixed left-0 bottom-6 w-12 h-12 bg-white border border-gray-200 border-l-0 rounded-r-lg flex items-center justify-center shadow-md z-50 hover:bg-gray-50 transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>
    );
  }

  return (
    <div className="w-[200px] bg-white border-r border-gray-200 flex flex-col h-full transition-all duration-300 relative">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between text-sm font-medium text-gray-700">
        <span>历史记录</span>
        <span className="text-xs text-gray-400">▲</span>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="w-[100px] h-[100px] bg-gray-100 rounded-lg mx-auto flex items-center justify-center text-gray-400 text-xs mb-5">
          暂无历史记录
        </div>
        
        <div className="mt-5 pt-5 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-3">图组</div>
          <div className="py-3 border-b border-gray-100 text-sm text-gray-600 cursor-pointer hover:text-gray-900 flex items-center gap-2">
            <span>🖼️</span> 魔法城堡进程示例
          </div>
          <div className="py-3 border-b border-gray-100 text-sm text-gray-600 cursor-pointer hover:text-gray-900 flex items-center gap-2">
            <span>👧</span> 萌妹上身组
          </div>
          <div className="py-3 border-b border-gray-100 text-sm text-gray-600 cursor-pointer hover:text-gray-900 flex items-center gap-2">
            <span>🎨</span> bridge
          </div>
        </div>
      </div>

      <button 
        onClick={toggleSidebar}
        className="h-12 w-full border-t border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    </div>
  );
}
