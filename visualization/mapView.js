// Dimensions and margins for the map
var margin = {top: 50, right: 50, bottom: 50, left: 80},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Aesthetic Configurations
var colorArray = [d3.schemeCategory10, d3.schemeAccent];
var colorScheme = d3.scaleOrdinal(colorArray[0]);

// Append the SVG object body
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define the projection
var projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2]) // Center the map
    .scale([1000]); // Scale to fit

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

// Load and display the GeoJSON data
d3.json("us-states.json").then(function(geoJsonData) {
    svg.selectAll("path")
        .data(geoJsonData.features)
        .enter().append("path")
        .attr("d", path)
        .style("fill", "steelblue")
        .style("stroke", "white")
        .style("stroke-width", "1")
        // Mouse events
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d.properties.name) // Use the name property from your GeoJSON data
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
}).catch(function(error) {
    console.error("Error loading the GeoJSON data:", error);
});

// Fetch the data (Cleaned Data)
var pathToCsv = "heart_2022_with_nans.csv";

// Load data
d3.csv(pathToCsv).then(function(data) {
    console.log(data); // Log the loaded data
}).catch(function(error) {
    console.error('Error loading the CSV file:', error);
});