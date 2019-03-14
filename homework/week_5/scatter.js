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

var purchasingPowerParities = "https://stats.oecd.org/SDMX-JSON/data/PPPGDP/PPP.AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EA18+OECD/all?startTime=2009&endTime=2017&dimensionAtObservation=allDimensions"
var gdp = "https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EA19+EU28+OECD+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+ROU+RUS+SAU+ZAF.B1_GA.C/all?startTime=2012&endTime=2018&dimensionAtObservation=allDimensions"
    
    var request_gdp = [d3.json(gdp)];
    var request_power = [d3.json(purchasingPowerParities)];

    Promise.all(request_gdp, request_power).then(function(data) {
        //console.log(data);

        // document.getElementById("changeButton").onclick = function () {
        //     // var svg = d3.select("svg");
        //     // svg.selectAll("*").remove();
        //     transformPPResponse(data);
        // }

        transformResponse(data);
        // transformPPResponse(data);

        
    }).catch(function(e){
        throw(e);
    });
};

function transformResponse(data){

    // access data
    let dataHere = data[0].dataSets[0].observations;
  

    // access variables in the response and save length for later
    let series = data[0].structure.dimensions.observation;

    // get the time periods in the dataset
    let observation = data[0].structure.dimensions.observation[3].values;

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // add time periods to the variables
    varArray.push(observation);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);

    let dataObject = {};

    // for each string that we created
    strings.forEach(function(string){
        Object.keys(observation).forEach(function(){
            // console.log(observation[obs])
            let data = dataHere[string];
            if (data != undefined){

                // set up temporary object
                let tempObj = {};

                // split string into array of( elements seperated by ':'
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
    preprocesDataGDP(dataObject); 
}


function transformPPResponse(data){

    // access data property of the response
    let dataHere = data[0].dataSets[0].observations;

    // access variables in te response and save length for later
    let series = data[0].structure.dimensions.observation;


    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // get the time periods in the dataset
    let observation_1 = data[0].structure.dimensions.observation[2].values;

    // add time periods to the variables
    varArray.push(observation_1);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);
    
    let dataObject = {};

    // for each string that we created
    strings.forEach(function(string){
        // for each observation and its index
        Object.keys(observation_1).forEach(function(obs){
            //console.log(observation_1[obs]);
            let data = dataHere[string];
            if (data != undefined){

                // set up temporary object
                let tempObj = {};

                let tempString = string.split(":").slice(0, -1);
                tempString.forEach(function(s, indexi){
                    tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
                });

                // every datapoint has a time and ofcourse a datapoint
                tempObj["Time"] = observation_1[obs].name;
                tempObj["Datapoint"] = data[0];
                tempObj["Indicator"] = series[0].values[0].name;

                // Add to total object
                if (dataObject[tempObj["Country"]] == undefined){
                  dataObject[tempObj["Country"]] = [tempObj];
                } else {
                  dataObject[tempObj["Country"]].push(tempObj);
                };
            }
        });
    });

    // return the finished product!
    preprocesDataPowerP(dataObject);
}

function preprocesDataGDP (dataObject) {
    // console.log(dataObject);

    var dataset = []

    Object.keys(dataObject).forEach(function(obj){
        // console.log(dataObject[obj]);
        let countryObject = dataObject[obj];

        Object.keys(countryObject).forEach(function(cobj) {
            
            let datacleaned = countryObject[cobj];

            let country = datacleaned["Country"];
            let year = datacleaned["Year"];
            let datapoint = datacleaned["Datapoint"];

            dataset.push([country,year,datapoint]);

        });
    });
    setGraph(dataset);
};

function preprocesDataPowerP (dataObject){

    var dataset = [];

    Object.keys(dataObject).forEach(function(obj){
        // console.log(dataObject[obj]);
        let countryObject = dataObject[obj];
        
        Object.keys(countryObject).forEach(function(cobj) {
            
            let datacleaned = countryObject[cobj];
            
            let country = datacleaned["Country"];
            let time = datacleaned["Time"];
            let datapoint = datacleaned["Datapoint"];
            let indicator = datacleaned["Indicator"]
            
            dataset.push([country,time,datapoint,indicator]);
            
        });
    });
    setGraph(dataset);
    console.log(dataset);
};

function setGraph(dataset) {
  
   // Width and Height
   var w = 500;
   var h = 300;
   var padding = 30;

//    var formatAsPercentage = d3.format(".1%");

   var color = d3.scaleOrdinal(d3.schemeCategory10);
 
   var xRange = d3.scaleOrdinal()
                  .domain([0, d3.max(dataset, function(d) { return d[1]; })])
                  .range([0, 400]);
   
    var yRange = d3.scaleOrdinal()
                    .domain([0, d3.max(dataset, function(d) { return d[2]; })]);

   var xScale = d3.scaleLinear()
                       .domain([d3.min(dataset, function(d) { return d[1]; }), d3.max(dataset, function(d) { return d[1]; })])
                       .range([padding, w - padding * 2]);
  
   var yScale = d3.scaleLinear()
                       .domain([0, d3.max(dataset, function(d) { return d[2]; })])
                       .range([h - padding, padding]);

   var rScale = d3.scaleLinear()
                        .domain([0, d3.max(dataset, function(d) { return d[2]; })])
                        .range([2, 5]);


   var xAxis = d3.axisBottom(xRange)
                   .scale(xScale)
                   .ticks(5);  //Set rough ,  " #  of ticks.tickFormat(formatAsPercentage);
                //    .tickFormat(formatAsPercentage);
                
   var yAxis = d3.axisLeft(yRange)
                   .scale(yScale)
                   .ticks(5);
                //    .tickFormat(formatAsPercentage);

   var svg = d3.select("body")
               .append("svg")
               .attr("width", w)
               .attr("height", h);

   svg.selectAll("circle")
       .data(dataset)
       .enter()
       .append("circle")
       .attr("cx", function(d) {
           return xScale(d[1]);
       })
       .attr("cy", function(d) {
           console.log(d[2])
           return yScale(d[2]);
       })
       .attr("r", function(d) {
           return rScale(d[2]);
       })
       .style("fill", function(d) {

        return color(d[0]);
        });

    
    var margin = {top: 20, right: 20, bottom: 30, left: 40}
        
   // Create x as
   svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .call(xAxis)
     
     // text label for the x axis
    svg.append("text")             
    .attr("transform",
            "translate(" + (w/2) + " ," + 
                        (h + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .text("Time")


   //Create Y axis
   svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(" + padding + ",0)")
       .call(yAxis)

    
    // text label for the y axis
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (h / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("GDP");      
};
