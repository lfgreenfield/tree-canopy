

var map = new L.Map("map", {
    center: [38.04,-84.54],
    zoom: 12,
    minZoom: 12,
    maxZoom:15,
    zoomControl: false,
});

new L.Control.Zoom({ position: 'bottomright' }).addTo(map);

var getBounds = map.getBounds();
          
var bounds = L.latLngBounds(getBounds);    
        
map.setMaxBounds(bounds);

var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

map.addLayer(layer);

$.getJSON('https://lfgreenfield.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM canopydata_cd_use', function(data) {
    mapData(data);
});

new L.Control.GeoSearch({
        provider: new L.GeoSearch.Provider.Esri(),
        position: 'topright',
    }).addTo(map);

$('.leaflet-control-geosearch').detach().removeClass('leaflet-control').appendTo('.about');

$('.why-this-matters').on('click', function() {
    $('.cover-all').fadeIn();
    $('.meaning').fadeIn();
});

$('.cover-all, .close-meaning').on('click', function() {
    $('.cover-all').fadeOut();
    $('.meaning').fadeOut();
});

var currentAttribute = 'treeCanopyKey',
    currentView = 'current',
    dataLayer;

var allData = {
    treeCanopyKey : {
        current : 'canopy_percent',
        goal : 'goalcanopypercen',
        descrip : 'percent of canopy cover',
        lowColor: '#e5f5e0',
        highColor: '#006d2c',
        domain: [20,25,30,35,40],
        range: ['#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c']
    },
    propertyKey : {
        current : 'propvalmillcontribute',
        goal : 'goalpropvalmillcontribute',
        descrip : 'millions of $ contributed to property values, annually',
        lowColor: '#fee391',
        highColor: '#993404',
        domain: [10, 18, 26, 34, 40],
        range: ['#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#993404']
    },
    pollutantsKey: {
        current: 'airqualitylbspollutants',
        goal: 'goalairqualitylbspollutants',
        descrip : 'lbs of pollutants removed from air, annually',
        lowColor: '#fa9fb5',
        highColor: '#49006a',
        domain: [41500, 69500, 97500, 125500, 181000],
        range: ['#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177']
    },
    stormwaterKey: {
        current: 'runoffmillgallsreduced',
        goal: 'goalrunoffmillgallsreduced',
        descrip : 'millions of gallons of runoff water reduced, annually',
        lowColor: '#a6bddb',
        highColor: '#016c59',
        domain: [92, 146, 200, 254, 310],
        range: ['#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#0868ac']
    },
    carbonKey: {
        current: 'carbonstoredsequesttonsannually',
        goal: 'goalcarbonstoredsequesttonsannually',
        descrip: 'tons of carbon stored and sequestered, annually',
        lowColor: '#bdbdbd',
        highColor: '#525252',
        domain: [82000, 132000, 182000, 232000, 280000],
        range: ['#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026']
    }
}

function mapData(data) {
    
    
    dataLayer = L.geoJson(data, {
        style : function(l) {
            return {
                fillColor: 'green',
                opacity: 1,
                fillOpacity: 1,
                width: 1,
                color: 'white'
            }
        }  
    }).addTo(map);
    
    

    buildUI();
    createPopup();
    drawLegend();
    colorize();

}

function colorize() {
   
    var values = getValues(dataLayer);
   
    dataLayer.eachLayer(function(l) {
        
       l.setStyle({
           fillColor: getColor(l.feature.properties[allData[currentAttribute][currentView]], values),
           fillOpacity: .8
       }) 
       
        l.on('mouseover', function() {

            l.setStyle({
                color: 'yellow'
            });
            l.bringToFront();

        });
        
        l.on('mouseout', function() {
            l.setStyle({
                color: 'white'
            });
        });
        
    });
    
    updateLegend(values);
}

function getValues(layers) {
    
    var values = [];
    layers.eachLayer(function(l) {
       values.push(Number(l.feature.properties[allData[currentAttribute][currentView]]));
    });
    return values.sort(function(a,b) {
        return a - b;  
    }); 
}
    
