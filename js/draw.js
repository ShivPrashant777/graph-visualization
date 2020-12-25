import Graph from './graph.js';
import Node from './nodeElement.js';
/*

    Canvas Initialization

*/
var canvas = document.getElementById('myCanvas');
canvas.width = window.innerWidth - 500;
canvas.height = window.innerHeight - 150;

var ctx = canvas.getContext('2d');

// Fill with Light Gray Background
ctx.fillStyle = 'rgb(240, 240, 240)';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// COLORS
var baseColor = '#00BA6C';
var edgeColor = '#F26101';
var bfsColor = '#BD0A1C';
var dfsColor = '#0029B2';
var bestFirstSearchColor = '#FF46BA';

// DOM Elements
var vertexButton = document.getElementById('vertexButton');
var edgeButton = document.getElementById('edgeButton');
var bfsButton = document.getElementById('bfsButton');
var dfsButton = document.getElementById('dfsButton');
var clearButton = document.getElementById('clear');
var clearCanvas = document.getElementById('clearCanvas');
var bestFirstSearchButton = document.getElementById('bestFirstSearchButton');
var startingNode = document.getElementById('start-node');
var endingNode = document.getElementById('end-node');
var aStarButton = document.getElementById('aStarButton');

var operations = document.getElementById('operations');
var modeName = document.getElementById('mode-name');

/*

	Utitly functions
	
*/

// Gets Cursor's X and Y co-ordinates
function getCursorPosition(canvas, event) {
	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;
	return [x, y];
}

// Adds Node to the GRAPH and fills it
function createNode(event) {
	var [x, y] = getCursorPosition(canvas, event);
	for (var node of nodeArray) {
		if (node.isPointInNode(x, y, 'vertex')) {
			return;
		}
	}

	var newNode = new Node(varNodeName, x, y);
	g.addVertex(newNode);
	g.fillNode(newNode, baseColor);
	nodeArray.push(newNode);

	// Display operation
	var msg = `Created Vertex: ${varNodeName}`;
	showOperation(msg);

	//Update next Node's Name
	varNodeName = String.fromCharCode(varNodeName.charCodeAt(0) + 1);
}

// Draws an Edge Between StartNode and EndNode
function drawEdge(startNode, endNode) {
	ctx.beginPath();
	ctx.strokeStyle = '#000';
	ctx.moveTo(startNode.x, startNode.y);
	ctx.lineTo(endNode.x, endNode.y);
	ctx.stroke();
	// refill node with new color
	g.fillNode(startNode, edgeColor);
	g.fillNode(endNode, edgeColor);
	// Display operation
	var msg = `Created Edge From ${startNode.nodeName} to ${endNode.nodeName}`;
	showOperation(msg);
}

// Display the operation in side panel
function showOperation(message, classname = 'msg-p') {
	const p = document.createElement('p');
	p.classList.add(classname);
	p.innerHTML = message;
	operations.appendChild(p);
	autoScrollDown();
}

// Create an interval to display an operation
function createInterval(array, operation, color) {
	var className = operation + '-p';
	var i = 0;
	var path = '';
	const interval = setInterval(() => {
		if (i == array.length - 1) {
			clearInterval(interval);
		}
		// Remove the last element with classname = ${opeation}-p
		if (i > 0) {
			var selectList = document.querySelectorAll('.' + className);
			operations.removeChild(selectList[selectList.length - 1]);
		}

		var index = nodeArray.findIndex((j) => {
			return j.nodeName == array[i];
		});
		g.fillNode(nodeArray[index], color);
		path += ' ' + array[i];

		// Display operation
		var msg = `${operation} Path: ${path}`;
		showOperation(msg, className);

		// increment i to get next node in the list
		i += 1;
	}, 1000);
}

// Change Mouse Pointer if it is on any Node (vertex mode)
function vertexMouseMove() {
	var [x, y] = getCursorPosition(canvas, event);
	canvas.style.cursor = 'default';
	for (var node of nodeArray) {
		if (node.isPointInNode(x, y)) {
			canvas.style.cursor = 'pointer';
		}
	}
}

var nodeArray = []; // Store all the NODES in an array
var varNodeName = 'A'; // First Node's Name
var mode = undefined; // Draw Mode (Vertex or Edge)

