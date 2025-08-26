import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white";
  className?: string;
}

export default function LoadingSpinner({ 
  size = "md", 
  color = "primary",
  className = "" 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const colorClasses = {
    primary: "text-[#4AA0E9]",
    white: "text-white"
  };

  return (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}>
      <svg
        className="animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}

// パルスアニメーション付きのドットローダー
export function PulseDots({ className = "" }: { className?: string }) {
  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-current rounded-full animate-pulse"
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: "1.4s"
          }}
        />
      ))}
    </div>
  );
}

// 波アニメーション付きのローダー
export function WaveLoader({ className = "" }: { className?: string }) {
  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="w-1 h-4 bg-current rounded-full animate-pulse"
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: "1s"
          }}
        />
      ))}
    </div>
  );
}
