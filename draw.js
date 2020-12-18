/*

    Canvas Stuff

*/
var canvas = document.getElementById('myCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 100;

var ctx = canvas.getContext('2d');
ctx.fillStyle = '#FF0000';
ctx.fillRect(0, 0, 1000, 650);

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

class Node {
	constructor(nodeName, x, y) {
		this.nodeName = nodeName;
		this.x = x;
		this.y = y;
	}

	fillNode(nodeName, fillStyle) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, 35, 0, 2 * Math.PI);
		ctx.fillStyle = fillStyle;
		ctx.fill();
		ctx.fillStyle = '#000';
		ctx.font = '30px Arial';
		ctx.fillText(nodeName, this.x - 10, this.y + 10);
	}

	isPointInNode(mouseX, mouseY) {
		if (Math.abs(mouseX - this.x) < 40 && Math.abs(mouseY - this.y) < 40) {
			return true;
		}
	}
}

/*

	Utitly functions
	
*/

// Fills the node with the specified color
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
	ctx.fillStyle = '#000';
	ctx.font = '30px Arial';
	ctx.fillText(
		node,
		co_ordinates.get(node)[0] - 10,
		co_ordinates.get(node)[1] + 10
	);
}

var nodeArray = [];

// Adds Node to the graph and fills it
function createNode(event) {
	var [x, y] = getCursorPosition(canvas, event);
	console.log(nodeName);
	co_ordinates.set(nodeName, [x, y]);
	g.addVertex(nodeName);
	var newNode = new Node(nodeName, x, y);
	newNode.fillNode(nodeName, 'blue');
	nodeArray.push(newNode);
	//Update next Node's Name
	nodeName = String.fromCharCode(nodeName.charCodeAt(0) + 1);
}

// Draws an Edge Between StartNode and EndNode
function drawEdge(startNode, endNode) {
	ctx.strokeStyle = '#FFFFFF';
	ctx.beginPath();
	ctx.moveTo(co_ordinates.get(startNode)[0], co_ordinates.get(startNode)[1]);
	ctx.lineTo(co_ordinates.get(endNode)[0], co_ordinates.get(endNode)[1]);
	ctx.stroke();
}

// Gets Cursor's X and Y co-ordinates
function getCursorPosition(canvas, event) {
	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;
	console.log('x: ' + x + ' y: ' + y);
	return [x, y];
}

var nodeName = 'A';
var mode = undefined;

var g = new Graph(6);
// var vertices = ['A', 'B', 'C', 'D', 'E', 'F'];

var co_ordinates = new Map();
// co_ordinates.set('A', [200, 200]);
// co_ordinates.set('B', [500, 100]);
// co_ordinates.set('C', [800, 200]);
// co_ordinates.set('D', [200, 500]);
// co_ordinates.set('E', [500, 500]);
// co_ordinates.set('F', [800, 500]);

// // adding vertices
// for (var i of vertices) {
// 	g.addVertex(i);
// 	fillNode(i, 'pink');
// }

// // adding edges
// g.addEdge('A', 'B');
// g.addEdge('A', 'D');
// g.addEdge('A', 'E');
// g.addEdge('B', 'C');
// g.addEdge('D', 'E');
// g.addEdge('E', 'F');
// g.addEdge('E', 'C');
// g.addEdge('C', 'F');

// g.printGraph();
// console.log('Start Node:');

// g.dfs('A');
// g.bfs('A');

var bfsButton = document.getElementById('bfsButton');
var vertexButton = document.getElementById('vertexButton');
var edgeButton = document.getElementById('edgeButton');

bfsButton.addEventListener('click', () => {
	console.log(g);
	bfs = g.bfs('A');
	console.log(co_ordinates);
	var i = 0;
	const interval = setInterval(() => {
		if (i == co_ordinates.size - 1) {
			clearInterval(interval);
		}
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

vertexButton.addEventListener('click', () => {
	mode = 'vertex';
	console.log(`Mode: ${mode}`);
	canvas.addEventListener('click', createNode);
});

edgeButton.addEventListener('click', () => {
	canvas.removeEventListener('click', createNode);
	mode = 'edge';
	console.log(`Mode: ${mode}`);
	var startNode,
		endNode = undefined;
	canvas.addEventListener('mousedown', function (event) {
		console.log('MouseDown');
		var [x, y] = getCursorPosition(canvas, event);
		for (var i of nodeArray) {
			if (i.isPointInNode(x, y)) {
				startNode = i;
				break;
			}
		}
	});

	canvas.addEventListener('mouseup', function (event) {
		console.log('MouseUp');
		var [x, y] = getCursorPosition(canvas, event);
		for (var j of nodeArray) {
			if (j.isPointInNode(x, y) && j.nodeName != startNode.nodeName) {
				endNode = j;
				break;
			}
		}
		if (startNode != undefined && endNode != undefined) {
			fillNode(startNode.nodeName, 'cyan');
			fillNode(endNode.nodeName, 'cyan');
			ctx.strokeStyle = '#000';
			ctx.moveTo(startNode.x, startNode.y);
			ctx.lineTo(endNode.x, endNode.y);
			ctx.stroke();
			g.addEdge(startNode.nodeName, endNode.nodeName);
			console.log('EDGE DRAWN');
			console.log(g);
		}
	});
});

//
// DRAWING EDGE
//

// var flag = false,
// 	prevX = 0,
// 	currX = 0,
// 	prevY = 0,
// 	currY = 0,
// 	dot_flag = false;
// var x = 'black',
// 	y = 2;

// canvas.addEventListener(
// 	'mousemove',
// 	function (e) {
// 		findxy('move', e);
// 	},
// 	false
// );
// canvas.addEventListener(
// 	'mousedown',
// 	function (e) {
// 		findxy('down', e);
// 	},
// 	false
// );
// canvas.addEventListener(
// 	'mouseup',
// 	function (e) {
// 		findxy('up', e);
// 	},
// 	false
// );
// canvas.addEventListener(
// 	'mouseout',
// 	function (e) {
// 		findxy('out', e);
// 	},
// 	false
// );

// function draw() {
// 	ctx.beginPath();
// 	ctx.moveTo(prevX, prevY);
// 	ctx.lineTo(currX, currY);
// 	ctx.strokeStyle = x;
// 	ctx.lineWidth = y;
// 	ctx.stroke();
// 	ctx.closePath();
// }

// function findxy(res, e) {
// 	if (res == 'down') {
// 		prevX = currX;
// 		prevY = currY;
// 		currX = e.clientX - canvas.offsetLeft;
// 		currY = e.clientY - canvas.offsetTop;

// 		flag = true;
// 		dot_flag = true;
// 		if (dot_flag) {
// 			ctx.beginPath();
// 			ctx.fillStyle = x;
// 			ctx.fillRect(currX, currY, 2, 2);
// 			ctx.closePath();
// 			dot_flag = false;
// 		}
// 	}
// 	if (res == 'up' || res == 'out') {
// 		prevX = currX;
// 		prevY = currY;
// 		currX = e.clientX - canvas.offsetLeft;
// 		currY = e.clientY - canvas.offsetTop;
// 		draw();
// 	}
// }
