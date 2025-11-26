// scenarios.js
export const scenarios = {
  // 1) Managed File Transfer Zero-Day Exploit & Data Exfiltration
  sc01_mft_zero_day: {
    id: "sc01_mft_zero_day",
    title: "MFT Zero-Day Exploit & Data Exfiltration",
    description:
      "A widely used Managed File Transfer (MFT) platform is found to contain a critical zero-day vulnerability. " +
      "Your organisation depends on it for payroll, reporting, and exchanging bulk data with partners. " +
      "Threat actors are actively exploiting the flaw, and there are early signs your instance may be probed or compromised.",
    injects: [
      {
        seq: 1,
        time: "T+00m",
        phase: "Intel",
        severity: "High",
        impact: ["Data Exposure", "Operational"],
        cues: {
          severity: "■ HIGH",
          impact: ["● Data Exposure", "● Operational"],
          phase: "🔍 Intel"
        },
        narrative:
          "A security advisory from a trusted source reports an actively exploited zero-day in a popular MFT platform. " +
          "The advisory mentions web shells, mass file downloads, and no vendor patch available yet. " +
          "Your team confirms that your external file transfer gateway is running an affected version.",
        decision: {
          question: "What is your first concrete action?",
          options: {
            A: "Immediately block all external access to the MFT system and notify key stakeholders.",
            B: "Increase logging and monitoring on the MFT system, but keep it accessible to avoid business disruption.",
            C: "Wait for an official vendor bulletin specific to your version before taking any action."
          }
        },
        vcisoTag: "intel"
      },
      {
        seq: 2,
        time: "T+10m",
        phase: "Detection",
        severity: "High",
        impact: ["Data Exposure"],
        cues: {
          severity: "■ HIGH",
          impact: ["● Data Exposure"],
          phase: "🧭 Detection"
        },
        narrative:
          "Web and reverse-proxy logs show repeated requests matching payload patterns seen in public exploit PoCs. " +
          "The attempts started shortly after the advisory went public and are targeting your upload endpoints.",
        decision: {
          question: "How should you interpret and respond to these logs?",
          options: {
            A: "Treat them as likely exploitation attempts and assume the system may already be compromised.",
            B: "Flag them as suspicious but keep systems online and wait for more proof.",
            C: "Treat these as routine scanning noise and take no further action."
          }
        },
        vcisoTag: "detection"
      },
      {
        seq: 3,
        time: "T+25m",
        phase: "Detection",
        severity: "Critical",
        impact: ["Data Exposure", "Operational"],
        cues: {
          severity: "■ CRITICAL",
          impact: ["● Data Exposure", "● Operational"],
          phase: "🧭 Detection"
        },
        narrative:
          "Your team discovers unusual outbound connections from the MFT server to an IP address not seen in normal operations. " +
          "The traffic includes large encrypted blobs during a time when no scheduled transfers were expected.",
        decision: {
          question: "What is the most appropriate conclusion at this point?",
          options: {
            A: "Assume active compromise and initiate a formal incident response with high priority.",
            B: "Classify this as suspicious but avoid escalation to prevent unnecessary noise.",
            C: "Disable logging temporarily to reduce system load and revisit later."
          }
        },
        vcisoTag: "detection"
      },
      {
        seq: 4,
        time: "T+40m",
        phase: "Containment",
        severity: "Critical",
        impact: ["Data Exposure", "Operational", "Financial"],
        cues: {
          severity: "■ CRITICAL",
          impact: ["● Data Exposure", "● Operational", "● Financial"],
          phase: "🛑 Containment"
        },
        narrative:
          "Initial triage indicates that multiple large file archives were accessed from the MFT platform within the last few hours. " +
          "Some appear to contain payroll data, partner reports and bulk exports from internal systems. Business owners insist " +
          "that the platform must stay online to avoid missed payments and settlement delays.",
        decision: {
          question: "How do you balance containment with business pressure?",
          options: {
            A: "Isolate the MFT platform from all external connectivity immediately and stand up a manual fallback process.",
            B: "Limit access to a smaller set of ‘trusted’ partners while you continue to investigate.",
            C: "Keep the platform fully online to avoid financial penalties and address security once more evidence is gathered."
          }
        },
        vcisoTag: "containment"
      },
      {
        seq: 5,
        time: "T+60m",
        phase: "Business",
        severity: "Critical",
        impact: ["Data Exposure", "Regulatory", "Customer-Facing"],
        cues: {
          severity: "■ CRITICAL",
          impact: ["● Data Exposure", "● Regulatory", "● Customer-Facing"],
          phase: "📣 Business"
        },
        narrative:
          "A quick data mapping exercise confirms that the MFT handled files with identifiable personal and financial information. " +
          "You cannot yet prove that archives were fully exfiltrated, but access logs and outbound traffic suggest a high likelihood.",
        decision: {
          question: "How should you handle potential notification obligations at this stage?",
          options: {
            A: "Prepare and plan notifications based on probable exposure, even if some details are still uncertain.",
            B: "Wait until there is definitive forensic confirmation before considering any notifications.",
            C: "Rely on the vendor to handle all external communication since it is their product."
          }
        },
        vcisoTag: "business"
      },
      {
        seq: 6,
        time: "T+90m",
        phase: "Cross-Functional",
        severity: "High",
        impact: ["Operational", "Customer-Facing"],
        cues: {
          severity: "■ HIGH",
          impact: ["● Operational", "● Customer-Facing"],
          phase: "🗂 Cross-Functional"
        },
        narrative:
          "Key internal teams—Payroll, Finance, and a major external partner—are now in escalation calls asking when transfers " +
          "will resume. They acknowledge the risk but are concerned about missed cut-offs and downstream customer impact.",
        decision: {
          question: "How do you engage these stakeholders?",
          options: {
            A: "Communicate clearly that security containment is the priority and agree on a controlled manual workaround.",
            B: "Allow limited re-enablement of the MFT despite incomplete containment, to reduce business noise.",
            C: "Ask each team to decide individually how they want to proceed."
          }
        },
        vcisoTag: "business"
      },
      {
        seq: 7,
        time: "T+2h",
        phase: "Detection",
        severity: "High",
        impact: ["Data Exposure"],
        cues: {
          severity: "■ HIGH",
          impact: ["● Data Exposure"],
          phase: "🧭 Detection"
        },
        narrative:
          "Threat intelligence feeds start to report that data from multiple victims using the same MFT technology " +
          "is appearing on extortion sites. The indicators match your platform’s version and hosting geography, " +
          "but your organisation is not explicitly named—yet.",
        decision: {
          question: "What should you assume and plan for?",
          options: {
            A: "Assume your data may be among those exposed, and plan outward communication accordingly.",
            B: "Assume you have been spared unless you are explicitly named.",
            C: "Treat this as unrelated noise until proven otherwise."
          }
        },
        vcisoTag: "intel"
      },
      {
        seq: 8,
        time: "T+3h",
        phase: "Containment",
        severity: "High",
        impact: ["Operational"],
        cues: {
          severity: "■ HIGH",
          impact: ["● Operational"],
          phase: "🛑 Containment"
        },
        narrative:
          "Your team proposes rebuilding the MFT server from clean images and applying the latest available hardening guidance. " +
          "They recommend keeping it offline externally until alternative transfer patterns are agreed.",
        decision: {
          question: "How do you proceed with technical containment?",
          options: {
            A: "Rebuild and harden the platform, keeping it offline externally until governance and patterns are improved.",
            B: "Apply incremental fixes to the existing instance and bring it back online quickly.",
            C: "Decommission the platform entirely and ask business to find ad-hoc solutions."
          }
        },
        vcisoTag: "containment"
      },
      {
        seq: 9,
        time: "T+1d",
        phase: "Business",
        severity: "High",
        impact: ["Regulatory", "Customer-Facing"],
        cues: {
          severity: "■ HIGH",
          impact: ["● Regulatory", "● Customer-Facing"],
          phase: "📣 Business"
        },
        narrative:
          "Leadership asks for a clear statement: were customers or partners impacted, and what is the story if media or " +
          "regulators ask? Some teams argue that wording should be very conservative to avoid reputational damage.",
        decision: {
          question: "How should your response framing look?",
          options: {
            A: "A straightforward description of what happened, what data was at risk, and what you are doing now.",
            B: "Minimal wording emphasising that no confirmed impact has been observed, with few concrete details.",
            C: "No comment externally; rely on others to raise the issue first."
          }
        },
        vcisoTag: "business"
      },
      {
        seq: 10,
        time: "T+3d",
        phase: "Recovery",
        severity: "Medium",
        impact: ["Operational"],
        cues: {
          severity: "■ MEDIUM",
          impact: ["● Operational"],
          phase: "🔧 Recovery"
        },
        narrative:
          "The vendor releases a patch and additional configuration guidance. Applying it will require a maintenance window " +
          "and retesting of all critical data transfer workflows.",
        decision: {
          question: "How do you organise recovery?",
          options: {
            A: "Plan a structured maintenance window with testing, rollback, and extra monitoring after go-live.",
            B: "Apply the patch as soon as possible during business hours to minimise delay.",
            C: "Delay patching until partner pressure subsides and operations are calmer."
          }
        },
        vcisoTag: "recovery"
      },
      {
        seq: 11,
        time: "T+1w",
        phase: "Recovery",
        severity: "Medium",
        impact: ["Regulatory", "Data Exposure"],
        cues: {
          severity: "■ MEDIUM",
          impact: ["● Regulatory", "● Data Exposure"],
          phase: "🔧 Recovery"
        },
        narrative:
          "Forensic work confirms that some archives were accessed by an unauthorised account. You still cannot tie each file " +
          "to exact external exposure, but there is enough evidence of risk to specific data sets.",
        decision: {
          question: "How should you treat residual uncertainty?",
          options: {
            A: "Err on the side of transparency and treat at-risk records as potentially exposed.",
            B: "Treat uncertainty as a reason to avoid notifications unless forced.",
            C: "Delegate all further decisions to the vendor and step back."
          }
        },
        vcisoTag: "business"
      },
      {
        seq: 12,
        time: "T+2w",
        phase: "Cross-Functional",
        severity: "Medium",
        impact: ["Operational", "Regulatory", "Financial"],
        cues: {
          severity: "■ MEDIUM",
          impact: ["● Operational", "● Regulatory", "● Financial"],
          phase: "🗂 Cross-Functional"
        },
        narrative:
          "The dust settles and leadership asks for concrete lessons. They want to know what will change in vendor selection, " +
          "data minimisation, design of file transfers, and incident readiness.",
        decision: {
          question: "What should be the focus of long-term change?",
          options: {
            A: "Reshape how and why data is sent through MFT at all, and tighten vendor assessment and monitoring.",
            B: "Focus mainly on improving technical patching speed for similar platforms.",
            C: "Treat this as a one-off event and avoid major changes to avoid disruption."
          }
        },
        vcisoTag: "recovery"
      }
    ]
  },

  // 2) Identity Platform Support Breach & Token Hijack
  sc02_idp_support_breach: {
    id: "sc02_idp_support_breach",
    title: "Identity Platform Support Breach & Token Hijack",
    description:
      "Your identity provider (IdP) discloses that its support environment was accessed by an attacker. " +
      "Support artefacts may include admin session tokens and configuration details for multiple customers. " +
      "Shortly after the disclosure, you begin to see unusual administrative activity across several critical applications.",
    injects: [
      {
        seq: 1,
        time: "T+00m",
        phase: "Intel",
        severity: "High",
        impact: ["Operational", "Data Exposure"],
        cues: {
          severity: "■ HIGH",
          impact: ["● Operational", "● Data Exposure"],
          phase: "🔍 Intel"
        },
        narrative:
          "Your IdP vendor sends an advisory: a subset of their support environment was accessed by an unauthorised party. " +
          "Some customers may have had support tickets and debug files accessed, potentially including session cookies " +
          "or admin tokens captured during troubleshooting.",
        decision: {
          question: "How should you treat this advisory?",
          options: {
            A: "Assume there is a plausible risk to your tenant and start a structured review of IdP admin activity.",
            B: "File the advisory for reference and wait until the vendor confirms whether your tenant is affected.",
            C: "Treat it as low risk because you enforce MFA for all admins."
          }
        },
        vcisoTag: "intel"
      },
      {
        seq: 2,
        time: "T+30m",
        phase: "Detection",
        severity: "High",
        impact: ["Operational"],
        cues: {
          severity: "■ HIGH",
          impact: ["● Operational"],
          phase: "🧭 Detection"
        },
        narrative:
          "Your monitoring reveals an admin login from a region where your administrators are not normally located. " +
          "The device fingerprint does not match any known admin device, yet the IdP logs show a successful session with " +
          "high privileges.",
        decision: {
          question: "What is your immediate response to this admin session?",
          options: {
            A: "Revoke the session, temporarily lock the account, and start a broader review of recent admin activities.",
            B: "Send a message to the admin asking if they were travelling and wait for a reply.",
            C: "Ignore it, assuming it could be a VPN with different geolocation."
          }
        },
        vcisoTag: "detection"
      },
      {
        seq: 3,
        time: "T+45m",
        phase: "Detection",
        severity: "Critical",
        impact: ["Operational", "Data Exposure"],
        cues: {
          severity: "■ CRITICAL",
          impact: ["● Operational", "● Data Exposure"],
          phase: "🧭 Detection"
        },
        narrative:
          "Within the IdP audit logs, you see that several application integrations have had their role mappings changed. " +
          "Some non-admin users were granted elevated roles overnight, and new API tokens were created for an automation user " +
          "that normally does not change.",
        decision: {
          question: "How do you treat these changes?",
          options: {
            A: "Assume they are malicious, revert them, and treat this as a high-severity incident involving potential token theft.",
            B: "Log the changes as suspicious but keep them in place pending further investigation.",
            C: "Delete some of the tokens and leave others for convenience."
          }
        },
        vcisoTag: "detection"
      },
      {
        seq: 4,
        time: "T+1h",
        phase: "Containment",
        severity: "Critical",
        impact: ["Operational"],
        cues: {
          severity: "■ CRITICAL",
          impact: ["● Operational"],
          phase: "🛑 Containment"
        },
        narrative:
          "Several SaaS applications integrated with the IdP show unusual sign-ins from new devices and IP ranges. " +
          "Some of the activity uses legacy protocols or bypass paths that you had not fully restricted.",
        decision: {
          question: "What is your next containment step?",
          options: {
            A: "Force re-authentication for all privileged accounts and rotate all high-risk application tokens.",
            B: "Limit investigation to only the applications that show clear evidence of misuse.",
            C: "Delay any changes until the vendor provides more logs."
          }
        },
        vcisoTag: "containment"
      },
      {
        seq: 5,
        time: "T+2h",
        phase: "Business",
        severity: "High",
        impact: ["Operational", "Customer-Facing"],
        cues: {
          severity: "■ HIGH",
          impact: ["● Operational", "● Customer-Facing"],
          phase: "📣 Business"
        },
        narrative:
          "Some users start reporting that their sessions were terminated and that they had to re-login with stronger prompts. " +
          "Business managers ask whether customer-facing portals and internal systems will be affected by further IdP changes.",
        decision: {
          question: "How do you balance stability with security hardening?",
          options: {
            A: "Explain the risk clearly and continue hardening even if it causes short-term friction.",
            B: "Pause any new controls to avoid disrupting customer workflows.",
            C: "Roll back the recent hardening steps entirely and revisit next quarter."
          }
        },
        vcisoTag: "business"
      },
      {
        seq: 6,
        time: "T+4h",
        phase: "Containment",
        severity: "High",
        impact: ["Data Exposure"],
        cues: {
          severity: "■ HIGH",
          impact: ["● Data Exposure"],
          phase: "🛑 Containment"
        },
        narrative:
          "Your team discovers that certain IdP logs show access to user directories and group membership exports using " +
          "an admin account at odd hours, likely enough to map your internal structure and relationships.",
        decision: {
          question: "How should you treat the directory information that was accessed?",
          options: {
            A: "Treat it as compromised and plan for potential phishing and impersonation campaigns.",
            B: "Assume it has low value and move on to other concerns.",
            C: "Ask the vendor if such access is normal and wait for their view."
          }
        },
        vcisoTag: "intel"
      },
      {
        seq: 7,
        time: "T+8h",
        phase: "Cross-Functional",
        severity: "High",
        impact: ["Operational", "Regulatory"],
        cues: {
          severity: "■ HIGH",
          impact: ["● Operational", "● Regulatory"],
          phase: "🗂 Cross-Functional"
        },
        narrative:
          "Risk and legal teams ask whether this event triggers any formal incident classification or external reporting. " +
          "They need clarity on whether customer, partner, or staff accounts have been abused, and what evidence you have.",
        decision: {
          question: "How do you classify and communicate the incident internally?",
          options: {
            A: "Classify it as a major security incident and brief senior leadership on timelines and likely impact.",
            B: "Treat it as a minor event and keep discussion within the security team.",
            C: "Wait for the vendor’s final report before assigning any internal severity."
          }
        },
        vcisoTag: "business"
      },
      {
        seq: 8,
        time: "T+1d",
        phase: "Containment",
        severity: "Medium",
        impact: ["Operational"],
        cues: {
          severity: "■ MEDIUM",
          impact: ["● Operational"],
          phase: "🛑 Containment"
        },
        narrative:
          "The IdP vendor recommends revoking all support-related tokens and rotating administrator secrets. " +
          "They provide a checklist, but it implies short planned outages for several applications.",
        decision: {
          question: "How do you execute this recommendation?",
          options: {
            A: "Coordinate a staged rotation with clear downtime windows and strong communication.",
            B: "Apply some of the changes quietly during production hours to avoid formal downtime announcements.",
            C: "Defer changes to the next quarterly maintenance cycle."
          }
        },
        vcisoTag: "containment"
      },
      {
        seq: 9,
        time: "T+2d",
        phase: "Recovery",
        severity: "Medium",
        impact: ["Operational"],
        cues: {
          severity: "■ MEDIUM",
          impact: ["● Operational"],
          phase: "🔧 Recovery"
        },
        narrative:
          "Core systems have stabilised after token rotations and policy changes. However, some automation scripts and " +
          "integrations have stopped working due to tightened authentication flows.",
        decision: {
          question: "What is the right approach for broken automations?",
          options: {
            A: "Update automations to meet the new policies rather than weakening the controls.",
            B: "Relax security settings temporarily to restore all integrations quickly.",
            C: "Disable automations indefinitely and handle tasks manually."
          }
        },
        vcisoTag: "recovery"
      },
      {
        seq: 10,
        time: "T+1w",
        phase: "Recovery",
        severity: "Medium",
        impact: ["Regulatory", "Customer-Facing"],
        cues: {
          severity: "■ MEDIUM",
          impact: ["● Regulatory", "● Customer-Facing"],
          phase: "🔧 Recovery"
        },
        narrative:
          "The vendor releases its final post-incident report. It confirms that some support artefacts containing " +
          "customer-specific data were accessed, but cannot conclusively state whether your exact tenant data was used " +
          "for active attacks.",
        decision: {
          question: "How do you incorporate this report into your own posture?",
          options: {
            A: "Use it to revise your IdP governance, including limited debug data sharing and strong admin hygiene.",
            B: "File it away and assume the event is resolved.",
            C: "Rely entirely on the vendor’s assurances and make no internal changes."
          }
        },
        vcisoTag: "recovery"
      },
      {
        seq: 11,
        time: "T+2w",
        phase: "Business",
        severity: "Low",
        impact: ["Operational"],
        cues: {
          severity: "■ LOW",
          impact: ["● Operational"],
          phase: "📣 Business"
        },
        narrative:
          "Some business units express frustration at the stronger login flows and more frequent token expiry. " +
          "They question whether the risk justified the disruption and ask if controls can be relaxed.",
        decision: {
          question: "How should you respond to this feedback?",
          options: {
            A: "Explain the rationale clearly and keep the improved controls in place.",
            B: "Roll back some controls to regain convenience.",
            C: "Defer the discussion and hope the complaints fade."
          }
        },
        vcisoTag: "business"
      },
      {
        seq: 12,
        time: "T+1m",
        phase: "Cross-Functional",
        severity: "Low",
        impact: ["Operational", "Regulatory"],
        cues: {
          severity: "■ LOW",
          impact: ["● Operational", "● Regulatory"],
          phase: "🗂 Cross-Functional"
        },
        narrative:
          "Leadership asks for a concise summary of what changed because of this incident and how similar risks will be handled " +
          "in future vendor interactions.",
        decision: {
          question: "What should your long-term message emphasise?",
          options: {
            A: "Clear accountability for identity governance, reduced sharing of sensitive support artefacts, and improved monitoring.",
            B: "That such events are rare and unlikely to recur.",
            C: "That most responsibility lies with external providers, not internal teams."
          }
        },
        vcisoTag: "recovery"
      }
    ]
  },

  // 3) Hospitality & Gaming: Social Engineering → Ransomware (6 injects for now)
  sc03_casino_ransom_social_engineering: {
    id: "sc03_casino_ransom_social_engineering",
    title: "Hospitality & Gaming: Social Engineering to Ransomware",
    description:
      "An attacker uses social engineering against service desk staff and IT operators to gain access to core hospitality and gaming systems. " +
      "Within days, multiple systems become unstable and a large-scale ransomware incident unfolds, impacting guest experience and revenue.",
    injects: [
      {
        seq: 1,
        time: "T+00m",
        phase: "Intel",
        severity: "Medium",
        impact: ["Operational"],
        cues: {
          severity: "■ MEDIUM",
          impact: ["● Operational"],
          phase: "🔍 Intel"
        },
        narrative:
          "The service desk reports a call from someone claiming to be a senior IT engineer, requesting an urgent password reset " +
          "for a privileged account used to manage hotel systems. The caller knows internal jargon and references recent changes " +
          "to sound credible.",
        decision: {
          question: "How should the service desk respond?",
          options: {
            A: "Escalate the request for verification and refuse to reset until identity is confirmed.",
            B: "Reset the password immediately to be helpful and avoid delays.",
            C: "Reset the password but email the user afterwards to inform them."
          }
        },
        vcisoTag: "intel"
      },
      {
        seq: 2,
        time: "T+1d",
        phase: "Detection",
        severity: "High",
        impact: ["Operational"],
        cues: {
          severity: "■ HIGH",
          impact: ["● Operational"],
          phase: "🧭 Detection"
        },
        narrative:
          "Over the next 24 hours, several backend hospitality systems show unusual logons from remote locations at odd times. " +
          "Admin sessions appear to perform configuration changes on property management and point-of-sale systems.",
        decision: {
          question: "How should these unusual admin activities be handled?",
          options: {
            A: "Treat them as potential compromise, open an incident, and start deeper investigation.",
            B: "Assume they are late-night maintenance tasks and ignore them.",
            C: "Send a generic email to IT asking if anyone recognises this activity and wait."
          }
        },
        vcisoTag: "detection"
      },
      {
        seq: 3,
        time: "T+2d",
        phase: "Detection",
        severity: "Critical",
        impact: ["Operational", "Customer-Facing"],
        cues: {
          severity: "■ CRITICAL",
          impact: ["● Operational", "● Customer-Facing"],
          phase: "🧭 Detection"
        },
        narrative:
          "Guest check-in kiosks and digital room key systems start failing intermittently. Check-in lines are growing at " +
          "multiple properties. Staff report slow or unresponsive property management systems and unexplained reboots.",
        decision: {
          question: "What is the appropriate next step?",
          options: {
            A: "Declare an incident, convene an incident bridge, and include operations leadership.",
            B: "Ask local IT at each property to reboot systems and monitor.",
            C: "Assume this is a vendor outage and wait for updates."
          }
        },
        vcisoTag: "detection"
      },
      {
        seq: 4,
        time: "T+2d+4h",
        phase: "Containment",
        severity: "Critical",
        impact: ["Operational", "Data Exposure"],
        cues: {
          severity: "■ CRITICAL",
          impact: ["● Operational", "● Data Exposure"],
          phase: "🛑 Containment"
        },
        narrative:
          "Ransom notes start appearing on key servers supporting property management and loyalty systems. Some shared drives " +
          "are already encrypted. There are signs of credential harvesting and lateral movement across the network.",
        decision: {
          question: "How do you approach containment?",
          options: {
            A: "Segment and disconnect affected networks quickly, accepting temporary guest and revenue impact.",
            B: "Try to contain only obviously affected servers to keep most guest services running.",
            C: "Avoid drastic containment steps until the ransom note details are reviewed fully."
          }
        },
        vcisoTag: "containment"
      },
      {
        seq: 5,
        time: "T+2d+6h",
        phase: "Business",
        severity: "Critical",
        impact: ["Customer-Facing", "Financial"],
        cues: {
          severity: "■ CRITICAL",
          impact: ["● Customer-Facing", "● Financial"],
          phase: "📣 Business"
        },
        narrative:
          "Guests complain on social media about long check-in times, room key failures, and payment issues at outlets. " +
          "Media enquiries start to appear. Leadership wants to know what message to give guests, partners, and staff.",
        decision: {
          question: "What is the best communications approach?",
          options: {
            A: "Acknowledge there is a systems issue, outline immediate mitigations, and avoid technical jargon.",
            B: "Describe it as a minor glitch and avoid any mention of a cyber incident.",
            C: "Provide no communication until all facts are confirmed."
          }
        },
        vcisoTag: "business"
      },
      {
        seq: 6,
        time: "T+3d",
        phase: "Recovery",
        severity: "High",
        impact: ["Operational", "Data Exposure"],
        cues: {
          severity: "■ HIGH",
          impact: ["● Operational", "● Data Exposure"],
          phase: "🔧 Recovery"
        },
        narrative:
          "You begin restoring systems from backups and rebuilding critical hospitality platforms. There is uncertainty about " +
          "how much guest and loyalty data may have been accessed before encryption.",
        decision: {
          question: "What should recovery planning emphasise?",
          options: {
            A: "Careful restoration from clean backups, evidence preservation, and staged return of services.",
            B: "Fast restoration of all systems from any available backup to reduce guest complaints.",
            C: "Minimal restoration to keep costs low, relying on manual processes long-term."
          }
        },
        vcisoTag: "recovery"
      }
    ]
  },

  // 4) E-Commerce Platform Outage via Vendor Ransomware (6 injects for now)
  sc04_ecommerce_vendor_ransomware: {
    id: "sc04_ecommerce_vendor_ransomware",
    title: "E-Commerce Platform Outage via Vendor Ransomware",
    description:
      "Your online store relies heavily on a third-party e-commerce and payment platform. " +
      "A ransomware attack on that provider leads to partial outages, payment errors, and growing concern about customer data exposure.",
    injects: [
      {
        seq: 1,
        time: "T+00m",
        phase: "Intel",
        severity: "Medium",
        impact: ["Operational"],
        cues: {
          severity: "■ MEDIUM",
          impact: ["● Operational"],
          phase: "🔍 Intel"
        },
        narrative:
          "Monitoring dashboards show a spike in HTTP errors from your e-commerce provider’s API. " +
          "Some checkout requests are failing, but the site is still mostly usable.",
        decision: {
          question: "How should you react initially?",
          options: {
            A: "Open an incident bridge, notify the vendor, and start tracking customer impact.",
            B: "Assume it is a transient issue and monitor quietly.",
            C: "Disable online ordering completely until you understand more."
          }
        },
        vcisoTag: "intel"
      },
      {
        seq: 2,
        time: "T+1h",
        phase: "Detection",
        severity: "High",
        impact: ["Operational", "Customer-Facing"],
        cues: {
          severity: "■ HIGH",
          impact: ["● Operational", "● Customer-Facing"],
          phase: "🧭 Detection"
        },
        narrative:
          "Customer services report multiple complaints about failed payments and duplicate charges. " +
          "Social media posts start to appear, suggesting that the site is ‘broken’ and orders are unreliable.",
        decision: {
          question: "What is your next step?",
          options: {
            A: "Declare an incident affecting customers and coordinate closely with the vendor.",
            B: "Wait for the vendor’s status page to show a clear outage before doing anything.",
            C: "Redirect customers to a generic ‘maintenance’ page and suspend all payments."
          }
        },
        vcisoTag: "detection"
      },
      {
        seq: 3,
        time: "T+2h",
        phase: "Intel",
        severity: "High",
        impact: ["Operational", "Data Exposure"],
        cues: {
          severity: "■ HIGH",
          impact: ["● Operational", "● Data Exposure"],
          phase: "🔍 Intel"
        },
        narrative:
          "The vendor issues a brief statement: they are dealing with a ‘security incident’ and have taken some systems offline. " +
          "Rumours online suggest ransomware and potential data theft affecting multiple retailer clients.",
        decision: {
          question: "How do you interpret and plan around this announcement?",
          options: {
            A: "Treat it as a serious security incident with possible customer data exposure and plan communications.",
            B: "Assume it is just a minor internal security event and avoid escalating internally.",
            C: "Wait for a more detailed technical description before forming any plan."
          }
        },
        vcisoTag: "intel"
      },
      {
        seq: 4,
        time: "T+4h",
        phase: "Business",
        severity: "Critical",
        impact: ["Customer-Facing", "Financial"],
        cues: {
          severity: "■ CRITICAL",
          impact: ["● Customer-Facing", "● Financial"],
          phase: "📣 Business"
        },
        narrative:
          "Daily revenue is dropping as customers abandon carts. Finance is concerned about reconciliation of failed and " +
          "duplicate payments, while marketing is worried about long-term brand damage.",
        decision: {
          question: "What is the appropriate business response?",
          options: {
            A: "Communicate proactively with customers about the disruption and offer guidance or compensation where needed.",
            B: "Say nothing publicly and hope the issue disappears quickly.",
            C: "Blame the vendor explicitly in public statements."
          }
        },
        vcisoTag: "business"
      },
      {
        seq: 5,
        time: "T+1d",
        phase: "Containment",
        severity: "High",
        impact: ["Operational", "Data Exposure"],
        cues: {
          severity: "■ HIGH",
          impact: ["● Operational", "● Data Exposure"],
          phase: "🛑 Containment"
        },
        narrative:
          "Further information suggests that some card and personal data processed through the vendor may have been accessed. " +
          "It is not clear whether your specific tenants or data sets are affected.",
        decision: {
          question: "What is your containment and risk response?",
          options: {
            A: "Coordinate closely with the vendor, review what data you send, and plan for worst-case exposure.",
            B: "Wait for explicit confirmation with your company name before doing any further work.",
            C: "Immediately disconnect from the vendor and attempt to integrate a new provider overnight."
          }
        },
        vcisoTag: "containment"
      },
      {
        seq: 6,
        time: "T+3d",
        phase: "Recovery",
        severity: "Medium",
        impact: ["Financial", "Customer-Facing"],
        cues: {
          severity: "■ MEDIUM",
          impact: ["● Financial", "● Customer-Facing"],
          phase: "🔧 Recovery"
        },
        narrative:
          "The vendor restores most services, but confidence has been shaken. Internally, there is discussion about multi-vendor " +
          "strategies, reduced data sharing, and clearer contingency plans.",
        decision: {
          question: "What should your long-term recovery focus on?",
          options: {
            A: "Diversifying providers, reducing sensitive data exposure, and improving business continuity planning.",
            B: "Negotiating a small discount with the vendor and continuing as before.",
            C: "Avoiding major changes due to perceived complexity and cost."
          }
        },
        vcisoTag: "recovery"
      }
    ]
  },

  // 5) Cloud Storage Misconfiguration & Mass Exposure (6 injects for now)
  sc05_cloud_storage_misconfig: {
    id: "sc05_cloud_storage_misconfig",
    title: "Cloud Storage Misconfiguration & Mass Exposure",
    description:
      "Misconfigured cloud object storage leads to large volumes of files being publicly accessible. " +
      "A security researcher discloses the issue, and questions arise about whether data was accessed and how it remained exposed for so long.",
    injects: [
      {
        seq: 1,
        time: "T+00m",
        phase: "Intel",
        severity: "High",
        impact: ["Data Exposure"],
        cues: {
          severity: "■ HIGH",
          impact: ["● Data Exposure"],
          phase: "🔍 Intel"
        },
        narrative:
          "A security researcher contacts your organisation to say they discovered a cloud storage bucket with directory listing " +
          "enabled and no authentication. The bucket name clearly references your company.",
        decision: {
          question: "What should be your first step?",
          options: {
            A: "Verify the claim quickly, restrict access, and preserve evidence.",
            B: "Ignore the email in case it is a scam.",
            C: "Forward the email around internally without taking action."
          }
        },
        vcisoTag: "intel"
      },
      {
        seq: 2,
        time: "T+30m",
        phase: "Detection",
        severity: "High",
        impact: ["Data Exposure"],
        cues: {
          severity: "■ HIGH",
          impact: ["● Data Exposure"],
          phase: "🧭 Detection"
        },
        narrative:
          "Engineering confirms that several buckets were left open due to a misconfigured template. Some contain log files, " +
          "test data, and a mix of real customer-related content.",
        decision: {
          question: "How do you handle the immediate configuration issue?",
          options: {
            A: "Lock down all misconfigured buckets and take snapshots for review.",
            B: "Only lock down the bucket named by the researcher and leave the rest as-is.",
            C: "Delay changes to avoid breaking any integrations."
          }
        },
        vcisoTag: "detection"
      },
      {
        seq: 3,
        time: "T+2h",
        phase: "Business",
        severity: "High",
        impact: ["Data Exposure", "Regulatory"],
        cues: {
          severity: "■ HIGH",
          impact: ["● Data Exposure", "● Regulatory"],
          phase: "📣 Business"
        },
        narrative:
          "Closer inspection reveals that some of the exposed files contained identifiable customer data and internal reports. " +
          "You cannot be certain whether they were accessed or indexed by third parties before you locked them down.",
        decision: {
          question: "How should you treat the risk to exposed data?",
          options: {
            A: "Treat the data as potentially accessed and assess notification obligations.",
            B: "Assume no access occurred because you have not seen clear evidence.",
            C: "Wait to see if anyone else reports the issue publicly."
          }
        },
        vcisoTag: "business"
      },
      {
        seq: 4,
        time: "T+1d",
        phase: "Cross-Functional",
        severity: "Medium",
        impact: ["Reputation", "Customer-Facing"],
        cues: {
          severity: "■ MEDIUM",
          impact: ["● Customer-Facing"],
          phase: "🗂 Cross-Functional"
        },
        narrative:
          "The researcher asks if you intend to make a public statement and whether you will recognise their contribution. " +
          "Internal stakeholders are split on whether public messaging is necessary.",
        decision: {
          question: "How do you handle communication around this disclosure?",
          options: {
            A: "Acknowledge the issue, thank the researcher, and give a clear, measured statement.",
            B: "Avoid any public mention and ask the researcher not to publish.",
            C: "Provide only vague assurances without admitting any exposure."
          }
        },
        vcisoTag: "business"
      },
      {
        seq: 5,
        time: "T+3d",
        phase: "Recovery",
        severity: "Medium",
        impact: ["Operational", "Data Exposure"],
        cues: {
          severity: "■ MEDIUM",
          impact: ["● Operational", "● Data Exposure"],
          phase: "🔧 Recovery"
        },
        narrative:
          "Further review finds similar misconfigurations in other environments, traceable to an infrastructure template " +
          "used widely across projects. Teams are concerned about the effort required to fix everything.",
        decision: {
          question: "What should the recovery plan prioritise?",
          options: {
            A: "Systematic remediation of configurations across environments and better guardrails.",
            B: "Only fix the buckets that clearly contain sensitive data.",
            C: "Defer large-scale remediation due to resource constraints."
          }
        },
        vcisoTag: "recovery"
      },
      {
        seq: 6,
        time: "T+2w",
        phase: "Cross-Functional",
        severity: "Low",
        impact: ["Operational", "Regulatory"],
        cues: {
          severity: "■ LOW",
          impact: ["● Operational", "● Regulatory"],
          phase: "🗂 Cross-Functional"
        },
        narrative:
          "Leadership asks for a summary of how this happened and what is being changed to prevent similar exposures. " +
          "They want a concise view of root causes and control improvements.",
        decision: {
          question: "How should you frame those lessons?",
          options: {
            A: "Highlight weaknesses in templates and reviews, and commit to stronger cloud governance.",
            B: "Downplay the event as a minor configuration slip.",
            C: "Focus mainly on how quickly the misconfiguration was closed rather than deeper causes."
          }
        },
        vcisoTag: "recovery"
      }
    ]
  }
};
