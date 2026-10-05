import React from 'react';
import { ShieldCheck, Cpu, RefreshCw, LogOut, ShieldAlert, User } from 'lucide-react';
import { AssetSymbol, UserProfile } from '../../types';
import { ASSETS_DATA } from '../../data/mockMarketData';

export type NavTab = 'home' | 'market' | 'ai-sentiment' | 'backtest' | 'risk' | 'architecture' | 'admin';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  selectedAsset: AssetSymbol;
  onSelectAsset: (asset: AssetSymbol) => void;
  isSimulating: boolean;
  onRunSimulation: () => void;
  onOpenSignalModal: () => void;
  currentUser: UserProfile;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  selectedAsset,
  onSelectAsset,
  isSimulating,
  onRunSimulation,
  onOpenSignalModal,
  currentUser,
  onLogout,
}) => {
  const navLinks: { id: NavTab; label: string; badge?: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'market', label: 'Market Analysis' },
    { id: 'ai-sentiment', label: 'AI & Sentiment' },
    { id: 'backtest', label: 'Backtesting' },
    { id: 'risk', label: 'Risk Analytics' },
    { id: 'architecture', label: 'Pipeline Architecture' },
    { id: 'admin', label: 'Admin Console', badge: 'RBAC' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      {/* Main Top Bar Contract: Zone 1 (Brand) — Zone 2 (Nav links) — Zone 3 (Actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('home')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>QuantMind</span>
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onSelectTab(link.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions (Asset selector, Signal Audit, User Menu, Logout) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Asset Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded px-2 py-1">
            <span className="text-[11px] text-slate-400 hidden sm:inline">Asset:</span>
            <select
              value={selectedAsset}
              onChange={(e) => onSelectAsset(e.target.value as AssetSymbol)}
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
            >
              {Object.keys(ASSETS_DATA).map((sym) => (
                <option key={sym} value={sym} className="bg-slate-900 text-slate-200">
                  {sym}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Signal Inspection */}
          <button
            onClick={onOpenSignalModal}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded transition-colors cursor-pointer"
            title="Inspect current signal derivation & behavioral bias rules"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Signal Audit</span>
          </button>

          {/* Refresh / Re-compute */}
          <button
            onClick={onRunSimulation}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded transition-colors disabled:opacity-50 cursor-pointer shadow-sm shadow-emerald-900/30"
            title="Re-run systematic pipeline on latest tick data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isSimulating ? 'Computing...' : 'Sync'}</span>
          </button>

          {/* User Profile Badge */}
          <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-800">
            <button
              onClick={() => onSelectTab('admin')}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs cursor-pointer transition-colors"
              title="View Admin Profile & Permissions"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                {currentUser.name.charAt(0)}
              </div>
              <span className="hidden lg:inline text-slate-200 font-medium text-[11px] truncate max-w-[100px]">
                {currentUser.name.split(' ')[0]}
              </span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-800 text-slate-400 uppercase hidden sm:inline">
                {currentUser.role}
              </span>
            </button>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-900 transition-colors cursor-pointer"
              title="Sign Out of QuantMind"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sub-nav for tablet / mobile */}
      <div className="xl:hidden border-t border-slate-850 px-3 py-1.5 overflow-x-auto flex items-center gap-1.5 bg-slate-950">
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => onSelectTab(link.id)}
            className={`px-2.5 py-1 text-[11px] font-medium rounded whitespace-nowrap flex items-center gap-1 ${
              currentTab === link.id
                ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{link.label}</span>
            {link.badge && (
              <span className="text-[8px] font-mono px-1 rounded bg-purple-950 text-purple-300">
                {link.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </header>
  );
};
