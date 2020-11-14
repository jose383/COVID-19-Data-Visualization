const width = window.innerWidth;
const height = window.innerHeight;
const font_size = 60;

const svg = d3.select('svg')
    .attr('width', width)
    .attr('height', height);
const g = svg.append('g');

const legendContainerSettings = {
    x: width * 0.03,
    y: height * 0.02,
    width: 440,
    height: 60,
    roundX: 10,
    roundY: 10
};

const legendBoxSetting = {
    width: 80,
    height: 15,
    y: legendContainerSettings.y + 55
};

let states;
let us_territories = ['American Samoa', 'Guam', 'Commonwealth of the Northern Mariana Islands', 'Puerto Rico', 'United States Virgin Islands'];


const render = data => {

    const confirmed = new Map(data.map(d => [d.State, d.ConfirmedCases]));
    const min = d3.min(data, d => d.ConfirmedCases);
    const max = d3.max(data, d => d.ConfirmedCases);

    const legendData = [147110, 294220, 441330, 588440, 735550];

    const projection = d3.geoAlbersUsa().fitSize([width, height], states);
    const path = d3.geoPath().projection(projection);

    const colorScale = d3.scaleLinear().domain([min, max])
        .range(['white', 'orange']);

    g.selectAll('path').data(states.features)
        .enter().append('path')
        .attr('class', 'state')
        .attr('d', path)
        .attr('class', 'state')
        .style('fill', d => colorScale(confirmed.get(d.properties.name)))
        .attr('stroke', '#C0C0C0')
        .append('title')
        .text(d => {
            if(!us_territories.includes(d.properties.name))
                return 'Total Confirmed Cases: ' 
                        + confirmed.get(d.properties.name).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        });

    g.selectAll('text')
        .data(states.features)
        .enter().append('text')
        .text(d => {
            if(d.properties.name == 'Delaware')
                return 'DE';
            else if(d.properties.name == 'Maryland')
                return 'MD';
            else if(d.properties.name == 'New Jersey')
                return 'NJ';
            else if(d.properties.name == 'District of Columbia')
                return '';
            else if(d.properties.name == 'Rhode Island')
                return 'RI';
            else if(d.properties.name == 'Maryland')
                return 'MD';
            else if(d.properties.name == 'Vermont')
                return 'VT';
            else if(d.properties.name == 'New Hampshire')
                return 'NH';
            else if(d.properties.name == 'Connecticut')
                return 'CT';
            else if(d.properties.name == 'Massachusetts')
                return 'MA';
            if(!us_territories.includes(d.properties.name))
                return d.properties.name;
        })
        .attr('text-anchor', 'middle')
        .attr('x', d => {
            if(d.properties.name == 'Florida')
                return path.centroid(d)[0] + 15;

            if(d.properties.name == 'Michigan')
                return path.centroid(d)[0] + 15;

            return path.centroid(d)[0]
        })
        .attr('y', d => {
            if(d.properties.name == 'Michigan')
                return path.centroid(d)[0] + 25;

            return path.centroid(d)[1];
        })
        .attr('fill', '#000000')
        .attr('font-size', font_size + '%');

    svg.call(d3.zoom().on('zoom', ({transform}) => {
        g.attr('transform', transform);

        if(transform.k > 0.8 && transform.k < 6){
            g.selectAll('text')
                .attr('font-size', (font_size/transform.k) + '%')
                .text(d => {
                    if(!us_territories.includes(d.properties.name)){
                        if(transform.k > 2.3)
                                return d.properties.name;
                        else{
                            if(d.properties.name == 'Delaware')
                                return 'DE';
                            else if(d.properties.name == 'District of Columbia')
                                return '';
                            else if(d.properties.name == 'Maryland')
                                return 'MD';
                            else if(d.properties.name == 'New Jersey')
                                return 'NJ';
                            else if(d.properties.name == 'Rhode Island')
                                return 'RI';
                            else if(d.properties.name == 'Maryland')
                                return 'MD';
                            else if(d.properties.name == 'Vermont')
                                return 'VT';
                            else if(d.properties.name == 'New Hampshire')
                                return 'NH';
                            else if(d.properties.name == 'Connecticut')
                                return 'CT';
                            else if(d.properties.name == 'Massachusetts')
                                return 'MA';
                            else return d.properties.name;
                        }
                    }
                });
        }
    }));

    const legendContainer = svg.append('rect')
        .attr('x', legendContainerSettings.x)
        .attr('y', legendContainerSettings.y + 550)
        .attr('rx', legendContainerSettings.roundX)
        .attr('ry', legendContainerSettings.roundY)
        .attr('width', legendContainerSettings.width)
        .attr('height', legendContainerSettings.height)
        .attr('class', 'legendContainer');

    const legend = svg.selectAll('g.legend')
        .data(legendData)
        .enter().append('g')
        .attr('class', 'legend');

    legend.append('rect')
        .attr('x', (d,i) => legendContainerSettings.x + legendBoxSetting.width * i + 20)
        .attr('y', legendBoxSetting.y + 525)
        .attr('width', legendBoxSetting.width)
        .attr('height', legendBoxSetting.height)
        .style('fill', d => colorScale(d))
        .style('opacity', 1);

    legend.selectAll('text')
        .data(legendData)
        .enter().append('text')
        .attr('x', (d, i) => legendContainerSettings.x + legendBoxSetting.width * i + 30)
        .attr('y', legendContainerSettings.y + 570)
        .style('font-size', '70%')
        .text(d => '<= ' + d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
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
