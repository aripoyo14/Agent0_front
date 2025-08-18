"use client";

import React, { useState, useEffect } from 'react';
import { getCommentCount, CommentCountResponse } from '@/lib/expert-api';

interface CommentCountProps {
  policyProposalId: string;
  className?: string;
  showIcon?: boolean;
}

export const CommentCount: React.FC<CommentCountProps> = ({ 
  policyProposalId, 
  className = "",
  showIcon = true
}) => {
  const [commentCount, setCommentCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data: CommentCountResponse = await getCommentCount(policyProposalId);
        setCommentCount(data.comment_count);
      } catch (err) {
        console.error('コメント数取得エラー:', err);
        setError('コメント数の取得に失敗しました');
        setCommentCount(0);
      } finally {
        setLoading(false);
      }
    };

    if (policyProposalId) {
      fetchCommentCount();
    }
  }, [policyProposalId]);

  if (loading) {
    return (
      <span className={`${className} inline-flex items-center text-gray-500`}>
        {showIcon && (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
        読み込み中...
      </span>
    );
  }

  if (error) {
    return (
      <span className={`${className} text-red-500 cursor-help`} title={error}>
        {showIcon && (
          <svg className="inline w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )}
        エラー
      </span>
    );
  }

  return (
    <span className={`${className} inline-flex items-center`}>
      {showIcon && (
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )}
      {commentCount} コメント
    </span>
  );
};
