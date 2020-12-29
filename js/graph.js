import PriorityQueue from './priorityQueue.js';

var canvas = document.getElementById('myCanvas');
canvas.width = window.innerWidth - 500;
canvas.height = window.innerHeight - 150;

var ctx = canvas.getContext('2d');

export default class Graph {
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

	dfs(startNode) {
		var visited = {};
		var ret = [];
		this.dfsUntil(startNode, visited, ret);
		return ret;
	}

	dfsUntil(vertex, visited, ret) {
		visited[vertex.nodeName] = true;
		ret.push(vertex.nodeName);

		var neighbors = this.AdjList.get(vertex);
		for (var i of neighbors) {
			if (!visited[i.nodeName]) {
				this.dfsUntil(i, visited, ret);
			}
		}
	}

	bfs(startNode) {
		var visited = {};
		var ret = [];
		var q = [];
		visited[startNode.nodeName] = true;
		ret.push(startNode.nodeName);
		q.push(startNode);
		while (q.length > 0) {
			var node = q.shift();
			var neighbors = this.AdjList.get(node);
			for (var i of neighbors) {
				if (!visited[i.nodeName]) {
					visited[i.nodeName] = true;
					ret.push(i.nodeName);
					q.push(i);
				}
			}
		}
		return ret;
	}

	bestFirstSearch(startNode, endNode, nodeArray) {
		var visited = {};
		for (var k of nodeArray) {
			visited[k.nodeName] = false;
		}
		var ret = [];
		var pq = new PriorityQueue();
		visited[startNode.nodeName] = true;
		var priority = this.euclidianDistance(endNode, startNode);
		pq.enqueue(startNode, priority);
		var path = '';
		while (!pq.isEmpty()) {
			var first = pq.front();
			path += ' ' + first.node.nodeName;
			ret.push(first.node.nodeName);
			pq.dequeue();
			if (first.node.nodeName == endNode.nodeName) {
				break;
			}
			var neighbors = this.AdjList.get(first.node);
			for (var i of neighbors) {
				if (visited[i.nodeName] == false) {
					visited[i.nodeName] = true;
					priority = this.euclidianDistance(endNode, i);
					pq.enqueue(i, priority);
				}
			}
		}
		return ret;
	}

	fillNode(node, nodeColor = '#00BA6C', textColor = '#FFFFFF') {
		ctx.beginPath();
		ctx.arc(node.x, node.y, 35, 0, 2 * Math.PI);
		ctx.fillStyle = nodeColor;
		ctx.fill();
		ctx.fillStyle = textColor;
		ctx.font = '30px Arial';
		ctx.fillText(node.nodeName, node.x - 10, node.y + 10);
		ctx.arc(node.x, node.y, 35, 0, 2 * Math.PI);
		ctx.lineWidth = 0.2;
		ctx.stroke();
	}

	aStar(start, end) {
		/*
			Open = black
			Closed = purple
			Path = green
		*/
		var openSet = [];
		var closedSet = [];
		var path = [];
		var done = false;
		openSet.push(start);

		const interval = setInterval(() => {
			if (openSet.length > 0) {
				var winner = 0;
				for (var i = 0; i < openSet.length; i++) {
					if (openSet[i].f < openSet[winner].f) {
						winner = i;
					}
				}
				var current = openSet[winner];
				if (current === end) {
					done = true;
				}
				this.removeFromArray(openSet, current);
				closedSet.push(current);

				var neighbors = this.AdjList.get(current);
				for (var i = 0; i < neighbors.length; i++) {
					var neighbor = neighbors[i];
					if (!closedSet.includes(neighbor)) {
						var newPath = false;
						var tempG =
							current.g +
							this.manhattanDistance(
								current.x,
								current.y,
								neighbor.x,
								neighbor.y
							);
						if (openSet.includes(neighbor)) {
							if (tempG < neighbor.g) {
								newPath = true;
								neighbor.g = tempG;
							}
						} else {
							newPath = true;
							neighbor.g = tempG;
							openSet.push(neighbor);
						}
						if (newPath) {
							neighbor.h = this.euclidianDistance(neighbor, end);
							neighbor.f = neighbor.h + neighbor.g;
							neighbor.previous = current;
						}
					}
				}
			} else {
				done = true;
				// display path in side panel
				const p = document.createElement('p');
				var operations = document.getElementById('operations');
				p.innerHTML = `A* Path: No Solution`;
				operations.appendChild(p);
				clearInterval(interval);
				return;
			}
			path = [];
			var temp = current;
			path.push(temp);
			while (temp.previous) {
				path.push(temp.previous);
				temp = temp.previous;
			}

			for (var node of openSet) {
				this.fillNode(node, '#000', '#FFF');
			}

			for (var node of closedSet) {
				this.fillNode(node, 'purple', '#FFF');
			}

			for (var node of path) {
				this.fillNode(node, 'green', '#FFF');
			}

			if (done) {
				clearInterval(interval);
				var result = '';

				for (var i of path) {
					result = i.nodeName + ' ' + result;
				}
				// display path in side panel
				const p = document.createElement('p');
				var operations = document.getElementById('operations');
				p.innerHTML = `A* Path: ${result}`;
				operations.appendChild(p);
			}
		}, 1000);
	}

	euclidianDistance(startNode, endNode) {
		var dist = Math.sqrt(
			(startNode.x - endNode.x) ** 2 + (startNode.y - endNode.y) ** 2
		);

		return dist;
	}

	removeFromArray(arr, element) {
		for (var i = arr.length - 1; i >= 0; i--) {
			if (arr[i] == element) {
				arr.splice(i, 1);
			}
		}
	}

	manhattanDistance(x1, y1, x2, y2) {
		var dist = Math.abs(x1 - x2) + Math.abs(y1 - y2);
		return dist;
	}
}
