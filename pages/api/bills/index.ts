import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";

// 전역 모델 캐싱 (중복 모델 등록 방지)
const Bill = mongoose.models.Bill || mongoose.model("Bill", new mongoose.Schema({}, { strict: false }), "bills");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "GET 요청만 허용됩니다." });
  }

  try {
    // MongoDB 연결
    await connectToDatabase();

    // 쿼리에서 keyword, code, page, limit 가져오기
    const { keyword, councilName, page = "1", limit = "10", sort = "desc" } = req.query;

    // 검색 조건 생성
    const query: any = {};

    if (keyword && typeof keyword === "string") {
      query["의안 제목"] = { $regex: keyword, $options: "i" };
    }

    if (councilName && typeof councilName === "string") {
      if (councilName === "전국") {
        // 전국이면 모든 데이터를 가져옴 (query 필터 없음)
      } else if (councilName.includes("전체")) {
        // "전체"가 포함된 경우 앞부분만 따서 포함된 모든 의회를 검색
        const baseName = councilName.replace(/전체( 의회)?$/, "").trim();
        query["의회"] = { $regex: `^${baseName}`, $options: "i" }; // 시작이 baseName인 모든 의회 포함
      } else {
        // 특정 의회명과 정확히 일치하는 경우
        query["의회"] = councilName;
      }
    }

    // 페이지네이션 설정
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // 정렬 방식 설정
    const sortOrder = sort === "asc" ? 1 : -1; // "asc" → 오름차순, "desc" → 내림차순

    // 전체 문서 개수 가져오기
    const totalBills = await Bill.countDocuments(query);
    const totalPages = Math.ceil(totalBills / limitNumber);

    // 데이터 가져오기 (날짜순 정렬 추가)
    const bills = await Bill.find(query)
      .sort({ "의안 제안일": sortOrder }) // 날짜순 정렬 (오름차순 or 내림차순)
      .skip(skip)
      .limit(limitNumber);

    res.status(200).json({
      totalBills, // 전체 개수
      currentPage: pageNumber, // 현재 페이지
      totalPages, // 전체 페이지 수
      bills, // 검색 결과 (최대 10개)
    });
  } catch (error) {
    console.error("MongoDB 검색 오류:", error);
    res.status(500).json({ error: "데이터 검색 실패" });
  }
}
