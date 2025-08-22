"use client";

import { useRouter } from "next/navigation";
import Image from "next/image"; // 追加

export default function TopPageFitted() {
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

    return (
    <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-t from-[#7bc8e8] via-[#58aadb] to-[#2d8cd9]">
      {/* テクスチャ効果 */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="4" stitchTiles="stitch"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
          </svg>
        `)}")`
      }}></div>

      {/* ヘッダー */}
      <div className="absolute top-0 left-0 right-0 z-20 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 lg:mb-6 space-y-4 lg:space-y-0">
            <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-8">
              <h1 className="font-['Montserrat',_sans-serif] font-semibold text-white text-[16px] lg:text-[18.654px] tracking-[2.2384px] cursor-pointer hover:opacity-80 transition-opacity" onClick={handleGoToDashboard}>
                METI Picks
              </h1>
              <div className="flex flex-wrap items-center space-x-4 lg:space-x-6">
                <div className="text-white text-[12px] lg:text-[13.412px] font-bold tracking-[2.0118px] cursor-pointer hover:opacity-80 transition-opacity opacity-70 hover:border-b-2 hover:border-white hover:pb-1" onClick={() => router.push('/search')}>
                  人脈を探す
                </div>
                <div className="text-white text-[12px] lg:text-[13.412px] font-bold tracking-[2.0118px] cursor-pointer hover:opacity-80 transition-opacity opacity-70 hover:border-b-2 hover:border-white hover:pb-1" onClick={() => router.push('/policy')}>
                  政策を投稿する
                </div>
                <div className="text-white text-[12px] lg:text-[13.412px] font-bold tracking-[2.0118px] cursor-pointer hover:opacity-80 transition-opacity opacity-70 hover:border-b-2 hover:border-white hover:pb-1" onClick={() => router.push('/comments')}>
                  意見を確認する
                </div>
                <div className="text-white text-[12px] lg:text-[13.412px] font-bold tracking-[2.0118px] cursor-pointer hover:opacity-80 transition-opacity opacity-70 hover:border-b-2 hover:border-white hover:pb-1" onClick={() => router.push('/invitation')}>
                  招待コードを発行する
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/meeting-upload')}
                className="text-white text-[12px] lg:text-[13.06px] font-semibold tracking-[1.5672px] bg-white/10 rounded-lg px-3 py-2 cursor-pointer hover:bg-white/20 transition-colors"
              >
                面談録のアップロード
              </button>
              <div className="text-white text-[12px] lg:text-[13.06px] font-semibold tracking-[1.5672px] bg-white/10 rounded-lg px-3 py-2 cursor-pointer hover:bg-white/20 transition-colors">
                テックゼロ太郎さん
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ - 3カラム均等配置 */}
      <div className="absolute inset-0 flex items-center justify-center pt-32">
        <div className="w-full max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            
            {/* 人脈を探す - Figmaから正確再現 */}
            <div className="relative group cursor-pointer hover:scale-102 transition-transform duration-150 -mt-8" onClick={() => router.push('/search')}>
              <div className="relative w-full h-80">
                                {/* 背景装飾 - シンプルなSVGスタイル */}
                <div className="absolute inset-0 flex items-center justify-center z-10 group-hover:scale-105 transition-transform duration-150">
                  <div className="flex-none rotate-[16deg]">
                    <div className="relative w-[420px] h-[420px]">
                      <Image src="/network-search-bg.svg" alt="人脈を探す背景" className="w-full h-full" width={420} height={420} />
                    </div>
                  </div>
                </div>
                
                {/* テキストコンテンツ */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="h-[155px] leading-[0] text-center text-nowrap w-[266px] relative">
                                     {/* 説明文 */}
                   <div className="absolute bottom-0 flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] font-bold justify-center leading-[23px] left-0 right-0 text-[#ffffff] text-[12px] top-[54.64%] tracking-[0.7px] whitespace-pre drop-shadow-lg">
                     <p className="adjustLetterSpacing block mb-0">政策立案に最適な人材を、</p>
                     <p className="adjustLetterSpacing block mb-0">所属・専門・関心テーマから横断検索</p>
                     <p className="adjustLetterSpacing block">必要なときに、最短で出会いたい人にアクセス</p>
                   </div>
                   
                   {/* 英語サブタイトル */}
                   <div className="absolute flex flex-col font-['Montserrat:Medium',_sans-serif] font-medium justify-center left-0 right-0 text-[#ffffff] text-[13px] tracking-[0.27px] top-[27.84%] drop-shadow-lg">
                     <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre text-center">
                       Discover Key Connections
                     </p>
                   </div>
                   
                   {/* メインタイトル */}
                   <div className="absolute flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] font-bold justify-center left-0 right-0 text-[#ffffff] text-[25px] top-0 tracking-[4px] drop-shadow-lg">
                     <p className="adjustLetterSpacing block leading-[43px] text-nowrap whitespace-pre text-center">人脈を探す</p>
                   </div>
                 </div>
               </div>
              </div>
            </div>

            {/* 政策案を投稿する - 新しいSVGスタイル（星形ノイズ効果付き） */}
            <div className="relative group cursor-pointer hover:scale-102 transition-transform duration-150 mt-16" onClick={() => router.push('/policy')}>
              <div className="relative w-full h-80">
                {/* 背景装飾 - シンプルな星形SVG */}
                <div className="absolute inset-0 flex items-center justify-center z-10 group-hover:scale-105 transition-transform duration-150">
                                    <div className="relative w-[380px] h-[380px]">
                    <Image src="/policy-submit-bg.svg" alt="政策を投稿する背景" className="w-full h-full" width={380} height={380} />
                  </div>
                </div>
                
                {/* テキストコンテンツ */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="h-[155px] leading-[0] text-center text-nowrap w-[266px] relative">
                    {/* 説明文 */}
                    <div className="absolute bottom-0 flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] font-bold justify-center leading-[23px] left-0 right-0 text-[#ffffff] text-[12px] top-[54.64%] tracking-[0.7px] whitespace-pre drop-shadow-lg">
                      <p className="adjustLetterSpacing block mb-0">あなたの政策案を投稿しよう</p>
                      <p className="adjustLetterSpacing block mb-0">有識者を「探す」から</p>
                      <p className="adjustLetterSpacing block">「集まってくる」へ</p>
                    </div>
                    
                    {/* 英語サブタイトル */}
                    <div className="absolute flex flex-col font-['Montserrat:Regular',_sans-serif] font-normal justify-center left-0 right-0 text-[#ffffff] text-[13px] tracking-[-0.53px] top-[27.84%] drop-shadow-lg">
                      <p className="adjustLetterSpacing block leading-[26px] text-nowrap whitespace-pre text-center">
                        Submit a Policy Concept
                      </p>
                    </div>
                    
                    {/* メインタイトル */}
                    <div className="absolute flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] font-bold justify-center left-0 right-0 text-[#ffffff] text-[25px] top-0 tracking-[1.5px] drop-shadow-lg">
                      <p className="adjustLetterSpacing block leading-[43px] text-nowrap whitespace-pre text-center">政策案を投稿する</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 意見を確認する - 新しいSVGスタイル（円形ノイズ効果付き） */}
            <div className="relative group cursor-pointer hover:scale-102 transition-transform duration-150 -mt-16" onClick={() => router.push('/comments')}>
              <div className="relative w-full h-80">
                {/* 背景装飾 - シンプルな円形SVG */}
                <div className="absolute inset-0 flex items-center justify-center z-10 group-hover:scale-105 transition-transform duration-150">
                                    <div className="relative w-[380px] h-[380px]">
                    <Image src="/comments-view-bg.svg" alt="意見を確認する背景" className="w-full h-full" width={380} height={380} />
                  </div>
                </div>
                
                {/* テキストコンテンツ */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="h-[155px] leading-[0] text-center text-nowrap w-[266px] relative">
                    {/* 説明文 */}
                    <div className="absolute bottom-0 flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] font-bold justify-center leading-[23px] left-0 right-0 text-[#ffffff] text-[12px] top-[54.64%] tracking-[0.7px] whitespace-pre drop-shadow-lg">
                      <p className="adjustLetterSpacing block mb-0">あなたの政策案に対する</p>
                      <p className="adjustLetterSpacing block mb-0">有識者の生の意見を確認</p>
                      <p className="adjustLetterSpacing block">政策立案に必要な人脈を見つける</p>
                    </div>
                    
                    {/* 英語サブタイトル */}
                    <div className="absolute flex flex-col font-['Montserrat:Regular',_sans-serif] font-normal justify-center left-0 right-0 text-[#ffffff] text-[13px] tracking-[-0.53px] top-[27.84%] drop-shadow-lg">
                      <p className="adjustLetterSpacing block leading-[26px] text-nowrap whitespace-pre text-center">
                        Explore Expert Insights
                      </p>
                    </div>
                    
                    {/* メインタイトル */}
                    <div className="absolute flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] font-bold justify-center left-0 right-0 text-[#ffffff] text-[25px] top-0 tracking-[1.5px] drop-shadow-lg">
                      <p className="adjustLetterSpacing block leading-[43px] text-nowrap whitespace-pre text-center">意見を確認する</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>


    </div>
  );
}
