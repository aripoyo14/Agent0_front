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
      <h4 className="text-xs font-medium text-gray-700 mb-2">政策テーマを選択</h4>
      
      <div className="grid grid-cols-3 gap-1">
        {themes.map((theme) => {
          const isSelected = selectedThemes.includes(theme.id);
          return (
            <div
              key={theme.id}
              className={cn(
                "relative px-2 py-1 rounded-full text-[9px] font-medium transition-all cursor-pointer text-center flex items-center justify-center min-h-[20px]",
                isSelected
                  ? "text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
              style={isSelected ? { backgroundColor: theme.color } : {}}
              onClick={() => onThemeToggle(theme.id)}
            >
              {isSelected && (
                <span className="absolute left-1 top-1/2 transform -translate-y-1/2 text-white text-[8px]">
                  ✓
                </span>
              )}
              <span className={isSelected ? "ml-1" : ""}>
                {theme.title}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* クリアボタン */}
      {selectedThemes.length > 0 && (
        <button
          onClick={() => selectedThemes.forEach(id => onThemeToggle(id))}
          className="w-full py-1 text-[9px] text-gray-600 hover:text-gray-800 transition-colors mt-2"
        >
          すべてクリア
        </button>
      )}
    </div>
  );
}
