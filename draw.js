/*

    Canvas Initialization

*/
var canvas = document.getElementById('myCanvas');
canvas.width = window.innerWidth - 500;
canvas.height = window.innerHeight - 150;

var ctx = canvas.getContext('2d');

// Fill with Red Background
ctx.fillStyle = 'rgb(240, 240, 240)';
ctx.fillRect(0, 0, canvas.width, canvas.height);

/*

    PRIORITY QUEUE

*/

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
	fillNode(nodeColor, textColor) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, 35, 0, 2 * Math.PI);
		ctx.fillStyle = nodeColor;
		ctx.fill();
		ctx.fillStyle = textColor;
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

var displayPanel = document.getElementById('display-panel');
var modeName = document.getElementById('mode-name');

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
	newNode.fillNode('#025951', '#F0F2F2');
	nodeArray.push(newNode);

	// Display the operation in side panel
	const p = document.createElement('p');
	p.innerHTML = `Created Vertex: ${nodeName}`;
	displayPanel.appendChild(p);
	autoScrollDown();

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
	// Display the operation in side panel
	const p = document.createElement('p');
	p.innerHTML = `Created Edge From ${startNode.nodeName} to ${endNode.nodeName}`;
	displayPanel.appendChild(p);
	autoScrollDown();
}

// Get the starting node for drawing an edge
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

// Get the ending node for drawing an edge
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
		startNode.fillNode('#F24501', '#FFF');
		endNode.fillNode('#F24501', '#FFF');
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

var vertexButton = document.getElementById('vertexButton');
var edgeButton = document.getElementById('edgeButton');
var bfsButton = document.getElementById('bfsButton');
var dfsButton = document.getElementById('dfsButton');
var bestFirstSearchButton = document.getElementById('bestFirstSearchButton');
var startingNode = document.getElementById('start-node');
var endingNode = document.getElementById('end-node');

vertexButton.addEventListener('click', () => {
	vertexButton.setAttribute('data-clicked', 'true');
	edgeButton.setAttribute('data-clicked', 'false');
	modeName.innerHTML = 'Mode: Vertex';
	canvas.removeEventListener('mousedown', getStartNode);
	canvas.removeEventListener('mouseup', getEndNode);
	mode = 'vertex';
	console.log(`Mode: ${mode}`);
	canvas.addEventListener('click', createNode);
});

edgeButton.addEventListener('click', () => {
	vertexButton.setAttribute('data-clicked', 'false');
	edgeButton.setAttribute('data-clicked', 'true');
	modeName.innerHTML = 'Mode: Edge';
	canvas.removeEventListener('click', createNode);
	mode = 'edge';
	console.log(`Mode: ${mode}`);

	canvas.addEventListener('mousedown', getStartNode);

	canvas.addEventListener('mouseup', getEndNode);
});

bfsButton.addEventListener('click', () => {
	console.log(g);
	var bfs = g.bfs('A');
	var i = 0;
	var path = '';
	const interval = setInterval(() => {
		if (i == co_ordinates.size - 1) {
			clearInterval(interval);
		}
		var index = nodeArray.findIndex((j) => {
			return j.nodeName == bfs[i];
		});
		nodeArray[index].fillNode('#D82475', '#FFF');
		path += ' ' + bfs[i];

		// Display the operation in side panel
		const p = document.createElement('p');
		p.classList.add('bfs-p');
		p.innerHTML = `BFS Path: ${path}`;
		displayPanel.appendChild(p);
		// if (i > 0) {
		// 	var selectList = document.querySelectorAll('.bfs-p');
		// 	displayPanel.removeChild(selectList[selectList.length - 1]);
		// }
		autoScrollDown();

		// increment i to get next node in the list
		i += 1;
	}, 1000);
});

dfsButton.addEventListener('click', () => {
	console.log(g);
	var dfs = g.dfs('A');
	var i = 0;
	var path = '';
	const interval = setInterval(() => {
		if (i == co_ordinates.size - 1) {
			clearInterval(interval);
		}
		var index = nodeArray.findIndex((j) => {
			return j.nodeName == dfs[i];
		});
		nodeArray[index].fillNode('#033E8C', '#FFF');
		path += ' ' + dfs[i];

		// Display the operation in side panel
		const p = document.createElement('p');
		p.id = 'dfs-p';
		p.innerHTML = `DFS Path: ${path}`;
		displayPanel.appendChild(p);
		if (i > 0) {
			displayPanel.removeChild(document.getElementById('dfs-p'));
		}
		autoScrollDown();
		// increment i to get next node in the list
		i += 1;
	}, 1000);
});

bestFirstSearchButton.addEventListener('click', () => {
	var bestFirstSearch = g.bestFirstSearch(
		startingNode.value,
		endingNode.value
	);
	var i = 0;
	var path = '';
	const interval = setInterval(() => {
		if (i == co_ordinates.size - 1) {
			clearInterval(interval);
		}
		var index = nodeArray.findIndex((j) => {
			return j.nodeName == bestFirstSearch[i];
		});
		nodeArray[index].fillNode('#B159FF', '#011C40');
		path += ' ' + bestFirstSearch[i];

		// Display the operation in side panel
		const p = document.createElement('p');
		p.id = 'bestFirstSearch-p';
		p.innerHTML = `Best First Search Path: ${path}`;
		displayPanel.appendChild(p);
		if (i > 0) {
			displayPanel.removeChild(
				document.getElementById('bestFirstSearch-p')
			);
		}
		autoScrollDown();
		// increment i to get next node in the list
		i += 1;
	}, 1000);
});

function autoScrollDown() {
	displayPanel.scrollTop = displayPanel.scrollHeight;
}
