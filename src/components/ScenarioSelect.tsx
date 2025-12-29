import { scenarios } from '../data';
import { useGameStore } from '../game/store';
import { Scenario } from '../types/game';

interface ScenarioCardProps {
  scenario: Scenario;
  onSelect: () => void;
}

function ScenarioCard({ scenario, onSelect }: ScenarioCardProps) {
  return (
    <button
      onClick={onSelect}
      className="card hover:border-gray-500 transition-colors text-left w-full"
    >
      <h3 className="text-xl font-bold mb-2">{scenario.name}</h3>
      <p className="text-gray-400 text-sm mb-4">{scenario.description}</p>
      
      {/* Show notable starting conditions */}
      <div className="flex flex-wrap gap-2 text-xs">
        {scenario.startingModifiers?.map((mod, i) => (
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
    </button>
  );
}

export function ScenarioSelect() {
  const selectScenario = useGameStore((s) => s.selectScenario);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Choose Your Story</h1>
        <p className="text-gray-400">
          Every YouTuber has a past. What's yours?
        </p>
      </div>

      <div className="space-y-4">
        {scenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            onSelect={() => selectScenario(scenario)}
          />
        ))}
      </div>
    </div>
  );
}
