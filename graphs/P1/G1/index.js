let w = window,
    d = document,
    e = d.documentElement,
    width = w.innerWidth - 100 || e.clientWidth,
    height = w.innerHeight - 100 || e.clientHeight;

const svg = d3.select('svg')
    .attr('width', width)
    .attr('height', height);

const g = svg.append('g');

let states;
let us_territories = ['American Samoa', 'Guam', 'Commonwealth of the Northern Mariana Islands', 'Puerto Rico', 'United States Virgin Islands'];

const getStates = data => {
    return data.properties.name;
}

const render = data => {
    const confirmed = new Map(data.map(d => [d.State, d.ConfirmedCases]));

    d3.min(data, d => d.ConfirmedCases);
    d3.max(data, d => d.ConfirmedCases);

    const colorScheme = d3.schemeBlues[8];

    const legendData = [1, 50000, 100000, 150000, 200000, 400000, 600000, 700000];

    const projection = d3.geoAlbersUsa()
        .fitSize([width, height], states);

    const path = d3.geoPath()
        .projection(projection);

    const colorScale = d3.scaleThreshold()
        .domain(legendData)
        .range(colorScheme);

    g.selectAll('path').data(states.features)
        .enter().append('path')
        .attr('class', 'states')
        .attr('d', path)
        .attr('class', 'states')
        .style('fill', d => colorScale(confirmed.get(d.properties.name)))
        .append('title')
        .text(d => {
            if (!us_territories.includes(d.properties.name))
                return d.properties.name + ': ' +
                    confirmed.get(d.properties.name).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        });

    let gl = svg.append("g")
        .attr("class", "legend");

    gl.append("text")
        .attr("class", "caption")
        .attr("x", 0)
        .attr("y", 0)
        .text("Confirmed Cases")
        .attr("transform", "translate(0, -15)");

    let labels = ['1 - 49,999', '50,000 - 99,999', '100,000 - 149,999', '150,000 - 199,999', '200,000 - 399,999', '400,000 - 599,999', '600,000 - 699,999', '> 700,000'];
    let legend = d3.legendColor()
        .labels((d) => {
            return labels[d.i];
        })
        .shapePadding(3)
        .scale(colorScale);

    svg.select(".legend")
        .call(legend);

    svg.call(d3.zoom().scaleExtent([1, 8]).on('zoom', ({
        transform
    }) => {
        g.attr('transform', transform);
    }));
};

d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json').then(data => {
    states = topojson.feature(data, data.objects.states);
    console.log(data);
});

d3.csv('../../../data/P1/G1.csv').then(data => {
    data.forEach(d => {
        d.ConfirmedCases = +d.ConfirmedCases;
    });

    render(data);
    console.log(states);
    console.log(data);
});