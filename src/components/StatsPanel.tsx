import { useStats } from '../game/store';
import { StatBar } from './StatBar';
import { InventoryPanel } from './InventoryPanel';
import { GFAbilityButton } from './GFAbilityButton';
import { SideCharactersPanel } from './SideCharactersPanel';

export function StatsPanel() {
  const stats = useStats();

  return (
    <div className="space-y-4">
      {/* GF Ability */}
      <GFAbilityButton />
      
      {/* Side Characters */}
      <SideCharactersPanel />
      
      {/* Inventory */}
      <InventoryPanel compact />
      
      <div className="card space-y-6">
        {/* Core Stats - these end the game */}
        <div>
          <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-3">
            Vital Stats
          </h3>
          <div className="space-y-3">
            <StatBar label="Money" value={stats.money} color="green" critical />
            <StatBar label="Health" value={stats.health} color="red" critical />
            <StatBar label="Sanity" value={stats.sanity} color="purple" critical />
            <StatBar label="Motivation" value={stats.motivation} color="yellow" critical />
          </div>
        </div>

        {/* Secondary Stats */}
        <div>
          <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-3">
            Channel Stats
          </h3>
          <div className="space-y-3">
            <StatBar label="Algorithm" value={stats.youtubeAlgorithm} color="blue" />
            <StatBar label="Reactor Following" value={stats.reactionChannelFollowing} color="orange" />
            <StatBar label="Karma" value={stats.karma} color="purple" />
            <StatBar label="Relationships" value={stats.relationships} color="green" />
            <StatBar label="Credibility" value={stats.credibility} color="blue" />
          </div>
        </div>

        {/* Attributes - shown smaller */}
        <div>
          <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-3">
            Personality
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <StatBar label="Smug" value={stats.smug} size="sm" showValue={false} color="orange" />
            <StatBar label="Manipulation" value={stats.manipulation} size="sm" showValue={false} color="red" />
            <StatBar label="Narcissism" value={stats.narcissism} size="sm" showValue={false} color="purple" />
            <StatBar label="Evasiveness" value={stats.evasiveness} size="sm" showValue={false} color="yellow" />
            <StatBar label="Entitlement" value={stats.entitlement} size="sm" showValue={false} color="orange" />
            <StatBar label="Obliviousness" value={stats.obliviousness} size="sm" showValue={false} color="blue" />
            <StatBar label="Defensiveness" value={stats.defensiveness} size="sm" showValue={false} color="red" />
            <StatBar label="Accountability" value={stats.accountability} size="sm" showValue={false} color="green" />
          </div>
        </div>
      </div>
    </div>
  );
}
