import Graph from './graph.js';
import Node from './nodeElement.js';

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var operations = document.getElementById('operations');

var nodeArray = []; // Store all the NODES in an array
var varNodeName = 'A'; // First Node's Name
var g = new Graph();

// COLORS
var baseColor = '#00BA6C';
var edgeColor = '#F26101';
var bfsColor = '#BD0A1C';
var dfsColor = '#0029B2';
var bestFirstSearchColor = '#FF46BA';

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

function cleanSlate() {
	g = new Graph();
	nodeArray = [];
	varNodeName = 'A';
}

function autoScrollDown() {
	operations.scrollTop = operations.scrollHeight;
}

export {
	getCursorPosition,
	createNode,
	drawEdge,
	showOperation,
	vertexMouseMove,
	cleanSlate,
	nodeArray,
	g,
	varNodeName,
};
