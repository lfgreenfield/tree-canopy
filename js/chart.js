var chartStyles = {
    barStrokeWidth : 5,
    barValueSpacing : 3,
    barShowStroke : false,
    scaleShowGridLines : false, 
    showScale : false
}
var treeCanopyContext = document.getElementById("treeCanopy").getContext("2d");
var carbonContext = document.getElementById("carbon").getContext("2d");
var propvalsContext = document.getElementById("prop-vals").getContext("2d");
var pollutantsContext = document.getElementById("pollutants").getContext("2d");
var stormwaterContext = document.getElementById("stormwater").getContext("2d");

$.getJSON('https://lfgreenfield.cartodb.com/api/v2/sql?format=JSON&q=SELECT * FROM canopydata_cd_use', function(data) {
    //console.log(data);
  
    data.rows.sort(function(a,b) {
     
      return a.district - b.district;
    
    })
    
    //console.log(data);
    buildTreeCanopyChart(data);
    buildCarbonChart(data);
    buildPropChart(data);
    buildPollutantsChart(data);
    buildStormwaterChart(data);
    
});

//   tree canopy chart
function buildTreeCanopyChart(dataObject) {

    var currentData = [],
           goalData = [],
           labels = [];

    dataObject.rows.forEach(function(d,i) {
           labels.push("District"+d.district);
           currentData.push(Number(d.canopy_percent));
           goalData.push(Number(d.goalcanopypercen));
    });

    var data = {
        labels: labels,
        datasets: [
                {
                    label: "My First dataset",
                    fillColor: "#e5f5e0",
                    data: currentData
                },
                {
                    label: "My Second dataset",
                    fillColor: "#006d2c",
                    data: goalData
                }
            ]
        };
    
    var treeCanopyChart = new Chart(treeCanopyContext).Bar(data, chartStyles);
    
    $('#treeCanopy').on('mousemove', function(e){
            try {
                var activeBar = treeCanopyChart.getBarsAtEvent(e);
               // console.log(activeBar);
                highlightDistrict(activeBar[0].label);
            } 
            catch(e) {
               // console.log(e);

            }
        });
    $('#treeCanopy').on('mouseout', function(e){ 
            dehighlightDistrict();
        });

}
   
//   carbon chart
function buildCarbonChart(dataObject) {

    var currentData = [],
           goalData = [],
           labels = [];

    dataObject.rows.forEach(function(d,i) {
           labels.push("District"+d.district);
           currentData.push(Number(d.carbonstoredsequesttonsannually));
           goalData.push(Number(d.goalcarbonstoredsequesttonsannually));
    });

    var data = {
        labels: labels,
        datasets: [
                {
                    label: "My First dataset",
                    fillColor: '#feb24c',
//                    strokeColor: "rgba(220,220,220,0.8)",
//                    highlightFill: "rgba(183, 203, 255, 1)",
//                    highlightStroke: "rgba(220,220,220,1)",
                    data: currentData
                },
                {
                    label: "My Second dataset",
                    fillColor: "#bd0026",
//                    strokeColor: "rgba(220,220,220,0.8)",
//                    highlightFill: "rgba(220,220,220, 1)",
//                    highlightStroke: "rgba(220,220,220,1)",
                    data: goalData
                }
            ]
        };
    
    var carbonChart = new Chart(carbonContext).Bar(data, chartStyles);
    
    $('#carbon').on('mousemove', function(e){
            try {
                var activeBar = carbonChart.getBarsAtEvent(e);
               // console.log(activeBar);
                highlightDistrict(activeBar[0].label);
            } 
            catch(e) {
               // console.log(e);

            }
        });
    $('#carbon').on('mouseout', function(e){ 
            dehighlightDistrict();
        });

}

//prop vals chart 
function buildPropChart(dataObject) {
    
   

    var currentData = [],
           goalData = [],
           labels = [];

    dataObject.rows.forEach(function(d,i) {
           labels.push("District"+d.district);
           currentData.push(Number(d.propvalmillcontribute));
           goalData.push(Number(d.goalpropvalmillcontribute));
    });

//    console.log(currentData);
//    console.log(goalData);
//    console.log(labels);
    
    var data = {
        labels: labels,
        datasets: [
                {
                    label: "Current",
                    fillColor: "rgba(160, 60, 58, 0.75)",
                    strokeColor: "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(160, 60, 58, 1)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data: currentData
                },
                {
                    label: "Goal",
                    fillColor: "rgba(209, 106, 37, 0.75)",
                    strokeColor: "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(209, 106, 37, 1)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data: goalData
                }
            ]
        };
    
    var propChart = new Chart(propvalsContext).Bar(data, chartStyles);     
    
    $('#prop-vals').on('mousemove', function(e){
            try {
                var activeBar = propChart.getBarsAtEvent(e);
                //console.log(activeBar);
                highlightDistrict(activeBar[0].label);
            } catch(e) {
                //console.log(e);

            }
        });
    $('#prop-vals').on('mouseout', function(e){ 
            dehighlightDistrict();
        });

}

//pollutants chart 
function buildPollutantsChart(dataObject) {

    var currentData = [],
           goalData = [],
           labels = [];

    dataObject.rows.forEach(function(d,i) {
           labels.push("District"+d.district);
           currentData.push(Number(d.airqualitylbspollutants));
           goalData.push(Number(d.goalairqualitylbspollutants));
    });

    var data = {
        labels: labels,
        datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(171, 18, 201, 1)",
                    strokeColor: "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(171, 18, 201, 0.75)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data: currentData
                },
                {
                    label: "My Second dataset",
                    fillColor: "rgba(204, 68, 235, 1)",
                    strokeColor: "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(204, 68, 235, 0.75)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data: goalData
                }
            ]
        };
    
    var pollutantsChart = new Chart(pollutantsContext).Bar(data, chartStyles);
    
    $('#pollutants').on('mousemove', function(e){
            try {
                var activeBar = pollutantsChart.getBarsAtEvent(e);
               // console.log(activeBar);
                highlightDistrict(activeBar[0].label);
            } 
            catch(e) {
                //console.log(e);

            }
        });
    $('#pollutants').on('mouseout', function(e){ 
            dehighlightDistrict();
        });

}

//stormwater chart
function buildStormwaterChart(dataObject) {

    var currentData = [],
           goalData = [],
           labels = [];

    dataObject.rows.forEach(function(d,i) {
           labels.push("District"+d.district);
           currentData.push(Number(d.runoffmillgallsreduced));
           goalData.push(Number(d.goalrunoffmillgallsreduced));
    });

    var data = {
        labels: labels,
        datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(58, 60, 218, 0.75)",
                    strokeColor: "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(58, 60, 218, 1)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data: currentData
                },
                {
                    label: "My Second dataset",
                    fillColor: "rgba(14, 165, 255, 0.75)",
                    strokeColor: "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(14, 165, 255, 1)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data: goalData
                }
            ]
        };
    
    var stormwaterChart = new Chart(stormwaterContext).Bar(data, chartStyles);
    
    $('#stormwater').on('mousemove', function(e){
            try {
                var activeBar = stormwaterChart.getBarsAtEvent(e);
               // console.log(activeBar);
                highlightDistrict(activeBar[0].label);
            } 
            catch(e) {
                //console.log(e);

            }
        });
    $('#stormwater').on('mouseout', function(e){ 
            dehighlightDistrict();
        });

}

