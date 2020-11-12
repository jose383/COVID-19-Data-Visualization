// The svg
let svg = d3.select("#graph"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Map and projection
let path = d3.geoPath();

let projection = d3.geoNaturalEarth()
    .scale(width / 2 / Math.PI)
    .translate([width / 2, height / 2]);

let path = d3.geoPath()
    .projection(projection);

// Data and color scale
let data = d3.map();
let colorScheme = d3.schemeGreens[6];

let colorScale = d3.scaleThreshold()
    .domain([1, 1000, 10000, 100000, 750000, 2000000])
    .range(colorScheme);

// Legend
let g = svg.append("g")
    .attr("class", "legendThreshold")
    .attr("transform", "translate(20,50)");

g.append("text")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", -6)
    .text("Recovered Cases")
    .attr("transform", "translate(0,-10)");

let labels = ['0', '1 - 999', '1,000 - 9,999', '10,000 - 99,999', '100,000 - 749,999', '750,000 - 1.9M', '> 2M'];
let legend = d3.legendColor()
    .labels((d) => { return labels[d.i]; })
    .shapePadding(4)
    .scale(colorScale);
svg.select(".legendThreshold")
    .call(legend);

// Load external data and boot
d3.queue()
    .defer(d3.json, "../../Common/world.geojson")
    .defer(d3.csv, "../../../data/Common/P2G1-3.csv", (d) => { data.set(d.code, +d.Recovered); })
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
            d.Recovered = data.get(d.id) || 0;
            // Set the color
            return colorScale(d.Recovered);
        })
        .attr("d", path);
}