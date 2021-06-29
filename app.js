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
//Create x scale
    var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(scaleData,function(d){
    return +d.poverty;
    })])
    .range([0, width]);
//create y scale
    var yLinearScale = d3.scaleLinear()
    .domain([2, d3.max(scaleData,function(d){
    return +d.healthcare;
    })])
    .range([height, 0]);

 //  Create axis functions
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    //let yLinearScale = yScale(stateData, chosenYAxis);
  // append x axis
    let xAxis = chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
//append y axis
        var yAxis = chartGroup.append('g')
        .classed('y-axis', true)
        .call(leftAxis);


// create circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(scaleData)
    .enter()
    .append("circle")
    .attr("cx", (d,i) => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "10")
    .attr("fill", "red")
    .classed("stateCircle", true)

    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([-10, 30])
    .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
    });


    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });


//Add text
    // var textGroup = chartGroup.selectAll('.stateText')
    //   .data(scaleData)
    //   .enter()
    //   .append('text')
    //   .classed('stateText', true)
    //   .attr('x', d => xLinearScale(d[bottomAxis]))
    //   .attr('y', d => yLinearScale(d[leftAxis]))
    //   .attr('dy', 4)
    //   .attr('font-size', '12px')
    //   .text(function(d){return d.abbr});

    //   var textGroup = chartGroup.selectAll("text")
    //   .attr("transform", "rotate(-90)")
    //   .attr("y", d - margin.left)
    //   .attr("x", d - (height / 2))
    //   .attr("dy", 4)
    //   .attr("class", "axisText")
    //   .text("Poverty Rate");

    var povertyLabel = chartGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "poverty")
      .attr("transform", `translate(${width / 2}, ${height})`)
      .text("In Poverty (%)")
      .classed("active", true);

    var healthcareLabel = chartGroup.append("text")
      .attr("x", -(height / 2))
      .attr("y" + 20)
      .attr("transform", "rotate(-90)")
      .text("Healthcare")
      .classed("active", true);



    
})
