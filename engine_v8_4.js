import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  get,
  update,
  onDisconnect
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBjnfJOD8bK-PLKiFOYzC8Yz2S7g1hM1W0",
  authDomain: "rws-blackfog-game.firebaseapp.com",
  databaseURL: "https://rws-blackfog-game-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rws-blackfog-game",
  storageBucket: "rws-blackfog-game.firebasestorage.app",
  messagingSenderId: "473543964029",
  appId: "1:473543964029:web:4bc0db33634ed2f8894814"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const $ = (id) => document.getElementById(id);

function getSessionId() {
  const urlS = new URLSearchParams(window.location.search).get("s");
  return urlS && urlS.trim() ? urlS.trim() : "default";
}

/* -------- Static Scenario + Inject Library (Linear) -------- */

const staticScenarios = {
  blackfog: {
    title: "Operation BlackFog – Supply-Chain Compromise (Static Run)",
    desc: "A trusted payment vendor pushes an unscheduled update that quietly opens a path into RWS finance and loyalty systems. This static run walks from first signal to late-stage business pressure.",
    injects: [
      {
        seq: 1,
        time: "T+0m",
        type: "Intel",
        text: "PayGateX notifies the ops team of an 'urgent compatibility patch' for POS endpoints, rolled out directly from their side. No internal change ticket exists, and the rollout appears outside normal windows.",
        decision: {
          question: "How should RWS react to this unexpected vendor-driven rollout?",
          options: {
            A: "Freeze the rollout and demand a full technical explanation and artifacts from PayGateX.",
            B: "Allow the rollout to continue but place all patched endpoints under stricter monitoring.",
            C: "Treat this as routine vendor operations and avoid raising alarms."
          }
        }
      },
      {
        seq: 2,
        time: "T+10m",
        type: "Intel",
        text: "Change monitoring tools show multiple POS endpoints pulling binaries from a new CDN hostname attributed to PayGateX, which was not part of the original allow-list.",
        decision: {
          question: "What is your immediate technical response to the new CDN host?",
          options: {
            A: "Block the new CDN host at the perimeter until it is formally validated.",
            B: "Collect sample binaries, sandbox them, then decide on blocking.",
            C: "Log the observation and rely purely on endpoint security as the safety net."
          }
        }
      },
      {
        seq: 3,
        time: "T+20m",
        type: "Detection",
        text: "EDR begins surfacing low-severity alerts about unsigned binaries running from the PayGateX patch directory on several POS endpoints. No single alert is critical, but the pattern is unusual.",
        decision: {
          question: "How do you position this pattern to your SOC analysts?",
          options: {
            A: "Classify this as a probable incident and escalate the alerts as high priority.",
            B: "Direct analysts to investigate in-depth while keeping BAU running.",
            C: "Silence low-severity alerts for this path to avoid noise during operations."
          }
        }
      },
      {
        seq: 4,
        time: "T+30m",
        type: "Containment",
        text: "Network telemetry shows outbound connections from a subset of patched POS endpoints to an IP range not associated with PayGateX, over unusual ports for POS traffic.",
        decision: {
          question: "What containment move do you authorise at the network layer?",
          options: {
            A: "Block and sinkhole the suspicious IP range for the entire estate immediately.",
            B: "Throttle connections, mirror the traffic, and observe while preparing a block.",
            C: "Create IDS rules and monitor without blocking for now."
          }
        }
      },
      {
        seq: 5,
        time: "T+45m",
        type: "Business",
        text: "Finance leadership reports intermittent POS issues at a premium outlet cluster. They want clarity on whether this is a cyber incident or 'just a vendor glitch' before the evening peak.",
        decision: {
          question: "How do you frame the situation to Finance and senior leadership?",
          options: {
            A: "Clearly label this as a suspected cyber incident and explain the containment trade-offs.",
            B: "Describe it as a controlled technical issue being actively contained.",
            C: "Avoid using incident language until all forensic evidence is confirmed."
          }
        }
      }
    ]
  },
  ransomware: {
    title: "Midweek Ransomware – Finance Shared Drive (Static Run)",
    desc: "Finance staff encounter corrupted and encrypted files on a shared drive used for payment runs. This static path walks from first report to backup and recovery decisions.",
    injects: [
      {
        seq: 1,
        time: "T+0m",
        type: "Intel",
        text: "Helpdesk tickets spike from Finance staff: Excel files used for payment runs open as unreadable or 'corrupted' on the Finance shared drive.",
        decision: {
          question: "What is your immediate instruction to helpdesk and users?",
          options: {
            A: "Tell users to disconnect affected PCs from the network and stop using the share.",
            B: "Collect screenshots/logs first, then decide on disconnecting.",
            C: "Suggest users retry later and flag to infrastructure only."
          }
        }
      },
      {
        seq: 2,
        time: "T+15m",
        type: "Detection",
        text: "Monitoring shows a spike in file renames and new extensions appearing on the Finance share within a short window. Some filenames now include a suspicious extension.",
        decision: {
          question: "How do you classify the event at this stage?",
          options: {
            A: "Probable ransomware – trigger the ransomware playbook.",
            B: "Serious storage anomaly – continue investigating before escalation.",
            C: "Likely backup or sync side-effect – observe only."
          }
        }
      },
      {
        seq: 3,
        time: "T+30m",
        type: "Containment",
        text: "Encryption activity spills from the Finance share into a more general corporate 'Shared' drive, used across several departments.",
        decision: {
          question: "What containment step do you authorise for file services?",
          options: {
            A: "Disconnect all affected file servers from the network.",
            B: "Disable SMB for Finance while keeping other departments online.",
            C: "Attempt to kill suspected processes but keep shares mounted."
          }
        }
      },
      {
        seq: 4,
        time: "T+50m",
        type: "Business",
        text: "A generic ransom note appears on several Finance desktops, demanding cryptocurrency payment within 48 hours. Some staff start to panic about payroll.",
        decision: {
          question: "How do you brief ExCo on the situation?",
          options: {
            A: "Explicitly describe this as a ransomware incident with containment under way.",
            B: "Describe it as 'file access degradation' while you validate details.",
            C: "Delay any ExCo briefing until you confirm the exact variant and impact."
          }
        }
      },
      {
        seq: 5,
        time: "T+90m",
        type: "Recovery",
        text: "Backups for the last 24 hours appear intact, but restoring them will delay payment runs and some external commitments.",
        decision: {
          question: "How do you balance restoration versus immediate business pressure?",
          options: {
            A: "Prioritise full restoration from backups, accepting short-term disruption.",
            B: "Restore selectively for critical payments only and accept some residual risk.",
            C: "Delay restoration to avoid any disruption to the current payment schedule."
          }
        }
      }
    ]
  },
  phishing: {
    title: "VIP Phishing & Executive Account Takeover (Static Run)",
    desc: "A targeted phishing campaign hits executives and selected VIP guests. This static path walks through mailbox abuse, guest impact and regulatory pressure.",
    injects: [
      {
        seq: 1,
        time: "T+0m",
        type: "Intel",
        text: "Mail gateway reports a spike in emails spoofing the CEO, sent to several directors with urgent wire-transfer requests.",
        decision: {
          question: "What is your very first action?",
          options: {
            A: "Block lookalike domains and warn recipients via out-of-band channels.",
            B: "Quarantine new emails but monitor existing ones silently.",
            C: "Allow mail flow and wait for confirmed user incidents."
          }
        }
      },
      {
        seq: 2,
        time: "T+20m",
        type: "Detection",
        text: "A PA reports clicking a link in an 'updated meeting invite' from the CEO and entering credentials into a very convincing login page.",
        decision: {
          question: "How do you handle this specific potential credential compromise?",
          options: {
            A: "Force password reset and revoke all tokens and sessions for the account.",
            B: "Perform targeted MFA reset and token revocation only.",
            C: "Advise the PA to monitor for unusual activity but avoid disruption."
          }
        }
      },
      {
        seq: 3,
        time: "T+35m",
        type: "Detection",
        text: "Mail logs show forwarding rules created on a director’s mailbox, redirecting copies of sensitive emails to an external address.",
        decision: {
          question: "What scope of detection and clean-up do you trigger?",
          options: {
            A: "Hunt for similar rules across all VIP and finance-related mailboxes.",
            B: "Limit checks to the director’s immediate team and assistants.",
            C: "Remove the specific rule and move on."
          }
        }
      },
      {
        seq: 4,
        time: "T+60m",
        type: "Business",
        text: "Rumours of 'executive email hacking' begin spreading internally. Some VIPs start asking relationship managers if their communications are safe.",
        decision: {
          question: "How do you handle internal and VIP-facing communications?",
          options: {
            A: "Issue a transparent advisory acknowledging targeted phishing of executives.",
            B: "Publish a generic phishing reminder without mentioning executives.",
            C: "Avoid any communications until all investigations are finished."
          }
        }
      },
      {
        seq: 5,
        time: "T+120m",
        type: "Recovery",
        text: "Regulators ask whether any guest or VIP personal data may have been exposed via compromised mailboxes.",
        decision: {
          question: "What do you prioritise in your response to regulators?",
          options: {
            A: "Prepare a clear incident timeline, decisions log and evidence pack.",
            B: "Provide a minimal written statement with high-level assurances only.",
            C: "Delay detailed engagement while hoping the inquiry loses momentum."
          }
        }
      }
    ]
  }
};

