import React, { useState, useEffect } from 'react';
import { AssetSymbol, UserProfile } from './types';
import { ASSETS_DATA, MOCK_USERS } from './data/mockMarketData';
import { Navbar, NavTab } from './components/layout/Navbar';
import { HomeView } from './components/views/HomeView';
import { MarketAnalysisView } from './components/views/MarketAnalysisView';
import { AIPredictionView } from './components/views/AIPredictionView';
import { BacktestingView } from './components/views/BacktestingView';
import { RiskAnalyticsView } from './components/views/RiskAnalyticsView';
import { PipelineSettingsView } from './components/views/PipelineSettingsView';
import { AdminView } from './components/views/AdminView';
import { AuthScreen } from './components/auth/AuthScreen';
import { SignalDetailModal } from './components/modals/SignalDetailModal';
import { Footer } from './components/layout/Footer';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    // Check localStorage if available
    const saved = localStorage.getItem('quantmind_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [selectedAsset, setSelectedAsset] = useState<AssetSymbol>('NIFTY50');
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSignalModalOpen, setIsSignalModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('quantmind_user', JSON.stringify(user));
    showToast(`Welcome back, ${user.name}! Authenticated as ${user.role.toUpperCase()}.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('quantmind_user');
    setCurrentTab('home');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      showToast(`Systematic pipeline synchronized. HMM & XGBoost consensus re-verified for ${selectedAsset}.`);
    }, 850);
  };

  const handleSelectAssetAndAnalyze = (asset: AssetSymbol) => {
    setSelectedAsset(asset);
    setCurrentTab('market');
  };

  // If not logged in, display the professional Auth / Login / Signup Screen
  if (!currentUser) {
    return <AuthScreen onLoginSuccess={handleLogin} />;
  }

  const currentAssetData = ASSETS_DATA[selectedAsset];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar Contract */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        selectedAsset={selectedAsset}
        onSelectAsset={setSelectedAsset}
        isSimulating={isSimulating}
        onRunSimulation={handleRunSimulation}
        onOpenSignalModal={() => setIsSignalModalOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Toast alert banner */}
        {toastMessage && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-300 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200 shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-emerald-400 hover:text-white text-xs font-mono ml-3 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dynamic Screen Render */}
        {currentTab === 'home' && (
          <HomeView
            onSelectAssetAndAnalyze={handleSelectAssetAndAnalyze}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'market' && (
          <MarketAnalysisView
            selectedAsset={selectedAsset}
            onSelectAsset={setSelectedAsset}
            onOpenSignalModal={() => setIsSignalModalOpen(true)}
          />
        )}

        {currentTab === 'ai-sentiment' && (
          <AIPredictionView
            selectedAsset={selectedAsset}
            onSelectAsset={setSelectedAsset}
            onOpenSignalModal={() => setIsSignalModalOpen(true)}
          />
        )}

        {currentTab === 'backtest' && (
          <BacktestingView
            selectedAsset={selectedAsset}
            onSelectAsset={setSelectedAsset}
          />
        )}

        {currentTab === 'risk' && <RiskAnalyticsView />}

        {currentTab === 'architecture' && <PipelineSettingsView />}

        {currentTab === 'admin' && (
          <AdminView
            currentUser={currentUser}
            onSwitchToAdmin={() => handleLogin(MOCK_USERS[1])}
          />
        )}
      </main>

      {/* Detailed Signal Audit Modal */}
      <SignalDetailModal
        asset={currentAssetData}
        isOpen={isSignalModalOpen}
        onClose={() => setIsSignalModalOpen(false)}
      />

      {/* Comprehensive Academic, Policy & System Footer */}
      <Footer
        onSelectTab={setCurrentTab}
        activeOperatorName={currentUser.name}
      />
    </div>
  );
}
