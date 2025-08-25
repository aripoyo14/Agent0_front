import React from 'react';

// プロフィールページ専用UIコンポーネント
export const CompactCard = ({ title, children }: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white/95 backdrop-blur-sm border border-white/50 rounded-lg shadow-lg flex flex-col h-full">
    <div className="p-3 border-b border-gray-200 flex-shrink-0">
      <h3 className="text-gray-800 font-semibold text-xs">{title}</h3>
    </div>
    <div className="p-3 flex-1 overflow-hidden">
      {children}
    </div>
  </div>
);
