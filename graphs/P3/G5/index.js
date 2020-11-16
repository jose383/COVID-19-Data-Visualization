
const render = data =>{
    var svg = d3.select("#graph1")
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    const xValue = d => d.Count;
    const yValue = d => d.Symptom;
    const margin = {top: 20, right:10, bottom:40, left: 200};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const yScale = d3.scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.1);

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, xValue)])
        .range([0, innerWidth])

    const yAxis = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .call(d3.axisLeft(yScale));

    const xAxis = svg.append('g')
        .attr('transform', 'translate('+ margin.left + "," + (innerHeight + margin.top) + ")")
        .call(d3.axisBottom(xScale));

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("x", margin.left)
        .text("Symptoms");
    
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height- 6)
        .text("Count");  
        
    let grid = svg.append('g')
        .attr("class", "grid")
        .attr('transform', 'translate('+ margin.left + ',' + margin.top + ')')
        .call(d3.axisBottom(xScale)
        .tickSize((innerHeight))
        .tickFormat(""))

    let rect = svg.append("g").attr('transform', 'translate('+ margin.left + "," + margin.top + ")")
    rect.selectAll("rect").data(data).enter()
    .append("rect")
    .attr('y' , d => yScale(yValue(d)))
    .attr('width', d => xScale(xValue(d)))
    .attr('height', yScale.bandwidth())

}
let symptoms = []
let uniqueSymptoms = [];
d3.csv("G5.csv", (data) => {
   data.forEach(d => {
       symptoms.push(d.Symptoms.split(/,|;/))
   });
   let symptoms1 = [symptoms.length * 2]
   let k = 0;
   for (let i = 0; i < symptoms.length; i++) {
       for (let j = 0; j < symptoms[i].length; j++) {
           symptoms1[k] = symptoms[i][j].trim();
           k++
       }
   }
   let keyword = [];
    symptoms1.forEach(s =>{
        if(!symptoms1.includes(s.split(" "))){
            keyword.push(s.split(" "))
        }
   })
   let keyword1 = [];
   for (let i = 0; i < keyword.length; i++) {
       if(!keyword1.includes(keyword[i][0].toLowerCase())){
       keyword1[i] = keyword[i][0].toLowerCase();
        }
        else{

        }

   }
   let count = 0;
   let symptom = "";
   keyword1.forEach(k =>{
       symptoms1.forEach(s =>{
        if(s.includes(k) && k != ""){
            count++;
            symptom = s;
        }
       })
       if(count != 0){
       uniqueSymptoms.push({
           "Symptom" : symptom,
           "Count": count
       })
    }
       count = 0;
   })
   render(uniqueSymptoms);
   console.log(keyword1)
   console.log(uniqueSymptoms)
})