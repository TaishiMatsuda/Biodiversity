function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });

    top10Bacteria = [{
      type: 'bar',
      x: [1, 2, 3, 4, 5],
      y: ['a','b','c','d','e'],
      orientation: 'h'
    }];
    Plotly.newPlot("bar", top10Bacteria);
})}
  
init();

function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      Object.entries(result).forEach(([key, value]) => PANEL.append("h6").text(key.toUpperCase() + ": " + value));
    });
}

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var sampledata = data.samples.filter(sampleObj => sampleObj.id == sample);
    var sorteddata = sampledata.sort((a,b) => b.sample_values - a.sample_values);
    topTenValues = sorteddata.map(values => values.sample_values);
    console.log(topTenValues);
  }
  )
}