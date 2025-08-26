import { useState, useCallback } from 'react';
import { saveCommentEvaluation, postAIResponse } from '@/lib/evaluation-api';
import { getUserFromToken } from '@/lib/auth';

interface FeedbackData {
  commentId: string;
  overallRating: number;
  empathyRating: number;
  aiResponse: string;
}

interface UseFeedbackSubmissionReturn {
  isSubmitting: boolean;
  submitFeedback: (feedback: FeedbackData) => Promise<void>;
  successMessage: string;
  successDescription: string;
  showSuccessMessage: boolean;
  clearSuccessMessage: () => void;
}

export const useFeedbackSubmission = (
  onSuccess?: () => void
): UseFeedbackSubmissionReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successDescription, setSuccessDescription] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const submitFeedback = useCallback(async (feedback: FeedbackData) => {
    setIsSubmitting(true);
    
    try {
      // 評価データを保存
      await saveCommentEvaluation(feedback.commentId, {
        overallRating: feedback.overallRating,
        empathyRating: feedback.empathyRating,
      });
      
      // AI返信をコメントとして投稿
      if (feedback.aiResponse.trim()) {
        const userInfo = getUserFromToken();
        if (userInfo) {
          await postAIResponse(feedback.commentId, feedback.aiResponse, {
            author_type: userInfo.role as "admin" | "staff" | "contributor" | "viewer",
            author_id: userInfo.userId,
          });
        } else {
          throw new Error('ユーザー情報が取得できませんでした');
        }
      }
      
      // 成功メッセージを表示
      setSuccessMessage('フィードバックが正常に投稿されました');
      setSuccessDescription('評価と返信が保存されました');
      setShowSuccessMessage(true);
      
      // コールバックを実行
      onSuccess?.();
      
    } catch (error) {
      console.error('フィードバック送信エラー:', error);
      throw new Error('フィードバックの送信に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  }, [onSuccess]);

  const clearSuccessMessage = useCallback(() => {
    setShowSuccessMessage(false);
    setSuccessMessage('');
    setSuccessDescription('');
  }, []);

  return {
    isSubmitting,
    submitFeedback,
    successMessage,
    successDescription,
    showSuccessMessage,
    clearSuccessMessage,
  };
};
