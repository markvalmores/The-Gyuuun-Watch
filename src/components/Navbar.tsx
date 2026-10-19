import React from 'react';
import { 
  Watch, 
  Palette, 
  Clock, 
  Activity, 
  Bluetooth, 
  Sparkles, 
  RotateCw, 
  User as UserIcon,
  Zap,
  Wrench,
  Sliders
} from 'lucide-react';
import { WatchDevice } from '../types/watch';
import { SmartWatchModel } from '../data/watchCatalogue';
import { User } from 'firebase/auth';

interface NavbarProps {
  activeTab: 'dashboard' | 'studio' | 'settings' | 'pairing' | 'utilities';
  setActiveTab: (tab: 'dashboard' | 'studio' | 'settings' | 'pairing' | 'utilities') => void;
  device: WatchDevice;
  currentModel: SmartWatchModel;
  onOpenModelPicker: () => void;
  onSync: () => void;
  isSyncing: boolean;
  currentUser: User | null;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  device,
  currentModel,
  onOpenModelPicker,
  onSync,
  isSyncing,
  currentUser,
  onOpenAuth,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4 sm:gap-8">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-fuchsia-600 via-pink-500 to-cyan-400 p-0.5 shadow-lg shadow-pink-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Watch className="w-5 h-5 text-pink-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-pink-200 to-cyan-300 bg-clip-text text-transparent whitespace-nowrap">
                  The Gyuuun Watch
                </span>
                <span className="text-[10px] font-semibold tracking-wider px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30 whitespace-nowrap">
                  Usagyuun VTuber
                </span>
              </div>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 sm:gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'dashboard'
                  ? 'bg-pink-600/20 text-pink-300 border border-pink-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-4 h-4" />
              Activity & Health
            </button>

            <button
              onClick={() => setActiveTab('studio')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'studio'
                  ? 'bg-pink-600/20 text-pink-300 border border-pink-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Palette className="w-4 h-4" />
              Wallpaper Studio
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'settings'
                  ? 'bg-pink-600/20 text-pink-300 border border-pink-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Clock className="w-4 h-4" />
              Time & Display
            </button>

            <button
              onClick={() => setActiveTab('pairing')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'pairing'
                  ? 'bg-pink-600/20 text-pink-300 border border-pink-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Bluetooth className="w-4 h-4" />
              Pair & Scan
            </button>

            <button
              onClick={() => setActiveTab('utilities')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'utilities'
                  ? 'bg-pink-600/20 text-pink-300 border border-pink-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Wrench className="w-4 h-4" />
              Timer & OTA
            </button>
          </nav>

          {/* Zone 3: Model Picker Trigger & Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            
            {/* Live Device Battery Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300">
              <span className={`w-2 h-2 rounded-full ${device.isCharging ? 'bg-yellow-400 animate-ping' : 'bg-emerald-400'}`} />
              <span className="font-mono">{device.batteryLevel}%</span>
              <span className="text-[10px] text-slate-500 font-semibold">{device.isCharging ? '⚡' : '🔋'}</span>
            </div>

            {/* 34 Models Catalogue Button */}
            <button
              onClick={onOpenModelPicker}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-pink-300 font-bold text-xs border border-slate-700 shadow-sm transition-all"
              title="Change Smart Watch Model (34 Models)"
            >
              <Sliders className="w-3.5 h-3.5 text-pink-400" />
              <span className="hidden sm:inline truncate max-w-[120px]">{currentModel.name}</span>
              <span className="text-[10px] font-mono bg-pink-500/20 px-1 py-0.2 rounded text-pink-200">34</span>
            </button>

            {/* Sync Button */}
            <button
              onClick={onSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors disabled:opacity-50"
              title="Sync watch state & health data"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>

            {/* User Profile Button */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium text-xs hover:opacity-90 transition-opacity shadow-md shadow-pink-500/20"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline truncate max-w-[100px]">
                {currentUser ? (currentUser.displayName || 'Account') : 'Cloud Sync'}
              </span>
            </button>
          </div>

        </div>

        {/* Mobile Tab Navigation Strip */}
        <div className="flex lg:hidden overflow-x-auto gap-2 py-2 border-t border-slate-800 no-scrollbar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${
              activeTab === 'dashboard' ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Activity
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${
              activeTab === 'studio' ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Palette className="w-3.5 h-3.5" /> Wallpapers
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${
              activeTab === 'settings' ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Time & Display
          </button>
          <button
            onClick={() => setActiveTab('pairing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${
              activeTab === 'pairing' ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Bluetooth className="w-3.5 h-3.5" /> Pair QR / BLE
          </button>
          <button
            onClick={() => setActiveTab('utilities')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${
              activeTab === 'utilities' ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" /> Timer & OTA
          </button>
        </div>
      </div>
    </header>
  );
};
