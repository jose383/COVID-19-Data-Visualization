// The svg
let svg = d3.select("#graph"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Map and projection
let projection = d3.geoPatterson()
    .scale(width / 2.4 / Math.PI)
    .translate([width / 2, height / 2]);

let path = d3.geoPath()
    .projection(projection);

// Data and color scale
let data = d3.map();
let colorScheme = d3.schemeReds[8];

let colorScale = d3.scaleThreshold()
    .domain([1, 10000, 100000, 1000000, 2000000, 3000000, 4000000, 5000000])
    .range(colorScheme);

// Legend
let g = svg.append("g")
    .attr("class", "legendThreshold")
    .attr("transform", "translate(20,50)");

g.append("text")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", -6)
    .text("Death Cases")
    .attr("transform", "translate(0,-10)");

let labels = ['0', '1 - 9,999', '10,000 - 99,999', '100,000 - 999,999', '1M - 1.9M', '2M - 3.9M', '4M - 4.9M', '> 5M'];
let legend = d3.legendColor()
    .labels((d) => {
        return labels[d.i];
    })
    .shapePadding(4)
    .scale(colorScale);

svg.select(".legendThreshold")
    .call(legend);

// Load external data and boot
d3.queue()
    .defer(d3.json, "../../Common/world.geojson")
    .defer(d3.csv, "../../../data/Common/P2G1-3.csv", (d) => {
        data.set(d.code, +d.Deaths);
    })
    .await(ready);

function ready(error, topo) {
    if (error) throw error;
    // Draw the map
    svg.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(topo.features)
        .enter().append("path")
        .attr("fill", (d) => {
            // Pull data for this country
            d.Deaths = data.get(d.id) || 0;
            // Set the color
            return colorScale(d.Deaths);
        })
        .attr("d", path);
}