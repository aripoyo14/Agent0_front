"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiClient";

type SubmitState = "idle" | "submitting" | "error" | "success";

interface ExpertRegistrationData {
  last_name: string;
  first_name: string;
  company_name: string;
  department: string;
  email: string;
  password: string;
  password_confirm: string;
}

export default function ExpertRegistrationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<ExpertRegistrationData>({
    last_name: "",
    first_name: "",
    company_name: "",
    department: "",
    email: "",
    password: "",
    password_confirm: "",
  });
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // バリデーション
    if (!formData.last_name || !formData.first_name || !formData.company_name || 
        !formData.department || !formData.email || !formData.password) {
      setError("すべての必須項目を入力してください");
      return;
    }

    if (formData.password !== formData.password_confirm) {
      setError("パスワードが一致しません");
      return;
    }

    if (formData.password.length < 8) {
      setError("パスワードは8文字以上で入力してください");
      return;
    }

    setState("submitting");

    try {
      // apiFetchを使用してバックエンドAPIを呼び出し
      const result = await apiFetch("/api/experts/register", {
        method: "POST",
        body: {
          last_name: formData.last_name,
          first_name: formData.first_name,
          company_name: formData.company_name,
          department: formData.department,
          email: formData.email,
          password: formData.password,
        },
      });

      console.log("登録成功:", result);

      setState("success");
      
      // 登録成功後、ログインページに遷移
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (err) {
      console.error("登録エラー:", err);
      setState("error");
      setError(err instanceof Error ? err.message : "登録に失敗しました");
    }
  }

  const isSubmitting = state === "submitting";

  return (
    <div className="w-full max-w-md">
      {/* タイトル */}
      <h1 className="text-center text-xl font-bold text-white mb-12 tracking-[0.25em]">
        外部有識者 新規登録
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        aria-describedby={error ? "form-error" : undefined}
      >
        {/* 姓と名を横並びに */}
        <div className="grid grid-cols-2 gap-4">
          {/* 姓 */}
          <div>
            <label htmlFor="last_name" className="flex items-center gap-1 text-white text-xs font-medium mb-1">
              姓
              <span className="inline-block rounded bg-[#4aa0e9] px-1 py-0.5 text-[10px] font-bold text-white">
                必須
              </span>
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              required
              placeholder="姓を入力してください"
              value={formData.last_name}
              onChange={handleInputChange}
              className="block w-full rounded-lg bg-white/90 backdrop-blur-sm px-2 py-2 text-[#333] text-sm outline-none border-0 focus:bg-white focus:ring-1 focus:ring-white/50 placeholder:text-xs placeholder:text-[#999]"
            />
          </div>

          {/* 名 */}
          <div>
            <label htmlFor="first_name" className="flex items-center gap-1 text-white text-xs font-medium mb-1">
              名
              <span className="inline-block rounded bg-[#4aa0e9] px-1 py-0.5 text-[10px] font-bold text-white">
                必須
              </span>
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              required
              placeholder="名を入力してください"
              value={formData.first_name}
              onChange={handleInputChange}
              className="block w-full rounded-lg bg-white/90 backdrop-blur-sm px-2 py-2 text-[#333] text-sm outline-none border-0 focus:bg-white focus:ring-1 focus:ring-white/50 placeholder:text-xs placeholder:text-[#999]"
            />
          </div>
        </div>

        {/* 会社名 */}
        <div>
          <label htmlFor="company_name" className="flex items-center gap-1 text-white text-xs font-medium mb-1">
            会社名
            <span className="inline-block rounded bg-[#4aa0e9] px-1 py-0.5 text-[10px] font-bold text-white">
              必須
            </span>
          </label>
          <input
            id="company_name"
            name="company_name"
            type="text"
            required
            placeholder="会社名を入力してください"
            value={formData.company_name}
            onChange={handleInputChange}
            className="block w-full rounded-lg bg-white/90 backdrop-blur-sm px-2 py-2 text-[#333] text-sm outline-none border-0 focus:bg-white focus:ring-1 focus:ring-white/50 placeholder:text-xs placeholder:text-[#999]"
          />
        </div>

        {/* 部署 */}
        <div>
          <label htmlFor="department" className="flex items-center gap-1 text-white text-xs font-medium mb-1">
            部署
            <span className="inline-block rounded bg-[#4aa0e9] px-1 py-0.5 text-[10px] font-bold text-white">
              必須
            </span>
          </label>
          <input
            id="department"
            name="department"
            type="text"
            required
            placeholder="部署を入力してください"
            value={formData.department}
            onChange={handleInputChange}
            className="block w-full rounded-lg bg-white/90 backdrop-blur-sm px-2 py-2 text-[#333] text-sm outline-none border-0 focus:bg-white focus:ring-1 focus:ring-white/50 placeholder:text-xs placeholder:text-[#999]"
          />
        </div>

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
            required
            placeholder="メールアドレスを入力してください"
            value={formData.email}
            onChange={handleInputChange}
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
            autoComplete="new-password"
            required
            placeholder="8文字以上で入力してください"
            value={formData.password}
            onChange={handleInputChange}
            className="block w-full rounded-lg bg-white/90 backdrop-blur-sm px-2 py-2 text-[#333] text-sm outline-none border-0 focus:bg-white focus:ring-1 focus:ring-white/50 placeholder:text-xs placeholder:text-[#999]"
          />
        </div>

        {/* パスワード確認 */}
        <div>
          <label htmlFor="password_confirm" className="flex items-center gap-1 text-white text-xs font-medium mb-1">
            パスワード確認
            <span className="inline-block rounded bg-[#4aa0e9] px-1 py-0.5 text-[10px] font-bold text-white">
              必須
            </span>
          </label>
          <input
            id="password_confirm"
            name="password_confirm"
            type="password"
            autoComplete="new-password"
            required
            placeholder="パスワードを再入力してください"
            value={formData.password_confirm}
            onChange={handleInputChange}
            className="block w-full rounded-lg bg-white/90 backdrop-blur-sm px-2 py-2 text-[#333] text-sm outline-none border-0 focus:bg-white focus:ring-1 focus:ring-white/50 placeholder:text-xs placeholder:text-[#999]"
          />
        </div>

        {error && (
          <p id="form-error" className="text-[10px] text-blue-100 bg-blue-500/15 rounded px-2 py-1 text-center">
            {error}
          </p>
        )}

        {state === "success" && (
          <p className="text-[10px] text-green-100 bg-green-500/15 rounded px-2 py-1 text-center">
            登録が完了しました。ログインページに遷移します...
          </p>
        )}

        {/* 登録ボタン */}
        <div className="pt-6 flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-4 py-2 text-[#4AA0E9] text-sm font-medium transition-all hover:bg-white hover:shadow-lg disabled:opacity-60"
            aria-busy={isSubmitting}
          >
            {isSubmitting ? "送信中…" : "登録"}
            <span aria-hidden className="inline-block select-none text-base text-[#4AA0E9]">→</span>
          </button>
        </div>

        {/* ログインページへのリンク */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => router.push("/expert/login")}
            className="text-[10px] text-white/80 hover:text-white underline decoration-white/50 hover:decoration-white transition-colors"
          >
            既にアカウントをお持ちですか？ログイン
          </button>
        </div>
      </form>
    </div>
  );
}