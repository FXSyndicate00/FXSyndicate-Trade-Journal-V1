
import React, { useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Trade } from './types';
import Dashboard from './components/Dashboard';
import TradeList from './components/TradeList';
import TradeModal from './components/TradeModal';
import { PlusIcon } from './components/icons/PlusIcon';
import { analyzeTrade } from './services/geminiService';
import { Logo } from './components/icons/Logo';

const App: React.FC = () => {
  const [trades, setTrades] = useLocalStorage<Trade[]>('trades', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenModal = (trade: Trade | null = null) => {
    setEditingTrade(trade);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingTrade(null);
    setIsModalOpen(false);
  };

  const handleSaveTrade = useCallback(async (trade: Omit<Trade, 'id' | 'analysis'>, imageFile?: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const analysis = await analyzeTrade(trade, imageFile);

      if (editingTrade) {
        setTrades(prev => prev.map(t => t.id === editingTrade.id ? { ...t, ...trade, analysis } : t));
      } else {
        const newTrade: Trade = {
          id: Date.now().toString(),
          ...trade,
          analysis,
        };
        setTrades(prev => [newTrade, ...prev]);
      }
      handleCloseModal();
    } catch (err) {
      console.error("Failed to save trade:", err);
      setError('Failed to get AI analysis. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [editingTrade, setTrades]);

  const handleDeleteTrade = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      setTrades(prev => prev.filter(trade => trade.id !== id));
    }
  }, [setTrades]);
  
  const sortedTrades = useMemo(() => {
    return [...trades].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [trades]);

  return (
    <div className="min-h-screen bg-brand-bg font-sans text-brand-text">
      <header className="bg-brand-surface/50 backdrop-blur-sm sticky top-0 z-20 border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-8 text-brand-primary" />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              FX SYNDICATE <span className="text-brand-text-secondary">TRADE JOURNAL</span>
            </h1>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="hidden md:inline-flex items-center gap-2 bg-brand-primary hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
            aria-label="Log New Trade"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Log Trade</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6 space-y-6">
        <Dashboard trades={trades} />
        <TradeList 
          trades={sortedTrades} 
          onEdit={handleOpenModal} 
          onDelete={handleDeleteTrade} 
          onAddTrade={() => handleOpenModal()} 
        />
      </main>

      <button
        onClick={() => handleOpenModal()}
        className="fixed bottom-6 right-6 bg-brand-primary hover:bg-blue-500 text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 z-30"
        aria-label="Add New Trade"
      >
        <PlusIcon className="h-8 w-8" />
      </button>

      {isModalOpen && (
        <TradeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveTrade}
          trade={editingTrade}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
};

export default App;
