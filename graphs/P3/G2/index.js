let w = window,
    d = document,
    e = d.documentElement,
    width = w.innerWidth - 300 || e.clientWidth - 300,
    height = (w.innerHeight / 2) - 90 || (e.clientHeight / 2);

const render1 = data => {
    var svg = d3.select("#graph1")
        .attr('width', width)
        .attr('height', height);

    const xValue = d => d.AgeGroup;
    const yValue = d => d.Records;
    const margin = {
        top: 20,
        right: width / 3,
        bottom: 40,
        left: 50
    };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    let colors = d3.schemeTableau10;

    const xScale = d3.scaleBand()
        .domain(data.map(xValue))
        .range([0, innerWidth])
        .padding(0.1);

    svg.append('g')
        .classed("xAxis", true)
        .attr('transform', 'translate(' + margin.left + "," + (innerHeight + margin.top) + ")")
        .call(d3.axisBottom(xScale));

    const yScale = d3.scaleLinear()
        .domain([0, Math.ceil((+d3.max(data, yValue) + 1) / 10) * 10])
        .range([innerHeight, 0]);

    svg.append("g")
        .classed("yAxis", true)
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .call(d3.axisLeft(yScale));

    svg.append("text")
        .attr("class", "ylabel")
        .attr("text-anchor", "end")
        .attr("x", -120)
        .attr("y", 0)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Number Of Records");

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", innerWidth / 1.7)
        .attr("y", height - 6)
        .text("Age Group");

    let rect = svg.append("g")
        .attr('transform', 'translate(' + margin.left + "," + margin.top + ")")

    rect.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) {
            return innerHeight - yScale(d.Records)
        })
        .attr('x', function (d) {
            return xScale(d.AgeGroup);
        })
        .attr('y', function (d) {
            return yScale(d.Records);
        })
        .attr("fill", function (d, i) {
            return colors[i] //Here
        })
        .append("title")
        .text((d) => {
            return (d.AgeGroup + ": " + d.Records)
        });

    svg.selectAll("labels")
        .data(data)
        .enter()
        .append("text")
        .attr("x", (d) => {
            return xScale(d.AgeGroup) + margin.left + xScale.bandwidth() / 2 - 14;
        })
        .attr("y", (d) => {
            return yScale(d.Records) + 15;
        })
        .text((d) => {
            return (d.Records);
        })
        .attr('class', 'casesLabels');

    var radius = 200;

    var arr = [];

    data.forEach((d) => {
        arr.push([d.AgeGroup, +d.Records])
    })

    var datapie = arr.reduce(function (prev, curr) {
        prev[curr[0]] = curr[1];
        return prev;
    }, {})

    var color = d3.scaleOrdinal()
        .domain(data.map(xValue))
        .range(colors);

    var pie = d3.pie()
        .sort(null)
        .value(function (d) {
            return d.value;
        })

    var dataReady = pie(d3.entries(datapie))

    var arc = d3.arc()
        .innerRadius(radius * 0.5)
        .outerRadius(radius * 0.8)

    svg.append("g")
        .attr("transform", "translate(" + innerWidth * 1.35 + "," + innerHeight / 1.8 + ")")
        .selectAll('allSlices')
        .data(dataReady)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function (d) {
            return (color(d.data.key))
        })
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .append("title")
        .text((d) => {
            return (d.data.key + ": " + d.value)
        });
}

const render2 = data => {
    var svg = d3.select("#graph2")
        .attr('width', width)
        .attr('height', height);

    const xValue = d => d.Outcome;
    const yValue = d => d.AvgAge;

    const margin = {
        top: 20,
        right: width / 3,
        bottom: 40,
        left: 50
    };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    let colors = d3.schemeTableau10;

    const xScale = d3.scaleBand()
        .domain(data.map(xValue))
        .range([0, innerWidth])
        .padding(0.1);

    svg.append('g')
        .classed("xAxis", true)
        .attr('transform', 'translate(' + margin.left + "," + (innerHeight + margin.top) + ")")
        .call(d3.axisBottom(xScale));

    const yScale = d3.scaleLinear()
        .domain([0, Math.ceil((+d3.max(data, yValue) + 1) / 10) * 10])
        .range([innerHeight, 0]);

    svg.append("g")
        .classed("yAxis", true)
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .call(d3.axisLeft(yScale));

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", -140)
        .attr("y", 0)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Average Age");

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", innerWidth / 1.7)
        .attr("y", height - 6)
        .text("Outcomes");

    let rect = svg.append("g")
        .attr('transform', 'translate(' + margin.left + "," + margin.top + ")")

    rect.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) {
            return innerHeight - yScale(d.AvgAge)
        })
        .attr('x', function (d) {
            return xScale(d.Outcome);
        })
        .attr('y', function (d) {
            return yScale(d.AvgAge);
        })
        .attr("fill", function (d, i) {
            return colors[i] //Here
        })
        .append("title")
        .text((d) => {
            return (d.Outcome + ": " + d.AvgAge.substring(0, 2))
        });

    svg.selectAll("labels")
        .data(data)
        .enter()
        .append("text")
        .attr("x", (d) => {
            return xScale(d.Outcome) + margin.left + xScale.bandwidth() / 2 - 10;
        })
        .attr("y", (d) => {
            return yScale(d.AvgAge) + 15;
        })
        .text((d) => {
            return (d.AvgAge).substring(0, 2);
        })
        .attr('class', 'casesLabel');

    var radius = 200;
    var arr = [];

    data.forEach((d) => {
        arr.push([d.Outcome, +d.AvgAge.substring(0, 2)])
    })

    var datapie = arr.reduce(function (prev, curr) {
        prev[curr[0]] = curr[1];
        return prev;
    }, {})

    var color = d3.scaleOrdinal()
        .domain(data.map(xValue))
        .range(colors);

    var pie = d3.pie()
        .sort(null)
        .value(function (d) {
            return d.value;
        })

    var dataReady = pie(d3.entries(datapie))

    var arc = d3.arc()
        .innerRadius(radius * 0.5)
        .outerRadius(radius * 0.8)

    svg.append("g")
        .attr("transform", "translate(" + innerWidth * 1.35 + "," + innerHeight / 1.8 + ")")
        .selectAll('allSlices')
        .data(dataReady)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function (d) {
            return (color(d.data.key))
        })
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .append("title")
        .text((d) => {
            return (d.data.key + ": " + d.value)
        });      
}

let ageGroup = []
d3.csv("../../../data/P3/G21.csv", (data) => {
    data.forEach(d => {
        ageGroup.push({
            "AgeGroup": d.AgeGroup,
            "Records": +d.NumberofRecords
        });
    })
    render1(ageGroup);
})

let outcome = []
d3.csv("../../../data/P3/G22.csv", (data) => {
    data.forEach(d => {
        outcome.push({
            "Outcome": d.Outcome,
            "AvgAge": d.AvgAge
        })
    })
    render2(outcome);
})