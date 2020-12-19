class Graph {
	constructor() {
		this.AdjList = new Map();
	}

	addVertex(v) {
		this.AdjList.set(v, []);
	}

	addEdge(start, end) {
		this.AdjList.get(start).push(end);
		this.AdjList.get(end).push(start);
	}

	printGraph() {
		var graph_keys = this.AdjList.keys();

		for (var i of graph_keys) {
			var node_neighbors = this.AdjList.get(i);
			var conc = '';
			for (var j of node_neighbors) {
				conc += j + ' ';
			}
			console.log(`${i}: ${conc}`);
		}
	}

	dfs(startNode) {
		console.log('DFS:');
		var visited = {};
		this.dfsUntil(startNode, visited);
	}

	dfsUntil(vertex, visited) {
		console.log(vertex);
		visited[vertex] = true;

		var neighbors = this.AdjList.get(vertex);

		for (var i of neighbors) {
			if (!visited[i]) {
				this.dfsUntil(i, visited);
			}
		}
	}

	bfs(startNode) {
		console.log('BFS:');
		var visited = {};
		var q = [];
		visited[startNode] = true;
		q.push(startNode);
		while (q.length > 0) {
			var node = q.shift();
			console.log(node);
			var neighbors = this.AdjList.get(node);
			for (var i of neighbors) {
				if (!visited[i]) {
					visited[i] = true;
					q.push(i);
				}
			}
		}
	}

	bestFirstSearch(startNode, endNode) {
		var visited = {};
		for (var k of co_ordinates) {
			visited[k[0]] = false;
		}
		var ret = [];
		var pq = new PriorityQueue();
		visited[startNode] = true;
		var priority = this.euclidianDistance(endNode, startNode);
		pq.enqueue(startNode, priority);
		var path = '';
		while (!pq.isEmpty()) {
			var first = pq.front();
			path += ' ' + first.nodeName;
			ret.push(first.nodeName);
			pq.dequeue();
			if (first.nodeName == endNode) {
				break;
			}
			var neighbors = this.AdjList.get(first.nodeName);
			for (var i of neighbors) {
				if (visited[i] == false) {
					visited[i] = true;
					priority = this.euclidianDistance(endNode, i);
					pq.enqueue(i, priority);
				}
			}
		}
		console.log(path);
		return ret;
	}

	euclidianDistance(startNode, endNode) {
		var dist = Math.sqrt(
			(co_ordinates.get(startNode)[0] - co_ordinates.get(endNode)[0]) **
				2 +
				(co_ordinates.get(startNode)[1] -
					co_ordinates.get(endNode)[1]) **
					2
		);

		return dist;
	}
}

// Class to store priority queue's elements
class QElement {
	constructor(nodeName, priority) {
		this.nodeName = nodeName;
		this.priority = priority;
	}
}

// PriorityQueue class
class PriorityQueue {
	constructor() {
		this.items = [];
	}

	enqueue(nodeName, priority) {
		var qElement = new QElement(nodeName, priority);
		var contain = false;

		for (var i = 0; i < this.items.length; i++) {
			if (this.items[i].priority > qElement.priority) {
				this.items.splice(i, 0, qElement);
				contain = true;
				break;
			}
		}

		// if the element has the highest priority
		// it is added at the end of the queue
		if (!contain) {
			this.items.push(qElement);
		}
	}

	dequeue() {
		if (this.isEmpty()) {
			return 'Underflow';
		}
		return this.items.shift();
	}

	front() {
		if (this.isEmpty()) {
			return 'No elements in Queue';
		}
		return this.items[0];
	}

	isEmpty() {
		return this.items.length == 0;
	}

	printPQueue() {
		var str = '';
		for (var i = 0; i < this.items.length; i++)
			str += this.items[i].element + ' ';
		return str;
	}
}

var g = new Graph();
var vertices = ['A', 'B', 'C', 'D', 'E', 'F'];
var co_ordinates = new Map();

co_ordinates.set('A', [5, 10]);
co_ordinates.set('B', [10, 10]);
co_ordinates.set('C', [10, 20]);
co_ordinates.set('D', [20, 15]);
co_ordinates.set('E', [30, 10]);
// co_ordinates.set('F', [500, 300]);

// adding vertices
for (var i = 0; i < vertices.length; i++) {
	g.addVertex(vertices[i]);
}

// adding edges
g.addEdge('A', 'B');
g.addEdge('A', 'C');
g.addEdge('B', 'D');
g.addEdge('B', 'E');
g.addEdge('D', 'E');
g.addEdge('C', 'E');

console.log('Start Node:');

g.bestFirstSearch('C', 'A');
