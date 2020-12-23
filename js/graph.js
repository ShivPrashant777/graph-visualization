var canvas = document.getElementById('myCanvas');
canvas.width = window.innerWidth - 500;
canvas.height = window.innerHeight - 150;

var ctx = canvas.getContext('2d');


import PriorityQueue from './priorityQueue.js';
export class Graph {
	constructor() {
		this.AdjList = new Map();
	}

	temp(){
		ctx.fillStyle = 'red';
		ctx.fillRect(100, 100, 100, 100);
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
		this.temp();
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

	aStar(start, end){
		var openSet = [];
		var closedSet = [];
		var path = [];
		var done = false;
		openSet.push(start);
		while(!done){
			if(openSet.length > 0){
				var winner = 0;
				for(var i = 0; i < openSet.length; i++){
					if(openSet[i].f < openSet[winner].f){
						winner = i;
					}
				}
				var current = openSet[winner];
				if(current === end){
					console.log(end);
					done = true;

				}
				this.removeFromArray(openSet, current);
				closedSet.push(current);
				var neighbors = this.AdjList.get(current);
				for(var i = 0; i < neighbors.length; i++){
					var neighbor = neighbors[i];
					if(!closedSet.includes(neighbor)){
						var newPath = false;
						// var tempG = current.g + this.euclidianDistance(
						// 	current.nodeName, neighbor.nodeName
						// 	);
						var tempG = current.g + this.manhattanDistance(
							current.x, current.y, neighbor.x, neighbor.y);
						if(openSet.includes(current)){
							if(tempG < neighbor.g){
								newPath = true;
								neighbor.g = tempG;
							}
						}
						else{
							newPath = true;
							neighbor.g = tempG;
							openSet.push(neighbor);
						}
						if(newPath){
							neighbor.h = this.euclidianDistance(neighbor.nodeName, end.nodeName);
							neighbor.f = neighbor.h + neighbor.g;
							neighbor.previous = current;
						}

					}
				}
			}
			else{
				done = true;
				console.log("No Solution");
			}
			path = [];
			var temp = current;
			path.push(temp);
			while(temp.previous){
				path.push(temp.previous);
				temp = temp.previous;
			}
		}
		console.log("A*: ");
		console.log(path);
		return path;
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

	removeFromArray(arr, elt){
		for(var i = arr.length - 1; i >= 0; i--){
			if(arr[i] == elt){
				arr.splice(i, 1);
			}
		}
	}

	manhattanDistance(x1, y1, x2, y2){
		var dist = (Math.abs(x1 - x2) + Math.abs(y1 - y2));
		return dist;
	}
}

export var co_ordinates = new Map(); // Stores the co-ordinates of all the nodes
