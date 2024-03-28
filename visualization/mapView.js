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
var pathToCsv = "../data/heart_2022_with_nans.csv.zip";

var colorArray = [d3.schemeCategory10, d3.schemeAccent];
var colorScheme = d3.scaleOrdinal(colorArray[0]);

// load data
fetch(pathToCsv)
  .then(response => {
    if (response.status === 200 || response.status === 0) {
      return response.arrayBuffer();
    }
    throw new Error('Could not retrieve the zip file.');
  })
  .then(JSZip.loadAsync)
  .then(zip => {
    const csvFileName = Object.keys(zip.files).find(fileName => fileName.endsWith('.csv'));
    if (csvFileName) {
      return zip.file(csvFileName).async("string"); // Extract CSV file content as a string
    }
    throw new Error('CSV file not found in zip.');
  })
  .then(csvContent => {
    const data = d3.csvParse(csvContent);
    console.log(data); 
  })
  .catch(err => console.error(err));