import { AllStats, StatModifier } from '../types/game';

// Rarity tiers for side characters
export type SideCharacterRarity = 'common' | 'rare' | 'epic' | 'legendary';

// Unlock conditions for side characters to appear in draft
export type UnlockCondition =
  | { type: 'always' }
  | { type: 'turn'; minTurn: number }
  | { type: 'stat'; stat: keyof AllStats; operator: 'gte' | 'lte'; value: number }
  | { type: 'partner'; partnerId: string }
  | { type: 'usedCard'; cardId: string }
  | { type: 'hasSideCharacter'; sideCharacterId: string }
  | { type: 'videoTagCount'; tag: string; minCount: number };

export interface SideCharacter {
  id: string;
  name: string;
  description: string;
  rarity: SideCharacterRarity;
  
  // Conditions for this character to appear in draft pool
  unlockConditions: UnlockCondition[];
  
  // Passive stat modifiers (like old partner system)
  statModifiers: Omit<StatModifier, 'id'>[];
  
  // Cards this character unlocks
  unlocksCards?: string[];
  
  // Cards this character locks (removes from pool)
  locksCards?: string[];
  
  // Events this character unlocks
  unlocksEvents?: string[];
  
  // For display
  emoji: string;
  
  // Flavor text when drafted
  draftText: string;
}

// Rarity weights for draft selection
export const rarityWeights: Record<SideCharacterRarity, number> = {
  common: 50,
  rare: 30,
  epic: 15,
  legendary: 5,
};

// Rarity display colors
export const rarityColors: Record<SideCharacterRarity, string> = {
  common: 'text-gray-300',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-yellow-400',
};

export const rarityBgColors: Record<SideCharacterRarity, string> = {
  common: 'bg-gray-700',
  rare: 'bg-blue-900/50',
  epic: 'bg-purple-900/50',
  legendary: 'bg-yellow-900/50',
};

export const rarityBorderColors: Record<SideCharacterRarity, string> = {
  common: 'border-gray-600',
  rare: 'border-blue-500',
  epic: 'border-purple-500',
  legendary: 'border-yellow-500',
};

