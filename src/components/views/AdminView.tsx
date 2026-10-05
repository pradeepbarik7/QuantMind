import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Settings2,
  Terminal,
  Server,
  Activity,
  ToggleLeft,
  ToggleRight,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Download,
  Filter,
} from 'lucide-react';
import { UserProfile, SystemAuditLog, BiasModuleConfig } from '../../types';
import { MOCK_USERS, MOCK_AUDIT_LOGS, MOCK_BIAS_MODULES } from '../../data/mockMarketData';
import { Tooltip } from '../common/Tooltip';

interface AdminViewProps {
  currentUser: UserProfile;
  onSwitchToAdmin?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ currentUser, onSwitchToAdmin }) => {
  const [adminTab, setAdminTab] = useState<'modules' | 'users' | 'audit' | 'system'>('modules');
  const [biasModules, setBiasModules] = useState<BiasModuleConfig[]>(MOCK_BIAS_MODULES);
  const [users, setUsers] = useState(MOCK_USERS);
  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>(MOCK_AUDIT_LOGS);
  const [logFilter, setLogFilter] = useState<'ALL' | 'BIAS_GUARD' | 'MODEL_ENGINE' | 'SECURITY'>('ALL');
  const [globalProtectionArmed, setGlobalProtectionArmed] = useState(true);

  const isAdmin = currentUser.role === 'admin';

  // Toggle bias module state
  const handleToggleModule = (id: string) => {
    setBiasModules((prev) =>
      prev.map((mod) => (mod.id === id ? { ...mod, enabled: !mod.enabled } : mod))
    );
  };

  // Adjust module hurdle threshold
  const handleHurdleChange = (id: string, newHurdle: number) => {
    setBiasModules((prev) =>
      prev.map((mod) => (mod.id === id ? { ...mod, hurdlePercent: newHurdle } : mod))
    );
  };

  // Filtered audit logs
  const filteredLogs = auditLogs.filter((log) => {
    if (logFilter === 'ALL') return true;
    return log.category === logFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Administrative Console & System Governance
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Active Operator: <span className="font-semibold text-slate-200">{currentUser.name}</span> ({currentUser.role.toUpperCase()}) · Role-Based Access Control Enforced
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded text-xs overflow-x-auto">
          <button
            onClick={() => setAdminTab('modules')}
            className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer whitespace-nowrap ${
              adminTab === 'modules' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bias Shield Modules
          </button>
          <button
            onClick={() => setAdminTab('users')}
            className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer whitespace-nowrap ${
              adminTab === 'users' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            User RBAC ({users.length})
          </button>
          <button
            onClick={() => setAdminTab('audit')}
            className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer whitespace-nowrap ${
              adminTab === 'audit' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Intervention Audit ({auditLogs.length})
          </button>
          <button
            onClick={() => setAdminTab('system')}
            className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer whitespace-nowrap ${
              adminTab === 'system' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Service Daemons
          </button>
        </div>
      </div>

      {/* User Module Notice if not admin */}
      {!isAdmin && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-300">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              <strong>User Module Active</strong>: Currently logged in with user credentials (<code className="text-white font-mono">user@quantmind.io</code>). Administrative parameter modifications are locked in review mode.
            </span>
          </div>
          {onSwitchToAdmin && (
            <button
              onClick={onSwitchToAdmin}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded transition-colors whitespace-nowrap cursor-pointer shrink-0"
            >
              Elevate to Admin (admin@quantmind.io)
            </button>
          )}
        </div>
      )}

      {/* Global Safety State Banner */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${globalProtectionArmed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
            {globalProtectionArmed ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>System-Wide Behavioral Bias Guard:</span>
              <span className={`font-mono ${globalProtectionArmed ? 'text-emerald-400' : 'text-rose-400'}`}>
                {globalProtectionArmed ? 'ARMED & ENFORCING' : 'BYPASS ACTIVE (SIMULATION ONLY)'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {globalProtectionArmed
                ? 'All discretionary order overrides are strictly subjected to the 75% quantitative hurdle rate.'
                : 'Warning: Bias vetoes disabled. Discretionary decisions will execute without algorithmic validation.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setGlobalProtectionArmed(!globalProtectionArmed)}
          className={`px-4 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
            globalProtectionArmed
              ? 'bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-500/30'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          {globalProtectionArmed ? 'Disarm Bias Veto' : 'Arm Global Bias Guard'}
        </button>
      </div>

      {/* TAB 1: Behavioral Bias Modules */}
      {adminTab === 'modules' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Active Behavioral Bias Mitigation Controllers
              </h3>
              <p className="text-xs text-slate-400">
                Configure parameter thresholds for algorithmic intervention against specific emotional triggers.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400">
              5 of 5 Modules Configured
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {biasModules.map((module) => (
              <div
                key={module.id}
                className={`p-5 rounded-xl border transition-all ${
                  module.enabled
                    ? 'bg-slate-900/80 border-slate-800'
                    : 'bg-slate-950/40 border-slate-900 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{module.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {module.biasType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {module.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggleModule(module.id)}
                    className="cursor-pointer text-slate-400 hover:text-white shrink-0 mt-0.5"
                    title={module.enabled ? 'Disable module' : 'Enable module'}
                  >
                    {module.enabled ? (
                      <ToggleRight className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-slate-600" />
                    )}
                  </button>
                </div>

                {module.enabled && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Hurdle Threshold:</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {module.hurdlePercent}% Confidence
                      </span>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="90"
                      value={module.hurdlePercent}
                      onChange={(e) => handleHurdleChange(module.id, Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Sensitivity: <strong className="text-slate-300">{module.sensitivity}</strong></span>
                      <span>Action: <strong className="text-emerald-400">Veto & Log</strong></span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: User RBAC */}
      {adminTab === 'users' && (
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Authorized Research Personnel & Role Allocation</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage roles and permission levels for project reviewers, analysts, and students.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">Total Users: {users.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Institutional Affiliation</th>
                  <th className="py-2.5 px-3">Last Active</th>
                  <th className="py-2.5 px-3 text-right">Access Scope</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-200">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{u.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                          u.role === 'admin'
                            ? 'bg-purple-950 text-purple-400 border border-purple-500/30'
                            : u.role === 'user'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : u.role === 'analyst'
                            ? 'bg-sky-950 text-sky-400 border border-sky-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {u.affiliation}
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                      {u.lastActive}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {u.role === 'admin'
                          ? 'Full Root Access'
                          : u.role === 'user'
                          ? 'Trading & Analytics Module'
                          : 'Read / Backtest Only'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Algorithmic Intervention Audit Logs */}
      {adminTab === 'audit' && (
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Behavioral Bias Intervention Ledger (Audit Stream)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Every trade or input blocked by the systematic rules is permanently memorialized for academic compliance.
              </p>
            </div>

            {/* Filter */}
            <div className="flex items-center p-0.5 bg-slate-950 border border-slate-800 rounded text-xs">
              {(['ALL', 'BIAS_GUARD', 'MODEL_ENGINE', 'SECURITY'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setLogFilter(cat)}
                  className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                    logFilter === cat ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat === 'ALL' ? 'All Logs' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-lg bg-slate-950 border border-slate-850 hover:border-slate-800 space-y-1.5 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{log.timestamp}</span>
                    <span className="text-slate-700">|</span>
                    <span className="text-white font-semibold">{log.id}</span>
                    <span className="text-slate-700">|</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        log.severity === 'ALERT'
                          ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                          : log.severity === 'WARNING'
                          ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {log.severity}
                    </span>
                  </div>

                  {log.biasBlocked && (
                    <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-[11px] font-sans">
                      Mitigated: {log.biasBlocked}
                    </span>
                  )}
                </div>

                <div className="font-sans font-semibold text-slate-200 text-xs">
                  {log.event}
                </div>

                <p className="font-sans text-[11px] text-slate-400 leading-relaxed">
                  {log.details}
                </p>

                <div className="text-[10px] text-slate-500 pt-1">
                  Actor: <span className="text-slate-400">{log.user}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Service Daemons Health */}
      {adminTab === 'system' && (
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Microservice Workers & Compute Cluster Telemetry</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live status of sub-processes feeding market ticks, NLP embeddings, and HMM state transitions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-850 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-semibold">yFinance Ingestion</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-[11px] text-slate-400">NSE Tick Poller (500ms)</div>
              <div className="text-[10px] font-mono text-emerald-400">LATENCY: 11.2ms · NOMINAL</div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-850 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-semibold">HMM State Daemon</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-[11px] text-slate-400">hmmlearn Gaussian Engine</div>
              <div className="text-[10px] font-mono text-emerald-400">CONVERGED · LOG-L -412</div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-850 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-semibold">XGBoost Inference</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-[11px] text-slate-400">200 Estimators, Depth 5</div>
              <div className="text-[10px] font-mono text-emerald-400">BATCH TIME: 3.4ms</div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-850 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-semibold">FinBERT NLP Queue</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-[11px] text-slate-400">PyTorch Sentiment Worker</div>
              <div className="text-[10px] font-mono text-emerald-400">STREAM ACTIVE · 24 HEADLINES</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
