/*

    Canvas Initialization

*/
var canvas = document.getElementById('myCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 100;

var ctx = canvas.getContext('2d');

// Fill with Red Background
ctx.fillStyle = '#FF0000';
ctx.fillRect(0, 0, 1000, 650);

/*

    GRAPH

*/

class Graph {
	constructor() {
		this.AdjList = new Map();
	}

	addVertex(v) {
		this.AdjList.set(v, []);
	}

	addEdge(startNode, endNode) {
		this.AdjList.get(startNode).push(endNode);
		this.AdjList.get(endNode).push(startNode);
		drawEdge(startNode, endNode);
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
}

/*

    NODE

*/

class Node {
	constructor(nodeName, x, y) {
		this.nodeName = nodeName;
		this.x = x;
		this.y = y;
	}

	// Fills the node with the specified color
	fillNode(fillStyle) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, 35, 0, 2 * Math.PI);
		ctx.fillStyle = fillStyle;
		ctx.fill();
		ctx.fillStyle = '#000';
		ctx.font = '30px Arial';
		ctx.fillText(this.nodeName, this.x - 10, this.y + 10);
	}

	// Check if the Clicked Point is approx. near to the Node
	isPointInNode(mouseX, mouseY) {
		if (Math.abs(mouseX - this.x) < 40 && Math.abs(mouseY - this.y) < 40) {
			return true;
		}
	}
}

/*

	Utitly functions
	
*/
// Gets Cursor's X and Y co-ordinates
function getCursorPosition(canvas, event) {
	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;
	console.log('x: ' + x + ' y: ' + y);
	return [x, y];
}

// Adds Node to the GRAPH and fills it
function createNode(event) {
	var [x, y] = getCursorPosition(canvas, event);
	console.log(nodeName);
	co_ordinates.set(nodeName, [x, y]);
	g.addVertex(nodeName);
	var newNode = new Node(nodeName, x, y);
	newNode.fillNode('blue');
	nodeArray.push(newNode);
	//Update next Node's Name
	nodeName = String.fromCharCode(nodeName.charCodeAt(0) + 1);
}

// Draws an Edge Between StartNode and EndNode
function drawEdge(startNode, endNode) {
	ctx.beginPath();
	ctx.strokeStyle = '#000';
	ctx.moveTo(startNode.x, startNode.y);
	ctx.lineTo(endNode.x, endNode.y);
	ctx.stroke();
}

function getStartNode(event) {
	console.log('MouseDown');
	var [x, y] = getCursorPosition(canvas, event);
	for (var i of nodeArray) {
		if (i.isPointInNode(x, y)) {
			startNode = i;
			break;
		}
	}
}

function getEndNode(event) {
	console.log('MouseUp');
	var [x, y] = getCursorPosition(canvas, event);
	for (var j of nodeArray) {
		if (j.isPointInNode(x, y) && j.nodeName != startNode.nodeName) {
			endNode = j;
			break;
		}
	}
	if (startNode != undefined && endNode != undefined) {
		startNode.fillNode('cyan');
		endNode.fillNode('cyan');
		drawEdge(startNode, endNode);
		g.addEdge(startNode.nodeName, endNode.nodeName);
		console.log('EDGE DRAWN');
		console.log(g);
	}
}

var nodeArray = []; // Store all the NODES in an array
var nodeName = 'A'; // First Node's Name
var mode = undefined; // Draw Mode (Vertex or Edge)

var g = new Graph();
var co_ordinates = new Map(); // Stores the co-ordinates of all the nodes

var bfsButton = document.getElementById('bfsButton');
var vertexButton = document.getElementById('vertexButton');
var edgeButton = document.getElementById('edgeButton');

bfsButton.addEventListener('click', () => {
	console.log(g);
	var bfs = g.bfs('A');
	console.log(co_ordinates);
	var i = 0;
	const interval = setInterval(() => {
		if (i == co_ordinates.size - 1) {
			clearInterval(interval);
		}
		var index = nodeArray.findIndex((j) => {
			return j.nodeName == bfs[i];
		});
		nodeArray[index].fillNode('yellow');
		ctx.fillStyle = '#000';
		ctx.font = '30px Arial';
		ctx.fillText(
			bfs[i],
			co_ordinates.get(bfs[i])[0] - 10,
			co_ordinates.get(bfs[i])[1] + 10
		);
		i += 1;
	}, 1000);
});

vertexButton.addEventListener('click', () => {
	canvas.removeEventListener('mousedown', getStartNode);
	canvas.removeEventListener('mouseup', getEndNode);
	mode = 'vertex';
	console.log(`Mode: ${mode}`);
	canvas.addEventListener('click', createNode);
});

edgeButton.addEventListener('click', () => {
	canvas.removeEventListener('click', createNode);
	mode = 'edge';
	console.log(`Mode: ${mode}`);

	canvas.addEventListener('mousedown', getStartNode);

	canvas.addEventListener('mouseup', getEndNode);
});
