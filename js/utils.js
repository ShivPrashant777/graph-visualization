import { graph, minDistance, radius, logDiv } from './constants.js';

var canvas = document.getElementById('myCanvas');

function getNodeAtPosition(x, y) {
	return graph
		.getNodes()
		.find((node) => Math.hypot(node.x - x, node.y - y) <= radius);
}

// Proximity check when the current position is too close to a node
function isTooClose(x, y) {
	return graph.getNodes().some((node) => {
		const dist = Math.hypot(node.x - x, node.y - y);
		return dist < minDistance;
	});
}

function log(message, type = '') {
	const entry = document.createElement('div');
	entry.className = type;
	entry.textContent = `> ${message}`;
	logDiv.appendChild(entry);
	logDiv.scrollTop = logDiv.scrollHeight;
}

function clearLogs() {
	logDiv.innerHTML = '';
}

function disableButtons(state) {
	const buttons = document.querySelectorAll('button');
	buttons.forEach((btn) => {
		btn.disabled = state;
	});
	// Change cursor style
	document.body.style.cursor = state ? 'wait' : 'default';
	if (canvas) {
		canvas.style.cursor = state ? 'wait' : 'default';
	}
}

window.clearLogs = clearLogs;

export { getNodeAtPosition, isTooClose, log, clearLogs, disableButtons };
