import React, { useEffect, useState } from "react";
import { pretendard } from "@/lib/fonts";
import { Geist, Geist_Mono } from "next/font/google";
import NetworkGraph from "@/components/NetworkGraph";
import WordCloud from "@/components/WordCloud";
import * as d3 from "d3";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const code = "000ALL"

export default function Home() {
  const [graphData, setGraphData] = useState<{ nodes: any[]; edges: any[] } | null>(null);
  const [wordCloudData, setWordCloudData] = useState<{ words: { text: string; value: number }[] } | null>(null);

  useEffect(() => {
    fetch(`/api/graphs/${code}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.graphs && data.graphs.length > 0) {
          const firstGraph = data.graphs[0];
          setGraphData({ nodes: firstGraph["노드"], edges: firstGraph["엣지"] });
        }
      })
      .catch((err) => console.error("Failed to load graph data", err));
  }, []);

  useEffect(() => {
    fetch(`/api/wordclouds/${code}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.wordclouds && data.wordclouds.length > 0) {
          const firstWordCloud = data.wordclouds[0]["freq"];
          const rawValues = Object.values(firstWordCloud).map(v => Number(v)) as number[];
          
          // 🔥 최소-최대 스케일 조정
          const sizeScale = d3.scaleLinear()
            .domain([Math.min(...rawValues), Math.max(...rawValues)]) // 원본 범위
            .range([20, 100]); // 원하는 크기 범위 (10~80px)
    
          const formattedWords = Object.keys(firstWordCloud).map(key => ({
            text: key,
            value: sizeScale(firstWordCloud[key]) // 🔥 스케일 적용
          }));
    
          setWordCloudData({ words: formattedWords });
        }
      })
      .catch((err) => console.error("Failed to load word cloud data", err));
  }, []);

  return (
    <div className={pretendard.variable}>
      <h1>Graph Visualization</h1>
      {graphData ? (
        <NetworkGraph nodes={graphData.nodes} edges={graphData.edges} />
      ) : (
        <p>Loading graph data...</p>
      )}

      <h1>Word Cloud Visualization</h1>
      {wordCloudData ? (
        <WordCloud words={wordCloudData.words} />
      ) : (
        <p>Loading word cloud data...</p>
      )}
    </div>
  );
}
