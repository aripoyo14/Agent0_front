"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, getUserFromToken } from "@/lib/auth";

type SubmitState = "idle" | "submitting" | "error" | "success";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setState("submitting");

    try {
      if (!email || !password) {
        throw new Error("メールアドレスとパスワードを入力してください");
      }

      // console.log("ログイン開始:", { email });

      // 実APIログイン
      await login(email, password);
      setState("success");

      // 少し待ってからユーザー情報を取得（トークンの保存完了を待つ）
      setTimeout(() => {
        const userInfo = getUserFromToken();
        // console.log("ログイン後のユーザー情報:", userInfo);
        
        if (userInfo?.userType === 'expert') {
          // console.log("エキスパートとして認識、/policyに遷移");
          router.push("/policy");
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
    <div className="w-full max-w-xs">
      {/* タイトル */}
              <h1 className="text-center text-xl font-bold text-white mb-12 tracking-[0.25em]">
        人脈検索プラットフォーム
             </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        aria-describedby={error ? "form-error" : undefined}
      >
        {/* メールアドレス */}
        <div>
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
            className="block w-full rounded-lg bg-white/90 backdrop-blur-sm px-2 py-2 text-[#333] text-sm outline-none border-0 focus:bg-white focus:ring-1 focus:ring-white/50 placeholder:text-xs placeholder:text-[#999]"
          />
        </div>

        {/* パスワード */}
        <div>
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
            className="block w-full rounded-lg bg-white/90 backdrop-blur-sm px-2 py-2 text-[#333] text-sm outline-none border-0 focus:bg-white focus:ring-1 focus:ring-white/50 placeholder:text-xs placeholder:text-[#999]"
          />
          <div className="mt-2 text-center">
            <button
              type="button"
              onClick={() => alert("パスワードリセット機能（準備中）")}
              className="text-[10px] text-white/80 hover:text-white underline decoration-white/50 hover:decoration-white transition-colors"
            >
              パスワードをお忘れですか？
            </button>
          </div>
        </div>

        {error && (
          <p id="form-error" className="text-[10px] text-blue-100 bg-blue-500/15 rounded px-2 py-1 text-center">
            {error}
          </p>
        )}

        {/* ログインボタン */}
        <div className="pt-6 flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-4 py-2 text-[#4AA0E9] text-sm font-medium transition-all hover:bg-white hover:shadow-lg disabled:opacity-60"
            aria-busy={isSubmitting}
          >
            {isSubmitting ? "送信中…" : "ログイン"}
            <span aria-hidden className="inline-block select-none text-base text-[#4AA0E9]">→</span>
          </button>
        </div>
      </form>
    </div>
  );
}