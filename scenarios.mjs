// scenarios.mjs
// Static scenario pack — Wave 1 (5 scenarios, 4 injects each)

export const scenarios = {
  sc01_mft_zero_day: {
    id: 'sc01_mft_zero_day',
    title: 'Managed File Transfer Zero-Day & Data Risk',
    description: 'A widely used managed file transfer platform your organisation depends on is hit with an actively exploited zero-day. You start seeing signs that your own instance may be in scope.',
    injects: [
      {
        seq: 1,
        time: 'T+00m',
        phase: '🔍 Intel',
        cues: {
          severity: '■ HIGH',
          impact: ['● Data Exposure'],
          phase: 'Threat advisory'
        },
        narrative: 'A trusted advisory reports active exploitation of a zero-day in the MFT product you use. The advisory mentions web shells and bulk data access. Business is still transmitting payroll and partner files as usual.',
        decision: {
          question: 'What is your first concrete move?',
          options: {
            A: 'Escalate as a potential major incident, start scoping assets and owners.',
            B: 'Forward the advisory to infra team and wait for feedback.',
            C: 'Acknowledge but take no action until vendor confirms your version is affected.'
          }
        }
      },
      {
        seq: 2,
        time: 'T+20m',
        phase: '🧭 Detection',
        cues: {
          severity: '■ HIGH',
          impact: ['● Data Exposure', '● Operational'],
          phase: 'Log anomalies'
        },
        narrative: 'Web logs show repeated suspicious requests against the upload endpoint, matching some of the public PoC patterns for this zero-day.',
        decision: {
          question: 'How do you interpret this activity?',
          options: {
            A: 'Treat it as active exploitation attempts and assume compromise is possible.',
            B: 'Note it as “interesting” but keep operations unchanged.',
            C: 'Ignore it; many internet probes look similar.'
          }
        }
      },
      {
        seq: 3,
        time: 'T+40m',
        phase: '🛑 Containment',
        cues: {
          severity: '■ CRITICAL',
          impact: ['● Data Exposure', '● Operational'],
          phase: 'Containment'
        },
        narrative: 'You find unusual outbound connections and large transfers from the MFT gateway during a window when no scheduled jobs should be running. Business owners want to keep the system online for payment cut-offs.',
        decision: {
          question: 'How do you balance containment and business pressure?',
          options: {
            A: 'Isolate the MFT gateway externally and move to manual fallbacks with clear timeline.',
            B: 'Allow limited external access while you keep investigating quietly.',
            C: 'Keep it fully online to avoid disruption until you have firm forensic proof.'
          }
        }
      },
      {
        seq: 4,
        time: 'T+1d',
        phase: '📣 Business',
        cues: {
          severity: '■ HIGH',
          impact: ['● Data Exposure', '● Regulatory'],
          phase: 'Notification'
        },
        narrative: 'Initial analysis suggests that archives containing personal and financial data could have been accessed. You do not yet have firm proof of exfiltration, but the pattern of access is worrying.',
        decision: {
          question: 'How do you approach notification and communication?',
          options: {
            A: 'Plan notifications on the basis of likely exposure, adjusting details as evidence firms up.',
            B: 'Wait for conclusive proof before preparing any notification drafts.',
            C: 'Rely on the vendor’s messaging and stay in the background.'
          }
        }
      }
    ]
  },

  sc02_idp_support_breach: {
    id: 'sc02_idp_support_breach',
    title: 'Identity Provider Support Breach & Token Misuse',
    description: 'Your identity provider reports that its support environment was accessed. Some customers may have had admin tokens or debug artefacts exposed. Shortly afterwards, you see odd admin activity.',
    injects: [
      {
        seq: 1,
        time: 'T+00m',
        phase: '🔍 Intel',
        cues: {
          severity: '■ HIGH',
          impact: ['● Operational'],
          phase: 'Vendor advisory'
        },
        narrative: 'Your IdP sends an advisory: a subset of their support environment was accessed. Tickets and debug captures may have contained admin session data.',
        decision: {
          question: 'How should you treat this advisory?',
          options: {
            A: 'Assume reasonable risk to your tenant and start reviewing admin logs.',
            B: 'File it for reference and wait for a follow-up naming affected tenants.',
            C: 'Treat it as low priority since MFA is enabled.'
          }
        }
      },
      {
        seq: 2,
        time: 'T+30m',
        phase: '🧭 Detection',
        cues: {
          severity: '■ HIGH',
          impact: ['● Operational'],
          phase: 'Admin anomaly'
        },
        narrative: 'An admin session appears from an unusual region and device fingerprint. The user denies logging in from there.',
        decision: {
          question: 'What is your immediate response?',
          options: {
            A: 'Revoke sessions, lock the account, and expand the investigation.',
            B: 'Check with the admin again later before taking action.',
            C: 'Assume VPN routing, leave it as is.'
          }
        }
      },
      {
        seq: 3,
        time: 'T+1h',
        phase: '🛑 Containment',
        cues: {
          severity: '■ CRITICAL',
          impact: ['● Operational', '● Data Exposure'],
          phase: 'Containment'
        },
        narrative: 'New privileged roles and tokens have been created for a service account that rarely changes. Several critical apps now have broader access than before.',
        decision: {
          question: 'How do you contain this change?',
          options: {
            A: 'Revoke suspicious tokens, roll back roles, and enforce re-auth for admins.',
            B: 'Keep roles in place to avoid disruption, monitor quietly.',
            C: 'Delete a few tokens only and hope that is enough.'
          }
        }
      },
      {
        seq: 4,
        time: 'T+1d',
        phase: '📣 Business',
        cues: {
          severity: '■ HIGH',
          impact: ['● Operational', '● Regulatory'],
          phase: 'Internal briefing'
        },
        narrative: 'Business and risk teams ask if this event should be treated as a major incident and whether any external reporting is on the table.',
        decision: {
          question: 'How do you position this event internally?',
          options: {
            A: 'Classify as a major incident linked to identity compromise and brief leadership.',
            B: 'Treat as an internal tech issue and keep it within the IT team.',
            C: 'Wait for the vendor’s final write-up before assigning severity.'
          }
        }
      }
    ]
  },

  sc03_hospitality_ransomware: {
    id: 'sc03_hospitality_ransomware',
    title: 'Hospitality Operations Disruption & Ransomware',
    description: 'A mix of social engineering and weak access controls leads to disruption across room, payment and loyalty systems, ending in ransomware across several environments.',
    injects: [
      {
        seq: 1,
        time: 'T+00m',
        phase: '🔍 Intel',
        cues: {
          severity: '■ MEDIUM',
          impact: ['● Operational'],
          phase: 'Service desk'
        },
        narrative: 'Service desk receives a call from someone claiming to be from the infrastructure team, asking for a password reset on a shared admin ID used by property systems.',
        decision: {
          question: 'What should the service desk do?',
          options: {
            A: 'Follow strict verification and refuse until identity is confirmed.',
            B: 'Reset quickly to be helpful and keep systems running.',
            C: 'Reset and email the shared mailbox afterwards.'
          }
        }
      },
      {
        seq: 2,
        time: 'T+1d',
        phase: '🧭 Detection',
        cues: {
          severity: '■ HIGH',
          impact: ['● Operational'],
          phase: 'System anomalies'
        },
        narrative: 'Room key and check-in systems show intermittent failures at multiple sites. Staff are falling back to manual processes and queues are building.',
        decision: {
          question: 'How should technology teams respond?',
          options: {
            A: 'Declare an incident involving operations teams and central IT immediately.',
            B: 'Ask each site to reboot servers and observe.',
            C: 'Treat it as likely vendor instability and wait for an update.'
          }
        }
      },
      {
        seq: 3,
        time: 'T+1d+4h',
        phase: '🛑 Containment',
        cues: {
          severity: '■ CRITICAL',
          impact: ['● Operational', '● Data Exposure'],
          phase: 'Ransomware'
        },
        narrative: 'Ransom notes appear on key hospitality and loyalty servers. Some file shares are encrypted. There are traces of credential dumping and lateral movement.',
        decision: {
          question: 'What containment approach makes the most sense?',
          options: {
            A: 'Segment and disconnect affected networks quickly, accepting short-term guest impact.',
            B: 'Contain only obviously affected servers for now.',
            C: 'Delay major moves until the ransom note is fully analysed.'
          }
        }
      },
      {
        seq: 4,
        time: 'T+2d',
        phase: '📣 Business',
        cues: {
          severity: '■ CRITICAL',
          impact: ['● Customer-Facing', '● Financial'],
          phase: 'Guest impact'
        },
        narrative: 'Guests are posting about long queues and payment issues. Media enquiries start coming in.',
        decision: {
          question: 'What is your communications posture?',
          options: {
            A: 'Acknowledge a systems incident, focus on guest impact and current mitigation steps.',
            B: 'Describe it as a minor glitch without mentioning cyber.',
            C: 'Avoid any comment until everything is fixed.'
          }
        }
      }
    ]
  },

  sc04_ecommerce_vendor_outage: {
    id: 'sc04_ecommerce_vendor_outage',
    title: 'E-Commerce Disruption via Vendor Outage',
    description: 'An external e-commerce/payment provider suffers a security incident. Your online store experiences errors, failed payments and growing customer concern.',
    injects: [
      {
        seq: 1,
        time: 'T+00m',
        phase: '🔍 Intel',
        cues: {
          severity: '■ MEDIUM',
          impact: ['● Operational'],
          phase: 'API errors'
        },
        narrative: 'Monitoring shows spikes in checkout API errors to your payment provider. Some customers report failed payments.',
        decision: {
          question: 'What is your first move?',
          options: {
            A: 'Open an incident bridge, inform key teams and engage the provider.',
            B: 'Monitor quietly and wait for the status page to change.',
            C: 'Disable online payments immediately with no explanation.'
          }
        }
      },
      {
        seq: 2,
        time: 'T+2h',
        phase: '🧭 Detection',
        cues: {
          severity: '■ HIGH',
          impact: ['● Operational', '● Customer-Facing'],
          phase: 'Customer complaints'
        },
        narrative: 'Customer service is seeing a spike in complaints about duplicate charges and failed orders.',
        decision: {
          question: 'How do you frame the situation internally?',
          options: {
            A: 'Treat it as a significant incident affecting revenue and customer trust.',
            B: 'Classify it as a minor tech issue only.',
            C: 'Wait for the provider to declare a security incident first.'
          }
        }
      },
      {
        seq: 3,
        time: 'T+1d',
        phase: '📣 Business',
        cues: {
          severity: '■ HIGH',
          impact: ['● Customer-Facing', '● Financial'],
          phase: 'Public messaging'
        },
        narrative: 'The provider admits they are handling a security incident that may affect multiple merchants. Rumours online mention ransomware and possible data exposure.',
        decision: {
          question: 'How do you communicate with your customers?',
          options: {
            A: 'Provide a clear update that payments are affected and that you are working with the provider.',
            B: 'Say as little as possible and point to generic “technical issues”.',
            C: 'Publicly blame the provider by name in your statements.'
          }
        }
      },
      {
        seq: 4,
        time: 'T+3d',
        phase: '🔧 Recovery',
        cues: {
          severity: '■ MEDIUM',
          impact: ['● Operational', '● Financial'],
          phase: 'Resilience'
        },
        narrative: 'Services stabilise, but internal teams are asking whether a single-provider model is still acceptable.',
        decision: {
          question: 'What long-term direction makes sense?',
          options: {
            A: 'Plan for multi-provider options and reduced sensitive data dependency.',
            B: 'Continue with the same setup, assuming this was a rare event.',
            C: 'Avoid any major change due to complexity.'
          }
        }
      }
    ]
  },

  sc05_cloud_misconfig_exposure: {
    id: 'sc05_cloud_misconfig_exposure',
    title: 'Cloud Storage Misconfiguration & Data Exposure Risk',
    description: 'Misconfigured object storage leaves data exposed on the internet. A researcher reports the issue and wants to know your next steps.',
    injects: [
      {
        seq: 1,
        time: 'T+00m',
        phase: '🔍 Intel',
        cues: {
          severity: '■ HIGH',
          impact: ['● Data Exposure'],
          phase: 'Researcher report'
        },
        narrative: 'A security researcher emails your generic contact to say they found a storage bucket clearly linked to your brand, open to the internet with directory listing enabled.',
        decision: {
          question: 'How do you respond?',
          options: {
            A: 'Quickly validate, restrict access, and acknowledge the report.',
            B: 'Ignore the email in case it is a scam.',
            C: 'Forward it around internally without taking action.'
          }
        }
      },
      {
        seq: 2,
        time: 'T+2h',
        phase: '🧭 Detection',
        cues: {
          severity: '■ HIGH',
          impact: ['● Data Exposure'],
          phase: 'Scope'
        },
        narrative: 'Engineering confirms multiple buckets with similar misconfigurations. Some contain logs, internal documents and limited customer-related data.',
        decision: {
          question: 'What is your immediate technical approach?',
          options: {
            A: 'Lock down all affected buckets, take snapshots, and start a structured review.',
            B: 'Only close the bucket mentioned by the researcher.',
            C: 'Delay changes to avoid breaking integrations.'
          }
        }
      },
      {
        seq: 3,
        time: '📣 Business',
        phase: '📣 Business',
        cues: {
          severity: '■ MEDIUM',
          impact: ['● Customer-Facing', '● Regulatory'],
          phase: 'Messaging'
        },
        narrative: 'Internal stakeholders debate whether a public statement or coordinated acknowledgement is needed, and how to recognise the researcher.',
        decision: {
          question: 'How do you handle messaging?',
          options: {
            A: 'Give a measured acknowledgement, thank the researcher, and explain remedial steps.',
            B: 'Discourage any publication and keep the matter quiet.',
            C: 'Issue only a vague internal note without concrete details.'
          }
        }
      },
      {
        seq: 4,
        time: 'T+1w',
        phase: '🔧 Recovery',
        cues: {
          severity: '■ MEDIUM',
          impact: ['● Operational', '● Data Exposure'],
          phase: 'Hardening'
        },
        narrative: 'Further checks show similar patterns in other projects. Teams are concerned about the effort required to clean everything.',
        decision: {
          question: 'What should recovery focus on?',
          options: {
            A: 'Systematic configuration hardening and better guardrails for future deployments.',
            B: 'Only fix obviously sensitive buckets.',
            C: 'Defer a broader programme due to resource constraints.'
          }
        }
      }
    ]
  }
};
