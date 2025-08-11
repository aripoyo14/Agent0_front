"use client";

import { useTopPageNavigation } from "@/hooks/useTopPageNavigation";

const imgVector = "http://localhost:3845/assets/53106efe68def3412993b290c8c5de68bee352e7.svg";
const imgBackground = "http://localhost:3845/assets/083b7eb8e500a0b2b2331d38e424932148783b69.svg";
const imgGroup = "http://localhost:3845/assets/3dc9d3281b09e84e8f15efc8fe10554644be0d25.svg";
const imgBackground1 = "http://localhost:3845/assets/f744ceed7b1a27744eb435d05c6344074491bea7.svg";

function Component27() {
  return (
    <div
      className="relative size-full"
      data-name="Component 27"
      id="node-1321_7720"
    >
      <div
        className="absolute bottom-[2.5%] font-['Montserrat:SemiBold',_'Noto_Sans_JP:Bold',_sans-serif] font-semibold leading-[0] left-0 right-[20%] text-[#ffffff] text-[24px] text-left text-nowrap top-[12.5%] tracking-[2.88px]"
        id="node-1321_7716"
      >
        <p className="adjustLetterSpacing block leading-[1.4] whitespace-pre">
          テックゼロ太郎さん
        </p>
      </div>
      <div
        className="absolute aspect-[24/24] left-[84.67%] overflow-clip right-[3.67%] top-1"
        data-name="fluent:alert-48-regular"
        id="node-1321_7717"
      >
        <div
          className="absolute inset-[8.33%_12.51%_8.34%_12.51%]"
          data-name="Vector"
          id="node-1321_7718"
        >
          <img alt="アラート" className="block max-w-none size-full" src={imgVector} />
        </div>
      </div>
    </div>
  );
}

