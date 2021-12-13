import React from "react";
import * as d3 from 'd3';
import {DefaultArcObject, PieArcDatum} from "d3";


type Dado2D<X, Y> = { x: X, y: Y };

type DadoPizza = Dado2D<string, number>;
type DadoBarra = Dado2D<string, number>;

type GrupoBarra = { nome: string, dados: number[] };
type DadosBarraAgrupada = { legendas: string[], grupos: GrupoBarra[] };

type Margem<R> = Record<"top" | "bottom" | "left" | "right", R>;
type MargemEscalar<T, U = T> = U extends any ? [T] extends [U] ? Margem<T> : never : never;

type Props<T> = { dados: T, altura: number, largura: number, margem: Margem<number> };
type PropsPizza = Props<DadoPizza[]> & { margem: MargemEscalar<number> };
type PropsBarra = Props<DadoBarra[]>;
type PropsBarraAgrupada = Props<DadosBarraAgrupada>;

abstract class Grafico<P extends Props<any>, T extends d3.BaseType> extends React.Component<P, {}> {
    protected readonly ref: React.RefObject<T> = React.createRef<T>();

    abstract renderiza(selection: d3.Selection<d3.BaseType, T, any, any>): void;

    componentDidMount() {
        this.renderiza(d3.select<d3.BaseType, T>(this.ref.current));
    }
}

abstract class GraficoSVG<P extends Props<any>> extends Grafico<P, SVGSVGElement> {
    render() {
        return <svg
            ref={this.ref}
            style={{
                backgroundColor: "grey",
                height: this.props.altura,
                width: "100%",
                marginRight: "0px",
                marginLeft: "0px",
            }}
        >
            <g className="plot-area"/>
            <g className="x-axis"/>
            <g className="y-axis"/>
        </svg>;
    }
}

export class GraficoBarra extends GraficoSVG<PropsBarra> {
    renderiza(svg: d3.Selection<d3.BaseType, SVGSVGElement, any, any>): any {
        const {largura, altura, margem} = this.props;
        const data: DadoBarra[] = this.props.dados;

        const x = d3
            .scaleBand()
            .domain(data.map((d) => d.x))
            .rangeRound([margem.left, largura - margem.right])
            .padding(0.1);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.y) ?? NaN])
            .rangeRound([altura - margem.bottom, margem.top]);

        svg
            .select<SVGSVGElement>(".x-axis")
            .call((g => {
                    const [min, max] = d3.extent(x.domain());
                    return g
                        .attr("transform", `translate(0, ${altura - margem.bottom})`)
                        .call(
                            d3
                                .axisBottom(x)
                                .tickValues(d3.ticks(
                                    min == null ? NaN : parseInt(min),
                                    max == null ? NaN : parseInt(max),
                                    data.length - 1,
                                )
                                    .map((v) => `${v}`))
                                .tickSizeOuter(0)
                        );
                }),
            );
        const yTicks = Math.floor((d3.max(data.map(d => d.y)) ?? NaN) - (d3.min(data.map(d => d.y)) ?? NaN)) + 1;
        svg
            .select<SVGSVGElement>(".y-axis")
            .call((g => {
                g
                    .attr("transform", `translate(${margem.left}, 0)`)
                    .style("color", "steelblue")
                    .call(d3.axisLeft(y).ticks(yTicks, "s"))
                    .call((g) => g.select(".domain").remove());
            }));

        svg
            .select(".plot-area")
            .attr("fill", "steelblue")
            .selectAll(".bar")
            .data(data)
            .join("rect")
            .attr("class", "bar")
            .attr("x", (d) => x(d.x) ?? NaN)
            .attr("width", x.bandwidth())
            .attr("y", (d) => y(d.y))
            .attr("height", (d) => y(0) - y(d.y));
    }
}

