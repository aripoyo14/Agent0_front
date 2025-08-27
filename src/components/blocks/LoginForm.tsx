"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, getUserFromToken } from "@/lib/auth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// パスワードリセットオーバーレイコンポーネント
const PasswordResetOverlay = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // ハリボテ実装 - 実際のAPI呼び出しは行わない
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // 3秒後にオーバーレイを閉じる
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        setEmail("");
      }, 3000);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="閉じる"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!isSubmitted ? (
          <>
            {/* ヘッダー */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">パスワードリセット</h2>
              <p className="text-sm text-gray-600">
                登録済みのメールアドレスを入力してください。<br />
                パスワードリセット用のリンクをお送りします。
              </p>
            </div>

            {/* フォーム */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス
                </label>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4AA0E9] focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !email}
                className="w-full bg-[#4AA0E9] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#3a8fd9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" color="white" />
                    <span>送信中...</span>
                  </>
                ) : (
                  "リセットメールを送信"
                )}
              </button>
            </form>
          </>
        ) : (
          /* 送信完了メッセージ */
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">メールを送信しました</h3>
            <p className="text-sm text-gray-600">
              {email} にパスワードリセット用のリンクを送信しました。<br />
              メールをご確認ください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

type SubmitState = "idle" | "submitting" | "error" | "success";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setState("submitting");

    try {
      if (!email || !password) {
        throw new Error("メールアドレスとパスワードを入力してください");
      }

      // 実APIログイン
      await login(email, password);
      setState("success");

      // 少し待ってからユーザー情報を取得（トークンの保存完了を待つ）
      setTimeout(() => {
        const userInfo = getUserFromToken();
        // console.log("ログイン後のユーザー情報:", userInfo);
        
        if (userInfo?.userType === 'expert') {
          // console.log("エキスパートとして認識、/expert/articlesに遷移");
          router.push("/expert/articles");
        } else {
          // console.log("一般ユーザーとして認識、/dashboardに遷移");
          router.push("/dashboard");
        }
      }, 100);
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "ログインに失敗しました");
    }
  }

  const isSubmitting = state === "submitting";

  return (
    <div className="w-full max-w-xs animate-scale-in">
      {/* キャッチフレーズ */}
      <div className="text-center mb-4 animate-fade-in">
        <p className="text-white/80 text-sm font-medium tracking-wide">
          未来に誇れる日本をつくる
        </p>
      </div>
      
      {/* タイトル */}
      <h1 className="text-center text-xl font-bold text-white mb-12 tracking-[0.25em] animate-slide-up">
        METI Picks
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 animate-fade-in animate-delay-300"
        aria-describedby={error ? "form-error" : undefined}
      >
        {/* メールアドレス */}
        <div className="animate-slide-in-left animate-delay-400">
          <label htmlFor="email" className="flex items-center gap-1 text-white text-xs font-medium mb-1">
            メールアドレス
            <span className="inline-block rounded bg-[#4aa0e9] px-1 py-0.5 text-[10px] font-bold text-white">
              必須
            </span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            placeholder="メールアドレスをご入力ください"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-lg bg-white/90 backdrop-blur-sm px-2 py-2 text-[#333] text-sm outline-none border-0 focus:bg-white focus:ring-1 focus:ring-white/50 placeholder:text-xs placeholder:text-[#999] transition-all duration-300 focus:scale-105 hover:bg-white"
          />
        </div>

        {/* パスワード */}
        <div className="animate-slide-in-right animate-delay-500">
          <label htmlFor="password" className="flex items-center gap-1 text-white text-xs font-medium mb-1">
            パスワード
            <span className="inline-block rounded bg-[#4aa0e9] px-1 py-0.5 text-[10px] font-bold text-white">
              必須
            </span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="パスワードをご入力ください"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full rounded-lg bg-white/90 backdrop-blur-sm px-2 py-2 text-[#333] text-sm outline-none border-0 focus:bg-white focus:ring-1 focus:ring-white/50 placeholder:text-xs placeholder:text-[#999] transition-all duration-300 focus:scale-105 hover:bg-white"
          />
          <div className="mt-2 text-center">
            <button
              type="button"
              onClick={() => setShowPasswordReset(true)}
              className="text-[10px] text-white/80 hover:text-white underline decoration-white/50 hover:decoration-white transition-all duration-300 hover:scale-105"
            >
              パスワードをお忘れですか？
            </button>
          </div>
        </div>

        {error && (
          <p id="form-error" className="text-[10px] text-blue-100 bg-blue-500/15 rounded px-2 py-1 text-center animate-fade-in">
            {error}
          </p>
        )}

        {/* ログインボタン */}
        <div className="pt-6 flex justify-center animate-fade-in animate-delay-600">
          <button
            type="submit"
            disabled={isSubmitting}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-white/90 backdrop-blur-sm px-6 py-3 text-[#4AA0E9] text-sm font-medium transition-all duration-300 hover:bg-white hover:shadow-lg hover:scale-110 disabled:opacity-60 disabled:hover:scale-100 min-w-[120px] hover-lift animate-glow-pulse"
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" color="primary" />
                <span>ログイン中...</span>
              </>
            ) : (
              <>
                <span>ログイン</span>
                <span aria-hidden className="inline-block select-none text-base text-[#4AA0E9] transition-transform duration-300 group-hover:translate-x-1">→</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* パスワードリセットオーバーレイ */}
      <PasswordResetOverlay 
        isOpen={showPasswordReset} 
        onClose={() => setShowPasswordReset(false)} 
      />
    </div>
  );
}