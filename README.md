# Algovisualizer

## About

This is a web project that I built in order to showcase the knowledge of different algorithms I gained from my Data Structures and Algorithms Course. It's my hope that this project can be used by other students learning these algorithms, in order to help them visualize and conceptualize what each algorithm does. Users can either draw a maze on the grid themselves, or utilize one of two algorithms in order to generate a maze for them, before visualizing one of five different pathfinding algorithms. Can be found at oneilljp.github.io/projects.html

## Features:

- The ability to draw any type of maze with your mouse in order to better understand each algorithm
- Optional Key Tile, which is required to be found before the end tile can be accessed
- Optional Weighted Tiles, which are considered more costly to traverse by the algorithms listed as _weighted_ below. Has no affect on _unweighted_ algorithms
- Execution Speed Control
- Tile Color Reference Table, in order to understand how the algorithms view each tile during execution

## Algorithms:

### Maze Generation:

- **Prim's:** Generate a Minimum Spanning Tree (MST) starting at the start tile. Randomly branches out from this tile expanding the tree, while avoiding creating cycles.
- **Kruskal's** Another MST generating algorithm. This algorithm works by adding each tile to a disjoint set data structure, randomly creating a "forest" of empty tile trees, merging trees when appropriate. Wall's are only turned into empty tiles when their removal will not result in a cycle.

_Note:_ As both of these algorithms produce minimum spanning trees, there will always be only one path from the start tile to the end tile. If you would like to see which algorithms consistently find optimal paths, you can remove extra walls after generation to give the algorithms more options.

### Pathfinding:

- **Depth-First-Search (Unweighted):** A tree traversal algorithm that explores as far as possible down a given path before backtracking, until the end is found. Implemented using a stack (FILO) data structure. Does not always produce the optimal path.
- **Breadth-First-Search (Unweighted):** A tree traversal algorithm similar to Depth First Search. Searches all neighbor tiles of a given tile before traversing deeper down individual branches. Implemented using a queue (FIFO) data structure. Guaranteed to produce the optimal path.
- **Dijkstra's (Weighted):** An algorithm that finds the shortest path from a root tile to all other tiles on the grid, finding the shortest path to the end tile in the process. Selects unvisited nodes with the shortest distance away from the root to traverse to in each iteration. When using a completely unweighted grid, it is functionally the same as Breadth-First-Search. Guaranteed to produce the optimal path.
- **Biased Dijkstra's (Weighted)**: A variant of Dijktra's that I accidentally implemented while trying to implement A-Star. Operates in the same fashion as Dijkstra's algorithm, but also considers a tile's distance away from the end tile when deciding which branch of the tree to extend. Does not always produce the optimal path.
- **A-Star (Weighted)**: A very popular pathfinding algorithm that sacrifices space for speed. This algorithm uses a heuristic, in this implementation it is the manhattan distance of a tile from the end tile, and the distance from the start tile in order to determine which tile is the most optimal to search from. Implemented using a priority queue data structure. Guaranteed to produce the optimal path

## Inspired By:

[clementmihailescu](https://github.com/clementmihailescu/Pathfinding-Visualizer)
