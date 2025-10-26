
import React, { useState } from 'react';
import type { Trade } from '../types';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';
import { BrainIcon } from './icons/BrainIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { StarIcon } from './icons/StarIcon';


const AnalysisSection: React.FC<{ analysis: NonNullable<Trade['analysis']> }> = ({ analysis }) => (
    <div className="mt-4 pt-4 border-t border-white/10 bg-black/20 p-4 rounded-b-lg -m-4 md:-m-6 mt-4">
        <h4 className="text-lg font-semibold flex items-center gap-2 text-brand-primary mb-3">
            <BrainIcon className="h-5 w-5"/> AI Trade Analysis
        </h4>
        <div className="flex items-baseline mb-3">
            <p className="font-bold text-white mr-2">Overall Rating:</p>
            <div className="flex items-center">
                {[...Array(10)].map((_, i) => (
                    <StarIcon key={i} className={`h-5 w-5 ${i < analysis.overallRating ? 'text-yellow-400' : 'text-gray-600'}`} />
                ))}
            </div>
            <span className="ml-2 font-mono text-sm text-brand-text-secondary">({analysis.overallRating}/10)</span>
        </div>
        <p className="text-sm italic text-brand-text-secondary mb-4">{analysis.summary}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
                <h5 className="font-semibold text-brand-success mb-2">Strengths</h5>
                <ul className="list-disc list-inside space-y-1 text-brand-text-secondary">
                    {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
            </div>
            <div>
                <h5 className="font-semibold text-brand-danger mb-2">Weaknesses</h5>
                <ul className="list-disc list-inside space-y-1 text-brand-text-secondary">
                    {analysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
            </div>
            <div>
                <h5 className="font-semibold text-brand-secondary mb-2">Improvements</h5>
                <ul className="list-disc list-inside space-y-1 text-brand-text-secondary">
                    {analysis.potentialImprovements.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
            </div>
        </div>
    </div>
);


const TradeCard: React.FC<{ trade: Trade; onEdit: (trade: Trade) => void; onDelete: (id: string) => void; }> = ({ trade, onEdit, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isWin = trade.pnl >= 0;

    return (
        <div className="bg-brand-surface rounded-lg p-4 md:p-6 border border-white/10 shadow-lg transition-all duration-300">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className={`w-2 h-16 rounded-full ${isWin ? 'bg-brand-success' : 'bg-brand-danger'}`}></div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs font-bold rounded ${trade.direction === 'Long' ? 'bg-green-500/20 text-brand-success' : 'bg-red-500/20 text-brand-danger'}`}>{trade.direction}</span>
                            <h3 className="text-lg font-bold text-white">{trade.pair}</h3>
                        </div>
                        <p className="text-sm text-brand-text-secondary">{new Date(trade.date).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 md:gap-6">
                    <div className="text-center md:text-left">
                        <p className="text-sm text-brand-text-secondary">P&L</p>
                        <p className={`text-lg font-bold ${isWin ? 'text-brand-success' : 'text-brand-danger'}`}>
                            {isWin ? '+' : ''}${trade.pnl.toFixed(2)}
                        </p>
                    </div>
                     <div className="text-center md:text-left">
                        <p className="text-sm text-brand-text-secondary">Entry / Exit</p>
                        <p className="text-sm font-mono text-white">{trade.entry} &rarr; {trade.exit}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(trade)} className="p-2 text-brand-text-secondary hover:text-brand-primary transition-colors"><EditIcon className="h-5 w-5" /></button>
                    <button onClick={() => onDelete(trade.id)} className="p-2 text-brand-text-secondary hover:text-brand-danger transition-colors"><TrashIcon className="h-5 w-5" /></button>
                    <button onClick={() => setIsExpanded(!isExpanded)} className={`p-2 text-brand-text-secondary hover:text-white transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}><ChevronDownIcon className="h-5 w-5" /></button>
                </div>
            </div>

            {isExpanded && (
                 <div className="mt-4 pt-4 border-t border-white/10">
                    {trade.notes && <p className="mb-4 text-brand-text-secondary italic">"{trade.notes}"</p>}
                    {trade.analysis ? (
                        <AnalysisSection analysis={trade.analysis} />
                    ) : (
                         <div className="text-center py-4">
                            <p className="text-brand-text-secondary">No AI analysis available for this trade.</p>
                        </div>
                    )}
                 </div>
            )}
        </div>
    );
};

export default TradeCard;
