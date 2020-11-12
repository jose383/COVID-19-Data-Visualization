// The svg
var svg = d3.select("#graph"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Map and projection
var path = d3.geoPath();
var projection = d3.geoNaturalEarth()
    .scale(width / 2 / Math.PI)
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(projection);

// Data and color scale
var data = d3.map();
var colorScheme = d3.schemeBlues[6];

var colorScale = d3.scaleThreshold()
    .domain([1, 10000, 100000, 1000000, 3000000, 5000000])
    .range(colorScheme);

// Legend
var g = svg.append("g")
    .attr("class", "legendThreshold")
    .attr("transform", "translate(20,50)");

g.append("text")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", -6)
    .text("Confirmed Cases")
    .attr("transform", "translate(0,-10)");

var labels = ['0', '1 - 9,999', '10,000 - 99,999', '100,000 - 999,999', '1M - 2.9M', '3M - 4.9M', '> 5M'];
var legend = d3.legendColor()
    .labels(function (d) {
        return labels[d.i];
    })
    .shapePadding(4)
    .scale(colorScale);
    
svg.select(".legendThreshold")
    .call(legend);

// Load external data and boot
d3.queue()
    .defer(d3.json, "../../Common/world.geojson")
    .defer(d3.csv, "../../../data/Common/P2G1-3.csv", function (d) {
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
        .enter().append("path")
        .attr("fill", function (d) {
            // Pull data for this country
            d.Confirmed = data.get(d.id) || 0;
            // Set the color
            return colorScale(d.Confirmed);
        })
        .attr("d", path);
}