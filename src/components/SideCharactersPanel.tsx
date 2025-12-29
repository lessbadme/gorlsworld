import { useSideCharacters } from '../game/store';
import { getSideCharacterById, rarityColors, DRAFT_CONFIG } from '../data/sideCharacters';

export function SideCharactersPanel() {
  const sideCharacterIds = useSideCharacters();
  
  const sideCharacters = sideCharacterIds
    .map(getSideCharacterById)
    .filter((sc): sc is NonNullable<typeof sc> => sc !== undefined);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs uppercase tracking-wider text-gray-500">
          Side Characters
        </h3>
        <span className="text-xs text-gray-500">
          {sideCharacters.length}/{DRAFT_CONFIG.maxSideCharacters}
        </span>
      </div>

      {sideCharacters.length === 0 ? (
        <div className="text-xs text-gray-600 italic py-2">
          None yet - drafts happen on turns {DRAFT_CONFIG.draftTurns.join(', ')}
        </div>
      ) : (
        <div className="space-y-2">
          {sideCharacters.map(sc => (
            <div
              key={sc.id}
              className="bg-gray-800 rounded-lg p-2 border border-gray-700"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{sc.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{sc.name}</span>
                    <span className={`text-xs ${rarityColors[sc.rarity]}`}>
                      {sc.rarity}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {sc.statModifiers.slice(0, 2).map((mod, i) => (
                      <span key={i}>
                        {i > 0 && ', '}
                        {mod.value > 0 ? '+' : ''}{mod.value} {mod.stat}
                      </span>
                    ))}
                    {sc.statModifiers.length > 2 && '...'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty slot indicators */}
      {sideCharacters.length < DRAFT_CONFIG.maxSideCharacters && sideCharacters.length > 0 && (
        <div className="flex gap-1 mt-2">
          {Array.from({ length: DRAFT_CONFIG.maxSideCharacters - sideCharacters.length }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-8 rounded border border-dashed border-gray-700 flex items-center justify-center"
            >
              <span className="text-gray-700 text-xs">Empty</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
