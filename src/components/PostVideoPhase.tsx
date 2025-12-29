import { useGameStore, useStats } from '../game/store';
import { getPartnerAbility, getPartnerBonuses } from '../game/partnerAbilities';

export function PostVideoPhase() {
  const stats = useStats();
  const modifiers = useGameStore(s => s.modifiers);
  const partner = useGameStore(s => s.partner);
  const turn = useGameStore(s => s.turn);
  const endTurn = useGameStore(s => s.endTurn);
  const advancePhase = useGameStore(s => s.advancePhase);

  // Calculate what will happen at end of turn
  const rateModifiers = modifiers.filter(m => m.type === 'rate');
  const partnerAbility = getPartnerAbility(partner);
  const partnerBonuses = getPartnerBonuses(partner);

  const handleEndWeek = () => {
    endTurn();
    advancePhase();
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="card max-w-lg">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">📊</div>
          <h2 className="text-2xl font-bold">End of Week {turn}</h2>
          <p className="text-gray-400">Your stats will adjust based on ongoing effects.</p>
        </div>

        {/* Show partner ability if active */}
        {partnerAbility && partnerAbility.type !== 'none' && (
          <div className="mb-6">
            <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-3">
              {partner?.name}'s Effect
            </h3>
            <div className="bg-purple-900/30 border border-purple-800 rounded-lg p-3">
              <p className="text-purple-300 text-sm">
                ✨ {partnerAbility.description}
              </p>
            </div>
          </div>
        )}

        {/* Show active modifiers */}
        {rateModifiers.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-3">
              Ongoing Effects
            </h3>
            <div className="space-y-2">
              {rateModifiers.map(mod => (
                <div
                  key={mod.id}
                  className="flex justify-between items-center bg-gray-800 rounded px-3 py-2"
                >
                  <span className="text-gray-300">
                    {mod.source.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase())}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className={mod.value > 0 ? 'text-green-400' : 'text-red-400'}>
                      {mod.value > 0 ? '+' : ''}{mod.value} {mod.stat}
                    </span>
                    <span className="text-xs text-gray-500">
                      {mod.duration === 'permanent' ? '∞' : `${mod.duration} weeks`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preview stat changes */}
        <div className="mb-6">
          <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-3">
            Stat Changes Preview
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {/* Rate modifiers */}
            {rateModifiers.map(mod => {
              const currentValue = stats[mod.stat];
              const newValue = Math.max(0, Math.min(100, currentValue + mod.value));
              const willChange = newValue !== currentValue;
              
              if (!willChange) return null;
              
              return (
                <div key={mod.id} className="flex justify-between bg-gray-800 rounded px-2 py-1">
                  <span className="text-gray-400 capitalize">
                    {mod.stat.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span>
                    <span className="text-gray-500">{Math.round(currentValue)}</span>
                    <span className="text-gray-600 mx-1">→</span>
                    <span className={mod.value > 0 ? 'text-green-400' : 'text-red-400'}>
                      {Math.round(newValue)}
                    </span>
                  </span>
                </div>
              );
            })}
            
            {/* Partner bonuses */}
            {Object.entries(partnerBonuses).map(([stat, value]) => {
              const currentValue = stats[stat as keyof typeof stats];
              const newValue = Math.max(0, Math.min(100, currentValue + value));
              
              return (
                <div key={`partner-${stat}`} className="flex justify-between bg-purple-900/30 rounded px-2 py-1">
                  <span className="text-purple-300 capitalize">
                    {stat.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span>
                    <span className="text-gray-500">{Math.round(currentValue)}</span>
                    <span className="text-gray-600 mx-1">→</span>
                    <span className="text-purple-400">
                      {Math.round(newValue)}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
          
          {rateModifiers.length === 0 && Object.keys(partnerBonuses).length === 0 && (
            <p className="text-gray-500 text-sm italic">
              No ongoing effects. Stats holding steady.
            </p>
          )}
        </div>

        {/* Warning if stats are critical */}
        {(stats.health <= 25 || stats.sanity <= 25 || stats.money <= 25 || stats.motivation <= 25) && (
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-300 text-sm">
              ⚠️ Warning: One or more vital stats are critically low. 
              If any reaches zero, the game ends.
              {partnerAbility?.type === 'statFloor' && partnerAbility.stat && (
                <span className="block mt-1 text-purple-300">
                  (But {partner?.name} keeps your {partnerAbility.stat} above {partnerAbility.value}!)
                </span>
              )}
            </p>
          </div>
        )}

        <button
          onClick={handleEndWeek}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors font-medium"
        >
          End Week {turn}
        </button>
      </div>
    </div>
  );
}
