// Core stats that can end the game when they hit 0
export interface CoreStats {
  money: number;
  health: number;
  sanity: number;
  motivation: number;
}

// Secondary stats that influence gameplay but don't directly end it
export interface SecondaryStats {
  youtubeAlgorithm: number; // How much YT is pushing your content
  reactionChannelFollowing: number; // How big the "reactor" ecosystem around you is
  karma: number; // Good/bad actions accumulate
  relationships: number; // Connections with other creators, friends, family
  credibility: number; // How much people trust/believe you
}

// Personality attributes - these probably shift slowly and affect card options/outcomes
export interface Attributes {
  smug: number;
  manipulation: number;
  narcissism: number;
  evasiveness: number;
  entitlement: number;
  obliviousness: number;
  defensiveness: number;
  accountability: number;
}

// All stats combined
export interface AllStats extends CoreStats, SecondaryStats, Attributes {}

// Stat modifier that persists across turns
export interface StatModifier {
  id: string;
  stat: keyof AllStats;
  type: 'flat' | 'rate'; // flat = one-time change, rate = per-turn change
  value: number;
  duration: number | 'permanent'; // turns remaining, or permanent
  source: string; // which card/event created this
}

// Game phases in order
export type GamePhase =
  | 'scenarioSelect'
  | 'partnerSelect'
  | 'lifeEvent'
  | 'video'
  | 'postVideo'
  | 'results';

// A card choice the player can make
export interface CardChoice {
  id: string;
  text: string;
  effects: CardEffect[];
  requirements?: ChoiceRequirement[];
}

// Requirements to show/enable a choice
export interface ChoiceRequirement {
  stat: keyof AllStats;
  operator: 'gte' | 'lte' | 'eq';
  value: number;
}

// The actual effect when a choice is made
export interface CardEffect {
  type: 'immediate' | 'endOfTurn' | 'nextTurn' | 'conditional' | 'modifier';
  
  // For immediate/endOfTurn/nextTurn effects
  statChanges?: Partial<AllStats>;
  
  // For modifier effects (ongoing rate changes)
  modifier?: Omit<StatModifier, 'id'>;
  
  // For conditional effects
  condition?: {
    stat: keyof AllStats;
    operator: 'gte' | 'lte' | 'eq';
    value: number;
  };
  thenEffects?: CardEffect[];
  elseEffects?: CardEffect[];
  
  // Item effects
  giveItem?: string; // Item ID to give
  
  // Special effects
  special?: 'unlockCard' | 'lockCard' | 'forceNextVideo' | 'triggerLifeEvent';
  specialData?: string; // card id, event id, etc.
}

// A card (video, life event, etc.)
export interface Card {
  id: string;
  type: 'video' | 'lifeEvent' | 'postVideo' | 'landmark';
  title: string;
  description: string;
  imageUrl?: string;
  choices: CardChoice[];
  
  // When can this card appear?
  requirements?: ChoiceRequirement[];
  
  // Can this card appear multiple times?
  repeatable: boolean;
  
  // Tags for filtering/theming
  tags?: string[];
}

// Starting scenario
export interface Scenario {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  startingStats: Partial<AllStats>;
  startingModifiers?: Omit<StatModifier, 'id'>[];
  unlockedCards?: string[]; // Card IDs available from the start
}

// Partner choice
export interface Partner {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  statModifiers: Omit<StatModifier, 'id'>[]; // Ongoing effects
  specialAbility?: string; // Description of unique mechanic
}

// History entry for tracking what happened
export interface HistoryEntry {
  turn: number;
  phase: GamePhase;
  cardId?: string;
  choiceId?: string;
  statSnapshot: AllStats;
}

// The full game state
export interface GameState {
  // Current phase
  phase: GamePhase;
  turn: number;
  videosThisTurn: number; // 0-3, resets each turn
  
  // Player choices
  scenario: Scenario | null;
  partner: Partner | null;
  
  // Stats
  stats: AllStats;
  
  // Active modifiers
  modifiers: StatModifier[];
  
  // Items
  items: string[]; // Item IDs the player is holding
  
  // GF ability state
  abilityState: {
    turnsUntilReady: number;
    chargesRemaining: number;
    isReady: boolean;
    lastStatValue?: number;
  } | null;
  skipNextEvent: boolean; // For Destiny's ability
  
  // Side characters (augments)
  sideCharacters: string[]; // Side character IDs
  pendingDraft: boolean; // True when player needs to draft
  draftOptions: string[]; // Side character IDs available this draft
  
  // Video tag tracking (for unlock conditions and ability resets)
  videoTagCounts: Record<string, number>;
  
  // Card state
  currentCard: Card | null;
  usedCardIds: string[]; // Non-repeatable cards that have been seen
  lockedCardIds: string[]; // Cards locked by effects
  unlockedCardIds: string[]; // Cards unlocked by effects (beyond defaults)
  
  // History for potential "remember past video" mechanics
  history: HistoryEntry[];
  
  // Why did the game end?
  endReason: keyof CoreStats | null;
}

// Default starting values
export const DEFAULT_CORE_STATS: CoreStats = {
  money: 50,
  health: 75,
  sanity: 75,
  motivation: 60,
};

export const DEFAULT_SECONDARY_STATS: SecondaryStats = {
  youtubeAlgorithm: 50,
  reactionChannelFollowing: 30,
  karma: 50,
  relationships: 50,
  credibility: 60,
};

export const DEFAULT_ATTRIBUTES: Attributes = {
  smug: 20,
  manipulation: 20,
  narcissism: 30,
  evasiveness: 20,
  entitlement: 25,
  obliviousness: 30,
  defensiveness: 30,
  accountability: 40,
};

export const DEFAULT_STATS: AllStats = {
  ...DEFAULT_CORE_STATS,
  ...DEFAULT_SECONDARY_STATS,
  ...DEFAULT_ATTRIBUTES,
};
