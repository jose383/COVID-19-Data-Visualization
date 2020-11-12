// set the dimensions and margins of the graph
const margin = {
        top: 50,
        right: 20,
        bottom: 100,
        left: 100
    },
    width = 1500 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

// Append the svg object to the a div
let svg = d3.select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let change;

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

    // California linechart
    let line = svg
        .append('g')
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
            return '#e15759';
        })
        .style("stroke-width", 1.5)
        .style("fill", "none");

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
                return '#e15759'
            });
    }
});