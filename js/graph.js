import PriorityQueue from './priorityQueue.js';

export default class Graph {
	constructor() {
		this.nodes = [];
		this.adjList = new Map();
		this.nodeCount = 0;
	}

	// Generate label for the next node (Excel Style)
	getNodeLabel(index) {
		let label = '';
		while (index >= 0) {
			label = String.fromCharCode((index % 26) + 65) + label;
			index = Math.floor(index / 26) - 1;
		}
		return label;
	}

	addNode(x, y) {
		const id = this.getNodeLabel(this.nodeCount++);
		const node = { x, y, id };
		this.nodes.push(node);
		this.adjList.set(id, []);
		return node;
	}

	addEdge(node1Id, node2Id) {
		if (this.adjList.has(node1Id) && this.adjList.has(node2Id)) {
			if (!this.adjList.get(node1Id).includes(node2Id)) {
				this.adjList.get(node1Id).push(node2Id);
			}
			if (!this.adjList.get(node2Id).includes(node1Id)) {
				this.adjList.get(node2Id).push(node1Id);
			}
		}
	}

	// check if an edge exists between two nodes
	hasEdge(node1Id, node2Id) {
		return (
			this.adjList.get(node1Id) && this.adjList.get(node1Id).includes(node2Id)
		);
	}

	getNodes() {
		return this.nodes;
	}

	removeNode(nodeId) {
		this.nodes = this.nodes.filter((node) => node.id !== nodeId);
		this.adjList.delete(nodeId);

		// Remove this node from others' adjacency lists
		for (const [key, neighbors] of this.adjList.entries()) {
			this.adjList.set(
				key,
				neighbors.filter((n) => n !== nodeId)
			);
		}
	}

	getEdges(nodeId) {
		return this.adjList.get(nodeId) || [];
	}

	getAdjList() {
		return this.adjList;
	}

	async dfs(startNodeId, visitCallback, delay = 1000) {
		const visited = new Set();

		const dfsHelper = async (id) => {
			if (visited.has(id)) return;
			visited.add(id);
			visitCallback(id);
			await new Promise((res) => setTimeout(res, delay)); // animation delay

			for (const neighbor of this.adjList.get(id) || []) {
				await dfsHelper(neighbor);
			}
		};

		await dfsHelper(startNodeId);
	}

	async bfs(startNodeId, visitCallback, delay = 1000) {
		const visited = new Set();
		const queue = [startNodeId];
		visited.add(startNodeId);

		while (queue.length > 0) {
			const current = queue.shift();
			visitCallback(current);
			await new Promise((res) => setTimeout(res, delay)); // animation delay

			for (const neighbor of this.adjList.get(current) || []) {
				if (!visited.has(neighbor)) {
					visited.add(neighbor);
					queue.push(neighbor);
				}
			}
		}
	}

	// bestFirstSearch(startNode, endNode, nodeArray) {
	// 	var visited = {};
	// 	for (var k of nodeArray) {
	// 		visited[k.nodeName] = false;
	// 	}
	// 	var ret = [];
	// 	var pq = new PriorityQueue();
	// 	visited[startNode.nodeName] = true;
	// 	var priority = this.euclidianDistance(endNode, startNode);
	// 	pq.enqueue(startNode, priority);
	// 	var path = '';
	// 	while (!pq.isEmpty()) {
	// 		var first = pq.front();
	// 		path += ' ' + first.node.nodeName;
	// 		ret.push(first.node.nodeName);
	// 		pq.dequeue();
	// 		if (first.node.nodeName == endNode.nodeName) {
	// 			break;
	// 		}
	// 		var neighbors = this.AdjList.get(first.node);
	// 		for (var i of neighbors) {
	// 			if (visited[i.nodeName] == false) {
	// 				visited[i.nodeName] = true;
	// 				priority = this.euclidianDistance(endNode, i);
	// 				pq.enqueue(i, priority);
	// 			}
	// 		}
	// 	}
	// 	return ret;
	// }

