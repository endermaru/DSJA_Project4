import { useState, useEffect } from 'react';
import CouncilSelector from './CouncilSelector';
import BillList from './BillList';
import WordCloud from './WordCloud';
import NetworkGraph from './NetworkGraph';
import { getCouncilName } from "@/lib/getCouncilName"; // 변환 함수 import
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BillListNoSearch from './BillListNoSearch';

export default function Visualization() {
  const [councilCode, setCouncilCode] = useState<string>('000ALL');
  const [councilName, setCouncilName] = useState<string>('전국');
  const [activeTab, setActiveTab] = useState("wordcloud");

  useEffect(() => {
    const name = getCouncilName(councilCode);
    if (name) {
      setCouncilName(name);
    }
  }, [councilCode]);

  return (
    <div className="flex h-screen p-2">
      {/* 왼쪽 패널: 지방의회 선택 + 의안 리스트 */}
      <div className="w-1/2 p-2 flex flex-col space-y-4 border-r">
        {/* 이미지와 CouncilSelector를 같은 행으로 정렬 */}
        <div className="flex items-center space-x-4">
          <div className="w-1/2">
            <img src="/image/logo.png" className="w-full h-auto" />
          </div>
          <div className="w-1/2">
            <CouncilSelector onCouncilChange={setCouncilCode} />
          </div>
        </div>
  
        {/* 의안 리스트 */}
        <div className="flex-1 overflow-auto rounded-xl">
          <BillList councilName={councilName} />
        </div>
      </div>
  
      {/* 오른쪽 패널: 시각화 탭 */}
      <div className="w-1/2 sticky top-2 p-1 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold px-2">{councilName}</h1>
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
  );
  
  
}
