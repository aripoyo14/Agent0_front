import * as React from "react";
import { cn } from "@/lib/utils";

interface PolicyTheme {
  id: string;
  title: string;
  description: string;
  color: string;
  participants: number;
}

interface PolicyThemeSelectorProps {
  themes: PolicyTheme[];
  selectedThemes: string[];
  onThemeToggle: (themeId: string) => void;
  onClearAll?: () => void; // 全てクリア用のコールバック
  className?: string;
}

export function PolicyThemeSelector({
  themes,
  selectedThemes,
  onThemeToggle,
  onClearAll,
  className,
}: PolicyThemeSelectorProps) {
  return (
    <div className={cn("space-y-2 lg:max-h-none lg:overflow-visible max-h-48 overflow-y-auto", className)}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700">政策テーマを選択</h4>
        {selectedThemes.length > 0 && (
          <button
            onClick={onClearAll || (() => selectedThemes.forEach(id => onThemeToggle(id)))}
            className="text-xs text-gray-600 hover:text-gray-800 transition-colors font-medium"
          >
            すべてクリア
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {themes.map((theme) => {
          const isSelected = selectedThemes.includes(theme.id);
          return (
            <div
              key={theme.id}
              className={cn(
                "px-3 py-2 rounded-full text-xs font-medium transition-all cursor-pointer text-center flex items-center justify-center min-h-[24px] inline-flex whitespace-nowrap",
                isSelected
                  ? "bg-[#58aadb] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
              onClick={() => onThemeToggle(theme.id)}
            >
              {theme.title}
            </div>
          );
        })}
      </div>
    </div>
  );
}
