import { graph, radius, tooltip } from './constants.js';
import { getNodeAtPosition, isTooClose, log, disableButtons } from './utils.js';

/*
    Canvas Initialization   
*/
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var mouseX = null;
var mouseY = null;
var mode = 'vertex'; // vertex | edge
var selectedNode = null;
var hoveredNode = null;
var visitedNodes = new Set(); // track visited for animation
var vertexModeBtn = document.getElementById('vertexModeBtn');
var edgeModeBtn = document.getElementById('edgeModeBtn');
const toggleWeightsBtn = document.getElementById('toggle-weights');
let isTraversing = false;
let showEdgeWeights = true;
let isDragging = false;
let draggedNode = null;
let offsetX = 0;
let offsetY = 0;

// Toggle Edge Weights
toggleWeightsBtn.addEventListener('click', () => {
	showEdgeWeights = !showEdgeWeights;
	// Update button text and icon
	toggleWeightsBtn.innerHTML = `
		<i class="fa-solid ${showEdgeWeights ? 'fa-eye-slash' : 'fa-eye'}"></i>
		${showEdgeWeights ? 'Hide Edge Weights' : 'Show Edge Weights'}
	`;
	drawGraph(); // re-render canvas
});

// Mode Buttons
vertexModeBtn.addEventListener('click', () => {
	vertexModeBtn.setAttribute('data-selected', 'true');
	edgeModeBtn.setAttribute('data-selected', 'false');
	mode = 'vertex';
	selectedNode = null;
	drawGraph();
});

edgeModeBtn.addEventListener('click', () => {
	edgeModeBtn.setAttribute('data-selected', 'true');
	vertexModeBtn.setAttribute('data-selected', 'false');
	mode = 'edge';
	selectedNode = null;
	drawGraph();
});

// disable default right click behaviour
canvas.addEventListener('contextmenu', (e) => e.preventDefault());

// Drag and Drop nodes to new position
canvas.addEventListener('mousedown', (e) => {
	if (isTraversing) return;

	const rect = canvas.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;

	const node = getNodeAtPosition(x, y);
	if (node) {
		isDragging = true;
		draggedNode = node;
		offsetX = node.x - x;
		offsetY = node.y - y;
	}
});

canvas.addEventListener('mouseup', () => {
	if (isDragging) {
		isDragging = false;
		draggedNode = null;
	}
});

canvas.addEventListener('mousemove', (e) => {
	const rect = canvas.getBoundingClientRect();
	mouseX = e.clientX - rect.left;
	mouseY = e.clientY - rect.top;

	// If dragging, update node position
	if (isDragging && draggedNode) {
		draggedNode.x = mouseX + offsetX;
		draggedNode.y = mouseY + offsetY;
		drawGraph();
		return; // Skip hover/tooltip logic while dragging
	}

	// display tooltip when mouse pointer is too close to another node
	if (mode === 'vertex') {
		const tooClose = isTooClose(mouseX, mouseY);
		if (tooClose) {
			tooltip.classList.remove('hidden');
			tooltip.style.left = `${e.clientX + 10}px`;
			tooltip.style.top = `${e.clientY + 10}px`;
		} else {
			tooltip.classList.add('hidden');
		}
	}

	// Detect hovered node in edge mode
	if (mode === 'edge') {
		hoveredNode = getNodeAtPosition(mouseX, mouseY);
	} else {
		hoveredNode = null;
	}

	drawGraph();
});

// Reset mouseX and mouseY when mouse leaves the canvas
canvas.addEventListener('mouseleave', () => {
	mouseX = null;
	mouseY = null;
	drawGraph();
});

