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
      buildMetadata(sampleNames[0]);
      buildCharts(sampleNames[0]);
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
    var result = sampledata[0];

    // Building Top 10 Horizontal Bar Chart
    var topTenIDs = result.otu_ids.map(id=>`OTU ${id}`).slice(0,10).reverse();
    var topTenLabels = result.otu_labels.slice(0,10).reverse();
    var topTenValues = result.sample_values.slice(0,10).reverse();

    var trace1 = {
      x: topTenValues,
      y: topTenIDs,
      type: "bar",
      orientation: "h",
      marker: {
        color: 'rgba(55,128,191,0.6)',
        width: 1
      },
      text: topTenLabels
    }
    data1 = [trace1];
    layout1 = {
      title: 'Top 10 OTUs',
      paper_bgcolor: 'rgb(248,248,255)',
      plot_bgcolor: 'rgb(248,248,255)',
      margin: {
        l: 100,
        r: 20,
        t: 50,
        b: 20
      },
    };
    Plotly.newPlot("bar", data1, layout1)

    // Building Bubble Charts
    var allIDs = result.otu_ids;
    var allValues = result.sample_values;
    var markerSize = result.sample_values;

    var trace2 = {
      x: allIDs,
      y: allValues,
      mode: 'markers',
      marker: {
        size: markerSize,
        color: allIDs
      }
    }
    data2 = [trace2];
    Plotly.newPlot("bubble", data2);
  }
  )
}