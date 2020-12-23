import { Graph, co_ordinates } from './graph.js';
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

    NODE

*/

class Node {
	constructor(nodeName, x, y) {
		this.nodeName = nodeName;
		this.x = x;
		this.y = y;
		this.f = 0;
		this.g = 0;
		this.h = 0;
		this.previous = undefined;
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
	g.addVertex(newNode);
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

var nodeArray = []; // Store all the NODES in an array
var nodeName = 'A'; // First Node's Name
var mode = undefined; // Draw Mode (Vertex or Edge)

var g = new Graph();

var vertexButton = document.getElementById('vertexButton');
var edgeButton = document.getElementById('edgeButton');
var bfsButton = document.getElementById('bfsButton');
var dfsButton = document.getElementById('dfsButton');
var clearButton = document.getElementById('clear');
var bestFirstSearchButton = document.getElementById('bestFirstSearchButton');
var startingNode = document.getElementById('start-node');
var endingNode = document.getElementById('end-node');
var aStarButton = document.getElementById('aStarButton');

vertexButton.addEventListener('click', () => {
	vertexButton.setAttribute('data-clicked', 'true');
	edgeButton.setAttribute('data-clicked', 'false');
	modeName.innerHTML = 'Vertex';
	mode = 'vertex';
	console.log(`Mode: ${mode}`);
	canvas.addEventListener('click', createNode);
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
		console.log('MouseDown');
		var [x, y] = getCursorPosition(canvas, event);
		for (var i of nodeArray) {
			if (i.isPointInNode(x, y)) {
				startNode = i;
				break;
			}
		}
	});

	canvas.addEventListener('mouseup', () => {
		console.log('MouseUp');
		var [x, y] = getCursorPosition(canvas, event);
		for (var j of nodeArray) {
			if (j.isPointInNode(x, y) && j.nodeName != startNode.nodeName) {
				endNode = j;
				break;
			}
		}
		var graphNodeList = g.AdjList.get(startNode.nodeName);

		var index = graphNodeList.findIndex((j) => {
			return j == endNode.nodeName;
		});

		if (index == -1) {
			if (
				startNode != undefined &&
				endNode != undefined &&
				j.nodeName != startNode.nodeName
			) {
				console.log(nodeArray);
				startNode.fillNode('#F24501', '#FFF');
				endNode.fillNode('#F24501', '#FFF');
				drawEdge(startNode, endNode);
				g.addEdge(startNode.nodeName, endNode.nodeName);
				g.addEdge(startNode, endNode);
				console.log('EDGE DRAWN');
				console.log(g);
				console.log(nodeArray);
			}
		}
	});
});

bfsButton.addEventListener('click', () => {
	var bfs = g.bfs('A');
	var i = 0;
	var path = '';
	const interval = setInterval(() => {
		if (i == bfs.length - 1) {
			clearInterval(interval);
		}
		// Remove the last element with classname = bfs-p
		if (i > 0) {
			var selectList = document.querySelectorAll('.bfs-p');
			displayPanel.removeChild(selectList[selectList.length - 1]);
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
		autoScrollDown();

		// increment i to get next node in the list
		i += 1;
	}, 1000);
});

dfsButton.addEventListener('click', () => {
	var dfs = g.dfs('A');
	var i = 0;
	var path = '';
	const interval = setInterval(() => {
		if (i == dfs.length - 1) {
			clearInterval(interval);
		}
		// Remove the last element with classname = dfs-p
		if (i > 0) {
			var selectList = document.querySelectorAll('.dfs-p');
			displayPanel.removeChild(selectList[selectList.length - 1]);
		}

		var index = nodeArray.findIndex((j) => {
			return j.nodeName == dfs[i];
		});
		nodeArray[index].fillNode('#033E8C', '#FFF');
		path += ' ' + dfs[i];

		// Display the operation in side panel
		const p = document.createElement('p');
		p.classList.add('dfs-p');
		p.innerHTML = `DFS Path: ${path}`;
		displayPanel.appendChild(p);

		autoScrollDown();
		// increment i to get next node in the list
		i += 1;
	}, 1000);
});

clearButton.addEventListener('click', () => {
	for (var node of nodeArray) {
		node.fillNode('#025951', '#F0F2F2');
	}
});

bestFirstSearchButton.addEventListener('click', () => {
	var bestFirstSearch = g.bestFirstSearch(
		startingNode.value,
		endingNode.value,
		nodeArray[1]
	);
	var i = 0;
	var path = '';
	const interval = setInterval(() => {
		if (i == bestFirstSearch.length - 1) {
			clearInterval(interval);
		}
		// Remove the last element with classname = .bestFirstSearch-p
		if (i > 0) {
			var selectList = document.querySelectorAll('.bestFirstSearch-p');
			displayPanel.removeChild(selectList[selectList.length - 1]);
		}

		var index = nodeArray.findIndex((j) => {
			return j.nodeName == bestFirstSearch[i];
		});
		nodeArray[index].fillNode('#B159FF', '#011C40');
		path += ' ' + bestFirstSearch[i];

		// Display the operation in side panel
		const p = document.createElement('p');
		p.classList.add('bestFirstSearch-p');
		p.innerHTML = `Best First Search Path: ${path}`;
		displayPanel.appendChild(p);
		autoScrollDown();

		// increment i to get next node in the list
		i += 1;
	}, 1000);
});

aStarButton.addEventListener('click', () => {
	var result = g.aStar(nodeArray[0], nodeArray[nodeArray.length - 1]);
	
});

function autoScrollDown() {
	displayPanel.scrollTop = displayPanel.scrollHeight;
}
