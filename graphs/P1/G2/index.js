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
let highest = [];
let us_territories = ['American Samoa', 'Guam', 'Commonwealth of the Northern Mariana Islands', 'Puerto Rico', 'United States Virgin Islands'];

const render = data => {
    const projection = d3.geoAlbersUsa().fitSize([width, height], states);
    const path = d3.geoPath().projection(projection);

    const colorScale = d3.scaleLinear().domain([d3.min(data, d => d.ConfirmedCases), d3.max(data, d => d.ConfirmedCases)])
        .range(d3.schemeYlOrRd[5]);

    const legendData = [41257, 82514, 123771, 165028, 247542];

    g.selectAll('path').data(states.features)
        .enter().append('path')
        .attr('class', 'state')
        .attr('d', path)
        .attr('fill', '#DCDCDC')
        .attr('stroke', '#C0C0C0');

    g.selectAll('circle')
        .data(data).enter()
        .append('circle')
        .attr('class', 'bubble')
        .attr('cx', d => projection([d.Longitude, d.Latitude])[0])
        .attr('cy', d => projection([d.Longitude, d.Latitude])[1])
        .attr('r', d => {
            if(d.ConfirmedCases <= 816)
                return Math.sqrt(d.ConfirmedCases) * 3.2 / 50;
            else if(d.ConfirmedCases <= 1675)
                return Math.sqrt(d.ConfirmedCases) * 1.6 / 50;
            else if(d.ConfirmedCases <= 8606)
                return Math.sqrt(d.ConfirmedCases) * 1.4 / 50;
            else if(d.ConfirmedCases <= 20850)
                return Math.sqrt(d.ConfirmedCases) * 1.3 / 50;
            else
                return Math.sqrt(d.ConfirmedCases) / 30;
        })
            .style('fill', d => colorScale(d.ConfirmedCases))
        .append('title')
            .text(d => `County: ${d.CountyName}\nConfirmed Cases: ${d.ConfirmedCases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`);

    g.selectAll('text')
        .data(states.features)
        .enter()
        .append('text')
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

            return path.centroid(d)[0];
        })
        .attr('y', d => {
            if(d.properties.name == 'Michigan')
                return path.centroid(d)[1] + 25;
            
            return path.centroid(d)[1]
        })
        .attr('fill', '#696969')
        .attr('font-size', font_size + '%');

    svg.call(d3.zoom().on('zoom', ({transform}) => {
        g.attr('transform', transform);
        console.log(transform.k);

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
            g.selectAll('circle')
                .attr('r', d => {
                    if(d.ConfirmedCases <= 816)
                        return Math.sqrt(d.ConfirmedCases) * 3.2 / 50 / transform.k;
                    else if(d.ConfirmedCases <= 1675)
                        return Math.sqrt(d.ConfirmedCases) * 1.6 / 50 / transform.k;
                    else if(d.ConfirmedCases <= 8606)
                        return Math.sqrt(d.ConfirmedCases) * 1.4 / 50 / transform.k;
                    else if(d.ConfirmedCases < 20850)
                        return Math.sqrt(d.ConfirmedCases) * 1.3 / 50 / transform.k;
                    else
                        return Math.sqrt(d.ConfirmedCases) / 30 / transform.k;
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

    console.log(states);
});

d3.csv('../../../data/P1/G2.csv').then(data => {
    data.forEach(d => {
        d.ConfirmedCases = +d.ConfirmedCases;
        if(!highest.includes(d.State))
            highest.push(d.State);
    });

    render(data);
    console.log(data);
});