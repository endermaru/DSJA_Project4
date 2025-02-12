import { useState, useEffect } from 'react';
import CouncilSelector from './CouncilSelector';
import BillList from './BillList';
import WordCloud from './WordCloud';
import NetworkGraph from './NetworkGraph';
import { getCouncilName } from "@/lib/getCouncilName"; // 변환 함수 import

export default function Visualization() {
  const [councilCode, setCouncilCode] = useState<string>('000ALL');
  const [councilName, setCouncilName] = useState<string>('전국');

  useEffect(() => {
    const name = getCouncilName(councilCode);
    if (name) {
      setCouncilName(name);
    }
  }, [councilCode]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 p-4 h-screen">
      {/* 왼쪽 영역 */}
      <div className="flex flex-col gap-6 overflow-auto">
        <h2 className="text-xl font-bold">지방의회 데이터 시각화</h2>
        <CouncilSelector onCouncilChange={setCouncilCode} />
        <BillList councilName={councilName} />
      </div>

      {/* 오른쪽 영역 (시각화) */}
      <div className="grid grid-cols-[1fr_2fr] gap-1 h-full relative">
        {/* 워드 클라우드 */}
        <div className="relative flex justify-center items-center">
          <div className="absolute left-1/2 transform -translate-x-1/4">
            <WordCloud code={councilCode} />
          </div>
        </div>

        {/* 네트워크 그래프 */}
        <div className="flex justify-center items-center">
          <NetworkGraph code={councilCode} />
        </div>
      </div>
    </div>


  );
  
}
