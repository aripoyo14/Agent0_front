"use client";

import Image from "next/image";
import { useLoadingNavigation } from "@/hooks/useLoadingNavigation";
import LoadingAnimation from "@/components/ui/LoadingAnimation";

export default function DashboardMainContent() {
  const {
    isLoading,
    loadingAnimationType,
    navigateToSearch,
    navigateToPolicy,
    navigateToComments,
  } = useLoadingNavigation({
    loadingDuration: 1500,
    animationType: 'spinner'
  });

  return (
    <>
      {/* ローディングアニメーション */}
      <LoadingAnimation 
        isVisible={isLoading} 
        type={loadingAnimationType}
        duration={1500}
      />
      
      <div className="absolute inset-0 flex items-center justify-center pt-32">
        <div className="w-full max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          
          {/* 人脈を探す */}
          <div 
            className="relative group cursor-pointer hover:scale-102 transition-transform duration-150 -mt-8"
            onClick={navigateToSearch}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigateToSearch();
              }
            }}
          >
            <div className="relative w-full h-80">
              <div className="absolute inset-0 flex items-center justify-center z-10 group-hover:scale-105 transition-transform duration-150">
                <div className="flex-none rotate-[16deg]">
                  <div className="relative w-[420px] h-[420px]">
                    <Image 
                      src="/network-search-bg.svg" 
                      alt="人脈を探す背景" 
                      className="w-full h-full" 
                      width={420} 
                      height={420}
                      priority={true}
                      quality={90}
                    />
                  </div>
                </div>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="h-[155px] leading-[0] text-center text-nowrap w-[266px] relative">
                  <div className="absolute bottom-0 flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] font-bold justify-center leading-[23px] left-0 right-0 text-[#ffffff] text-[12px] top-[54.64%] tracking-[0.7px] whitespace-pre drop-shadow-lg">
                    <p className="adjustLetterSpacing block mb-0">政策立案に最適な人材を、</p>
                    <p className="adjustLetterSpacing block mb-0">所属・専門・関心テーマから横断検索</p>
                    <p className="adjustLetterSpacing block">必要なときに、最短で出会いたい人にアクセス</p>
                  </div>
                  
                  <div className="absolute flex flex-col font-['Montserrat:Medium',_sans-serif] font-medium justify-center left-0 right-0 text-[#ffffff] text-[13px] tracking-[0.27px] top-[27.84%] drop-shadow-lg">
                    <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre text-center">
                      Discover Key Connections
                    </p>
                  </div>
                  
                  <div className="absolute flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] font-bold justify-center left-0 right-0 text-[#ffffff] text-[25px] top-0 tracking-[4px] drop-shadow-lg">
                    <p className="adjustLetterSpacing block leading-[43px] text-nowrap whitespace-pre text-center">人脈を探す</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 政策案を投稿する */}
          <div 
            className="relative group cursor-pointer hover:scale-102 transition-transform duration-150 mt-16"
            onClick={navigateToPolicy}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigateToPolicy();
              }
            }}
          >
            <div className="relative w-full h-80">
              <div className="absolute inset-0 flex items-center justify-center z-10 group-hover:scale-105 transition-transform duration-150">
                <div className="relative w-[380px] h-[380px]">
                  <Image 
                    src="/policy-submit-bg.svg" 
                    alt="政策を投稿する背景" 
                    className="w-full h-full" 
                    width={380} 
                    height={380}
                    priority={true}
                    quality={90}
                  />
                </div>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="h-[155px] leading-[0] text-center text-nowrap w-[266px] relative">
                  <div className="absolute bottom-0 flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] font-bold justify-center leading-[23px] left-0 right-0 text-[#ffffff] text-[12px] top-[54.64%] tracking-[0.7px] whitespace-pre drop-shadow-lg">
                    <p className="adjustLetterSpacing block mb-0">あなたの政策案を投稿しよう</p>
                    <p className="adjustLetterSpacing block mb-0">有識者を「探す」から</p>
                    <p className="adjustLetterSpacing block">「集まってくる」へ</p>
                  </div>
                  
                  <div className="absolute flex flex-col font-['Montserrat:Regular',_sans-serif] font-normal justify-center left-0 right-0 text-[#ffffff] text-[13px] tracking-[-0.53px] top-[27.84%] drop-shadow-lg">
                    <p className="adjustLetterSpacing block leading-[26px] text-nowrap whitespace-pre text-center">
                      Submit a Policy Concept
                    </p>
                  </div>
                  
                  <div className="absolute flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] font-bold justify-center left-0 right-0 text-[#ffffff] text-[25px] top-0 tracking-[1.5px] drop-shadow-lg">
                    <p className="adjustLetterSpacing block leading-[43px] text-nowrap whitespace-pre text-center">政策案を投稿する</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 意見を確認する */}
          <div 
            className="relative group cursor-pointer hover:scale-102 transition-transform duration-150 -mt-16"
            onClick={navigateToComments}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigateToComments();
              }
            }}
          >
            <div className="relative w-full h-80">
              <div className="absolute inset-0 flex items-center justify-center z-10 group-hover:scale-105 transition-transform duration-150">
                <div className="relative w-[380px] h-[380px]">
                  <Image 
                    src="/comments-view-bg.svg" 
                    alt="意見を確認する背景" 
                    className="w-full h-full" 
                    width={380} 
                    height={380}
                    priority={true}
                    quality={90}
                  />
                </div>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="h-[155px] leading-[0] text-center text-nowrap w-[266px] relative">
                  <div className="absolute bottom-0 flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] font-bold justify-center leading-[23px] left-0 right-0 text-[#ffffff] text-[12px] top-[54.64%] tracking-[0.7px] whitespace-pre drop-shadow-lg">
                    <p className="adjustLetterSpacing block mb-0">あなたの政策案に対する</p>
                    <p className="adjustLetterSpacing block mb-0">有識者の生の意見を確認</p>
                    <p className="adjustLetterSpacing block">政策立案に必要な人脈を見つける</p>
                  </div>
                  
                  <div className="absolute flex flex-col font-['Montserrat:Regular',_sans-serif] font-normal justify-center left-0 right-0 text-[#ffffff] text-[13px] tracking-[-0.53px] top-[27.84%] drop-shadow-lg">
                    <p className="adjustLetterSpacing block leading-[26px] text-nowrap whitespace-pre text-center">
                      Explore Expert Insights
                    </p>
                  </div>
                  
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
    </>
  );
}