/* ---------- vCISO & ticker (static, no AI difficulty) ---------- */

const vcisoCommentBank = {
  Intel: [
    "If this landed on my desk, I’d treat it as the first line of an incident timeline, not a random noisy alert.",
    "This is exactly the sort of detail that decides whether we intervene early or write a painful report later.",
    "The key is not whether this is definitely malicious, but whether it’s unusual enough to justify a stronger move.",
    "When something like this appears slightly out of profile, it rarely disappears on its own.",
    "Right now you’re deciding whether this stays as a small operational story or becomes page one of a major incident."
  ],
  Detection: [
    "Your tooling is telling you a story in fragments. You will never get a perfectly complete picture in real time.",
    "Patterns matter more than individual alerts. Step back and look at the sequence so far.",
    "Good detection is about being willing to act before every single checkbox is ticked.",
    "If this is a false positive, you can explain a cautious reaction. If it isn’t, hesitation is much harder to defend.",
    "This is one of those moments where you decide if the SOC is a monitoring function or a decision-making function."
  ],
  Containment: [
    "Containment is where someone’s KPIs feel pain. That’s exactly why clear, early decisions matter.",
    "There is no zero-impact option. You’re choosing where the impact lands and how you explain it afterwards.",
    "Ask yourself a simple question: if this escalates overnight, will you wish you had moved harder here?",
    "If you do nothing, that’s still a decision – it just won’t look like one in the timeline.",
    "You want to be able to look the CFO in the eye later and explain this call in three calm sentences."
  ],
  Business: [
    "From the business side, the real question is whether someone credible is clearly steering the response.",
    "Leaders don’t need every technical detail, they need clarity on impact and what you’re doing next.",
    "The way you frame this now sets the tone for the rest of the organisation’s behaviour.",
    "Try to avoid either panic or spin. Plain, specific language builds more trust than hero stories.",
    "Silence will be filled with rumour. If you don’t shape the narrative, others will."
  ],
  Recovery: [
    "Recovery is where organisations are tempted to declare victory too early and quietly move on.",
    "This is the phase where you decide whether anything structurally changes, or whether this becomes 'just another incident'.",
    "If nothing meaningful is different three months from now, then all we did was run a stressful drill.",
    "Attackers love environments that rush to 'systems back up' and skip the harder lessons.",
    "Use this moment to lock in improvements while people still remember how uncomfortable this felt."
  ],
  NoDecision: [
    "You’ve effectively chosen to move on without a single clear answer. That happens in real incidents more often than people admit.",
    "No formal decision is itself a signal: it usually means the organisation was not ready to commit to one trade-off.",
    "If this were a real incident, 'no decision' here would be something auditors and regulators look at very closely.",
    "In future, aim to at least document the range of views and who would have backed which option.",
    "Sometimes the most honest takeaway is that decision-making under pressure needs as much practice as the technical work."
  ]
};