// Resize canvas to match 80% width and 100% height
function resizeCanvas() {
	canvas.width = window.innerWidth * 0.8;
	canvas.height = window.innerHeight;
	drawGraph(); // Redraw after resizing
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function drawGraph() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	const nodes = graph.getNodes();

	// Draw edges
	for (const node of nodes) {
		for (const { node: neighborId, weight } of graph.getEdges(node.id)) {
			const neighbor = nodes.find((n) => n.id === neighborId);
			if (!neighbor || node.id > neighborId) continue; // avoid duplicates

			ctx.beginPath();
			ctx.moveTo(node.x, node.y);
			ctx.lineTo(neighbor.x, neighbor.y);
			ctx.strokeStyle = '#333';
			ctx.lineWidth = 2;
			ctx.stroke();

			// draw weight label at midpoint
			if (showEdgeWeights) {
				const midX = (node.x + neighbor.x) / 2;
				const midY = (node.y + neighbor.y) / 2;
				ctx.fillStyle = '#000';
				ctx.font = '14px Arial';
				ctx.fillText(weight, midX + 5, midY + 5);
			}
		}
	}

	// Draw nodes
	for (const node of nodes) {
		// Create radial gradient for 3D effect
		const gradient = ctx.createRadialGradient(
			node.x - 3,
			node.y - 3,
			0,
			node.x,
			node.y,
			radius
		);
		gradient.addColorStop(0.3, '#6ea8ff');
		gradient.addColorStop(1, '#2a5bff');

		// Shadow settings for raised look
		ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
		ctx.shadowBlur = 6;
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;

		// Draw the node with gradient
		ctx.beginPath();
		ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);

		if (selectedNode && selectedNode.id === node.id) {
			// Selected node: yellow
			ctx.fillStyle = 'yellow';
		} else if (visitedNodes.has(node.id)) {
			// Visited nodes: green gradient
			const visitGradient = ctx.createRadialGradient(
				node.x - 3,
				node.y - 3,
				0,
				node.x,
				node.y,
				radius
			);
			visitGradient.addColorStop(0.3, '#a8e6a1');
			visitGradient.addColorStop(1, '#4CAF50');
			ctx.fillStyle = visitGradient;
		} else {
			// Default node gradient
			ctx.fillStyle = gradient;
		}
		ctx.fill();

		// Highlight node on mouseover in Edge Mode
		if (mode === 'edge' && hoveredNode && hoveredNode.id === node.id) {
			ctx.beginPath();
			ctx.arc(node.x, node.y, radius + 4, 0, Math.PI * 2);
			ctx.strokeStyle = 'red';
			ctx.lineWidth = 3;
			ctx.stroke();
		}
		ctx.lineWidth = 1;
		ctx.stroke();

		// Draw label
		ctx.fillStyle = '#fff';
		ctx.font = '20px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(node.id, node.x, node.y);

		// Reset shadow to avoid affecting other drawings
		ctx.shadowColor = 'transparent';
		ctx.shadowBlur = 0;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
	}

	// Draw preview circle for vertex placement
	if (mode === 'vertex' && mouseX !== null && mouseY !== null) {
		const tooClose = isTooClose(mouseX, mouseY);

		ctx.beginPath();
		ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2);
		ctx.strokeStyle = tooClose ? 'red' : 'green';
		ctx.lineWidth = 2;
		ctx.setLineDash([5, 5]);
		ctx.stroke();
		ctx.setLineDash([]); // reset dash
	}
}

canvas.addEventListener('click', (e) => {
	const rect = canvas.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;

	if (mode === 'vertex') {
		if (isTooClose(x, y)) {
			return;
		}
		const node = graph.addNode(x, y);
		log(`Node ${node.id} added at (${x}, ${y})`, 'success');
		drawGraph();
	} else if (mode === 'edge') {
		const clickedPos = getNodeAtPosition(x, y);
		// if selected position is not whitespace
		if (clickedPos) {
			// Toggle selection
			if (selectedNode && selectedNode.id === clickedPos.id) {
				selectedNode = null; // Deselect if same node
			} else if (!selectedNode) {
				selectedNode = clickedPos; // First selection
			} else {
				// Add edge if not already added and reset selection
				if (!graph.hasEdge(selectedNode.id, clickedPos.id)) {
					const weightInput = prompt(
						`Enter weight for edge ${selectedNode.id} — ${clickedPos.id}`,
						'1'
					);
					const weight = parseInt(weightInput, 10);

					if (!isNaN(weight)) {
						graph.addEdge(selectedNode.id, clickedPos.id, weight);
						log(
							`Edge added between ${selectedNode.id} and ${clickedPos.id} with weight ${weight}`,
							'success'
						);
					} else {
						log(`Edge creation cancelled or invalid weight`, 'alert');
					}
				}
				selectedNode = null;
			}
			drawGraph();
		}
	}
});

