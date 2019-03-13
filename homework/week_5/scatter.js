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

    getRequest();
};

function getRequest() {
    var tourismInbound = "https://stats.oecd.org/SDMX-JSON/data/TOURISM_INBOUND/AUS+AUT+BEL+BEL-BRU+BEL-VLG+BEL-WAL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+EGY+MKD+IND+IDN+MLT+MAR+PER+PHL+ROU+RUS+ZAF.INB_ARRIVALS_TOTAL/all?startTime=2009&endTime=2017"
    var purchasingPowerParities = "https://stats.oecd.org/SDMX-JSON/data/PPPGDP/PPP.AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EA18+OECD/all?startTime=2009&endTime=2017&dimensionAtObservation=allDimensions"
    var gdp = "https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EA19+EU28+OECD+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+ROU+RUS+SAU+ZAF.B1_GA.C/all?startTime=2012&endTime=2018&dimensionAtObservation=allDimensions"

    var requests = [d3.json(gdp)];

    Promise.all(requests).then(function(data) {
        // console.log(data);
        transformResponse(data);
    }).catch(function(e){
        throw(e);
    });
};

function transformResponse(data){

    // Save data
    let originalData = data[0];

    // access data
    let dataHere = data[0].dataSets[0].observations;
    // console.log(dataHere);

    // access variables in the response and save length for later
    let series = data[0].structure.dimensions.observation;
    // console.log(series);

    let seriesLength = series.length;
    // console.log(seriesLength);

    // get the time periods in the dataset
    let observation = data[0].structure.dimensions.observation[3].values;
    // console.log(observation);

    observation.forEach(function(time_period){
        // console.log(time_period.name);
    });


    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);
    // console.log(varArray);
    // console.log("test");

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);
    // console.log(strings);

    // set up output array, an array of objects, each containing a single datapoint
    // and the descriptors for that datapoint
    let dataObject = {};

    // for each string that we created
    strings.forEach(function(string){
        Object.keys(observation).forEach(function(obs){
            // console.log(observation[obs])
            let data = dataHere[string];
            if (data != undefined){

                // set up temporary object
                let tempObj = {};

                // split string into array of elements seperated by ':'
                let tempString = string.split(":")
                tempString.forEach(function(s, index){
                    tempObj[varArray[index].name] = varArray[index].values[s].name;
                });

                tempObj["Datapoint"] = data[0];

                // Add to total object
                if (dataObject[tempObj["Country"]] == undefined){
                  dataObject[tempObj["Country"]] = [tempObj];
                } else if (dataObject[tempObj["Country"]][dataObject[tempObj["Country"]].length - 1]["Year"] != tempObj["Year"]) {
                    dataObject[tempObj["Country"]].push(tempObj);
                };

            }
        });
    });
    // return the finished product!
    preprocesData(dataObject); 
}

function preprocesData (dataObject) {
    // console.log(dataObject);

    var dataSet1 = []
    var colorArray = []

    Object.keys(dataObject).forEach(function(obj){
        // console.log(dataObject[obj]);
        let countryObject = dataObject[obj];

        Object.keys(countryObject).forEach(function(cobj) {
            
            let datacleaned = countryObject[cobj];

            let country = datacleaned["Country"];
            let year = datacleaned["Year"];
            let datapoint = datacleaned["Datapoint"];

            colorArray.push(country);
            dataSet1.push([country,year,datapoint]);

        });
    });
    setGraph(dataSet1, colorArray);
};
    


// SET SCATTERPLOT
function setGraph(dataSet1, colorArray) {
 
   var dataset = dataSet1;

   // Width and Height
   var w = 500;
   var h = 300;
   var padding = 30;

//    var formatAsPercentage = d3.format(".1%");

   // Dynamic, random dataset
//    var dataset = [];
//    var numDataPoints = 50;
//    var xRange = 4;
//    var yRange = Math.random() * 1000;
//    var colorArray = ['Australian','Belgium','Chech Republic'];
//    for (var i = 0; i < numDataPoints; i++) {
//        var newNumber1 = Math.round(Math.random() * xRange);
//        var newNumber2 = Math.round(Math.random() * yRange);
//        var newNumber3 = colorArray[Math.floor(Math.random() * colorArray.length)];
//        dataset.push([newNumber1, newNumber2, newNumber3]);
//    }

   var legend = d3.scaleOrdinal()
                    .domain([0, d3.max(dataset, function(d) { return d[0]; })])
                    .range([0, d3.max(dataset, function(d) { return d[0]; })]);

    
    var color = d3.scaleOrdinal(d3.schemeCategory10);



   var xRange = d3.scaleOrdinal()
                  .domain([0, d3.max(dataset, function(d) { return d[1]; })])
                  .range([0, 400]);
   
    var yRange = d3.scaleOrdinal()
                    .domain([0, d3.max(dataset, function(d) { return d[2]; })]);
 


   // xscale time
   var xScale = d3.scaleLinear()
                       .domain([d3.min(dataset, function(d) { return d[1]; }), d3.max(dataset, function(d) { return d[1]; })])
                       .range([padding, w - padding * 2]);
   // yscale datapoint
   var yScale = d3.scaleLinear()
                       .domain([d3.min(dataset, function(d) { return d[2]; }), d3.max(dataset, function(d) { return d[2]; })])
                       .range([h - padding, padding]);

   var rScale = d3.scaleLinear()
                        .domain([0, d3.max(dataset, function(d) { return d[2]; })])
                        .range([2, 5]);


   var xAxis = d3.axisBottom(xRange)
                   .scale(xScale)
                   .ticks(5);  //Set rough # of ticks.tickFormat(formatAsPercentage);
                //    .tickFormat(formatAsPercentage);

   //Define Y axis
   var yAxis = d3.axisLeft(yRange)
                   .scale(yScale)
                   .ticks(5);
                //    .tickFormat(formatAsPercentage);


   //Create SVG element
   var svg = d3.select("body")
               .append("svg")
               .attr("width", w)
               .attr("height", h);


   // NOTE: MAKE CIRCLES SAMES SIZE
   svg.selectAll("circle")
       .data(dataset)
       .enter()
       .append("circle")
       .attr("cx", function(d) {
           return xScale(d[1]);
       })
       .attr("cy", function(d) {
           return yScale(d[2]);
       })
       .attr("r", function(d) {
           return rScale(d[2]);
       })
       .style("fill", function(d) {
        console.log(color(d[0]))
        console.log(d);
        return color(d[0])
        });

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

    
    // colors and legend
    var legendWidth = 500;
   
    var legend = svg.selectAll(".legend")
                    .data(legend.domain())
                    .enter()
                    .append("g")
                    .attr("class", "legend1")
                    .attr("transform", function(d, i) {
                        return "translate(0," + i * 20 + ")"; 
                    });

    legend.append("rect")
            .attr("x", legendWidth + 10)
            .attr("width", 12)
            .attr("height", 12)
            .style("fill", function(d, i) {
                return color(d[0]);
            })


    legend.append("text")
        .attr("x", legendWidth + 26)
        .attr("dy", ".65em")
        .text(function(d) {
            return color(d[0]);
        })
        .attr("class", "textselected")
        .style("text-anchor", "start")
        .style("font-size", 15);
   

    // update graph for the user to choose betweeen data sets
};
