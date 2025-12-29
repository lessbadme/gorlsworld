import { Scenario } from '../types/game';

export const scenarios: Scenario[] = [
  {
    id: 'fallen-giant',
    name: 'The Fallen Giant',
    description:
      'You were once at 10 million subscribers. A scandal tanked your channel. Now you\'re fighting to stay relevant with 500k loyal viewers.',
    startingStats: {
      money: 40,
      health: 60,
      sanity: 50,
      motivation: 40,
      youtubeAlgorithm: 25,
      reactionChannelFollowing: 70, // Lots of people react to your downfall
      karma: 30,
      relationships: 35,
      credibility: 25,
      narcissism: 60,
      entitlement: 55,
    },
    startingModifiers: [
      {
        stat: 'youtubeAlgorithm',
        type: 'rate',
        value: -2,
        duration: 'permanent',
        source: 'fallen-giant-scenario',
      },
    ],
  },
  {
    id: 'burnout-creator',
    name: 'The Burnout',
    description:
      'Daily uploads for 5 years straight. The grind is catching up. Your numbers are stable, but you\'re running on fumes.',
    startingStats: {
      money: 65,
      health: 35,
      sanity: 30,
      motivation: 25,
      youtubeAlgorithm: 55,
      reactionChannelFollowing: 40,
      karma: 55,
      relationships: 30,
      credibility: 70,
      obliviousness: 45,
    },
    startingModifiers: [
      {
        stat: 'health',
        type: 'rate',
        value: -3,
        duration: 'permanent',
        source: 'burnout-scenario',
      },
      {
        stat: 'sanity',
        type: 'rate',
        value: -2,
        duration: 'permanent',
        source: 'burnout-scenario',
      },
    ],
  },
  {
    id: 'drama-magnet',
    name: 'The Drama Magnet',
    description:
      'Every week there\'s a new controversy. Your audience loves the chaos, but it\'s exhausting keeping up the act.',
    startingStats: {
      money: 55,
      health: 50,
      sanity: 45,
      motivation: 55,
      youtubeAlgorithm: 65,
      reactionChannelFollowing: 80,
      karma: 20,
      relationships: 25,
      credibility: 35,
      manipulation: 50,
      evasiveness: 55,
      defensiveness: 60,
    },
    startingModifiers: [
      {
        stat: 'karma',
        type: 'rate',
        value: -2,
        duration: 'permanent',
        source: 'drama-scenario',
      },
    ],
  },
  {
    id: 'wholesome-decline',
    name: 'The Fading Wholesome',
    description:
      'You built a family-friendly brand. But the algorithm favors edgier content now. Do you adapt or stay true?',
    startingStats: {
      money: 50,
      health: 70,
      sanity: 65,
      motivation: 50,
      youtubeAlgorithm: 35,
      reactionChannelFollowing: 20,
      karma: 75,
      relationships: 65,
      credibility: 80,
      accountability: 60,
      smug: 15,
    },
    startingModifiers: [
      {
        stat: 'youtubeAlgorithm',
        type: 'rate',
        value: -3,
        duration: 'permanent',
        source: 'wholesome-scenario',
      },
    ],
  },
];
