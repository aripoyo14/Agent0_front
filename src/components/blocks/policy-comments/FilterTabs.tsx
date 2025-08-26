import React, { memo } from 'react';

interface FilterTabsProps {
  activeTab: string;
  onChange: (id: string) => void;
  counts: { all: number; unfb: number; fb: number; };
}

const tabs = [
  { id: "all", label: "すべて" },
  { id: "unfb", label: "未FBのみ" },
  { id: "fb", label: "FB済みのみ" },
];

export const FilterTabs = memo<FilterTabsProps>(({ activeTab, onChange, counts }) => {
  return (
    <div className="flex border-b border-gray-200 mb-6">
      {tabs.map((tab) => {
        const count = counts[tab.id as keyof typeof counts];
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id 
                ? "border-b-2 border-[#4AA0E9] text-[#4AA0E9]" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {count > 0 && (
              <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
});

FilterTabs.displayName = 'FilterTabs';
