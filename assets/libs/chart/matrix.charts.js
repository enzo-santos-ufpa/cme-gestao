$(function () {
    // === Prepare the chart data ===/
    var sin = [],
        cos = [];
    for (var i = 0; i < 14; i += 0.5) {
        sin.push([i, Math.sin(i)]);
        cos.push([i, Math.cos(i)]);
    }
    // === Prepare the chart data ===/
    var sin = [],
        cos = [];
    for (var i = 0; i < 14; i += 0.5) {
        sin.push([i, Math.sin(i)]);
        cos.push([i, Math.cos(i)]);
    }

    // === Make chart === //
    var plot = $.plot(
        $(".chart"),
        [
            {data: sin, label: "sin(x)", color: "#ee7951"},
            {data: cos, label: "cos(x)", color: "#4fb9f0"},
        ],
        {
            series: {
                lines: {show: true},
                points: {show: true},
            },
            grid: {hoverable: true, clickable: true},
            yaxis: {min: -1.6, max: 1.6},
        }
    );

    // === Point hover in chart === //
    var previousPoint = null;
    $(".chart").bind("plothover", function (event, pos, item) {
        if (item) {
            if (previousPoint != item.dataIndex) {
                previousPoint = item.dataIndex;

                $("#tooltip").fadeOut(200, function () {
                    $(this).remove();
                });
                var x = item.datapoint[0].toFixed(2),
                    y = item.datapoint[1].toFixed(2);

                maruti.flot_tooltip(
                    item.pageX,
                    item.pageY,
                    item.series.label + " of " + x + " = " + y
                );
            }
        } else {
            $("#tooltip").fadeOut(200, function () {
                $(this).remove();
            });
            previousPoint = null;
        }
    });

    pie("#school-quantity", {
        "EMEI": 28,
        "EMEIF": 41,
        "UEI": 28,
        "EMEF": 40,
        "OSC": 20,
        "Privadas": 26,
    });

    bar("#authorization-status", {
        labels: ["Sem pendências", "Com pendências"],
        groups: [
            {name: "Públicas", data: [92, 7]},
            {name: "OSC", data: [19, 0]},
            {name: "Privadas", data: [2, 0]},
        ]
    });

    bar("#school-status", {
        labels: ["Autorizado", "Não autorizado"],
        groups: [
            {"name": "Públicas", data: [99, 38]},
            {"name": "OSC", data: [19, 1]},
            {"name": "Privadas", data: [2, 24]},
        ]
    })

    bar("#authorization-status-per-district", {
        labels: ["Autorizado sem pendências", "Autorizado com pendências", "Não autorizado"],
        groups: [
            {"name": "DAGUA", data: [13, 7, 14]},
            {"name": "DABEL", data: [7, 0, 15]},
            {"name": "DABEN", data: [21, 0, 16]},
            {"name": "DAOUT", data: [8, 0, 2]},
            {"name": "DAICO", data: [26, 0, 6]},
            {"name": "DAMOS", data: [10, 0, 6]},
            {"name": "DASAC", data: [13, 0, 4]},
            {"name": "DAENT", data: [15, 0, 0]},
        ]
    });

    bar("#school-quantity-per-district", {
        labels: ["Municipais", "OSC", "Privadas"],
        groups: [
            {"name": "DAGUA", data: [26, 5, 3]},
            {"name": "DABEL", data: [6, 1, 15]},
            {"name": "DABEN", data: [28, 8, 1]},
            {"name": "DAOUT", data: [10, 0, 0]},
            {"name": "DAICO", data: [23, 6, 3]},
            {"name": "DAMOS", data: [15, 0, 1]},
            {"name": "DASAC", data: [14, 0, 3]},
            {"name": "DAENT", data: [15, 0, 0]},
        ]
    });
});

function pie(selector, data) {
    const width = 450, height = 450, margin = 100;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select(selector)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width * 0.6}, ${height / 2})`);

    const color = d3.scaleOrdinal().domain(data).range(d3["schemeSet1"]);
    const pie = d3.pie().value(d => d.value);
    const data_ready = pie(d3.entries(data));

    const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);
    svg.selectAll("mySlices")
        .data(data_ready)
        .enter()
        .append("path")
        .attr("d", arcGenerator)
        .attr("fill", d => color(d.data.key))
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7);

    svg.selectAll("mySlices")
        .data(data_ready)
        .enter()
        .append("text")
        .text(d => `${d.data.value}%`)
        .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
        .style("text-anchor", "middle")
        .style("font-size", 17);

    svg.selectAll("myDots")
        .data(data_ready)
        .enter()
        .append("circle")
        .attr("cx", -200)
        .attr("cy", (_, i) => -200 + i * 25)
        .attr("r", 7)
        .style("fill", d => color(d.data.key));

    svg.selectAll("myLabels")
        .data(data_ready)
        .enter()
        .append("text")
        .attr("x", -180)
        .attr("y", (d, i) => -200 + i * 25)
        .style("fill", "black")
        .text(d => d.data.key)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
}

function bar(selector, data) {
    const margin = {top: 10, right: 30, bottom: 20, left: 50},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const subgroups = data.labels;
    const groups = d3.map(data.groups, group => group.name).keys();

    const svg = d3.select(selector)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickSize(0));

    const y = d3.scaleLinear().domain([0, 40]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    const xSubgroup = d3.scaleBand().domain(subgroups).range([0, x.bandwidth()]).padding([0.05]);
    const color = d3.scaleOrdinal().domain(subgroups).range(['#e41a1c', '#377eb8', '#4daf4a']);

    svg.append("g")
        .selectAll("g")
        .data(data.groups)
        .enter()
        .append("g")
        .attr("transform", group => `translate(${x(group.name)}, 0)`)
        .selectAll("rect")
        .data(group => subgroups.map((e, i) => {
            return {key: e, value: group.data[i]};
        }))
        .enter()
        .append("rect")
        .attr("x", d => xSubgroup(d.key))
        .attr("y", d => y(d.value))
        .attr("width", xSubgroup.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", d => color(d.key));
}

maruti = {
    // === Tooltip for flot charts === //
    flot_tooltip: function (x, y, contents) {
        $('<div id="tooltip">' + contents + "</div>")
            .css({
                top: y + 5,
                left: x + 5,
            })
            .appendTo("body")
            .fadeIn(200);
    },
};
