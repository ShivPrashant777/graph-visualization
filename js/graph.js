import PriorityQueue from './priorityQueue.js';
export class Graph {
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
		var ret = [];
		this.dfsUntil(startNode, visited, ret);
		return ret;
	}

	dfsUntil(vertex, visited, ret) {
		console.log(vertex);
		visited[vertex] = true;
		ret.push(vertex);

		var neighbors = this.AdjList.get(vertex);

		for (var i of neighbors) {
			if (!visited[i]) {
				this.dfsUntil(i, visited, ret);
			}
		}
	}

	bfs(startNode) {
		console.log('BFS:');
		var visited = {};
		var ret = [];
		var q = [];
		visited[startNode] = true;
		ret.push(startNode);
		q.push(startNode);
		while (q.length > 0) {
			var node = q.shift();
			console.log(node);
			var neighbors = this.AdjList.get(node);
			for (var i of neighbors) {
				if (!visited[i]) {
					visited[i] = true;
					ret.push(i);
					q.push(i);
				}
			}
		}
		return ret;
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

export var co_ordinates = new Map(); // Stores the co-ordinates of all the nodes
