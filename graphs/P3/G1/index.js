let w = window,
    d = document,
    e = d.documentElement,
    width = w.innerWidth - 200 || e.clientWidth - 200,
    height = w.innerHeight - 210 || e.clientHeight - 200;

let provinces;

const svg = d3.select('svg')
    .attr('width', width)
    .attr('height', height);

const g = svg.append('g');

const legendData = [1, 50, 100, 250, 500, 750, 1000, 1200]

const render = data => {
    const confirmed = new Map(data.map(d => [d.Province, d.NumberOfRecords]));
    const projection = d3.geoMercator()
        .fitSize([width, height], provinces);

    const path = d3.geoPath()
        .projection(projection);

    const colorScale = d3.scaleThreshold()
        .domain(legendData)
        .range(d3.schemeBlues[8]);

    g.selectAll('path').data(provinces.features)
        .enter().append('path')
        .attr('class', 'state')
        .attr('d', path)
        .attr('class', 'province')
        .style('fill', d => {
            if (confirmed.has(d.properties.NAME_1))
                return colorScale(confirmed.get(d.properties.NAME_1));
            else
                return 'white';
        })
        .attr('stroke', '#C0C0C0')
        .append('title')
        .text(d => {
                if (d.properties.NAME_1 === "Hubei") {
                    return d.properties.NAME_1 + ": 0"
                } else {
                    return d.properties.NAME_1 + ": " + confirmed.get(d.properties.NAME_1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
        });

let gl = svg.append("g")
    .attr("class", "legend");

gl.append("text")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", 0)
    .text("Confirmed Cases")
    .attr("transform", "translate(0, -15)");

let labels = ['1 - 49', '50 - 99', '100 - 249', '250 - 499', '500 - 749', '750 - 999', '1,000 - 1,199', '> 1,200'];
let legend = d3.legendColor()
    .labels((d) => {
        return labels[d.i];
    })
    .shapePadding(3)
    .scale(colorScale);

svg.select(".legend")
    .call(legend);

svg.call(d3.zoom().scaleExtent([1, 8]).on('zoom', ({
    transform
}) => {
    g.attr('transform', transform);
}))
};

d3.json('../../../data/P3/G1_2.json').then(data => {
    provinces = topojson.feature(data, data.objects.CHN_adm1);
});

d3.csv('../../../data/P3/G1.csv').then(data => {
    data.forEach(d => {
        d.NumberOfRecords = +d.NumberOfRecords;
    });
    render(data);
})