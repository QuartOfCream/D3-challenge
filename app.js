let svgWidth = 960;
let svgHeight = 620;

let margin = {
    top: 20, 
    bottom: 100,
    right: 40, 
    left: 100
  };

let width = svgWidth - margin.right - margin.left;
let height = svgHeight - margin.top - margin.bottom;

//create wrapper
const svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Add an SVG chart group
var chartGroup = svg.append("g")
  .attr("transform", 'translate(${margin.left}, ${margin.top})');

  d3.csv("data.csv").then(function(scaleData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    scaleData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    var xLinearScale = d3.scaleLinear()
    .domain([20, d3.max(scaleData, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(scaleData, d => d.healthcare)])
    .range([height, 0]);

 //  Create axis functions
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    //let yLinearScale = yScale(stateData, chosenYAxis);

    let xAxis = chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

     let yAxis = chartGroup.append("g")
     .call(leftAxis);




// create circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d,i) => xScale(d.poverty))
    .attr("cy", d => yScale(d.healthcare))
    .attr("r", "10")
    .attr("fill", "red")
    .classed("stateCircle", true)

//Add text
    var textGroup = chartGroup.selectAll('.stateText')
      .data(data)
      .enter()
      .append('text')
      .classed('stateText', true)
      .attr('x', d => xLinearScale(d[chosenXAxis]))
      .attr('y', d => yLinearScale(d[chosenYAxis]))
      .attr('dy', 4)
      .attr('font-size', '12px')
      .text(function(d){return d.abbr});


    
})