const extraLines = {
  calm: [
    "Take a breath and separate what you actually know from what you are inferring.",
    "If something feels off, listen to that pattern-recognition; it’s often your best early warning.",
    "You don’t need a perfect answer – you need a defendable one in a reasonable time.",
    "A clear, shared one-line summary with your team will reduce a lot of noise.",
    "Most good incident calls sound almost boring when written down – that’s a good sign."
  ],
  direct: [
    "At some point someone has to say, 'We’re doing this.' Don’t drag that moment out indefinitely.",
    "If you had to decide in the next sixty seconds, what would you pick and why?",
    "Remember: not acting is also an action – it just rarely gets written down as clearly.",
    "Think about what future-you will wish you’d done from this exact point.",
    "This is more about judgement than tooling. The tools are here to inform, not replace you."
  ],
  human: [
    "It’s normal to feel a bit of pressure here – the aim is to let it sharpen your focus, not paralyse you.",
    "Imagine explaining this call tomorrow to someone you respect. Would you still stand by it?",
    "Your tone will set the atmosphere in the room. Calm and specific usually wins.",
    "Even experienced teams misstep. What matters is how quickly and openly you correct course.",
    "Incidents are stressful, but they are also one of the best ways to grow as a team if you reflect properly afterwards."
  ]
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function chooseTone(context = {}) {
  const phase = context.phase || "intel";
  if (phase === "intel") return "calm";
  if (phase === "decision") return "direct";
  if (phase === "after") return "human";
  return "calm";
}

let lastVCISOText = "";

function speakLikeVCISOStatic(kind, context = {}) {
  const vcisoTyping = $("vcisoTyping");
  const vcisoMsg = $("vcisoMsg");
  if (!vcisoMsg || !vcisoTyping) return;

  let pool;
  if (kind === "NoDecision") pool = vcisoCommentBank.NoDecision;
  else pool = vcisoCommentBank[kind] || vcisoCommentBank.Intel;
  if (!pool || !pool.length) pool = vcisoCommentBank.Intel;

  const tone = chooseTone(context);
  const extras = extraLines[tone] || extraLines.calm;

  let phaseHint = "";
  if (context.phase === "intel") {
    phaseHint = " Right now you’re deciding whether this is background noise or the start of a real incident story.";
  } else if (context.phase === "decision") {
    phaseHint = " You’re choosing between imperfect options – that’s exactly how real incidents work.";
  } else if (context.phase === "after") {
    phaseHint = " This moment will usually show up in any serious post-incident review.";
  }

  let explicitLine = "";
  const inj = context.inject;
  if (context.choice && inj && inj.decision && inj.decision.options) {
    const ch = context.choice;
    const label = inj.decision.options[ch];
    if (label) {
      const shortLabel = label.length > 70 ? label.slice(0, 67) + "…" : label;
      explicitLine = ` You chose option ${ch} – “${shortLabel}”. That choice says a lot about how you balance risk and comfort.`;
    }
  } else if (kind === "NoDecision") {
    explicitLine = " In practice, this looks like the organisation being unable or unwilling to commit to a single trade-off.";
  }

  let msg;
  let attempts = 0;
  do {
    const base = pick(pool);
    const extra = Math.random() < 0.8 ? pick(extras) : "";
    msg = base + phaseHint + explicitLine + " " + extra;
    attempts++;
  } while (msg === lastVCISOText && attempts < 5);
  lastVCISOText = msg;

  vcisoTyping.style.display = "block";
  vcisoMsg.textContent = "";
  let i = 0;
  const step = 3 + Math.floor(Math.random() * 4);
  const interval = setInterval(() => {
    vcisoMsg.textContent = msg.slice(0, i);
    i += step;
    if (i >= msg.length) {
      vcisoMsg.textContent = msg;
      vcisoTyping.style.display = "none";
      clearInterval(interval);
    }
  }, 40);
}

/* ---------- Ticker (CNA-style static) ---------- */

const worldNews = [
  "Global markets stay alert as boards push for clearer cyber resilience reporting.",
  "Major economies review supply-chain cyber rules after a string of payment platform incidents."
];
const sgNews = [
  "Singapore regulators reiterate expectations for managing third-party cyber risk in critical sectors.",
  "Local hospitality operators refresh cyber drills ahead of peak travel seasons."
];
const cyberNews = [
  "CERT advisories highlight continued growth in supply-chain and ransomware activity across the region.",
  "Analysts warn that business email compromise remains a top driver of direct financial loss."
];
const travelNews = [
  "Regional tourism rebounds strongly, with guests expecting seamless and secure digital journeys.",
  "Hospitality groups invest in both guest experience and stronger incident playbooks."
];
const opsNews = [
  "Boards ask tougher questions on incident recovery time and lessons learned from near-misses.",
  "More organisations run joint business–cyber crisis simulations ahead of major events."
];

let tickerItems = [];

function refreshTickerItems() {
  tickerItems = [
    { cat: "World", text: pick(worldNews) },
    { cat: "Singapore", text: pick(sgNews) },
    { cat: "Cyber", text: pick(cyberNews) },
    { cat: "Travel", text: pick(travelNews) },
    { cat: "Business", text: pick(opsNews) }
  ];
}

function renderTicker() {
  const host = $("tickerTrack");
  if (!host) return;
  const items = tickerItems.length
    ? tickerItems
    : [{ cat: "Cyber", text: "Monitoring live exercise – no external impact reported." }];
  const html = items
    .map(item => {
      const safe = (item.text || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return `<span class="ticker-item">${safe} • <strong>${item.cat}</strong></span>`;
    })
    .join("");
  host.innerHTML = html + html;
}

/* ---------- Facilitator (static mode) ---------- */

export function initFacilitator() {
  if (document.body.getAttribute("data-role") !== "facilitator") return;

  const session = getSessionId();
  const sessionIdEl = $("sessionId");
  if (sessionIdEl) sessionIdEl.textContent = session;

  function log(msg) {
    const host = $("log");
    if (!host) return;
    const line = document.createElement("div");
    line.className = "log-line";
    const t = new Date().toLocaleTimeString();
    line.textContent = "[" + t + "] " + msg;
    host.prepend(line);
  }

  let exerciseEnded = false;
  let staticInjects = [];
  let currentIndex = 0;
  let latestPlayers = {};
  let latestVotesSnapshot = {};

  function renderTimeline() {
    const host = $("timeline");
    if (!host) return;
    host.innerHTML = "";
    staticInjects.forEach(inj => {
      const row = document.createElement("div");
      row.className = "inj-row";
      const timeEl = document.createElement("div");
      timeEl.className = "inj-time";
      timeEl.textContent = inj.time || "T+?m";
      const typeEl = document.createElement("div");
      typeEl.className = "inj-type";
      typeEl.textContent = `${inj.type || "Intel"} #${inj.seq}`;
      const body = document.createElement("div");
      const textEl = document.createElement("div");
      textEl.className = "inj-text";
      textEl.textContent = inj.text || "";
      body.appendChild(textEl);
      if (inj.decision && inj.decision.question) {
        const decEl = document.createElement("div");
        decEl.className = "inj-dec";
        decEl.textContent = `Decision: ${inj.decision.question}`;
        body.appendChild(decEl);
      }
      row.appendChild(timeEl);
      row.appendChild(typeEl);
      row.appendChild(body);
      host.appendChild(row);
    });
  }

  function refreshVoteOverlay() {
    const overlay = $("voteOverlay");
    if (!overlay) return;

    const inj = staticInjects[currentIndex - 1];
    if (!inj || !inj.decision || !inj.decision.question) {
      overlay.style.display = "none";
      return;
    }

    const seqKey = String(inj.seq);
    const votesForSeq = latestVotesSnapshot[seqKey] || {};
    const totalPlayers = Object.keys(latestPlayers || {}).length;
    const voters = Object.values(votesForSeq);
    const respondedCount = voters.length;

    const tally = { A: 0, B: 0, C: 0 };
    const byChoice = { A: [], B: [], C: [] };
    voters.forEach(v => {
      const ch = v.choice;
      const name = v.name || v.playerId || "Unknown";
      if (ch && tally[ch] !== undefined) {
        tally[ch] += 1;
        byChoice[ch].push(name);
      }
    });

    const pending = [];
    Object.values(latestPlayers || {}).forEach(p => {
      const pid = p.id;
      const name = p.name || pid;
      const hasVoted = Object.values(votesForSeq).some(v => v.playerId === pid);
      if (!hasVoted) pending.push(name);
    });

    const titleEl = $("voteOverlayTitle");
    const bodyEl = $("voteOverlayBody");
    const barEl = $("voteOverlayBar");
    const countEl = $("voteOverlayCount");

    if (titleEl) titleEl.textContent = `Voting – inject #${inj.seq}`;

    const lines = [];
    lines.push(`A (${tally.A}): ${byChoice.A.join(", ") || "—"}`);
    lines.push(`B (${tally.B}): ${byChoice.B.join(", ") || "—"}`);
    lines.push(`C (${tally.C}): ${byChoice.C.join(", ") || "—"}`);
    if (totalPlayers > 0) {
      if (pending.length) {
        lines.push(`Waiting for: ${pending.join(", ")}`);
      } else {
        lines.push("All players have submitted a choice.");
      }
    }
    if (bodyEl) bodyEl.textContent = lines.join("\n");

    const pct = totalPlayers > 0 ? Math.min(100, Math.round((respondedCount / totalPlayers) * 100)) : 0;
    if (barEl) barEl.style.width = pct + "%";
    if (countEl) countEl.textContent = `${respondedCount} / ${totalPlayers} responses`;

    overlay.style.display = totalPlayers > 0 ? "block" : "none";
  }

  onValue(ref(db, `sessions/${session}/players`), snap => {
    const data = snap.val() || {};
    latestPlayers = data;

    const entries = Object.values(data);
    const pc = $("playersCount");
    if (pc) pc.textContent = entries.length;
    const host = $("playersList");
    if (!host) return;
    host.innerHTML = "";

    entries.sort((a, b) => (a.name || a.id || "").localeCompare(b.name || b.id || ""));
    entries.forEach(p => {
      const row = document.createElement("div");
      row.className = "player-row";
      const name = document.createElement("div");
      name.className = "player-name";
      name.textContent = p.name || p.id || "Unknown";
      const st = document.createElement("div");
      st.className = "player-status";
      const age = Date.now() - (p.ts || 0);
      const stale = age > 12000;
      const base = p.status || "online";
      st.textContent = stale ? "offline" : base;
      row.appendChild(name);
      row.appendChild(st);
      host.appendChild(row);
    });

    refreshVoteOverlay();
  });

  onValue(ref(db, `sessions/${session}/votes`), snap => {
    latestVotesSnapshot = snap.val() || {};
    refreshVoteOverlay();
  });

  const btnLoadScenario = $("btnLoadScenario");
  const btnPublishScenario = $("btnPublishScenario");
  const btnNextInject = $("btnNextInject");
  const btnEndVoting = $("btnEndVoting");
  const btnEndExercise = $("btnEndExercise");
  const btnNewSession = $("btnNewSession");
  const scenarioPresetSel = $("scenarioPreset");

  if (btnLoadScenario) {
    btnLoadScenario.onclick = () => {
      if (exerciseEnded) {
        alert("Exercise has ended. Start a new session to load a scenario.");
        return;
      }
      const key = scenarioPresetSel.value || "blackfog";
      const sc = staticScenarios[key];
      if (!sc) return;
      $("scTitle").value = sc.title;
      $("scDesc").value = sc.desc;

      staticInjects = sc.injects.map(x => ({ ...x }));
      currentIndex = 0;
      renderTimeline();
      log(`Loaded static scenario "${sc.title}" into editor.`);
    };
  }

  if (btnPublishScenario) {
    btnPublishScenario.onclick = async () => {
      if (exerciseEnded) {
        alert("Exercise has ended. Cannot publish scenario in this session.");
        return;
      }
      const key = scenarioPresetSel.value || "blackfog";
      const sc = staticScenarios[key];
      if (!sc) {
        alert("No static scenario loaded.");
        return;
      }
      const title = $("scTitle").value || sc.title;
      const desc = $("scDesc").value || sc.desc;
      await set(ref(db, `sessions/${session}/scenario`), {
        title,
        desc,
        key,
        published: true,
        at: Date.now()
      });
      await set(ref(db, `sessions/${session}/ended`), null);
      await set(ref(db, `sessions/${session}/latestInject`), null);
      await set(ref(db, `sessions/${session}/votes`), null);
      await set(ref(db, `sessions/${session}/control`), null);

      currentIndex = 0;
      renderTimeline();
      refreshVoteOverlay();
      log(`Scenario "${title}" published to players.`);
    };
  }

  async function sendInject(inj) {
    if (exerciseEnded) {
      log("Attempted to send inject after exercise end – blocked.");
      return;
    }
    const payload = { ...inj, at: Date.now() };
    await set(ref(db, `sessions/${session}/latestInject`), payload);
    await push(ref(db, `sessions/${session}/injects`), payload);
    log(`Static inject #${inj.seq} sent to players.`);
  }

  if (btnNextInject) {
    btnNextInject.onclick = async () => {
      if (exerciseEnded) {
        alert("Exercise has already ended. No further injects can be sent.");
        return;
      }
      if (!staticInjects.length) {
        alert("No static scenario loaded. Load and publish a scenario first.");
        return;
      }
      if (currentIndex >= staticInjects.length) {
        alert("All static injects for this scenario have been sent.");
        return;
      }
      const inj = staticInjects[currentIndex];
      currentIndex += 1;

      // Clear previous votes for the new inject sequence
      await set(ref(db, `sessions/${session}/votes/${inj.seq}`), null);
      await update(ref(db, `sessions/${session}/control`), { endVote: null });

      await sendInject(inj);
      refreshVoteOverlay();
    };
  }

  if (btnEndVoting) {
    btnEndVoting.onclick = async () => {
      if (!staticInjects.length || currentIndex === 0) {
        alert("No active decision inject to end voting for.");
        return;
      }
      const inj = staticInjects[currentIndex - 1];
      if (!inj.decision || !inj.decision.question) {
        alert("The last inject is not a decision inject.");
        return;
      }
      const ok = confirm("End voting for this inject with no formal decision recorded?");
      if (!ok) return;
      await update(ref(db, `sessions/${session}/control`), {
        endVote: { seq: inj.seq, at: Date.now(), outcome: "none" }
      });
      log(`Voting manually closed by facilitator for inject #${inj.seq} (no formal decision).`);
    };
  }

  const btnBuildAAR = $("btnBuildAAR");
  if (btnBuildAAR) {
    btnBuildAAR.onclick = async () => {
      const votesSnap = await get(ref(db, `sessions/${session}/votes`));
      const votes = votesSnap.val() || {};
      const byInject = {};
      Object.keys(votes).forEach(seq => {
        const perPlayer = votes[seq] || {};
        const tally = { A: 0, B: 0, C: 0 };
        Object.values(perPlayer).forEach(v => {
          if (v && v.choice && tally[v.choice] !== undefined) {
            tally[v.choice] += 1;
          }
        });
        byInject[seq] = tally;
      });

      const host = $("aar");
      host.innerHTML = "";
      if (!staticInjects.length) {
        host.innerHTML = "<p class='muted'>No static injects loaded or sent yet.</p>";
        return;
      }

      const table = document.createElement("table");
      const thead = document.createElement("thead");
      thead.innerHTML = "<tr><th>#</th><th>Time</th><th>Type</th><th>Inject</th><th>A</th><th>B</th><th>C</th></tr>";
      table.appendChild(thead);
      const tbody = document.createElement("tbody");

      staticInjects.forEach(inj => {
        const seq = String(inj.seq);
        const tally = byInject[seq] || { A: 0, B: 0, C: 0 };
        const tr = document.createElement("tr");
        tr.innerHTML =
          `<td>${inj.seq}</td>` +
          `<td>${inj.time || ""}</td>` +
          `<td>${inj.type || ""}</td>` +
          `<td>${inj.text ? (inj.text.slice(0, 80) + (inj.text.length > 80 ? "…" : "")) : ""}</td>` +
          `<td>${tally.A}</td>` +
          `<td>${tally.B}</td>` +
          `<td>${tally.C}</td>`;
        tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      host.appendChild(table);
      log("AAR snapshot built from static inject votes.");
    };
  }

  if (btnEndExercise) {
    btnEndExercise.onclick = async () => {
      if (exerciseEnded) return;
      const ok = confirm("Are you sure you want to end the exercise for this session?");
      if (!ok) return;
      exerciseEnded = true;

      await set(ref(db, `sessions/${session}/ended`), {
        at: Date.now(),
        by: "facilitator"
      });
      await set(ref(db, `sessions/${session}/latestInject`), null);
      await set(ref(db, `sessions/${session}/votes`), null);
      await update(ref(db, `sessions/${session}/control`), {
        reset: Date.now()
      });

      if (btnNextInject) btnNextInject.disabled = true;
      if (btnPublishScenario) btnPublishScenario.disabled = true;
      if (btnLoadScenario) btnLoadScenario.disabled = true;
      if (btnEndVoting) btnEndVoting.disabled = true;

      log("Exercise has been ended for this session and reset signal sent to players.");
    };
  }

  if (btnNewSession) {
    btnNewSession.onclick = async () => {
      const current = session;
      const suggestion = current && current !== "default"
        ? current + "-2"
        : "session-" + Math.random().toString(36).slice(2, 6);

      const nextIdRaw = prompt("Enter new session ID (no spaces):", suggestion);
      if (!nextIdRaw) return;
      const nextId = nextIdRaw.trim();
      if (!nextId) return;

      await update(ref(db, `sessions/${session}/control`), {
        switchSession: nextId,
        switchAt: Date.now()
      });

      const url = new URL(window.location.href);
      url.searchParams.set("s", nextId);
      window.location.href = url.toString();
    };
  }

  log("Facilitator console initialised (static v8.4.1).");
}

/* ---------- Player (static mode) ---------- */

export function initPlayer() {
  if (document.body.getAttribute("data-role") !== "player") return;

  const session = getSessionId();
  const sessionPill = $("sessionPill");
  if (sessionPill) sessionPill.textContent = "Session " + session;

  function uid() {
    return "P-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  }
  const storedId = localStorage.getItem("rws_player_id") || uid();
  localStorage.setItem("rws_player_id", storedId);

  let storedName = localStorage.getItem("rws_player_name");
  if (!storedName) {
    storedName = prompt("Enter your display name for this exercise:", storedId) || storedId;
    localStorage.setItem("rws_player_name", storedName);
  }

  const playerRef = ref(db, `sessions/${session}/players/${storedId}`);
  set(playerRef, {
    id: storedId,
    name: storedName,
    ts: Date.now(),
    status: "online"
  });
  const playerPill = $("playerPill");
  if (playerPill) playerPill.textContent = storedName + " • Connected";

  setInterval(() => {
    update(playerRef, {
      ts: Date.now(),
      status: "online",
      lastSeen: Date.now()
    });
  }, 2500);
  onDisconnect(playerRef).update({ status: "offline", ts: Date.now() });

  refreshTickerItems();
  renderTicker();
  setInterval(() => {
    refreshTickerItems();
    renderTicker();
  }, 25000);

  function resetView() {
    $("scTitle").textContent = "Standby – awaiting scenario";
    $("scDesc").textContent =
      "Facilitator has not published the scenario yet. Once live, you'll see the RWS crisis context here.";
    if (window.__rwsTimer) {
      clearInterval(window.__rwsTimer);
      window.__rwsTimer = null;
    }
    $("injCard").style.display = "none";
    $("decCard").style.display = "none";
    $("endCard").style.display = "none";
    $("decStatus").style.display = "none";
    ["optA", "optB", "optC"].forEach(id => {
      const b = $(id);
      if (b) {
        b.textContent = "";
        b.disabled = false;
      }
    });
    $("timer").textContent = "--";
  }

  const btnRestart = $("btnRestart");
  if (btnRestart) btnRestart.onclick = () => resetView();

  onValue(ref(db, `sessions/${session}/scenario`), snap => {
    const v = snap.val();
    if (!v || !v.published) {
      resetView();
      return;
    }
    $("scTitle").textContent = v.title || "RWS Cyber Scenario";
    $("scDesc").textContent = v.desc || "";
    speakLikeVCISOStatic("Intel", { phase: "intel" });
  });

  let currentInjectSeq = null;
  let lastInject = null;

  onValue(ref(db, `sessions/${session}/latestInject`), snap => {
    const inj = snap.val();
    if (!inj) return;
    currentInjectSeq = inj.seq || null;
    lastInject = inj;

    const injCard = $("injCard");
    const decCard = $("decCard");
    const endCard = $("endCard");

    if (endCard && endCard.style.display === "block") {
      return;
    }

    injCard.style.display = "block";
    injCard.classList.remove("card-pop");
    void injCard.offsetWidth;
    injCard.classList.add("card-pop");
    $("injText").textContent = `[${inj.time || "T+?m"}] ${inj.text || ""}`;

    const dec = inj.decision || null;
    const statusEl = $("decStatus");
    const timerEl = $("timer");

    if (!dec || !dec.question) {
      decCard.style.display = "none";
      statusEl.style.display = "none";
      timerEl.textContent = inj.time || "Live";
      speakLikeVCISOStatic(inj.type || "Intel", { phase: "intel", inject: inj });
      return;
    }

    decCard.style.display = "block";
    decCard.classList.remove("card-pop");
    void decCard.offsetWidth;
    decCard.classList.add("card-pop");

    $("decQuestion").textContent = dec.question;
    statusEl.style.display = "none";
    ["optA", "optB", "optC"].forEach(id => {
      const b = $(id);
      if (b) b.disabled = false;
    });
    $("optA").textContent = dec.options && dec.options.A ? "A) " + dec.options.A : "";
    $("optB").textContent = dec.options && dec.options.B ? "B) " + dec.options.B : "";
    $("optC").textContent = dec.options && dec.options.C ? "C) " + dec.options.C : "";

    let remaining = 45;
    timerEl.classList.remove("timer-urgent");
    timerEl.textContent = remaining + "s";
    if (window.__rwsTimer) clearInterval(window.__rwsTimer);
    window.__rwsTimer = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(window.__rwsTimer);
        window.__rwsTimer = null;
        timerEl.textContent = "Time up";
        timerEl.classList.add("timer-urgent");
        ["optA", "optB", "optC"].forEach(id => {
          const b = $(id);
          if (b) b.disabled = true;
        });
        statusEl.style.display = "block";
        statusEl.textContent = "⏱ Time is up. Discuss what you would have chosen.";
        speakLikeVCISOStatic("NoDecision", { phase: "after", inject: inj });
        return;
      }
      if (remaining <= 10) {
        timerEl.classList.add("timer-urgent");
      }
      timerEl.textContent = remaining + "s";
    }, 1000);

    speakLikeVCISOStatic(inj.type || "Intel", { phase: "decision", inject: inj });
  });

  async function sendVote(choice) {
    if (!currentInjectSeq) return;
    if (window.__rwsTimer) {
      clearInterval(window.__rwsTimer);
      window.__rwsTimer = null;
    }
    const path = `sessions/${session}/votes/${currentInjectSeq}/${storedId}`;
    const payload = {
      playerId: storedId,
      name: storedName,
      choice,
      at: Date.now()
    };
    await set(ref(db, path), payload);
    ["optA", "optB", "optC"].forEach(id => {
      const b = $(id);
      if (b) b.disabled = true;
    });
    const statusEl = $("decStatus");
    statusEl.style.display = "block";
    statusEl.textContent = `✅ You chose option ${choice}. Be ready to explain your thinking.`;
    speakLikeVCISOStatic("Detection", { phase: "after", choice, inject: lastInject });
  }

  const optA = $("optA");
  const optB = $("optB");
  const optC = $("optC");
  if (optA) optA.onclick = () => sendVote("A");
  if (optB) optB.onclick = () => sendVote("B");
  if (optC) optC.onclick = () => sendVote("C");

  onValue(ref(db, `sessions/${session}/control/endVote`), snap => {
    const v = snap.val();
    if (!v || !v.seq) return;
    if (currentInjectSeq !== v.seq) return;
    if (window.__rwsTimer) {
      clearInterval(window.__rwsTimer);
      window.__rwsTimer = null;
    }
    ["optA", "optB", "optC"].forEach(id => {
      const b = $(id);
      if (b) b.disabled = true;
    });
    const statusEl = $("decStatus");
    statusEl.style.display = "block";
    statusEl.textContent = "🛑 Voting has been closed by the facilitator. No formal decision was recorded.";
    speakLikeVCISOStatic("NoDecision", { phase: "after", inject: lastInject });
  });

  onValue(ref(db, `sessions/${session}/ended`), snap => {
    const v = snap.val();
    const endCard = $("endCard");
    if (!endCard) return;
    if (!v) {
      endCard.style.display = "none";
      return;
    }
    if (window.__rwsTimer) {
      clearInterval(window.__rwsTimer);
      window.__rwsTimer = null;
    }
    $("injCard").style.display = "none";
    $("decCard").style.display = "none";
    $("decStatus").style.display = "none";
    ["optA", "optB", "optC"].forEach(id => {
      const b = $(id);
      if (b) b.disabled = true;
    });
    endCard.style.display = "block";
    speakLikeVCISOStatic("Recovery", { phase: "after" });
  });

  onValue(ref(db, `sessions/${session}/control/reset`), snap => {
    const v = snap.val();
    if (!v) return;
    resetView();
    const endCard = $("endCard");
    if (endCard) endCard.style.display = "block";
    speakLikeVCISOStatic("Recovery", { phase: "after" });
  });

  onValue(ref(db, `sessions/${session}/control/switchSession`), snap => {
    const next = snap.val();
    if (!next) return;
    if (next === session) return;
    window.location.href = `player.html?s=${encodeURIComponent(next)}`;
  });

  resetView();
}
