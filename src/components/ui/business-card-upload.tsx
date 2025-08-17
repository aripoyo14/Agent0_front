"use client";

import { useState, useRef } from "react";
import { Button } from "./button";

interface BusinessCardUploadProps {
  onImageSelected: (file: File) => void;
  onImageRemoved: () => void;
  selectedImage?: File | null;
  className?: string;
}

const UploadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const FileImageIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export function BusinessCardUpload({
  onImageSelected,
  onImageRemoved,
  selectedImage,
  className = "",
}: BusinessCardUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onImageSelected(file);
    } else {
      alert("画像ファイルを選択してください。");
    }
  };

  const handleRemoveImage = () => {
    onImageRemoved();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileDialog = (e: React.MouseEvent) => {
    e.preventDefault(); // フォームのsubmitを防ぐ
    e.stopPropagation(); // イベントの伝播を防ぐ
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="flex items-center gap-1 text-white text-xs font-medium mb-1">
        名刺画像
        <span className="inline-block rounded bg-[#4aa0e9] px-1 py-0.5 text-[10px] font-bold text-white">
          任意
        </span>
      </label>
      
      {selectedImage ? (
        <div className="relative">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center gap-3">
              <FileImageIcon />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 font-medium truncate">
                  {selectedImage.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(selectedImage.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Button
                type="button" // 明示的にbuttonタイプを指定
                onClick={handleRemoveImage}
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <XIcon />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Button
            type="button" // 明示的にbuttonタイプを指定
            onClick={openFileDialog}
            variant="outline"
            className="w-full bg-white/90 backdrop-blur-sm border-white/20 text-[#4AA0E9] hover:bg-white hover:border-white/30"
          >
            <UploadIcon />
            名刺画像を選択
          </Button>
          
          <p className="text-xs text-white/70 text-center">
            名刺の画像をアップロードすると、情報の自動入力が可能になります
          </p>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}