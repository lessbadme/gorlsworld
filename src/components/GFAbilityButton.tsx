import { useState } from 'react';
import { useGameStore, useAbilityState } from '../game/store';
import { getGFAbility, isAbilityReady, getAbilityCooldownText } from '../game/gfAbilities';
import { useToast } from './Toast';

export function GFAbilityButton() {
  const partner = useGameStore(s => s.partner);
  const abilityState = useAbilityState();
  const useGFAbility = useGameStore(s => s.useGFAbility);
  const phase = useGameStore(s => s.phase);
  const { showInfo } = useToast();
  
  const [showConfirm, setShowConfirm] = useState(false);

  if (!partner || !abilityState) return null;

  const ability = getGFAbility(partner);
  if (!ability) return null;

  const ready = isAbilityReady(ability, abilityState);
  const cooldownText = getAbilityCooldownText(ability, abilityState);
  
  // Can only use during gameplay phases
  const canUse = ready && ['lifeEvent', 'video', 'postVideo'].includes(phase);

  const handleClick = () => {
    if (!canUse) return;
    
    if (showConfirm) {
      useGFAbility();
      showInfo(`${ability.emoji} ${ability.name} activated!`);
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(false);
  };

  // Format stat changes for display
  const statChanges = ability.statChanges 
    ? Object.entries(ability.statChanges).map(([stat, value]) => {
        const sign = value > 0 ? '+' : '';
        const color = value > 0 ? 'text-green-400' : 'text-red-400';
        const readableStat = stat.replace(/([A-Z])/g, ' $1').trim();
        return { stat: readableStat, display: `${sign}${value}`, color };
      })
    : [];

  return (
    <div className="mb-4">
      <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2">
        {partner.name}'s Ability
      </h3>
      
      <div
        onClick={canUse ? handleClick : undefined}
        className={`bg-gray-800 rounded-lg p-3 border transition-all ${
          showConfirm 
            ? 'border-purple-500 bg-purple-900/20' 
            : ready 
              ? 'border-purple-700 hover:border-purple-500 cursor-pointer' 
              : 'border-gray-700 opacity-60'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="text-2xl">{ability.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{ability.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded ${
                ready ? 'bg-purple-700 text-purple-200' : 'bg-gray-700 text-gray-400'
              }`}>
                {cooldownText}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">{ability.description}</p>
            
            {/* Stat changes preview */}
            {statChanges.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {statChanges.map(({ stat, display, color }) => (
                  <span key={stat} className={`text-xs ${color}`}>
                    {display} {stat}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Confirm/cancel UI */}
        {showConfirm && (
          <div className="mt-3 pt-3 border-t border-purple-700">
            <div className="text-xs text-purple-300 mb-2">Activate ability?</div>
            <div className="flex gap-2">
              <button
                onClick={handleClick}
                className="flex-1 px-2 py-1 bg-purple-600 hover:bg-purple-500 rounded text-xs font-medium transition-colors"
              >
                Activate
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
