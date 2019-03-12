/* 

Data Processing
Student: Philine Wairata
Number: 10517863 

scatter.js

* Does each data point hold at least three variables, two of which can be plotted on a continuous scale?
* Does your data load as it should?
* Do you use an API?

*/


// get Data
window.onload = function() {

    console.log('test')
};

// var tourismInbound = "https://stats.oecd.org/SDMX-JSON/data/TOURISM_INBOUND/AUS+AUT+BEL+BEL-BRU+BEL-VLG+BEL-WAL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+EGY+MKD+IND+IDN+MLT+MAR+PER+PHL+ROU+RUS+ZAF.INB_ARRIVALS_TOTAL/all?startTime=2009&endTime=2017"
// var purchasingPowerParities = "https://stats.oecd.org/SDMX-JSON/data/PPPGDP/PPP.AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EA18+OECD/all?startTime=2009&endTime=2017&dimensionAtObservation=allDimensions"

// var requests = [d3.json(tourismInbound), d3.json(purchasingPowerParities)];


// Promise.all(requests).then(function (response) {
//     console.log(response.text);
//     // doFunction(response);
// }).catch(function (e) {
//     throw (e);
// });
    
    
// clean and preprocess data 


// SET SCATTERPLOT
function setGraph() {

   // Width and Height
   var w = 500;
   var h = 300;
   var padding = 30;

   var formatAsPercentage = d3.format(".1%");

   //Dynamic, random dataset
   var dataset = [];
   var numDataPoints = 50;
   var xRange = Math.random() * 1000;
   var yRange = Math.random() * 1000;
   for (var i = 0; i < numDataPoints; i++) {
       var newNumber1 = Math.round(Math.random() * xRange);
       var newNumber2 = Math.round(Math.random() * yRange);
       dataset.push([newNumber1, newNumber2]);
   }

   var xScale = d3.scale.linear()
                       .domain([0, d3.max(dataset, function(d) { return d[0]; })])
                       .range([padding, w - padding * 2]);

   var yScale = d3.scale.linear()
                       .domain([0, d3.max(dataset, function(d) { return d[1]; })])
                       .range([h - padding, padding]);

   var rScale = d3.scale.linear()
                        .domain([0, d3.max(dataset, function(d) { return d[1]; })])
                        .range([2, 5]);

   var xAxis = d3.svg.axis()
                   .scale(xScale)
                   .orient("bottom")
                   .ticks(5)  //Set rough # of ticks
                   .tickFormat(formatAsPercentage);

   //Define Y axis
   var yAxis = d3.svg.axis()
                   .scale(yScale)
                   .orient("left")
                   .ticks(5)
                   .tickFormat(formatAsPercentage);

   //Create SVG element
   var svg = d3.select("body")
               .append("svg")
               .attr("width", w)
               .attr("height", h);

   // circles
   svg.selectAll("circle")
       .data(dataset)
       .enter()
       .append("circle")
       .attr("cx", function(d) {
           return xScale(d[0]);
       })
       .attr("cy", function(d) {
           return yScale(d[1]);
       })
       .attr("r", function(d) {
           return rScale(d[1]);
       });

   // labels 
   // svg.selectAll("text")
   //     .data(dataset)
   //     .enter()
   //     .append("text")
   //     .text(function(d) {
   //         return d[0] + "," + d[1];
   //         })
   //         .attr("x", function(d) {
   //             return d[0];
   //     })
   //     .attr("y", function(d) {
   //             return d[1];
   //     })
   //     .attr("font-family", "sans-serif")
   //     .attr("font-size", "11px")
   //     .attr("fill", "red");

   // Create x as
   svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .call(xAxis);

   //Create Y axis
   svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(" + padding + ",0)")
       .call(yAxis);
};
