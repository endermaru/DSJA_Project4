import React, { useEffect, useState } from "react";
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

const BillListNoSearch: React.FC<BillListProps> = ({ initialKeyword = "", councilName, page = 1, limit = 10 }) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [bills, setBills] = useState<Bill[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBills, setTotalBills] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [visiblePages, setVisiblePages] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);


  useEffect(() => {
    const fetchBills = async () => {
      let keyword_sub = keyword
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
  
  // totalPages가 변경될 때 visiblePages 업데이트
  useEffect(() => {
    const startPage = Math.floor((currentPage - 1) / 10) * 10 + 1;
    setVisiblePages(Array.from({ length: 10 }, (_, i) => startPage + i).filter(p => p <= totalPages));
  }, [totalPages, currentPage]); // totalPages 변경 시 업데이트

  const updateVisiblePages = (newPage: number) => {
    const startPage = Math.floor((newPage - 1) / 10) * 10 + 1;
    setVisiblePages(Array.from({ length: 10 }, (_, i) => startPage + i).filter(p => p <= totalPages));
    setCurrentPage(newPage);
  };

  return (
    <div className={`${pretendard.variable} h-full flex flex-col`}> 
      <Card className="mb-4 w-full mx-auto h-full flex flex-col bg-[#d2d0cc] drop-shadow-none border-0">
        <h2 className="text-xl py-2 font-semibold text-center">{councilName} - '{keyword}' 키워드 검색</h2>
        <CardContent className="flex flex-col flex-grow bg-[#d2d0cc] ">
          <p className="text-gray-600 py-2">총 {totalBills}개 의안, {totalPages} 페이지</p>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="flex-grow overflow-auto rounded-lg drop-shadow-none bg-[#d2d0cc] "> 
                <table className="w-full table-fixed shadow mx-auto">
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
            </div>
          )}
          {totalPages > 0 && (
            <div className="mt-1 pt-1 flex flex-wrap justify-center gap-2 w-full">
              <Button 
                onClick={() => updateVisiblePages(Math.max(1, Math.floor((currentPage - 1) / 10) * 10))} 
                className="text-sm w-10"
                disabled={currentPage <= 10}
              >
                이전
              </Button>
            
              {visiblePages.map((pageNum) => (
                <Button 
                  key={pageNum} 
                  onClick={() => updateVisiblePages(pageNum)} 
                  className={`text-sm w-10 ${pageNum === currentPage ? "bg-blue-500 text-white" : "bg-black text-white"}`}
                  disabled={pageNum > totalPages}
                >
                  {pageNum}
                </Button>
              ))}
            
              <Button 
                onClick={() => updateVisiblePages(Math.min(totalPages, Math.ceil(currentPage / 10) * 10 + 1))} 
                className="text-sm w-10"
                disabled={visiblePages[0] + 10 > totalPages}
              >
                다음
              </Button>
            </div>
          
          )}
        </CardContent>
      </Card>
    </div>
  );
  
};

export default BillListNoSearch;