/*
Name: Philine Wairata
Number: 10517863  
*/

var data;
var json;
var id;
migrData = [];

// Get json data from file
$.getJSON("data.json", function(json) {
    
    // sent data to be processed
    processData(json);
});

function processData(json){
    var data = json;
    transformData(data);
    return data;
}

function transformData(data){

    var immigrationArray = [];

    Object.keys(data.value).forEach(function(d) {

        // take year values and clean string from last 4 characters
        var periode = data.value[d]["Perioden"];
        periode = periode.slice(0, periode.length -4);
        

        // take value population growth netherlands.
        var nedBevolkingsGroei = data.value[d]["TotaleBevolkingsgroei_60"];

        var births = data.value[d]["Levendgeborenen_54"];
        var deaths = data.value[d]["Overledenen_55"];

        // take values for indonesian migration
        var immigratieGeboorteland = data.value[d]["Indonesie_142"];
        var emmigratieGeboorteland = data.value[d]["Indonesie_152"];

        var immigratieLandvanHerkomst = data.value[d]["Indonesie_163"];
        var emigratieLandvanHerkomst = data.value[d]["Indonesie_173"];

        // calculate immigration and emmigration total for indo to netherlands
        var immigratieIndoTotaal = immigratieGeboorteland + immigratieLandvanHerkomst;
        var emmigratieIndoTotaal = emmigratieGeboorteland + emigratieLandvanHerkomst;
        var migratieSaldoIndo = immigratieIndoTotaal - emmigratieIndoTotaal;
        
        var indoNedBevolkingsgroei = migratieSaldoIndo / nedBevolkingsGroei * 100;

        // if more people migrate then immigrate set indo migrate saldo to 0.
        if (indoNedBevolkingsgroei < 0) {
            indoNedBevolkingsgroei = 0
        };

        // calculate other influences on growth population; birth, deaths, etc.
        var otherfactors = nedBevolkingsGroei - migratieSaldoIndo;
        
        // make arrays for charts
        immigrationArray.push({Time: periode,migr:{immi: immigratieIndoTotaal, emmi: emmigratieIndoTotaal, other: otherfactors}});

    });

        var migrData = immigrationArray;
        
        
        // set chart
        setCharts('#linkedviews',migrData);
        return migrData;
};


