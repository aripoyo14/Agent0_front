import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MFASetupProps {
  userId: string;
  onComplete: () => void;
}

export function MFASetup({ userId, onComplete }: MFASetupProps) {
  const [step, setStep] = useState<'setup' | 'verify' | 'complete'>('setup');
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [totpCode, setTotpCode] = useState('');
  const [loading, setLoading] = useState(false);

  // バックエンドのFastAPIサーバーにリクエスト
  const API_BASE = 'http://localhost:8000/api';

  // モックデータを使用してフロントエンドのみで動作
  const setupMFA = useCallback(async () => {
    try {
      setLoading(true);
      
      // 1. TOTP秘密鍵を生成
      const secretResponse = await fetch(`${API_BASE}/mfa/generate-secret`, {
        method: 'POST'
      });
      const secretData = await secretResponse.json();
      
      // 2. バックアップコードを生成
      const backupResponse = await fetch(`${API_BASE}/mfa/generate-backup-codes`, {
        method: 'POST'
      });
      const backupData = await backupResponse.json();
      
      // 3. MFAを有効化
      const enableResponse = await fetch(`${API_BASE}/mfa/enable?user_id=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totp_secret: secretData.secret,
          backup_codes: backupData.backup_codes
        })
      });
      
      if (enableResponse.ok) {
        // 4. QRコードを生成
        const qrResponse = await fetch(`${API_BASE}/mfa/generate-qr/${userId}`);
        const qrData = await qrResponse.json();
        
        setQrCode(qrData.qr_code);
        setSecret(qrData.secret);
        setBackupCodes(backupData.backup_codes);
        setStep('verify');
      }
    } catch (error) {
      console.error('MFA設定エラー:', error);
    } finally {
      setLoading(false);
    }
  }, [API_BASE, userId]);

  useEffect(() => {
    if (step === 'setup') {
      void setupMFA();
    }
  }, [step, setupMFA]);

  const verifyTOTP = async () => {
    try {
      setLoading(true);
      
      // API_BASEを使用してバックエンドにリクエスト
      const response = await fetch(`${API_BASE}/mfa/verify-totp?user_id=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totp_code: totpCode })
      });
      
      if (response.ok) {
        setStep('complete');
        onComplete();
      }
    } catch (error) {
      console.error('TOTP検証エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'setup') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>MFA設定</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            {loading ? (
              <div>MFAを設定中...</div>
            ) : (
              <Button onClick={() => setupMFA()}>
                MFA設定を開始
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'verify') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Authenticatorアプリに追加</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrCode} alt="QR Code" className="mx-auto mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              上記のQRコードをGoogle Authenticatorなどのアプリでスキャンしてください
            </p>
            <p className="text-xs text-gray-500 mb-4">
              または、手動で秘密鍵を入力: <code className="bg-gray-100 px-2 py-1 rounded">{secret}</code>
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="totp">TOTPコード</Label>
            <Input
              id="totp"
              type="text"
              placeholder="6桁のコードを入力"
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value)}
              maxLength={6}
            />
          </div>
          
          <Button 
            onClick={verifyTOTP} 
            disabled={totpCode.length !== 6 || loading}
            className="w-full"
          >
            {loading ? '検証中...' : '検証'}
          </Button>
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <h4 className="font-medium text-yellow-800 mb-2">バックアップコード</h4>
            <p className="text-sm text-yellow-700 mb-2">
              以下のコードを安全な場所に保管してください：
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {backupCodes.map((code, index) => (
                <code key={index} className="bg-white px-2 py-1 rounded border">
                  {code}
                </code>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'complete') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>MFA設定完了！</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-green-600">
            <p>MFAが正常に設定されました。</p>
            <p className="text-sm mt-2">
              次回ログイン時からMFA認証が必要になります。
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
