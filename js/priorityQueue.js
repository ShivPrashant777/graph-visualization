// Class to store priority queue's elements
class QElement {
	constructor(nodeName, priority) {
		this.nodeName = nodeName;
		this.priority = priority;
	}
}

// PriorityQueue class
export default class PriorityQueue {
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

	includes(elt){
		return this.items.includes(elt);
	}
}
