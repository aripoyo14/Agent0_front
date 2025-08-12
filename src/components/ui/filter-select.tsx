import * as React from "react";
import { cn } from "@/lib/utils";

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterSelectProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function FilterSelect({
  title,
  options,
  selectedValues,
  onSelectionChange,
  placeholder = "選択してください",
  className,
}: FilterSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // 外側クリック検知でドロップダウンを閉じる
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleOptionToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onSelectionChange(newValues);
  };

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <label className="block text-xs font-medium text-gray-700 mb-2">
        {title}
      </label>
      <div
        className="w-full min-h-[2.5rem] bg-gray-100 rounded border border-gray-200 px-3 py-2 cursor-pointer transition-colors hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {selectedValues.length === 0 ? (
              <span className="text-gray-500 text-xs">{placeholder}</span>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedValues.map((value) => {
                  const option = options.find((opt) => opt.value === value);
                  return (
                    <span
                      key={value}
                      className="inline-flex items-center px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] rounded"
                    >
                      {option?.label || value}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOptionToggle(value);
                        }}
                        className="ml-1 hover:text-blue-600"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
          <span 
            className="material-symbols-outlined text-gray-400"
            style={{ fontSize: '12px' }}
          >
            {isOpen ? "expand_less" : "expand_more"}
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-48 overflow-y-auto">
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <div
                key={option.value}
                className={cn(
                  "flex items-center justify-between px-3 py-1.5 cursor-pointer transition-colors",
                  isSelected
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                )}
                onClick={() => handleOptionToggle(option.value)}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="mr-2 text-blue-600 w-3 h-3"
                  />
                  <span className="text-xs">{option.label}</span>
                </div>
                {option.count !== undefined && (
                  <span className="text-[10px] text-gray-500">({option.count})</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
