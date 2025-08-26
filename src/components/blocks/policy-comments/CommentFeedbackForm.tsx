import React, { useState, useCallback } from 'react';
import { generateAIResponse } from '@/lib/evaluation-api';

interface CommentFeedbackFormProps {
  commentId: string;
  onSubmit: (feedback: {
    commentId: string;
    overallRating: number;
    empathyRating: number;
    aiResponse: string;
  }) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

// 評価ボタンコンポーネント
const RatingButtons = ({ 
  value, 
  onChange, 
  label,
  description,
  leftLabel,
  rightLabel
}: { 
  value: number; 
  onChange: (value: number) => void; 
  label: string;
  description?: string;
  leftLabel?: string;
  rightLabel?: string;
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-700 min-w-[80px]">{label}:</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((rating) => (
            <div key={rating} className="flex flex-col items-center">
              <button
                onClick={() => onChange(rating)}
                className={`w-6 h-6 rounded border transition-all hover:scale-105 ${
                  value >= rating
                    ? 'bg-[#4AA0E9] border-[#4AA0E9] text-white shadow-sm'
                    : 'bg-white border-gray-300 text-gray-400 hover:border-[#4AA0E9]'
                }`}
              >
                <span className="text-xs font-medium">{rating}</span>
              </button>
            </div>
          ))}
        </div>
        {value > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{leftLabel}</span>
            <span className="text-xs text-gray-400">→</span>
            <span className="text-xs text-gray-500">{rightLabel}</span>
          </div>
        )}
      </div>
      {description && (
        <p className="text-xs text-gray-500 ml-[88px]">{description}</p>
      )}
      {value > 0 && (
        <div className="flex items-center gap-2 ml-[88px]">
          <span className="text-xs text-gray-400">評価: </span>
          <span className="text-xs font-medium text-[#4AA0E9]">{value}/5</span>
        </div>
      )}
    </div>
  );
};

export const CommentFeedbackForm: React.FC<CommentFeedbackFormProps> = ({ 
  commentId, 
  onSubmit,
  onClose,
  isSubmitting = false
}) => {
  const [overallRating, setOverallRating] = useState(0);
  const [empathyRating, setEmpathyRating] = useState(0);
  const [aiResponse, setAiResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [_evaluationSaved, _setEvaluationSaved] = useState(false);

  const handleGenerateAIResponse = useCallback(async () => {
    setIsGenerating(true);
    try {
      const response = await generateAIResponse(commentId, {
        persona: "丁寧で建設的な政策担当者",
        instruction: "具体的な提案を含めて返信してください"
      });
      setAiResponse(response.suggested_reply);
    } catch (error) {
      console.error('AI返信生成エラー:', error);
      setAiResponse('AI返信の生成に失敗しました。もう一度お試しください。');
    } finally {
      setIsGenerating(false);
    }
  }, [commentId]);

  const handleRegenerate = useCallback(async () => {
    setIsGenerating(true);
    try {
      const response = await generateAIResponse(commentId, {
        persona: "建設的で批判的な視点を持つ政策担当者",
        instruction: "別の視点から、より詳細な分析を含めて返信してください"
      });
      setAiResponse(response.suggested_reply);
    } catch (error) {
      console.error('AI返信再生成エラー:', error);
      setAiResponse('AI返信の再生成に失敗しました。もう一度お試しください。');
    } finally {
      setIsGenerating(false);
    }
  }, [commentId]);

  const handleSubmit = useCallback(() => {
    if (overallRating > 0 && empathyRating > 0 && aiResponse.trim()) {
      onSubmit({
        commentId,
        overallRating,
        empathyRating,
        aiResponse
      });
    }
  }, [commentId, overallRating, empathyRating, aiResponse, onSubmit]);

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-900">フィードバック評価</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* 評価セクション */}
      <div className="space-y-4">
        <RatingButtons
          value={overallRating}
          onChange={setOverallRating}
          label="総合評価"
          description="コメントの内容や提案の質を評価してください"
          leftLabel="低い"
          rightLabel="高い"
        />
        
        <RatingButtons
          value={empathyRating}
          onChange={setEmpathyRating}
          label="共感度"
          description="政策への共感や理解度を評価してください"
          leftLabel="否定的"
          rightLabel="肯定的"
        />
      </div>

      {/* AI返信生成セクション */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium text-gray-900">AI返信生成</h4>
          <div className="flex gap-2">
            <button
              onClick={handleGenerateAIResponse}
              disabled={isGenerating}
              className="px-3 py-1 bg-[#4AA0E9] text-white text-xs rounded hover:bg-[#3a8fd9] transition-colors disabled:opacity-50"
            >
              {isGenerating ? '生成中...' : '生成'}
            </button>
            {aiResponse && (
              <button
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                再生成
              </button>
            )}
          </div>
        </div>
        
        <textarea
          value={aiResponse}
          onChange={(e) => setAiResponse(e.target.value)}
          placeholder="AIが生成した返信文案を編集できます..."
          className="w-full h-32 p-3 text-sm border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#4AA0E9] focus:border-transparent"
        />
      </div>

      {/* 送信ボタン */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          キャンセル
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || overallRating === 0 || empathyRating === 0 || !aiResponse.trim()}
          className="px-4 py-2 bg-[#4AA0E9] text-white text-sm rounded hover:bg-[#3a8fd9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '送信中...' : '送信'}
        </button>
      </div>
    </div>
  );
};
