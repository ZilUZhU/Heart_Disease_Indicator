// import


// define the dimensions and margins for the line chart
// Use the Margin Convention referenced in the HW document to layout your graph

// define the dimensions and margins for the bar chart
var margin = ({top: 50, right: 50, bottom: 50, left: 80}),
    width = 960,
    height = 500
// var padding = {top: 20, right: 20, bottom: 20, left: 20},
//     paddingdis = 1;


// append svg element to the body of the page
// set dimensions and position of the svg element
let svg = d3
    .select("body")
    .append("svg")
    .attr("id", "line_chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("id", "container")
    .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

// Fetch the data
var pathToCsv = "heart_2022_with_nans.csv";

var colorArray = [d3.schemeCategory10, d3.schemeAccent];
var colorScheme = d3.scaleOrdinal(colorArray[0]);

// load data
d3.csv(pathToCsv).then(function(data) {
    console.log(data); // Log the loaded data
}).catch(function(error) {
    console.error('Error loading the CSV file:', error);
});