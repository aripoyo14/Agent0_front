"use client";

import { useState, useEffect } from "react";
import { getMyInvitationCodes, deactivateInvitationCode, type InvitationCode } from "@/lib/invitation-code";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { isAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function InvitationCodeList() {
  const router = useRouter();
  const [codes, setCodes] = useState<InvitationCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = isAuthenticated();
      setIsLoggedIn(authenticated);
      
      if (authenticated) {
        fetchCodes();
      } else {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const fetchCodes = async () => {
    try {
      setLoading(true);
      const result = await getMyInvitationCodes();
      setCodes(result.codes);
    } catch (error) {
      setError(error instanceof Error ? error.message : "招待コードの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (code: string) => {
    if (!confirm("この招待コードを無効化しますか？")) return;

    try {
      await deactivateInvitationCode(code);
      // リストを更新
      setCodes(prev => prev.map(c => 
        c.code === code ? { ...c, is_active: false } : c
      ));
    } catch (error) {
      alert("招待コードの無効化に失敗しました");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ja-JP");
  };

  const getStatusBadge = (code: InvitationCode) => {
    if (!code.is_active) {
      return <Badge variant="destructive">無効</Badge>;
    }
    if (new Date(code.expires_at) < new Date()) {
      return <Badge variant="secondary">期限切れ</Badge>;
    }
    if (code.used_count >= code.max_uses) {
      return <Badge variant="secondary">使用上限</Badge>;
    }
    return <Badge variant="default">有効</Badge>;
  };

  if (!isLoggedIn) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            ログインが必要です
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">読み込み中...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">{error}</div>
          <Button onClick={fetchCodes} className="mt-2">再試行</Button>
        </CardContent>
      </Card>
    );
  }

  if (codes.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            発行した招待コードはありません
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">発行済み招待コード</h3>
        <Button onClick={fetchCodes} variant="outline" size="sm">
          更新
        </Button>
      </div>

      <div className="grid gap-4">
        {codes.map((code) => (
          <Card key={code.code} className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="font-mono text-sm">
                    {code.code}
                  </Badge>
                  {getStatusBadge(code)}
                </div>
                <div className="text-right text-sm text-gray-500">
                  {formatDate(code.created_at)}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                <div>
                  <span className="font-medium text-gray-700">タイプ:</span>
                  <Badge variant="secondary" className="ml-2">
                    {code.code_type === "expert" ? "エキスパート" : "一般ユーザー"}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium text-gray-700">使用回数:</span>
                  <span className="ml-2">{code.used_count}/{code.max_uses}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">有効期限:</span>
                  <span className="ml-2">{formatDate(code.expires_at)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">状態:</span>
                  <span className="ml-2">
                    {code.is_active ? "有効" : "無効"}
                  </span>
                </div>
              </div>

              {code.description && (
                <div className="mb-3">
                  <span className="font-medium text-gray-700">説明:</span>
                  <span className="ml-2 text-gray-600">{code.description}</span>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                {code.is_active && (
                  <Button
                    onClick={() => handleDeactivate(code.code)}
                    variant="destructive"
                    size="sm"
                  >
                    無効化
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