// All side characters
export const sideCharacters: SideCharacter[] = [
  // === COMMON ===
  {
    id: 'chihuahua',
    name: 'BBJ the Chihuahua',
    description: 'A yappy little companion. Provides comfort but annoys the chat.',
    rarity: 'common',
    unlockConditions: [{ type: 'always' }],
    statModifiers: [
      { stat: 'sanity', type: 'rate', value: 2, duration: 'permanent', source: 'chihuahua' },
      { stat: 'reactionChannelFollowing', type: 'rate', value: 1, duration: 'permanent', source: 'chihuahua-annoyance' },
    ],
    emoji: '🐕',
    draftText: 'BBJ waddles into your life. He\'s loud, he\'s needy, and chat already hates him.',
  },
  {
    id: 'cat',
    name: 'Sam the Cat',
    description: 'An aloof feline who occasionally graces streams with their presence.',
    rarity: 'common',
    unlockConditions: [{ type: 'always' }],
    statModifiers: [
      { stat: 'youtubeAlgorithm', type: 'rate', value: 2, duration: 'permanent', source: 'cat-content' },
      { stat: 'motivation', type: 'rate', value: -1, duration: 'permanent', source: 'cat-laziness' },
    ],
    emoji: '🐱',
    draftText: 'Sam tolerates your presence. In return, they boost your views. Fair trade.',
  },
  
  // === RARE ===
  {
    id: 'libby',
    name: 'Libby',
    description: 'A friend from before the YouTube days. Keeps it real, sometimes too real.',
    rarity: 'rare',
    unlockConditions: [{ type: 'turn', minTurn: 3 }],
    statModifiers: [
      { stat: 'credibility', type: 'rate', value: 2, duration: 'permanent', source: 'libby-honesty' },
      { stat: 'accountability', type: 'rate', value: 2, duration: 'permanent', source: 'libby-truth' },
      { stat: 'narcissism', type: 'rate', value: -1, duration: 'permanent', source: 'libby-reality' },
    ],
    emoji: '👩',
    draftText: 'Libby\'s back in your life. She doesn\'t care about the channel. That\'s either refreshing or annoying.',
  },
  {
    id: 'eric-ricky',
    name: 'Eric & Ricky',
    description: 'The enabler duo. They\'ll go along with anything for content.',
    rarity: 'rare',
    unlockConditions: [{ type: 'stat', stat: 'karma', operator: 'lte', value: 50 }],
    statModifiers: [
      { stat: 'youtubeAlgorithm', type: 'rate', value: 3, duration: 'permanent', source: 'eric-ricky-content' },
      { stat: 'accountability', type: 'rate', value: -2, duration: 'permanent', source: 'eric-ricky-enabling' },
      { stat: 'health', type: 'rate', value: -1, duration: 'permanent', source: 'eric-ricky-influence' },
    ],
    emoji: '👬',
    draftText: 'Eric and Ricky show up. They\'re down for whatever. That\'s... probably not good.',
  },
  {
    id: 'raif',
    name: 'Raif',
    description: 'A mysterious online friend. Good for motivation, questionable influence.',
    rarity: 'rare',
    unlockConditions: [
      { type: 'stat', stat: 'relationships', operator: 'lte', value: 40 },
    ],
    statModifiers: [
      { stat: 'motivation', type: 'rate', value: 3, duration: 'permanent', source: 'raif-hype' },
      { stat: 'manipulation', type: 'rate', value: 1, duration: 'permanent', source: 'raif-influence' },
      { stat: 'relationships', type: 'rate', value: -1, duration: 'permanent', source: 'raif-isolation' },
    ],
    unlocksEvents: ['shady-dm-items'],
    emoji: '🕵️',
    draftText: 'Raif slides into your DMs. He\'s supportive. Maybe too supportive?',
  },
  
  // === EPIC ===
  {
    id: 'mom',
    name: 'Mom',
    description: 'Your actual mother. She worries. She calls. She means well.',
    rarity: 'epic',
    unlockConditions: [
      { type: 'stat', stat: 'health', operator: 'lte', value: 50 },
    ],
    statModifiers: [
      { stat: 'health', type: 'rate', value: 2, duration: 'permanent', source: 'mom-nagging' },
      { stat: 'sanity', type: 'rate', value: 1, duration: 'permanent', source: 'mom-support' },
      { stat: 'motivation', type: 'rate', value: -2, duration: 'permanent', source: 'mom-guilt' },
    ],
    unlocksEvents: ['mom-intervention'],
    emoji: '👩‍👧',
    draftText: 'Mom saw your last video. She\'s "concerned." Get ready for the calls.',
  },
  {
    id: 'aunt-tammy',
    name: 'Aunt Tammy',
    description: 'The family member who gets it. Or thinks she does. Either way, she\'s invested.',
    rarity: 'epic',
    unlockConditions: [
      { type: 'turn', minTurn: 5 },
      { type: 'stat', stat: 'reactionChannelFollowing', operator: 'gte', value: 40 },
    ],
    statModifiers: [
      { stat: 'money', type: 'rate', value: 3, duration: 'permanent', source: 'aunt-tammy-gifts' },
      { stat: 'reactionChannelFollowing', type: 'rate', value: 2, duration: 'permanent', source: 'aunt-tammy-drama' },
      { stat: 'evasiveness', type: 'rate', value: 1, duration: 'permanent', source: 'aunt-tammy-excuses' },
    ],
    emoji: '👵',
    draftText: 'Aunt Tammy discovered your channel. She\'s your biggest fan. And worst commenter.',
  },
  {
    id: 'nutritionist',
    name: 'The Nutritionist',
    description: 'A professional who\'s trying to help. Your audience isn\'t sure how to feel.',
    rarity: 'epic',
    unlockConditions: [
      { type: 'stat', stat: 'health', operator: 'lte', value: 40 },
      { type: 'stat', stat: 'money', operator: 'gte', value: 30 },
    ],
    statModifiers: [
      { stat: 'health', type: 'rate', value: 3, duration: 'permanent', source: 'nutritionist-guidance' },
      { stat: 'money', type: 'rate', value: -3, duration: 'permanent', source: 'nutritionist-fees' },
      { stat: 'credibility', type: 'rate', value: 2, duration: 'permanent', source: 'nutritionist-legitimacy' },
    ],
    unlocksCards: ['weigh-in'],
    emoji: '🥗',
    draftText: 'You hired a nutritionist. Chat is skeptical. The reactors are thrilled.',
  },
  
  // === LEGENDARY ===
  {
    id: 'fbi-investigator',
    name: 'The FBI Guy',
    description: 'You\'re on a list now. Probably several. Tread carefully.',
    rarity: 'legendary',
    unlockConditions: [
      { type: 'stat', stat: 'karma', operator: 'lte', value: 20 },
      { type: 'turn', minTurn: 8 },
    ],
    statModifiers: [
      { stat: 'karma', type: 'rate', value: 3, duration: 'permanent', source: 'fbi-behavior' },
      { stat: 'evasiveness', type: 'rate', value: -3, duration: 'permanent', source: 'fbi-watching' },
      { stat: 'accountability', type: 'rate', value: 3, duration: 'permanent', source: 'fbi-pressure' },
    ],
    unlocksEvents: ['fbi-visit'],
    locksCards: ['store-scooter'], // Can't do sketchy stuff anymore
    emoji: '🕴️',
    draftText: 'You notice someone watching your streams very carefully. Very, very carefully.',
  },
  {
    id: 'mam',
    name: 'Mam',
    description: 'Grandmother energy. Pure love. Will defend you to the death, even when you\'re wrong.',
    rarity: 'legendary',
    unlockConditions: [
      { type: 'stat', stat: 'sanity', operator: 'lte', value: 30 },
      { type: 'stat', stat: 'relationships', operator: 'gte', value: 40 },
    ],
    statModifiers: [
      { stat: 'sanity', type: 'rate', value: 4, duration: 'permanent', source: 'mam-love' },
      { stat: 'defensiveness', type: 'rate', value: 2, duration: 'permanent', source: 'mam-protection' },
      { stat: 'obliviousness', type: 'rate', value: 1, duration: 'permanent', source: 'mam-denial' },
    ],
    emoji: '👵',
    draftText: 'Mam calls. She doesn\'t understand the internet but she loves you unconditionally.',
  },
];

