import { useGameStore, useDraftOptions, useSideCharacters } from '../game/store';
import { 
  getSideCharacterById, 
  rarityColors, 
  rarityBgColors, 
  rarityBorderColors,
  DRAFT_CONFIG 
} from '../data/sideCharacters';
import { useToast } from './Toast';

export function SideCharacterDraft() {
  const draftOptions = useDraftOptions();
  const currentSideCharacters = useSideCharacters();
  const draftSideCharacter = useGameStore(s => s.draftSideCharacter);
  const skipDraft = useGameStore(s => s.skipDraft);
  const { showInfo } = useToast();

  if (draftOptions.length === 0) return null;

  const sideCharacters = draftOptions
    .map(getSideCharacterById)
    .filter((sc): sc is NonNullable<typeof sc> => sc !== undefined);

  const handleDraft = (sideCharacterId: string) => {
    const sc = getSideCharacterById(sideCharacterId);
    if (sc) {
      draftSideCharacter(sideCharacterId);
      showInfo(`${sc.emoji} ${sc.name} joined your story!`);
    }
  };

  const handleSkip = () => {
    skipDraft();
    showInfo('You skipped the draft.');
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">A New Face Appears</h2>
            <p className="text-gray-400">
              Choose a side character to join your story ({currentSideCharacters.length}/{DRAFT_CONFIG.maxSideCharacters} slots)
            </p>
          </div>

          {/* Draft options */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            {sideCharacters.map(sc => (
              <button
                key={sc.id}
                onClick={() => handleDraft(sc.id)}
                className={`text-left p-4 rounded-lg border-2 transition-all hover:scale-105 ${rarityBgColors[sc.rarity]} ${rarityBorderColors[sc.rarity]}`}
              >
                {/* Rarity badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs uppercase font-bold ${rarityColors[sc.rarity]}`}>
                    {sc.rarity}
                  </span>
                  <span className="text-2xl">{sc.emoji}</span>
                </div>

                {/* Name */}
                <h3 className="text-lg font-bold mb-1">{sc.name}</h3>
                
                {/* Description */}
                <p className="text-sm text-gray-400 mb-3">{sc.description}</p>

                {/* Stat modifiers */}
                <div className="space-y-1">
                  {sc.statModifiers.map((mod, i) => {
                    const isGood = mod.value > 0;
                    // Some stats are "bad" to increase
                    const badStats = ['narcissism', 'manipulation', 'evasiveness', 'entitlement', 'obliviousness', 'defensiveness'];
                    const actuallyGood = badStats.includes(mod.stat) ? !isGood : isGood;
                    
                    return (
                      <div
                        key={i}
                        className={`text-xs ${actuallyGood ? 'text-green-400' : 'text-red-400'}`}
                      >
                        {mod.value > 0 ? '+' : ''}{mod.value}/turn {mod.stat.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    );
                  })}
                </div>

                {/* Unlocks */}
                {(sc.unlocksCards || sc.unlocksEvents) && (
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <span className="text-xs text-purple-400">
                      ✨ Unlocks new content
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Skip option */}
          <div className="text-center">
            <button
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              Skip this draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
