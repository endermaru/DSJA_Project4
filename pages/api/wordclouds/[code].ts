import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";

// 전역 모델 캐싱 (중복 모델 등록 방지)
const WordClouds = mongoose.models.WordClouds || mongoose.model("WordClouds", new mongoose.Schema({}, { strict: false }), "wordclouds");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "GET 요청만 허용됩니다." });
  }

  try {
    // MongoDB 연결
    await connectToDatabase();

    // 쿼리에서 code, page, limit, sort 가져오기
    const { code } = req.query;

    // 검색 조건 생성
    if (!code || typeof code !== "string") {
      return res.status(200).json({ wordclouds: [] }); // 쿼리가 없으면 빈 리스트 반환
    }

    const query = { "의회 코드": code };

    // 데이터 가져오기 (날짜순 정렬 추가)
    const wordclouds = await WordClouds.find(query)

    res.status(200).json({
      wordclouds,
    });
  } catch (error) {
    console.error("MongoDB 검색 오류:", error);
    res.status(500).json({ error: "데이터 검색 실패" });
  }
}
