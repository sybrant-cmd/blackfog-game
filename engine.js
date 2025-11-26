// engine.js
import { scenarios } from './scenarios.js';

console.log("Engine loaded");

export const sessionId = new URLSearchParams(window.location.search).get('s') || 'default';
export const channel = new BroadcastChannel('blackfog-ttx');
