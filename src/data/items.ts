import { AllStats } from '../types/game';

export interface Item {
  id: string;
  name: string;
  description: string;
  // Effect when used
  statChanges: Partial<AllStats>;
  // Optional modifier effect
  modifier?: {
    stat: keyof AllStats;
    type: 'rate' | 'flat';
    value: number;
    duration: number;
    source: string;
  };
  // Flavor text when used
  useText: string;
}

export const items: Item[] = [
  {
    id: 'chili',
    name: 'Homemade Chili',
    description: 'Comfort food. Fills the void temporarily.',
    statChanges: { sanity: 15, health: -10 },
    useText: 'You eat the entire pot. It helps. For now.',
  },
  {
    id: 'orange-chicken',
    name: 'Orange Chicken',
    description: 'The Panda Express special. A reliable classic.',
    statChanges: { sanity: 10, motivation: 10, health: -8 },
    useText: 'Sweet, tangy, reliable. Just like the content.',
  },
  {
    id: 'lexapro',
    name: 'Lexapro',
    description: 'Prescribed. Actually taking it would be novel.',
    statChanges: { sanity: 5 },
    modifier: {
      stat: 'sanity',
      type: 'rate',
      value: 2,
      duration: 5,
      source: 'lexapro',
    },
    useText: 'You actually take your medication. Wild concept.',
  },
  {
    id: 'energy-drink',
    name: 'Bang Energy',
    description: 'Sponsored at some point. Still have a case.',
    statChanges: { motivation: 20, health: -5, sanity: -5 },
    useText: 'The caffeine hits immediately. Sleep is for quitters.',
  },
  {
    id: 'weed-edible',
    name: 'Edible',
    description: 'For "anxiety." Definitely not on camera.',
    statChanges: { sanity: 20, motivation: -15, obliviousness: 5 },
    useText: 'Everything feels... fine? Nothing matters.',
  },
  {
    id: 'cash-stash',
    name: 'Emergency Cash',
    description: 'Hidden in the closet. For emergencies.',
    statChanges: { money: 30 },
    useText: 'You dip into the emergency fund. This counts as an emergency, right?',
  },
  {
    id: 'pr-consultant',
    name: 'PR Consultant Call',
    description: 'One free session from that sponsorship deal.',
    statChanges: { credibility: 15, evasiveness: 5 },
    useText: '"Let\'s reframe the narrative." Sure, whatever that means.',
  },
  {
    id: 'burner-phone',
    name: 'Burner Phone',
    description: 'For when you need to disappear for a bit.',
    statChanges: { sanity: 15, youtubeAlgorithm: -10, reactionChannelFollowing: -10 },
    useText: 'You go dark. The main phone stays off. Blessed silence.',
  },
];

// Max items a player can hold
export const MAX_ITEMS = 3;

// Get a random item (for rewards, events, etc.)
export function getRandomItem(excludeIds: string[] = []): Item | null {
  const available = items.filter(item => !excludeIds.includes(item.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}
