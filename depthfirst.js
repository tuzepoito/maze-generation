// Maze Generation through depth-first search.
// author: Cédric "tuzepoito" Chartron

var Algorithms = Algorithms || {};

// This algorithm generates a maze in a grid of points by treating the grid as a graph.
// The algorithm goes this way:
// - Keep a list of the current node's lineage
// - Start from a child of the root node and initialize the list with the root node
// - While the list is not empty:
//    - Mark the current node as visited, if not already
//    - If no children or all children visited:
//      - Go back to parent, remove parent from list
//    - Otherwise:
//      - Add current node to list
//      - set one of the unvisited children as current node

Algorithms.DepthFirst = (function () {
  'use strict';
  // each point in the grid is defined by an index
  var coords = new Array(width * height); // point coordinates
  var inTree = new Array(width * height); // booleans: is point in tree?
  var positions; // list of parents of the current node

  var root, index;

  var init = function() {
    var i, j;
    var offset = 0;
    for (j = 0; j < height; j++) {
      for (i = 0; i < width; i++) {
        coords[offset] = [ 1 + 2 * i, 1 + 2 * j ];
        inTree[offset++] = false;
      }
    }

    // add root node
    root = width * getRandomInt(0, height);
    index = root;
    positions = [];
  };

  var step = function() {
    // index is current node

    if (typeof(index) == "undefined") { // back to root node, no more backtracking
      computeOver = true;
      return;
    }

    // if point not in tree
    if (!inTree[index]) {
      // add point to tree and draw it in blue
      setPixel(u32image, coords[index][0], coords[index][1], index == root ? 0xFF00FF00 : 0xFFFF0000);
      inTree[index] = true;
    }

    // get undiscovered children
    var children = [];
    // left
    if (index % width != 0 && !inTree[index-1]) {
      children.push(index-1);
    }

    // right
    if (index % width != width-1 && !inTree[index+1]) {
      children.push(index+1);
    }

    // top
    if (index >= width && !inTree[index-width]) {
      children.push(index-width);
    }

    // bottom
    if (index / width < height - 1 && !inTree[index+width]) {
      children.push(index+width);
    }

    if (children.length == 0) { // no children left
      // draw node as white and backtrack to its parent
      setPixel(u32image, coords[index][0], coords[index][1], 0xFFFFFFFF);
      var parent = positions.pop();
      if (typeof(parent) != "undefined") {
        // draw edge to the parent node as white
        setPixel(u32image, (coords[index][0] + coords[parent][0]) / 2, (coords[index][1] + coords[parent][1]) / 2, 0xFFFFFFFF);
      }
      index = parent;
    } else { // visit one of the remaining children
      var child = children[getRandomInt(0, children.length)];
      // draw the edge to it as blue
      setPixel(u32image, (coords[index][0] + coords[child][0]) / 2, (coords[index][1] + coords[child][1]) / 2, 0xFFFF0000);
      // save the current node for backtracking later
      positions.push(index);
      index = child;
    }
  };

  return { init: init, step: step };
}());