import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  GameState,
  GamePhase,
  AllStats,
  StatModifier,
  Card,
  CardChoice,
  CardEffect,
  Scenario,
  Partner,
  HistoryEntry,
  DEFAULT_STATS,
} from '../types/game';
import {
  applyStatFloors,
  applyDamageReduction,
} from './partnerAbilities';
import {
  createAbilityState,
  getGFAbility,
  isAbilityReady,
  useAbility,
  tickAbilityCooldown,
  checkVideoTagReset,
  checkStatThresholdReset,
  GFAbilityState,
} from './gfAbilities';
import {
  getSideCharacterById,
  getAvailableSideCharacters,
  selectDraftOptions,
  shouldTriggerDraft,
  DRAFT_CONFIG,
} from '../data/sideCharacters';
import { items as allItems, MAX_ITEMS, Item } from '../data/items';

// Generate unique IDs for modifiers
let modifierId = 0;
const generateModifierId = () => `mod_${++modifierId}`;

// Helper to clamp stats between 0-100
const clampStat = (value: number): number => Math.max(0, Math.min(100, value));

// Apply stat changes to current stats
const applyStatChanges = (
  stats: AllStats,
  changes: Partial<AllStats>
): AllStats => {
  const newStats = { ...stats };
  for (const [key, value] of Object.entries(changes)) {
    if (value !== undefined) {
      newStats[key as keyof AllStats] = clampStat(
        newStats[key as keyof AllStats] + value
      );
    }
  }
  return newStats;
};

// Check if a condition is met
const checkCondition = (
  stats: AllStats,
  condition: { stat: keyof AllStats; operator: 'gte' | 'lte' | 'eq'; value: number }
): boolean => {
  const statValue = stats[condition.stat];
  switch (condition.operator) {
    case 'gte':
      return statValue >= condition.value;
    case 'lte':
      return statValue <= condition.value;
    case 'eq':
      return statValue === condition.value;
  }
};

// Check if any core stat hit 0 (game over condition)
const checkGameOver = (stats: AllStats): keyof AllStats | null => {
  if (stats.money <= 0) return 'money';
  if (stats.health <= 0) return 'health';
  if (stats.sanity <= 0) return 'sanity';
  if (stats.motivation <= 0) return 'motivation';
  return null;
};

// Get item by ID
const getItemById = (id: string): Item | undefined => {
  return allItems.find(item => item.id === id);
};

interface GameActions {
  // Setup actions
  selectScenario: (scenario: Scenario) => void;
  selectPartner: (partner: Partner) => void;
  
  // Gameplay actions
  presentCard: (card: Card) => void;
  makeChoice: (choice: CardChoice) => void;
  
  // Item actions
  addItem: (itemId: string) => boolean; // Returns false if inventory full
  useItem: (itemId: string) => void;
  
  // GF ability actions
  useGFAbility: () => void;
  
  // Side character actions
  draftSideCharacter: (sideCharacterId: string) => void;
  skipDraft: () => void;
  
  // Phase management
  advancePhase: () => void;
  
  // Turn management
  endTurn: () => void;
  
  // Direct stat manipulation (for testing/debugging)
  setStats: (stats: Partial<AllStats>) => void;
  
  // Reset
  resetGame: () => void;
}

const initialState: GameState = {
  phase: 'scenarioSelect',
  turn: 1,
  videosThisTurn: 0,
  scenario: null,
  partner: null,
  stats: { ...DEFAULT_STATS },
  modifiers: [],
  items: [],
  abilityState: null,
  skipNextEvent: false,
  sideCharacters: [],
  pendingDraft: false,
  draftOptions: [],
  videoTagCounts: {},
  currentCard: null,
  usedCardIds: [],
  lockedCardIds: [],
  unlockedCardIds: [],
  history: [],
  endReason: null,
};

