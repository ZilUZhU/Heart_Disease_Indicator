// view the output prediction line charts

function displayoutput(original_prob = 0.5, original_input = [0,0,0,0,0,0,0,0,0,0]) {
    // user_input = [+values['Angina'], +values['AgeCategory'], +values['GenHealth'], +values['ChestScan'], +values['Stroke'], 
    // +values['Smoking'], +values['Diabetic'], +values['WeightKg'], +values['HeightCM']/100, +values['AlcoholDrinking']]
    var wdata = [
    { weight: original_input[7]-20, probability: 0.05 },
    { weight: original_input[7]-15, probability: 0.1 },
    { weight: original_input[7]-10, probability: 0.15 },
    { weight: original_input[7]-5, probability: 0.2 },
    { weight: original_input[7], probability: original_prob },
    { weight: original_input[7]+5, probability: 0.3 },
    { weight: original_input[7]+10, probability: 0.35 },
    { weight: original_input[7]+15, probability: 0.4 }
    ];

    // Set dimensions and margins for the graph
    const margin2 = {top: 80, right: 80, bottom: 80, left: 80},
        width2 = 600 - margin2.left - margin2.right,
        height2 = 500 - margin2.top - margin2.bottom;

    // Append the SVG object to the body of the page
    const svg2 = d3.select("#weightsvg")
        .attr("width", width2 + margin2.left + margin2.right)
        .attr("height", height2 + margin2.top + margin2.bottom)
        .append("g")
        .attr("transform", `translate(${margin2.left},${margin2.top})`)
        .attr("class", "modelline");

        // Add title for the weight plot
        svg2.append("text")
            .attr("x", width2 / 2)
            .attr("y", -20)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text("Probability of Heart Disease Based on Weight");

        

        fetchDataAndUpdateChart()
        
    // generate weight chart
    async function fetchDataAndUpdateChart() {
        try {
            for (let i = 0; i < 8; i++) {
                var temp = original_input.slice()
                temp[7] = wdata[i].weight
                const response = await fetch('http://127.0.0.1:8001', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    body: JSON.stringify(temp)
                });

            var result = await response.json();
            wdata[i].probability = result.prob;
            }
            
        } finally {
            updateChart(wdata);

        }
    }

    async function updateChart(data) {
        // console.log("data in chart generation", data)
        const response = await data;
    // Add X axis
    const x = d3.scaleLinear()
        .domain([wdata[0].weight, wdata[wdata.length-1].weight])  // Approx range of weight
        .range([0, width2]);
    svg2.append("g")
        .attr("transform", `translate(0,${height2})`)
        .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([wdata[0].probability-0.1, wdata[wdata.length-1].probability+0.1])  // Probability scale
        .range([height2, 0]);
    svg2.append("g")
        .call(d3.axisLeft(y));

    // Add the line
    var line = d3.line()
        .x(function(d) { return x(d.weight); })
        .y(function(d) { return y(d.probability); });

    svg2.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    // Add a circle to the second data point
    svg2.append("circle")
    .attr("cx", x(original_input[7]))
    .attr("cy", y(original_prob))
    .attr("r", 5) // Radius of the circle
    .attr("fill", "red"); // Color of the circle

    // X-axis Label
    svg2.append("text")
    .attr("text-anchor", "end")
    .attr("x", height2 / 2 + margin2.left)
    .attr("y", height2+margin2.bottom/2)
    .text("Weight (kg)");

    // Y-axis Label
    svg2.append("text")
    .attr("text-anchor", "center")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin2.left/1.5)
    .attr("x", -height2+margin2.top/2)
    .text("Probability of Getting Heart Disease");
    }

    /*---------------------second visual regarding age------------------------*/
    const age_category = ["18-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55-59", "60-64", "65-69", "70-74", "75-79", "80-Older"];

    const age_P = [
        { age: "18-24", probability: 0.05 },
        { age: "25-29", probability: 0.1 },
        { age: "30-34", probability: 0.15 },
        { age: "35-39", probability: 0.2 },
        { age: "40-44", probability: 0.25 },
        { age: "45-49", probability: 0.3 },
        { age: "50-54", probability: 0.35 },
        { age: "55-59", probability: 0.4 },
        { age: "60-64", probability: 0.54 },
        { age: "65-69", probability: 0.59 },
        { age: "70-74", probability: 0.61 },
        { age: "75-79", probability: 0.69 },
        { age: "80-Older", probability: 0.73 },
    ];

    ageChart()

    // generate age line chart
    async function ageChart() {
        try {
            for (let i = 0; i < 13; i++) {
                var temp = original_input.slice()
                temp[1] = i
                const response = await fetch('http://127.0.0.1:8001', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    body: JSON.stringify(temp)
                });

            var result = await response.json();
            age_P[i].probability = result.prob;
            }
            
        } finally {
            age_line(age_P);

        }
    }

    // Append the SVG object to the body of the page
    const svg3 = d3.select("#agesvg")
        .attr("width", width2 + margin2.left + margin2.right)
        .attr("height", height2 + margin2.top + margin2.bottom)
        .append("g")
        .attr("transform", `translate(${margin2.left},${margin2.top})`)
        .attr("class", "modelline");

    function age_line(age_P) {
    // Add X axis
    const x_age = d3.scaleBand()
        .domain(age_P.map(d => d.age)) 
        .range([0, width2]);
    svg3.append("g")
        .attr("transform", `translate(0,${height2})`)
        .call(d3.axisBottom(x_age));

    // Add Y axis
    const y_age = d3.scaleLinear()
        .domain([0, 1])  // Probability scale
        .range([height2, 0]);
    svg3.append("g")
        .call(d3.axisLeft(y_age));

    // Add the line
    const line_age = d3.line()
        .x(d => x_age(d.age) + x_age.bandwidth() / 2)
        .y(d => y_age(d.probability));

    svg3.append("path")
        .datum(age_P)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line_age);
        

    // Add a circle to the second data point
    svg3.append("circle")
    .attr("cx", x_age(age_P[original_input[1]].age) + x_age.bandwidth() / 2)
    .attr("cy", y_age(original_prob))
    .attr("r", 5) // Radius of the circle
    .attr("fill", "red"); // Color of the circle

    // X-axis Label
    svg3.append("text")
    .attr("text-anchor", "end")
    .attr("x", height2 / 2 + margin2.left)
    .attr("y", height2+margin2.bottom/2)
    .text("Age");

    // Y-axis Label
    svg3.append("text")
    .attr("text-anchor", "center")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin2.left/1.5)
    .attr("x", -height2+margin2.top/2)
    .text("Probability of Getting Heart Disease");
    }

    // Add title for the age plot
    svg3.append("text")
    .attr("x", width2 / 2)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .style("margin-top", "16px")
    .text("Probability of Heart Disease Based on Age");
}