var g = new Graph();

vertexButton.addEventListener('click', () => {
	vertexButton.setAttribute('data-clicked', 'true');
	edgeButton.setAttribute('data-clicked', 'false');
	modeName.innerHTML = 'Vertex';
	mode = 'vertex';
	console.log(`Mode: ${mode}`);
	canvas.addEventListener('click', createNode);
});

vertexButton.addEventListener('mousemove', () => {
	canvas.removeEventListener('mousemove', vertexMouseMove);
	canvas.style.cursor = 'pointer';
});

edgeButton.addEventListener('click', () => {
	vertexButton.setAttribute('data-clicked', 'false');
	edgeButton.setAttribute('data-clicked', 'true');
	modeName.innerHTML = 'Edge';
	canvas.removeEventListener('click', createNode);
	mode = 'edge';
	console.log(`Mode: ${mode}`);
	var startNode,
		endNode = undefined;
	canvas.addEventListener('mousedown', () => {
		var [x, y] = getCursorPosition(canvas, event);
		for (var i of nodeArray) {
			if (i.isPointInNode(x, y)) {
				startNode = i;
				break;
			}
		}
	});

	canvas.addEventListener('mousemove', vertexMouseMove);

	canvas.addEventListener('mouseup', () => {
		var [x, y] = getCursorPosition(canvas, event);
		if (!startNode) {
			return;
		}
		for (var j of nodeArray) {
			if (j.isPointInNode(x, y) && j.nodeName != startNode.nodeName) {
				endNode = j;
				var graphNodeList = g.AdjList.get(startNode);

				var index = graphNodeList.findIndex((j) => {
					return j.nodeName == endNode.nodeName;
				});

				if (index == -1) {
					{
						drawEdge(startNode, endNode);
						g.addEdge(startNode, endNode);
						console.log(g);
					}
				}
				break;
			}
		}
	});
});

bfsButton.addEventListener('click', () => {
	var bfs = g.bfs(nodeArray[0]);
	createInterval(bfs, 'BFS', bfsColor);
});

dfsButton.addEventListener('click', () => {
	var dfs = g.dfs(nodeArray[0]);
	createInterval(dfs, 'DFS', dfsColor);
});

bestFirstSearchButton.addEventListener('click', () => {
	var index1 = nodeArray.findIndex((j) => {
		return j.nodeName == startingNode.value;
	});
	var index2 = nodeArray.findIndex((j) => {
		return j.nodeName == endingNode.value;
	});

	// If wrong nodes are input then display error message
	if (index1 == -1 || index2 == -1) {
		console.log('No Path');
		var msg = `Error: Starting Node or Ending Node is not in the Graph`;
		showOperation(msg);
		return;
	}
	var startNode = nodeArray[index1];
	var endNode = nodeArray[index2];
	var bestFirstSearch = g.bestFirstSearch(startNode, endNode, nodeArray);
	createInterval(bestFirstSearch, 'BestFirstSearch', bestFirstSearchColor);
});

aStarButton.addEventListener('click', () => {
	var index1 = nodeArray.findIndex((j) => {
		return j.nodeName == startingNode.value;
	});
	var index2 = nodeArray.findIndex((j) => {
		return j.nodeName == endingNode.value;
	});

	// If wrong nodes are input then display error message
	const p = document.createElement('p');
	if (index1 == -1 || index2 == -1) {
		console.log('No Path');
		var msg = `Error: Starting Node or Ending Node is not in the Graph`;
		showOperation(msg);
		return;
	}
	var startNode = nodeArray[index1];
	var endNode = nodeArray[index2];

	g.aStar(startNode, endNode);
});

clearButton.addEventListener('click', () => {
	for (var node of nodeArray) {
		g.fillNode(node, '#00BA6C');
	}
});

clearCanvas.addEventListener('click', () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// Fill with Light Gray Background
	ctx.fillStyle = 'rgb(240, 240, 240)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	console.log(g);
	console.table(nodeArray);
	g = new Graph();
	nodeArray = [];
	console.log(g);
	console.table(nodeArray);
	varNodeName = 'A';
});

function autoScrollDown() {
	operations.scrollTop = operations.scrollHeight;
}
