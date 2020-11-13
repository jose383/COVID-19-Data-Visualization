const width = 1000,
    height = 500;

// Confirmed Cases
let ccsvg = d3.select("#ccgraph")
    .attr("id", "CCSVG")
    .attr("style", "display:block;")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

let ccprojection = d3.geoPatterson()
    .scale(width / 2.4 / Math.PI)
    .translate([width / 2, height]);

let ccpath = d3.geoPath()
    .projection(ccprojection);

let ccdata = d3.map();
let cccolorScheme = d3.schemeReds[8];

let cccolorScale = d3.scaleThreshold()
    .domain([1, 10000, 100000, 1000000, 2000000, 3000000, 4000000, 5000000])
    .range(cccolorScheme);

let ccg = ccsvg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(20, 110)");

ccg.append("text")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", 0)
    .text("Confirmed Cases")
    .attr("transform", "translate(0, -5)");

let cclabels = ['1 - 9,999', '10,000 - 99,999', '100,000 - 499,999', '500,000 - 999,999', '1M - 1.9M', '2M - 3.9M', '4M - 4.9M', '> 5M'];
let cclegend = d3.legendColor()
    .labels((d) => {
        return cclabels[d.i];
    })
    .shapePadding(0)
    .scale(cccolorScale);

ccsvg.select(".legend")
    .call(cclegend);

d3.queue()
    .defer(d3.json, "../../Common/world.geojson")
    .defer(d3.csv, "../../../data/Common/P2G1-3.csv", (d) => {
        ccdata.set(d.code, +d.Confirmed);
    })
    .await(ccready);

function ccready(error, topo) {
    if (error) throw error;
    ccsvg.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        .attr("fill", (d) => {
            d.Confirmed = ccdata.get(d.id) || 0;
            return cccolorScale(d.Confirmed);
        })
        .attr("d", ccpath)
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

// Deaths 
let dsvg = d3.select("#dgraph")
    .attr("id", "DSVG")
    .attr("style", "display:none;")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

let dprojection = d3.geoPatterson()
    .scale(width / 2.4 / Math.PI)
    .translate([width / 2, height]);

let dpath = d3.geoPath()
    .projection(dprojection);

let ddata = d3.map();
let dcolorScheme = d3.schemeReds[8];

let dcolorScale = d3.scaleThreshold()
    .domain([1, 1000, 10000, 50000, 75000, 100000, 125000, 150000])
    .range(dcolorScheme);

let dg = dsvg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(20, 110)");

dg.append("text")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", 0)
    .text("Deaths")
    .attr("transform", "translate(0, -5)");

let dlabels = ['1 - 999', '1,000 - 9,999', '10,000 - 49,999', '50,000 - 74,999', '75,000 - 99,999', '100,000 - 124,999', '125,000 - 149,999', '> 150,000'];
let dlegend = d3.legendColor()
    .labels((d) => {
        return dlabels[d.i];
    })
    .labelOffset(25)
    .shapePadding(15.47)
    .scale(dcolorScale);

dsvg.select(".legend")
    .call(dlegend);

d3.queue()
    .defer(d3.json, "../../Common/world.geojson")
    .defer(d3.csv, "../../../data/Common/P2G1-3.csv", (d) => {
        ddata.set(d.code, +d.Deaths);
    })
    .await(dready);

function dready(error, topo) {
    if (error) throw error;
    dsvg.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        .attr("fill", (d) => {
            d.Deaths = ddata.get(d.id) || 0;
            return dcolorScale(d.Deaths);
        })
        .attr("d", dpath)
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
            return (d.properties.name + ": " + d.Deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
        })
}

// Recovered
let rsvg = d3.select("#rgraph")
    .attr("id", "RSVG")
    .attr("style", "display:none;")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

let rprojection = d3.geoPatterson()
    .scale(width / 2.4 / Math.PI)
    .translate([width / 2, height]);

let rpath = d3.geoPath()
    .projection(rprojection);

let rdata = d3.map();
let rcolorScheme = d3.schemeGreens[8];

let rcolorScale = d3.scaleThreshold()
    .domain([1, 10000, 100000, 500000, 1000000, 1500000, 2000000, 2500000])
    .range(rcolorScheme);

let rg = rsvg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(20, 110)");

rg.append("text")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", 0)
    .text("Recovered")
    .attr("transform", "translate(0, -5)");

let rlabels = ['1 - 9,999', '10,000 - 99,999', '100,000 - 499,999', '500,000 - 999,999', '1M - 1.49M', '1.5M - 1.99M', '2M - 2.49M', '> 2.5M'];
let rlegend = d3.legendColor()
    .labels((d) => {
        return rlabels[d.i];
    })
    .labelOffset(25)
    .shapePadding(15.47)
    .scale(rcolorScale);

rsvg.select(".legend")
    .call(rlegend);

d3.queue()
    .defer(d3.json, "../../Common/world.geojson")
    .defer(d3.csv, "../../../data/Common/P2G1-3.csv", (d) => {
        rdata.set(d.code, +d.Recovered);
    })
    .await(rready);

function rready(error, topo) {
    if (error) throw error;
    rsvg.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        .attr("fill", (d) => {
            d.Recovered = rdata.get(d.id) || 0;
            return rcolorScale(d.Recovered);
        })
        .attr("d", rpath)
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
            return (d.properties.name + ": " + d.Recovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
        })
}

var list = document.getElementsByClassName("label");
for (var i = 8; i < list.length; i++) {
    list[i].style.transform = "translate(25px,12.5px)"
}

let change = (selection) => {
    if (selection === 'CC') {
        document.getElementById("CCSVG").style.display = "block";
        document.getElementById("DSVG").style.display = "none";
        document.getElementById("RSVG").style.display = "none";
    }
    if (selection === 'D') {
        document.getElementById("CCSVG").style.display = "none";
        document.getElementById("DSVG").style.display = "block";
        document.getElementById("RSVG").style.display = "none";
    }
    if (selection === 'RC') {
        document.getElementById("CCSVG").style.display = "none";
        document.getElementById("DSVG").style.display = "none";
        document.getElementById("RSVG").style.display = "block";
    }
}