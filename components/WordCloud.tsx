import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";
import { pretendard } from "@/lib/fonts";

interface Word {
  text: string;
  value: number;
}

interface WordCloudProps {
  words: Word[];
}

interface WordCloudDatum {
  text: string;
  size: number;
  freq: number;
  x?: number;
  y?: number;
  rotate?: number;
}

const WordCloud: React.FC<WordCloudProps> = ({ words }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!words.length) return;

    const width = 1000;
    const height = 800;

    const layout = cloud<WordCloudDatum>()
      .size([width, height]).spiral('archimedean')
      .words(words.slice(0, 100).map(d => ({ text: d.text, size: d.value, freq: d.value })))
      .padding(5)
      .rotate(() => (Math.random() > 0.4 ? 0 : 90))
      .font("Pretendard")
      .fontSize(d => d.size)
      .on("end", draw);

    layout.start();

    function draw(words: WordCloudDatum[]) {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const group = svg
        .attr("viewBox", `0 0 ${width} ${height}`)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

      group.selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", (d: WordCloudDatum) => `${d.size}px`)
        .style("fill", () => d3.schemeCategory10[Math.floor(Math.random() * 10)])
        .style("font-family", "Pretendard, sans-serif").style("font-weight", "800")
        .attr("text-anchor", "middle")
        .attr("transform", (d: WordCloudDatum) => `translate(${d.x ?? 0}, ${d.y ?? 0}) rotate(${d.rotate ?? 0})`)
        .text((d: WordCloudDatum) => d.text)
        .on("mouseover", function (event, d) {
          d3.select(this)
            .append("title")
            .text(`${d.text}: ${d.freq}`);
        })
        .on("mouseout", function () {
          d3.select(this).select("title").remove();
        });
    }
  }, [words]);

  return <svg ref={svgRef} width={1000} height={800} className={pretendard.variable}></svg>;
};

export default WordCloud;
