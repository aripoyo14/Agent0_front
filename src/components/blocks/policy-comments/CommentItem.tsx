import React, { useState, useEffect, useCallback, memo } from 'react';
import { Comment, isFeedbackSubmitted, fetchRepliesByCommentId, fetchReplyCountByCommentId } from '@/lib/comments-api';
import { CommentFeedbackForm } from './CommentFeedbackForm';

interface CommentItemProps {
  comment: Comment;
  onFeedbackSubmit: (feedback: {
    commentId: string;
    overallRating: number;
    empathyRating: number;
    aiResponse: string;
  }) => void;
  isSubmitting?: boolean;
}

export const CommentItem = memo<CommentItemProps>(({ 
  comment, 
  onFeedbackSubmit,
  isSubmitting = false
}) => {
  const hasFeedback = isFeedbackSubmitted(comment);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const [replyCount, setReplyCount] = useState<number>(0);

  // コンポーネントマウント時に返信件数を取得
  useEffect(() => {
    const loadReplyCount = async () => {
      try {
        const count = await fetchReplyCountByCommentId(comment.id);
        setReplyCount(count);
      } catch (error) {
        console.error('返信件数取得エラー:', error);
      }
    };
    loadReplyCount();
  }, [comment.id]);

  // 投稿完了後に返信件数と一覧を更新
  useEffect(() => {
    if (!isSubmitting) {
      const updateReplyCount = async () => {
        try {
          const count = await fetchReplyCountByCommentId(comment.id);
          if (count !== replyCount) {
            setReplyCount(count);
            
            // 返信が表示されている場合は一覧も更新
            if (showReplies) {
              const response = await fetchRepliesByCommentId(comment.id);
              setReplies(response.replies);
            }
          }
        } catch (error) {
          console.error('返信更新エラー:', error);
        }
      };
      
      const timeoutId = setTimeout(updateReplyCount, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [isSubmitting, comment.id, replyCount, showReplies]);

  // 返信コメントを取得する関数
  const loadReplies = useCallback(async () => {
    if (replies.length > 0 && !isSubmitting) {
      setShowReplies(!showReplies);
      return;
    }

    setRepliesLoading(true);
    try {
      const response = await fetchRepliesByCommentId(comment.id);
      setReplies(response.replies);
      setShowReplies(true);
      
      // 返信件数も更新
      const count = await fetchReplyCountByCommentId(comment.id);
      setReplyCount(count);
    } catch (error) {
      console.error('返信コメント取得エラー:', error);
    } finally {
      setRepliesLoading(false);
    }
  }, [comment.id, replies.length, isSubmitting, showReplies]);

  const handleFeedbackSubmit = useCallback(async (feedback: {
    commentId: string;
    overallRating: number;
    empathyRating: number;
    aiResponse: string;
  }) => {
    await onFeedbackSubmit(feedback);
    setShowFeedbackForm(false);
  }, [onFeedbackSubmit]);

  return (
    <div className="bg-white p-4 mb-4 relative rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] hover:border-gray-200">
      {/* ステータス表示 */}
      {hasFeedback && (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center justify-center rounded-md bg-[#4AA0E9] text-white text-xs px-2 py-0.5 font-medium">
            • 評価保存済み
          </span>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-bold text-base text-gray-900 leading-tight mb-1">{comment.author_name}</div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 leading-tight">{comment.author_type}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 leading-tight">{new Date(comment.posted_at).toLocaleDateString('ja-JP')}</span>
          </div>
        </div>
        {!hasFeedback && (
          <button
            onClick={() => setShowFeedbackForm(true)}
            className="px-3 py-1 bg-[#4AA0E9] text-white text-xs rounded hover:bg-[#3a8fd9] transition-colors"
          >
            フィードバックを追加
          </button>
        )}
      </div>
      
      <p className="text-sm text-gray-700 mb-4 leading-relaxed">{comment.comment_text}</p>
      
      {/* 返信表示ボタン */}
      {replyCount > 0 && (
        <div className="border-t border-gray-100 pt-3">
          <button
            onClick={loadReplies}
            disabled={repliesLoading}
            className="flex items-center space-x-2 text-sm text-[#4AA0E9] hover:text-[#3a8fd9] transition-colors disabled:opacity-50"
          >
            <span>{showReplies ? '返信を隠す' : '返信を表示'}</span>
            <span className="text-gray-500">({replyCount})</span>
            {repliesLoading && (
              <div className="w-4 h-4 border-2 border-[#4AA0E9] border-t-transparent rounded-full animate-spin"></div>
            )}
          </button>
          
          {/* 返信一覧 */}
          {showReplies && replies.length > 0 && (
            <div className="mt-3 space-y-3 pl-4 border-l-2 border-gray-100">
              {replies.map((reply) => (
                <div key={reply.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-sm text-gray-900">{reply.author_name}</span>
                    <span className="text-xs text-gray-500">{reply.author_type}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{new Date(reply.posted_at).toLocaleDateString('ja-JP')}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{reply.comment_text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* フィードバックフォーム（展開形式） */}
      {showFeedbackForm && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <CommentFeedbackForm 
            commentId={comment.id} 
            onSubmit={handleFeedbackSubmit}
            onClose={() => setShowFeedbackForm(false)}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </div>
  );
});

CommentItem.displayName = 'CommentItem';
