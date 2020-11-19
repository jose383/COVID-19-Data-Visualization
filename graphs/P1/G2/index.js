let w = window,
    d = document,
    e = d.documentElement,
    width = w.innerWidth - 100 || e.clientWidth - 100,
    height = w.innerHeight - 100 || e.clientHeight - 100;

const svg = d3.select('svg')
    .attr('width', width)
    .attr('height', height)

const g = svg.append('g');

let states;
let us_territories = ['American Samoa', 'Guam', 'Commonwealth of the Northern Mariana Islands', 'Puerto Rico', 'United States Virgin Islands'];

let option = 'ConfirmedCases';
let t;

let change;

const getStates = data => {
    return data.properties.name;
}
const confirmed = [1, 1000, 5000, 10000, 50000, 100000, 150000, 200000];
const population = [10000, 100000, 500000, 1000000, 3000000, 5000000, 7000000, 9000000]

const getRadius = data => {
    if (option == 'ConfirmedCases') {
        if (data <= confirmed[0])
            return Math.sqrt(data) / 10;
        else if (data <= confirmed[1])
            return Math.sqrt(data) / 10;
        else if (data <= confirmed[2])
            return Math.sqrt(data) / 20;
        else if (data <= confirmed[3])
            return Math.sqrt(data) / 20;
        else
            return Math.sqrt(data) / 25;
    } else {
        if (data <= population[0])
            return Math.sqrt(data) / 20;
        else if (data <= population[2])
            return Math.sqrt(data) / 25;
        else if (data <= population[4])
            return Math.sqrt(data) / 30;
        else if (data <= population[6])
            return Math.sqrt(data) / 30;
        else
            return Math.sqrt(data) / 25;
    }
}

const render = data => {
    const projection = d3.geoAlbersUsa()
        .fitSize([width, height], states);

    const path = d3.geoPath()
        .projection(projection);

    const cccolorScale = d3.scaleThreshold()
        .domain(confirmed)
        .range(d3.schemeBlues[8]);

    const pcolorScale = d3.scaleThreshold()
        .domain(population)
        .range(d3.schemeYlGnBu[9]);

    const mapChange = option => {
        g.selectAll('circle')
            .attr('class', 'bubble')
            .transition()
            .delay((d, i) => i)
            .attr('cx', d => projection([d.Longitude, d.Latitude])[0])
            .attr('cy', d => projection([d.Longitude, d.Latitude])[1])
            .attr('r', d => {
                if (isNaN(t)) {
                    if (option == 'Population')
                        return getRadius(d.Population) / 5;
                    else
                        return getRadius(d.ConfirmedCases);
                } else {
                    if (option == 'Population')
                        return getRadius(d.Population) / t / 5;
                    else
                        return getRadius(d.ConfirmedCases) / t / 0.9;
                }
            })
            .style('fill', d => {
                if (option == 'Population')
                    return pcolorScale(d.Population);
                else
                    return cccolorScale(d.ConfirmedCases);
            })
            .selectAll('title')
            .text(d => {
                if (option == 'Population')
                    return `County: ${d.CountyName}\nPopulation: ${d.Population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
                else
                    return `County: ${d.CountyName}\nConfirmed Cases: ${d.ConfirmedCases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
            });

        if (option == 'Population') {
            document.getElementsByClassName("cclegend")[0].style.display = "none";
            document.getElementsByClassName("plegend")[0].style.display = "block";
        } else {
            document.getElementsByClassName("cclegend")[0].style.display = "block";
            document.getElementsByClassName("plegend")[0].style.display = "none";
        }
    }

    g.selectAll('path').data(states.features)
        .enter().append('path')
        .attr('class', 'states')
        .attr('d', path)
        .attr('fill', 'white');

    g.selectAll('circle')
        .data(data).enter()
        .append('circle')
        .attr('class', 'bubble')
        .attr('cx', d => projection([d.Longitude, d.Latitude])[0])
        .attr('cy', d => projection([d.Longitude, d.Latitude])[1])
        .attr('r', d => getRadius(d.ConfirmedCases))
        .style('fill', d => cccolorScale(d.ConfirmedCases))
        .append('title')
        .text(d => `County: ${d.CountyName}\nConfirmed Cases: ${d.ConfirmedCases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`);

    // Legend Hidden
    let pgl = svg.append("g")
        .attr("class", "plegend");

    pgl.append("text")
        .attr("class", "caption")
        .attr("x", 0)
        .attr("y", 0)
        .text("Confirmed Cases")
        .attr("transform", "translate(0, -15)");

    let plabels = ['1 - 9,999', '10,000 - 99,999', '100,000- 499,999', '500,000 - 999,999', '1M - 2.9M', '3M - 4.9M', '5M - 6.9M', '7M - 8.9M', ' > 9M'];
    let plegend = d3.legendColor()
        .labels((d) => {
            return plabels[d.i];
        })
        .shapePadding(3)
        .scale(pcolorScale);

    svg.select(".plegend")
        .call(plegend);

    // Legend Default
    let ccgl = svg.append("g")
        .attr("class", "cclegend");

    ccgl.append("text")
        .attr("class", "caption")
        .attr("x", 0)
        .attr("y", 0)
        .text("Confirmed Cases")
        .attr("transform", "translate(0, -15)");

    let cclabels = ['1 - 9,999', '10,000 - 4,999', '5,000 - 9,999', '10,000 - 49,999', '50,000 - 99,999', '100,000 - 149,999', '150,000 - 199,999', '> 200,000'];
    let cclegend = d3.legendColor()
        .labels((d) => {
            return cclabels[d.i];
        })
        .shapePadding(3)
        .scale(cccolorScale);

    svg.select(".cclegend")
        .call(cclegend);

    document.getElementsByClassName("cclegend")[0].style.display = "block";
    document.getElementsByClassName("plegend")[0].style.display = "none";

    svg.call(d3.zoom().scaleExtent([1, 8]).on('zoom', ({
        transform
    }) => {
        g.attr('transform', transform);
    }));

    change = selection => {
        if (selection == 'Population')
            option = 'Population';
        else
            option = 'ConfirmedCases';
        mapChange(option);
    };
};

d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json').then(data => {
    states = topojson.feature(data, data.objects.states);
});

d3.csv('../../../data/P1/G2.csv').then(data => {
    data.forEach(d => {
        d.ConfirmedCases = +d.ConfirmedCases;
        d.Population = +d.Population;
    });
    render(data);
});