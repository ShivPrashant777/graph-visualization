import Graph from './graph.js';

const graph = new Graph();
const radius = 25;
const minDistance = radius * 2 + 10;
const tooltip = document.getElementById('tooltip');
const logDiv = document.getElementById('log');

export { graph, radius, minDistance, tooltip, logDiv };