// Set barchart and piechart with migration data
function setCharts(id, migrData){

    
    function colors(c){ return {immi:"#ef8a62", emmi:"#f7f7f7", other:"#67a9cf"}[c]; }
    
    // set total population growth
    migrData.forEach(function(d){d.total= d.migr.immi + d.migr.emmi + d.migr.other });
    
    
    // function for barchart
    function setBar(fD){
        var barColor = 'darkred';
        var bar={},    
        barDim = {t: 60, r: 0, b: 30, l: 0};
        barDim.w = 500 - barDim.l - barDim.r, 
        barDim.h = 300 - barDim.t - barDim.b;
      
        var barsvg = d3.select(id)
                      .append("svg")
                      .attr("width", barDim.w + barDim.l + barDim.r)
                      .attr("height", barDim.h + barDim.t + barDim.b).append("g")
                      .attr("transform", "translate(" + barDim.l + "," + barDim.t + ")");

        var x = d3.scale.ordinal()
                        .rangeRoundBands([0, barDim.w], 0.1)
                        .domain(fD.map(function(d) { return d[0]; }));

        barsvg.append("g")
             .attr("class", "x axis")
             .attr("transform", "translate(0," + barDim.h + ")")
             .call(d3.axisBottom(x));

        var y = d3.scale.linear()
                        .range([barDim.h, 0])
                        .domain([0, d3.max(fD, function(d) { 
                            if (d[1] < 0) { return 0; }
                            else { return d[1]; }
                            })]);

        var bars = barsvg.selectAll(".bar")
                        .data(fD).enter()
                        .append("g")
                        .attr("class", "bar");
        
        bars.append("rect")
            .attr("x", function(d) { return x(d[0]); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("width", x.rangeBand())
            .attr("height", function(d) { 
                if (d[1] < 0) { return barDim.h; }
                else  { return barDim.h - y(d[1]);} })
            .attr('fill',barColor)
            .on("mouseover",mouseover)
            .on("mouseout",mouseout);
       
        bars.append("text")
            .text(function(d){ return d3.format(",")(d[1])})
            .attr("x", function(d) { return x(d[0]) + x.rangeBand() / 2; })
            .attr("y", function(d) { return y(d[1]) -5; })
            .attr("text-anchor", "emmidle");

        function mouseover(d){  
            var st = migrData.filter(function(s){ return s.Time == d[0];})[0],
                nD = d3.keys(st.migr).map(function(s){ return {type:s, migr:st.migr[s]};});
                 
            pie.update(nD);
            lg.update(nD);
        }
        
        function mouseout(d){      
            pie.update(migrationValues);
            lg.update(migrationValues);
        }
        
        // update bar when hover
        bar.update = function(nD, color){
            
            y.domain([0, d3.max(nD, function(d) { return d[1]; })]);
            
            var bars = barsvg.selectAll(".bar")
                            .data(nD);
            
            bars.select("rect")
                .transition()
                .duration(500)
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return barDim.h - y(d[1]); })
                .attr("fill", color);

            bars.select("text")
                .transition()
                .duration(500)
                .text(function(d){ return d3.format(",")(d[1])})
                .attr("y", function(d) { return y(d[1]) -5; });            
        }        
        return bar;
    }
    
    // function for piechart.
    function setPie(dataPie){
        var pie ={},    
        pieDim ={w:250, h: 250};
        pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;
                
        var piesvg = d3.select(id)
                       .append("svg")
                       .attr("width", pieDim.w).attr("height", pieDim.h)
                       .append("g")
                       .attr("transform", "translate("+pieDim.w / 2 +","+pieDim.h / 2+")");

                       piesvg.append('g').attr('class', 'labelName');
        
        var arc = d3.arc()
                    .outerRadius(pieDim.r - 10)
                    .innerRadius(0);

        var pie = d3.layout.pie()
                           .sort(null)
                           .value(function(d) { return d.migr; });

        piesvg.selectAll("path")
              .data(pie(dataPie))
              .enter()
              .append("path")
              .attr("d", arc)
              .each(function(d) { this._current = d; })
              .style("fill", function(d) { return colors(d.data.type); })
              .on("mouseover",mouseover)
              .on("mouseout",mouseout);

        pie.update = function(nD){
            piesvg.selectAll("path")
            .data(pie(nD))
            .transition()
            .duration(500)
            .attrTween("d", animatePie);
        }        
 
        function mouseover(d){
            bar.update(migrData.map(function(v){ 
                return [v.Time,v.migr[d.data.type]];}),colors(d.data.type));
        }
        
        function mouseout(d){
            bar.update(migrData.map(function(v){
                return [v.Time,v.total];}), barColor);
        }

        // function to animate the pie parts
        function animatePie(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) { return arc(i(t)); };
        }    
        return pie;
    }
    
    // function for legend
    function setLegend(legendData){
        var lg = {};
            
        var legend = d3.select(id)
                       .append("table")
                       .attr('class','legend');


        var tr = legend.append("tbody")
                       .selectAll("tr")
                       .data(legendData)
                       .enter()
                       .append("tr");
            
        // first column
        tr.append("td")
          .append("svg")
          .attr("width", '16')
          .attr("height", '16')
          .append("rect")
          .attr("width", '16')
          .attr("height", '16')
		  .attr("fill",function(d){ return colors(d.type); });
            
        // second column
        tr.append("td")
          .text(function(d){ return d.type;});

        // third column 
        tr.append("td")
          .attr("class",'legendmigr')
          .text(function(d){ return d3
          .format(",")(d.migr);});

        // fourth column
        tr.append("td")
          .attr("class",'legendPerc')
          .text(function(d){ return getLegend(d,legendData);});

        lg.update = function(nD){
            var l = legend.select("tbody")
                          .selectAll("tr")
                          .data(nD);

            l.select(".legendmigr")
             .text(function(d){ return d3
             .format(",")(d.migr); });

            l.select(".legendPerc")
             .text(function(d){ return getLegend(d,nD); });        
        }
        
        // return percentages for legend
        function getLegend(d,aD){ 
            return d3.format("%")(d.migr/d3.sum(aD.map(function(v){ return v.migr; })));
        }

        return lg;
    }
    
    // set migration values (for legend and pie chart)
    var migrationValues = ['immi','emmi','other'].map(function(d){ 
        return {type:d, migr: d3.sum(migrData.map(function(t){ return t.migr[d]; }))}; 
    });    
    
    // set population growth per year (for barchart)
    var barValues = migrData.map(function(d){ return [d.Time,d.total]; });
    
    // set all charts
    var bar = setBar(barValues), 
        pie = setPie(migrationValues), 
        lg= setLegend(migrationValues);  
}