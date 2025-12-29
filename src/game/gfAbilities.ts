import { AllStats, Partner } from '../types/game';

// Cooldown/reset types for GF abilities
export type AbilityResetType = 
  | { type: 'turns'; turns: number }           // Ready every N turns
  | { type: 'charges'; maxCharges: number }    // Limited uses per game
  | { type: 'videoTag'; tag: string }          // Resets when you make a video with this tag
  | { type: 'statThreshold'; stat: keyof AllStats; operator: 'gte' | 'lte'; value: number }; // Resets when stat crosses threshold

export interface GFAbility {
  id: string;
  name: string;
  description: string;
  
  // How the ability resets/recharges
  resetType: AbilityResetType;
  
  // Effects when activated
  statChanges?: Partial<AllStats>;
  modifier?: {
    stat: keyof AllStats;
    type: 'rate' | 'flat';
    value: number;
    duration: number;
    source: string;
  };
  giveItem?: string;
  
  // Special effect flags (to be handled by game logic)
  special?: 'skipEvent' | 'doubleAlgorithm' | 'removeModifiers' | 'attackReactor';
  
  // For display
  emoji: string;
}

export interface GFAbilityState {
  // For turn-based cooldowns
  turnsUntilReady: number;
  
  // For charge-based abilities
  chargesRemaining: number;
  
  // Track if ready
  isReady: boolean;
  
  // For stat threshold - track if we've crossed back
  lastStatValue?: number;
}

// Define abilities for each GF
export const gfAbilities: Record<string, GFAbility> = {
  casey: {
    id: 'casey-ability',
    name: 'Attack Dog Mode',
    description: 'Sic Casey on a reactor. Destroys their credibility, but generates drama.',
    resetType: { type: 'turns', turns: 4 },
    statChanges: { reactionChannelFollowing: -15, karma: -10, sanity: -5 },
    special: 'attackReactor',
    emoji: '🐕',
  },
  
  krystle: {
    id: 'krystle-ability',
    name: 'Comfort Food',
    description: 'Krystle brings you your favorites. Restore sanity at the cost of health.',
    resetType: { type: 'turns', turns: 3 },
    statChanges: { sanity: 20, health: -10 },
    emoji: '🍲',
  },
  
  destiny: {
    id: 'destiny-ability',
    name: 'Distraction',
    description: 'Destiny keeps you "busy." Skip the next life event.',
    resetType: { type: 'charges', maxCharges: 2 },
    special: 'skipEvent',
    emoji: '💋',
  },
  
  beck: {
    id: 'beck-ability',
    name: 'Reality Check',
    description: 'Beck sits you down for a talk. Remove negative modifiers, gain credibility.',
    resetType: { type: 'videoTag', tag: 'drama' }, // Resets when you make drama content
    statChanges: { credibility: 15 },
    special: 'removeModifiers',
    emoji: '💬',
  },
  
  faleen: {
    id: 'faleen-ability',
    name: 'Emergency Collab',
    description: 'Faleen jumps on a video with you. Big algorithm boost, but she takes a cut.',
    resetType: { type: 'turns', turns: 3 },
    statChanges: { youtubeAlgorithm: 25, money: -15 },
    emoji: '🤝',
  },
  
  'no-one': {
    id: 'no-one-ability',
    name: 'Lone Wolf',
    description: 'You answer to no one. Boost motivation and algorithm, but sanity suffers.',
    resetType: { type: 'statThreshold', stat: 'sanity', operator: 'lte', value: 30 }, // Resets when sanity drops below 30
    statChanges: { motivation: 15, youtubeAlgorithm: 10, sanity: -15 },
    emoji: '🐺',
  },
};

// Get ability for a partner
export function getGFAbility(partner: Partner | null): GFAbility | null {
  if (!partner) return null;
  return gfAbilities[partner.id] || null;
}

