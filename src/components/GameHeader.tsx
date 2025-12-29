import { useGameStore } from '../game/store';

const phaseLabels: Record<string, string> = {
  scenarioSelect: 'Choose Your Story',
  partnerSelect: 'Choose Your Support',
  lifeEvent: 'Life Happens',
  video: 'Make a Video',
  postVideo: 'End of Week',
  results: 'Game Over',
};

export function GameHeader() {
  const phase = useGameStore((s) => s.phase);
  const turn = useGameStore((s) => s.turn);
  const videosThisTurn = useGameStore((s) => s.videosThisTurn);
  const scenario = useGameStore((s) => s.scenario);
  const partner = useGameStore((s) => s.partner);

  const showTurnInfo = phase !== 'scenarioSelect' && phase !== 'partnerSelect' && phase !== 'results';

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">BitLyfe</h1>
          {scenario && (
            <span className="text-sm text-gray-400">
              {scenario.name}
              {partner && ` + ${partner.name}`}
            </span>
          )}
        </div>

        <div className="flex items-center gap-6">
          {showTurnInfo && (
            <>
              <div className="text-sm">
                <span className="text-gray-500">Week </span>
                <span className="text-white font-mono">{turn}</span>
              </div>
              
              {phase === 'video' && (
                <div className="text-sm">
                  <span className="text-gray-500">Video </span>
                  <span className="text-white font-mono">{videosThisTurn + 1}/3</span>
                </div>
              )}
            </>
          )}
          
          <div className="text-sm px-3 py-1 bg-gray-800 rounded-full">
            {phaseLabels[phase] || phase}
          </div>
        </div>
      </div>
    </header>
  );
}
