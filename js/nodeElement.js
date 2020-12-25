export default class Node {
	constructor(nodeName, x, y) {
		this.nodeName = nodeName;
		this.x = x;
		this.y = y;
		this.f = 0;
		this.g = 0;
		this.h = 0;
		this.previous = undefined;
	}

	// Check if the Clicked Point is approx. near to the Node
	isPointInNode(mouseX, mouseY, mode = 'edge') {
		if (mode == 'vertex') {
			if (
				Math.abs(mouseX - this.x) < 70 &&
				Math.abs(mouseY - this.y) < 70
			) {
				return true;
			}
		} else if (
			Math.abs(mouseX - this.x) < 40 &&
			Math.abs(mouseY - this.y) < 40
		) {
			return true;
		}
	}
}
