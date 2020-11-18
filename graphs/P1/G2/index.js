const width = 1500;
const height = 700;
const font_size = 60;

const legendDataC = [41257, 82514, 123771, 165028, 247542];
const legendDataP = [10000, 50000, 250000, 1250000, 6250000];

const svg = d3.select('svg')
    .attr('width', width)
    .attr('height', height)
const g = svg.append('g');
const legend = svg.selectAll('g.legend')
        .data(legendDataC)
        .enter().append('g')
        .attr('class', 'legend');

const legendContainerSettings = {
    x: width / 2.6,
    y: 475,
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

// Used to create CSV file of actual population in counties
// const csv = data => {
//     console.log(Object.keys(data[0]));

//     let header = Object.keys(data[0]).join(',');
//     let csv;
//     let values = data.map(o => Object.values(o).join(',')).join('\n');

//     csv += header + '\n' + values;
    
//     console.log(csv)
// }

let t;
let states;
let us_territories = ['American Samoa', 'Guam', 'Commonwealth of the Northern Mariana Islands', 'Puerto Rico', 'United States Virgin Islands'];
let option = 'ConfirmedCases';

const getStateName = data => {
    if(data.properties.name == 'Delaware')
        return 'DE';
    else if(data.properties.name == 'Maryland')
        return 'MD';
    else if(data.properties.name == 'New Jersey')
        return 'NJ';
    else if(data.properties.name == 'District of Columbia')
        return '';
    else if(data.properties.name == 'Rhode Island')
        return 'RI';
    else if(data.properties.name == 'Maryland')
        return 'MD';
    else if(data.properties.name == 'Vermont')
        return 'VT';
    else if(data.properties.name == 'New Hampshire')
        return 'NH';
    else if(data.properties.name == 'Connecticut')
        return 'CT';
    else if(data.properties.name == 'Massachusetts')
        return 'MA';
    else
        return data.properties.name;
}

const getRadius = data => {
    const confirmed = [816, 1675, 8606, 20850];
    const pop = [93746, 187492, 281238, 374984]

    if(option == 'ConfirmedCases'){
        if(data <= confirmed[0])
            return Math.sqrt(data) * 2.0 / 20;
        else if(data <= confirmed[1])
            return Math.sqrt(data) * 1.6 / 20 ;
        else if(data <= confirmed[2])
            return Math.sqrt(data) * 1.4 / 20;
        else if(data <= confirmed[3])
            return Math.sqrt(data) * 1.8 / 50;
        else
            return Math.sqrt(data) / 40;
    }
    else{
        if(data <= pop[0])
            return Math.sqrt(data) * 1.6 / 40;
        else if(data <= pop[1])
            return Math.sqrt(data) * 1.5 /35;
        else if(data <= pop[2])
            return Math.sqrt(data) * 1.3 / 35;
        else if(data <= pop[3])
            return Math.sqrt(data) * 1.2 / 30;
        else
            return Math.sqrt(data) / 35;
    }
}

const getLegendTitle = () => {
    legend.append('text')
        .attr('x', legendContainerSettings.x + 155)
        .attr('y', legendContainerSettings.y + 15)
        .style('font-size', '.8em')
        .text(() => {
            if(option == 'ConfirmedCases') 
                return 'Confirmed Cases Density';
            else 
                return 'Population Density';
        });
}

const render = data => {
    const projection = d3.geoAlbersUsa().fitSize([width, height - 250], states);
    const path = d3.geoPath().projection(projection);

    const colorScaleC = d3.scaleLinear().domain([d3.min(data, d => d.ConfirmedCases), d3.max(data, d => d.ConfirmedCases)])
        .range(d3.schemeYlOrRd[3]);
    const colorScaleP = d3.scaleLinear().domain([d3.min(data, d => d.Population), d3.max(data, d => d.Population)])
        .range(d3.schemeYlGnBu[3]);

    console.log(option)

    const mapChange = option => {
        g.selectAll('circle')
            .attr('class', 'bubble')
            .transition()
            .delay((d,i) => i * 10)
            .attr('cx', d => projection([d.Longitude, d.Latitude])[0])
            .attr('cy', d => projection([d.Longitude, d.Latitude])[1])
            .attr('r', d => {
                if(isNaN(t)){
                    if(option == 'Population')
                        return getRadius(d.Population) / 3;
                    else
                        return getRadius(d.ConfirmedCases);
                }
                else{
                    if(option == 'Population')
                        return getRadius(d.Population) / t / 3;
                    else
                        return getRadius(d.ConfirmedCases) / t / 0.9;
                }
            })
            .style('fill', d => {
                if(option == 'Population')
                    return colorScaleP(d.Population);
                else
                    return colorScaleC(d.ConfirmedCases);
            })
            .selectAll('title')
                .text(d => {
                    if(option == 'Population')
                        return `County: ${d.CountyName}\nPopulation: ${d.Population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
                    else
                        return `County: ${d.CountyName}\nConfirmed Cases: ${d.ConfirmedCases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
                });

            legend.selectAll('rect')
                .transition()
                .delay((d,i) => i * 10)
                .style('fill', d => {
                    if(option == 'Population')
                        return colorScaleP(d * 15);
                    else
                        return colorScaleC(d);
                })

            legend.selectAll('text')
                .remove();

            legend.selectAll('text')
                .data(legendDataP).enter()
                .append('text')
                .attr('x', (d, i) => legendContainerSettings.x + legendBoxSetting.width * i + 30)
                .attr('y', legendContainerSettings.y + 35)
                .style('font-size', '.8em')
                .text(d => {
                    if(option == 'Population')
                        return '> ' + d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    else
                        return '<= ' + d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                });

            getLegendTitle();
    }

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
        .attr('r', d => getRadius(d.ConfirmedCases))
            .style('fill', d => colorScaleC(d.ConfirmedCases))
        .append('title')
            .text(d => `County: ${d.CountyName}\nConfirmed Cases: ${d.ConfirmedCases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`);

    g.selectAll('text')
        .data(states.features)
        .enter()
        .append('text')
        .text(d => {
            if(!us_territories.includes(d.properties.name))
                return getStateName(d);
        })
        .attr('text-anchor', 'middle')
        .attr('x', d => {
            if(d.properties.name == 'Florida' || d.properties.name == 'Michigan')
                return path.centroid(d)[0] + 10;

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
        t = transform.k;
        g.attr('transform', transform);
        console.log(transform.k);

        if(transform.k > 0.8){
            g.selectAll('text')
                .attr('font-size', (font_size/transform.k) + '%')
                .text(d => {
                    if(!us_territories.includes(d.properties.name)){
                        if(transform.k > 2.3)
                                return d.properties.name;
                        else
                            return getStateName(d);
                    }
                });
            g.selectAll('circle')
                .attr('r', d => {
                    if(option == 'ConfirmedCases') 
                        return getRadius(d.ConfirmedCases) / transform.k / 0.9;
                    else 
                        return getRadius(d.Population) / transform.k / 3;
                });
        }
    }));

    svg.append('rect')
        .attr('x', legendContainerSettings.x)
        .attr('y', legendContainerSettings.y)
        .attr('rx', legendContainerSettings.roundX)
        .attr('ry', legendContainerSettings.roundY)
        .attr('width', legendContainerSettings.width)
        .attr('height', legendContainerSettings.height)
        .attr('class', 'legendContainer');

    legend.append('rect')
        .attr('x', (d,i) => legendContainerSettings.x + legendBoxSetting.width * i + 20)
        .attr('y', legendContainerSettings.y + 40)
        .attr('width', legendBoxSetting.width)
        .attr('height', legendBoxSetting.height)
        .style('fill', d => colorScaleC(d));

    legend.selectAll('text')
        .data(legendDataC)
        .enter().append('text')
        .attr('x', (d, i) => legendContainerSettings.x + legendBoxSetting.width * i + 30)
        .attr('y', legendContainerSettings.y + 35)
        .style('font-size', '.8em')
        .text(d => '<= ' + d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));

    getLegendTitle();

    change = selection => {
        if(selection == 'Population')
            option = 'Population';
        else
            option = 'ConfirmedCases';

        mapChange(option);
    };
};

d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json').then(data => {
    states = topojson.feature(data, data.objects.states);

    console.log(states);
});

d3.csv('../../../data/P1/G2.csv').then(data => {
    data.forEach(d => {
        d.ConfirmedCases = +d.ConfirmedCases;
        d.Population = +d.Population;
    });

    render(data);
    console.log(data);
});