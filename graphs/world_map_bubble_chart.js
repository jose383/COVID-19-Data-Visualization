d3 = d3;

//Initialize svg or grab svg
var svg = d3.select("svg");
var width = svg.attr("width");
var height = svg.attr("height");

var data = {
    nodes: [
        {name: "A", radius: 10},
        {name: "B", radius: 15},
        {name: "C", radius: 50},
        {name: "D", radius: 35}
    ],
    links: [
        {source: "A", target: "B"},
        {source: "B", target: "C"},
        {source: "D", target: "C"}
    ]
};

var simulation = d3
    .forceSimulation(data.code)
    .force("charge", d3.forceManyBody().strength(300))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide(function(d) {
        return data.control_efficiency;
    }))
    .on("tick", ticked);

var links = svg
    .append("g")
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
    .attr("stroke-width", 3)
    .style("stroke", "orange");

var drag = d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);

var textAndNodes = svg
    .append("g")
    .selectAll("g")
    .data(data.nodes)
    .enter()
    .append("g")
    .call(drag);

var circles = textAndNodes
    .append("circle")
    .attr("r", function(d) {
        return d.radius;
    })
    .attr("fill", "blue");

var texts = textAndNodes.append("text").text(function(d) {
    return d.name;
});

function ticked() {
    textAndNodes
        .attr("transform", function(d) {
            return "translate(" + d.x + ", " + d.y + ")";
        });
}

function dragstarted(d){
    simulation.alphaTarget(0.3).restart();
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragged(d){
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d){
    simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

