/*

    Canvas Stuff

*/
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
ctx.fillStyle = '#FF0000';
ctx.fillRect(0, 0, 1000, 650);

var co_ordinates = new Map();
co_ordinates.set('A', [200, 200]);
co_ordinates.set('B', [500, 100]);
co_ordinates.set('C', [800, 200]);
co_ordinates.set('D', [200, 500]);
co_ordinates.set('E', [500, 500]);
co_ordinates.set('F', [800, 500]);

var nodes = ['A', 'B', 'C', 'D', 'E', 'F'];

for (var i of nodes) {
	ctx.beginPath();
	ctx.arc(co_ordinates.get(i)[0], co_ordinates.get(i)[1], 40, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.fillStyle = '#FFFFFF';
	ctx.font = '30px Arial';
	ctx.fillText(i, co_ordinates.get(i)[0] - 10, co_ordinates.get(i)[1] + 10);
}

/*

    GRAPH

*/

class Graph {
	constructor(numberOfVertices) {
		this.numberOfVertices = numberOfVertices;
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
				this.drawEdge(i, j);
				conc += j + ' ';
			}
			console.log(`${i}: ${conc}`);
		}
	}

	drawEdge(startNode, endNode) {
		ctx.strokeStyle = '#FFFFFF';
		ctx.moveTo(
			co_ordinates.get(startNode)[0],
			co_ordinates.get(startNode)[1]
		);
		ctx.lineTo(co_ordinates.get(endNode)[0], co_ordinates.get(endNode)[1]);
		ctx.stroke();
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
		var ret = [];
		var q = [];
		visited[startNode] = true;
		ret.push(startNode);
		//this.fillNode(startNode);
		q.push(startNode);
		while (q.length > 0) {
			var node = q.shift();
			console.log(node);
			var neighbors = this.AdjList.get(node);
			for (var i of neighbors) {
				if (!visited[i]) {
					visited[i] = true;
					ret.push(i);
					//this.fillNode(i, 'blue');
					q.push(i);
				}
			}
		}
		return ret;
	}
}

function fillNode(node, fillStyle) {
	ctx.beginPath();
	ctx.arc(
		co_ordinates.get(node)[0],
		co_ordinates.get(node)[1],
		35,
		0,
		2 * Math.PI
	);
	ctx.fillStyle = fillStyle;
	ctx.fill();
}

var g = new Graph(6);
var vertices = ['A', 'B', 'C', 'D', 'E', 'F'];

// adding vertices
for (var i = 0; i < vertices.length; i++) {
	g.addVertex(vertices[i]);
}

// adding edges
g.addEdge('A', 'B');
g.addEdge('A', 'D');
g.addEdge('A', 'E');
g.addEdge('B', 'C');
g.addEdge('D', 'E');
g.addEdge('E', 'F');
g.addEdge('E', 'C');
g.addEdge('C', 'F');

g.printGraph();
console.log('Start Node:');

g.dfs('A');
g.bfs('A');

var bfs = g.bfs('A');

var button = document.getElementById('myButton');

button.addEventListener('click', () => {
	var i = 0;
	setInterval(() => {
		fillNode(bfs[i], 'yellow');
		ctx.fillStyle = '#000	';
		ctx.font = '30px Arial';
		ctx.fillText(
			bfs[i],
			co_ordinates.get(bfs[i])[0] - 10,
			co_ordinates.get(bfs[i])[1] + 10
		);
		i += 1;
	}, 1000);
});