function getColor(v, values) {

    
    var s = d3.scale.quantile();
        s.domain(allData[currentAttribute].domain);
        s.range(allData[currentAttribute].range) 
    
    return s(v);
       
}

function highlightDistrict(disNum) {
    
    dataLayer.eachLayer(function(layer) {
        if(disNum === "District"+layer.feature.properties.district) {
            layer.setStyle({
                color: 'yellow'
            });
            layer.bringToFront();
        } else {
            layer.setStyle({
                color: 'white'
            })
        }
    });
}
        
function dehighlightDistrict() {
     dataLayer.eachLayer(function(layer) {
         layer.setStyle({
                color: 'white'
            });
     });
         
}

function buildUI() {
    
    $("#charts label button").on('click', function() {
        currentAttribute = $(this).parent().attr('data-key');
        $('#charts button').css({'color': '#3d3d3d', 'font-weight': 'normal'})
        $(this).css({'color': allData[currentAttribute].range[3], 'font-weight': 'bold'} );
        $('#' + currentView).css({'color': allData[currentAttribute].range[3], 'font-weight': 'bold'} );
        colorize();
        showInfo();
        createPopup();
    });

    $('#' + currentView).css({'color': allData[currentAttribute].range[3], 'font-weight': 'bold'} );
    
    $('#current-goal-controls button').on('click', function() {
        currentView = $(this).attr('id');
        $('#current-goal-controls button').css({'color': '#3d3d3d', 'font-weight': 'normal'})
        $(this).css({'color': allData[currentAttribute].range[3], 'font-weight': 'bold'} );
        colorize();
        createPopup();
    });
}
function showInfo() {
    $('.description').fadeOut('slow', function() {
        $('.'+currentAttribute).fadeIn();
    });
    
}

function createPopup() {
    dataLayer.eachLayer(function(layer){
        
        var props = layer.feature.properties
        var description = allData[currentAttribute].descrip;

        var value = layer.feature.properties[allData[currentAttribute][currentView]];

        
        var infoWindow = $('#hover-window');
        layer.on('mouseover', function (e) {
            var props = this.feature.properties,
                currentVal = props[(allData[currentAttribute].current)],
                goalVal = props[(allData[currentAttribute].goal)];      
      
            infoWindow.show();
            infoWindow.html("<b>"+"District "+props.district+"</b><br>"+ description+ "<br>"+ "current value: "+currentVal + "<br>"+ "goal value: "+goalVal);
            
            $(document).mousemove(function(e){
                // first offset from the mouse position of the info window
                infoWindow.css({"left": e.pageX + 6, "top": e.pageY - infoWindow.height() - 15}); 

                // if it crashes into the top, flip it lower right
                if(infoWindow.offset().top < 4) {
                    infoWindow.css({"top": e.pageY + 15});
                }
                // do the same for crashing into the right
                if(infoWindow.offset().left + infoWindow.width() >= $(document).width() - 40) {
                    infoWindow.css({"left": e.pageX - infoWindow.width() - 30});
                }
            });
        });
        layer.on('mouseout', function(e) {
             infoWindow.hide();
        });
    });
}

function drawLegend() {

    //set control position
    var legend = L.control({position: 'topright'});

    //cues for when legend is adding to map: div created
    legend.onAdd = function(map) {

        var div = L.DomUtil.get('legend');

        return div;
    };

    legend.addTo(map);
    
}

function updateLegend(values) {

    
    var s = d3.scale.quantile();
        s.domain(allData[currentAttribute].domain);
        s.range(allData[currentAttribute].range) 
 
    var legend = $('#legend h3').text(allData[currentAttribute].descrip);
    
    d3.select('#legend svg').append("g")
      .attr("class", "legendLinear")
      .attr("transform", "translate(0,20)");

    var legendLinear = d3.legend.color()
      .ascending(true)
      .scale(s);

    d3.select(".legendLinear")
      .call(legendLinear);

}

