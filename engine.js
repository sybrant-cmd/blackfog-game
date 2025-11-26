// engine.js
import { scenarios } from './scenarios.js';
console.log("Engine loaded");

export function init() {
  console.log("Engine init");
}

export function loadScenario(id) {
  return scenarios[id];
}
