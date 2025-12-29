import { AllStats, Partner } from '../types/game';

// This file is now minimal - GF abilities moved to gfAbilities.ts
// Stat modifiers are now from side characters

// Apply stat floor (kept for compatibility, but no longer tied to partners)
export function applyStatFloors(stats: AllStats, _partner: Partner | null): AllStats {
  // No longer partner-based - could be used for other floor effects in future
  return stats;
}

// Apply damage reduction (no longer partner-based)
export function applyDamageReduction(
  statChanges: Partial<AllStats>,
  _partner: Partner | null
): Partial<AllStats> {
  // No longer partner-based - could be used for other effects in future
  return statChanges;
}
