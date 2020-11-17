const width = 1300;
const height = 700;
const font_size = 60;

let provinces;

const svg = d3.select('svg')
    .attr('width', width)
    .attr('height', height);
const g = svg.append('g');

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

const legendData = [246,492,738,984,1230]

const render = data => {
    const confirmed = new Map(data.map(d => [d.Province, d.NumberOfRecords]));
    const projection = d3.geoMercator().fitSize([width, height - 250], provinces);
    const path = d3.geoPath().projection(projection);

    const colorScale = d3.scaleLinear().domain([d3.min(data, d => d.NumberOfRecords), d3.max(data, d => d.NumberOfRecords)])
        .range(d3.schemeOranges[3]);

    g.selectAll('path').data(provinces.features)
        .enter().append('path')
        .attr('class', 'state')
        .attr('d', path)
        .attr('class', 'province')
        .style('fill', d => {
            if(confirmed.has(d.properties.NAME_1))
                return colorScale(confirmed.get(d.properties.NAME_1));
            else
                return 'white';
        })
        .attr('stroke', '#C0C0C0')
        .append('title')
            .text(d => {
                if(!isNaN(confirmed.get(d.properties.NAME_1))){
                    if(d.properties.NAME_1 == 'Chongqing' || d.properties.NAME_1 == 'Tianjin' || d.properties.NAME_1 == 'Hebei')
                        return "Province: " + d.properties.NAME_1 +
                            "\nConfirmed Cases: " + confirmed.get(d.properties.NAME_1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    else
                        return "Confirmed Cases: " + confirmed.get(d.properties.NAME_1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
            });

    g.selectAll('text')
        .data(provinces.features).enter()
        .append('text')
        .text(d => {
            if(d.properties.NAME_1 == 'Chongqing' || d.properties.NAME_1 == 'Tianjin' || d.properties.NAME_1 == 'Hebei' 
                || d.properties.NAME_1 == 'Hubei')
                return '';
            
            return d.properties.NAME_1;
        
        })
            .attr('x', d => {
                if(d.properties.NAME_1 == 'Gansu')
                    return path.centroid(d)[0] + 13;
                else if(d.properties.NAME_1 == 'Hunan' || d.properties.NAME_1 == 'Jiangxi' || d.properties.NAME_1 == 'Zhejiang'
                        || d.properties.NAME_1 == 'Hainan' || d.properties.NAME_1 == 'Anhui' || d.properties.NAME_1 == 'Shanxi'
                        || d.properties.NAME_1 == 'Chongqing' || d.properties.NAME_1 == 'Heilongjiang')
                    return path.centroid(d)[0] - 5;
                else if(d.properties.NAME_1 == 'Shanghai' || d.properties.NAME_1 == 'Tianjin' || d.properties.NAME_1 == 'Beijing'
                    || d.properties.NAME_1 == 'Ningxia' || d.properties.NAME_1 == 'Jilin')
                    return path.centroid(d)[0] - 3;

                return path.centroid(d)[0];
            })
            .attr('y', d => {
                if(d.properties.NAME_1 == 'Hebei')
                    return path.centroid(d)[1] - 23;
                else if(d.properties.NAME_1 == 'Heilongjiang')
                    return path.centroid(d)[1] + 5;

                return path.centroid(d)[1];
            })
            .attr('fill', 'black')
            .attr('font-size', font_size + '%');

            svg.call(d3.zoom().on('zoom', ({transform}) => {
                g.attr('transform', transform);
        
                if(transform.k > 0.8){
                    g.selectAll('text')
                        .attr('font-size', (font_size/transform.k) + '%')
                        .text(d => {
                            if(d.properties.NAME_1 == 'Chongqing' || d.properties.NAME_1 == 'Tianjin' || d.properties.NAME_1 == 'Hebei'){
                                if(transform.k > 1.5){
                                        g.selectAll('title')
                                            .text(d => 'Confirmed Cases: ' + confirmed.get(d.properties.NAME_1));
                                        return d.properties.NAME_1;
                                }
                                else{
                                    g.selectAll('title')
                                            .text(d => {
                                                if(d.properties.NAME_1 == 'Chongqing' || d.properties.NAME_1 == 'Tianjin' 
                                                    || d.properties.NAME_1 == 'Hebei')
                                                    return 'Province: ' + d.properties.NAME_1 
                                                            + '\nConfirmed Cases: ' + confirmed.get(d.properties.NAME_1);
                                                else
                                                    return 'Confirmed Cases: ' + confirmed.get(d.properties.NAME_1);
                                            });
                                    return '';
                                }
                            }
                            else if(d.properties.NAME_1 == 'Hubei')
                                return '';
                            else
                                return d.properties.NAME_1;
                        });
                    }
            }))

            svg.append('rect')
                .attr('x', legendContainerSettings.x)
                .attr('y', legendContainerSettings.y)
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
                .attr('y', legendBoxSetting.y - 15)
                .attr('width', legendBoxSetting.width)
                .attr('height', legendBoxSetting.height)
                .style('fill', d => colorScale(d))
                .style('opacity', 1);
        
            legend.selectAll('text')
                .data(legendData)
                .enter().append('text')
                .attr('x', (d, i) => legendContainerSettings.x + legendBoxSetting.width * i + 30)
                .attr('y', legendContainerSettings.y + 35)
                .style('font-size', '70%')
                .text(d => '<= ' + d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        
            legend.append('text')
                .attr('x', legendContainerSettings.x + 140)
                .attr('y', legendContainerSettings.y + 15)
                .style('font-size', '.8em')
                .text('Confirmed Cases per Province in China');
};

d3.json('../../../../data/P3/G1_2.json').then(data => {
    provinces = topojson.feature(data, data.objects.CHN_adm1);
    console.log(provinces);
});

d3.csv('../../../../data/P3/G1.csv').then(data => {
    data.forEach(d => {
        d.NumberOfRecords = +d.NumberOfRecords;
    });

    render(data);
    console.log(data);
})