    // Define margins and dimensions
    const margin = { top: 50, right: 50, bottom: 50, left: 80 },
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    // Append SVG to the body
    const svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define the map projection
    const projection = d3.geoAlbersUsa()
        .translate([width / 2, height / 2])
        .scale([1000]);

    // Define path generator
    const path = d3.geoPath()
        .projection(projection);

    // Define the tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Load the data
    d3.queue()
        .defer(d3.json, "us-states.json")
        .defer(d3.csv, "cleaned_heart_2022.csv")
        .await(ready);

    function ready(error, us, data) {
        if (error) throw error;

        // Process heart data
        const heartAttackCounts = {};
        data.forEach(d => {
            if (!heartAttackCounts[d.state]) {
                heartAttackCounts[d.state] = { total: 0, yes: 0 };
            }
            heartAttackCounts[d.state].total++;
            if (d.HadHeartAttack === "Yes") {
                heartAttackCounts[d.state].yes++;
            }
        });

        const heartAttackPercentages = {};
        Object.keys(heartAttackCounts).forEach(state => {
            const data = heartAttackCounts[state];
            heartAttackPercentages[state] = (data.yes / data.total) * 100;
        });

        // Define a color scale
        const colorScale = d3.scaleSequential(function(t) {
    // Using a custom function to interpolate between two shades of red
    return d3.interpolateRgb("lightpink", "darkred")(t);
}).domain([0, d3.max(Object.values(heartAttackPercentages))]);

        // Draw each state with color based on heart attack percentages
        svg.selectAll(".state")
            .data(us.features)
            .enter().append("path")
            .attr("class", "state")
            .attr("d", path)
            .style("fill", d => {
                const stateName = d.properties.name;
                const percentage = heartAttackPercentages[stateName] || 0;
                return colorScale(percentage / 100);
            })
            .style("stroke", "#fff")
            .on("mouseover", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                const stateName = d.properties.name;
                const heartAttackInfo = heartAttackPercentages[stateName] ? heartAttackPercentages[stateName].toFixed(2) + "%" : "No data";
                tooltip.html(`${stateName}<br/>Heart Attack Prevalence: ${heartAttackInfo}`)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    }