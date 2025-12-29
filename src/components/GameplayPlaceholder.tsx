import { useGameStore } from '../game/store';

export function GameplayPlaceholder() {
  const phase = useGameStore((s) => s.phase);
  const advancePhase = useGameStore((s) => s.advancePhase);
  const endTurn = useGameStore((s) => s.endTurn);

  const handleNext = () => {
    if (phase === 'postVideo') {
      endTurn();
    }
    advancePhase();
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="card max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">
          {phase === 'lifeEvent' && '🎲 Life Event Phase'}
          {phase === 'video' && '🎬 Video Phase'}
          {phase === 'postVideo' && '📊 End of Week'}
        </h2>
        <p className="text-gray-400 mb-6">
          {phase === 'lifeEvent' && 'Something happens in your life outside of YouTube...'}
          {phase === 'video' && 'Time to make content. What kind of video will you post?'}
          {phase === 'postVideo' && 'The week ends. Your stats adjust based on your choices.'}
        </p>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
        >
          {phase === 'postVideo' ? 'Start Next Week' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
