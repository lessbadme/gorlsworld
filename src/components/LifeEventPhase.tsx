import { useState, useEffect } from 'react';
import { CardChoice } from '../types/game';
import { useGameStore, useStats } from '../game/store';
import { getEndOfTurnEvent } from '../game/cardEngine';
import { EventCard } from '../data/eventCards';
import { CardDisplay } from './CardDisplay';
import { useToast } from './Toast';
import { items as allItems } from '../data/items';

export function LifeEventPhase() {
  const stats = useStats();
  const history = useGameStore(s => s.history);
  const turn = useGameStore(s => s.turn);
  const usedCardIds = useGameStore(s => s.usedCardIds);
  const presentCard = useGameStore(s => s.presentCard);
  const makeChoice = useGameStore(s => s.makeChoice);
  const advancePhase = useGameStore(s => s.advancePhase);
  const currentCard = useGameStore(s => s.currentCard);
  const { showInfo } = useToast();

  const [checkedForEvent, setCheckedForEvent] = useState(false);
  const [event, setEvent] = useState<EventCard | null>(null);

  // Check for event when entering the phase
  useEffect(() => {
    if (!checkedForEvent && !currentCard) {
      const triggeredEvent = getEndOfTurnEvent(stats, history, turn, usedCardIds);
      setEvent(triggeredEvent);
      setCheckedForEvent(true);
      
      if (triggeredEvent) {
        presentCard(triggeredEvent);
      }
    }
  }, [checkedForEvent, currentCard, stats, history, turn, usedCardIds, presentCard]);

  // Handle making a choice within the event
  const handleChoice = (choice: CardChoice) => {
    // Check if choice gives an item
    const itemGiven = choice.effects.find(e => e.giveItem)?.giveItem;
    if (itemGiven) {
      const item = allItems.find(i => i.id === itemGiven);
      if (item) {
        showInfo(`📦 Got item: ${item.name}`);
      }
    }
    
    makeChoice(choice);
    setEvent(null);
    setCheckedForEvent(false);
    advancePhase();
  };

  // Handle skipping if no event
  const handleContinue = () => {
    setCheckedForEvent(false);
    advancePhase();
  };

  // If we have an event card, show it
  if (currentCard) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <CardDisplay
          card={currentCard}
          stats={stats}
          onChoose={handleChoice}
        />
      </div>
    );
  }

  // No event triggered - show transition screen
  if (checkedForEvent && !event) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="card max-w-md text-center">
          <div className="text-4xl mb-4">📅</div>
          <h2 className="text-2xl font-bold mb-2">Week {turn}</h2>
          <p className="text-gray-400 mb-6">
            {turn === 1 
              ? 'Time to start making content.'
              : 'Another week, another grind. Nothing unusual happening... yet.'
            }
          </p>
          <button
            onClick={handleContinue}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
          >
            Start Making Videos
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-gray-400">Checking what life has in store...</div>
    </div>
  );
}
