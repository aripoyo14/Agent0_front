"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from "next/navigation";
// import { PolicyThemeSelector } from "@/components/ui/policy-theme-selector";

interface PolicyFormData {
  selectedThemes: string[];
  policyTitle: string;
  policyContent: string;
  attachedFiles: File[];
}

// リッチテキストエディタコンポーネント
const RichTextEditor = ({ value, onChange }: { 
  value: string; 
  onChange: (value: string) => void; 
  placeholder: string;
}) => {
  const displayRef = useRef<HTMLDivElement>(null);

  // 選択されたテキストの状態を更新（機能は削除、項目のみ残す）
  const updateToolbarState = () => {
    // 機能は削除済み
  };

  // プレーンテキストに変換（HTMLタグを除去）
  const stripHtml = (html: string) => {
    if (typeof document === 'undefined') return html; // SSR対応
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // HTMLタグをプレーンテキストに変換して保存
  const handleSave = (htmlContent: string) => {
    const plainText = stripHtml(htmlContent);
    onChange(plainText);
  };

  // フォーマット機能（削除済み、項目のみ残す）
  const applyFormat = (_format: string) => {
    // 機能は削除済み
  };

  const handleKeyDown = (_e: React.KeyboardEvent) => {
    // 機能は削除済み
  };

  const handleDisplayInput = () => {
    handleSave(displayRef.current?.innerHTML || '');
  };

  // 貼り付け時の改行処理
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    
    const clipboardData = e.clipboardData;
    if (!clipboardData) return;

    // プレーンテキストを取得
    const plainText = clipboardData.getData('text/plain');
    if (!plainText) return;

    // 改行を<br>タグに変換
    const processedText = plainText.replace(/\n/g, '<br>');
    
    // 現在の選択範囲に挿入
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const fragment = range.createContextualFragment(processedText);
      range.deleteContents();
      range.insertNode(fragment);
      
      // カーソル位置を調整
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    
    handleDisplayInput();
  };

  // 文字数をカウント（HTMLタグを除去して純粋なテキスト文字数を計算）
  const getCharacterCount = () => {
    if (typeof window === 'undefined') return 0; // SSR対応
    const plainText = stripHtml(value);
    return plainText.length;
  };

  return (
    <div className="relative">
      {/* ツールバー */}
      <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 rounded-t px-3 py-2 flex items-center gap-2 z-10">
        <button
          type="button"
          className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-600"
          title="太字 (Ctrl+B)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.6 11.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 7.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>
          </svg>
        </button>
        
        <button
          type="button"
          className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-600"
          title="斜体 (Ctrl+I)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/>
          </svg>
        </button>
        
        <div className="w-px h-4 bg-gray-300 mx-1"></div>
        
        <button
          type="button"
          className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-600"
          title="箇条書き"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/>
          </svg>
        </button>
        
        <div className="flex-1"></div>
        
        <div className="text-xs text-gray-500">
          <span className="hidden sm:inline">太字 | 斜体 | 箇条書き</span>
        </div>
        
        <div className="text-xs text-gray-500 ml-4">
          <span>{getCharacterCount()}文字</span>
        </div>
      </div>

      {/* リッチテキスト表示エリア */}
      <div
        ref={displayRef}
        contentEditable
        onInput={handleDisplayInput}
        onKeyDown={handleKeyDown}
        onSelect={updateToolbarState}
        onMouseUp={updateToolbarState}
        onPaste={handlePaste}
        className="w-full px-3 py-3 bg-white/90 rounded border border-white/70 text-xs placeholder-gray-500 focus:outline-none transition-colors resize-none mt-12 h-[400px] overflow-y-auto"
        style={{ height: '400px' }}
        suppressContentEditableWarning={true}
      >
        {value}
      </div>
    </div>
  );
};

