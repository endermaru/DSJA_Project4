import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { pretendard } from "@/lib/fonts";

type Node = d3.SimulationNodeDatum & {
    id: string;
    size: number;
    color: number;
};

type Edge = {
    source: string | Node;
    target: string | Node;
    weight: number;
};

type NetworkGraphProps = {
    code: string;
};

const NetworkGraph: React.FC<NetworkGraphProps> = ({ code }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [graphData, setGraphData] = useState<{ nodes: Node[]; edges: Edge[] } | null>(null);

    useEffect(() => {
        if (!code) return;

        fetch(`/api/graphs/${code}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.graphs && data.graphs.length > 0) {
                    const firstGraph = data.graphs[0];
                    setGraphData({ nodes: firstGraph["노드"], edges: firstGraph["엣지"] });
                }
            })
            .catch((err) => console.error("Failed to load graph data", err));
    }, [code]);

    useEffect(() => {
        if (!graphData) return;
    
        const { nodes, edges } = graphData;
        const width = 800, height = 900;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
    
        const degreeMap: Record<string, number> = {};
        nodes.forEach(node => degreeMap[node.id] = 0);
        edges.forEach(link => {
            degreeMap[typeof link.source === 'string' ? link.source : link.source.id] += 1;
            degreeMap[typeof link.target === 'string' ? link.target : link.target.id] += 1;
        });
    
        const colorScale = d3.scaleLinear<string>()
            .domain([d3.min(Object.values(degreeMap)) || 0, d3.max(Object.values(degreeMap)) || 1])
            .range(["#d1e0ff", "#075eb5"]);
    
        const minSize = d3.min(nodes, (d: Node) => d.size) || 20;
        const maxSize = d3.max(nodes, (d: Node) => d.size) || 40;
        const radiusScale = d3.scaleLinear().domain([minSize, maxSize]).range([15, 40]);
    
        const simulation = d3.forceSimulation<Node>(nodes)
            .force("link", d3.forceLink<Node, Edge>(edges).id(d => d.id).distance(120))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("x", d3.forceX(width / 2).strength(0.1))  // X 중심 유지
            .force("y", d3.forceY(height / 2).strength(0.1)) // Y 중심 유지
            .alphaDecay(0.05);
    
        const link = svg.append("g")
            .selectAll("line")
            .data(edges)
            .enter().append("line")
            .attr("stroke", "#515151")
            .attr("stroke-opacity", 0.6)
            .attr("stroke-width", 2);
    
        const node = svg.append("g")
            .selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("r", (d: Node) => radiusScale(d.size))
            .attr("fill", (d: Node) => colorScale(degreeMap[d.id]))
            .call(drag(simulation));
    
        const label = svg.append("g")
            .selectAll("text")
            .data(nodes)
            .enter().append("text")
            .attr("dx", 0)
            .attr("dy", 5)
            .text((d: Node) => d.id)
            .style("fill", "black")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .style("text-anchor", "middle")
            .style("pointer-events", "none")
            .style("user-select", "none")
            .style("font-family", "Pretendard, sans-serif");
    
        simulation.on("tick", () => {
            link.attr("x1", (d: Edge) => (d.source as Node).x || 0)
                .attr("y1", (d: Edge) => (d.source as Node).y || 0)
                .attr("x2", (d: Edge) => (d.target as Node).x || 0)
                .attr("y2", (d: Edge) => (d.target as Node).y || 0);
    
            node.attr("cx", d => {
                d.x = Math.max(radiusScale(d.size), Math.min(width - radiusScale(d.size), d.x || 0));
                return d.x;
            }).attr("cy", d => {
                d.y = Math.max(radiusScale(d.size), Math.min(height - radiusScale(d.size), d.y || 0));
                return d.y;
            });
    
            label.attr("x", d => d.x || 0)
                .attr("y", d => d.y || 0);
        });
    
        function drag(simulation: d3.Simulation<Node, Edge>) {
            return d3.drag<SVGCircleElement, Node>()
                .on("start", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                })
                .on("drag", (event, d) => {
                    d.fx = Math.max(radiusScale(d.size), Math.min(width - radiusScale(d.size), event.x));
                    d.fy = Math.max(radiusScale(d.size), Math.min(height - radiusScale(d.size), event.y));
                })
                .on("end", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                });
        }
    }, [graphData]);
    

    return (
        <div className="w-full h-full">
          <svg
            ref={svgRef}
            className={`${pretendard.variable} bg-transparent`}
            viewBox="0 0 900 900"
            preserveAspectRatio="xMidYMid meet"
            width="100%"
            height="auto"
          ></svg>
        </div>
      );
      
};

export default NetworkGraph;
