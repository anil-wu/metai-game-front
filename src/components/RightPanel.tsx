"use client";

import React from 'react';

export default function RightPanel() {
  return (
    <div className="w-[320px] bg-white border-l border-gray-200 h-full overflow-y-auto p-5 flex flex-col">
      <h2 className="text-base font-semibold text-gray-800 mb-4">生成图形和角色三视图</h2>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm text-gray-600 leading-relaxed">
        完成！暨已为您生成了这个角色的正面立绘效果，双手手臂自然下垂，展望了整吴穿的站立姿态。
        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
          <div className="w-6 h-6 rounded-full bg-gray-800"></div>
          <span>Lovart 已完成操作任务</span>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm text-gray-600 leading-relaxed">
        在看才为生成这个正面立绘方案角色的三视图，请耐心等待。
        <div className="mt-3 p-2 bg-white rounded border border-gray-100 text-xs text-gray-500 flex items-center gap-2">
           <span>🔍</span> 图像外扩
        </div>
      </div>

      <div className="mt-4">
        <div className="text-sm text-gray-600 mb-2">现在将依生成这个正面立绘方案角色的四视图，请耐心等待：</div>
        <div className="p-3 bg-gray-50 rounded-lg mb-3">
          <div className="text-xs text-gray-500">Using Scenario Pro</div>
        </div>
        
        <div className="text-sm text-gray-600 mb-2">确正用片器第三视图</div>
        
        <div className="flex gap-3 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 aspect-square rounded-lg overflow-hidden bg-gray-100 relative group cursor-pointer">
               <div className={`w-full h-full flex items-center justify-center text-white text-2xl
                 ${i === 1 ? 'bg-gradient-to-br from-[#FF7F50] to-[#FF6347]' : ''}
                 ${i === 2 ? 'bg-gradient-to-br from-[#FF6347] to-[#FF4500]' : ''}
                 ${i === 3 ? 'bg-gradient-to-br from-[#FF4500] to-[#FF7F50]' : ''}
               `}>
                 👧
               </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mt-4 text-sm text-gray-600 leading-relaxed">
          完成！暨已为你生成了这个正面立绘方案角色的四视图，请看为白色，包括正面、侧面和后面三个视角。
          <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
            <div className="w-6 h-6 rounded-full bg-gray-800"></div>
            <span>Lovart 已完成操作任务</span>
          </div>
        </div>
      </div>
    </div>
  );
}
