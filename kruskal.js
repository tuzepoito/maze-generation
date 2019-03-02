// Maze Generation: Kruskal's Algorithm
// author: Cédric "tuzepoito" Chartron

var Algorithms = Algorithms || {};

// This algorithm generates a maze in a grid of points by treating the grid as a graph.
// The algorithm goes this way:
// - Take all edges as remaining edges
// - While there are remaining edges:
//   - Get one of the remaining edges
//   - If the edge connects two different trees:
//     - connect the trees
//   - Discard the edge from the list of remaining edges
// In the end, a spanning tree is generated.

Algorithms.Kruskal = (function () {
  'use strict';
  var edges;
  var coords = new Array(width * height);
  var totalSize;

  // each node belong to a set (tree)
  // each set is defined by an array:
  // the first element is the number of points in the set
  // the second (optional) element is a pointer to a parent set

  // get the set to which the node belongs
  // in the meantime, we replace the node's set with its ultimate, parent set (if any)
  var getSet = function(node) {
    // get the node's set
    var current = node[2];
    // iterate over the set's parents
    while (current.length > 1) {
      current = current[1];
    }
    node[2] = current; // replace with the top parent
    return current;
  };

  // combine two separate sets
  var unionSet = function(set1, set2) {
    // create new set
    var newSet = [ set1[0] + set2[0] ]; // sum of number of points in each set
    // add it as parent of the two sets
    set1.push(newSet);
    set2.push(newSet);
    return newSet;
  }

  var init = function() {
    var offset = 0;
    var i, j;

    // point coordinates
    for (j = 0; j < height; j++) {
      for (i = 0; i < width; i++) {
        // (x, y, set)
        // each point belongs to an inital set with only one element
        coords[offset++] = [ 1 + 2 * i, 1 + 2 * j, [ 1 ] ];
      }
    }

    offset = 0;
    edges = [];
    // Find all initialized edges
    for (j = 0; j < height; j++) {
      for (i = 0; i < width; i++) {
        // horizontal
        if (i < width - 1) {
          edges.push([ coords[offset], coords[offset+1] ]);
        }
        // vertical
        if (j < height - 1) {
          edges.push([ coords[offset], coords[offset+width] ]);
        }
        offset++;
      }
    }

    totalSize = 0; // size of elements in the tree
  }

  var step = function() {
    if (totalSize == width * height) {
      // all nodes are found
      computeOver = true;
      return;
    }

    var set1 = 0;
    var set2 = 0;
    var u, v;

    // find two different trees to connect
    while (set1 == set2) {
      // find a remaining edge, and remove it
      var edge = edges.splice(getRandomInt(0, edges.length), 1)[0]; // get edge
      u = edge[0];
      v = edge[1];
      set1 = getSet(u);
      set2 = getSet(v);
    }

    var newSet = unionSet(set1, set2);
    u[2] = v[2] = newSet; // replace the sets
    totalSize = newSet[0]; // number of points in the new set

    // draw the points, and the edge between them
    setPixel(u32image, (u[0] + v[0]) / 2, (u[1] + v[1]) / 2, 0xFFFFFFFF);
    setPixel(u32image, u[0], u[1], 0xFFFFFFFF);
    setPixel(u32image, v[0], v[1], 0xFFFFFFFF);
  };

  return { init: init, step: step };
}());