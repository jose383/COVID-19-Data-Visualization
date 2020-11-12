// The svg
const margin = {
        top: 50,
        right: 20,
        bottom: 100,
        left: 100
    },
    width = 1300,
    height = 1000;

let svg = d3.select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let change;

// Map and projection
let projection = d3.geoPatterson()
    .scale(width / 2.4 / Math.PI)
    .translate([width / 2, height / 2]);

let path = d3.geoPath()
    .projection(projection);

// Data and color scale
let data = d3.map();
let colorScheme = d3.schemeGreens[8];

let colorScale = d3.scaleThreshold()
    .domain([1, 10000, 100000, 1000000, 2000000, 3000000, 4000000, 5000000])
    .range(colorScheme);

// Legend
let g = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(20,50)");

g.append("text")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", 0)
    .text("Confirmed Cases")
    .attr("transform", "translate(0,-10)");

let labels = ['0', '1 - 9,999', '10,000 - 99,999', '100,000 - 999,999', '1M - 1.9M', '2M - 3.9M', '4M - 4.9M', '> 5M'];
let legend = d3.legendColor()
    .labels((d) => {
        return labels[d.i];
    })
    .shapePadding(0)
    .scale(colorScale);

svg.select(".legend")
    .call(legend);

// Load external data and boot
d3.queue()
    .defer(d3.json, "../../Common/world.geojson")
    .defer(d3.csv, "../../../data/Common/P2G1-3.csv", (d) => {
        data.set(d.code, +d.Confirmed);
    })
    .await(ready);

function ready(error, topo) {
    if (error) throw error;
    // Draw the map
    svg.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        .attr("fill", (d) => {
            d.Confirmed = data.get(d.id) || 0;
            return colorScale(d.Confirmed);
        })
        .attr("d", path)
        .on("mouseover", function (d) {
            d3.select(this)
                .transition()
                .duration(0)
                .style("opacity", 0.4)
                .style("stroke-width", 0);
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .transition()
                .duration(0)
                .style("opacity", 1)
                .style("stroke-width", 0.25);
        })
        .append("title")
        .text((d) => {
            return (d.properties.name + ": " + d.Confirmed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
        })
}