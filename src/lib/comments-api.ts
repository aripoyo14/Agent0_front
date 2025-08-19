export interface Comment {
  id: string;
  policy_proposal_id: string;
  author_type: string;
  author_id: string;
  author_name: string;
  comment_text: string;
  parent_comment_id: string | null;
  posted_at: string;
  like_count: number;
  is_deleted: boolean;
  evaluation: number | null;
  stance: number | null;
}

export async function fetchCommentsByPolicyId(
  policyId: string, 
  limit: number = 50, 
  offset: number = 0
): Promise<Comment[]> {
  try {
    const response = await fetch(
      `/api/policy-proposals/${policyId}/comments?limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const comments = await response.json();
    return comments;
  } catch (error) {
    console.error('コメント取得エラー:', error);
    return [];
  }
}
