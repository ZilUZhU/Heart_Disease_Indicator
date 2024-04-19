const data = [
    { bmi: 18.5, probability: 0.05 },
    { bmi: 20, probability: 0.1 },
    { bmi: 22.5, probability: 0.15 },
    { bmi: 25, probability: 0.2 },
    { bmi: 27.5, probability: 0.25 },
    { bmi: 30, probability: 0.3 },
    { bmi: 32.5, probability: 0.35 },
    { bmi: 35, probability: 0.4 }
];

// Set dimensions and margins for the graph
const margin2 = {top: 80, right: 80, bottom: 80, left: 80},
    width2 = 600 - margin2.left - margin2.right,
    height2 = 500 - margin2.top - margin2.bottom;

// Append the SVG object to the body of the page
const svg2 = d3.select("#temp")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform", `translate(${margin2.left},${margin2.top})`);

// Add X axis
const x = d3.scaleLinear()
    .domain([15, 40])  // Approx range of BMI
    .range([0, width2]);
svg2.append("g")
    .attr("transform", `translate(0,${height2})`)
    .call(d3.axisBottom(x));

// Add Y axis
const y = d3.scaleLinear()
    .domain([0, 0.5])  // Probability scale
    .range([height2, 0]);
svg2.append("g")
    .call(d3.axisLeft(y));

// Add the line
const line = d3.line()
    .x(function(d) { return x(d.bmi); })
    .y(function(d) { return y(d.probability); });

svg2.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", line);

// Add a circle to the second data point
svg2.append("circle")
.attr("cx", x(data[1].bmi))
.attr("cy", y(data[1].probability))
.attr("r", 5) // Radius of the circle
.attr("fill", "red"); // Color of the circle

// X-axis Label
svg2.append("text")
.attr("text-anchor", "end")
.attr("x", height2 / 2 + margin2.left)
.attr("y", height2+margin2.bottom/2)
.text("Body Mass Index (BMI)");

// Y-axis Label
svg2.append("text")
.attr("text-anchor", "center")
.attr("transform", "rotate(-90)")
.attr("y", -margin2.left/1.5)
.attr("x", -height2+margin2.top/2)
.text("Probability of Getting Hear Disease");

/*---------------------second visual regarding age------------------------*/
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

// Append the SVG object to the body of the page
const svg3 = d3.select("#temp2")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform", `translate(${margin2.left},${margin2.top})`);

// Add X axis
const x_age = d3.scaleBand()
    // .domain(["18-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55-59", "60-64", "65-69", "70-74", "75-79", "80-Older"]) 
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
.attr("cx", x_age(age_P[1].age) + x_age.bandwidth() / 2)
.attr("cy", y_age(age_P[1].probability))
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
.text("Probability of Getting Hear Disease");