"use client";

import { useState, useEffect, useCallback } from "react";
import { generateInvitationCode, type InvitationCodeResponse } from "@/lib/invitation-code";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function InvitationCodeForm() {
  const router = useRouter();
  const [formData, _setFormData] = useState({
    code_type: "expert" as const,
    max_uses: 1,
    expires_in_hours: 24,
    description: "",
  });
  const [_state, setState] = useState<SubmitState>("idle");
  const [_error, setError] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<InvitationCodeResponse | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // 自動発行機能
  const autoGenerateCode = useCallback(async () => {
    try {
      console.log("自動発行開始...");
      setState("submitting");
      const result = await generateInvitationCode(formData);
      // console.log("API応答:", result);
      // console.log("QRコードデータ:", result.qr_code_data);
      // console.log("QRコードデータの長さ:", result.qr_code_data?.length);
      setGeneratedCode(result);
      setState("success");
      console.log("状態更新完了, generatedCode:", result);
      
      // QRコードを設定
      if (result.qr_code_data) {
        console.log("自動発行 - QRコードデータを設定");
        // Base64データを適切なデータURL形式に変換
        const dataUrl = `data:image/png;base64,${result.qr_code_data}`;
        setQrCodeDataUrl(dataUrl);
      }
    } catch (error) {
      console.error("自動発行エラー:", error);
      setError(error instanceof Error ? error.message : "招待コードの自動発行に失敗しました");
      setState("error");
    }
  }, [formData]);

  // 認証状態の確認
  useEffect(() => {
    const checkAuth = async () => {
      console.log("認証状態チェック開始...");
      const authenticated = isAuthenticated();
      console.log("認証状態:", authenticated);
      setIsLoggedIn(authenticated);
      
      if (authenticated) {
        console.log("ログイン済み、自動発行開始...");
        // ログイン済みの場合のみ自動発行
        autoGenerateCode();
      } else {
        console.log("未ログイン");
      }
    };
    
    checkAuth();
  }, [autoGenerateCode]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      // 2秒後に元のアイコンに戻す
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (error) {
      console.error('コピーに失敗しました:', error);
    }
  };

  // ログインしていない場合の表示
  if (!isLoggedIn) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">認証が必要です</CardTitle>
            <CardDescription>
              招待コードを発行するには、ログインが必要です
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => router.push('/login')} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              ログインページへ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {generatedCode && (
        <Card className="border-0 shadow-none">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex flex-col items-center space-y-2">
                {qrCodeDataUrl ? (
                  <>
                    <Image 
                      src={qrCodeDataUrl} 
                      alt="招待QRコード" 
                      width={192} 
                      height={192} 
                      unoptimized
                      className="w-48 h-48 rounded-lg"
                    />
                  </>
                ) : (
                  <div className="w-48 h-48 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                    QRコード生成中...
                  </div>
                )}
              </div>
            </div>
            
            {/* 説明文 */}
            <div className="text-center mt-6 mb-4">
              <p className="text-white/90 text-sm font-medium">
                メールやチャットで共有する場合は、下記のリンクをご利用ください
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Input
                    value={generatedCode.invitation_link}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    onClick={() => copyToClipboard(generatedCode.invitation_link)}
                    variant="ghost"
                    size="sm"
                    className="px-3 border-0 bg-transparent hover:bg-white/10"
                  >
                    {copySuccess ? (
                      // チェックマークアイコン
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="white" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <polyline points="20,6 9,17 4,12"/>
                      </svg>
                    ) : (
                      // コピーアイコン
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="white" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                        <path d="m4 16-2-2v-6c0-1.1.9-2 2-2h6l2 2"/>
                      </svg>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