export default function TopPage() {
  const {
    handleLogout,
    handleSearchPeople,
    handleSubmitPolicy,
    handleCheckOpinions,
  } = useTopPageNavigation();

  return (
    <div
      className="relative size-full"
      data-name="Toppage"
      id="node-1247_17028"
    >
      <div
        className="absolute h-[1947px] left-1 top-px w-[2832px]"
        id="node-1465_7328"
      >
        <div
          className="absolute bg-gradient-to-t from-[#b4d9d6] h-[1947px] left-1/2 to-[#58aadb] top-1/2 translate-x-[-50%] translate-y-[-50%] w-[2832px]"
          data-name="Section"
          id="node-1465_7329"
        />
      </div>
      <div
        className="absolute h-[1191.08px] mix-blend-screen top-[444px] translate-x-[-50%] w-[2022px]"
        data-name="List"
        id="node-1247_17154"
        style={{ left: "calc(50% + 12px)" }}
      >
        <div
          className="absolute mix-blend-screen size-[808.8px] top-[29.31px] translate-x-[-50%] cursor-pointer transition-transform hover:scale-105 z-10"
          data-name="Item"
          id="node-1247_17155"
          style={{ left: "calc(50% - 682.59px)" }}
          onClick={handleSearchPeople}
        >
          <div className="absolute flex h-[959.66px] items-center justify-center left-[-100px] mix-blend-screen top-[-100px] w-[962.276px]">
            <div className="flex-none rotate-[298deg]">
              <div
                className="h-[713.721px] relative w-[707.4px]"
                data-name="Background"
                id="node-1255_24006"
              >
                <img
                  alt=""
                  className="block max-w-none size-full"
                  src={imgBackground}
                />
              </div>
            </div>
          </div>
          <div
            className="absolute h-[456.551px] leading-[0] left-[64.86px] overflow-clip right-[97.16px] text-center translate-y-[-50%]"
            data-name="Container"
            id="node-1247_17157"
            style={{ top: "calc(50% - 0.359px)" }}
          >
            <div
              className="absolute h-[153.23px] text-[#ffffff] top-0 translate-x-[-50%] w-[556.05px]"
              data-name="Paragraph"
              id="node-1247_17158"
              style={{ left: "calc(50% - 8.246px)" }}
            >
              <div
                className="absolute flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] font-bold h-[101.1px] justify-center text-[31.594px] tracking-[1.8956px] translate-x-[-50%] translate-y-[-50%] w-[268.247px]"
                id="node-1247_17159"
                style={{
                  top: "calc(50% - 21.977px)",
                  left: "calc(50% + 0.146px)",
                }}
              >
                <p className="adjustLetterSpacing block leading-[53.709px]">
                  人脈を探す
                </p>
              </div>
              <div
                className="absolute flex flex-col font-['Montserrat:Regular',_sans-serif] font-normal h-[30.014px] justify-center text-[22.116px] tracking-[-0.6635px] translate-x-[-50%] translate-y-[-50%] w-[342.904px]"
                id="node-1247_17160"
                style={{
                  top: "calc(50% + 28.404px)",
                  left: "calc(50% + 0.139px)",
                }}
              >
                <p className="adjustLetterSpacing block leading-[33.173px]">
                  Discover Key Connections
                </p>
              </div>
            </div>
            <div
              className="absolute flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] font-bold justify-center leading-[44.231px] left-[323.39px] text-[#fcfcfc] text-[21.943px] tracking-[1.3269px] translate-x-[-50%] translate-y-[-50%] w-[646.78px]"
              id="node-1247_17161"
              style={{ top: "calc(50% + 21.031px)" }}
            >
              <p className="adjustLetterSpacing block mb-0">
                政策立案に最適な人材を、
              </p>
              <p className="adjustLetterSpacing block mb-0">
                所属・専門・関心テーマから横断検索。
              </p>
              <p className="adjustLetterSpacing block">
                必要なときに、最短で"出会いたい人"にアクセスできます。
              </p>
            </div>
          </div>
        </div>
        <div
          className="absolute mix-blend-screen size-[808.8px] top-[494.6px] translate-x-[-50%] cursor-pointer transition-transform hover:scale-105 z-10"
          data-name="Item"
          id="node-1247_17163"
          style={{ left: "calc(50% - 0.65px)" }}
          onClick={handleSubmitPolicy}
        >
          <div
            className="absolute left-0 size-[808.8px] top-0"
            data-name="Container"
            id="node-1247_17164"
          >
            <div className="absolute flex h-[853.613px] items-center justify-center left-[-39.52px] top-[-27.24px] w-[862.572px]">
              <div className="flex-none rotate-[356deg]">
                <div
                  className="h-[799.148px] overflow-clip relative rounded-[56.869px] w-[808.8px]"
                  data-name="s-504x498_c5b5dc1b-2dfd-4a88-b35a-c5eb495c3d7e.svg"
                  id="node-1247_17165"
                >
                  <div
                    className="absolute h-[799.148px] left-0 overflow-clip top-0 w-[808.8px]"
                    data-name="s-504x498_c5b5dc1b-2dfd-4a88-b35a-c5eb495c3d7e.svg fill"
                    id="node-1247_17166"
                  >
                    <div
                      className="absolute h-[799.171px] overflow-clip translate-x-[-50%] translate-y-[-50%] w-[808.8px]"
                      data-name="s-504x498_c5b5dc1b-2dfd-4a88-b35a-c5eb495c3d7e.svg"
                      id="node-1247_17167"
                      style={{
                        top: "calc(50% - 0.002px)",
                        left: "calc(50% + 0.001px)",
                      }}
                    >
                      <div
                        className="absolute inset-[0.19%_0.05%_0.03%_0.05%] mix-blend-screen"
                        data-name="Group"
                        id="node-1247_17168"
                      >
                        <img
                          alt=""
                          className="block max-w-none size-full"
                          loading="lazy"
                          src={imgGroup}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="absolute h-[402.82px] leading-[0] left-[126.38px] overflow-clip right-[126.37px] text-center translate-y-[-50%]"
              data-name="Container"
              id="node-1247_17170"
              style={{ top: "calc(50% + 0.002px)" }}
            >
              <div
                className="absolute h-[99.52px] text-[#ffffff] top-0 translate-x-[-50%] w-[556.05px]"
                data-name="Paragraph"
                id="node-1247_17171"
                style={{ left: "calc(50% + 0.001px)" }}
              >
                <div
                  className="absolute flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] font-bold h-[53.821px] justify-center text-[31.594px] tracking-[1.8956px] translate-x-[-50%] translate-y-[-50%] w-[286.736px]"
                  id="node-1247_17172"
                  style={{
                    top: "calc(50% - 22.62px)",
                    left: "calc(50% - 0.277px)",
                  }}
                >
                  <p className="adjustLetterSpacing block leading-[53.709px]">
                    政策案を投稿する
                  </p>
                </div>
                <div
                  className="absolute flex flex-col font-['Montserrat:Regular',_sans-serif] font-normal h-[33.173px] justify-center text-[22.116px] tracking-[-0.6635px] translate-x-[-50%] translate-y-[-50%] w-[337.367px]"
                  id="node-1247_17173"
                  style={{
                    top: "calc(50% + 33.172px)",
                    left: "calc(50% + 0.277px)",
                  }}
                >
                  <p className="adjustLetterSpacing block leading-[33.173px]">
                    Submit a Policy Concept
                  </p>
                </div>
              </div>
              <div
                className="absolute flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] font-bold h-[254.33px] justify-center leading-[44.231px] left-[275px] text-[#fcfcfc] text-[21.597px] tracking-[1.3269px] translate-x-[-50%] translate-y-[-50%] w-[550px]"
                id="node-1247_17174"
                style={{ top: "calc(50% + 67.926px)" }}
              >
                <p className="adjustLetterSpacing block mb-0">
                  仮説段階でもOK。あなたの政策案を投稿すると、
                </p>
                <p className="adjustLetterSpacing block mb-0">
                  有識者の知見やコメントが集まり、
                </p>
                <p className="adjustLetterSpacing block">
                  自然と最適な人脈が"集まって"きます。
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="absolute mix-blend-screen size-[808.8px] top-[-28.77px] translate-x-[-50%] cursor-pointer transition-transform hover:scale-105 z-10"
          data-name="Item"
          id="node-1247_17175"
          style={{ left: "calc(50% + 675.825px)" }}
          onClick={handleCheckOpinions}
        >
          <div
            className="absolute left-0 size-[808.8px] top-0"
            data-name="Container"
            id="node-1247_17176"
          >
            <div
              className="absolute bg-[#004b95] bottom-[-7.9px] mix-blend-screen right-0 rounded-[15795.3px] size-[808.8px]"
              data-name="Background"
              id="node-1247_17177"
            />
            <div
              className="absolute h-[447.271px] leading-[0] left-[90.01px] overflow-clip right-[90.57px] text-center translate-y-[-50%]"
              data-name="Container"
              id="node-1247_17178"
              style={{ top: "calc(50% + 7.608px)" }}
            >
              <div
                className="absolute h-[99.52px] text-[#ffffff] top-[38.05px] translate-x-[-50%] w-[556.05px]"
                data-name="Paragraph"
                id="node-1247_17179"
                style={{ left: "calc(50% + 0.103px)" }}
              >
                <div
                  className="absolute flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] font-bold h-[53.709px] justify-center text-[31.594px] tracking-[1.8956px] translate-x-[-50%] translate-y-[-50%] w-[331.213px]"
                  id="node-1247_17180"
                  style={{
                    top: "calc(50% - 22.905px)",
                    left: "calc(50% + 0.165px)",
                  }}
                >
                  <p className="adjustLetterSpacing block leading-[53.709px]">
                    意見を確認する
                  </p>
                </div>
                <div
                  className="absolute flex flex-col font-['Montserrat:Regular',_sans-serif] font-normal h-[33.406px] justify-center text-[22.116px] tracking-[-0.6635px] translate-x-[-50%] translate-y-[-50%] w-[270.961px]"
                  id="node-1247_17181"
                  style={{
                    top: "calc(50% + 32.904px)",
                    left: "calc(50% - 0.183px)",
                  }}
                >
                  <p className="adjustLetterSpacing block leading-[33.173px]">
                    Explore Expert Insights
                  </p>
                </div>
              </div>
              <div
                className="absolute flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] font-bold h-[298.799px] justify-center leading-[44.231px] left-[323.85px] text-[#fcfcfc] text-[22.116px] tracking-[1.3269px] translate-x-[-50%] translate-y-[-50%] w-[618.014px]"
                id="node-1247_17182"
                style={{ top: "calc(50% + 63.1px)" }}
              >
                <p className="adjustLetterSpacing block mb-0">
                  投稿された政策案に届く、
                </p>
                <p className="adjustLetterSpacing block mb-0">
                  有識者のリアルなコメント・提案を一覧で確認。
                </p>
                <p className="adjustLetterSpacing block">
                  政策案を磨きながら、次に繋がる人脈と出会えます。
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute flex h-[940.009px] items-center justify-center left-[-56.6px] mix-blend-screen top-[-11.13px] w-[940.002px] z-0">
          <div className="flex-none rotate-[298deg]">
            <div
              className="h-[695.055px] relative w-[695.069px]"
              data-name="Background"
              id="node-1247_17162"
            >
              <img
                alt=""
                className="block max-w-none size-full"
                src={imgBackground1}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className="absolute font-['Montserrat:SemiBold',_sans-serif] font-semibold inset-[6.52%_85.35%_91.01%_6.6%] leading-[0] text-[#ffffff] text-[34.286px] text-left text-nowrap tracking-[4.1143px]"
        id="node-1255_23930"
      >
        <p className="adjustLetterSpacing block leading-[1.4] whitespace-pre">
          METI Picks
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="absolute h-[68px] left-[187px] rounded-[50px] translate-y-[-50%] w-[230px] cursor-pointer transition-opacity hover:opacity-80"
        data-name="Link"
        id="node-1255_23935"
        style={{ top: "calc(50% - 728.5px)" }}
      >
        <div
          aria-hidden="true"
          className="absolute border-2 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-[50px]"
        />
        <div
          className="absolute flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] font-bold h-[21px] justify-center leading-[0] text-[#ffffff] text-[24px] text-center tracking-[4.32px] translate-x-[-50%] translate-y-[-50%] w-[181px]"
          id="node-1255_23936"
          style={{ top: "calc(50% - 0.5px)", left: "calc(50% - 0.5px)" }}
        >
          <p className="adjustLetterSpacing block leading-[21px]">ログアウト</p>
        </div>
      </button>
      <div
        className="absolute h-10 left-[2367px] top-[131px] w-[300px]"
        data-name="Component 28"
        id="node-1400_8109"
      >
        <Component27 />
      </div>
    </div>
  );
}
