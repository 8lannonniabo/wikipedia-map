// This script contains the code that creates the central network, as well as
// a function for resetting it to a brand new page.


var nodes, edges, network; //Global variables
var startpages = [];
// Tracks whether the network needs to be reset. Used to prevent deleting nodes
// when multiple nodes need to be created, because AJAX requests are async.
var needsreset = true;

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
    font: {size: 14, face: 'Helvetica Neue, Helvetica, Arial'}
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
var initialized = false;


//Make the network
function makeNetwork() {
  network = new vis.Network(container,data,options);
  bindNetwork();
  initialized=true;
}


//Reset the network to be new each time.
function resetNetwork(start) {
  if (!initialized) makeNetwork();
  var startID = getNeutralId(start);
  startpages = [startID]; // Register the page as an origin node
  tracenodes = [];
  traceedges = [];
  // -- CREATE NETWORK -- //
  //Make a container
  nodes = new vis.DataSet([
    {id:startID, label:wordwrap(decodeURIComponent(start),20), value:2, level:0,
     color:getColor(0), x:0, y:0, parent:startID} //Parent is self
  ]);
  edges = new vis.DataSet();
  //Put the data in the container
  data = {nodes:nodes,edges:edges};
  network.setData(data);
}


// Add a new start node to the map.
function addStart(start, index) {
  if (needsreset) {
    // Delete everything only for the first call to addStart by tracking needsreset
    resetNetwork(start);
    needsreset = false;
    return;

  } else {
    var startID = getNeutralId(start);
    startpages.push(startID);
    nodes.add([
      {id:startID, label:wordwrap(decodeURIComponent(start),20), value:2, level:0,
      color:getColor(0), x:0, y:0, parent:startID} // Parent is self
    ]);
  }
}


// Reset the network with the content from the input box.
function resetNetworkFromInput() {
  // Network should be reset
  needsreset = true;
  var cf = document.getElementsByClassName("commafield")[0];
  // Items entered.
  var inputs = getItems(cf);
  // If no input is given, add an item for the page about Wikipedia as a fallback
  if (!inputs[0]) {
    addItem(cf, "Wikipedia");
    inputs = getItems(cf);
  }

  for (var i=0; i<inputs.length; i++) {
    getPageName(encodeURI(inputs[i]), addStart);
  }
}
