// engine.mjs
// BlackFog TTX ES-module engine (Production, no AI)

// Import static scenarios
import { scenarios } from './scenarios.mjs';

// --- Session & channel ---
export const sessionId =
  new URLSearchParams(window.location.search).get('s') || 'default';

export const channel = new BroadcastChannel('bfog-ttx-' + sessionId);

// --- Scenario helpers ---
export function listScenarios() {
  return Object.values(scenarios).map(s => ({ id: s.id, title: s.title }));
}

export function getScenario(id) {
  if (!id) return null;
  return scenarios[id] || null;
}

// --- Vote tracking (kept in facilitator memory) ---
export function initVoteLog() {
  // key: `${scenarioId}:${seq}` => { A,B,C,voters:{} }
  return {};
}

export function registerVote(voteLog, scenarioId, seq, choice, playerId) {
  if (!voteLog || !scenarioId || typeof seq === 'undefined') return;
  const key = `${scenarioId}:${seq}`;
  if (!voteLog[key]) {
    voteLog[key] = { A: 0, B: 0, C: 0, voters: {} };
  }
  const bucket = voteLog[key];
  if (playerId && bucket.voters[playerId]) return; // one vote per player
  if (!['A', 'B', 'C'].includes(choice)) return;

  bucket[choice] = (bucket[choice] || 0) + 1;
  if (playerId) bucket.voters[playerId] = true;
}

export function getTallyFor(voteLog, scenarioId, seq) {
  if (!voteLog || !scenarioId || typeof seq === 'undefined') {
    return { A: 0, B: 0, C: 0 };
  }
  const key = `${scenarioId}:${seq}`;
  const v = voteLog[key] || {};
  return {
    A: v.A || 0,
    B: v.B || 0,
    C: v.C || 0
  };
}

// --- Majority helper (used by facilitator UI & AAR) ---
export function computeMajority(tally) {
  if (!tally) return null;
  const scores = [
    ['A', tally.A || 0],
    ['B', tally.B || 0],
    ['C', tally.C || 0]
  ];
  scores.sort((a, b) => b[1] - a[1]);
  if (scores[0][1] === 0) return null;
  const topScore = scores[0][1];
  const ties = scores.filter(s => s[1] === topScore).length;
  return ties > 1 ? null : scores[0][0];
}

// --- Simple pattern-based AAR (no AI) ---
export function buildAAR(scenarioId, voteLog) {
  const scenario = getScenario(scenarioId);
  if (!scenario || !Array.isArray(scenario.injects) || scenario.injects.length === 0) {
    return '';
  }

  let proactive = 0;
  let cautious = 0;
  let delayed = 0;
  let lowEngagement = 0;

  const lines = [];
  lines.push(`=== After-Action Review: ${scenario.title} ===`);
  lines.push('');

  for (const inj of scenario.injects) {
    const tally = getTallyFor(voteLog, scenarioId, inj.seq);
    const total = (tally.A || 0) + (tally.B || 0) + (tally.C || 0);
    const majority = computeMajority(tally);
    const phase = (inj.phase || '').toLowerCase();

    if (total === 0) {
      lowEngagement++;
    } else if (majority === 'A') {
      proactive++;
    } else if (majority === 'B') {
      cautious++;
    } else if (majority === 'C') {
      delayed++;
    }

    lines.push(`Inject #${inj.seq}  [${inj.time} | ${inj.phase}]`);
    lines.push(`Narrative: ${inj.narrative}`);
    if (inj.decision) {
      lines.push(`Decision: ${inj.decision.question}`);
      for (const [optKey, optText] of Object.entries(inj.decision.options || {})) {
        lines.push(`  ${optKey}. ${optText}`);
      }
    }
    lines.push(`Votes → A: ${tally.A}  B: ${tally.B}  C: ${tally.C}`);
    lines.push(`Majority choice: ${majority || 'None / Split'}`);
    lines.push('');
  }

  lines.push('--- Summary of decision tendencies ---');
  lines.push(`Proactive / risk-taking decisions (A): ${proactive}`);
  lines.push(`Cautious / waiting decisions (B): ${cautious}`);
  lines.push(`Deferring / lowest-action decisions (C): ${delayed}`);
  lines.push(`Injects with no votes: ${lowEngagement}`);
  lines.push('');
  lines.push('Use this summary to discuss where the team was decisive, where it held back, and where ownership or escalation paths may not have been clear.');

  return lines.join('\n');
}
