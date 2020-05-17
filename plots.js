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
    var metadata = data.metadata.filter(sampleObj => sampleObj.id == sample);

    // Building Top 10 Horizontal Bar Chart
    // Data Required for Bar Chart
    var topTenIDs = result.otu_ids.map(id=>`OTU ${id}`).slice(0,10).reverse();
    var topTenLabels = result.otu_labels.slice(0,10).reverse();
    var topTenValues = result.sample_values.slice(0,10).reverse();

    // Dataset for Bar Chart
    var bar_trace = {
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
    bar_data = [bar_trace];
    // Layout for Bar Chart
    bar_layout = {
      title: 'Top 10 OTUs',
      margin: {
        l: 100,
        r: 20,
        t: 50,
        b: 20
      },
    };
    Plotly.newPlot("bar", bar_data, bar_layout);

    // Building Bubble Charts
    // Data Required for Bubble Chart
    var allIDs = result.otu_ids;
    var allValues = result.sample_values;
    var allLabels = result.otu_labels;
    var markerSize = result.sample_values;

    // Dataset for Bubble Chart
    var bubble_trace = {
      x: allIDs,
      y: allValues,
      text: allLabels,
      mode: 'markers',
      marker: {
        size: markerSize,
        color: allIDs
      }
    };
    bubble_data = [bubble_trace];
    // Layout for Bubble Chart
    bubble_layout = {
      title: 'Sample Value by OTU ID',
      xaxis: {
        title: {
          text: 'OTU ID'
        }
      }
    };    
    Plotly.newPlot("bubble", bubble_data, bubble_layout);

    // Building Guage Chart
    // Data Required for Guage Chart
    var scrub = metadata[0].wfreq;

    var guage_trace = {
      value: scrub,
      type: 'indicator',
      mode: 'gauge+number',
      title: { text: "Washing Frequency (Scrubs per wk)" },
      gauge: {
        axis: { range: [null, 10], tickvals: [0,1,2,3,4,5,6,7,8,9,10]},
        bar: { color: "lightblue" },
        borderwidth: 1,
        bordercolor: "white",
        steps: [
          {range: [0, 1], color: 'red'},
          {range: [1, 4], color: 'rgba(250,100,15,0.8)'},
          {range: [4, 7], color: 'rgba(255,255,15,0.8)'},
          {range: [7, 10], color: 'rgba(100,255,70,0.8)'}
        ]
      },
    };
    guage_data = [guage_trace];
    Plotly.newPlot("gauge", guage_data)
  }
  )
}