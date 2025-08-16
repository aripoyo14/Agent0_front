"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { registerUser, getDepartments, getPositions, type UserRegistrationFormData, type Department, type Position } from "@/lib/user_registration";
import { completeMFASetup, generateQRCode, type MFAResponse } from "@/lib/mfa";
import Image from "next/image";

type SubmitState = "idle" | "submitting" | "error" | "success";
type RegistrationStep = "input" | "mfa-setup" | "completion";

export default function UserRegistrationForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<RegistrationStep>("input");
  const [formData, setFormData] = useState<UserRegistrationFormData>({
    last_name: "",
    first_name: "",
    extension: "",
    direct_phone: "",
    department_id: 0,
    position_id: 0,
    email: "",
    password: "",
    password_confirm: "",
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [mfaData, setMfaData] = useState<MFAResponse | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // MFAデータが設定されたらQRコードを生成
  const generateQRCodeForUser = useCallback(async () => {
    if (!mfaData) return;
    
    try {
      const qrCode = await generateQRCode(mfaData.user_id);
      setQrCodeDataUrl(qrCode);
    } catch (error) {
      console.error('QRコード生成エラー:', error);
    }
  }, [mfaData]);

  // 部署と役職のデータを取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('部署・役職データ取得開始...');
        const [deptData, posData] = await Promise.all([
          getDepartments(),
          getPositions()
        ]);
        console.log('部署データ:', deptData);
        console.log('役職データ:', posData);
        setDepartments(deptData);
        setPositions(posData);
      } catch (error) {
        console.error('部署・役職データ取得エラー:', error);
        console.error('エラー詳細:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (mfaData?.user_id) {
      generateQRCodeForUser();
    }
  }, [mfaData, generateQRCodeForUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    if (formData.password !== formData.password_confirm) {
      setError("パスワードが一致しません");
      return;
    }

    if (formData.department_id === 0) {
      setError("部署を選択してください");
      return;
    }

    if (formData.position_id === 0) {
      setError("役職を選択してください");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      // password_confirmを除外してAPIに送信
      const { password_confirm: _password_confirm, ...apiData } = formData;
      const result = await registerUser(apiData);
      console.log("登録成功:", result);
      setMfaData(result);
      setCurrentStep("mfa-setup");
      setState("idle");
    } catch (err) {
      console.error("登録エラー:", err);
      setState("error");
      setError(err instanceof Error ? err.message : "登録に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  async function handleMFASetup() {
    if (!mfaData || totpCode.length !== 6) return;

    try {
      setState("submitting");
      
      await completeMFASetup({
        user_id: mfaData.user_id,
        totp_secret: mfaData.totp_secret,
        backup_codes: mfaData.backup_codes,
      });

      setCurrentStep("completion");
      setState("idle");
    } catch (err) {
      console.error("MFA設定エラー:", err);
      setError(err instanceof Error ? err.message : "MFA設定に失敗しました");
      setState("idle");
    }
  }

  // 基本情報入力画面
  if (currentStep === "input") {
    return (
      <div className="w-full max-w-md">
        <h1 className="text-center text-xl font-bold text-white mb-12 tracking-[0.25em]">
          ユーザー 新規登録
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* 内線番号 */}
          <div>
            <label htmlFor="extension" className="flex items-center gap-1 text-white text-xs font-medium mb-1">
              内線番号
              <span className="inline-block rounded bg-[#4aa0e9] px-1 py-0.5 text-[10px] font-bold text-white">
                任意
              </span>
            </label>
            <input
              id="extension"
              name="extension"
              type="text"
              placeholder="内線番号を入力してください"
              value={formData.extension}
              onChange={handleInputChange}
              className="block w-full rounded-lg bg-white/90 backdrop-blur-sm px-2 py-2 text-[#333] text-sm outline-none border-0 focus:bg-white focus:ring-1 focus:ring-white/50 placeholder:text-xs placeholder:text-[#999]"
            />
          </div>

          {/* 直通番号 */}
          <div>
            <label htmlFor="direct_phone" className="flex items-center gap-1 text-white text-xs font-medium mb-1">
              直通番号
              <span className="inline-block rounded bg-[#4aa0e9] px-1 py-0.5 text-[10px] font-bold text-white">
                任意
              </span>
            </label>
            <input
              id="direct_phone"
              name="direct_phone"
              type="text"
              placeholder="直通番号を入力してください"
              value={formData.direct_phone}
              onChange={handleInputChange}
              className="block w-full rounded-lg bg-white/90 backdrop-blur-sm px-2 py-2 text-[#333] text-sm outline-none border-0 focus:bg-white focus:ring-1 focus:ring-white/50 placeholder:text-xs placeholder:text-[#999]"
            />
          </div>

          {/* 部署 */}
          <div>
            <label htmlFor="department_id" className="flex items-center gap-1 text-white text-xs font-medium mb-1">
              部署
              <span className="inline-block rounded bg-[#4aa0e9] px-1 py-0.5 text-[10px] font-bold text-white">
                必須
              </span>
            </label>
            <select
              id="department_id"
              name="department_id"
              required
              value={formData.department_id}
              onChange={(e) => setFormData(prev => ({ ...prev, department_id: parseInt(e.target.value) }))}
              className="block w-full rounded-lg bg-white/90 backdrop-blur-sm px-2 py-2 text-[#333] text-sm outline-none border-0 focus:bg-white focus:ring-1 focus:ring-white/50"
            >
              <option value={0}>
                {departments.length === 0 ? 'データ読み込み中...' : '部署を選択してください'}
              </option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}{dept.section ? ` - ${dept.section}` : ''}
                </option>
              ))}
            </select>
            {departments.length === 0 && (
              <p className="text-[10px] text-blue-100 bg-blue-500/15 rounded px-2 py-1 mt-1">
                部署データを読み込み中...
              </p>
            )}
          </div>

          {/* 役職 */}
          <div>
            <label htmlFor="position_id" className="flex items-center gap-1 text-white text-xs font-medium mb-1">
              役職
              <span className="inline-block rounded bg-[#4aa0e9] px-1 py-0.5 text-[10px] font-bold text-white">
                必須
              </span>
            </label>
            <select
              id="position_id"
              name="position_id"
              required
              value={formData.position_id}
              onChange={(e) => setFormData(prev => ({ ...prev, position_id: parseInt(e.target.value) }))}
              className="block w-full rounded-lg bg-white/90 backdrop-blur-sm px-2 py-2 text-[#333] text-sm outline-none border-0 focus:bg-white focus:ring-1 focus:ring-white/50"
            >
              <option value={0}>
                {positions.length === 0 ? 'データ読み込み中...' : '役職を選択してください'}
              </option>
              {positions.map((pos) => (
                <option key={pos.id} value={pos.id}>
                  {pos.name}
                </option>
              ))}
            </select>
            {positions.length === 0 && (
              <p className="text-[10px] text-blue-100 bg-blue-500/15 rounded px-2 py-1 mt-1">
                役職データを読み込み中...
              </p>
            )}
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
              onClick={() => router.push("/login")}
              className="text-[10px] text-white/80 hover:text-white underline decoration-white/50 hover:decoration-white transition-colors"
            >
              既にアカウントをお持ちですか？ログイン
            </button>
          </div>
        </form>
      </div>
    );
  }

  // MFA設定画面の表示条件を修正
  if (currentStep === "mfa-setup" && mfaData) {
    return (
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">
          二段階認証の設定
        </h1>
        
        <div className="bg-white rounded-lg p-6 space-y-4">
          <div className="text-center">
            <h3 className="font-semibold text-gray-800 mb-2">
              ステップ1: 認証アプリをインストール
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Google Authenticator、Microsoft Authenticator、またはAuthyをインストールしてください
            </p>
          </div>

          <div className="text-center">
            <h3 className="font-semibold text-gray-800 mb-2">
              ステップ2: QRコードをスキャン
            </h3>
            {qrCodeDataUrl ? (
              <div className="flex justify-center mb-4">
                <Image 
                  src={qrCodeDataUrl} 
                  alt="MFA QR Code" 
                  width={192} 
                  height={192} 
                  className="w-48 h-48"
                />
              </div>
            ) : (
              <div className="bg-gray-100 w-48 h-48 mx-auto flex items-center justify-center text-gray-500">
                QRコード生成中...
              </div>
            )}
            
            <div className="text-xs text-gray-500 mb-4">
              <p>手動入力用の秘密鍵:</p>
              <code className="bg-gray-100 px-2 py-1 rounded">
                {mfaData.totp_secret}
              </code>
            </div>
          </div>

          <div className="text-center">
            <h3 className="font-semibold text-gray-800 mb-2">
              ステップ3: 6桁の認証コードを入力
            </h3>
            <input
              type="text"
              placeholder="000000"
              maxLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-lg tracking-widest"
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
            />
          </div>

          <button
            onClick={handleMFASetup}
            disabled={totpCode.length !== 6 || isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "確認中..." : "認証コードを確認"}
          </button>

          <div className="text-center">
            <h3 className="font-semibold text-gray-800 mb-2">
              バックアップコード
            </h3>
            <p className="text-xs text-gray-600 mb-2">
              認証アプリが使えない場合の緊急用コード:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {mfaData.backup_codes.map((code, index) => (
                <code key={index} className="bg-gray-100 px-2 py-1 rounded text-center">
                  {code}
                </code>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 設定完了画面
  if (currentStep === "completion") {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            設定完了！
          </h1>
          <p className="text-gray-600 mb-6">
            二段階認証の設定が完了しました。<br />
            アカウントが有効化され、セキュリティが大幅に向上しました。
          </p>
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700"
          >
            ログイン画面へ
          </button>
        </div>
      </div>
    );
  }

  return null;
}
