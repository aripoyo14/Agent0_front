"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { registerExpert, type ExpertRegistrationFormData } from "@/lib/expert_registration";
import { completeMFASetup, generateQRCode, type MFAResponse } from "@/lib/mfa";
import { BusinessCardUpload } from "@/components/ui/business-card-upload";
import { uploadBusinessCard } from "@/lib/business-card-upload";
import Image from "next/image";

type SubmitState = "idle" | "submitting" | "error" | "success";
type RegistrationStep = "input" | "mfa-setup" | "completion";

export default function ExpertRegistrationForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<RegistrationStep>("input");
  const [formData, setFormData] = useState<ExpertRegistrationFormData>({
    last_name: "",
    first_name: "",
    self_pr: "",
    password: "",
    password_confirm: "",
  });
  const [businessCardImage, setBusinessCardImage] = useState<File | null>(null);
  const [mfaData, setMfaData] = useState<MFAResponse | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>(""); // ← 1箇所のみ
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState<string>(""); // ← mfaCodeをtotpCodeに統一
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

  useEffect(() => {
    if (mfaData?.user_id) {
      generateQRCodeForUser();
    }
  }, [mfaData, generateQRCodeForUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBusinessCardImageSelected = (file: File) => {
    setBusinessCardImage(file);
    console.log("名刺画像が選択されました:", file.name);
  };

  const handleBusinessCardImageRemoved = () => {
    setBusinessCardImage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("=== フォーム送信開始 ===");
    setError(null);
    
    if (formData.password !== formData.password_confirm) {
      setError("パスワードが一致しません");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      // 名刺画像がある場合は、まず画像をアップロード
      let businessCardUrl = null;
      if (businessCardImage) {
        try {
          const uploadResult = await uploadBusinessCard(businessCardImage);
          businessCardUrl = uploadResult.image_url; // ここでURLを取得
          console.log("名刺画像のアップロード完了:", uploadResult.image_url);
        } catch (uploadError) {
          console.error("名刺画像のアップロードに失敗:", uploadError);
        }
      }

      // フォームデータを作成
      const apiData = {
        ...formData,
        business_card_image_url: businessCardUrl, // ここでURLを設定
      };

      console.log("送信するフォームデータ:", apiData); // この行を追加

      const result = await registerExpert(apiData);
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
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold text-white tracking-[0.25em] mb-2">
            METI Picks
          </h1>
          <h2 className="text-base font-bold text-white/90 tracking-[0.15em]">
            エントリーフォーム
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 既存のフォームフィールド（変更なし） */}
          {/* 姓と名を横並びに */}
          <div className="grid grid-cols-2 gap-4">
            {/* 姓 */}
            <div>
              <label htmlFor="last_name" className="flex items-center gap-1 text-white text-xs font-medium mb-1">
                姓
                <span className="inline-block rounded bg-[#2d8cd9] px-1 py-0.5 text-[10px] font-bold text-white">
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
                <span className="inline-block rounded bg-[#2d8cd9] px-1 py-0.5 text-[10px] font-bold text-white">
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

          {/* 自己PR */}
          <div>
            <label htmlFor="self_pr" className="flex items-center gap-1 text-white text-xs font-medium mb-1">
              自己PR
              <span className="inline-block rounded bg-[#2d8cd9] px-1 py-0.5 text-[10px] font-bold text-white">
                必須
              </span>
            </label>
            <textarea
              id="self_pr"
              name="self_pr"
              required
              placeholder="自己PRを入力してください"
              value={formData.self_pr}
              onChange={handleInputChange}
              rows={4}
              className="block w-full rounded-lg bg-white/90 backdrop-blur-sm px-2 py-2 text-[#333] text-sm outline-none border-0 focus:bg-white focus:ring-1 focus:ring-white/50 placeholder:text-xs placeholder:text-[#999] resize-none"
            />
          </div>

          {/* パスワード */}
          <div>
            <label htmlFor="password" className="flex items-center gap-1 text-white text-xs font-medium mb-1">
              パスワード
              <span className="inline-block rounded bg-[#2d8cd9] px-1 py-0.5 text-[10px] font-bold text-white">
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
              <span className="inline-block rounded bg-[#2d8cd9] px-1 py-0.5 text-[10px] font-bold text-white">
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

          {/* 名刺画像アップロード - 一番下に配置 */}
          <BusinessCardUpload
            onImageSelected={handleBusinessCardImageSelected}
            onImageRemoved={handleBusinessCardImageRemoved}
            selectedImage={businessCardImage}
          />

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
              className="inline-flex items-center justify-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-4 py-2 text-[#2d8cd9] text-sm font-medium transition-all hover:bg-white hover:shadow-lg disabled:opacity-60"
              aria-busy={isSubmitting}
            >
              {isSubmitting ? "送信中…" : "登録"}
              <span aria-hidden className="inline-block select-none text-base text-[#2d8cd9]">→</span>
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