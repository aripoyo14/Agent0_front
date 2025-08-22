"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// 政策タグのデータ（12個の政策タグ）
const policyTags = [
  { id: "economy-industry", name: "経済産業" },
  { id: "external-economy", name: "対外経済" },
  { id: "manufacturing-it-distribution-services", name: "ものづくり／情報／流通・サービス" },
  { id: "sme-regional-economy", name: "中小企業・地域経済産業" },
  { id: "energy-environment", name: "エネルギー・環境" },
  { id: "safety-security", name: "安全・安心" },
  { id: "digital-transformation", name: "DX" },
  { id: "green-growth", name: "GX" },
  { id: "startup-support", name: "スタートアップ支援" },
  { id: "diversity-management", name: "ダイバーシティ経営" },
  { id: "economic-security", name: "経済安全保障" },
  { id: "regional-co-creation", name: "地域共創" },
];

// 評価ボタンコンポーネント
const RatingButtons = ({ 
  value, 
  onChange, 
  label,
  leftLabel,
  rightLabel
}: { 
  value: number; 
  onChange: (value: number) => void; 
  label: string;
  leftLabel?: string;
  rightLabel?: string;
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-white min-w-[80px]">{label}:</span>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <div key={rating} className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => onChange(rating)}
                className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 hover:scale-110 relative overflow-hidden group ${
                  value >= rating
                    ? 'bg-gradient-to-br from-[#4AA0E9] to-[#2d8cd9] border-[#4AA0E9] text-white shadow-lg'
                    : 'bg-white/90 border-white/50 text-gray-400 hover:border-[#4AA0E9] hover:text-[#4AA0E9] hover:bg-white'
                } flex items-center justify-center text-sm font-bold`}
              >
                <span className="relative z-10">{rating}</span>
                {value >= rating && (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg" />
                )}
                {!value && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-300" />
                )}
              </button>
              {rating === 1 && leftLabel && (
                <span className="text-[8px] text-white/80 mt-1 font-bold">{leftLabel}</span>
              )}
              {rating === 5 && rightLabel && (
                <span className="text-[8px] text-white/80 mt-1 font-bold">{rightLabel}</span>
              )}
            </div>
          ))}
        </div>
      </div>
      {value > 0 && (
        <div className="ml-[92px]">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#4AA0E9] to-[#2d8cd9] transition-all duration-300 rounded-full"
                style={{ width: `${(value / 5) * 100}%` }}
              />
            </div>
            <span className="text-xs text-white/80 font-medium">{value}/5</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function MeetingUploadForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    personName: "",
    selectedPolicyTags: [] as string[],
    overallRating: 0,
    attitudeRating: 0,
    meetingFile: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePolicyTagToggle = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedPolicyTags: prev.selectedPolicyTags.includes(tagId)
        ? prev.selectedPolicyTags.filter(id => id !== tagId)
        : [...prev.selectedPolicyTags, tagId]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        meetingFile: file
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // TODO: 実際のAPI呼び出しを実装
      console.log("面談録アップロード:", formData);
      
      // 成功時の処理
      alert("面談録のアップロードが完了しました。");
      router.push('/dashboard');
    } catch (err) {
      console.error("アップロードエラー:", err);
      setError(err instanceof Error ? err.message : "アップロードに失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-12 pt-8">
        <h2 className="text-base font-bold text-white/90 tracking-[0.15em]">
          面談録アップロード
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 話した相手（名前）フリー記述 */}
        <div>
          <label htmlFor="personName" className="flex items-center gap-1 text-white text-xs font-medium mb-1">
            話した相手（名前）
            <span className="inline-block rounded bg-[#2d8cd9] px-1 py-0.5 text-[10px] font-bold text-white">
              必須
            </span>
          </label>
          <input
            id="personName"
            name="personName"
            type="text"
            required
            placeholder="面談した方の名前を入力してください"
            value={formData.personName}
            onChange={handleInputChange}
            className="block w-full rounded-lg bg-white/90 backdrop-blur-sm px-2 py-2 text-[#333] text-sm outline-none border-0 focus:bg-white focus:ring-1 focus:ring-white/50 placeholder:text-xs placeholder:text-[#999]"
          />
        </div>

                  {/* どんな情報について話したか（政策タグ選択） */}
          <div>
            <label className="flex items-center gap-1 text-white text-xs font-medium mb-3">
              どんな情報について話したか
              <span className="inline-block rounded bg-[#2d8cd9] px-1 py-0.5 text-[10px] font-bold text-white">
                必須
              </span>
            </label>
            
            {/* タグ選択エリア */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="grid grid-cols-3 gap-2">
                {policyTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handlePolicyTagToggle(tag.id)}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all text-center relative overflow-hidden group ${
                      formData.selectedPolicyTags.includes(tag.id)
                        ? "bg-white text-[#2d8cd9] shadow-md border-2 border-[#2d8cd9]"
                        : "bg-white/90 text-[#333] hover:bg-white hover:shadow-md hover:scale-105"
                    }`}
                  >
                    <span className="relative z-10">{tag.name}</span>
                    {!formData.selectedPolicyTags.includes(tag.id) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                    )}
                  </button>
                ))}
              </div>
              {formData.selectedPolicyTags.length === 0 && (
                <p className="text-[10px] text-white/80 mt-3 text-center">
                  政策テーマを選択してください（複数選択可能）
                </p>
              )}
            </div>
          </div>

        {/* 評価1（全体評価） */}
        <div>
          <RatingButtons 
            value={formData.overallRating} 
            onChange={(value) => setFormData(prev => ({ ...prev, overallRating: value }))} 
            label="全体評価"
            leftLabel="低い"
            rightLabel="高い"
          />
        </div>

        {/* 評価2（態度） */}
        <div>
          <RatingButtons 
            value={formData.attitudeRating} 
            onChange={(value) => setFormData(prev => ({ ...prev, attitudeRating: value }))} 
            label="態度"
            leftLabel="否定的"
            rightLabel="肯定的"
          />
        </div>

        {/* 面談録ファイルアップロード */}
        <div>
          <label htmlFor="meetingFile" className="flex items-center gap-1 text-white text-xs font-medium mb-3">
            面談録ファイル
            <span className="inline-block rounded bg-[#2d8cd9] px-1 py-0.5 text-[10px] font-bold text-white">
              必須
            </span>
          </label>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 relative">
            {formData.meetingFile ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#58aadb] rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{formData.meetingFile.name}</p>
                    <p className="text-xs text-white/60">
                      {(formData.meetingFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, meetingFile: null }))}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-sm text-white/80 mb-2">ファイルをドラッグ&ドロップまたはクリックして選択</p>
              </div>
            )}
            <input
              id="meetingFile"
              name="meetingFile"
              type="file"
              required
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {error && (
          <p className="text-[10px] text-blue-100 bg-blue-500/15 rounded px-2 py-1 text-center">
            {error}
          </p>
        )}

        {/* アップロードボタン */}
        <div className="pt-8 flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting || !formData.personName || formData.selectedPolicyTags.length === 0 || formData.overallRating === 0 || formData.attitudeRating === 0 || !formData.meetingFile}
            className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#58aadb] to-[#2d8cd9] px-8 py-3 text-white text-sm font-medium transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none overflow-hidden"
            aria-busy={isSubmitting}
          >
            <span className="relative z-10 flex items-center gap-2">
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  アップロード中…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  アップロード
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </div>

        {/* ダッシュボードへの戻るリンク */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="text-[10px] text-white/80 hover:text-white underline decoration-white/50 hover:decoration-white transition-colors"
          >
            ダッシュボードに戻る
          </button>
        </div>
      </form>
    </div>
  );
}
