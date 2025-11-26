// engine.js
import { scenarios } from './scenarios.js';

export const sessionId = new URLSearchParams(window.location.search).get('s') || 'default';
export const channel = new BroadcastChannel('blackfog-ttx');

// Simple in-memory vote log (facilitator-side; players don't use this)
export function initVoteLog() {
  return {}; // { `${scenarioId}:${injectSeq}`: { A:0, B:0, C:0 } }
}

export function registerVote(voteLog, scenarioId, injectSeq, choice) {
  const key = `${scenarioId}:${injectSeq}`;
  if (!voteLog[key]) {
    voteLog[key] = { A: 0, B: 0, C: 0 };
  }
  if (!voteLog[key][choice]) {
    voteLog[key][choice] = 0;
  }
  voteLog[key][choice] += 1;
}

// vCISO comment bank (short, local-flavour but generic)
const vcisoCommentBank = {
  intel: [
    "Don’t assume best case. Escalate early when signals line up.",
    "Map out which systems and data are really in play before you relax.",
    "If you are unsure who owns the risk, that is already a gap."
  ],
  detection: [
    "Patterns across systems matter more than single alerts.",
    "If admin activity looks wrong, treat it as wrong until proven otherwise.",
    "Slow reaction to clear anomalies is a common weak point."
  ],
  containment: [
    "Containment is about buying time without losing control of the story.",
    "Be clear what you are shutting down, for how long, and who agreed.",
    "Small, fast containment beats waiting for a perfect picture."
  ],
  business: [
    "Keep language simple. People remember clarity, not jargon.",
    "If customers or partners are affected, plan for their questions now.",
    "Unclear ownership of communication usually shows up as mixed messages."
  ],
  recovery: [
    "Recovery should leave you stronger, not just ‘back to normal’.",
    "If you would not accept this setup next month, fix it now.",
    "Document the decisions as carefully as the technical steps."
  ],
  generic: [
    "Ask what you really know versus what you are assuming.",
    "Decide who owns each call; avoid decisions by crowd.",
    "If everyone is comfortable, you might be missing something important."
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
  else if (phase.includes('recovery')) bucket = 'recovery';

  const total = (tally?.A || 0) + (tally?.B || 0) + (tally?.C || 0);
  const base = total === 0
    ? "No responses recorded here. In a real incident, that would feel like slow engagement or unclear ownership."
    : pick(vcisoCommentBank[bucket] || vcisoCommentBank.generic);
  return base;
}

export function computeMajority(tally) {
  if (!tally) return null;
  let best = null;
  let bestVal = -1;
  for (const opt of ['A', 'B', 'C']) {
    const v = tally[opt] || 0;
    if (v > bestVal) {
      bestVal = v;
      best = opt;
    }
  }
  if (bestVal <= 0) return null;
  // check tie
  let countBest = 0;
  for (const opt of ['A', 'B', 'C']) {
    if ((tally[opt] || 0) === bestVal) countBest++;
  }
  if (countBest > 1) return null;
  return best;
}

export function buildVCISOFInalDebrief(scenarioId, voteLog) {
  const scenario = scenarios[scenarioId];
  if (!scenario) return "No scenario data available.";

  const injectResults = [];
  let slowEscalation = 0;
  let weakContainment = 0;
  let commsIssues = 0;
  let lowEngagement = 0;
  let strongMoves = 0;

  for (const inj of scenario.injects) {
    const key = `${scenarioId}:${inj.seq}`;
    const tally = voteLog[key] || { A: 0, B: 0, C: 0 };
    const majority = computeMajority(tally);
    const total = (tally.A || 0) + (tally.B || 0) + (tally.C || 0);

    const phase = (inj.phase || '').toLowerCase();

    if (phase.includes('intel') && majority === 'C') slowEscalation++;
    if (phase.includes('contain') && majority !== 'A') weakContainment++;
    if (phase.includes('business') && majority === 'C') commsIssues++;
    if (total === 0) lowEngagement++;
    if (majority === 'A') strongMoves++;

    injectResults.push({ inj, tally, majority });
  }

  const totalInjects = scenario.injects.length || 1;
  const lines = [];
  lines.push("Overall, the team put in effort, but several patterns stand out.");

  if (slowEscalation > 0) {
    lines.push("Early signals were not acted on quickly enough. Faster escalation would reduce uncertainty.");
  }
  if (weakContainment > 0) {
    lines.push("Containment decisions tended to be cautious. In real incidents, decisive action with clear communication matters.");
  }
  if (commsIssues > 0) {
    lines.push("Communication choices sometimes leaned towards silence or delay. That usually creates confusion later.");
  }
  if (lowEngagement > 0) {
    lines.push("Some injects had little or no response. That often points to unclear roles or hesitation to take ownership.");
  }
  if (strongMoves > totalInjects / 2) {
    lines.push("On the positive side, many decisions leaned towards proactive action. That is a solid base to build on.");
  }

  lines.push("For next time, focus on clearer ownership, faster escalation when patterns emerge, and more structured communication.");

  return lines.join(" ");
}

// Build a simple AAR object summarising votes + vCISO comments
export function buildAAR(scenarioId, voteLog) {
  const scenario = scenarios[scenarioId];
  if (!scenario) return null;
  const perInject = [];

  for (const inj of scenario.injects) {
    const key = `${scenarioId}:${inj.seq}`;
    const tally = voteLog[key] || { A: 0, B: 0, C: 0 };
    const majority = computeMajority(tally);
    const vcisoComment = buildVCISOInjectComment(inj, tally);

    perInject.push({
      seq: inj.seq,
      phase: inj.phase,
      time: inj.time,
      question: inj.decision?.question || "",
      tally,
      majority,
      vcisoComment
    });
  }

  const finalDebrief = buildVCISOFInalDebrief(scenarioId, voteLog);

  return {
    scenarioId,
    title: scenario.title,
    perInject,
    finalDebrief
  };
}
