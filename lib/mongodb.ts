import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017/DSJA_Project5";

if (!MONGO_URI) {
  throw new Error("MONGO_URI 환경 변수가 설정되지 않았습니다.");
}

// 전역 변수 활용하여 연결 캐싱
let cached = (global as any).mongoose || { conn: null, promise: null };

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn; // 기존 연결 재사용
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI!).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  (global as any).mongoose = cached; // 전역 변수에 저장

  return cached.conn;
}

export default connectToDatabase;
