// Maze Generation: Prim's Algorithm
// author: Cédric "tuzepoito" Chartron

var Algorithms = Algorithms || {};

// This algorithm generates a maze in a grid of points by treating the grid as a graph, and the path between two
// points as an edge in the graph: the maze is then generated as a spanning tree of nodes related to the graph.
// A "wall" in the maze is simply defined as the absence of an edge between two nodes.
// The algorithm goes this way:
// - start from a random node
// - add it as the root of the tree
// - While there are still nodes not in the tree:
//   - Find a node to the "frontier" of the tree
//   - Add it to the tree
//   - For all nodes that connect to this node, and are not in the tree, add them to the frontier

Algorithms.Prim = (function () {
  'use strict';
  // every point in a (width, height) grid is defined by an index
  var coords = new Array(width * height); // coordinates of the point
  var edges = new Array(width * height); // for each point in the tree the index of the parent point
  var inTree = new Array(width * height); // whether the point is included in the tree

  var solution; // edges of the resulting forest
  var root, index, discovered;

  var init = function() {
    var offset = 0;
    var i, j;
    // initialize the values for each point
    for (j = 0; j < height; j++) {
      for (i = 0; i < width; i++) {
        coords[offset] = [ 1 + 2 * i, 1 + 2 * j ];
        edges[offset] = undefined;
        inTree[offset++] = false;
      }
    }

    discovered = []; // nodes yet to be processed
    solution = [];
    // add root node at left wall
    root = width * getRandomInt(0, height);
    discovered.push(root);
    u8cimage[4 * (imageWidth * (1 + 2 * root / width)) + 1] = 255;
    index = -1;
  }

  var step = function() {
    if (discovered.length == 0) {
      computeOver = true;
      return;
    }

    // undo previous draw
    if (index >= 0) {
      setPixel(u32image, coords[index][0], coords[index][1], 0xFFFFFFFF);
    }

    // get a random node from the frontier, and remove it
    index = discovered.splice(getRandomInt(0, discovered.length), 1)[0];
    inTree[index] = true; // add it to the tree
    // draw as red
    setPixel(u32image, coords[index][0], coords[index][1], discovered.length == 0 ? 0xFFFFFFFF : 0xFF0000FF);

    // if not root node, draw the edget to the parent node
    if (typeof(edges[index]) != "undefined") {
      solution.push([index, edges[index]]);
      setPixel(
        u32image,
        (coords[index][0] + coords[edges[index]][0]) / 2,
        (coords[index][1] + coords[edges[index]][1]) / 2,
        0xFFFFFFFF);
    }

    // discover left node
    if (index % width != 0 && !inTree[index-1]) {
      if (discovered.indexOf(index-1) < 0)
        discovered.push(index-1);
      edges[index-1] = index; // set parent of discovered node
    }

    // discover right node
    if (index % width != width-1 && !inTree[index+1]) {
      if (discovered.indexOf(index+1) < 0)
        discovered.push(index+1);
      edges[index+1] = index;
    }

    // discover top node
    if (index >= width && !inTree[index-width]) {
      if (discovered.indexOf(index-width) < 0)
        discovered.push(index-width);
      edges[index-width] = index;
    }

    // discover bottom node
    if (index < (width-1) * height && !inTree[index+width]) {
      if (discovered.indexOf(index+width) < 0)
        discovered.push(index+width);
      edges[index+width] = index;
    }
  };

  return { init: init, step: step };
}());