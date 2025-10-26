
import React from 'react';
import type { Trade } from '../types';
import TradeCard from './TradeCard';
import { PlusIcon } from './icons/PlusIcon';

interface TradeListProps {
  trades: Trade[];
  onEdit: (trade: Trade) => void;
  onDelete: (id: string) => void;
  onAddTrade: () => void;
}

const TradeList: React.FC<TradeListProps> = ({ trades, onEdit, onDelete, onAddTrade }) => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 text-white">Trade History</h2>
      {trades.length === 0 ? (
        <div className="text-center py-12 bg-brand-surface rounded-lg border border-dashed border-white/20 flex flex-col items-center justify-center">
          <p className="text-lg text-brand-text-secondary mb-2">Your journal is empty.</p>
          <p className="text-sm text-brand-text-secondary/70 mb-6">Log your first trade to get started.</p>
          <button
            onClick={onAddTrade}
            className="inline-flex items-center gap-2 bg-brand-primary hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Log First Trade</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {trades.map(trade => (
            <TradeCard key={trade.id} trade={trade} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </section>
  );
};

export default TradeList;
