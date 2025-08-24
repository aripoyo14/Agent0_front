"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { Header } from "@/components/ui/header";
import { submitPolicyProposal, savePolicyDraft, PolicyFormData } from '@/lib/policy-api';

interface PolicyTag {
  id: string;
  title: string;
}

interface PolicySubmissionFormProps {
  initialPolicyTags: PolicyTag[];
  initialFormData: PolicyFormData;
}

export function PolicySubmissionForm({ 
  initialPolicyTags, 
  initialFormData 
}: PolicySubmissionFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<PolicyFormData>(initialFormData);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [showErrorOverlay, setShowErrorOverlay] = useState(false);
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleThemeToggle = (themeId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedThemes: prev.selectedThemes.includes(themeId)
        ? prev.selectedThemes.filter(id => id !== themeId)
        : [...prev.selectedThemes, themeId]
    }));
  };

  const handleInputChange = (field: keyof PolicyFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.policyTitle.trim() || !formData.policyContent.trim()) {
      setErrorMessage("政策名と政策内容は必須です");
      setShowErrorOverlay(true);
      return;
    }

    if (formData.selectedThemes.length === 0) {
      setErrorMessage("政策テーマを選択してください");
      setShowErrorOverlay(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await submitPolicyProposal(formData);
      setShowSubmissionSuccess(true);
    } catch {
      setErrorMessage("投稿に失敗しました。もう一度お試しください。");
      setShowErrorOverlay(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmissionComplete = () => {
    router.push('/dashboard');
  };

  const handleSaveDraft = async () => {
    if (!formData.policyTitle.trim() && !formData.policyContent.trim()) {
      setErrorMessage("下書き保存には政策名または政策内容が必要です");
      setShowErrorOverlay(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await savePolicyDraft(formData);
      setShowSuccessOverlay(true);
      setTimeout(() => {
        setShowSuccessOverlay(false);
      }, 3000);
    } catch {
      setErrorMessage("下書きの保存に失敗しました。もう一度お試しください。");
      setShowErrorOverlay(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fileInputId = "policy-file-input";
  
  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const maxSize = 5 * 1024 * 1024;
    const oversizedFiles = Array.from(files).filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      setErrorMessage(`ファイルサイズが5MBを超えています: ${oversizedFiles.map(f => f.name).join(', ')}`);
      setShowErrorOverlay(true);
      return;
    }
    
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const invalidFiles = Array.from(files).filter(file => !allowedTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setErrorMessage(`対応していないファイル形式です: ${invalidFiles.map(f => f.name).join(', ')}`);
      setShowErrorOverlay(true);
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      attachedFiles: [...prev.attachedFiles, ...Array.from(files)]
    }));
    setShowSuccessOverlay(true);
    
    setTimeout(() => {
      setShowSuccessOverlay(false);
    }, 3000);
  };

  const handleRemoveFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachedFiles: prev.attachedFiles.filter((_, i) => i !== index)
    }));
  };

  const handleRetryUpload = () => {
    setShowErrorOverlay(false);
    document.getElementById(fileInputId)?.click();
  };

  const handleCancelUpload = () => {
    setShowErrorOverlay(false);
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col overflow-hidden">
      {/* グラデーション背景 */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#7bc8e8] via-[#58aadb] to-[#2d8cd9]" />
      
      {/* テクスチャ効果 */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="4" stitchTiles="stitch"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
          </svg>
        `)}")`
      }}></div>

      <Header />
      
      {/* 投稿完了オーバーレイ */}
      {showSubmissionSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-[600px] mx-4 text-center shadow-2xl">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#7bc8e8] to-[#2d8cd9] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">投稿完了しました</h3>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm leading-relaxed">政策案が正常に投稿されました</p>
            <button
              onClick={handleSubmissionComplete}
              className="w-full sm:w-32 px-6 py-3 bg-gradient-to-r from-[#7bc8e8] to-[#2d8cd9] text-white rounded-full font-semibold hover:from-[#6bb8d8] hover:to-[#1d7cc9] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              完了
            </button>
          </div>
        </div>
      )}
      
      {/* 成功オーバーレイ */}
      {showSuccessOverlay && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm mx-4 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">保存完了</h3>
            <p className="text-gray-600">下書きが正常に保存されました</p>
          </div>
        </div>
      )}

      {/* エラーオーバーレイ */}
      {showErrorOverlay && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 text-center">エラーが発生しました</h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-center text-sm">{errorMessage}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCancelUpload}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                閉じる
              </button>
              {errorMessage.includes('ファイル') && (
                <button
                  onClick={handleRetryUpload}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  再試行
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* メインコンテンツエリア */}
      <div className="relative z-10 flex-1 px-4 sm:px-6 lg:px-12 pb-6 pt-20">
        {/* 政策テーマ選択エリア */}
        <div className="mb-8 sm:mb-16 relative mt-8">
          <h3 className="absolute -top-6 left-0 font-['Noto_Sans_JP'] font-bold text-white text-xs tracking-[2px]">政策テーマを選択する</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-x-3 gap-y-2 w-full">
            {initialPolicyTags.map((theme) => {
              const isSelected = formData.selectedThemes.includes(theme.id);
              return (
                <button
                  key={theme.id}
                  onClick={() => handleThemeToggle(theme.id)}
                  className={`relative px-2 sm:px-3 py-1 rounded-[40px] text-xs font-bold transition-all hover:shadow-md h-7 flex items-center justify-center ${
                    isSelected 
                      ? 'bg-white text-[#2d8cd9] shadow-md' 
                      : 'bg-transparent text-white hover:bg-white/10'
                  }`}
                >
                  <div className={`absolute border-solid inset-0 pointer-events-none rounded-[40px] border-[1px] ${
                    isSelected ? 'border-white' : 'border-white/60'
                  }`} />
                  <span className={`text-[8px] sm:text-[10px] leading-[1.2] px-1 ${
                    theme.title.includes('・') ? 'whitespace-pre-line' : ''
                  }`}>
                    {theme.title.includes('・') 
                      ? theme.title.replace('・', '\n・')
                      : theme.title
                    }
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* レスポンシブレイアウト */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* 左側：政策テーマ選択と政策内容 */}
          <div className="w-full lg:w-4/5 space-y-4">
            {/* 政策内容を記入する */}
            <div className="relative">
              <h3 className="absolute -top-6 left-0 font-['Noto_Sans_JP'] font-bold text-white text-xs tracking-[2px]">
                政策名を入力してください
              </h3>
              <div className="flex flex-col">
                {/* 政策名 */}
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.policyTitle}
                      onChange={(e) => handleInputChange("policyTitle", e.target.value)}
                      placeholder="政策名を入力してください"
                      className="w-full px-3 py-2 bg-white/90 rounded border border-white/70 text-xs placeholder-gray-500 focus:outline-none transition-colors pr-10"
                      disabled={isSubmitting}
                    />
                    {formData.policyTitle && (
                      <button
                        onClick={() => handleInputChange("policyTitle", "")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="政策名を削除"
                        disabled={isSubmitting}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* 投稿内容 */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs tracking-[2px] font-bold text-white">
                      政策の詳細を記入してください
                    </label>
                    {formData.policyContent && (
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, policyContent: "" }))}
                        className="text-xs text-white/70 hover:text-white transition-colors flex items-center gap-1"
                        aria-label="政策内容を削除"
                        disabled={isSubmitting}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        クリア
                      </button>
                    )}
                  </div>
                  
                  <textarea
                    value={formData.policyContent}
                    onChange={(e) => setFormData(prev => ({ ...prev, policyContent: e.target.value }))}
                    placeholder="政策の詳細内容を入力してください"
                    className="w-full px-3 py-3 bg-white/90 rounded border border-white/70 text-xs placeholder-gray-500 focus:outline-none transition-colors resize-none h-[300px] sm:h-[400px]"
                    disabled={isSubmitting}
                  />
                  <div className="text-xs text-white/80 mt-2 text-right">
                    {formData.policyContent.length}文字
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右側：添付資料と投稿ボタン */}
          <div className="w-full lg:w-1/4 space-y-4">
            {/* 添付資料を追加する */}
            <div className="relative">
              <h3 className="absolute -top-5 left-0 font-['Noto_Sans_JP'] font-bold text-white text-xs tracking-[2px]">
                添付資料を追加する
              </h3>
              <button
                type="button"
                onClick={() => document.getElementById(fileInputId)?.click()}
                className="relative block w-full h-48 sm:h-64 lg:w-[20rem] lg:h-[20rem] rounded-tr-[8.414px] rounded-br-[8.414px] rounded-bl-[8.414px] border border-white text-white hover:bg-white/5 transition-colors"
                disabled={isSubmitting}
              >
                <div className="absolute inset-0 pointer-events-none rounded-tr-[8.414px] rounded-br-[8.414px] rounded-bl-[8.414px]" />
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center">
                  <p className="font-['Noto_Sans_JP'] font-bold text-[10px] sm:text-[12.62px] tracking-[1.89px] leading-[16px] sm:leading-[20px]">資料選択</p>
                  <p className="font-['Noto_Sans_JP'] font-bold text-[8px] sm:text-[10.4px] tracking-[1.89px] leading-[14px] sm:leading-[20px] opacity-90">（1ファイル5MB以内）</p>
                </div>
              </button>
              <input
                id={fileInputId}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={(e) => handleFilesSelected(e.target.files)}
                disabled={isSubmitting}
              />
              {/* 選択済みファイルの簡易表示 */}
              {formData.attachedFiles.length > 0 && (
                <div className="mt-2 text-xs font-bold text-white/90 space-y-1 max-h-24 overflow-auto">
                  {formData.attachedFiles.map((f, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="truncate flex-1">{f.name}</div>
                      <button
                        onClick={() => handleRemoveFile(i)}
                        className="ml-1 opacity-40 hover:opacity-80 transition-opacity"
                        aria-label="ファイルを削除"
                        disabled={isSubmitting}
                      >
                        <svg 
                          width="12" 
                          height="12" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="text-white"
                        >
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 操作ボタン */}
            <div className="space-y-4">
              <button
                onClick={handleSaveDraft}
                className="w-full sm:w-[150px] sm:ml-20 sm:mr-0 block py-[8px] rounded-full border border-white border-dashed text-white text-[10.3px] tracking-[5.35px] hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="下書き保存"
                disabled={isSubmitting}
              >
                下書保存
              </button>
              <button
                onClick={handleSubmit}
                className="w-full sm:w-[150px] sm:ml-20 sm:mr-0 block py-[8px] rounded-full border text-[10.3px] font-bold tracking-[5.35px] bg-white hover:bg-[#fcfcfc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ color: '#4aa0e9', borderColor: '#4aa0e9' }}
                aria-label="投稿する"
                disabled={isSubmitting}
              >
                {isSubmitting ? '投稿中...' : '投稿する →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
