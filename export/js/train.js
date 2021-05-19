function drawTrain() {
    var dataset = [10,10,10,10,10];

    //Width and height
    var w = 600;
    var h = 200;

    //Create SVG Element
    var svg = d3.select(".container-1 #graph svg")
        /* .append("svg")
        .attr("width", w)
        .attr("height", h); */

    //Import the plane
    d3.xml("ukr subway.svg", function(xml) {  
        var importedNode = document.importNode(xml.documentElement, true);
        svg.selectAll("g")
            .data(dataset)
            .enter()
            .append("g")
            .attr('class','trains')
            .attr("transform", function(d, i){ 
                return "translate(" + -200 + "," + 50   + ")"+"scale("+ 0.115 +")";
            })
            .each(function(d, i){ 
                var plane = this.appendChild(importedNode.cloneNode(true)); 
                d3.select(plane).select("path").attr("fill", "blue");
            })
        d3.selectAll('.trains')
            .transition()
            .duration(1)
            .attr("transform", function(d, i){ 
                return "translate(" + -200 + "," + 50   + ")"+"scale("+ 0.115 +")";
            })
            .transition()
            .duration(2000)
            .attr("transform", function(d, i){ 
                return "translate(" + (i * (w / dataset.length)) + "," + 50   + ")"+"scale("+ 0.115 +")";
            })  
    });
}
function animateTrain(timesValue) {
    var dataset = [10,10,10,10,10];

    //Width and height
    var w = 600;
    var h = 200;

    //Create SVG Element
    var svg = d3.select(".container-1 #graph svg")
        /* .append("svg")
        .attr("width", w)
        .attr("height", h); */

    //Import the plane
    d3.xml("ukr subway.svg", function(xml) {  
        var importedNode = document.importNode(xml.documentElement, true);
        svg.selectAll("g")
            .data(dataset)
            .enter()
            .append("g")
            .attr('class','trains')
            .attr("transform", function(d, i){ 
                return "translate(" + -1000 + "," + 50   + ")"+"scale("+ 0.115 +")";
            })
            .each(function(d, i){ 
                var plane = this.appendChild(importedNode.cloneNode(true)); 
                d3.select(plane).select("path").attr("fill", "blue");
            })
        repeat()         
    });
    
    function repeat(){
        if (timesValue*330 < 50000) {
            d3.selectAll('.trains')
                .transition()
                .duration(1)
                .attr("transform", function(d, i){ 
                    return "translate(" + -1000 + "," + 50   + ")"+"scale("+ 0.115 +")";
                })
                .transition()
                .duration(2000)
                .attr("transform", function(d, i){ 
                    return "translate(" + (i * (w / dataset.length)) + "," + 50   + ")"+"scale("+ 0.115 +")";
                })
                .transition()
                .duration(1200)
                .attr("transform", function(d, i){ 
                    return "translate(" + (i * (w / dataset.length)+1000) + "," + 50   + ")"+"scale("+ 0.115 +")";
                })
                .transition()
                .duration(1)
                .on("end", repeat)
            timesValue += 1
            if (timesValue != 0 && timesValue != -1) {
                d3.select('#graph_text').html('<span id="train_number">'+numberWithSpaces(timesValue*330)+'</span> человек проехали в вагонах</div>')
            }   
        } else {
            d3.selectAll('.trains')
                .transition()
                .duration(2000)
                .attr("transform", function(d, i){ 
                    return "translate(" + (i * (w / dataset.length)) + "," + 50   + ")"+"scale("+ 0.115 +")";
                })
        }
        
    }
}