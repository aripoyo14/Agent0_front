"use client";

import { useState, useEffect, useCallback } from "react";
import { generateInvitationCode, type InvitationCodeResponse } from "@/lib/invitation-code";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">発行完了</CardTitle>
            <CardDescription>
              招待コードが正常に発行されました
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">QRコード</Label>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">招待コード</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={generatedCode.code}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    onClick={() => copyToClipboard(generatedCode.code)}
                    variant="outline"
                    size="sm"
                  >
                    コピー
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">招待リンク</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={generatedCode.invitation_link}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    onClick={() => copyToClipboard(generatedCode.invitation_link)}
                    variant="outline"
                    size="sm"
                  >
                    コピー
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">最大使用回数:</span>
                <span className="ml-2">{generatedCode.max_uses}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">有効期限:</span>
                <span className="ml-2">
                  {new Date(generatedCode.expires_at).toLocaleString("ja-JP")}
                </span>
              </div>
              {generatedCode.description && (
                <div className="col-span-2">
                  <span className="font-medium text-gray-700">説明:</span>
                  <span className="ml-2">{generatedCode.description}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
