import React, { useEffect, useState, useRef } from "react";
import { pretendard } from "@/lib/fonts";
import NetworkGraph from "@/components/NetworkGraph";
import WordCloud from '@/components/WordCloud';
import { getCouncilName } from "@/lib/getCouncilName";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KeywordFreq from "@/components/keywordsFreq";

export default function Home() {
  const [councilCode, setCouncilCode] = useState<string>('000ALL');
  const [councilName, setCouncilName] = useState<string>('전국');
  const [activeTab, setActiveTab] = useState("wordcloud");

  // 감지할 섹션 목록
  const sections = [
    { code: "000ALL", viz:"wordcloud"},
    { code: "002001", viz:"network" },
    { code: "002002", viz:"network" },
    { code: "002003", viz:"wordcloud" },
  ];

  // ref 배열 초기화
  const sectionRefs = useRef<(HTMLElement | null)[]>(new Array(sections.length).fill(null));

  // 의회 코드 변경 시 의회 이름 업데이트
  useEffect(() => {
    const name = getCouncilName(councilCode);
    if (name) {
      setCouncilName(name);
    }
  }, [councilCode]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.findIndex(ref => ref === entry.target);
            if (index !== -1) {
              setCouncilCode(sections[index].code);
              setActiveTab(sections[index].viz)
            }
          }
        }
      },
      {
        root: null,
        threshold: 0.5, // 50% 이상 화면에 보이면 트리거
      }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <div className={pretendard.variable + " flex flex-col max-w-7xl mx-auto bg-[#d2d0cc]"}>
      <div className="flex">
        {/* 왼쪽 콘텐츠 영역 */}
        <div className="w-1/2 pr-4">
          <section>
            <img ref={(el) => { if (el) sectionRefs.current[0] = el; }} 
              src="./image/logo2.png" className="w-[70%] mx-auto pt-5"/>
          </section>
          <section className="pt-[300px]">
            <h1 ref={(el) => { if (el) sectionRefs.current[1] = el; }} 
              className="text-5xl font-bold mb-2">
              Part1. 왜 지방의회인가?
            </h1>
            <h2 className="text-2xl font-bold mb-2">소제목 1</h2>
            <p className="mb-4">본문 내용이 들어갑니다...</p>
          </section>
          <section>
            <h2 ref={(el) => { if (el) sectionRefs.current[2] = el; }}
              className="text-2xl font-bold mb-2">
              소제목 2
            </h2>
            <p className="mb-4">다른 본문 내용이 들어갑니다...</p>
          </section>
          <section>
            <KeywordFreq/>
          </section>
        </div>

        {/* 오른쪽 시각화 영역 */}
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
