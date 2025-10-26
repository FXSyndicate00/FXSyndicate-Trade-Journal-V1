import React, { useState, useEffect } from 'react';
import type { Trade, TradeDirection } from '../types';
import { allTradableAssets } from '../lib/tradableAssets';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trade: Omit<Trade, 'id' | 'analysis'>, imageFile?: File) => void;
  trade: Trade | null;
  isLoading: boolean;
  error: string | null;
}

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string, list?: string }> = ({ label, list, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-brand-text-secondary mb-1">{label}</label>
        <input {...props} list={list} className="w-full bg-brand-bg border border-white/20 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none" />
    </div>
);

const TradeModal: React.FC<TradeModalProps> = ({ isOpen, onClose, onSave, trade, isLoading, error }) => {
  const [pair, setPair] = useState('');
  const [date, setDate] = useState('');
  const [direction, setDirection] = useState<TradeDirection>('Long');
  const [entry, setEntry] = useState('');
  const [exit, setExit] = useState('');
  const [pnl, setPnl] = useState('');
  const [notes, setNotes] = useState('');
  const [imageFile, setImageFile] = useState<File | undefined>();

  useEffect(() => {
    if (trade) {
      setPair(trade.pair);
      setDate(trade.date);
      setDirection(trade.direction);
      setEntry(trade.entry.toString());
      setExit(trade.exit.toString());
      setPnl(trade.pnl.toString());
      setNotes(trade.notes || '');
      setImageFile(undefined);
    } else {
      // Reset form for new trade
      const today = new Date().toISOString().split('T')[0];
      setPair('');
      setDate(today);
      setDirection('Long');
      setEntry('');
      setExit('');
      setPnl('');
      setNotes('');
      setImageFile(undefined);
    }
  }, [trade, isOpen]);

  const handlePnlCalculation = () => {
    const entryNum = parseFloat(entry);
    const exitNum = parseFloat(exit);
    if (!isNaN(entryNum) && !isNaN(exitNum)) {
      const calculatedPnl = direction === 'Long' ? exitNum - entryNum : entryNum - exitNum;
      setPnl(calculatedPnl.toFixed(2));
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    const tradeData = {
      pair,
      date,
      direction,
      entry: parseFloat(entry),
      exit: parseFloat(exit),
      pnl: parseFloat(pnl),
      notes,
    };
    onSave(tradeData, imageFile);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-brand-surface rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-2xl font-bold text-white mb-6">{trade ? 'Edit Trade' : 'Add New Trade'}</h2>
          
          <div className="space-y-4">
            <InputField 
              label="Pair (e.g., EUR/USD)" 
              type="text" value={pair} 
              onChange={(e) => setPair(e.target.value.toUpperCase())} 
              required 
              list="tradable-assets-list"
            />
            <datalist id="tradable-assets-list">
              {allTradableAssets.map(asset => (
                <option key={asset} value={asset} />
              ))}
            </datalist>

            <InputField label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            
            <div>
              <label className="block text-sm font-medium text-brand-text-secondary mb-1">Direction</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setDirection('Long')} className={`flex-1 py-2 rounded-md transition-colors ${direction === 'Long' ? 'bg-brand-success text-white' : 'bg-brand-bg hover:bg-white/10'}`}>Long</button>
                <button type="button" onClick={() => setDirection('Short')} className={`flex-1 py-2 rounded-md transition-colors ${direction === 'Short' ? 'bg-brand-danger text-white' : 'bg-brand-bg hover:bg-white/10'}`}>Short</button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField label="Entry Price" type="number" step="any" value={entry} onChange={(e) => setEntry(e.target.value)} onBlur={handlePnlCalculation} required />
              <InputField label="Exit Price" type="number" step="any" value={exit} onChange={(e) => setExit(e.target.value)} onBlur={handlePnlCalculation} required />
            </div>

            <InputField label="Profit / Loss ($)" type="number" step="any" value={pnl} onChange={(e) => setPnl(e.target.value)} required />

            <div>
              <label className="block text-sm font-medium text-brand-text-secondary mb-1">Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full bg-brand-bg border border-white/20 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none"></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-text-secondary mb-1">Screenshot (Optional)</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-brand-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-primary/20 file:text-brand-primary hover:file:bg-brand-primary/30" />
            </div>

            {error && <p className="text-sm text-brand-danger text-center bg-red-500/10 p-2 rounded-md">{error}</p>}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-brand-text-secondary bg-brand-bg hover:bg-white/10 transition-colors">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-6 py-2 rounded-md text-white bg-brand-primary hover:bg-blue-500 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center">
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : 'Save Trade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeModal;