import { Card, AllStats, HistoryEntry } from '../types/game';

// Events are cards that trigger based on game state, not player choice
// The player still makes a choice within the event, but they don't choose WHICH event happens

export interface EventTrigger {
  // Stat-based triggers
  statConditions?: Array<{
    stat: keyof AllStats;
    operator: 'gte' | 'lte' | 'eq';
    value: number;
  }>;
  // History-based triggers (e.g., "played 3 mukbang videos this game")
  historyConditions?: Array<{
    cardTag?: string;
    cardId?: string;
    minCount: number;
  }>;
  // Minimum turn to trigger
  minTurn?: number;
  // Random chance (0-1) after other conditions are met
  chance?: number;
}

export interface EventCard extends Card {
  trigger: EventTrigger;
  // Priority for when multiple events could trigger (higher = more likely to be chosen)
  priority: number;
}

export const eventCards: EventCard[] = [
  // === HEALTH EVENTS ===
  {
    id: 'health-scare-choke',
    type: 'lifeEvent',
    title: 'Health Scare',
    description: 'You choked on a potato during a livestream. Chat is freaking out.',
    trigger: {
      statConditions: [{ stat: 'health', operator: 'lte', value: 35 }],
      historyConditions: [{ cardTag: 'food', minCount: 5 }],
      chance: 0.4,
    },
    priority: 80,
    choices: [
      {
        id: 'hospital',
        text: 'Go to the hospital. Take it seriously.',
        effects: [
          { type: 'immediate', statChanges: { health: 15, money: -30, youtubeAlgorithm: -10, sanity: 5 } }
        ]
      },
      {
        id: 'brush-off',
        text: '"I\'m fine, chat. Stop being dramatic."',
        effects: [
          { type: 'immediate', statChanges: { health: -5, obliviousness: 10, reactionChannelFollowing: 15 } }
        ]
      }
    ],
    repeatable: false,
    tags: ['health', 'serious']
  },

  {
    id: 'weight-loss-surgery-offer',
    type: 'lifeEvent',
    title: 'Weight Loss Surgery Consultation',
    description: 'A clinic reached out. They want to sponsor your surgery.',
    trigger: {
      statConditions: [{ stat: 'health', operator: 'lte', value: 40 }],
      minTurn: 5,
      chance: 0.3,
    },
    priority: 70,
    choices: [
      {
        id: 'accept',
        text: 'Accept. This could change everything.',
        effects: [
          { type: 'immediate', statChanges: { health: 20, motivation: 15, youtubeAlgorithm: 20 } },
          { 
            type: 'modifier', 
            modifier: { stat: 'health', type: 'rate', value: 2, duration: 10, source: 'surgery-recovery' } 
          }
        ]
      },
      {
        id: 'decline',
        text: '"I can do this on my own."',
        effects: [
          { type: 'immediate', statChanges: { motivation: -10, entitlement: 5 } }
        ]
      }
    ],
    repeatable: false,
    tags: ['health', 'major-decision']
  },

  {
    id: 'semaglutide-opportunity',
    type: 'lifeEvent',
    title: 'The Ozempic DM',
    description: 'Someone\'s offering to hook you up with semaglutide. No prescription needed.',
    trigger: {
      statConditions: [
        { stat: 'health', operator: 'lte', value: 50 },
        { stat: 'money', operator: 'gte', value: 30 },
      ],
      minTurn: 3,
      chance: 0.35,
    },
    priority: 60,
    choices: [
      {
        id: 'take-it',
        text: 'Worth a shot. Pay the money.',
        effects: [
          { type: 'immediate', statChanges: { money: -25, karma: -5 } },
          { 
            type: 'modifier', 
            modifier: { stat: 'health', type: 'rate', value: 3, duration: 8, source: 'semaglutide' } 
          }
        ]
      },
      {
        id: 'pass',
        text: 'Too sketchy. Pass.',
        effects: [
          { type: 'immediate', statChanges: { accountability: 5 } }
        ]
      }
    ],
    repeatable: false,
    tags: ['health', 'sketchy']
  },

  // === RELATIONSHIP EVENTS ===
  {
    id: 'partner-confrontation',
    type: 'lifeEvent',
    title: 'Partner Confrontation',
    description: 'Your partner is fed up. "It\'s me or the channel."',
    trigger: {
      statConditions: [
        { stat: 'relationships', operator: 'lte', value: 30 },
        { stat: 'sanity', operator: 'lte', value: 50 },
      ],
      chance: 0.5,
    },
    priority: 85,
    choices: [
      {
        id: 'choose-partner',
        text: 'Promise to do better. Mean it this time.',
        effects: [
          { type: 'immediate', statChanges: { relationships: 15, youtubeAlgorithm: -15, sanity: 10 } },
          { 
            type: 'modifier', 
            modifier: { stat: 'youtubeAlgorithm', type: 'rate', value: -2, duration: 3, source: 'less-content' } 
          }
        ]
      },
      {
        id: 'choose-channel',
        text: '"You knew what you signed up for."',
        effects: [
          { type: 'immediate', statChanges: { relationships: -25, motivation: -10, narcissism: 10, youtubeAlgorithm: 5 } }
        ]
      }
    ],
    repeatable: false,
    tags: ['relationship', 'serious']
  },

  {
    id: 'keep-dms-open',
    type: 'lifeEvent',
    title: 'The DMs Are Open',
    description: 'Someone new is sliding into your DMs. Seems interested.',
    trigger: {
      statConditions: [{ stat: 'relationships', operator: 'lte', value: 40 }],
      minTurn: 4,
      chance: 0.4,
    },
    priority: 50,
    choices: [
      {
        id: 'engage',
        text: 'Flirt back. What\'s the harm?',
        effects: [
          { type: 'immediate', statChanges: { relationships: -15, sanity: 5, karma: -10, motivation: 10 } }
        ]
      },
      {
        id: 'ignore',
        text: 'Leave them on read.',
        effects: [
          { type: 'immediate', statChanges: { accountability: 5 } }
        ]
      }
    ],
    repeatable: true,
    tags: ['relationship', 'temptation']
  },

  // === FAMILY EVENTS ===
  {
    id: 'family-tragedy',
    type: 'lifeEvent',
    title: 'Family Emergency',
    description: 'Bad news from home. Someone\'s in the hospital.',
    trigger: {
      minTurn: 3,
      chance: 0.15,
    },
    priority: 90,
    choices: [
      {
        id: 'go-offline',
        text: 'Go dark. Be with family.',
        effects: [
          { type: 'immediate', statChanges: { youtubeAlgorithm: -20, relationships: 15, sanity: -10, karma: 10 } }
        ]
      },
      {
        id: 'stream-through',
        text: 'Address it on stream. The community is family too.',
        effects: [
          { type: 'immediate', statChanges: { youtubeAlgorithm: 10, relationships: -20, reactionChannelFollowing: 15, karma: -15 } }
        ]
      }
    ],
    repeatable: false,
    tags: ['family', 'serious']
  },

  {
    id: 'mom-intervention',
    type: 'lifeEvent',
    title: 'Mom\'s Worried',
    description: 'Your mom saw the latest video. She\'s calling.',
    trigger: {
      statConditions: [{ stat: 'health', operator: 'lte', value: 45 }],
      chance: 0.3,
    },
    priority: 55,
    choices: [
      {
        id: 'listen',
        text: 'Actually listen to her concerns.',
        effects: [
          { type: 'immediate', statChanges: { sanity: 10, relationships: 10, motivation: -5 } }
        ]
      },
      {
        id: 'deflect',
        text: '"Mom, I\'m fine. You don\'t understand the industry."',
        effects: [
          { type: 'immediate', statChanges: { relationships: -10, defensiveness: 8, obliviousness: 5 } }
        ]
      }
    ],
    repeatable: true,
    tags: ['family']
  },

  // === BUSINESS/MONEY EVENTS ===
  {
    id: 'start-store',
    type: 'lifeEvent',
    title: 'Business Opportunity',
    description: 'Someone wants you to launch merch. Big upfront cost though.',
    trigger: {
      statConditions: [
        { stat: 'money', operator: 'gte', value: 40 },
        { stat: 'youtubeAlgorithm', operator: 'gte', value: 40 },
      ],
      minTurn: 4,
      chance: 0.25,
    },
    priority: 45,
    choices: [
      {
        id: 'invest',
        text: 'Go for it. Invest in yourself.',
        effects: [
          { type: 'immediate', statChanges: { money: -35, motivation: 10, entitlement: 5 } },
          { 
            type: 'modifier', 
            modifier: { stat: 'money', type: 'rate', value: 5, duration: 'permanent', source: 'merch-store' } 
          }
        ]
      },
      {
        id: 'pass',
        text: 'Too risky right now.',
        effects: [
          { type: 'immediate', statChanges: { motivation: -5 } }
        ]
      }
    ],
    repeatable: false,
    tags: ['business', 'money']
  },

  {
    id: 'cameo-offer',
    type: 'lifeEvent',
    title: 'Cameo Opportunity',
    description: 'Someone wants to pay $500 for a birthday message. It\'s... a lot of them.',
    trigger: {
      statConditions: [{ stat: 'reactionChannelFollowing', operator: 'gte', value: 50 }],
      chance: 0.4,
    },
    priority: 40,
    choices: [
      {
        id: 'do-them-all',
        text: 'Easy money. Crank them out.',
        effects: [
          { type: 'immediate', statChanges: { money: 25, sanity: -10, credibility: -10 } }
        ]
      },
      {
        id: 'be-selective',
        text: 'Only take a few. Keep some dignity.',
        effects: [
          { type: 'immediate', statChanges: { money: 10, sanity: -3 } }
        ]
      }
    ],
    repeatable: true,
    tags: ['money', 'reputation']
  },

  // === DRAMA EVENTS ===
  {
    id: 'physical-altercation',
    type: 'lifeEvent',
    title: 'Physical Altercation',
    description: 'Things got heated at a meetup. Someone\'s got it on video.',
    trigger: {
      statConditions: [
        { stat: 'sanity', operator: 'lte', value: 35 },
        { stat: 'defensiveness', operator: 'gte', value: 50 },
      ],
      chance: 0.3,
    },
    priority: 85,
    choices: [
      {
        id: 'apologize',
        text: 'Get ahead of it. Apologize publicly.',
        effects: [
          { type: 'immediate', statChanges: { karma: 5, credibility: -15, accountability: 10 } }
        ]
      },
      {
        id: 'deny',
        text: '"That video is taken out of context."',
        effects: [
          { type: 'immediate', statChanges: { credibility: -25, evasiveness: 10, reactionChannelFollowing: 20, karma: -15 } }
        ]
      }
    ],
    repeatable: false,
    tags: ['drama', 'serious', 'legal']
  },

  {
    id: 'fbi-visit',
    type: 'lifeEvent',
    title: 'Unexpected Visitors',
    description: 'There\'s a knock at the door. It\'s not a fan.',
    trigger: {
      statConditions: [
        { stat: 'karma', operator: 'lte', value: 20 },
      ],
      historyConditions: [{ cardTag: 'sketchy', minCount: 2 }],
      minTurn: 8,
      chance: 0.2,
    },
    priority: 95,
    choices: [
      {
        id: 'cooperate',
        text: 'Cooperate fully. Nothing to hide.',
        effects: [
          { type: 'immediate', statChanges: { sanity: -25, youtubeAlgorithm: -30, karma: 15 } }
        ]
      },
      {
        id: 'lawyer-up',
        text: 'Say nothing. Call a lawyer.',
        effects: [
          { type: 'immediate', statChanges: { money: -40, sanity: -15 } }
        ]
      }
    ],
    repeatable: false,
    tags: ['legal', 'serious']
  },

  // === QUITTING YOUTUBE ===
  {
    id: 'quitting-youtube',
    type: 'lifeEvent',
    title: 'The Thought Crosses Your Mind',
    description: 'What if you just... stopped? Walked away from all of it?',
    trigger: {
      statConditions: [
        { stat: 'motivation', operator: 'lte', value: 25 },
        { stat: 'sanity', operator: 'lte', value: 30 },
      ],
      chance: 0.5,
    },
    priority: 75,
    choices: [
      {
        id: 'announce-break',
        text: 'Announce a break. You need this.',
        effects: [
          { type: 'immediate', statChanges: { sanity: 20, motivation: 15, youtubeAlgorithm: -25, money: -20 } }
        ]
      },
      {
        id: 'keep-grinding',
        text: 'No. This is who you are now.',
        effects: [
          { type: 'immediate', statChanges: { sanity: -10, motivation: -5, narcissism: 5 } }
        ]
      }
    ],
    repeatable: true,
    tags: ['existential', 'serious']
  },

  // === ITEM EVENTS ===
  {
    id: 'fan-gift',
    type: 'lifeEvent',
    title: 'A Gift From a Fan',
    description: 'Someone sent you a care package. It\'s... a lot of food.',
    trigger: {
      statConditions: [{ stat: 'youtubeAlgorithm', operator: 'gte', value: 40 }],
      minTurn: 2,
      chance: 0.3,
    },
    priority: 30,
    choices: [
      {
        id: 'accept-graciously',
        text: 'Accept graciously. Post a thank you.',
        effects: [
          { type: 'immediate', statChanges: { relationships: 5, karma: 5 }, giveItem: 'orange-chicken' }
        ]
      },
      {
        id: 'suspicious',
        text: 'Be suspicious. Could be poisoned. (It\'s not.)',
        effects: [
          { type: 'immediate', statChanges: { sanity: -5, defensiveness: 5 } }
        ]
      }
    ],
    repeatable: true,
    tags: ['fans', 'gift']
  },

  {
    id: 'shady-dm-items',
    type: 'lifeEvent',
    title: 'A Shady DM',
    description: 'Someone\'s offering "supplements" that "totally work." No prescription needed.',
    trigger: {
      statConditions: [{ stat: 'health', operator: 'lte', value: 45 }],
      minTurn: 3,
      chance: 0.25,
    },
    priority: 35,
    choices: [
      {
        id: 'buy-edibles',
        text: 'Just the edibles. For "anxiety."',
        effects: [
          { type: 'immediate', statChanges: { money: -15, karma: -5 }, giveItem: 'weed-edible' }
        ]
      },
      {
        id: 'ignore',
        text: 'Ignore. This seems sketchy.',
        effects: [
          { type: 'immediate', statChanges: { accountability: 3 } }
        ]
      }
    ],
    repeatable: false,
    tags: ['sketchy', 'health']
  },

  {
    id: 'pr-crisis-prep',
    type: 'lifeEvent',
    title: 'PR Crisis Incoming',
    description: 'Your manager warns you: something bad is about to drop. You have 24 hours.',
    trigger: {
      statConditions: [
        { stat: 'karma', operator: 'lte', value: 35 },
        { stat: 'reactionChannelFollowing', operator: 'gte', value: 50 },
      ],
      minTurn: 4,
      chance: 0.35,
    },
    priority: 65,
    choices: [
      {
        id: 'hire-pr',
        text: 'Hire a crisis PR consultant. Now.',
        effects: [
          { type: 'immediate', statChanges: { money: -25 }, giveItem: 'pr-consultant' }
        ]
      },
      {
        id: 'wing-it',
        text: 'Wing it. You\'ve survived worse.',
        effects: [
          { type: 'immediate', statChanges: { sanity: -10, defensiveness: 5 } }
        ]
      }
    ],
    repeatable: false,
    tags: ['drama', 'pr']
  },
];

