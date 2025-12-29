import { useGameStore, usePendingDraft } from './game/store';
import {
  GameHeader,
  ScenarioSelect,
  PartnerSelect,
  StatsPanel,
  VideoPhase,
  LifeEventPhase,
  PostVideoPhase,
  ResultsScreen,
  ToastContainer,
  SideCharacterDraft,
} from './components';

function App() {
  const phase = useGameStore((s) => s.phase);
  const pendingDraft = usePendingDraft();

  // Phases that show the stats panel on the side
  const showStatsPanel = !['scenarioSelect', 'partnerSelect', 'results'].includes(phase);

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <GameHeader />

      <div className="flex-1 flex">
        {/* Main content area */}
        <main className={`flex-1 flex flex-col ${showStatsPanel ? 'pr-80' : ''}`}>
          {phase === 'scenarioSelect' && <ScenarioSelect />}
          {phase === 'partnerSelect' && <PartnerSelect />}
          {phase === 'lifeEvent' && <LifeEventPhase />}
          {phase === 'video' && <VideoPhase />}
          {phase === 'postVideo' && <PostVideoPhase />}
          {phase === 'results' && <ResultsScreen />}
        </main>

        {/* Stats sidebar */}
        {showStatsPanel && (
          <aside className="fixed right-0 top-14 bottom-0 w-80 overflow-y-auto border-l border-gray-800 bg-gray-900 p-4">
            <StatsPanel />
          </aside>
        )}
      </div>

      {/* Side character draft modal */}
      {pendingDraft && <SideCharacterDraft />}

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
}

export default App;