export const useGameStore = create<GameState & GameActions>()(
  devtools(
    (set, get) => ({
      ...initialState,

      selectScenario: (scenario: Scenario) => {
        set((state) => {
          // Apply scenario's starting stats
          const newStats = applyStatChanges(state.stats, scenario.startingStats);
          
          // Add scenario's starting modifiers
          const newModifiers: StatModifier[] = (scenario.startingModifiers || []).map(
            (mod) => ({
              ...mod,
              id: generateModifierId(),
            })
          );

          // Give a starting item based on scenario
          const startingItems: Record<string, string> = {
            'fallen-giant': 'cash-stash', // You still have some emergency money
            'burnout-creator': 'energy-drink', // You run on caffeine
            'drama-magnet': 'burner-phone', // You know how to disappear
            'wholesome-decline': 'lexapro', // Prescribed but rarely taken
          };
          const startingItem = startingItems[scenario.id] || 'chili';

          return {
            scenario,
            stats: newStats,
            modifiers: [...state.modifiers, ...newModifiers],
            items: [startingItem],
            unlockedCardIds: scenario.unlockedCards || [],
            phase: 'partnerSelect' as GamePhase,
          };
        });
      },

      selectPartner: (partner: Partner) => {
        set((state) => {
          // Note: Partner stat modifiers are now handled by side characters
          // GFs only provide active abilities
          
          // Initialize GF ability state
          const abilityState = createAbilityState(partner);

          return {
            partner,
            abilityState,
            phase: 'lifeEvent' as GamePhase,
          };
        });
      },

      presentCard: (card: Card) => {
        set({ currentCard: card });
      },

      makeChoice: (choice: CardChoice) => {
        set((state) => {
          let newStats = { ...state.stats };
          let newModifiers = [...state.modifiers];
          let newItems = [...state.items];
          let newAbilityState = state.abilityState ? { ...state.abilityState } : null;
          let newVideoTagCounts = { ...state.videoTagCounts };
          const pendingEffects: CardEffect[] = [];

          // Track video tags for ability resets and unlock conditions
          const currentCard = state.currentCard;
          if (currentCard?.type === 'video' && currentCard.tags) {
            for (const tag of currentCard.tags) {
              newVideoTagCounts[tag] = (newVideoTagCounts[tag] || 0) + 1;
            }
            
            // Check if video tag resets GF ability
            if (newAbilityState && state.partner) {
              const ability = getGFAbility(state.partner);
              if (ability) {
                newAbilityState = checkVideoTagReset(ability, newAbilityState, currentCard.tags);
              }
            }
          }

          // Process each effect
          const processEffect = (effect: CardEffect) => {
            // Handle item giving (works with any effect type)
            if (effect.giveItem && newItems.length < MAX_ITEMS) {
              newItems.push(effect.giveItem);
            }

            switch (effect.type) {
              case 'immediate':
                if (effect.statChanges) {
                  // No more partner damage reduction - that's now side characters
                  newStats = applyStatChanges(newStats, effect.statChanges);
                  // Apply stat floors from side characters if any
                  newStats = applyStatFloors(newStats, state.partner);
                }
                break;

              case 'modifier':
                if (effect.modifier) {
                  newModifiers.push({
                    ...effect.modifier,
                    id: generateModifierId(),
                  });
                }
                break;

              case 'conditional':
                if (effect.condition && checkCondition(newStats, effect.condition)) {
                  effect.thenEffects?.forEach(processEffect);
                } else {
                  effect.elseEffects?.forEach(processEffect);
                }
                break;

              case 'endOfTurn':
              case 'nextTurn':
                // Queue these for later processing
                pendingEffects.push(effect);
                break;
            }
          };

          choice.effects.forEach(processEffect);

          // Check if stat threshold resets GF ability
          if (newAbilityState && state.partner) {
            const ability = getGFAbility(state.partner);
            if (ability) {
              newAbilityState = checkStatThresholdReset(ability, newAbilityState, newStats);
            }
          }

          // Record in history
          const historyEntry: HistoryEntry = {
            turn: state.turn,
            phase: state.phase,
            cardId: state.currentCard?.id,
            choiceId: choice.id,
            statSnapshot: { ...newStats },
          };

          // Mark card as used if not repeatable
          const newUsedCardIds = state.currentCard && !state.currentCard.repeatable
            ? [...state.usedCardIds, state.currentCard.id]
            : state.usedCardIds;

          // Check for game over
          const endReason = checkGameOver(newStats);

          return {
            stats: newStats,
            modifiers: newModifiers,
            items: newItems,
            abilityState: newAbilityState,
            videoTagCounts: newVideoTagCounts,
            currentCard: null,
            usedCardIds: newUsedCardIds,
            history: [...state.history, historyEntry],
            endReason,
            phase: endReason ? 'results' as GamePhase : state.phase,
          };
        });
      },

      advancePhase: () => {
        set((state) => {
          const phaseOrder: GamePhase[] = [
            'scenarioSelect',
            'partnerSelect',
            'lifeEvent',
            'video',
            'postVideo',
            'results',
          ];

          const currentIndex = phaseOrder.indexOf(state.phase);
          
          // Special handling for video phase (3 videos per turn)
          if (state.phase === 'video') {
            const newVideosCount = state.videosThisTurn + 1;
            if (newVideosCount < 3) {
              return { videosThisTurn: newVideosCount };
            }
            // After 3 videos, move to postVideo
            return {
              videosThisTurn: 0,
              phase: 'postVideo' as GamePhase,
            };
          }

          // After postVideo, loop back to lifeEvent (new turn)
          if (state.phase === 'postVideo') {
            return {
              phase: 'lifeEvent' as GamePhase,
              turn: state.turn + 1,
            };
          }

          // Normal phase advancement
          const nextPhase = phaseOrder[currentIndex + 1] || 'results';
          return { phase: nextPhase as GamePhase };
        });
      },

      endTurn: () => {
        set((state) => {
          let newStats = { ...state.stats };
          let newModifiers: StatModifier[] = [];
          let newAbilityState = state.abilityState ? { ...state.abilityState } : null;
          const nextTurn = state.turn + 1;

          // Apply rate modifiers (from side characters)
          for (const mod of state.modifiers) {
            if (mod.type === 'rate') {
              newStats = applyStatChanges(newStats, {
                [mod.stat]: mod.value,
              } as Partial<AllStats>);
            }

            // Decrement duration and keep if still active
            if (mod.duration === 'permanent') {
              newModifiers.push(mod);
            } else if (mod.duration > 1) {
              newModifiers.push({ ...mod, duration: mod.duration - 1 });
            }
            // If duration is 1, it expires and is not added back
          }

          // Tick GF ability cooldown
          if (newAbilityState && state.partner) {
            const ability = getGFAbility(state.partner);
            if (ability) {
              newAbilityState = tickAbilityCooldown(ability, newAbilityState);
              // Also check stat threshold reset
              newAbilityState = checkStatThresholdReset(ability, newAbilityState, newStats);
            }
          }

          // Check if we should trigger a side character draft next turn
          let pendingDraft = false;
          let draftOptions: string[] = [];
          
          if (shouldTriggerDraft(nextTurn, state.sideCharacters.length)) {
            const available = getAvailableSideCharacters({
              turn: nextTurn,
              stats: newStats,
              partnerId: state.partner?.id || null,
              usedCardIds: state.usedCardIds,
              currentSideCharacters: state.sideCharacters,
              videoTagCounts: state.videoTagCounts,
            });
            
            if (available.length > 0) {
              const options = selectDraftOptions(available, DRAFT_CONFIG.optionsPerDraft);
              draftOptions = options.map(sc => sc.id);
              pendingDraft = true;
            }
          }

          // Check for game over
          const endReason = checkGameOver(newStats);

          return {
            stats: newStats,
            modifiers: newModifiers,
            abilityState: newAbilityState,
            pendingDraft,
            draftOptions,
            endReason,
            phase: endReason ? 'results' as GamePhase : state.phase,
          };
        });
      },

      addItem: (itemId: string) => {
        const state = get();
        if (state.items.length >= MAX_ITEMS) {
          return false; // Inventory full
        }
        set({ items: [...state.items, itemId] });
        return true;
      },

      useItem: (itemId: string) => {
        set((state) => {
          const itemIndex = state.items.indexOf(itemId);
          if (itemIndex === -1) return state; // Item not in inventory

          const item = getItemById(itemId);
          if (!item) return state; // Item doesn't exist

          // Remove item from inventory
          const newItems = [...state.items];
          newItems.splice(itemIndex, 1);

          // Apply stat changes
          let newStats = applyStatChanges(state.stats, item.statChanges);
          
          // Apply stat floors
          newStats = applyStatFloors(newStats, state.partner);

          // Add modifier if item has one
          let newModifiers = [...state.modifiers];
          if (item.modifier) {
            newModifiers.push({
              ...item.modifier,
              id: generateModifierId(),
            });
          }

          // Check for game over (items could theoretically kill you)
          const endReason = checkGameOver(newStats);

          return {
            items: newItems,
            stats: newStats,
            modifiers: newModifiers,
            endReason,
            phase: endReason ? 'results' as GamePhase : state.phase,
          };
        });
      },

      useGFAbility: () => {
        set((state) => {
          if (!state.partner || !state.abilityState) return state;

          const ability = getGFAbility(state.partner);
          if (!ability) return state;

          // Check if ability is ready
          if (!isAbilityReady(ability, state.abilityState)) return state;

          // Apply ability effects
          let newStats = state.stats;
          let newModifiers = [...state.modifiers];
          let skipNextEvent = state.skipNextEvent;

          // Apply stat changes
          if (ability.statChanges) {
            newStats = applyStatChanges(newStats, ability.statChanges);
          }

          // Apply modifier
          if (ability.modifier) {
            newModifiers.push({
              ...ability.modifier,
              id: generateModifierId(),
            });
          }

          // Handle special effects
          if (ability.special === 'skipEvent') {
            skipNextEvent = true;
          } else if (ability.special === 'removeModifiers') {
            // Remove all negative temporary modifiers
            newModifiers = newModifiers.filter(mod => 
              mod.duration === 'permanent' || mod.value > 0
            );
          }

          // Update ability state (cooldown)
          const newAbilityState = useAbility(ability, state.abilityState);

          // Check for game over
          const endReason = checkGameOver(newStats);

          return {
            stats: newStats,
            modifiers: newModifiers,
            abilityState: newAbilityState,
            skipNextEvent,
            endReason,
            phase: endReason ? 'results' as GamePhase : state.phase,
          };
        });
      },

      draftSideCharacter: (sideCharacterId: string) => {
        set((state) => {
          // Verify this is a valid draft option
          if (!state.draftOptions.includes(sideCharacterId)) return state;
          if (state.sideCharacters.length >= DRAFT_CONFIG.maxSideCharacters) return state;

          const sideCharacter = getSideCharacterById(sideCharacterId);
          if (!sideCharacter) return state;

          // Add side character's modifiers
          const newModifiers = [...state.modifiers];
          for (const mod of sideCharacter.statModifiers) {
            newModifiers.push({
              ...mod,
              id: generateModifierId(),
            });
          }

          // Handle card unlocks/locks
          let newUnlockedCardIds = [...state.unlockedCardIds];
          let newLockedCardIds = [...state.lockedCardIds];

          if (sideCharacter.unlocksCards) {
            newUnlockedCardIds = [...newUnlockedCardIds, ...sideCharacter.unlocksCards];
          }
          if (sideCharacter.locksCards) {
            newLockedCardIds = [...newLockedCardIds, ...sideCharacter.locksCards];
          }

          return {
            sideCharacters: [...state.sideCharacters, sideCharacterId],
            modifiers: newModifiers,
            unlockedCardIds: newUnlockedCardIds,
            lockedCardIds: newLockedCardIds,
            pendingDraft: false,
            draftOptions: [],
          };
        });
      },

      skipDraft: () => {
        set({
          pendingDraft: false,
          draftOptions: [],
        });
      },

      setStats: (stats: Partial<AllStats>) => {
        set((state) => ({
          stats: applyStatChanges(state.stats, stats),
        }));
      },

      resetGame: () => {
        modifierId = 0; // Reset ID counter
        set(initialState);
      },
    }),
    { name: 'bitlyfe-game' }
  )
);

// Selector hooks for convenience
export const useStats = () => useGameStore((state) => state.stats);
export const usePhase = () => useGameStore((state) => state.phase);
export const useCurrentCard = () => useGameStore((state) => state.currentCard);
export const useIsGameOver = () => useGameStore((state) => state.endReason !== null);
export const useItems = () => useGameStore((state) => state.items);
export const useAbilityState = () => useGameStore((state) => state.abilityState);
export const useSideCharacters = () => useGameStore((state) => state.sideCharacters);
export const usePendingDraft = () => useGameStore((state) => state.pendingDraft);
export const useDraftOptions = () => useGameStore((state) => state.draftOptions);