// Get a side character by ID
export function getSideCharacterById(id: string): SideCharacter | undefined {
  return sideCharacters.find(sc => sc.id === id);
}

// Check if unlock conditions are met
export function checkUnlockConditions(
  conditions: UnlockCondition[],
  context: {
    turn: number;
    stats: AllStats;
    partnerId: string | null;
    usedCardIds: string[];
    currentSideCharacters: string[];
    videoTagCounts: Record<string, number>;
  }
): boolean {
  // All conditions must be met (AND logic)
  return conditions.every(condition => {
    switch (condition.type) {
      case 'always':
        return true;
      case 'turn':
        return context.turn >= condition.minTurn;
      case 'stat':
        const statValue = context.stats[condition.stat];
        if (condition.operator === 'gte') return statValue >= condition.value;
        if (condition.operator === 'lte') return statValue <= condition.value;
        return false;
      case 'partner':
        return context.partnerId === condition.partnerId;
      case 'usedCard':
        return context.usedCardIds.includes(condition.cardId);
      case 'hasSideCharacter':
        return context.currentSideCharacters.includes(condition.sideCharacterId);
      case 'videoTagCount':
        return (context.videoTagCounts[condition.tag] || 0) >= condition.minCount;
    }
  });
}

// Get available side characters for drafting
export function getAvailableSideCharacters(
  context: {
    turn: number;
    stats: AllStats;
    partnerId: string | null;
    usedCardIds: string[];
    currentSideCharacters: string[];
    videoTagCounts: Record<string, number>;
  }
): SideCharacter[] {
  return sideCharacters.filter(sc => {
    // Don't offer characters already owned
    if (context.currentSideCharacters.includes(sc.id)) {
      return false;
    }
    // Check unlock conditions
    return checkUnlockConditions(sc.unlockConditions, context);
  });
}

// Select random characters for draft based on rarity weights
export function selectDraftOptions(
  available: SideCharacter[],
  count: number = 3
): SideCharacter[] {
  if (available.length <= count) {
    return [...available];
  }
  
  // Build weighted pool
  const weightedPool: SideCharacter[] = [];
  for (const sc of available) {
    const weight = rarityWeights[sc.rarity];
    for (let i = 0; i < weight; i++) {
      weightedPool.push(sc);
    }
  }
  
  // Select without replacement
  const selected: SideCharacter[] = [];
  const usedIds = new Set<string>();
  
  while (selected.length < count && weightedPool.length > 0) {
    const index = Math.floor(Math.random() * weightedPool.length);
    const candidate = weightedPool[index];
    
    if (!usedIds.has(candidate.id)) {
      selected.push(candidate);
      usedIds.add(candidate.id);
    }
    
    // Remove all instances of this character from pool
    for (let i = weightedPool.length - 1; i >= 0; i--) {
      if (weightedPool[i].id === candidate.id) {
        weightedPool.splice(i, 1);
      }
    }
  }
  
  return selected;
}

// Draft configuration
export const DRAFT_CONFIG = {
  maxSideCharacters: 2,
  draftTurns: [3, 7], // Which turns trigger drafts
  optionsPerDraft: 3,
};

// Check if this turn should trigger a draft
export function shouldTriggerDraft(
  turn: number,
  currentSideCharacterCount: number
): boolean {
  if (currentSideCharacterCount >= DRAFT_CONFIG.maxSideCharacters) {
    return false;
  }
  return DRAFT_CONFIG.draftTurns.includes(turn);
}
