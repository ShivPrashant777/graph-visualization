import { PriorityQueue, Node } from './utils.js';

export default class Graph {
	constructor() {
		this.nodes = [];
		/*
		Map {
			'A' => [{ node: 'B', weight: 10 }],
			'B' => [{ node: 'A', weight: 10 }],
		}
		*/
		this.adjList = new Map();
		this.nodeCount = 0;
	}

	// Generate label for the next node (Excel Style)
	getNodeLabel(index) {
		let label = '';
		while (index >= 0) {
			label = String.fromCharCode((index % 26) + 65) + label;
			index = Math.floor(index / 26) - 1;
		}
		return label;
	}

	addNode(x, y) {
		const id = this.getNodeLabel(this.nodeCount++);
		const node = new Node(x, y, id);
		this.nodes.push(node);
		this.adjList.set(id, []);
		return node;
	}

	addEdge(node1Id, node2Id, weight = 1) {
		if (this.adjList.has(node1Id) && this.adjList.has(node2Id)) {
			if (!this.adjList.get(node1Id).some((n) => n.node === node2Id)) {
				this.adjList.get(node1Id).push({ node: node2Id, weight });
			}
			if (!this.adjList.get(node2Id).some((n) => n.node === node1Id)) {
				this.adjList.get(node2Id).push({ node: node1Id, weight });
			}
		}
	}

	// check if an edge exists between two nodes
	hasEdge(node1Id, node2Id) {
		return this.adjList.get(node1Id)?.some((e) => e.node === node2Id);
	}

	getNodes() {
		return this.nodes;
	}

	getNodeById(id) {
		return this.nodes.find((node) => node.id === id);
	}

	removeNode(nodeId) {
		this.nodes = this.nodes.filter((node) => node.id !== nodeId);
		this.adjList.delete(nodeId);

		for (const [key, neighbors] of this.adjList.entries()) {
			this.adjList.set(
				key,
				neighbors.filter((n) => n.node !== nodeId)
			);
		}
	}

	getEdges(nodeId) {
		return this.adjList.get(nodeId) || [];
	}

	getAdjList() {
		return this.adjList;
	}

	async dfs(startNodeId, visitCallback, delay = 1000) {
		const visited = new Set();

		const dfsHelper = async (id) => {
			if (visited.has(id)) return;
			visited.add(id);
			visitCallback(id);
			await new Promise((res) => setTimeout(res, delay)); // animation delay

			for (const { node: neighbor } of this.adjList.get(id) || []) {
				await dfsHelper(neighbor);
			}
		};

		await dfsHelper(startNodeId);
	}

	async bfs(startNodeId, visitCallback, delay = 1000) {
		const visited = new Set();
		const queue = [startNodeId];
		visited.add(startNodeId);

		while (queue.length > 0) {
			const current = queue.shift();
			visitCallback(current);
			await new Promise((res) => setTimeout(res, delay)); // animation delay

			for (const { node: neighbor } of this.adjList.get(current) || []) {
				if (!visited.has(neighbor)) {
					visited.add(neighbor);
					queue.push(neighbor);
				}
			}
		}
	}

	// Greedy Best First Search
	async bestFirstSearch(startNodeId, endNodeId, visitCallback, delay = 1000) {
		const visited = new Set();
		const parent = new Map();
		const pq = new PriorityQueue();

		pq.enqueue(startNodeId, 0);

		while (!pq.isEmpty()) {
			const current = pq.dequeue();
			if (visited.has(current)) continue;

			visited.add(current);
			visitCallback(current);
			await new Promise((res) => setTimeout(res, delay));
			if (current === endNodeId) break;

			for (const { node: neighbor } of this.adjList.get(current) || []) {
				if (!visited.has(neighbor)) {
					const currentNode = this.getNodeById(current);
					const neighborNode = this.getNodeById(neighbor);
					if (!currentNode || !neighborNode) continue;

					const heuristic = this.euclidianDistance(currentNode, neighborNode);
					pq.enqueue(neighbor, heuristic);
					if (!parent.has(neighbor)) {
						parent.set(neighbor, current);
					}
				}
			}
		}

		const path = [];
		let curr = endNodeId;
		while (curr !== undefined) {
			path.unshift(curr);
			curr = parent.get(curr);
		}
		return path;
	}

	euclidianDistance(currentNode, neighborNode) {
		return Math.hypot(
			currentNode.x - neighborNode.x,
			currentNode.y - neighborNode.y
		);
	}

	manhattanDistance(currentNode, neighborNode) {
		return (
			Math.abs(currentNode.x - neighborNode.x) +
			Math.abs(currentNode.y - neighborNode.y)
		);
	}
}