// Right Click to Delete a Node
canvas.addEventListener('contextmenu', (e) => {
	e.preventDefault();
	const rect = canvas.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;

	const clickedPos = getNodeAtPosition(x, y);
	// if selected position is not whitespace
	if (clickedPos) {
		// Remove selected node if it's being deleted
		if (selectedNode && selectedNode.id === clickedPos.id) {
			selectedNode = null;
		}

		graph.removeNode(clickedPos.id);
		log(`Node ${clickedPos.id} removed`, 'alert');
		drawGraph();
	}
});

async function startDFS() {
	if (!selectedNode) {
		alert('Select a starting node in Edge Mode to begin DFS');
		return;
	}
	disableButtons(true);
	visitedNodes.clear();
	log(`DFS Traversal started from ${selectedNode.id} ...`);
	await graph.dfs(selectedNode.id, (id) => {
		visitedNodes.add(id);
		log(`Visited node ${id}`, 'traversal');
		drawGraph();
	});
	log(`DFS Traversal Ended`);
	disableButtons(false);
}

async function startBFS() {
	if (!selectedNode) {
		alert('Please select a starting node for BFS', 'delete');
		return;
	}
	disableButtons(true);
	visitedNodes.clear();
	drawGraph();
	log(`BFS Traversal started from ${selectedNode.id} ...`);
	await graph.bfs(selectedNode.id, (id) => {
		visitedNodes.add(id);
		log(`Visited node ${id}`, 'traversal');
		drawGraph();
	});
	log(`BFS Traversal Ended`);
	disableButtons(false);
}

async function runBestFirstSearch() {
	const start = document.getElementById('startNode').value.trim().toUpperCase();
	const end = document.getElementById('endNode').value.trim().toUpperCase();

	if (!start || !end || start === end) {
		log('Please enter valid and different start/end nodes', 'alert');
		return;
	}

	log(`Best First Search from ${start} to ${end} ...`);

	const allIds = graph.getNodes().map((n) => n.id);
	if (!allIds.includes(start) || !allIds.includes(end)) {
		log('Start or End node not found in graph', 'alert');
		return;
	}

	isTraversing = true;
	disableButtons(true);
	visitedNodes.clear();
	drawGraph();

	const path = await graph.bestFirstSearch(start, end, (id) => {
		visitedNodes.add(id);
		log(`Visited ${id}`, 'traversal');
		drawGraph();
	});

	isTraversing = false;
	disableButtons(false);

	if (path.length && path[0] == start && path[path.length - 1] == end) {
		log(`Path: ${path.join(' → ')}`, 'traversal');
	} else {
		log('No path found', 'alert');
	}
	log(`Best First Search Ended`);
}

async function runAStarSearch() {
	const start = document.getElementById('startNode').value.trim().toUpperCase();
	const end = document.getElementById('endNode').value.trim().toUpperCase();

	if (!start || !end || start === end) {
		log('Please enter valid and different start/end nodes', 'alert');
		return;
	}

	log(`A* Search from ${start} to ${end} ...`);

	const allIds = graph.getNodes().map((n) => n.id);
	if (!allIds.includes(start) || !allIds.includes(end)) {
		log('Start or End node not found in graph', 'alert');
		return;
	}

	isTraversing = true;
	disableButtons(true);
	visitedNodes.clear();
	drawGraph();

	const path = await graph.aStarSearch(start, end, (id) => {
		visitedNodes.add(id);
		log(`Visited ${id}`, 'traversal');
		drawGraph();
	});

	isTraversing = false;
	disableButtons(false);

	if (path.length && path[0] == start && path[path.length - 1] == end) {
		log(`Path: ${path.join(' → ')}`, 'traversal');
	} else {
		log('No path found', 'alert');
	}
	log(`A* Search Ended`);
}

// Download image as PNG
document.getElementById('download-image').addEventListener('click', () => {
	const link = document.createElement('a');
	link.download = 'graph.png'; // File name
	link.href = canvas.toDataURL('image/png'); // Get PNG from canvas
	link.click(); // Trigger download
});

window.startDFS = startDFS;
window.startBFS = startBFS;
window.runBestFirstSearch = runBestFirstSearch;
window.runAStarSearch = runAStarSearch;
