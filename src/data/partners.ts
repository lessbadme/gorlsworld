import { Partner } from '../types/game';

export const partners: Partner[] = [
  {
    id: 'casey',
    name: 'Casey',
    description:
      'Intense, possessive, always in the comments. She\'ll defend you to the death, but the drama follows her everywhere.',
    statModifiers: [], // GFs no longer have passive modifiers
    specialAbility: 'Attack Dog Mode - Sic Casey on a reactor (4 turn cooldown)',
  },
  {
    id: 'krystle',
    name: 'Krystle',
    description:
      'The enabler. She\'ll bring you food, tell you what you want to hear, and never push back. Comfortable, but dangerous.',
    statModifiers: [],
    specialAbility: 'Comfort Food - Restore sanity at the cost of health (3 turn cooldown)',
  },
  {
    id: 'destiny',
    name: 'Destiny',
    description:
      'Online-only at first. She seems supportive, but she\'s building her own following off your name.',
    statModifiers: [],
    specialAbility: 'Distraction - Skip the next life event (2 charges per game)',
  },
  {
    id: 'beck',
    name: 'Beck',
    description:
      'The "normal" one. Has a real job. Doesn\'t really get the YouTube thing, but tries to be supportive.',
    statModifiers: [],
    specialAbility: 'Reality Check - Remove negative modifiers, gain credibility (resets on drama video)',
  },
  {
    id: 'faleen',
    name: 'Faleen',
    description:
      'Fellow creator. She gets it. Maybe too well. You enable each other\'s worst habits.',
    statModifiers: [],
    specialAbility: 'Emergency Collab - Big algorithm boost, but she takes a cut (3 turn cooldown)',
  },
  {
    id: 'no-one',
    name: 'Nobody',
    description:
      'You\'re doing this alone. No safety net, no drama, no one to blame but yourself.',
    statModifiers: [],
    specialAbility: 'Lone Wolf - Boost motivation and algorithm, but sanity suffers (resets when sanity ≤ 30)',
  },
];
