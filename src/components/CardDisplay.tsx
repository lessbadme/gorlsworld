import { Card, CardChoice, AllStats } from '../types/game';
import { meetsRequirements } from '../game/cardEngine';
import { getPartnerAbility, applyDamageReduction } from '../game/partnerAbilities';
import { useGameStore } from '../game/store';

interface CardDisplayProps {
  card: Card;
  stats: AllStats;
  onChoose: (choice: CardChoice) => void;
}

// Format stat changes for display
function formatStatChange(stat: string, value: number, reducedValue?: number): string {
  const sign = value > 0 ? '+' : '';
  // Convert camelCase to readable
  const readableStat = stat
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
  
  if (reducedValue !== undefined && reducedValue !== value) {
    return `${sign}${reducedValue} ${readableStat} (was ${value})`;
  }
  return `${sign}${value} ${readableStat}`;
}

// Get color class for stat change
function getStatChangeColor(value: number, stat: string): string {
  // Some stats are "bad" to increase (narcissism, etc.)
  const badStats = ['narcissism', 'manipulation', 'evasiveness', 'entitlement', 'obliviousness', 'defensiveness', 'smug'];
  const isBadStat = badStats.includes(stat);
  
  if (isBadStat) {
    return value > 0 ? 'text-red-400' : 'text-green-400';
  }
  return value > 0 ? 'text-green-400' : 'text-red-400';
}

interface ChoiceButtonProps {
  choice: CardChoice;
  stats: AllStats;
  onChoose: () => void;
  disabled: boolean;
  partnerDamageReduction: { stat: string; reduction: number } | null;
}

function ChoiceButton({ choice, stats, onChoose, disabled, partnerDamageReduction }: ChoiceButtonProps) {
  // Gather all immediate stat changes from effects for preview
  const statChanges: Record<string, number> = {};
  const reducedChanges: Record<string, number> = {};
  const itemsGiven: string[] = [];
  
  choice.effects.forEach(effect => {
    if (effect.type === 'immediate' && effect.statChanges) {
      Object.entries(effect.statChanges).forEach(([stat, value]) => {
        if (value !== undefined) {
          statChanges[stat] = (statChanges[stat] || 0) + value;
          
          // Calculate reduced value if partner has damage reduction
          if (partnerDamageReduction && stat === partnerDamageReduction.stat && value < 0) {
            reducedChanges[stat] = Math.round(value * (1 - partnerDamageReduction.reduction));
          }
        }
      });
    }
    // Track items given
    if (effect.giveItem) {
      itemsGiven.push(effect.giveItem);
    }
    // Note: We don't show conditional effects or modifiers in preview - too complex
  });

  const hasEffects = Object.keys(statChanges).length > 0 || itemsGiven.length > 0;
  const meetsReqs = meetsRequirements(stats, choice.requirements);

  // Get emoji for item
  const getItemEmoji = (itemId: string): string => {
    const emojiMap: Record<string, string> = {
      'chili': '🌶️',
      'orange-chicken': '🍗',
      'lexapro': '💊',
      'energy-drink': '⚡',
      'weed-edible': '🍃',
      'cash-stash': '💵',
      'pr-consultant': '📞',
      'burner-phone': '📱',
    };
    return emojiMap[itemId] || '📦';
  };

  return (
    <button
      onClick={onChoose}
      disabled={disabled || !meetsReqs}
      className={`card-choice ${!meetsReqs ? 'opacity-50' : ''}`}
    >
      <div className="font-medium mb-2">{choice.text}</div>
      
      {hasEffects && (
        <div className="flex flex-wrap gap-2 text-xs">
          {/* Item rewards */}
          {itemsGiven.map((itemId) => (
            <span
              key={itemId}
              className="px-2 py-0.5 rounded bg-yellow-900/50 text-yellow-300"
            >
              {getItemEmoji(itemId)} Get item
            </span>
          ))}
          
          {/* Stat changes */}
          {Object.entries(statChanges).map(([stat, value]) => {
            const reduced = reducedChanges[stat];
            const displayValue = reduced !== undefined ? reduced : value;
            const hasReduction = reduced !== undefined && reduced !== value;
            
            return (
              <span
                key={stat}
                className={`px-2 py-0.5 rounded ${hasReduction ? 'bg-purple-900/50' : 'bg-gray-800'} ${getStatChangeColor(displayValue, stat)}`}
              >
                {formatStatChange(stat, value, reduced)}
                {hasReduction && <span className="text-purple-400 ml-1">✨</span>}
              </span>
            );
          })}
        </div>
      )}

      {!meetsReqs && (
        <div className="text-xs text-gray-500 mt-2 italic">
          Requirements not met
        </div>
      )}
    </button>
  );
}

export function CardDisplay({ card, stats, onChoose }: CardDisplayProps) {
  const partner = useGameStore(s => s.partner);
  const isSingleChoice = card.choices.length === 1;
  
  // Check for partner damage reduction ability
  const ability = getPartnerAbility(partner);
  const partnerDamageReduction = ability?.type === 'damageReduction' && ability.stat && ability.value !== undefined
    ? { stat: ability.stat, reduction: ability.value }
    : null;

  return (
    <div className="card max-w-lg mx-auto">
      {/* Card image placeholder */}
      {card.imageUrl ? (
        <img 
          src={card.imageUrl} 
          alt={card.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      ) : (
        <div className="w-full h-32 bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-4xl">
            {card.type === 'video' && '🎬'}
            {card.type === 'lifeEvent' && '🎲'}
            {card.type === 'postVideo' && '📊'}
            {card.type === 'landmark' && '⭐'}
          </span>
        </div>
      )}

      {/* Card type badge */}
      <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">
        {card.type === 'video' && 'Video'}
        {card.type === 'lifeEvent' && 'Life Event'}
        {card.type === 'postVideo' && 'Aftermath'}
        {card.type === 'landmark' && 'Landmark'}
      </div>

      {/* Title and description */}
      <h2 className="text-2xl font-bold mb-2">{card.title}</h2>
      <p className="text-gray-400 mb-6">{card.description}</p>

      {/* Partner ability reminder if relevant */}
      {partnerDamageReduction && (
        <div className="text-xs text-purple-400 mb-4">
          ✨ {partner?.name}'s effect: {ability?.description}
        </div>
      )}

      {/* Choices */}
      <div className="space-y-3">
        {card.choices.map(choice => (
          <ChoiceButton
            key={choice.id}
            choice={choice}
            stats={stats}
            onChoose={() => onChoose(choice)}
            disabled={false}
            partnerDamageReduction={partnerDamageReduction}
          />
        ))}
      </div>

      {/* Single choice hint */}
      {isSingleChoice && (
        <p className="text-xs text-gray-500 text-center mt-4">
          No choice here. This is happening.
        </p>
      )}
    </div>
  );
}
