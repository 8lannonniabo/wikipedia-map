// This script contains the code that creates the central network, as well as
// a function for resetting it to a brand new page.


var nodes, edges, network //Global variables
var startpages = [];

// Is the user on a touch device?
var isTouchDevice = 'ontouchstart' in document.documentElement;

var container = document.getElementById('container');
//Global options
var options = {
  nodes: {
    shape: 'dot',
    scaling: { min: 20,max: 30,
      label: { min: 14, max: 30, drawThreshold: 9, maxVisible: 20 }
    },
    font: {size: 12, face: 'Arial'}
  },
  interaction: {
    hover: true,
    hoverConnectedEdges: false,
    selectConnectedEdges: true,
  },
};

var nodes = new vis.DataSet();
var edges = new vis.DataSet();
var data = {nodes:nodes,edges:edges};
var initialized = false


//Make the network
function makeNetwork() {
  network = new vis.Network(container,data,options);
  bindNetwork();
  initialized=true;
}


//Reset the network to be new each time.
function resetNetwork(start) {
  if (!initialized){makeNetwork()};
  startpages = [start]; // Register the
  tracenodes = [];
  traceedges = [];
  // -- CREATE NETWORK -- //
  //Make a container
  nodes = new vis.DataSet([
    {id:start, label:wordwrap(decodeURIComponent(start),20), value:2, level:0,
     color:getColor(0), parent:start} //Parent is self
  ]);
  edges = new vis.DataSet();
  //Put the data in the container
  data = {nodes:nodes,edges:edges};
  network.setData(data);
}


// Reset the network with the content from the input box.
function resetNetworkFromInput() {
  // If no input is given, fall back to the page about Wikipedia
  var input = inputBox.value || "Wikipedia";
  getPageName(encodeURI(input), resetNetwork);
}