// Check if an event should trigger
export function checkEventTrigger(
  event: EventCard,
  stats: AllStats,
  history: HistoryEntry[],
  turn: number,
  usedCardIds: string[]
): boolean {
  const { trigger } = event;

  // Check if already used (for non-repeatable)
  if (!event.repeatable && usedCardIds.includes(event.id)) {
    return false;
  }

  // Check minimum turn
  if (trigger.minTurn && turn < trigger.minTurn) {
    return false;
  }

  // Check stat conditions
  if (trigger.statConditions) {
    for (const condition of trigger.statConditions) {
      const statValue = stats[condition.stat];
      let passes = false;
      switch (condition.operator) {
        case 'gte': passes = statValue >= condition.value; break;
        case 'lte': passes = statValue <= condition.value; break;
        case 'eq': passes = statValue === condition.value; break;
      }
      if (!passes) return false;
    }
  }

  // Check history conditions
  if (trigger.historyConditions) {
    for (const condition of trigger.historyConditions) {
      let count = 0;
      // This is simplified - in a real implementation you'd need to track card tags in history
      // For now, just count card IDs
      if (condition.cardId) {
        count = history.filter(h => h.cardId === condition.cardId).length;
      }
      // TODO: Add tag-based counting when we track that in history
      if (count < condition.minCount) return false;
    }
  }

  // Check random chance
  if (trigger.chance !== undefined) {
    if (Math.random() > trigger.chance) {
      return false;
    }
  }

  return true;
}

// Get the event that should trigger this turn (if any)
export function getTriggeredEvent(
  stats: AllStats,
  history: HistoryEntry[],
  turn: number,
  usedCardIds: string[]
): EventCard | null {
  const eligibleEvents = eventCards
    .filter(event => checkEventTrigger(event, stats, history, turn, usedCardIds))
    .sort((a, b) => b.priority - a.priority);

  // Return highest priority event, or null if none qualify
  return eligibleEvents.length > 0 ? eligibleEvents[0] : null;
}
