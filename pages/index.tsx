import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import NetworkGraph from "@/components/NetworkGraph";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [graphData, setGraphData] = useState<{ nodes: any[]; edges: any[] } | null>(null);

  useEffect(() => {
    fetch("/api/graphs/002001")
      .then((res) => res.json())
      .then((data) => {
        if (data.graphs && data.graphs.length > 0) {
          const firstGraph = data.graphs[0];
          setGraphData({ nodes: firstGraph["노드"], edges: firstGraph["엣지"] });
        }
      })
      .catch((err) => console.error("Failed to load graph data", err));
  }, []);

  return (
    <div>
      <h1>Graph Visualization</h1>
      {graphData ? (
        <NetworkGraph nodes={graphData.nodes} edges={graphData.edges} />
      ) : (
        <p>Loading graph data...</p>
      )}
    </div>
  );
}