export function PolicySubmissionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<PolicyFormData>({
    selectedThemes: [],
    policyTitle: "",
    policyContent: "",
    attachedFiles: []
  });
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [showErrorOverlay, setShowErrorOverlay] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Figma variables and assets
  const COLOR_PRIMARY = "#007aff"; // Miscellaneous/Floating Tab - Text Selected
  const IMG_OCTICON_FILE_16 = "http://localhost:3845/assets/9a27fe684e7b1aadda6d6518a47a5b5e09f7c55f.svg";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleThemeToggle = (_themeId: string) => {
    // 機能は削除済み
  };

  const handleInputChange = (field: keyof PolicyFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    console.log("政策案投稿:", formData);
    // TODO: 次のページに遷移
  };

  const handleSaveDraft = () => {
    console.log("下書き保存:", formData);
    // TODO: 下書き保存処理
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  const fileInputId = "policy-file-input";
  
  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    // ファイルサイズチェック（5MB制限）
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = Array.from(files).filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      setErrorMessage(`ファイルサイズが5MBを超えています: ${oversizedFiles.map(f => f.name).join(', ')}`);
      setShowErrorOverlay(true);
      return;
    }
    
    // ファイル形式チェック
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const invalidFiles = Array.from(files).filter(file => !allowedTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setErrorMessage(`対応していないファイル形式です: ${invalidFiles.map(f => f.name).join(', ')}`);
      setShowErrorOverlay(true);
      return;
    }
    
    // 成功時
    setFormData(prev => ({
      ...prev,
      attachedFiles: [...prev.attachedFiles, ...Array.from(files)]
    }));
    setShowSuccessOverlay(true);
    
    // 3秒後に自動で閉じる
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
    <div className="h-screen w-full relative flex flex-col overflow-hidden">
      {/* グラデーション背景 */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#b4d9d6] to-[#58aadb]" />
      
      {/* 成功オーバーレイ */}
      {showSuccessOverlay && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">アップできました</h3>
            <p className="text-gray-600">資料が正常にアップロードされました</p>
          </div>
        </div>
      )}

      {/* エラーオーバーレイ */}
      {showErrorOverlay && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">アップできませんでした</h3>
            <p className="text-gray-600 mb-6 text-center">{errorMessage}</p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelUpload}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleRetryUpload}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                再投稿
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* ヘッダー部分 - 検索ページと同じスタイル */}
      <div className="relative z-10 flex flex-col justify-center px-6 lg:px-12 py-8">
        {/* 小さなヘッダー */}
        <div className="mb-4">
          <h1 
            className="font-['Montserrat',_sans-serif] font-semibold text-white text-[18px] tracking-[2.16px] cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleGoToDashboard}
          >
            METI Picks
          </h1>
        </div>

        {/* レクタングル1と政策テーマ（同じ高さで横並び、背景カード無し） */}
        <div className="flex items-start gap-10">
          {/* キャッチコピー枠（1）- 白タブ＋外枠レクタングル */}
          <div className="w-[250.7px] h-[70.36px] relative shrink-0">
            {/* 白いPolicyタブ（上側） */}
            <div className="absolute top-0 left-0 w-[50px] h-[25px] bg-white rounded-tl-[8.414px] rounded-tr-[8.414px] flex items-center justify-center z-10">
              <span className="font-['Montserrat',_sans-serif] font-semibold text-[7px] tracking-[0.42px]" style={{ color: COLOR_PRIMARY }}>Policy</span>
            </div>
            {/* 外枠レクタングル（下側）- 左上角のみラウンドなし */}
            <div className="absolute top-[25px] left-0 right-0 bottom-0 rounded-tr-[8.414px] rounded-br-[8.414px] rounded-bl-[8.414px] border border-white" />
            {/* テキスト（外枠レクタングル内） */}
            <div className="absolute left-[40px] top-[35px]">
              <span className="font-['Noto_Sans_JP'] font-bold text-white text-[10.62px] tracking-[1.893px]">政策案でつながる</span>
            </div>
          </div>

          {/* 政策テーマ（Figma準拠） */}
          <div className="flex-1 h-[100.36px] flex items-center min-w-0">
            <div className="relative w-full h-[60.579px]">
              {/* 政策テーマを選択する ラベル */}
              <div className="absolute font-['Montserrat',_sans-serif] font-semibold text-white text-[10.62px] tracking-[1.5144px] -top-6 left-1">
                政策テーマを選択する
              </div>
              
              {/* テーマチップ群 */}
              <div className="absolute inset-0">
                {/* 1行目 */}
                <div className="absolute top-0 left-0 w-[120.859px] h-[24.189px] bg-white rounded-[19.027px] px-[3.197px] py-[2.398px] flex items-center justify-center border border-[#007aff] border-[0.295px] cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-['Noto_Sans_JP'] font-medium text-[9.611px] tracking-[2px] text-[rgba(27,31,38,0.72)]">経済産業省</span>
                </div>
                
                <div className="absolute top-0 left-[130px] w-[120.859px] h-[24.189px] bg-white rounded-[19.027px] px-[3.197px] py-[2.398px] flex items-center justify-center border border-[#007aff] border-[0.295px] cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-['Noto_Sans_JP'] font-medium text-[9.611px] tracking-[2px] text-[rgba(27,31,38,0.72)]">DX-デジタル変革</span>
                </div>
                
                <div className="absolute top-0 left-[260px] w-[120.859px] h-[24.189px] bg-white rounded-[19.027px] px-[3.197px] py-[2.398px] flex items-center justify-center border border-[#007aff] border-[0.295px] cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-['Noto_Sans_JP'] font-medium text-[9.611px] tracking-[2px] text-[rgba(27,31,38,0.72)]">産業構造転換</span>
                </div>
                
                <div className="absolute top-0 left-[390px] w-[120.859px] h-[24.189px] bg-white rounded-[19.027px] px-[3.197px] py-[2.398px] flex items-center justify-center border border-[#007aff] border-[0.295px] cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-['Noto_Sans_JP'] font-medium text-[7.611px] tracking-[0px] text-[rgba(27,31,38,0.72)] leading-[1.4]">
                    <span className="block mb-0">スタートアップ・中小企業支援</span>
                  </span>
                </div>
                
                <div className="absolute top-0 left-[520px] w-[120.859px] h-[23.137px] bg-white rounded-[19.027px] px-[3.197px] py-[2.398px] flex items-center justify-center border border-[#f59e0c] border-[0.476px] cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-['Noto_Sans_JP'] font-medium text-[9.611px] tracking-[2px] text-[rgba(27,31,38,0.72)]">通商戦略</span>
                </div>
                
                <div className="absolute top-0 left-[650px] w-[120.859px] h-[23.137px] bg-white rounded-[19.027px] px-[3.197px] py-[2.398px] flex items-center justify-center border border-[#f59e0c] border-[0.476px] cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-['Noto_Sans_JP'] font-medium text-[9.611px] tracking-[2px] text-[rgba(27,31,38,0.72)]">経済連携</span>
                </div>
                
                <div className="absolute top-0 left-[780px] w-[120.859px] h-[23.137px] bg-white rounded-[19.027px] px-[3.197px] py-[2.398px] flex items-center justify-center border border-[#f59e0c] border-[0.476px] cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-['Noto_Sans_JP'] font-medium text-[9.611px] tracking-[px] text-[rgba(27,31,38,0.72)]">ADX-アジア新産業共創</span>
                </div>
                
                <div className="absolute top-0 left-[910px] w-[120.859px] h-[23.137px] bg-white rounded-[19.027px] px-[3.197px] py-[2.398px] flex items-center justify-center border border-[#f59e0c] border-[0.476px] cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-['Noto_Sans_JP'] font-medium text-[9.611px] tracking-[2px] text-[rgba(27,31,38,0.72)]">経済安全保障</span>
                </div>
                
                {/* 2行目 */}
                <div className="absolute top-[30.44px] left-0 w-[120.859px] h-[23.137px] bg-white rounded-[19.027px] px-[3.197px] py-[2.398px] flex items-center justify-center border border-[#00b900] border-[0.476px] cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-['Noto_Sans_JP'] font-medium text-[9.611px] tracking-[2px] text-[rgba(27,31,38,0.72)]">再生可能エネルギー</span>
                </div>
                
                <div className="absolute top-[30.44px] left-[130px] w-[120.859px] h-[23.137px] bg-white rounded-[19.027px] px-[3.197px] py-[2.398px] flex items-center justify-center border border-[#00b900] border-[0.476px] cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-['Noto_Sans_JP'] font-medium text-[9.611px] tracking-[2px] text-[rgba(27,31,38,0.72)]">水素社会</span>
                </div>
                
                <div className="absolute top-[30.44px] left-[260px] w-[120.859px] h-[23.137px] bg-white rounded-[19.027px] px-[3.197px] py-[2.398px] flex items-center justify-center border border-[#00b900] border-[0.476px] cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-['Noto_Sans_JP'] font-medium text-[9.611px] tracking-[2px] text-[rgba(27,31,38,0.72)]">資源外交</span>
                </div>
                
                <div className="absolute top-[30.44px] left-[390px] w-[120.859px] h-[23.137px] bg-white rounded-[19.027px] px-[3.197px] py-[2.398px] flex items-center justify-center border border-[#af52de] border-[0.476px] cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-['Noto_Sans_JP'] font-medium text-[9.611px] tracking-[2px] text-[rgba(27,31,38,0.72)]">グリーン成長戦略</span>
                </div>
                
                <div className="absolute top-[30.44px] left-[520px] w-[120.859px] h-[23.137px] bg-white rounded-[19.027px] px-[3.197px] py-[2.398px] flex items-center justify-center border border-[#af52de] border-[0.476px] cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-['Noto_Sans_JP'] font-medium text-[9.611px] tracking-[2px] text-[rgba(27,31,38,0.72)]">デジタル政策</span>
                </div>
                
                <div className="absolute top-[30.44px] left-[650px] w-[120.859px] h-[23.137px] bg-white rounded-[19.027px] px-[3.197px] py-[2.398px] flex items-center justify-center border border-[#af52de] border-[0.476px] cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-['Noto_Sans_JP'] font-medium text-[9.611px] tracking-[2px] text-[rgba(27,31,38,0.72)]">人材政策</span>
                </div>
                
                <div className="absolute top-[30.44px] left-[780px] w-[120.859px] h-[23.137px] bg-white rounded-[19.027px] px-[3.197px] py-[2.398px] flex items-center justify-center border border-[#af52de] border-[0.476px] cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-['Noto_Sans_JP'] font-medium text-[9.611px] tracking-[2px] text-[rgba(27,31,38,0.72)]">産学連携</span>
                </div>
                
                <div className="absolute top-[30.44px] left-[910px] w-[120.859px] h-[23.137px] bg-white rounded-[19.027px] px-[3.197px] py-[2.398px] flex items-center justify-center border border-[#af52de] border-[0.476px] cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-['Noto_Sans_JP'] font-medium text-[9.611px] tracking-[2px] text-[rgba(27,31,38,0.72)]">地域政策</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツエリア - 画面の3/4 */}
      <div className="relative z-10 flex-1 px-6 lg:px-12 pb-8">
        <div className="flex gap-6">
          {/* メインコンテンツエリア */}
          <div className="flex-1 flex gap-6">
            {/* 左側：政策テーマ選択と政策内容 */}
            <div className="w-4/5 space-y-4">
              {/* 政策内容を記入する（カード背景削除） */}
              <div className="relative">
                <h3 className="absolute -top-6 left-0 font-['Noto_Sans_JP'] font-bold text-white text-xs tracking-[2px]">
                  政策名を入力してください
                </h3>
                <div className="flex flex-col">
                  {/* 政策名 */}
                  <div className="mb-4">
                    
                    <input
                      type="text"
                      value={formData.policyTitle}
                      onChange={(e) => handleInputChange("policyTitle", e.target.value)}
                      placeholder="政策名を入力してください"
                      className="w-full px-3 py-2 bg-white/90 rounded border border-white/70 text-xs placeholder-gray-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* 投稿内容 */}
                  <div className="flex-1 flex flex-col">
                    <label className="block text-xs tracking-[2px] font-bold text-white mb-2">
                      政策の詳細を記入してください
                    </label>
                    
                    <RichTextEditor
                      value={formData.policyContent}
                      onChange={(value) => setFormData(prev => ({ ...prev, policyContent: value }))}
                      placeholder="政策の詳細内容を入力してください"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 右側：添付資料と投稿ボタン */}
            <div className="w-1/4 space-y-4">
              {/* 添付資料を追加する（Figma準拠：白枠アウトライン＋白文字） */}
              <div className="relative">
                <h3 className="absolute -top-5 left-0 font-['Noto_Sans_JP'] font-bold text-white text-xs tracking-[2px]">
                  添付資料を追加する
                </h3>
                    <button
                      type="button"
                  onClick={() => document.getElementById(fileInputId)?.click()}
                  className="relative block w-[20rem] h-[20rem] rounded-tr-[8.414px] rounded-br-[8.414px] rounded-bl-[8.414px] border border-white text-white hover:bg-white/5 transition-colors"
                >
                  <div className="absolute inset-0 pointer-events-none rounded-tr-[8.414px] rounded-br-[8.414px] rounded-bl-[8.414px]" />
                  <div className="absolute left-1/2 -translate-x-1/2 top-[35%] flex flex-col items-center">
                    {/* アイコン画像（Figma提供） */}
                    <img src={IMG_OCTICON_FILE_16} alt="file" className="w-[47px] h-[47px] opacity-60 mb-4" />
                    <p className="font-['Noto_Sans_JP'] font-bold text-[12.62px] tracking-[1.89px] leading-[20px]">資料選択</p>
                    <p className="font-['Noto_Sans_JP'] font-bold text-[10.4px] tracking-[1.89px] leading-[20px] opacity-90">（1ファイル5MB以内）</p>
                  </div>
                </button>
                <input
                  id={fileInputId}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={(e) => handleFilesSelected(e.target.files)}
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

              {/* 操作ボタン（Figmaスタイル） */}
              <div className="space-y-4">
                <button
                  onClick={handleSaveDraft}
                  className="w-[150px] ml-20 mr-0 block py-[8px] rounded-full border border-white border-dashed text-white text-[10.3px] tracking-[5.35px] hover:bg-white/10 transition-colors"
                  aria-label="下書き保存"
                >
                  下書保存
                </button>
                <button
                  onClick={handleSubmit}
                  className="w-[150px] ml-20 mr-0 block py-[8px] rounded-full border text-[10.3px] font-bold tracking-[5.35px] bg-white hover:bg-[#fcfcfc] transition-colors"
                  style={{ color: '#4aa0e9', borderColor: '#4aa0e9' }}
                  aria-label="投稿する"
                >
                  投稿する <span aria-hidden>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
