const range = (start, stop, step = 1) =>
        Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)
function makeDomain(min, max, step) {
    return range(min, max, step)
}
function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
function createFirstPicture() {
    var dataset = [10,10,10,10,10];
    var dataset = makeDomain(0, 10*561,10)
        //Width and height
    
    var h = 310;
    if (window.innerWidth < 800) {
        var w = window.innerWidth-10
    } else {
        var w = 800
    }
        //Create SVG Element
    var svg = d3.select("#first_picture")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var y = 10
    var index = 0
    d3.xml("human.svg", function(xml) {  
        var importedNode = document.importNode(xml.documentElement, true);
        svg.selectAll("g")
            .data(dataset)
            .enter()
            .append("g")
            .attr("transform", function(d, i){ 
                if (i % 51 == 0) {
                    y += 25
                    index = 0
                } else {
                    index += 1
                }
                return "translate(" + (index * 15) + "," + y + ")"+"scale("+ 0.09 +")";
            })
            .each(function(d, i){ 
                var plane = this.appendChild(importedNode.cloneNode(true)); 
                d3.select(plane).select("path").attr("fill", "blue");
            })
        svg.selectAll('#first_picture path')
            .attr('fill','black')
    
    });
}