import { Card, AllStats, HistoryEntry, ChoiceRequirement } from '../types/game';
import { videoCards, getAvailableVideoCards } from '../data/videoCards';
import { eventCards, getTriggeredEvent, EventCard } from '../data/eventCards';

// Configuration for how many video choices to present
export const VIDEO_CHOICES_COUNT = 3;

// Check if a single requirement is met
function checkRequirement(stats: AllStats, req: ChoiceRequirement): boolean {
  const statValue = stats[req.stat];
  switch (req.operator) {
    case 'gte': return statValue >= req.value;
    case 'lte': return statValue <= req.value;
    case 'eq': return statValue === req.value;
  }
}

// Check if all requirements are met
export function meetsRequirements(
  stats: AllStats,
  requirements?: ChoiceRequirement[]
): boolean {
  if (!requirements || requirements.length === 0) return true;
  return requirements.every(req => checkRequirement(stats, req));
}

// Weighted random selection - cards that match current "vibe" are more likely
function getCardWeight(card: Card, stats: AllStats): number {
  let weight = 1;

  // Increase weight for cards that match low stats (drama when things are bad)
  if (stats.sanity < 40 && card.tags?.includes('drama')) weight += 2;
  if (stats.health < 40 && card.tags?.includes('health')) weight += 2;
  if (stats.motivation < 40 && card.tags?.includes('emotional')) weight += 2;
  
  // Increase weight for food content when sanity is low (comfort content)
  if (stats.sanity < 50 && card.tags?.includes('food')) weight += 1;
  
  // Decrease weight for chill content when everything is on fire
  if (stats.sanity < 30 && stats.health < 30 && card.tags?.includes('chill')) {
    weight *= 0.3;
  }

  return weight;
}

// Weighted random selection from array
function weightedRandomSelect<T extends Card>(
  cards: T[],
  stats: AllStats,
  count: number
): T[] {
  if (cards.length <= count) return [...cards];

  const selected: T[] = [];
  const remaining = [...cards];

  while (selected.length < count && remaining.length > 0) {
    // Calculate weights
    const weights = remaining.map(card => getCardWeight(card, stats));
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);

    // Random selection based on weight
    let random = Math.random() * totalWeight;
    let selectedIndex = 0;

    for (let i = 0; i < weights.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        selectedIndex = i;
        break;
      }
    }

    selected.push(remaining[selectedIndex]);
    remaining.splice(selectedIndex, 1);
  }

  return selected;
}

// Get video card options for the current turn
export function getVideoCardOptions(
  stats: AllStats,
  usedCardIds: string[],
  lockedCardIds: string[]
): Card[] {
  const available = getAvailableVideoCards(usedCardIds, lockedCardIds)
    .filter(card => meetsRequirements(stats, card.requirements));

  return weightedRandomSelect(available, stats, VIDEO_CHOICES_COUNT);
}

// Get the event for end of turn (if any triggers)
export function getEndOfTurnEvent(
  stats: AllStats,
  history: HistoryEntry[],
  turn: number,
  usedCardIds: string[]
): EventCard | null {
  return getTriggeredEvent(stats, history, turn, usedCardIds);
}

// Get a single random video card (for forced video situations)
export function getRandomVideoCard(
  stats: AllStats,
  usedCardIds: string[],
  lockedCardIds: string[]
): Card | null {
  const options = getVideoCardOptions(stats, usedCardIds, lockedCardIds);
  return options.length > 0 ? options[0] : null;
}

// Filter choices based on requirements
export function getAvailableChoices(card: Card, stats: AllStats) {
  return card.choices.filter(choice => 
    meetsRequirements(stats, choice.requirements)
  );
}

// Debug: list all video cards
export function debugListVideoCards(): void {
  console.log('=== VIDEO CARDS ===');
  videoCards.forEach(card => {
    console.log(`${card.id}: ${card.title} (${card.choices.length} choices)`);
  });
}

// Debug: list all event cards
export function debugListEventCards(): void {
  console.log('=== EVENT CARDS ===');
  eventCards.forEach(card => {
    console.log(`${card.id}: ${card.title} (priority: ${card.priority})`);
  });
}
