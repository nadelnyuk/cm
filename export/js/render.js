width = getWidth(d3.select('#graph').node().offsetWidth),
height = getHeight(d3.select('#graph').node().offsetWidth)
function getWidth(w) {
    if (w < 600) {
        return w-10
    } else {
        return 600
    }
}
function getHeight(w) {
    if (w < 600) {
        return w/1.3
    } else {
        return 450
    }
}
function getProjection(width,height) {
    if (width < 450) {var scale = 980} else {var scale = 1900}
    return d3.geoMercator()
    .scale(scale)
    .rotate([-30.02,0])
    .center([0, 50])
    .translate([width/2.2,height/3]);
}
function drawMap(g,projection) {
    return g.selectAll("path")
    .data(ukraine)
    .enter()
    .append("path")
    .transition().duration(250)
    .delay(function(d,i){ return i * 10 })
    .attr("fill", "#f5f5f5")
    .attr("stroke", "#9e9e9e")
    .attr("stroke-width", "0.5px")
    .attr("d", d3.geoPath().projection(projection) )
    .attr("class", "district");
}
function getRadius(width,id) {
    if (width < 450 || id == 2) {var radiusMaxValue = 4} else {var radiusMaxValue = 8}
    if (id == 3) {
        var values = export_json.filter(d => d.pop <= 50000).map(d=>d.pop)
    } else {
        var values = export_json.map(d => d.per1000)
    }
    return d3.scaleLinear()
        .domain([d3.min(values), d3.max(values)])
        .range([1,radiusMaxValue]) 
}
function drawCircles(projection,radiusSize,id,tooltipBee) {
    var svg = d3.select(".container-1 #graph svg")
    var cities_mer = svg.append("g").attr('class','cities_mer');
    cities_mer.selectAll(".container-1 circle")
        .data(export_json)
        .enter()
        .append("circle")
        .attr("fill", 'none')
        .attr("stroke-width", ".5px")
        .attr("r", 0)
        .attr("cx", function(d){ 
            return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0] 
        })
        .attr("cy", function(d){ return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1] })
        .attr("class", "dot")
        .on("mouseover", function(d) {
            tooltipBee.html(
                '<h4>'+d.id.split('_')[0]+', '+d.id.split('_')[1]+'</h4>'+
                '<p>'+numberWithSpaces(d.pop)+' жителей</p>'+
                '<p>'+numberWithSpaces(d.deaths)+' погибших</p>'+
                '<p>'+numberWithSpaces(d.per1000)+' погибших на 1000 жителей</p>'
                )
            tooltipBee.style("visibility", "visible")
        })
        .on("mousemove", function() {
            return tooltipBee.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
        })
        .on("mouseout", function(d){
            return tooltipBee.style("visibility", "hidden");
        });
    if (id == 2) {
        var values = export_json.map(d => d.per1000)
        var color = d3.scaleThreshold()
            .domain(makeDomain(0,d3.max(values),.4))
            .range(["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#99000d"]);
        cities_mer.selectAll(".container-1 circle")
            .transition().duration(100)
            .delay(function(d,i){ return i * 2 })
            .attr("r",function(d) { return radiusSize(d.per1000) })
            .attr("stroke", "none")
            .attr("fill", function(d){ 
                if (d.per1000 > 2) {
                    return color(d.per1000)
                } else {
                    return 'none'
                }
            })
    } else if (id == 1) {
        d3.selectAll(".container-1 circle")
            .transition().duration(1000)
            .delay(function(d,i){ return i * 5 })
            .attr("stroke", "#00838f")
            .attr("fill", '#4dd0e1')
            .attr("r",function(d) { return radiusSize(d.per1000) })
    }
    
}
function mapZooming(id,zoom) {
    if (id == 1) {
        var city = [31.1,49.96],
            delta_height = 3,
            svgScale = 1
    } else if (id == 2) {
        var city = [25.7704167, 48.4413013],
            delta_height = 1,
            svgScale = 2.4
    } else if(id == 3) {
        var city = [31.1,48.96],
            delta_height = 2,
            svgScale = 1
    }
    function transform(x,y,scale) {
        return d3.zoomIdentity
            .translate(width/2, height / delta_height)
            .scale(scale) 
            .translate(-x,-y);
        
    }
    var projection = getProjection(width,height)
    var coordinates = projection(city);
    
    var svg = d3.select(".container-1 #graph svg .ukraine_map")
    svg.transition()
        .delay(50)
        .duration(1000)
        .call(zoom.transform, transform(coordinates[0],coordinates[1],svgScale))
}
function drawDots(width,index){
    var amount = [130,500,494,570,700]
    var peopleAmount = [616835,109112,50000]
    var data = []
    var position = makeDomain(0,amount.slice(index,index+1),1)
    var cyValue = 10

    var svg = d3.select(".container-1 #graph svg")
    var dots = document.getElementsByClassName('death_dots')
    
    if (width < 600){
        var heightSVG = 1000
        svg.attr('height',650)
        var maxValue = Math.round((100) / 14)
        var cxValues = [25,50,90,130,150]
    } else {
        //var heightSVG = (data[data.length-1].y*3);
        var heightSVG = 1200
        var maxValue = Math.round((100) / 10)
        var cxValues = [25,65,120,175,225]
    }
    var cxValue = cxValues.slice(index,index+1)
    var cxValue_copy = $.extend( true, {}, cxValues.slice(index,index+1) );
    if(dots.length == 0) {
        var g = svg.append("g").attr('class','death_dots index'+String(index)).attr('width',width);
    } else if(dots.length != 0 && index != 0) {
        var g = svg.append("g").attr('class','death_dots index'+String(index)).attr('width',width).attr('transform','translate('+cxValue_copy[0]+',0)');
    } else {
        var g = d3.select('.death_dots');
        g.selectAll(".disappear5")
            .transition().duration(200)
            .delay(function(d,i){ return i  })
            .attr("r", 4)
    }
    var points_values = [
            {from:0,to:130,name:'Погибло в ООС',color:'#f44336',stroke:'#b71c1c'},
            {from:0,to:500,name:'Погибло от COVID',color:'#f44336',stroke:'#b71c1c'},
            {from:0,to:494,name:'Эвакуировали из Припяти',color:'#f44336',stroke:'#b71c1c'},
            {from:0,to:570,name:'Посетителей Книжного Арсенала в 2019',color:'#f44336',stroke:'#b71c1c'},
            {from:0,to:700,name:'Вместимость Олимпийского',color:'#f44336',stroke:'#b71c1c'}
    ]
    var points = points_values.slice(index,index+1)
    
    position.map(function(d,i) {
        if (i % maxValue == 0) {
            cyValue += 5
            cxValue = cxValue_copy[0]
        } else {
            cxValue += 10//14
        }
        var point = points.filter(d=> i >= d.from && i < d.to)
        /* if (index == 2) {
            console.log(point)
        } */
        
        data.push({x:cxValue,y:cyValue,color:point[0].color,stroke:point[0].stroke,name:point[0].name})
    })
    g.append("text")
        .attr("x", cxValue_copy[0]-10) 
        .attr("y", 10)
        .attr("text-anchor", "start")
        .style("font-size", '12px')
        .style("font-weight", 'bold')
        .style("font-family", 'sans-serif')
        .text(points[0].name);

    
    var x = d3.scaleLinear()
        .domain([0, 110])
        .range([0, 100]); 
    var y = d3.scaleLinear()
        .domain([0, 700])
        .range([0, heightSVG]);
    g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
            .attr("fill", function(d){ return d.color })
            .attr("stroke", function(d){ return d.stroke })
            .attr("id", function(d,i){ return 'c'+String(i) })
            //.attr("class", function(d,i){ if (i>amount[1]) return 'disappear5'})
            .attr("cx", function(d){ return x(d.x) })
            .attr("cy", function(d){ return y(d.y) })
            .transition().duration(200)
            .delay(function(d,i){ return i * 2 })
            .attr("r", 4)
   /*  var legend = g.append("g")
        .attr("font-family", "Georgia")
        .attr("font-size", 10)
        .selectAll("g")
        .data(points)
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 12 + ")"; });
    var color = d3.scaleOrdinal()
        .domain(points.map(d=>d.name))
        .range(points.map(d=>d.color))
    var stroke = d3.scaleOrdinal()
        .domain(points.map(d=>d.name))
        .range(points.map(d=>d.stroke))
    legend.append("circle")
        .attr("cx", 25)
        .attr("cy", heightSVG-60)
        .attr("r", 4)
        .attr("fill", function(d) {return color(d.name)})
        .attr("stroke", function(d) {return stroke(d.name)});
    legend.append("text")
        .attr("x", 35)
        .attr("y", heightSVG-60)
        .attr("dy", "0.32em")
        .text(function(d) { return d.name; }); */
    /* var annotations = [{
        note: {
            title: 'Одна точка -- 500 смертей',
            wrap: 190,
            x: 20,
            align: "left"
        },
        color: 'black',
        x: 50, y: y(30),
        dy: 0,
        dx: 50
    }]
    const makeAnnotations = d3.annotation()
        .editMode(false)
        .notePadding(-7)
        .type(d3.annotationLabel)
        .annotations(annotations)
    d3.select(".container-1 #graph svg .death_dots")
        .append("g")
        .style('font-size','14px')
        .style('font-family','sans-serif')
        .call(makeAnnotations) */
    }
    function drawBarChart(w) {
        if (w < 400) {
            var start_width = w-10,
            start_height = 600;
        } else {
            var start_width = 600,
            start_height = 400;
        }  
        var data = [
            {"reason":"Болезни сердца", "value": 408721},
            {"reason":"Рак", "value": 77862},
            {"reason":"Внешние причины", "value": 28062},
            {"reason":"Болезни пищеварения", "value": 24215},
            {"reason":"COVID-19", "value": 20709},
            {"reason":"Не определено", "value": 20087},
            {"reason":"Болезни органов дыхания", "value": 16705},
            {"reason":"Инфекционные болезни", "value": 6822},
            {"reason":"Другое", "value": 13627}
        ]
        var margin = {top: 20, right: 10, bottom: 40, left: 140},
            width = start_width - margin.left - margin.right,
            height = start_height - margin.top - margin.bottom;

        var svg = d3.select(".container-1 #graph svg")
        svg.attr('height',600)
        var dots = document.getElementsByClassName('death_reason')
        if (dots.length == 0) {
            var g = svg.append("g").attr('class','death_reason');
            g.attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
                var x = d3.scaleLinear()
                .domain([0, 409721])
                .range([ 0, width]);
            g.append("g")
                .attr("transform", "translate(0," + height + ")")
                .attr("id", "xAxis")
                .call(d3.axisBottom(x).tickValues(makeDomain(0,450000,100000)))
                
    
            var y = d3.scaleBand()
                .range([ 0, height ])
                .domain(data.map(function(d) { return d.reason; }))
                .padding(.3);
            g.append("g")
                .attr("id", "yAxis")   
                .call(d3.axisLeft(y))
    
            //Bars
            g.selectAll("mybar")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", x(0) )
                .attr("y", function(d) { return y(d.reason); })
                .attr("height", y.bandwidth() )
                .attr("fill", function(d) {
                    if (d.reason == 'COVID-19') {
                        return '#99000d'
                    } else {
                        return "#4dd0e1"
                    }
                })
                .transition().duration(500)
                .delay(function(d,i){ return i * 100 })
                .attr("width", function(d) { return x(d.value); })
                
                
            g.selectAll("mybar")
                .data(data)
                .enter()
                .append("svg:text")
                .attr('class','value_text')
                .text(function(d,i){
                    return numberWithSpaces(d.value)
                })
                .attr("y", function(d,i) { return y(d.reason)+18; })
                .attr("x", function(d,i) { 
                    if (x(d.value) < 55) {
                        return x(d.value)+26; 
                    } else{ 
                        return x(d.value)-30; 
                    }  
                })
                .attr("text-anchor","middle")
                .attr('font-family','Arial')
                .attr('fill',function(d,i) { 
                    if (x(d.value) < 55) {
                        return 'black'
                    } else if (d.reason == 'COVID-19') {
                        return '#99000d'
                    } else { 
                        return 'white'
                    }  
                })
                .attr('font-size','14px');
        } else {
            updateBarChart(w,data)
        }
        
        

    }
    var winterData = [
        {"reason":"Болезни сердца", "value": 71638},
        {"reason":"Рак", "value": 11797},
        {"reason":"COVID-19", "value": 6936},
        {"reason":"Внешние причины", "value": 4634},
        {"reason":"Болезни пищеварения", "value": 4137},
        {"reason":"Болезни органов дыхания", "value": 3457},
        {"reason":"Не определено", "value": 3343},
        {"reason":"Инфекционные болезни", "value": 1030},
        {"reason":"Другое", "value": 2136}
    ]
    function updateBarChart(w,data) {
        if (w < 400) {
            var start_width = w-10,
            start_height = 600;
        } else {
            var start_width = 600,
            start_height = 400;
        }  
        var margin = {top: 20, right: 10, bottom: 40, left: 140},
            width = start_width - margin.left - margin.right,
            height = start_height - margin.top - margin.bottom;
        var svg = d3.select(".container-1 #graph svg")
        svg.attr('height',600)
        var dots = document.getElementsByClassName('death_reason')
        if(dots.length == 0) {
            //var g = svg.append("g").attr('class','death_reason');
            drawBarChart(width)
            //var g = svg.select('.death_reason');
        } else {
            var g = svg.select('.death_reason');
        }
        var values = data.map(d=>d.value)
        if (String(d3.max(values)).length == 5) {
            var step = 10000
        } else {
            var step = 100000
        }
        var x = d3.scaleLinear()
            .domain([0, d3.max(values)])
            .range([ 0, width]);
            
        g.selectAll('#xAxis')
            .transition().duration(1000)
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickValues(makeDomain(0,d3.max(values),step)))

        var y = d3.scaleBand()
            .range([ 0, height ])
            .domain(data.map(function(d) { return d.reason; }))
            .padding(.3);
        g.selectAll("#yAxis")
            .transition().duration(800)
            .delay(function(d,i){ return i * 100 })
            .call(d3.axisLeft(y)) 
        g.selectAll('rect')
            .transition().duration(800)
            .attr("width", function(d,i) {return x(data.filter(v=>v.reason == d.reason)[0].value); })
            .attr("x", x(0))
            .attr("fill", function(d) {
                if (data.filter(v=>v.reason == d.reason)[0].reason == 'COVID-19') {
                    return '#99000d'
                } else {
                    return "#4dd0e1"
                }
            })
            .attr("y", function(d,i) { return y(data.filter(v=>v.reason == d.reason)[0].reason); })
            .attr("height", y.bandwidth())
            
        g.selectAll('.value_text')
            .transition().duration(800)
            .text(function(d,i){
                return numberWithSpaces(data.filter(v=>v.reason == d.reason)[0].value)
            })
            .attr("y", function(d,i) { return y(data.filter(v=>v.reason == d.reason)[0].reason)+18; })
            .attr("x", function(d,i) { 
                if (x(data.filter(v=>v.reason == d.reason)[0].value) < 55) {
                    return x(data.filter(v=>v.reason == d.reason)[0].value)+26; 
                } else{ 
                    return x(data.filter(v=>v.reason == d.reason)[0].value)-30; 
                }  
            })
            .attr('fill',function(d,i) { 
                if (x(data.filter(v=>v.reason == d.reason)[0].value) < 55) {
                    return 'black'
                } else if (data.filter(v=>v.reason == d.reason)[0].reason == 'COVID-19') {
                    return '#99000d'
                } else { 
                    return 'white'
                }  
            })
    }