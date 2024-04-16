// Dimensions and margins for the map
var margin = {top: 50, right: 50, bottom: 50, left: 80},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Append the SVG object to the body of the page
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define the projection
var projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2])
    .scale(1000);

// Define the path generator
var path = d3.geoPath()
    .projection(projection);

// Define the tooltip
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("opacity", 0)
    .style("background-color", "#fff")
    .style("border", "1px solid #000")
    .style("padding", "10px")
    .style("border-radius", "5px")
    .style("pointer-events", "none");

// Load external data simultaneously
Promise.all([
    d3.json("us-states.json"), // Adjust path as needed
    d3.csv("cleaned_heart_2022.csv") // Adjust path as needed
]).then(function([us, healthData]) {
    // Process heart attack data
    var heartAttackRates = {};

    healthData.forEach(function(d) {
        if (!heartAttackRates[d.State]) heartAttackRates[d.State] = { yes: 0, total: 0 };
        heartAttackRates[d.State].total += 1;
        if (d.HadHeartAttack === "Yes") heartAttackRates[d.State].yes += 1;
    });

    // Calculate percentages
    Object.keys(heartAttackRates).forEach(function(State) {
        var rate = heartAttackRates[State];
        rate.percentage = (rate.yes / rate.total) * 100;
    });

    function calculateRate(healthData, field, state, keyword = 'Y') {
        var resultRate = {}

        healthData.forEach(function(d) {
          if (!resultRate[d['State']]) resultRate[d['State']] = { yes: 0, total: 0 };
          resultRate[d['State']].total += 1;

          if (d[field].startsWith(keyword)) resultRate[d['State']].yes += 1;
        });
        var rate = 1;
        // console.log(resultRate[state])
  
        // Calculate percentages
        Object.keys(resultRate).forEach(function(State) {
            rate = resultRate[State];
            rate.percentage = (rate.yes / rate.total) * 100;
        });
        // console.log(rate)
        
        return resultRate[state];
    }


    const groupedData = d3.group(healthData, d => d.State);

    const averageValueByState = Array.from(groupedData, ([state, values]) => {
      const avgSleepHours = d3.mean(values, d => d.SleepHours);
      return { State: state, 
              AverageSleepHours: avgSleepHours, 
              AverageBMI: d3.mean(values, d => d.BMI)
             };
    });


    // Define color scale
    var colorScale = d3.scaleSequential(d3.interpolateReds)
        .domain([0, d3.max(Object.values(heartAttackRates), d => d.percentage)]);

    // Display the map
    svg.selectAll("path")
        .data(us.features)
        .enter().append("path")
        .attr("d", path)
        .style("fill", function(d) {
            var state = d.properties.name;
            var rate = heartAttackRates[state];
            return rate ? colorScale(rate.percentage) : "#ccc";
        })
        .style("stroke", "white")
        .style("stroke-width", "1")
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            // variables for tootip
            var state = d.properties.name;
            var rate = heartAttackRates[state];
            var stateVal = averageValueByState.find(item => item.State === state)
            var sleepHour = stateVal.AverageSleepHours.toFixed(2)
            var avgBMI = stateVal.AverageBMI.toFixed(2)
            var strokeRate = calculateRate(healthData, "HadStroke", state)
            var diabetesRate = calculateRate(healthData, "HadDiabetes", state)
            var smokingRate = calculateRate(healthData, "SmokerStatus", state, 'C')
            var asthmaRate = calculateRate(healthData, "HadAsthma", state)
            // tooltip text
            var text = "<b>" + state + "</b><br>" + (rate ? "Heart Attack Rate: " + rate.percentage.toFixed(2) + "%" : "No data")
                        + (d3.select('#SleepHours').property('checked') ? "<br>Average Sleep Hours: " + sleepHour: "")  // add checkbox options
                        + (d3.select('#BMI').property('checked') ? "<br>Average BMI: " + avgBMI: "") 
                        + (d3.select('#HadStroke').property('checked') ? "<br> Stroke Rate: " + strokeRate.percentage.toFixed(2) + "%": "") 
                        + (d3.select('#HadDiabetes').property('checked') ? "<br> Diabetes Rate: " + diabetesRate.percentage.toFixed(2) + "%": "")
                        + (d3.select('#SmokerStatus').property('checked') ? "<br> Smoking Rate: " + smokingRate.percentage.toFixed(2) + "%": "")
                        + (d3.select('#HadAsthma').property('checked') ? "<br> Asthma Rate: " + asthmaRate.percentage.toFixed(2) + "%": "")
                        ;
            
            
            tooltip.html(text)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
}).catch(function(error) {
    console.error("Error loading or processing data:", error);
});

