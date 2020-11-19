const margin = {
        top: 25,
        right: 50,
        bottom: 90,
        left: 190
    },
    width = window.innerWidth - margin.left - margin.right - 250,
    height =  window.innerHeight * 1.7;

let svg = d3.select("#graph1")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const render = data => {
    const xValue = d => d.Count;
    const yValue = d => d.Symptom;

    let x = d3.scaleLinear()
        .domain([0, 140])
        .range([0, width]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeInner(-height + 5).tickSizeOuter(0))
        .selectAll("text")
        .attr("transform", "translate(10,5)")
        .style("text-anchor", "end");

    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 25) + ")")
        .attr("font-size", "18px")
        .style("text-anchor", "middle")
        .text("Confirmed Cases");

    // Add Y axis
    let y = d3.scaleBand()
        .range([0, height])
        .domain(data.map(yValue))
        .padding(0.25);

    svg.append("g")
        .call(d3.axisLeft(y).tickSize(0));

    svg.append("text")
        .attr("y", -30)
        .attr("x", -100)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("font-size", "20px")
        .text("Symptoms");

    // Add Bars
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("y", (d) => {
            return y(yValue(d));
        })
        .attr("width", (d) => {
            return x(xValue(d));
        })
        .attr("height", y.bandwidth())
        .attr("fill", "#4e73df");

    // Add bar labels
    svg.selectAll("labels")
        .data(data)
        .enter()
        .append("text")
        .text((d) => {
            return (d.Count).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        })
        .attr("x", (d) => {
            return x(xValue(d)) + 5;
        })
        .attr("y", (d) => {
            return y(yValue(d)) + 11.5;
        })
        .attr('class', 'casesLabel')
        .attr("text-anchor", "right");
}

let listOfSymptoms = [];
let symptoms = [];
let uniqueSymptoms = [];
let dataset = [];

d3.csv("../../../data/P3/G3.csv", (data) => {
    data.forEach(d => {
        listOfSymptoms.push(d.Symptoms.split(','))
    });
    
    for (let i = 0; i < listOfSymptoms.length; i++) {
        for (let j = 0; j < listOfSymptoms[i].length; j++) {
            symptoms.push(listOfSymptoms[i][j].trim());
        }
    }

    const unique = () => {
        let cache;
        return (elem, index, array) => {
          if (!cache) cache = new Set(array);
          return cache.delete(elem);
        };
      };

    uniqueSymptoms = symptoms.filter(unique());

    let counter = 0;
    uniqueSymptoms.forEach((us) => {
        symptoms.forEach((s) => {
            if (us == s) {
                counter++
            }
        })
        dataset.push({
            "Symptom" : us.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' '),
            "Count": counter
        })
        counter = 0;
    })

    render(dataset.sort((a, b) => (a.Count < b.Count) ? 1 : -1));
})