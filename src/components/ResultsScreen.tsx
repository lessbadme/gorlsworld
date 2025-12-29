import { useGameStore } from '../game/store';
import { CoreStats } from '../types/game';

const endReasonMessages: Record<keyof CoreStats, { title: string; description: string }> = {
  money: {
    title: 'Broke',
    description: 'The bills piled up. The sponsors left. You couldn\'t afford to keep the lights on.',
  },
  health: {
    title: 'Burnout Collapse',
    description: 'Your body gave out. The grind finally caught up with you.',
  },
  sanity: {
    title: 'Lost It',
    description: 'The comments, the drama, the constant performance... you snapped.',
  },
  motivation: {
    title: 'Gave Up',
    description: 'Why even bother? The passion is gone. You posted your last video.',
  },
};

export function ResultsScreen() {
  const endReason = useGameStore((s) => s.endReason);
  const turn = useGameStore((s) => s.turn);
  const scenario = useGameStore((s) => s.scenario);
  const resetGame = useGameStore((s) => s.resetGame);

  const ending = endReason ? endReasonMessages[endReason] : null;

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="card max-w-lg text-center">
        <div className="text-6xl mb-4">💀</div>
        <h2 className="text-3xl font-bold mb-2">{ending?.title || 'Game Over'}</h2>
        <p className="text-gray-400 mb-6">{ending?.description}</p>
        
        <div className="bg-gray-900 rounded-lg p-4 mb-6">
          <div className="text-sm text-gray-500 mb-1">You survived</div>
          <div className="text-4xl font-bold text-white">{turn - 1} weeks</div>
          <div className="text-sm text-gray-500 mt-1">as {scenario?.name}</div>
        </div>

        <button
          onClick={resetGame}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
