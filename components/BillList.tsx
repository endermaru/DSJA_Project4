import React, { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { pretendard } from "@/lib/fonts";

interface Bill {
  _id: string;
  "의안 제목": string;
  의회: string;
  "의안 제안일": string;
  "의안 종류": string;
  키워드: string[];
}

interface BillListProps {
  initialKeyword?: string;
  councilName?: string;
  page?: number;
  limit?: number;
}

const BillList: React.FC<BillListProps> = ({ initialKeyword = "", councilName, page = 1, limit = 10 }) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [searchTerm, setSearchTerm] = useState(initialKeyword);
  const [bills, setBills] = useState<Bill[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBills, setTotalBills] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [visiblePages, setVisiblePages] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [prevCouncilName, setPrevCouncilName] = useState("")

  const listRef = useRef<HTMLDivElement>(null); // 리스트 컨테이너 참조

  useEffect(() => {
    const fetchBills = async () => {
      let keyword_sub = keyword
      if (councilName != prevCouncilName) {
        keyword_sub = ""
        setPrevCouncilName(councilName || "")
        setSearchTerm("")
      }
      try {
        const res = await fetch(
          `/api/bills?keyword=${encodeURIComponent(keyword_sub)}&councilName=${encodeURIComponent(councilName || "")}&page=${currentPage}&limit=${limit}`
        );
        const data = await res.json();

        if (res.ok) {
          setBills(data.bills);
          setTotalPages(data.totalPages);
          setTotalBills(data.totalBills);
        } else {
          setError(data.error || "의안 데이터를 불러오는 중 오류 발생");
        }
      } catch (err) {
        setError("의안 데이터를 가져오는 중 문제가 발생했습니다.");
      }
    };

    fetchBills();
  }, [keyword, councilName, currentPage, limit]);
  

  const handleSearch = () => {
    setKeyword(searchTerm);
    setCurrentPage(1); // 여기서만 초기화
  };
  
  // totalPages가 변경될 때 visiblePages 업데이트
  useEffect(() => {
    const startPage = Math.floor((currentPage - 1) / 10) * 10 + 1;
    setVisiblePages(Array.from({ length: 10 }, (_, i) => startPage + i).filter(p => p <= totalPages));
  }, [totalPages, currentPage]); // totalPages 변경 시 업데이트

  const updateVisiblePages = (newPage: number) => {
    const startPage = Math.floor((newPage - 1) / 10) * 10 + 1;
    setVisiblePages(Array.from({ length: 10 }, (_, i) => startPage + i).filter(p => p <= totalPages));
    setCurrentPage(newPage);
    listRef.current?.scrollIntoView({ block: "start" });

  };

  return (
    <div className={`${pretendard.variable} h-full flex flex-col `}> 
      <Card ref={listRef} className="mb-4 w-full mx-auto h-full flex flex-col bg-[#d2d0cc] border-0">
        <h2 className="text-xl py-2 font-semibold mb-2 text-center">의안 검색 - {councilName}</h2>
        <div className="flex gap-2 px-5">
          <Input
            type="text"
            placeholder="검색어를 입력하세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 border-[#132133]"
          />
          <Button className="bg-[#132133] font-bold" onClick={handleSearch}>검색</Button>
        </div>
        <CardContent className="py-3 flex flex-col flex-grow bg-[#d2d0cc]">
          <p className="text-gray-600 py-2">총 {totalBills}개 의안, {totalPages} 페이지</p>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="flex-grow overflow-auto "> 
                <table className="w-full table-fixed border-collapse border border-gray-300 mx-auto">
                  <thead>
                    <tr className="bg-[#132133]">
                      <th className="border p-2 w-2/5 truncate text-white">의안 제목</th>
                      <th className="border p-2 w-1/5 truncate text-white">의회</th>
                      <th className="border p-2 w-1/5 truncate text-white">의안 제안일</th>
                      <th className="border p-2 w-1/5 truncate text-white">의안 종류</th>
                      <th className="border p-2 w-1/5 truncate text-white">키워드</th>
                    </tr>
                  </thead>
                <tbody>
                  {bills.map((bill) => (
                    <tr key={bill._id} className="hover:bg-gray-50">
                      <td className="border p-2">{bill["의안 제목"]}</td>
                      <td className="border p-2">{bill.의회}</td>
                      <td className="border p-2">{bill["의안 제안일"]}</td>
                      <td className="border p-2">{bill["의안 종류"]}</td>
                      <td className="border p-2">{bill.키워드.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPages > 0 && (
                <div className="mt-1 pt-1 flex flex-wrap justify-center gap-2 w-full">
                  <Button 
                    onClick={() => updateVisiblePages(Math.max(1, Math.floor((currentPage - 1) / 10) * 10))} 
                    className="text-sm w-10 bg-[#132133]"
                    disabled={currentPage <= 10}
                  >
                    이전
                  </Button>
                
                  {visiblePages.map((pageNum) => (
                    <Button 
                      key={pageNum} 
                      onClick={() => updateVisiblePages(pageNum)} 
                      className={`text-sm w-10 bg-[#132133] ${pageNum === currentPage ? "bg-blue-500 text-white" : "bg-black text-white"}`}
                      disabled={pageNum > totalPages}
                    >
                      {pageNum}
                    </Button>
                  ))}
                
                  <Button 
                    onClick={() => updateVisiblePages(Math.min(totalPages, Math.ceil(currentPage / 10) * 10 + 1))} 
                    className="text-sm w-10 bg-[#132133]"
                    disabled={visiblePages[0] + 10 > totalPages}
                  >
                    다음
                  </Button>
                </div>
              
              )}
            </div>
          )}
          
        </CardContent>
      </Card>
    </div>
  );
  
};

export default BillList;