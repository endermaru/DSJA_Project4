import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

interface Word {
  text: string;
  value: number;
}

interface WordCloudProps {
  words: Word[];
}

const WordCloud: React.FC<WordCloudProps> = ({ words }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!words.length) return;

    const width = 500;
    const height = 500;

    const layout = cloud()
      .size([width, height])
      .words(words.map(d => ({ text: d.text, size: d.value * 10 })))
      .padding(5)
      .rotate(() => (Math.random() > 0.5 ? 0 : 90))
      .font("sans-serif")
      .fontSize(d => d.size)
      .on("end", draw);

    layout.start();

    function draw(words: any) {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      svg
        .attr("viewBox", `0 0 ${width} ${height}`)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`)
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", d => `${d.size}px`)
        .style("fill", () => d3.schemeCategory10[Math.floor(Math.random() * 10)])
        .attr("text-anchor", "middle")
        .attr("transform", d => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`)
        .text(d => d.text);
    }
  }, [words]);

  return <svg ref={svgRef} width={500} height={500}></svg>;
};

export default WordCloud;
