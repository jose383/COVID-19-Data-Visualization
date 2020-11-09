// The svg
var svg = d3.select("#recoveredSVG"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Map and projection
var path = d3.geoPath();
var projection = d3.geoNaturalEarth()
    .scale(width / 2 / Math.PI)
    .translate([width / 2, height / 2])
var path = d3.geoPath()
    .projection(projection);

// Data and color scale
var data = d3.map();
var colorScheme = d3.schemeGreens[6];
colorScheme.unshift("#eee")
var colorScale = d3.scaleThreshold()
    //.domain([1, 6, 11, 26, 101, 1001])
    .domain([1, 1000, 10000, 100000, 750000, 2000000])
    .range(colorScheme);

// Legend
var g = svg.append("g")
    .attr("class", "legendThreshold")
    .attr("transform", "translate(20,20)");
g.append("text")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", -6)
    .text("Recovered Cases");
//var labels = ['0', '1-5', '6-10', '11-25', '26-100', '101-1000', '> 1000'];
var labels = ['0', '1-999', '1K-9.9K', '10K-99.9K', '100k-749.9K', '750K-1.9M', '> 2M'];
var legend = d3.legendColor()
    .labels(function (d) { return labels[d.i]; })
    .shapePadding(4)
    .scale(colorScale);
svg.select(".legendThreshold")
    .call(legend);

// Load external data and boot
d3.queue()
    .defer(d3.json, "http://enjalot.github.io/wwsd/data/world/world-110m.geojson")
    .defer(d3.csv, "../data/triggers/world_cases.csv", function(d) { data.set(d.code, +d.Recovered); })
    .await(ready);

function ready(error, topo) {
    if (error) throw error;

    // Draw the map
    svg.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(topo.features)
        .enter().append("path")
        .attr("fill", function (d){
            // Pull data for this country
            d.Recovered = data.get(d.id) || 0;
            // Set the color
            return colorScale(d.Recovered);
        })
        .attr("d", path);
}