export class GraficoPizza extends GraficoSVG<PropsPizza> {
    renderiza(svg: d3.Selection<d3.BaseType, SVGSVGElement, any, any>): any {
        const {largura, altura, margem} = this.props;
        const raio = Math.min(largura, altura) / 2 - margem.top;
        const dados: DadoPizza[] = this.props.dados;

        const color = d3.scaleOrdinal<string>().domain(dados.map(d => d.x)).range(d3.schemeSet1);
        const pie = d3.pie<DadoPizza>().value((d) => d.y);
        const arcData = pie(dados);

        svg
            .append("g")
            .attr("transform", `translate(${largura / 2}, ${altura / 2})`)

        const arcGenerator = d3.arc<d3.PieArcDatum<DadoPizza>>().innerRadius(0).outerRadius(raio);
        svg.selectAll("mySlices")
            .data(arcData)
            .enter()
            .append("path")
            .attr("d", d => arcGenerator(d))
            .attr("fill", d => color(d.data.x))
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)

        svg.selectAll("mySlices")
            .data(arcData)
            .enter()
            .append("text")
            .text(d => `${d.data.y}%`)
            .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
            .style("text-anchor", "middle")
            .style("font-size", 17);

        svg.selectAll("myDots")
            .data(arcData)
            .enter()
            .append("circle")
            .attr("cx", -200)
            .attr("cy", (_, i) => -200 + i * 25)
            .attr("r", 7)
            .style("fill", d => color(d.data.x));

        svg.selectAll("myLabels")
            .data(arcData)
            .enter()
            .append("text")
            .attr("x", -180)
            .attr("y", (d, i) => -200 + i * 25)
            .style("fill", "black")
            .text(d => d.data.x)
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle");
    }
}

export class GraficoBarraAgrupada extends GraficoSVG<PropsBarraAgrupada> {
    renderiza(svg: d3.Selection<d3.BaseType, SVGSVGElement, any, any>): any {
        const {largura, altura, margem} = this.props;
        const data: DadosBarraAgrupada = this.props.dados;

        const subgrupos = data.legendas;

        const x = d3
            .scaleBand()
            .domain(data.grupos.map(grupo => grupo.nome))
            .rangeRound([margem.left, largura - margem.right])
            .padding(0.2);

        svg.append("g")
            .attr("transform", `translate(0, ${altura - margem.bottom})`)
            .call(d3.axisBottom(x).tickSize(0));

        const y = d3
            .scaleLinear()
            .domain([0, 40])
            .rangeRound([altura - margem.bottom, margem.top]);

        svg.append("g").call(d3.axisLeft(y));

        const xSubgroup = d3.scaleBand().domain(subgrupos).range([0, x.bandwidth()]).padding(0.05);
        const color = d3.scaleOrdinal<string>().domain(subgrupos).range(['#e41a1c', '#377eb8', '#4daf4a']);

        svg.append("g")
            .selectAll("g")
            .data(data.grupos)
            .enter()
            .append("g")
            .attr("transform", group => `translate(${x(group.nome)}, 0)`)
            .selectAll("rect")
            .data(grupo => subgrupos.map((e, i) => ({key: e, value: grupo.dados[i]})))
            .enter()
            .append("rect")
            .attr("x", d => xSubgroup(d.key) ?? NaN)
            .attr("y", d => y(d.value))
            .attr("width", xSubgroup.bandwidth())
            .attr("height", d => (altura - margem.bottom) - y(d.value))
            .attr("fill", d => color(d.key));

        const x0 = 250;
        const y0 = 10;

        svg.selectAll("myDots")
            .data(subgrupos)
            .enter()
            .append("circle")
            .attr("cx", x0)
            .attr("cy", (_, i) => y0 + i * 25)
            .attr("r", 7)
            .style("fill", d => color(d));

        svg.selectAll("myLabels")
            .data(subgrupos)
            .enter()
            .append("text")
            .attr("x", x0 + 20)
            .attr("y", (d, i) => y0 + i * 25)
            .style("fill", "black")
            .text(d => d)
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle");
    }
}

