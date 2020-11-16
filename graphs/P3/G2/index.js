// The svg

const render1 = data =>{
    
var svg = d3.select("#graph1")
const width = +svg.attr('width');
const height = +svg.attr('height');
    const xValue = d => d.AgeGroup;
    const yValue = d => d.Records;
    const margin = {top: 20, right:20, bottom:40, left: 50};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    let colors = d3.schemeCategory20c;
    
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, yValue)])
        .range([innerHeight, 0]);
        
    const xScale = d3.scaleBand()
        .domain(data.map(xValue))
        .range([0,innerWidth])
        .padding(0.1);

        
    const xAxis = svg.append('g')
        .classed("xAxis", true)
        .attr('transform', 'translate('+ margin.left + "," + (innerHeight + margin.top) + ")")
        .call(d3.axisBottom(xScale));
    
    const yAxis = svg.append("g")
        .classed("yAxis",true)
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .call(d3.axisLeft(yScale));
    
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Number Of Records");
    
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height- 6)
        .text("Age Group");  

    let grid = svg.append('g')
        .attr("class", "grid")
        .attr('transform', 'translate('+ margin.left + ',' + margin.top + ')')
        .call(d3.axisLeft(yScale)
        .tickSize(-(innerWidth))
        .tickFormat(""))

    let rect = svg.append("g").attr('transform', 'translate('+ margin.left + "," + margin.top + ")")
    
    rect.selectAll("rect").data(data).enter()
    .append("rect")
    .attr("width", xScale.bandwidth())
    .attr("height", function(d){
        return innerHeight - yScale(d.Records)
    })
    .attr('x', function(d){
        return xScale(d.AgeGroup);
    })
    .attr('y', function(d){
        return yScale(d.Records);
    })
    .attr("fill", function(d,i){
        return colors[i]
    })
    
}
const render2 = data =>{
    var svg = d3.select("#graph2")
    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const xValue = d => d.Outcome;
    const yValue = d => d.AvgAge;
    const margin = {top: 20, right:20, bottom:40, left: 40};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    let colors = d3.schemeCategory20c;
    
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, yValue)])
        .range([innerHeight, 0]);
        
    const xScale = d3.scaleBand()
        .domain(data.map(xValue))
        .range([0,innerWidth])
        .padding(0.1);

        
    const xAxis = svg.append('g')
        .classed("xAxis", true)
        .attr('transform', 'translate('+ margin.left + "," + (innerHeight + margin.top) + ")")
        .call(d3.axisBottom(xScale));

    const yAxis = svg.append("g")
        .classed("yAxis",true)
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .call(d3.axisLeft(yScale));

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 5)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Average Age");
    
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("Outcomes");     

    let grid = svg.append('g')
        .attr("class", "grid")
        .attr('transform', 'translate('+ margin.left + ',' + margin.top + ')')
        .call(d3.axisLeft(yScale)
        .tickSize(-(innerWidth))
        .tickFormat(""))

    let rect = svg.append("g").attr('transform', 'translate('+ margin.left + "," + margin.top + ")")
    
    rect.selectAll("rect").data(data).enter()
    .append("rect")
    .attr("width", xScale.bandwidth())
    .attr("height", function(d){
        return innerHeight - yScale(d.AvgAge)
    })
    .attr('x', function(d){
        return xScale(d.Outcome);
    })
    .attr('y', function(d){
        return yScale(d.AvgAge);
    })
    .attr("fill", function(d,i){
        return colors[i]
    })

  
}
    let dataSet = []
d3.csv("G2.csv", (data) => {
  data.forEach(d =>{
      dataSet.push({
        "AgeGroup": d.AgeGroup,
        "Records": +d.NumberofRecords
                });
  })

console.log(dataSet);
render1(dataSet);
})
let outcomeData = []
d3.csv("G3.csv", (data) =>{
    data.forEach(d =>{
        outcomeData.push({
            "Outcome" :d.Outcome,
            "AvgAge" :d.AvgAge 
        })
    })
    console.log(outcomeData);
    render2(outcomeData);
})