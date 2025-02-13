import React, { useEffect, useState } from "react";
import { pretendard } from "@/lib/fonts";
import NetworkGraph from "@/components/NetworkGraph";
import WordCloud from '@/components/WordCloud';
import Visualization from "@/components/Visualization";
import { getCouncilName } from "@/lib/getCouncilName"; // 변환 함수 import
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Home() {
  const [councilCode, setCouncilCode] = useState<string>('000ALL');
  const [councilName, setCouncilName] = useState<string>('전국');
  const [activeTab, setActiveTab] = useState("wordcloud"); // 탭 상태 관리

  useEffect(() => {
    const name = getCouncilName(councilCode);
    if (name) {
      setCouncilName(name);
    }
  }, [councilCode]);
  

  return (
    <div className={pretendard.variable + " flex flex-col max-w-7xl mx-auto bg-[#d2d0cc]"}>
      <div className="flex">
        {/* 왼쪽 보도문 영역 */}
        <div className="w-1/2 pr-4 border border-black border-3">
          <img src="./image/logo2.png" className="w-[70%] mx-auto pt-5"/>
          <section>
            <h2 className="text-2xl font-bold mb-2">소제목 1</h2>
            <p className="mb-4">본문 내용이 들어갑니다...</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-2">소제목 2</h2>
            <p className="mb-4">다른 본문 내용이 들어갑니다...</p>
            <p className="mb-4">다른 본문 내용이 들어갑니다...</p>
            <p className="mb-4">다른 본문 내용이 들어갑니다...</p>
            <p className="mb-4">다른 본문 내용이 들어갑니다...</p>
            <p className="mb-4">다른 본문 내용이 들어갑니다...</p>
            <p className="mb-4">다른 본문 내용이 들어갑니다...</p>
            <p className="mb-4">다른 본문 내용이 들어갑니다...</p>
            <p className="mb-4">다른 본문 내용이 들어갑니다...</p>
            <p className="mb-4">다른 본문 내용이 들어갑니다...</p>
            <p className="mb-4">다른 본문 내용이 들어갑니다...</p>
            <p className="mb-4">다른 본문 내용이 들어갑니다...</p>
            <p className="mb-4">다른 본문 내용이 들어갑니다...</p>
            <p className="mb-4">다른 본문 내용이 들어갑니다...</p>
            <p className="mb-4">다른 본문 내용이 들어갑니다...</p>
          </section>
        </div>

        {/* 오른쪽 시각화 영역 (탭 적용) */}
        <div className="w-1/2 sticky top-2 p-1 h-[calc(100vh-2rem)] flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold px-2">{councilName}</h1>
              <TabsList className="flex w-1/2 justify-center">
                <TabsTrigger className="w-full" value="wordcloud">워드클라우드</TabsTrigger>
                <TabsTrigger className="w-full" value="network">네트워크 분석</TabsTrigger>
              </TabsList>
            </div>

            <div className="relative">
              <div className={activeTab === "wordcloud" ? "block" : "hidden"}>
                <WordCloud code={councilCode} />
              </div>
              <div className={activeTab === "network" ? "block" : "hidden"}>
                <NetworkGraph code={councilCode} />
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}