	// fillNode(node, nodeColor = '#00BA6C', textColor = '#FFFFFF') {
	// 	ctx.beginPath();
	// 	ctx.arc(node.x, node.y, 35, 0, 2 * Math.PI);
	// 	ctx.fillStyle = nodeColor;
	// 	ctx.fill();
	// 	ctx.fillStyle = textColor;
	// 	ctx.font = '30px Arial';
	// 	ctx.fillText(node.nodeName, node.x - 10, node.y + 10);
	// 	ctx.arc(node.x, node.y, 35, 0, 2 * Math.PI);
	// 	ctx.lineWidth = 0.2;
	// 	ctx.stroke();
	// }

	// aStar(start, end) {
	// 	/*
	// 		Open = black
	// 		Closed = purple
	// 		Path = green
	// 	*/
	// 	var openSet = [];
	// 	var closedSet = [];
	// 	var path = [];
	// 	var done = false;
	// 	openSet.push(start);

	// 	const interval = setInterval(() => {
	// 		if (openSet.length > 0) {
	// 			var winner = 0;
	// 			for (var i = 0; i < openSet.length; i++) {
	// 				if (openSet[i].f < openSet[winner].f) {
	// 					winner = i;
	// 				}
	// 			}
	// 			var current = openSet[winner];
	// 			if (current === end) {
	// 				done = true;
	// 			}
	// 			this.removeFromArray(openSet, current);
	// 			closedSet.push(current);

	// 			var neighbors = this.AdjList.get(current);
	// 			for (var i = 0; i < neighbors.length; i++) {
	// 				var neighbor = neighbors[i];
	// 				if (!closedSet.includes(neighbor)) {
	// 					var newPath = false;
	// 					var tempG =
	// 						current.g +
	// 						this.manhattanDistance(
	// 							current.x,
	// 							current.y,
	// 							neighbor.x,
	// 							neighbor.y
	// 						);
	// 					if (openSet.includes(neighbor)) {
	// 						if (tempG < neighbor.g) {
	// 							newPath = true;
	// 							neighbor.g = tempG;
	// 						}
	// 					} else {
	// 						newPath = true;
	// 						neighbor.g = tempG;
	// 						openSet.push(neighbor);
	// 					}
	// 					if (newPath) {
	// 						neighbor.h = this.euclidianDistance(neighbor, end);
	// 						neighbor.f = neighbor.h + neighbor.g;
	// 						neighbor.previous = current;
	// 					}
	// 				}
	// 			}
	// 		} else {
	// 			done = true;
	// 			// display path in side panel
	// 			const p = document.createElement('p');
	// 			var operations = document.getElementById('operations');
	// 			p.innerHTML = `A* Path: No Solution`;
	// 			operations.appendChild(p);
	// 			clearInterval(interval);
	// 			return;
	// 		}
	// 		path = [];
	// 		var temp = current;
	// 		path.push(temp);
	// 		while (temp.previous) {
	// 			path.push(temp.previous);
	// 			temp = temp.previous;
	// 		}

	// 		for (var node of openSet) {
	// 			this.fillNode(node, '#000', '#FFF');
	// 		}

	// 		for (var node of closedSet) {
	// 			this.fillNode(node, 'purple', '#FFF');
	// 		}

	// 		for (var node of path) {
	// 			this.fillNode(node, 'green', '#FFF');
	// 		}

	// 		if (done) {
	// 			clearInterval(interval);
	// 			var result = '';

	// 			for (var i of path) {
	// 				result = i.nodeName + ' ' + result;
	// 			}
	// 			// display path in side panel
	// 			const p = document.createElement('p');
	// 			var operations = document.getElementById('operations');
	// 			p.innerHTML = `A* Path: ${result}`;
	// 			operations.appendChild(p);
	// 		}
	// 	}, 1000);
	// }

	// euclidianDistance(startNode, endNode) {
	// 	var dist = Math.sqrt(
	// 		(startNode.x - endNode.x) ** 2 + (startNode.y - endNode.y) ** 2
	// 	);

	// 	return dist;
	// }

	// removeFromArray(arr, element) {
	// 	for (var i = arr.length - 1; i >= 0; i--) {
	// 		if (arr[i] == element) {
	// 			arr.splice(i, 1);
	// 		}
	// 	}
	// }

	// manhattanDistance(x1, y1, x2, y2) {
	// 	var dist = Math.abs(x1 - x2) + Math.abs(y1 - y2);
	// 	return dist;
	// }
}
