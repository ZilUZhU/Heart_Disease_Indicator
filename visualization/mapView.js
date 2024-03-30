// Fetch the data (Cleaned Data)
const pathToCsv = "cleaned_heart_2022.csv";

// Dimensions and margins for the map
const margin = { top: 50, right: 50, bottom: 50, left: 80 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

// Aesthetic Configurations
const colorArray = [d3.schemeCategory10, d3.schemeAccent];
const colorScheme = d3.scaleOrdinal(colorArray[0]);

// Append the SVG object body
const svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define the projection
const projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2]) // Center the map
    .scale([1000]); // Scale to fit

// Define the path generator
const path = d3.geoPath()
    .projection(projection);

// Define the tooltip
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("opacity", 0)
    .style("background-color", "#fff")
    .style("border", "1px solid #000")
    .style("padding", "10px")
    .style("border-radius", "5px")
    .style("pointer-events", "none");

// Load and process data
Promise.all([
    d3.json("us-states.json"), // Make sure this URL is correct and accessible
    d3.csv(pathToCsv) // Make sure this URL is correct and accessible
]).then(function([geoJsonData, heartData]) {
    // Process heart data: Calculate percentage of 'Yes' responses by state
    const heartAttackCounts = {}; // Store counts of total surveys and 'Yes' responses
    heartData.forEach(d => {
        if (!heartAttackCounts[d.state]) {
            heartAttackCounts[d.state] = { total: 0, yes: 0 };
        }
        heartAttackCounts[d.state].total++; // Increment total surveys for the state
        if (d.HadHeartAttack === "Yes") {
            heartAttackCounts[d.state].yes++; // Increment 'Yes' responses
        }
    });

    // Calculate percentage of 'Yes' responses for each state
    const heartAttackPercentages = {};
    Object.keys(heartAttackCounts).forEach(state => {
        const data = heartAttackCounts[state];
        heartAttackPercentages[state] = (data.yes / data.total) * 100; // Calculate percentage
    });

    // Define a color scale for heart attack percentages
    const colorScale = d3.scaleSequential(d3.interpolateReds)
        .domain([0, d3.max(Object.values(heartAttackPercentages))]);

    // Display the map
    svg.selectAll("path")
        .data(geoJsonData.features) // Bind the features array from the GeoJSON
        .enter().append("path")
        .attr("d", path) // Use the D3 geoPath generator for drawing paths
        .style("fill", d => {
            // Fill color based on heart attack percentage
            const percentage = heartAttackPercentages[d.properties.name] || 0;
            return colorScale(percentage);
        })
        .style("stroke", "white")
        .style("stroke-width", "1")
        .on("mouseover", (event, d) => {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            const stateName = d.properties.name;
            const heartAttackInfo = heartAttackPercentages[stateName] ? heartAttackPercentages[stateName].toFixed(2) + "%" : "No data";
            tooltip.html(`${stateName}<br/>Heart Attack Prevalence: ${heartAttackInfo}`)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
}).catch(function(error) {
    console.error("Error loading or processing data:", error);
});