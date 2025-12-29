import { Card } from '../types/game';

export const videoCards: Card[] = [
  // === MUKBANG VIDEOS ===
  {
    id: 'mukbang-standard',
    type: 'video',
    title: 'Mukbang Monday',
    description: 'The audience expects food content. Time to deliver.',
    choices: [
      {
        id: 'full-spread',
        text: 'Go all out. Orange chicken, chili, the works.',
        effects: [
          { type: 'immediate', statChanges: { health: -12, youtubeAlgorithm: 10, sanity: 5 } }
        ]
      },
      {
        id: 'modest-attempt',
        text: 'Try to keep it reasonable. Salad with extra ranch.',
        effects: [
          { type: 'immediate', statChanges: { health: -5, youtubeAlgorithm: 3, credibility: -8 } }
        ]
      }
    ],
    repeatable: true,
    tags: ['food', 'regular-content']
  },

  {
    id: 'mukbang-binge',
    type: 'video',
    title: 'Late Night Binge Stream',
    description: 'It\'s 2am. The chat is egging you on. The fridge is full.',
    choices: [
      {
        id: 'keep-going',
        text: 'The chat wants more. Give them more.',
        effects: [
          { type: 'immediate', statChanges: { health: -18, youtubeAlgorithm: 15, sanity: -8, money: 5 } }
        ]
      },
      {
        id: 'end-stream',
        text: 'End the stream. You\'ve done enough.',
        effects: [
          { type: 'immediate', statChanges: { health: -8, motivation: -10, reactionChannelFollowing: -5 } }
        ]
      }
    ],
    repeatable: true,
    tags: ['food', 'livestream', 'late-night']
  },

  // === REACTION CONTENT ===
  {
    id: 'flame-reactor',
    type: 'video',
    title: 'Flame a Reaction Channel',
    description: 'They\'ve been talking shit. Time to respond.',
    choices: [
      {
        id: 'go-nuclear',
        text: 'Full meltdown. Names, screenshots, everything.',
        effects: [
          { type: 'immediate', statChanges: { sanity: -15, reactionChannelFollowing: 12, youtubeAlgorithm: 8, karma: -10 } }
        ]
      },
      {
        id: 'subtle-shade',
        text: 'Vague shade. Let them figure it out.',
        effects: [
          { type: 'immediate', statChanges: { sanity: -5, reactionChannelFollowing: 5, manipulation: 3 } }
        ]
      },
      {
        id: 'take-high-road',
        text: '"I don\'t even watch those channels."',
        effects: [
          { type: 'immediate', statChanges: { sanity: -3, credibility: -5, evasiveness: 5 } }
        ]
      }
    ],
    repeatable: true,
    tags: ['drama', 'reaction-channels']
  },

  // === WEIGH-IN ===
  {
    id: 'weigh-in',
    type: 'video',
    title: 'Weigh-In Wednesday',
    description: 'The scale awaits. The audience is watching.',
    choices: [
      {
        id: 'honest-weigh',
        text: 'Step on. Show the number. No excuses.',
        effects: [
          {
            type: 'conditional',
            condition: { stat: 'health', operator: 'lte', value: 40 },
            thenEffects: [
              { type: 'immediate', statChanges: { motivation: -15, youtubeAlgorithm: 12, accountability: 5 } }
            ],
            elseEffects: [
              { type: 'immediate', statChanges: { motivation: 5, youtubeAlgorithm: 8, accountability: 5 } }
            ]
          }
        ]
      },
      {
        id: 'excuses',
        text: '"The scale is broken. I\'ll weigh in next week."',
        effects: [
          { type: 'immediate', statChanges: { youtubeAlgorithm: 5, credibility: -10, evasiveness: 5, obliviousness: 3 } }
        ]
      }
    ],
    repeatable: true,
    tags: ['weight', 'accountability']
  },

  // === HAULS ===
  {
    id: 'grocery-haul',
    type: 'video',
    title: 'Grocery Haul',
    description: 'Show off what you bought. Healthy choices optional.',
    choices: [
      {
        id: 'healthy-haul',
        text: 'Vegetables, lean protein, the whole act.',
        effects: [
          { type: 'immediate', statChanges: { sanity: 8, youtubeAlgorithm: -5, credibility: -3, money: -10 } }
        ]
      },
      {
        id: 'honest-haul',
        text: 'Show the real haul. Frozen pizzas and all.',
        effects: [
          { type: 'immediate', statChanges: { sanity: 3, youtubeAlgorithm: 5, accountability: 3, money: -15 } }
        ]
      }
    ],
    repeatable: true,
    tags: ['haul', 'food']
  },

  {
    id: 'torrid-haul',
    type: 'video',
    title: 'Torrid Haul',
    description: 'New clothes arrived. Time to try them on camera.',
    choices: [
      {
        id: 'try-on',
        text: 'Full try-on. Every piece.',
        effects: [
          { type: 'immediate', statChanges: { money: -20, youtubeAlgorithm: 8, sanity: 5 } }
        ]
      }
    ],
    repeatable: true,
    tags: ['haul', 'fashion']
  },

  // === DRAMA ===
  {
    id: 'youtuber-drama',
    type: 'video',
    title: 'Address the Drama',
    description: 'Everyone\'s talking. You need to say something.',
    choices: [
      {
        id: 'full-response',
        text: 'Hour-long response video. Every receipt.',
        effects: [
          { type: 'immediate', statChanges: { sanity: -20, youtubeAlgorithm: 18, reactionChannelFollowing: 15, defensiveness: 8 } }
        ]
      },
      {
        id: 'brief-statement',
        text: 'Quick statement. "I\'m not engaging with this."',
        effects: [
          { type: 'immediate', statChanges: { sanity: -5, youtubeAlgorithm: 5, evasiveness: 5 } }
        ]
      },
      {
        id: 'ignore-it',
        text: 'Post like nothing happened.',
        effects: [
          { type: 'immediate', statChanges: { sanity: -8, obliviousness: 8, reactionChannelFollowing: 8 } }
        ]
      }
    ],
    repeatable: true,
    tags: ['drama']
  },

  // === LIVESTREAMS ===
  {
    id: 'livestream-ramble',
    type: 'video',
    title: 'Late Night Livestream',
    description: 'Just you and the chat. No script. No filter.',
    choices: [
      {
        id: 'overshare',
        text: 'Let it all out. Tell them everything.',
        effects: [
          { type: 'immediate', statChanges: { sanity: -12, money: 15, relationships: -10, reactionChannelFollowing: 10 } }
        ]
      },
      {
        id: 'keep-surface',
        text: 'Keep it light. Just vibes.',
        effects: [
          { type: 'immediate', statChanges: { sanity: -3, money: 5, youtubeAlgorithm: -3 } }
        ]
      }
    ],
    repeatable: true,
    tags: ['livestream']
  },

  // === MISC CONTENT ===
  {
    id: 'store-scooter',
    type: 'video',
    title: 'Store Scooter Joyride',
    description: 'Vlog at the store. The scooter is right there.',
    choices: [
      {
        id: 'ride-it',
        text: 'Hop on. Content is content.',
        effects: [
          { type: 'immediate', statChanges: { youtubeAlgorithm: 10, karma: -8, smug: 5, credibility: -5 } }
        ]
      },
      {
        id: 'walk',
        text: 'Walk like a normal person.',
        effects: [
          { type: 'immediate', statChanges: { health: -5, youtubeAlgorithm: -3, accountability: 3 } }
        ]
      }
    ],
    repeatable: true,
    tags: ['vlog', 'public']
  },

  {
    id: 'fall-video',
    type: 'video',
    title: 'The Fall',
    description: 'You fell on camera. Do you post it?',
    choices: [
      {
        id: 'post-it',
        text: 'Post it. Lean into it.',
        effects: [
          { type: 'immediate', statChanges: { health: -8, youtubeAlgorithm: 15, reactionChannelFollowing: 12, sanity: -10 } }
        ]
      },
      {
        id: 'delete-it',
        text: 'Delete the footage. Pretend it didn\'t happen.',
        effects: [
          { type: 'immediate', statChanges: { health: -5, sanity: -5, evasiveness: 3 } }
        ]
      }
    ],
    repeatable: false,
    tags: ['vlog', 'accident']
  },

  {
    id: 'out-to-eat',
    type: 'video',
    title: 'Restaurant Vlog',
    description: 'Eating out. Camera\'s rolling.',
    choices: [
      {
        id: 'order-big',
        text: 'Order everything. It\'s for content.',
        effects: [
          { type: 'immediate', statChanges: { health: -15, money: -25, youtubeAlgorithm: 10, sanity: 8 } }
        ]
      },
      {
        id: 'order-modest',
        text: 'Order something reasonable.',
        effects: [
          { type: 'immediate', statChanges: { health: -5, money: -10, youtubeAlgorithm: 3 } }
        ]
      }
    ],
    repeatable: true,
    tags: ['food', 'vlog', 'restaurant']
  },

  {
    id: 'lego-build',
    type: 'video',
    title: 'Lego Build Stream',
    description: 'Chill content. Just building Legos on stream.',
    choices: [
      {
        id: 'just-build',
        text: 'Keep it chill. Just build.',
        effects: [
          { type: 'immediate', statChanges: { sanity: 10, youtubeAlgorithm: -5, money: -15 } }
        ]
      }
    ],
    repeatable: true,
    tags: ['chill', 'hobby']
  },

  {
    id: 'pity-party',
    type: 'video',
    title: 'Pity Party',
    description: 'Everything is falling apart. Time to vent on camera.',
    choices: [
      {
        id: 'full-breakdown',
        text: 'Let the tears flow. They need to see this.',
        effects: [
          { type: 'immediate', statChanges: { sanity: -15, youtubeAlgorithm: 12, reactionChannelFollowing: 15, narcissism: 5, manipulation: 8 } }
        ]
      },
      {
        id: 'restrained-vent',
        text: 'Keep some composure. You\'re better than this.',
        effects: [
          { type: 'immediate', statChanges: { sanity: -8, youtubeAlgorithm: 5, motivation: -5 } }
        ]
      }
    ],
    repeatable: true,
    tags: ['emotional', 'drama']
  },

  // === NEW DIET CONTENT ===
  {
    id: 'new-diet',
    type: 'video',
    title: 'Announcing a New Diet',
    description: 'Fresh start. This time it\'s different. (It\'s always different.)',
    choices: [
      {
        id: 'big-promises',
        text: 'Go big. Strict rules. Public accountability.',
        effects: [
          { type: 'immediate', statChanges: { motivation: 15, youtubeAlgorithm: 10, credibility: -10 } },
          { 
            type: 'modifier', 
            modifier: { stat: 'motivation', type: 'rate', value: -3, duration: 3, source: 'diet-pressure' } 
          }
        ]
      },
      {
        id: 'vague-promises',
        text: '"I\'m just going to be more mindful."',
        effects: [
          { type: 'immediate', statChanges: { motivation: 5, youtubeAlgorithm: 3, evasiveness: 3 } }
        ]
      }
    ],
    repeatable: true,
    tags: ['diet', 'promises']
  },

  // === SPONSOR VIDEOS (item rewards) ===
  {
    id: 'sponsor-bang-energy',
    type: 'video',
    title: 'Bang Energy Sponsorship',
    description: 'They want you to drink their product on camera. Easy money.',
    choices: [
      {
        id: 'take-deal',
        text: 'Take the deal. Chug a Bang on stream.',
        effects: [
          { type: 'immediate', statChanges: { money: 20, credibility: -5 }, giveItem: 'energy-drink' }
        ]
      },
      {
        id: 'decline',
        text: 'Decline. You have standards. (Do you?)',
        effects: [
          { type: 'immediate', statChanges: { credibility: 5, motivation: -5 } }
        ]
      }
    ],
    repeatable: false,
    tags: ['sponsor', 'money']
  },

  {
    id: 'cooking-stream',
    type: 'video',
    title: 'Cooking Stream',
    description: 'Show the audience your culinary skills. Or lack thereof.',
    choices: [
      {
        id: 'make-chili',
        text: 'Make a big pot of chili. For "meal prep."',
        effects: [
          { type: 'immediate', statChanges: { sanity: 8, health: -5, youtubeAlgorithm: 5 }, giveItem: 'chili' }
        ]
      },
      {
        id: 'order-takeout',
        text: 'Give up halfway and order takeout on camera.',
        effects: [
          { type: 'immediate', statChanges: { health: -10, money: -15, reactionChannelFollowing: 8 } }
        ]
      }
    ],
    repeatable: true,
    tags: ['food', 'chill']
  },

  {
    id: 'pharmacy-vlog',
    type: 'video',
    title: 'Pharmacy Run Vlog',
    description: 'A thrilling adventure to pick up prescriptions.',
    choices: [
      {
        id: 'pick-up-meds',
        text: 'Actually pick up your medication.',
        effects: [
          { type: 'immediate', statChanges: { money: -10, youtubeAlgorithm: -3 }, giveItem: 'lexapro' }
        ]
      },
      {
        id: 'get-distracted',
        text: 'Get distracted in the snack aisle. Again.',
        effects: [
          { type: 'immediate', statChanges: { health: -8, money: -20, sanity: 5 } }
        ]
      }
    ],
    repeatable: false,
    tags: ['vlog', 'health']
  },
];

// Helper to get a random video card that meets requirements
export function getAvailableVideoCards(
  usedCardIds: string[],
  lockedCardIds: string[]
): Card[] {
  return videoCards.filter(card => {
    // Skip non-repeatable cards that have been used
    if (!card.repeatable && usedCardIds.includes(card.id)) {
      return false;
    }
    // Skip locked cards
    if (lockedCardIds.includes(card.id)) {
      return false;
    }
    return true;
  });
}
