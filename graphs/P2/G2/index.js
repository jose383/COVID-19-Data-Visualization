var margin = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
    },
    width = window.innerWidth - margin.left - margin.right - 250,
    height = window.innerHeight - margin.top - margin.bottom - 170;

var svg = d3.select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

let dataset = [];

d3.csv('../../../data/P2/G2.csv', function (data) {

    data.forEach((d, i) => {
        if (i == 0) {
            dataset.push(d)
        } else if (+d.Confirmed > 50000) {
            dataset.push(d)
        }
    })

    var root = d3.stratify()
        .id(function (d) {
            return d.Country;
        })
        .parentId(function (d) {
            return d.Group;
        })
    (dataset);
    root.sum(function (d) {
        return +d.ControlEfficiency;
    });

    d3.treemap()
        .size([width, height])
        .padding(4)
        (root);

    svg.selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr('x', function (d) {
            return d.x0;
        })
        .attr('y', function (d) {
            return d.y0;
        })
        .attr('width', function (d) {
            return d.x1 - d.x0;
        })
        .attr('height', function (d) {
            return d.y1 - d.y0;
        })
        .style("fill", function (d) {
            var color = d3.schemeYlGnBu[9];
            if (+d.data.ControlEfficiency > 500) {
                return "#4e73df";
            }
            else if (+d.data.ControlEfficiency > 100){
                return color[4];
            }
            else if (+d.data.ControlEfficiency > 50){
                return color[4];
            }
            else if (+d.data.ControlEfficiency > 40){
                return color[3];
            }
            else if (+d.data.ControlEfficiency > 30){
                return color[2];
            }
            else if (+d.data.ControlEfficiency > 20){
                return color[2];
            }
            else if (+d.data.ControlEfficiency > 10){
                return color[2];
            }
            else {
                return color[1];
            }
        })
        .on("mouseover", function (d) {
            d3.select(this)
                .transition()
                .duration(500)
                .style("opacity", 0.75)
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .transition()
                .duration(500)
                .style("opacity", 1)
        })
        .append("title")
        .text((d) => {
            return (d.data.Country + "\n" + (Math.round(+d.data.ControlEfficiency * 10) / 10).toFixed(1) + "\n" + d.data.Confirmed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
        });

    let text = svg.selectAll("text")
        .data(root.leaves())
        .enter();

    text.append("text")
        .attr("x", function (d) {
            return d.x0 + 5
        })
        .attr("y", function (d) {
            return d.y0 + 15
        })
        .text(function (d) {
            if (d.data.ControlEfficiency < 32) {
                return;
            }
            else {
                return d.data.Country
            }
        });

    text.append("text")
        .attr("x", function (d) {
            return d.x0 + 5
        })
        .attr("y", function (d) {
            return d.y0 + 30
        })
        .text(function (d) {
            if (d.data.ControlEfficiency < 32) {
                return;
            }
            else {
                return ((Math.round(+d.data.ControlEfficiency * 10) / 10).toFixed(1))
            }
        });

    text.append("text")
        .attr("x", function (d) {
            return d.x0 + 5
        })
        .attr("y", function (d) {
            return d.y0 + 45
        })
        .text(function (d) {
            if (d.data.ControlEfficiency < 32) {
                return;
            }
            else {
                return d.data.Confirmed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        });
})