import React, { useState } from 'react';
import { TimeSettings, TimeFormat } from '../types/watch';
import { 
  Clock, 
  Sun, 
  Moon, 
  Globe, 
  RotateCw, 
  Eye, 
  Check, 
  Sliders, 
  Sparkles, 
  Save 
} from 'lucide-react';

interface TimeDisplaySettingsProps {
  settings: TimeSettings;
  onUpdateSettings: (newSettings: TimeSettings) => void;
  onSyncTimeWithWatch: () => void;
}

export const TimeDisplaySettings: React.FC<TimeDisplaySettingsProps> = ({
  settings,
  onUpdateSettings,
  onSyncTimeWithWatch,
}) => {
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleSyncTime = () => {
    onSyncTimeWithWatch();
    setSyncStatus('Time synchronized with browser RTC clock!');
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const timeoutOptions = [
    { label: '5 Sec', value: 5 },
    { label: '10 Sec', value: 10 },
    { label: '15 Sec', value: 15 },
    { label: '30 Sec', value: 30 },
    { label: 'Always On', value: 0 },
  ];

  const timezones = [
    'Asia/Tokyo',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Singapore',
    'Australia/Sydney',
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-pink-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Time & Display Settings</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure 12/24 hour time format, screen brightness, Always-On Display, and wake gestures.
          </p>
        </div>

        <button
          onClick={handleSyncTime}
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-pink-500/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <RotateCw className="w-4 h-4" />
          Sync Exact Time Now
        </button>
      </div>

      {syncStatus && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          {syncStatus}
        </div>
      )}

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Time & Format Settings */}
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 text-xs font-bold text-pink-400 uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            Time & Region Format
          </div>

          {/* 12h / 24h Segmented Control */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Time Format</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
              <button
                onClick={() => onUpdateSettings({ ...settings, timeFormat: '12h' })}
                className={`py-2 text-xs font-extrabold rounded-xl transition-all ${
                  settings.timeFormat === '12h'
                    ? 'bg-pink-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                12-Hour (AM/PM)
              </button>
              <button
                onClick={() => onUpdateSettings({ ...settings, timeFormat: '24h' })}
                className={`py-2 text-xs font-extrabold rounded-xl transition-all ${
                  settings.timeFormat === '24h'
                    ? 'bg-pink-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                24-Hour (23:59)
              </button>
            </div>
          </div>

          {/* Timezone Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              Watch Timezone
            </label>
            <select
              value={settings.timeZone}
              onChange={(e) => onUpdateSettings({ ...settings, timeZone: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-pink-500"
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>

          {/* Auto Sync Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800">
            <div>
              <div className="text-xs font-bold text-white">Auto Sync Time with Smartphone</div>
              <div className="text-[10px] text-slate-400">Keep watch RTC precision synced periodically</div>
            </div>
            <input
              type="checkbox"
              checked={settings.autoSyncTime}
              onChange={(e) => onUpdateSettings({ ...settings, autoSyncTime: e.target.checked })}
              className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Card 2: Display & Screen Brightness */}
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 text-xs font-bold text-pink-400 uppercase tracking-wider">
            <Sun className="w-4 h-4" />
            Display & Brightness Controls
          </div>

          {/* Brightness Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                Screen Brightness
              </span>
              <span className="text-pink-400 font-mono font-bold">{settings.brightness}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={settings.brightness}
              onChange={(e) => onUpdateSettings({ ...settings, brightness: Number(e.target.value) })}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>

          {/* Screen Timeout Options */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Screen Timeout Duration</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {timeoutOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onUpdateSettings({ ...settings, screenTimeout: opt.value })}
                  className={`py-2 px-1 text-[11px] font-bold rounded-xl border transition-all ${
                    settings.screenTimeout === opt.value
                      ? 'bg-pink-600/30 border-pink-500 text-pink-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lift to Wake Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                Lift Wrist to Wake
              </div>
              <div className="text-[10px] text-slate-400">Turn on display automatically when lifting wrist</div>
            </div>
            <input
              type="checkbox"
              checked={settings.liftToWake}
              onChange={(e) => onUpdateSettings({ ...settings, liftToWake: e.target.checked })}
              className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
            />
          </div>

          {/* Always On Display (AOD) Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                Always-On Display (AOD)
              </div>
              <div className="text-[10px] text-slate-400">Show dim low-power Usagyuun clock when idle</div>
            </div>
            <input
              type="checkbox"
              checked={settings.alwaysOnDisplay}
              onChange={(e) => onUpdateSettings({ ...settings, alwaysOnDisplay: e.target.checked })}
              className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
            />
          </div>
        </div>

      </div>

    </div>
  );
};
