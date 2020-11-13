// Set the dimensions and margins of the graph
const margin = {
        top: 0,
        right: 50,
        bottom: 90,
        left: 100
    },
    width = window.innerWidth - margin.left - margin.right - 10,
    height =  window.innerHeight - margin.top - margin.bottom - 20;

// Append the svg object to the a div
let svg = d3.select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("../../../data/P1/G4.csv").then((data) => {
    // Add X axis
    let x = d3.scaleLinear()
        .domain([0, 800000])
        .range([0, width]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeInner(-height + 5).tickSizeOuter(0))
        .selectAll("text")
        .attr("transform", "translate(10,5)")
        .style("text-anchor", "end");

    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 55) + ")")
        .attr("font-size", "18px")
        .style("text-anchor", "middle")
        .text("Confirmed Cases");

    // Add Y axis
    let y = d3.scaleBand()
        .range([0, height])
        .domain(data.map((d) => d.State))
        .padding(.25);

    svg.append("g")
        .call(d3.axisLeft(y).tickSize(0));

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 70)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("font-size", "20px")
        .text("State");

    // Add Bars
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", x(800))
        .attr("y", (d) => {
            return y(d.State);
        })
        .attr("width", (d) => {
            return x(d.Cases);
        })
        .attr("height", y.bandwidth())
        .attr("fill", "#e15759");

    // Add bar labels
    svg.selectAll("labels")
        .data(data)
        .enter()
        .append("text")
        .text((d) => {
            return (d.Cases).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        })
        .attr("x", (d) => {
            return x(d.Cases) + 5;
        })
        .attr("y", (d) => {
            return y(d.State) + 11.5;
        })
        .attr('class', 'casesLabel')
        .attr("fill", "white")
        .attr("text-anchor", "right");
});