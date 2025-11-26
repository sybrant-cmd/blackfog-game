// engine.mjs
// BlackFog TTX ES-module engine (Optimised Production Version)

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

// --- Vote tracking ---
export function initVoteLog() { return {}; }

export function registerVote(voteLog, scenarioId, seq, choice, playerId) {
  const key = `${scenarioId}:${seq}`;
  if (!voteLog[key]) voteLog[key] = { A:0, B:0, C:0, voters:{} };
  if (playerId && voteLog[key].voters[playerId]) return;
  if (!['A','B','C'].includes(choice)) return;
  voteLog[key][choice]++; 
  if (playerId) voteLog[key].voters[playerId] = true;
}

export function getTallyFor(voteLog, scenarioId, seq) {
  const key = `${scenarioId}:${seq}`;
  const v = voteLog[key] || {};
  return { A:v.A||0, B:v.B||0, C:v.C||0 };
}

export function computeMajority(tally) {
  const arr=[['A',tally.A||0],['B',tally.B||0],['C',tally.C||0]];
  arr.sort((a,b)=>b[1]-a[1]);
  if (arr[0][1]===0) return null;
  const top=arr[0][1];
  return arr.filter(x=>x[1]===top).length>1?null:arr[0][0];
}

// vCISO commentary
const vcisoBuckets={
 intel:["Early hints...","Signals lining up..."],
 detection:["Off-pattern admin activity...","Unusual behaviour requires escalation."],
 containment:["Containment needs clarity.","Pre-agreed actions increase speed."],
 business:["Clear messages matter.","If you don’t set narrative, others will."],
 recovery:["Recovery strengthens posture.","Rebuild to higher standard."],
 generic:["Clarity and readiness matter.","Good teams handle incidents well."]
};

function pick(a){return a[Math.floor(Math.random()*a.length)];}

export function buildVCISOInjectComment(inject,tally){
 const phase=(inject.phase||'').toLowerCase();
 let b='generic';
 if(phase.includes('intel'))b='intel';
 if(phase.includes('detect'))b='detection';
 if(phase.includes('contain'))b='containment';
 if(phase.includes('business'))b='business';
 if(phase.includes('recover'))b='Recovery';
 const total=(tally.A||0)+(tally.B||0)+(tally.C||0);
 if(total===0)return"Silence indicates unclear ownership.";
 return pick(vcisoBuckets[b]||vcisoBuckets.generic);
}

export function buildFinalVCISO(scId,voteLog){
 const s=getScenario(scId);
 let slow=0,weak=0,com=0,strong=0,low=0;
 for(const inj of s.injects){
   const tall=getTallyFor(voteLog,scId,inj.seq);
   const tot=tall.A+tall.B+tall.C;
   const maj=computeMajority(tall);
   const p=inj.phase.toLowerCase();
   if(tot===0)low++;
   if(maj==='A')strong++;
   if(p.includes('intel')&&maj==='C')slow++;
   if(p.includes('contain')&&maj!=='A')weak++;
   if(p.includes('business')&&(maj==='B'||maj==='C'))com++;
 }
 return `Patterns: slowEsc=${slow}, weakContain=${weak}, commsGaps=${com}, lowEng=${low}, strongMoves=${strong}.`;
}

export function buildAAR(scId,voteLog){
 const s=getScenario(scId);
 const lines=[`=== After-Action Review: ${s.title} ===`,""];
 for(const inj of s.injects){
   const t=getTallyFor(voteLog,scId,inj.seq);
   const m=computeMajority(t);
   lines.push(`Inject #${inj.seq} [${inj.time} | ${inj.phase}]`);
   lines.push("Narrative: "+inj.narrative);
   if(inj.decision){
     lines.push("Decision: "+inj.decision.question);
     for(const [k,v]of Object.entries(inj.decision.options))lines.push(`  ${k}. ${v}`);
   }
   lines.push(`Votes → A:${t.A} B:${t.B} C:${t.C}`);
   lines.push("Majority: "+(m||"None / Split"));
   lines.push("vCISO: "+buildVCISOInjectComment(inj,t));
   lines.push("");
 }
 lines.push("--- vCISO Final ---");
 lines.push(buildFinalVCISO(scId,voteLog));
 return lines.join("\n");
}
