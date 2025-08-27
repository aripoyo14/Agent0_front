// コメント数キャッシュシステム
interface CommentCountCache {
  count: number;
  timestamp: number;
  expires: number;
}

class CommentCountManager {
  private cache = new Map<string, CommentCountCache>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5分
  private readonly MAX_CACHE_SIZE = 1000; // 最大1000件キャッシュ

  // キャッシュから取得
  getFromCache(proposalId: string): number | null {
    const cached = this.cache.get(proposalId);
    if (!cached) return null;

    const now = Date.now();
    if (now > cached.expires) {
      this.cache.delete(proposalId);
      return null;
    }

    return cached.count;
  }

  // キャッシュに保存
  setCache(proposalId: string, count: number): void {
    const now = Date.now();
    
    // キャッシュサイズ制限
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      // 最も古いエントリを削除
      const oldestKey = [...this.cache.entries()]
        .sort(([,a], [,b]) => a.timestamp - b.timestamp)[0][0];
      this.cache.delete(oldestKey);
    }

    this.cache.set(proposalId, {
      count,
      timestamp: now,
      expires: now + this.CACHE_DURATION
    });
  }

  // キャッシュクリア
  clearCache(): void {
    this.cache.clear();
  }

  // 期限切れキャッシュの自動削除
  cleanupExpiredCache(): void {
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now > cached.expires) {
        this.cache.delete(key);
      }
    }
  }

  // キャッシュ統計
  getCacheStats() {
    return {
      size: this.cache.size,
      maxSize: this.MAX_CACHE_SIZE,
      cacheDuration: this.CACHE_DURATION
    };
  }
}

// シングルトンインスタンス
export const commentCountManager = new CommentCountManager();

// 定期的なキャッシュクリーンアップ
if (typeof window !== 'undefined') {
  setInterval(() => {
    commentCountManager.cleanupExpiredCache();
  }, 60 * 1000); // 1分ごと
}

// 開発環境でのログ
const devLog = (...args: unknown[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[CommentCache]', ...args);
  }
};

// キャッシュ付きコメント数取得関数
export const getCachedCommentCount = async (proposalId: string): Promise<number> => {
  // キャッシュから取得を試行
  const cached = commentCountManager.getFromCache(proposalId);
  if (cached !== null) {
    devLog(`Cache hit for ${proposalId}: ${cached}`);
    return cached;
  }

  // キャッシュにない場合はAPIから取得
  try {
    const { getCommentCount } = await import('@/lib/expert-api');
    const response = await getCommentCount(proposalId);
    const count = response.comment_count;
    
    // キャッシュに保存
    commentCountManager.setCache(proposalId, count);
    devLog(`Cache miss, fetched ${proposalId}: ${count}`);
    
    return count;
  } catch (error) {
    console.error(`コメント数取得エラー (${proposalId}):`, error);
    return 0;
  }
};

// 複数のコメント数を並列取得（制限付き）
export const getCachedCommentCountsBatch = async (
  proposalIds: string[], 
  concurrency: number = 5
): Promise<Record<string, number>> => {
  const results: Record<string, number> = {};
  
  // 既にキャッシュにあるものを先に処理
  const uncachedIds: string[] = [];
  for (const id of proposalIds) {
    const cached = commentCountManager.getFromCache(id);
    if (cached !== null) {
      results[id] = cached;
    } else {
      uncachedIds.push(id);
    }
  }

  if (uncachedIds.length === 0) {
    devLog(`All ${proposalIds.length} items found in cache`);
    return results;
  }

  devLog(`Cache: ${proposalIds.length - uncachedIds.length} hits, ${uncachedIds.length} misses`);

  // 並列度を制限して未キャッシュ分を取得
  const chunks = [];
  for (let i = 0; i < uncachedIds.length; i += concurrency) {
    chunks.push(uncachedIds.slice(i, i + concurrency));
  }

  for (const chunk of chunks) {
    const chunkResults = await Promise.allSettled(
      chunk.map(async (id) => {
        const count = await getCachedCommentCount(id);
        return { id, count };
      })
    );

    // 成功したもののみ結果に追加
    chunkResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        results[result.value.id] = result.value.count;
      }
    });
  }

  return results;
};