// Create initial ability state for a partner
export function createAbilityState(partner: Partner | null): GFAbilityState | null {
  const ability = getGFAbility(partner);
  if (!ability) return null;
  
  const state: GFAbilityState = {
    turnsUntilReady: 0,
    chargesRemaining: ability.resetType.type === 'charges' ? ability.resetType.maxCharges : 0,
    isReady: true,
  };
  
  return state;
}

// Check if ability is ready to use
export function isAbilityReady(
  ability: GFAbility,
  abilityState: GFAbilityState
): boolean {
  switch (ability.resetType.type) {
    case 'turns':
      return abilityState.turnsUntilReady <= 0;
    case 'charges':
      return abilityState.chargesRemaining > 0;
    case 'videoTag':
      return abilityState.isReady;
    case 'statThreshold':
      return abilityState.isReady;
  }
}

// Update ability state after using the ability
export function useAbility(
  ability: GFAbility,
  abilityState: GFAbilityState
): GFAbilityState {
  const newState = { ...abilityState };
  
  switch (ability.resetType.type) {
    case 'turns':
      newState.turnsUntilReady = ability.resetType.turns;
      newState.isReady = false;
      break;
    case 'charges':
      newState.chargesRemaining = Math.max(0, newState.chargesRemaining - 1);
      newState.isReady = newState.chargesRemaining > 0;
      break;
    case 'videoTag':
      newState.isReady = false;
      break;
    case 'statThreshold':
      newState.isReady = false;
      break;
  }
  
  return newState;
}

// Update ability state at end of turn
export function tickAbilityCooldown(
  ability: GFAbility,
  abilityState: GFAbilityState
): GFAbilityState {
  if (ability.resetType.type !== 'turns') {
    return abilityState;
  }
  
  const newState = { ...abilityState };
  if (newState.turnsUntilReady > 0) {
    newState.turnsUntilReady--;
  }
  newState.isReady = newState.turnsUntilReady <= 0;
  
  return newState;
}

// Check if a video with a certain tag resets the ability
export function checkVideoTagReset(
  ability: GFAbility,
  abilityState: GFAbilityState,
  videoTags: string[]
): GFAbilityState {
  if (ability.resetType.type !== 'videoTag') {
    return abilityState;
  }
  
  if (videoTags.includes(ability.resetType.tag)) {
    return { ...abilityState, isReady: true };
  }
  
  return abilityState;
}

// Check if stat threshold resets the ability
export function checkStatThresholdReset(
  ability: GFAbility,
  abilityState: GFAbilityState,
  stats: AllStats
): GFAbilityState {
  if (ability.resetType.type !== 'statThreshold') {
    return abilityState;
  }
  
  const { stat, operator, value } = ability.resetType;
  const currentValue = stats[stat];
  const lastValue = abilityState.lastStatValue ?? currentValue;
  
  let shouldReset = false;
  
  // Check if we crossed the threshold
  if (operator === 'lte') {
    // Reset when stat drops to or below value (and wasn't already there)
    shouldReset = currentValue <= value && lastValue > value;
  } else if (operator === 'gte') {
    // Reset when stat rises to or above value (and wasn't already there)
    shouldReset = currentValue >= value && lastValue < value;
  }
  
  return {
    ...abilityState,
    isReady: abilityState.isReady || shouldReset,
    lastStatValue: currentValue,
  };
}

// Get display text for cooldown status
export function getAbilityCooldownText(
  ability: GFAbility,
  abilityState: GFAbilityState
): string {
  if (isAbilityReady(ability, abilityState)) {
    return 'Ready';
  }
  
  switch (ability.resetType.type) {
    case 'turns':
      return `${abilityState.turnsUntilReady} turn${abilityState.turnsUntilReady !== 1 ? 's' : ''}`;
    case 'charges':
      return `${abilityState.chargesRemaining}/${ability.resetType.maxCharges} charges`;
    case 'videoTag':
      return `Make a ${ability.resetType.tag} video`;
    case 'statThreshold':
      const { stat, operator, value } = ability.resetType;
      return `${stat} ${operator === 'lte' ? '≤' : '≥'} ${value}`;
  }
}
