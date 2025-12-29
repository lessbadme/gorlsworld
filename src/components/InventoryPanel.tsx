import { useState } from 'react';
import { useGameStore, useItems } from '../game/store';
import { items as allItems, MAX_ITEMS, Item } from '../data/items';
import { useToast } from './Toast';

// Get item by ID
function getItemById(id: string): Item | undefined {
  return allItems.find(item => item.id === id);
}

// Get emoji for item
function getItemEmoji(itemId: string): string {
  const emojiMap: Record<string, string> = {
    'chili': '🌶️',
    'orange-chicken': '🍗',
    'lexapro': '💊',
    'energy-drink': '⚡',
    'weed-edible': '🍃',
    'cash-stash': '💵',
    'pr-consultant': '📞',
    'burner-phone': '📱',
  };
  return emojiMap[itemId] || '📦';
}

interface ItemCardProps {
  item: Item;
  onUse: () => void;
  disabled: boolean;
}

function ItemCard({ item, onUse, disabled }: ItemCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const { showItemUsed } = useToast();

  const handleClick = () => {
    if (showConfirm) {
      onUse();
      showItemUsed(item.name, item.useText);
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
  const statChanges = Object.entries(item.statChanges).map(([stat, value]) => {
    const sign = value > 0 ? '+' : '';
    const color = value > 0 ? 'text-green-400' : 'text-red-400';
    const readableStat = stat.replace(/([A-Z])/g, ' $1').trim();
    return { stat: readableStat, display: `${sign}${value}`, color };
  });

  return (
    <div
      className={`bg-gray-800 rounded-lg p-3 border transition-all ${
        showConfirm 
          ? 'border-yellow-500 bg-yellow-900/20' 
          : 'border-gray-700 hover:border-gray-600'
      } ${disabled ? 'opacity-50' : 'cursor-pointer'}`}
      onClick={disabled ? undefined : handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">{getItemEmoji(item.id)}</div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">{item.name}</div>
          <div className="text-xs text-gray-400 mt-0.5">{item.description}</div>
          
          {/* Stat changes */}
          <div className="flex flex-wrap gap-1 mt-2">
            {statChanges.map(({ stat, display, color }) => (
              <span key={stat} className={`text-xs ${color}`}>
                {display} {stat}
              </span>
            ))}
          </div>

          {/* Modifier info */}
          {item.modifier && (
            <div className="text-xs text-purple-400 mt-1">
              +{item.modifier.value}/turn {item.modifier.stat} for {item.modifier.duration} weeks
            </div>
          )}
        </div>
      </div>

      {/* Confirm/cancel UI */}
      {showConfirm && !disabled && (
        <div className="mt-3 pt-3 border-t border-yellow-700">
          <div className="text-xs text-yellow-300 mb-2">Use this item?</div>
          <div className="flex gap-2">
            <button
              onClick={handleClick}
              className="flex-1 px-2 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs font-medium transition-colors"
            >
              Use
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
  );
}

interface InventoryPanelProps {
  compact?: boolean;
}

export function InventoryPanel({ compact = false }: InventoryPanelProps) {
  const itemIds = useItems();
  const useItem = useGameStore(s => s.useItem);
  const phase = useGameStore(s => s.phase);
  
  // Can only use items during gameplay phases
  const canUseItems = ['lifeEvent', 'video', 'postVideo'].includes(phase);
  
  // Get actual item objects
  const items = itemIds.map(getItemById).filter((item): item is Item => item !== undefined);
  
  // Empty slots
  const emptySlots = MAX_ITEMS - items.length;

  if (compact) {
    // Compact view for sidebar
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-wider text-gray-500">
            Items
          </h3>
          <span className="text-xs text-gray-500">
            {items.length}/{MAX_ITEMS}
          </span>
        </div>
        
        {items.length === 0 ? (
          <div className="text-xs text-gray-600 italic py-2">
            No items
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, index) => (
              <ItemCard
                key={`${item.id}-${index}`}
                item={item}
                onUse={() => useItem(item.id)}
                disabled={!canUseItems}
              />
            ))}
          </div>
        )}
        
        {/* Empty slots indicator */}
        {emptySlots > 0 && items.length > 0 && (
          <div className="flex gap-1 mt-2">
            {Array.from({ length: emptySlots }).map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded border border-dashed border-gray-700 flex items-center justify-center"
              >
                <span className="text-gray-700 text-xs">+</span>
              </div>
            ))}
          </div>
        )}
        
        {!canUseItems && items.length > 0 && (
          <div className="text-xs text-gray-500 italic">
            Use items during gameplay
          </div>
        )}
      </div>
    );
  }

  // Full view (for modal or dedicated screen)
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Inventory</h2>
        <span className="text-sm text-gray-400">
          {items.length}/{MAX_ITEMS} slots
        </span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🎒</div>
          <p>No items yet</p>
          <p className="text-sm mt-1">Find items through events and choices</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((item, index) => (
            <ItemCard
              key={`${item.id}-${index}`}
              item={item}
              onUse={() => useItem(item.id)}
              disabled={!canUseItems}
            />
          ))}
        </div>
      )}

      {/* Empty slots */}
      {emptySlots > 0 && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
          {Array.from({ length: emptySlots }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-16 rounded-lg border border-dashed border-gray-700 flex items-center justify-center"
            >
              <span className="text-gray-600">Empty</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
