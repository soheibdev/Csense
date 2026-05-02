export const quizzes = {
  "what-is-csense": [
    {
      id: 1,
      question: "What is the main purpose of CSense?",
      options: [
        "To monitor employee activity",
        "To replace the IT department",
        "To build cybersecurity awareness and safe habits among employees",
        "To manage company passwords"
      ],
      correctAnswer: 2,
      explanation: {
        0: "CSense is a learning platform, not a surveillance tool.",
        1: "CSense complements IT and security teams.",
        3: "Password management is a separate responsibility."
      }
    },
    {
      id: 2,
      question: "According to the video, where do most security threats begin?",
      options: [
        "Advanced hacking tools",
        "Outdated software",
        "A single uninformed employee",
        "Weak company firewalls"
      ],
      correctAnswer: 2,
      explanation: {
        0: "Most breaches don't start with tools.",
        1: "Software risk exists but not the main point.",
        3: "Firewalls can be bypassed via humans."
      }
    },
    {
      id: 3,
      question: "What do you earn when you complete a topic in CSense?",
      options: [
        "A salary bonus",
        "A badge",
        "Admin access",
        "A certificate"
      ],
      correctAnswer: 1,
      explanation: {
        0: "No financial rewards.",
        2: "No system privileges.",
        3: "No certificates."
      }
    },
    {
      id: 4,
      question: "Which best describes what CSense expects from you?",
      options: [
        "Become cybersecurity expert",
        "Report colleagues",
        "Develop awareness and habits",
        "Install security software"
      ],
      correctAnswer: 2,
      explanation: {
        0: "Not a certification program.",
        1: "Not about monitoring others.",
        3: "IT handles installations."
      }
    },
    {
      id: 5,
      question: "What does 'something feels off' refer to?",
      options: [
        "Paranoia",
        "Security awareness",
        "IT troubleshooting",
        "Compliance reporting"
      ],
      correctAnswer: 1,
      explanation: {
        0: "It's not paranoia.",
        2: "Not about fixing systems.",
        3: "Different concept."
      }
    }
  ],

  "social-engineering": [
    {
      id: 1,
      question: "What is social engineering?",
      options: [
        "Building secure systems",
        "Manipulating people",
        "Engineering platforms",
        "Training employees"
      ],
      correctAnswer: 1,
      explanation: {
        0: "That's software engineering.",
        2: "Not about platforms.",
        3: "Not training."
      }
    },
    {
      id: 2,
      question: "What is phishing?",
      options: [
        "Firewall attack",
        "Fraudulent message",
        "Email encryption",
        "Network testing"
      ],
      correctAnswer: 1,
      explanation: {
        0: "Targets people not systems.",
        2: "Opposite of encryption.",
        3: "Not a diagnostic tool."
      }
    },
    {
      id: 3,
      question: "You receive a suspicious email. What do you do?",
      options: [
        "Click immediately",
        "Forward it",
        "Check & report",
        "Reply"
      ],
      correctAnswer: 2,
      explanation: {
        0: "Urgency is manipulation.",
        1: "Spreads threat.",
        3: "Confirms your email."
      }
    },
    {
      id: 4,
      question: "What is smishing?",
      options: [
        "SMS phishing",
        "Mobile malware",
        "Wi-Fi hacking",
        "Spam email"
      ],
      correctAnswer: 0,
      explanation: {
        1: "Not malware.",
        2: "Not network attack.",
        3: "Not email."
      }
    },
    {
      id: 5,
      question: "Red flag of social engineering?",
      options: [
        "Formal language",
        "Company name",
        "Urgency",
        "Logo"
      ],
      correctAnswer: 2,
      explanation: {
        0: "Can be fake.",
        1: "Can be spoofed.",
        3: "Easily copied."
      }
    }
  ],

  "password-security": [
    {
      id: 1,
      question: "Strongest password?",
      options: [
        "password123",
        "JohnSmith1990",
        "Tr!8vK#2mQpL",
        "qwerty"
      ],
      correctAnswer: 2,
      explanation: {
        0: "Very weak.",
        1: "Predictable.",
        3: "Common pattern."
      }
    },
    {
      id: 2,
      question: "Why not reuse passwords?",
      options: [
        "Hard to remember",
        "All accounts at risk",
        "Manager limitation",
        "Legal reason"
      ],
      correctAnswer: 1,
      explanation: {
        0: "Not main issue.",
        2: "Not true.",
        3: "Security reason."
      }
    },
    {
      id: 3,
      question: "What does 2FA add?",
      options: [
        "Longer password",
        "Second verification",
        "Auto reset",
        "Encryption"
      ],
      correctAnswer: 1,
      explanation: {
        0: "Different feature.",
        2: "Not related.",
        3: "Handled elsewhere."
      }
    },
    {
      id: 4,
      question: "Sharing password?",
      options: [
        "Share privately",
        "Write it",
        "Never share",
        "Change later"
      ],
      correctAnswer: 2,
      explanation: {
        0: "Still unsafe.",
        1: "Very risky.",
        3: "Still wrong."
      }
    },
    {
      id: 5,
      question: "Minimum password length?",
      options: [
        "6",
        "8",
        "12",
        "20"
      ],
      correctAnswer: 2,
      explanation: {
        0: "Too weak.",
        1: "Not enough.",
        3: "Above minimum."
      }
    }
  ],

  "final-quiz": [
    {
      id: 1,
      question: "What is the primary goal of CSense?",
      options: [
        "Employee monitoring",
        "Cybersecurity awareness training",
        "Network administration",
        "Software development"
      ],
      correctAnswer: 1,
      explanation: {
        0: "CSense doesn't monitor — it educates.",
        2: "Network admin is IT's role.",
        3: "CSense is a training platform."
      }
    },
    {
      id: 2,
      question: "Which attack relies on human manipulation?",
      options: [
        "DDoS attack",
        "SQL injection",
        "Social engineering",
        "Buffer overflow"
      ],
      correctAnswer: 2,
      explanation: {
        0: "DDoS is technical, not human-based.",
        1: "SQL injection targets databases.",
        3: "Buffer overflow is a code exploit."
      }
    },
    {
      id: 3,
      question: "What makes a password strong?",
      options: [
        "Using your birthday",
        "Short and simple",
        "Mix of characters, long and random",
        "Using common words"
      ],
      correctAnswer: 2,
      explanation: {
        0: "Birthdays are predictable.",
        1: "Short passwords are weak.",
        3: "Common words are in dictionaries."
      }
    },
    {
      id: 4,
      question: "What should you do with a suspicious email?",
      options: [
        "Open attachments to verify",
        "Reply to ask who they are",
        "Report it to IT security",
        "Forward to colleagues"
      ],
      correctAnswer: 2,
      explanation: {
        0: "Attachments may contain malware.",
        1: "Replying confirms your email exists.",
        3: "Forwarding spreads the threat."
      }
    },
    {
      id: 5,
      question: "What is phishing?",
      options: [
        "A network scanning technique",
        "A fraudulent attempt to steal information",
        "A type of firewall",
        "An encryption method"
      ],
      correctAnswer: 1,
      explanation: {
        0: "Scanning is a technical tool.",
        2: "Firewalls protect, phishing attacks.",
        3: "Encryption protects data."
      }
    },
    {
      id: 6,
      question: "Why is 2FA important?",
      options: [
        "It replaces passwords",
        "It adds a second layer of security",
        "It makes login faster",
        "It encrypts your data"
      ],
      correctAnswer: 1,
      explanation: {
        0: "2FA supplements passwords.",
        2: "2FA may add a step.",
        3: "Encryption is separate."
      }
    },
    {
      id: 7,
      question: "What is smishing?",
      options: [
        "Social media hacking",
        "Phishing via SMS",
        "Email spoofing",
        "Wi-Fi jamming"
      ],
      correctAnswer: 1,
      explanation: {
        0: "Different attack vector.",
        2: "Email spoofing is different.",
        3: "Wi-Fi jamming is a DoS attack."
      }
    },
    {
      id: 8,
      question: "What does 'pretexting' mean?",
      options: [
        "Pre-written phishing emails",
        "Creating a fabricated scenario to steal info",
        "Testing security before launch",
        "Encrypting text messages"
      ],
      correctAnswer: 1,
      explanation: {
        0: "Pretexting is a live manipulation tactic.",
        2: "That's penetration testing.",
        3: "That's encryption."
      }
    },
    {
      id: 9,
      question: "Should you reuse passwords across accounts?",
      options: [
        "Yes, for convenience",
        "Only for personal accounts",
        "Never — each account needs a unique password",
        "Only if they're strong"
      ],
      correctAnswer: 2,
      explanation: {
        0: "Convenience is not worth the risk.",
        1: "Personal accounts are targets too.",
        3: "Even strong passwords shouldn't be reused."
      }
    },
    {
      id: 10,
      question: "What is tailgating?",
      options: [
        "Following someone into a secure area",
        "Tracking online activity",
        "A type of malware",
        "Sending multiple phishing emails"
      ],
      correctAnswer: 0,
      explanation: {
        1: "Tracking is surveillance.",
        2: "Tailgating is physical, not software.",
        3: "That would be spear phishing."
      }
    },
    {
      id: 11,
      question: "What is the safest way to store passwords?",
      options: [
        "On a sticky note",
        "In a text file on your desktop",
        "In a password manager",
        "In your browser only"
      ],
      correctAnswer: 2,
      explanation: {
        0: "Physical notes can be seen by anyone.",
        1: "Text files are easily accessible.",
        3: "Browser-only is less secure than a manager."
      }
    },
    {
      id: 12,
      question: "What's a red flag in a suspicious URL?",
      options: [
        "HTTPS prefix",
        "Misspelled domain name",
        "Company logo present",
        ".com domain extension"
      ],
      correctAnswer: 1,
      explanation: {
        0: "HTTPS is generally good.",
        2: "Logos can be faked.",
        3: ".com is a legitimate extension."
      }
    },
    {
      id: 13,
      question: "What is the best response to a data breach?",
      options: [
        "Ignore it",
        "Delete your account immediately",
        "Change passwords and enable 2FA",
        "Wait for the company to fix it"
      ],
      correctAnswer: 2,
      explanation: {
        0: "Ignoring leaves you vulnerable.",
        1: "Deleting may not be necessary.",
        3: "You should take proactive steps."
      }
    },
    {
      id: 14,
      question: "Which is NOT a social engineering technique?",
      options: [
        "Baiting",
        "Pretexting",
        "Encryption",
        "Phishing"
      ],
      correctAnswer: 2,
      explanation: {
        0: "Baiting is a social engineering method.",
        1: "Pretexting is a social engineering method.",
        3: "Phishing is a social engineering method."
      }
    },
    {
      id: 15,
      question: "What should every employee understand about cybersecurity?",
      options: [
        "It's only IT's responsibility",
        "Everyone plays a role in security",
        "Threats only come from outside",
        "Antivirus is all you need"
      ],
      correctAnswer: 1,
      explanation: {
        0: "Security is everyone's responsibility.",
        2: "Inside threats exist too.",
        3: "Antivirus is just one layer."
      }
    }
  ]
};