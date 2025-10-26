
import React, { useMemo } from 'react';
import type { Trade } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface DashboardProps {
  trades: Trade[];
}

const StatCard: React.FC<{ title: string; value: string; colorClass: string }> = ({ title, value, colorClass }) => (
  <div className="bg-brand-surface p-4 rounded-lg shadow-md border border-white/10">
    <p className="text-sm text-brand-text-secondary">{title}</p>
    <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-brand-surface border border-white/10 rounded-md shadow-lg">
        <p className="label">{`Trade #${label}`}</p>
        <p className="intro" style={{ color: payload[0].color }}>{`Cumulative P&L : ${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};


const Dashboard: React.FC<DashboardProps> = ({ trades }) => {
  const stats = useMemo(() => {
    if (trades.length === 0) {
      return { totalPnl: 0, winRate: 0, totalTrades: 0, avgWin: 0, avgLoss: 0, profitFactor: 0 };
    }
    const wins = trades.filter(t => t.pnl > 0);
    const losses = trades.filter(t => t.pnl <= 0);
    const totalPnl = trades.reduce((acc, t) => acc + t.pnl, 0);
    const totalWinsPnl = wins.reduce((acc, t) => acc + t.pnl, 0);
    const totalLossesPnl = Math.abs(losses.reduce((acc, t) => acc + t.pnl, 0));

    return {
      totalPnl,
      winRate: (wins.length / trades.length) * 100,
      totalTrades: trades.length,
      avgWin: wins.length > 0 ? totalWinsPnl / wins.length : 0,
      avgLoss: losses.length > 0 ? totalLossesPnl / losses.length : 0,
      profitFactor: totalLossesPnl > 0 ? totalWinsPnl / totalLossesPnl : Infinity,
    };
  }, [trades]);
  
  const chartData = useMemo(() => {
    let cumulativePnl = 0;
    return [...trades].reverse().map((trade, index) => {
      cumulativePnl += trade.pnl;
      return {
        name: index + 1,
        pnl: cumulativePnl,
      };
    });
  }, [trades]);

  return (
    <section className="bg-brand-surface rounded-xl p-4 md:p-6 border border-white/10 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">Performance Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <StatCard title="Total P&L" value={`$${stats.totalPnl.toFixed(2)}`} colorClass={stats.totalPnl >= 0 ? 'text-brand-success' : 'text-brand-danger'} />
        <StatCard title="Win Rate" value={`${stats.winRate.toFixed(1)}%`} colorClass="text-brand-primary" />
        <StatCard title="Profit Factor" value={isFinite(stats.profitFactor) ? stats.profitFactor.toFixed(2) : 'N/A'} colorClass="text-brand-primary" />
        <StatCard title="Avg. Win" value={`$${stats.avgWin.toFixed(2)}`} colorClass="text-brand-success" />
        <StatCard title="Avg. Loss" value={`$${stats.avgLoss.toFixed(2)}`} colorClass="text-brand-danger" />
        <StatCard title="Total Trades" value={stats.totalTrades.toString()} colorClass="text-brand-text" />
      </div>
      <div className="h-80 w-full">
         <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
            <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#e5e7eb' }}/>
            <Area type="monotone" dataKey="pnl" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPnl)" name="Cumulative P&L" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default Dashboard;
