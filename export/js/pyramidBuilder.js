function pyramidBuilder(windowInner) {
    var data = [
    {age: "0-9",male: 7,female: 7},
    {age: "10-19",male: 11,female: 12},
    {age: "20-29",male: 65,female: 62},
    {age: "30-39",male: 251,female: 373},
    {age: "40-49",male: 741,female: 993},
    {age: "50-59",male: 2265,female: 2648},
    {age: "60-69",male: 5570,female: 5886},
    {age: "70-79",male: 5878,female: 5903},
    {age: "80-89",male: 3864,female: 3383},
    {age: "90+",male: 389,female: 350}];
    var options = {
        style: {
            leftBarColor: "#229922",
            rightBarColor: "#992222"
        }
    }
    if (windowInner < 400) {
        var w = windowInner-10
    } else {
        var w = 600
    }  
    var h = 450,
        w_full = w,
        h_full = h;

    var margin = {top: 50, right: 5, bottom: 20, left: 15, middle: 20},
        sectorWidth = (w / 2) - margin.middle,
        leftBegin = sectorWidth - margin.left,
        rightBegin = w - margin.right - sectorWidth;

    w = (w- (margin.left + margin.right) );
    h = (h - (margin.top + margin.bottom));

    var style = {
        leftBarColor: '#81c784',
        rightBarColor: '#ba68c8',
        tooltipBG: '#fefefe',
        tooltipColor: 'black'
    };

    var totalPopulation = d3.sum(data, function(d) {
            return d.male + d.female;
        }),
        percentage = function(d) {
            return d / totalPopulation;
        };

    d3.select('#gender').html('')
    var styleSection = d3.select('#gender').append('style')
    .text('svg {max-width:100%} \
    .axis line,axis path {shape-rendering: crispEdges;fill: transparent;stroke: #555;} \
    .axis text {font-size: 11px;} \
    .bar {fill-opacity: 0.5;} \
    .bar.left {fill: ' + style.leftBarColor + ';} \
    .bar.left:hover {fill: ' + colorTransform(style.leftBarColor, '333333') + ';} \
    .bar.right {fill: ' + style.rightBarColor + ';} \
    .bar.right:hover {fill: ' + colorTransform(style.rightBarColor, '333333') + ';} \
    .tooltip {position: absolute;line-height: 1.1em;padding: 7px; margin: 3px;background: ' + style.tooltipBG + '; color: ' + style.tooltipColor + '; pointer-events: none;border-radius: 6px;}')

    var region = d3.select('#gender').append('svg')
        .attr('width', w_full)
        .attr('height', h_full);
        
    region.append("text")
        .attr("x", 60 ) 
        .attr("y", height-35)
        .attr("text-anchor", "middle")  
        .style("font-size", '10px')
        .style("font-family", 'sans-serif')
        .style("fill", "#9e9e9e")
        .text('Данные: СНБО');
    var legend = region.append('g')
        .attr('class', 'legend pyramid');

    legend.append('rect')
        .attr('class', 'bar left pyramid')
        .attr('x', (w / 2) - (margin.middle * 3))
        .attr('y', 12)
        .attr('width', 12)
        .attr('height', 12);

    legend.append('text')
        .attr('fill', '#000')
        .attr('x', (w / 2) - (margin.middle * 2))
        .attr('y', 18)
        .attr('class', 'pyramid')
        .attr('dy', '0.32em')
        .text('Мужчины');

    legend.append('rect')
        .attr('class', 'bar right pyramid')
        .attr('x', (w / 2) + (margin.middle * 2))
        .attr('y', 12)
        .attr('width', 12)
        .attr('height', 12);

    legend.append('text')
        .attr('fill', '#000')
        .attr('class', 'pyramid')
        .attr('x', (w / 2) + (margin.middle * 3))
        .attr('y', 18)
        .attr('dy', '0.32em')
        .text('Женщины');
    d3.select("#container .tooltip").html('')
    var tooltipDiv = d3.select("body").append("div")
        .style("opacity", 0);

    var pyramid = region.append('g')
        .attr('class', 'inner-region')
        .attr('transform', translation(margin.left, margin.top));

    // find the maximum data value for whole dataset
    // and rounds up to nearest 5%
    //  since this will be shared by both of the x-axes
    var maxValue = Math.ceil(Math.max(
        d3.max(data, function(d) {
            return percentage(d.male);
        }),
        d3.max(data, function(d) {
            return percentage(d.female);
        })
    )/0.05)*0.05;
    const t = d3.transition()
    .duration(1000)
    .delay(function(d,i){return(i*100)});

    var xScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([0, (sectorWidth-margin.middle)])
        .nice();

    var xScaleLeft = d3.scaleLinear()
        .domain([0, maxValue])
        .range([sectorWidth, 0]);

    var xScaleRight = d3.scaleLinear()
        .domain([0, maxValue])
        .range([0, sectorWidth]);
    var yScale = d3.scaleBand()
        .domain(data.map(function(d) {
            return d.age;
        }))
        .range([h, 0], 0.1);


    var yAxisLeft = d3.axisRight()
        .scale(yScale)
        .tickSize(4, 0)
        .tickPadding(margin.middle);

    var yAxisRight = d3.axisLeft()
        .scale(yScale)
        .tickSize(4, 0)
        .tickFormat('');

    var xAxisRight = d3.axisBottom()
        .scale(xScale).tickValues(makeDomain(0, maxValue,.05))
        .tickFormat(d3.format('.0%'));

    var xAxisLeft = d3.axisBottom()
        .scale(xScale.copy().range([leftBegin, 0])).tickValues(makeDomain(0, maxValue,.05))
        .tickFormat(d3.format('.0%'));

    var leftBarGroup = pyramid.append('g')
        .attr('transform', translation(leftBegin, 0) + 'scale(-1,1)');
    var rightBarGroup = pyramid.append('g')
        .attr('transform', translation(rightBegin, 0));

    pyramid.append('g')
        .attr('class', 'axis y left pyramid')
        .attr('transform', translation(leftBegin, 0))
        .call(yAxisLeft)
        .selectAll('text')
        .style('text-anchor', 'middle');

    pyramid.append('g')
        .attr('class', 'axis y right pyramid')
        .attr('transform', translation(rightBegin, 0))
        .call(yAxisRight);

    pyramid.append('g')
        .attr('class', 'axis x left pyramid')
        .attr('transform', translation(0, h))
        .call(xAxisLeft);

    pyramid.append('g')
        .attr('class', 'axis x right pyramid')
        .attr('transform', translation(rightBegin, h))
        .call(xAxisRight);

    // DRAW BARS
    leftBarGroup.selectAll('.bar.left')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar left pyramid')
        .attr('x', 0)
        .attr('width',0)
        .attr('y',0)
        .attr('height', (yScale.range()[0] / data.length) - margin.middle / 2)
        .attr("fill", 'none')
        .on("mouseover", function(d) {
            tooltipDiv.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltipDiv.html("<strong>Возраст: " + d.age + "</strong>" +
                    "<br />  Погибших: " + prettyFormat(d.male) +
                    "<br />" + (Math.round(percentage(d.male) * 1000) / 10) + "% всех")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltipDiv.transition()
                .duration(500)
                .style("opacity", 0);
        });

      leftBarGroup.selectAll(".bar.left")
          .transition().duration(10)
          .attr("fill", 'yellow')
          .delay(function(d,i){ return i * 100 })
          .attr('width', function(d) {
              return xScale(percentage(d.male));
          })
          .attr('y', function(d) {
              return yScale(d.age) + margin.middle / 4;
          })
          

    rightBarGroup.selectAll('.bar.right')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar right pyramid')
        .attr('x', 0)
        .attr('width',0)
        .attr('y',0)
        .attr('height', (yScale.range()[0] / data.length) - margin.middle / 2)
        .on("mouseover", function(d) {
            tooltipDiv.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltipDiv.html("<strong> Возраст: " + d.age + "</strong>" +
                    "<br />  Погибших: " + prettyFormat(d.female) +
                    "<br />" + (Math.round(percentage(d.female) * 1000) / 10) + "% of Total")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltipDiv.transition()
                .duration(500)
                .style("opacity", 0);
        });
    rightBarGroup.selectAll(".bar.right")
          .transition().duration(10)
          .attr("fill", 'yellow')
          .delay(function(d,i){ return i * 100 })
          .attr('width', function(d) {
              return xScale(percentage(d.female));
          })
          .attr('y', function(d) {
              return yScale(d.age) + margin.middle / 4;
          })
        
    /* HELPER FUNCTIONS */
    // string concat for translate
    function translation(x, y) {
        return 'translate(' + x + ',' + y + ')';
    }

    // numbers with commas
    function prettyFormat(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // lighten colors
    function colorTransform(c1, c2) {
        var c1 = c1.replace('#','')
            origHex = {
                r: c1.substring(0, 2),
                g: c1.substring(2, 4),
                b: c1.substring(4, 6)
            },
            transVec = {
                r: c2.substring(0, 2),
                g: c2.substring(2, 4),
                b: c2.substring(4, 6)
            },
            newHex = {};

        function transform(d, e) {
            var f = parseInt(d, 16) + parseInt(e, 16);
            if (f > 255) {
                f = 255;
            }
            return f.toString(16);
        }
        newHex.r = transform(origHex.r, transVec.r);
        newHex.g = transform(origHex.g, transVec.g);
        newHex.b = transform(origHex.b, transVec.b);
        return '#' + newHex.r + newHex.g + newHex.b;
    }

}
function hidePyramid() {
    d3.selectAll(".container-1 .bar.left")
        .transition().duration(250)
        .delay(function(d,i){ return i * 50 })
        .attr('width', function(d) {
            return 0
        })
        .attr('y', function(d) {
            return 0
        })
    d3.selectAll(".container-1 .bar.right")
        .transition().duration(250)
        .delay(function(d,i){ return i * 50 })
        .attr('width', function(d) {
            return 0
        })
        .attr('y', function(d) {
            return 0
        })
    d3.selectAll(".container-1 .pyramid")
        .transition().duration(250)
        .delay(function(d,i){ return i * 100 })
        .attr('opacity', '0')
    d3.selectAll(".container-1 .axis")
        .transition().duration(250)
        .delay(function(d,i){ return i * 100 })
        .attr('transform', 'translate(0) ')
        .attr('opacity', '0')
}