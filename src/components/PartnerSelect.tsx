import { partners } from '../data';
import { useGameStore } from '../game/store';
import { Partner } from '../types/game';

interface PartnerCardProps {
  partner: Partner;
  onSelect: () => void;
}

function PartnerCard({ partner, onSelect }: PartnerCardProps) {
  return (
    <button
      onClick={onSelect}
      className="card hover:border-gray-500 transition-colors text-left w-full"
    >
      <h3 className="text-xl font-bold mb-2">{partner.name}</h3>
      <p className="text-gray-400 text-sm mb-3">{partner.description}</p>
      
      {partner.specialAbility && (
        <p className="text-purple-400 text-sm mb-3 italic">
          ✨ {partner.specialAbility}
        </p>
      )}
      
      {/* Show stat modifiers */}
      {partner.statModifiers.length > 0 && (
        <div className="flex flex-wrap gap-2 text-xs">
          {partner.statModifiers.map((mod, i) => (
            <span
              key={i}
              className={`px-2 py-1 rounded ${
                mod.value > 0 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
              }`}
            >
              {mod.value > 0 ? '+' : ''}{mod.value}/turn {mod.stat}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

export function PartnerSelect() {
  const selectPartner = useGameStore((s) => s.selectPartner);
  const scenario = useGameStore((s) => s.scenario);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Choose Your Support</h1>
        <p className="text-gray-400">
          As <span className="text-white">{scenario?.name}</span>, who's in your corner?
        </p>
      </div>

      <div className="space-y-4">
        {partners.map((partner) => (
          <PartnerCard
            key={partner.id}
            partner={partner}
            onSelect={() => selectPartner(partner)}
          />
        ))}
      </div>
    </div>
  );
}
