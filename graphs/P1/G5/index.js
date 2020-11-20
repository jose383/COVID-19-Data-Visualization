// set the dimensions and margins of the graph
const margin = {
        top: 50,
        right: 20,
        bottom: 100,
        left: 100
    },
    w = window,
    d = document,
    e = d.documentElement,
    width = w.innerWidth / 1.3 || e.clientWidth / 1.3,
    height = w.innerHeight / 1.85 || e.clientHeight / 1.85;

// Append the svg object to the a div
let svg = d3.select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let change;
let mousemove;

// Parse the Data
d3.csv("../../../data/P1/G5.csv", (data) => {

    // Get States
    let states = d3.map(data, (d) => {
        return (d.State)
    }).keys();

    // Create Options
    d3.select("#CA")
        .attr("transform", "translate(" + height / 2 + "," + width / 2 + ")");

    // Add X axis
    let x = d3.scaleLinear()
        .domain(d3.extent(data, (d) => {
            return new Date(d.Date);
        }))
        .range([0, width]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(-height))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("font-size", "0px");

    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 10) + ")")
        .style("text-anchor", "middle")
        .attr("font-size", "17px")
        .text("Date");

    let widths = [30, 6.15, 3.3, 2.3, 1.76, 1.42, 1.185, 1.03];
    let months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];

    months.forEach((d, i) => {
        svg.append("text")
            .attr("transform", "translate(" + (width / widths[i]) + " ," + (height + 25) + ") rotate(0)")
            .style("text-anchor", "middle")
            .attr("font-size", "17px")
            .text(d + " 1");
    })

    // Add Y axis
    let y = d3.scaleLinear()
        .domain([0, 20000])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y).tickSizeInner(-width).tickSizeOuter(0))
        .selectAll("text")
        .style("text-anchor", "end");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 90)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("font-size", "17px")
        .text("Confirmed Cases");

    // CA linechart
    let line = svg.append("g")
        .append("path")
        .datum(data.filter((d) => {
            return d.State === states[0];
        }))
        .attr("d", d3.line()
            .x((d) => {
                return x(new Date(d.Date));
            })
            .y((d) => {
                return y(+d.ConfirmedCases);
            })
        )
        .attr("stroke", () => {
            return 'rgb(78, 115, 223)';
        })
        .style("stroke-width", 2.5)
        .style("fill", "none");

    // Create dots per entry
    svg.selectAll(".dot")
        .data(data.filter((d) => {
            return d.State === states[0];
        }))
        .enter().append("circle")
        .attr("class", "dotCA")
        .attr("style", "display:block;")
        .attr("cx", function (d, i) {
            return x(new Date(d.Date))
        })
        .attr("cy", function (d) {
            return y(+d.ConfirmedCases)
        })
        .attr("r", 9)
        .attr("opacity", 0)
        .append("title")
        .text((d) => {
            return (d.State + " " + d.Date + ": " + d.ConfirmedCases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
        })

    // Function to update the linechart
    change = (stateSelection) => {
        // Create new data from selection
        let dataFilter = data.filter((d) => {
            return d.State === stateSelection
        });

        // Overrite existing line
        line.datum(dataFilter)
            .transition()
            .duration(300)
            .attr("d", d3.line()
                .x((d) => {
                    return x(new Date(d.Date));
                })
                .y((d) => {
                    return y(+d.ConfirmedCases);
                })
            )
            .attr("stroke", () => {
                return 'rgb(78, 115, 223)'
            })

        // Create dots per entry
        svg.selectAll(".dot")
            .data(data.filter((d) => {
                return d.State === stateSelection;
            }))
            .enter().append("circle")
            .attr("class", "dot" + stateSelection)
            .attr("cx", function (d, i) {
                return x(new Date(d.Date))
            })
            .attr("cy", function (d) {
                return y(+d.ConfirmedCases)
            })
            .attr("r", 9)
            .attr("opacity", 0)
            .append("title")
            .text((d) => {
                return (d.State + " " + d.Date + ": " + d.ConfirmedCases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
            })

        // get dots by class
        var ca = document.getElementsByClassName("dotCA");
        var tx = document.getElementsByClassName("dotTX");
        var fl = document.getElementsByClassName("dotFL");
        var ny = document.getElementsByClassName("dotNY");

        // Display only selected state
        if (stateSelection === 'CA') {
            for (var i = 0; i < ca.length; i++) {
                ca[i].style.display = "block";
            }
            for (var i = 0; i < tx.length; i++) {
                tx[i].style.display = "none";
            }
            for (var i = 0; i < fl.length; i++) {
                fl[i].style.display = "none";
            }
            for (var i = 0; i < ny.length; i++) {
                ny[i].style.display = "none";
            }
        }
        if (stateSelection === 'TX') {
            for (var i = 0; i < ca.length; i++) {
                ca[i].style.display = "none";
            }
            for (var i = 0; i < tx.length; i++) {
                tx[i].style.display = "block";
            }
            for (var i = 0; i < fl.length; i++) {
                fl[i].style.display = "none";
            }
            for (var i = 0; i < ny.length; i++) {
                ny[i].style.display = "none";
            }
        }
        if (stateSelection === 'FL') {
            for (var i = 0; i < ca.length; i++) {
                ca[i].style.display = "none";
            }
            for (var i = 0; i < tx.length; i++) {
                tx[i].style.display = "none";
            }
            for (var i = 0; i < fl.length; i++) {
                fl[i].style.display = "block";
            }
            for (var i = 0; i < ny.length; i++) {
                ny[i].style.display = "none";
            }
        }
        if (stateSelection === 'NY') {
            for (var i = 0; i < ca.length; i++) {
                ca[i].style.display = "none";
            }
            for (var i = 0; i < tx.length; i++) {
                tx[i].style.display = "none";
            }
            for (var i = 0; i < fl.length; i++) {
                fl[i].style.display = "none";
            }
            for (var i = 0; i < ny.length; i++) {
                ny[i].style.display = "block";
            }
        }
    }
});