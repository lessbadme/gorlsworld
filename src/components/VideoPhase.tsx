import { useState, useEffect } from 'react';
import { Card, CardChoice } from '../types/game';
import { useGameStore, useStats } from '../game/store';
import { getVideoCardOptions } from '../game/cardEngine';
import { CardDisplay } from './CardDisplay';
import { useToast } from './Toast';
import { items as allItems } from '../data/items';

export function VideoPhase() {
  const stats = useStats();
  const usedCardIds = useGameStore(s => s.usedCardIds);
  const lockedCardIds = useGameStore(s => s.lockedCardIds);
  const presentCard = useGameStore(s => s.presentCard);
  const makeChoice = useGameStore(s => s.makeChoice);
  const advancePhase = useGameStore(s => s.advancePhase);
  const currentCard = useGameStore(s => s.currentCard);
  const videosThisTurn = useGameStore(s => s.videosThisTurn);
  const { showInfo } = useToast();

  const [videoOptions, setVideoOptions] = useState<Card[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Card | null>(null);

  // Get video options when entering the phase
  useEffect(() => {
    if (!currentCard && !selectedVideo) {
      const options = getVideoCardOptions(stats, usedCardIds, lockedCardIds);
      setVideoOptions(options);
    }
  }, [stats, usedCardIds, lockedCardIds, currentCard, selectedVideo]);

  // Handle selecting a video type
  const handleSelectVideo = (card: Card) => {
    setSelectedVideo(card);
    presentCard(card);
  };

  // Handle making a choice within the video
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
    setSelectedVideo(null);
    setVideoOptions([]);
    advancePhase();
  };

  // If we have a card presented, show the card
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

  // Otherwise show video selection
  return (
    <div className="flex-1 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">
            What Video Are You Making?
          </h2>
          <p className="text-gray-400">
            Video {videosThisTurn + 1} of 3 this week
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {videoOptions.map(card => (
            <button
              key={card.id}
              onClick={() => handleSelectVideo(card)}
              className="card hover:border-gray-500 transition-colors text-left"
            >
              {/* Video type icon */}
              <div className="text-3xl mb-3">
                {card.tags?.includes('food') && '🍔'}
                {card.tags?.includes('drama') && '🔥'}
                {card.tags?.includes('vlog') && '📹'}
                {card.tags?.includes('livestream') && '🔴'}
                {card.tags?.includes('haul') && '🛍️'}
                {card.tags?.includes('emotional') && '😢'}
                {card.tags?.includes('chill') && '😌'}
                {card.tags?.includes('weight') && '⚖️'}
                {card.tags?.includes('diet') && '🥗'}
                {!card.tags?.length && '🎬'}
              </div>

              <h3 className="text-lg font-bold mb-2">{card.title}</h3>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                {card.description}
              </p>

              {/* Choice count indicator */}
              <div className="text-xs text-gray-500">
                {card.choices.length === 1 
                  ? 'No choices - just vibes'
                  : `${card.choices.length} ways this could go`
                }
              </div>
            </button>
          ))}
        </div>

        {videoOptions.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No videos available... that's weird.
          </div>
        )}
      </div>
    </div>
  );
}
