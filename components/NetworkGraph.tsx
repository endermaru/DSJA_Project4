import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

type Node = d3.SimulationNodeDatum & {
    id: string;
    size: number;  // 크기(빈도)
    color: number; // 색상(degree)
};

type Edge = {
    source: string | Node;
    target: string | Node;
    weight: number;  // 굵기(빈도)
};

type NetworkGraphProps = {
    nodes: Node[];
    edges: Edge[];
};

const NetworkGraph: React.FC<NetworkGraphProps> = ({ nodes, edges }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!nodes || !edges) return;

        const width = 800, height = 500;
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

        const simulation = d3.forceSimulation<Node>(nodes)
            .force("link", d3.forceLink<Node, Edge>(edges).id(d => d.id).distance(50))
            .force("charge", d3.forceManyBody().strength(-80))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("x", d3.forceX().strength(0.1).x(width / 2))
            .force("y", d3.forceY().strength(0.1).y(height / 2))
            .alphaDecay(0.05);

        const minWeight = d3.min(edges, (d:Edge) => d.weight) || 1;
        const maxWeight = d3.max(edges, (d:Edge) => d.weight) || 5;
        const strokeScale = d3.scaleLinear().domain([minWeight, maxWeight]).range([1, 7]);

        const link = svg.append("g")
            .selectAll("line")
            .data(edges)
            .enter().append("line")
            .attr("stroke", "#515151")
            .attr("stroke-opacity", 0.6)
            .attr("stroke-width", (d:Edge) => strokeScale(d.weight));

        const minSize = d3.min(nodes, (d:Node) => d.size) || 10;
        const maxSize = d3.max(nodes, (d:Node) => d.size) || 20;
        const radiusScale = d3.scaleLinear().domain([minSize, maxSize]).range([10, 20]);

        const node = svg.append("g")
            .selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("r", (d:Node) => radiusScale(d.size))
            .attr("fill", (d:Node) => colorScale(degreeMap[d.id]))
            .call(drag(simulation));

        const label = svg.append("g")
            .selectAll("text")
            .data(nodes)
            .enter().append("text")
            .attr("dx", 0)
            .attr("dy", 3)
            .text((d:Node) => d.id)
            .style("fill", "black")
            .style("font-size", "11px")
            .style("font-weight", "bold")
            .style("text-anchor", "middle")
            .style("pointer-events", "none")
            .style("user-select", "none");

        simulation.on("tick", () => {
            link.attr("x1", (d:Edge) => (d.source as Node).x || 0)
                .attr("y1", (d:Edge)  => (d.source as Node).y || 0)
                .attr("x2", (d:Edge)  => (d.target as Node).x || 0)
                .attr("y2", (d:Edge)  => (d.target as Node).y || 0);

            node.attr("cx", d => d.x || 0)
                .attr("cy", d => d.y || 0);

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
                    d.fx = event.x;
                    d.fy = event.y;
                })
                .on("end", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                });
        }
    }, [nodes, edges]);

    return <svg ref={svgRef} width={800} height={500}></svg>;
};

export default NetworkGraph;
