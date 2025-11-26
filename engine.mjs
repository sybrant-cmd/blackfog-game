// engine.mjs
// BlackFog TTX ES-module engine

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
  return scenarios[id] || null;
}

// --- Vote tracking (kept in facilitator memory) ---
export function initVoteLog() {
  // key: `${scenarioId}:${seq}` => { A,B,C,voters{} }
  return {};
}

export function registerVote(voteLog, scenarioId, seq, choice, playerId) {
  const key = `${scenarioId}:${seq}`;
  if (!voteLog[key]) {
    voteLog[key] = { A: 0, B: 0, C: 0, voters: {} };
  }
  if (playerId && voteLog[key].voters[playerId]) return; // one vote per player
  if (!['A','B','C'].includes(choice)) return;
  voteLog[key][choice] = (voteLog[key][choice] || 0) + 1;
  if (playerId) voteLog[key].voters[playerId] = true;
}

export function getTallyFor(voteLog, scenarioId, seq) {
  const key = `${scenarioId}:${seq}`;
  const v = voteLog[key] || {};
  return {
    A: v.A || 0,
    B: v.B || 0,
    C: v.C || 0
  };
}

export function computeMajority(tally) {
  if (!tally) return null;
  const scores = [['A', tally.A || 0], ['B', tally.B || 0], ['C', tally.C || 0]];
  scores.sort((a,b) => b[1] - a[1]);
  if (scores[0][1] === 0) return null;
  const topScore = scores[0][1];
  const ties = scores.filter(s => s[1] === topScore).length;
  return ties > 1 ? null : scores[0][0];
}

// --- vCISO commentary buckets ---
const vcisoBuckets = {
  intel: [
    "Early hints like this are when teams should lean forward, not wait for perfect certainty.",
    "If a few different signals line up, treat it as real risk, not background noise."
  ],
  detection: [
    "Once admin or system activity looks off-pattern, assume risk first and prove safety later.",
    "Treat unusual behaviour as a reason to escalate, not just another ticket to close quietly."
  ],
  containment: [
    "Containment works best when roles are clear. Hesitation here usually gives the attacker more room.",
    "Pre-agreed actions make it easier to move quickly, even when operations will feel some pain."
  ],
  business: [
    "Clear, simple messages travel better than perfect technical detail, especially under pressure.",
    "If you do not set the narrative early, customers and media will likely do it for you."
  ],
  recovery: [
    "Recovery is a chance to come back stronger, not just return to the old risk level.",
    "If you would not accept the old setup in a new project, this is the time to change it."
  ],
  generic: [
    "Clarity on who decides what, and when, matters as much as tooling during an incident.",
    "Good teams are not those with zero incidents, but those that handle them with discipline and transparency."
  ]
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function buildVCISOInjectComment(inject, tally) {
  const phase = (inject.phase || '').toLowerCase();
  let bucket = 'generic';
  if (phase.includes('intel')) bucket = 'intel';
  else if (phase.includes('detect')) bucket = 'detection';
  else if (phase.includes('contain')) bucket = 'containment';
  else if (phase.includes('business')) bucket = 'business';
  else if (phase.includes('recover')) bucket = 'recovery';

  const total = (tally.A || 0) + (tally.B || 0) + (tally.C || 0);
  if (total === 0) {
    return "No responses here. In a real incident, silence often means people are unsure who owns the next move.";
  }
  return pick(vcisoBuckets[bucket] || vcisoBuckets.generic);
}

export function buildFinalVCISO(scenarioId, voteLog) {
  const scenario = getScenario(scenarioId);
  if (!scenario) return "No scenario context found.";

  let slowEsc = 0;
  let weakContain = 0;
  let commsGaps = 0;
  let strongMoves = 0;
  let lowEngagement = 0;

  for (const inj of scenario.injects) {
    const tally = getTallyFor(voteLog, scenarioId, inj.seq);
    const majority = computeMajority(tally);
    const total = (tally.A || 0) + (tally.B || 0) + (tally.C || 0);
    const phase = (inj.phase || '').toLowerCase();

    if (total === 0) lowEngagement++;
    if (majority === 'A') strongMoves++;

    if (phase.includes('intel') && majority === 'C') slowEsc++;
    if (phase.includes('contain') && majority !== 'A') weakContain++;
    if (phase.includes('business') && (majority === 'B' || majority === 'C')) commsGaps++;
  }

  const lines = [];
  lines.push(`Looking across "${scenario.title}", a few patterns stand out.`);

  if (slowEsc > 0) {
    lines.push("Early signals were not acted on quickly enough in some moments. Faster escalation when patterns line up would give you more room to manoeuvre.");
  }
  if (weakContain > 0) {
    lines.push("Containment choices tended to be conservative. It helps to pre-agree which systems you are willing to isolate quickly when risk is high.");
  }
  if (commsGaps > 0) {
    lines.push("Communications leaned towards delay or minimal detail at times. Straightforward, timely messages usually protect both operations and reputation better.");
  }
  if (lowEngagement > 0) {
    lines.push("A few injects had little or no response. That often points to unclear ownership or people waiting for someone else to decide.");
  }
  if (strongMoves > scenario.injects.length / 2) {
    lines.push("On the positive side, many decisions leaned towards proactive action. That is a good base; tightening coordination and ownership will make it even stronger.");
  }

  lines.push("For the next round, focus on faster escalation when risk patterns align, clearer containment playbooks, and explicit ownership for external and internal messaging.");

  return lines.join(' ');
}

export function buildAAR(scenarioId, voteLog) {
  const scenario = getScenario(scenarioId);
  if (!scenario) return "";
  const lines = [];
  lines.push(`=== After-Action Review: ${scenario.title} ===`);
  lines.push("");

  for (const inj of scenario.injects) {
    const tally = getTallyFor(voteLog, scenarioId, inj.seq);
    const majority = computeMajority(tally);
    lines.push(`Inject #${inj.seq}  [${inj.time} | ${inj.phase}]`);
    lines.push(`Narrative: ${inj.narrative}`);
    if (inj.decision) {
      lines.push(`Decision: ${inj.decision.question}`);
      for (const [optKey, optText] of Object.entries(inj.decision.options || {})) {
        lines.push(`  ${optKey}. ${optText}`);
      }
    }
    lines.push(`Votes → A: ${tally.A}  B: ${tally.B}  C: ${tally.C}`);
    lines.push(`Majority: ${majority || 'None / Split'}`);
    const vcisoPerInject = buildVCISOInjectComment(inj, tally);
    lines.push(`vCISO: ${vcisoPerInject}`);
    lines.push("");
  }

  lines.push("--- vCISO Final View ---");
  lines.push(buildFinalVCISO(scenarioId, voteLog));
  return lines.join("\n");
}
