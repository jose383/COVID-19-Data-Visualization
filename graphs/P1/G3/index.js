// Set the dimensions and margins of the graph
var margin = {
        top: 75,
        right: 20,
        bottom: 100,
        left: 100
    },
    width = 7000 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

// Append the svg object to the a div
var svg = d3.select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var filteredData = [];
var datasetWithTotal = [];
var dataset = [];
var subgroups = [];
var groups = [];

var statesString = "";
var date = "1/22/2020";
var lastdate = null;
var cases = 0;
var casesPerDay = [];

var colors = ['#e15759', '#86bcb6', '#499894', '#f1ce63', '#b6992d', '#8cd17d', '#59a14f', '#ffbe7d', '#f28e2b', '#a0cbe8', '#4e79a7', '#d7b5a6', '#9d7660', '#d4a6c8', '#b07aa1', '#fabfd2', '#d37295', '#bab0ac', '#79706e', '#ff9d9a', '#e15759', '#86bcb6', '#499894', '#f1ce63', '#b6992d', '#8cd17d', '#59a14f', '#ffbe7d', '#f28e2b', '#a0cbe8', '#4e79a7', '#d7b5a6', '#9d7660', '#d4a6c8', '#b07aa1', '#fabfd2', '#d37295', '#bab0ac', '#79706e', '#ff9d9a', '#e15759', '#86bcb6', '#499894', '#f1ce63', '#b6992d', '#8cd17d', '#59a14f', '#ffbe7d', '#f28e2b', '#a0cbe8', '#4e79a7'];

// Parse the Data
d3.csv("../../../data/P1/G3.csv", (data) => {

    // Pre-sort the Data
    filteredData = data.sort((a, b) => {
        // Sort by Date
        if (new Date(a.Date) > new Date(b.Date)) return 1;
        else if (new Date(a.Date) < new Date(b.Date)) return -1;

        // Then sort by Cases
        if (+a.Cases > +b.Cases) return -1;
        else if (+a.Cases < +b.Cases) return 1;
        else return 0;
    });

    // Create dataset, list of states(subgroups), and a dataset with total cases per day 
    filteredData.forEach((d) => {
        // Add state if not in list
        if (!subgroups.includes(d.State)) {
            subgroups.push(d.State);
        }

        // Add date if not in list 
        if (d.Date != date) {
            date = d.Date;
            dataset.push(JSON.parse("{\"Date\" : \"" + lastdate + "\", " + statesString.slice(0, -2) + "}"));
            datasetWithTotal.push(JSON.parse("{\"Date\" : \"" + lastdate + "\", " + statesString.slice(0, -2) + ", \"TotalCases\" : " + cases + "}"));
            statesString = "";
            casesPerDay.push(cases);
            cases = 0;
        }
        cases += +d.Cases;
        lastdate = date;
        statesString += "\"" + d.State + "\" : " + d.Cases + ", ";
    });

    // Sort bar by total cases descending
    dataset = datasetWithTotal.sort((a, b) => {
        if (+a.TotalCases > +b.TotalCases) return -1;
        else if (+a.TotalCases < +b.TotalCases) return 1;
    });

    groups = d3.map(dataset, (d) => {
        return (d.Date)
    }).keys();

    // X axis
    var x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .selectAll("text")
        .attr("transform", "translate(40,38) rotate(45)")
        .style("text-anchor", "end");

    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 10) + ")")
        .style("text-anchor", "middle")
        .attr("font-size", "17px")
        .text("Date");

    // Y axis
    var y = d3.scaleLinear()
        // Y domain from 0 to max cases in a day round to the closest 10k
        .domain([0, Math.round(Math.max.apply(Math, casesPerDay) / 10000) * 10000])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y).tickSizeInner(-width + 5).tickSizeOuter(0))
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

    // One color per group
    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(colors);

    // Stack the data
    var stackedData = d3.stack()
        .keys(subgroups)
        (dataset);

    // Bars
    svg.append("g")
        .selectAll("g")
        .data(stackedData)
        .enter().append("g")
        .attr("fill", (d) => {
            return color(d.key);
        })
        .selectAll("rect")
        .data((d) => {
            return d;
        })
        .enter().append("rect")
        .attr("x", (d) => {
            return x(d.data.Date);
        })
        .attr("y", (d) => {
            return y(d[1] + 75);
        })
        .attr("height", (d) => {
            return y(d[0]) - y(d[1]);
        })
        .attr("width", x.bandwidth() - 5);

    // Legend
    var legend = svg.selectAll(".legend")
        .data(colors)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => {
            return "translate(" + ((-i * 30) - width / 2 + (30 * 26)) + ", -50)";
        });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", (d, i) => {
            return colors.slice().reverse()[i];
        });

    subgroups.reverse().forEach((d, i) => {
        svg.append("text")
            .attr("y", -12)
            .attr("x", (-i * 30) + (width / 2) + (29.66 * 26))
            .style("text-anchor", "middle")
            .text(d);
    });
});