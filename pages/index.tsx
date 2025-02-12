import React, { useEffect, useState } from "react";
import { pretendard } from "@/lib/fonts";
import NetworkGraph from "@/components/NetworkGraph";
import WordCloud from "@/components/WordCloud";
import BillList from "@/components/BillList";
import Visualization from "@/components/Visualization";

const code = "002018"

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

  return (
    
    <div className={pretendard.variable}>
      <div>
        <Visualization/>
      </div>
    </div>
    
  );
}
