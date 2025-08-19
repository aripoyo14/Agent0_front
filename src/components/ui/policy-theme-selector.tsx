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
  className?: string;
}

export function PolicyThemeSelector({
  themes,
  selectedThemes,
  onThemeToggle,
  className,
}: PolicyThemeSelectorProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <h4 className="text-sm font-semibold text-gray-700 mb-3">政策テーマを選択</h4>
      
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
      
      {/* クリアボタン */}
      {selectedThemes.length > 0 && (
        <button
          onClick={() => selectedThemes.forEach(id => onThemeToggle(id))}
          className="w-full py-2 text-xs text-gray-600 hover:text-gray-800 transition-colors mt-3 font-medium"
        >
          すべてクリア
        </button>
      )}
    </div>
  );
}
