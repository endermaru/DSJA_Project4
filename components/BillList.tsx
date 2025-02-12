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

const BillList: React.FC<BillListProps> = ({ initialKeyword = "", councilName, page = 1, limit = 10 }) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [searchTerm, setSearchTerm] = useState(initialKeyword);
  const [bills, setBills] = useState<Bill[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBills, setTotalBills] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [visiblePages, setVisiblePages] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await fetch(
          `/api/bills?keyword=${encodeURIComponent(keyword)}&councilName=${encodeURIComponent(councilName || "")}&page=${currentPage}&limit=${limit}`
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
  };

  return (
    <div className={`${pretendard.variable}`}> 
      <Card className="mb-4 w-full mx-auto">
        <h2 className="text-xl py-2 font-semibold mb-2 text-center">의안 검색 - {councilName}</h2>
        <div className="flex gap-2 px-5">
          <Input
            type="text"
            placeholder="검색어를 입력하세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch}>검색</Button>
        </div>
        <CardContent className="py-3">
          <p className="text-gray-600 py-2">총 {totalBills}개 의안, {totalPages} 페이지</p>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="overflow-auto max-h-[500px] border rounded-lg"> 
                <table className="w-full table-fixed border-collapse border border-gray-300 mx-auto">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 w-2/5 truncate">의안 제목</th>  {/* 40% 고정 */}
                      <th className="border p-2 w-1/5 truncate">의회</th>  {/* 20% 고정 */}
                      <th className="border p-2 w-1/5 truncate">의안 제안일</th>  {/* 20% 고정 */}
                      <th className="border p-2 w-1/5 truncate">의안 종류</th>  {/* 20% 고정 */}
                      <th className="border p-2 w-1/5 truncate">키워드</th>  {/* 20% 고정 */}
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
              {/* 이전 버튼 */}
              <Button 
                onClick={() => updateVisiblePages(Math.max(1, Math.floor((currentPage - 1) / 10) * 10))} 
                className="w-[40px] h-[40px] text-sm flex items-center justify-center"
                disabled={currentPage <= 10}
              >
                이전
              </Button>

              {/* 페이지 버튼 (항상 10개 유지, 없는 페이지는 비활성화) */}
              {visiblePages
                .filter(pageNum => pageNum > 0 && pageNum <= totalPages) // NaN 방지 및 유효한 페이지만 표시
                .map((pageNum) => (
                  <Button 
                    key={pageNum} 
                    onClick={() => updateVisiblePages(pageNum)} 
                    className={`w-[40px] h-[40px] text-sm flex items-center justify-center 
                                ${pageNum === currentPage ? "bg-blue-500 text-white" : "text-white bg-black"} 
                                ${pageNum > totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={pageNum > totalPages}
                  >
                    {pageNum}
                  </Button>
                ))}

              {/* 다음 버튼 */}
              <Button 
                onClick={() => updateVisiblePages(Math.min(totalPages, Math.ceil(currentPage / 10) * 10 + 1))} 
                className="w-[40px] h-[40px] text-sm flex items-center justify-center"
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

export default BillList;