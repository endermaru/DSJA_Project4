'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const keywordData = [
    { rank: 1, keyword: "사업", freq: 6500 },
    { rank: 2, keyword: "촉구", freq: 4122 },
    { rank: 3, keyword: "기본", freq: 3943 },
    { rank: 4, keyword: "육성", freq: 3835 },
    { rank: 5, keyword: "교육", freq: 3504 },
    { rank: 6, keyword: "정비", freq: 3359 },
    { rank: 7, keyword: "진흥", freq: 3341 },
    { rank: 8, keyword: "복지", freq: 3322 },
    { rank: 9, keyword: "예방", freq: 3169 },
    { rank: 10, keyword: "조성", freq: 3115 },
    { rank: 11, keyword: "보호", freq: 3099 },
    { rank: 12, keyword: "산업", freq: 3033 },
    { rank: 13, keyword: "주민", freq: 2821 },
    { rank: 14, keyword: "문화", freq: 2774 },
    { rank: 15, keyword: "안전", freq: 2733 },
    { rank: 16, keyword: "지급", freq: 2642 },
    { rank: 17, keyword: "공공", freq: 2446 },
    { rank: 18, keyword: "청소년", freq: 2411 },
    { rank: 19, keyword: "환경", freq: 2350 },
    { rank: 20, keyword: "장애인", freq: 2262 },
    { rank: 21, keyword: "교육청", freq: 2215 },
    { rank: 22, keyword: "사회", freq: 2160 },
    { rank: 23, keyword: "폐지", freq: 2120 },
    { rank: 24, keyword: "주택", freq: 2112 },
    { rank: 25, keyword: "촉진", freq: 2108 },
    { rank: 26, keyword: "기구", freq: 1971 },
    { rank: 27, keyword: "체육", freq: 1949 },
    { rank: 28, keyword: "정원", freq: 1907 },
    { rank: 29, keyword: "청취", freq: 1887 },
    { rank: 30, keyword: "아동", freq: 1819 }
];

export default function KeywordFreq() {
  const tableData = [
    keywordData.slice(0, 10),  // 첫 번째 테이블 (1~10위)
    keywordData.slice(10, 20), // 두 번째 테이블 (11~20위)
    keywordData.slice(20, 30)  // 세 번째 테이블 (21~30위)
  ];

  return (
    <div className="overflow-x-auto px-3 pb-4">
      <h1 className="text-xl font-bold mb-4">빈도수 상위 30개 키워드</h1>
      <div className="grid grid-cols-3 gap-2">
        {tableData.map((data, idx) => (
          <div key={idx} className="border rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#132133]">
                  <TableHead className="text-sm text-center text-white">순위</TableHead>
                  <TableHead className="text-sm text-center text-white">키워드</TableHead>
                  <TableHead className="text-sm text-center text-white">빈도(회)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map(({ rank, keyword, freq }) => (
                  <TableRow key={rank}>
                    <TableCell className="text-sm text-center">{rank}</TableCell>
                    <TableCell className="text-sm text-center max-w-[60px] truncate whitespace-nowrap">{keyword}</TableCell>
                    <TableCell className="text-sm text-center">{freq}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
    </div>
  );
}
