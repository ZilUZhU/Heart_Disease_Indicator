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
            var state = d.properties.name;
            var rate = heartAttackRates[state];
            var text = state + "<br>" + (rate ? "Heart Attack Rate: " + rate.percentage.toFixed(2) + "%" : "No data");
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
