// engine.js (module)
import { scenarios } from './scenarios.js';

export function loadScenario(id) {
  return scenarios[id] || null;
}
