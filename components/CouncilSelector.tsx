'use client';

import { useState, useEffect } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";

export default function CouncilSelector({ onCouncilChange }: { onCouncilChange: (code: string) => void }) {
  const [councilsList, setCouncilsList] = useState<{ [key: string]: { code: string; council: string }[] } | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCouncil, setSelectedCouncil] = useState<string | null>("000ALL");

  const router = useRouter();

  // JSON 파일 불러오기
  useEffect(() => {
    fetch("/data/councils_list.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setCouncilsList(data))
      .catch((err) => console.error("Error loading council list:", err));
  }, []);

  // 첫 번째 선택지가 변경되었을 때, 기존 선택된 지방의회 코드 유지
  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    const firstCouncilCode = councilsList?.[region]?.[0]?.code || "000ALL";
    setSelectedCouncil(firstCouncilCode);
    onCouncilChange(firstCouncilCode);
  };

  // 의회 선택 변경 핸들러
  const handleCouncilChange = (code: string) => {
    setSelectedCouncil(code);
    onCouncilChange(code);
  };

  return (
    <div className="flex-col justify-center ">
    <Button 
      className="w-full bg-[#132133] text-xl p-6 my-3" 
      onClick={() => router.push("/")}
    >
      보도문 페이지로 이동하기
    </Button>
    <Card className="p-3 w-full bg-[#d2d0cc] border-0">
      <div className="flex flex-col gap-4">
        {/* 첫 번째 선택지: 광역시/도 선택 */}
        <Select onValueChange={handleRegionChange}>
          <SelectTrigger className="w-full border-[#132133]">
            <SelectValue placeholder="광역시/도를 선택하세요" />
          </SelectTrigger>
          <SelectContent className="w-full border-[#132133]">
            {councilsList &&
              Object.keys(councilsList).map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {/* 두 번째 선택지: 구/군 의회 선택 */}
        <Select disabled={!selectedRegion} onValueChange={handleCouncilChange} value={selectedCouncil ?? ""}>
          <SelectTrigger className="w-full border-[#132133]">
            <SelectValue placeholder={selectedRegion ? "구/군 의회를 선택하세요" : "먼저 광역시/도를 선택하세요"} />
          </SelectTrigger>
          <SelectContent className="w-full border-[#132133]">
            {selectedRegion &&
              councilsList &&
              councilsList[selectedRegion]?.map(({ code, council }) => (
                <SelectItem key={code} value={code}>
                  {council}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
    </div>
  );
}
