'use client';

import { MFASetup } from '@/components/MFASetup';

export default function MFATestPage() {
  const handleComplete = () => {
    console.log('MFA設定完了！');
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">MFA設定テスト</h1>
      <MFASetup 
        userId="581c56f8-6885-467d-a113-ffbbe65cd184" 
        onComplete={handleComplete} 
      />
    </div>
  );
}
