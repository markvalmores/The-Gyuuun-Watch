import React, { useState, useEffect } from 'react';
import { FirmwareInfo, WatchDevice } from '../types/watch';
import { 
  Timer, 
  Volume2, 
  Download, 
  Check, 
  Sparkles, 
  AlertCircle, 
  Play, 
  Pause, 
  RotateCcw, 
  Search, 
  Cpu, 
  Radio 
} from 'lucide-react';

interface DeviceUtilitiesProps {
  firmware: FirmwareInfo;
  onUpdateFirmware: (updatedFirmware: FirmwareInfo) => void;
  onSetWatchTimer: (seconds: number | null) => void;
  onTriggerFindMyWatch: () => void;
  device: WatchDevice;
}

export const DeviceUtilities: React.FC<DeviceUtilitiesProps> = ({
  firmware,
  onUpdateFirmware,
  onSetWatchTimer,
  onTriggerFindMyWatch,
  device,
}) => {
  // Timer state
  const [timerMinutes, setTimerMinutes] = useState<number>(5);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(300);

  // Stopwatch state
  const [stopwatchMs, setStopwatchMs] = useState<number>(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<string[]>([]);

  // Find My Watch trigger state
  const [findMsg, setFindMsg] = useState<string | null>(null);

  // Timer Tick Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          const next = prev - 1;
          onSetWatchTimer(next);
          if (next === 0) {
            setIsTimerRunning(false);
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft]);

  // Stopwatch Tick Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchMs((prev) => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isStopwatchRunning]);

  const handleStartTimer = (mins: number) => {
    const totalSecs = mins * 60;
    setTimerMinutes(mins);
    setTimerSecondsLeft(totalSecs);
    setIsTimerRunning(true);
    onSetWatchTimer(totalSecs);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSecondsLeft(timerMinutes * 60);
    onSetWatchTimer(null);
  };

  const handleFindMyWatchClick = () => {
    onTriggerFindMyWatch();
    setFindMsg('🔔 Chime signal sent! Your Gyuun Watch is ringing & flashing.');
    setTimeout(() => setFindMsg(null), 4000);
  };

  // OTA Firmware Update Process Simulator
  const handleStartOtaUpdate = () => {
    onUpdateFirmware({
      ...firmware,
      updateStatus: 'downloading',
      downloadProgress: 10,
    });

    let progress = 10;
    const interval = setInterval(() => {
      progress += 20;
      if (progress <= 50) {
        onUpdateFirmware({
          ...firmware,
          updateStatus: 'downloading',
          downloadProgress: progress,
        });
      } else if (progress <= 80) {
        onUpdateFirmware({
          ...firmware,
          updateStatus: 'flashing',
          downloadProgress: progress,
        });
      } else if (progress < 100) {
        onUpdateFirmware({
          ...firmware,
          updateStatus: 'rebooting',
          downloadProgress: 95,
        });
      } else {
        clearInterval(interval);
        onUpdateFirmware({
          ...firmware,
          currentVersion: firmware.latestVersion,
          isUpdateAvailable: false,
          updateStatus: 'completed',
          downloadProgress: 100,
        });
      }
    }, 1000);
  };

  const formatStopwatch = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const m = Math.floor(totalSecs / 60).toString().padStart(2, '0');
    const s = (totalSecs % 60).toString().padStart(2, '0');
    const hundredths = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
    return `${m}:${s}.${hundredths}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-pink-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Timer, Find My Watch & OTA Updates</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Sync timers to watch screen, trigger acoustic search alerts, and flash over-the-air firmware updates.
          </p>
        </div>

        <button
          onClick={handleFindMyWatchClick}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <Search className="w-4 h-4" />
          Find My Watch 🔔
        </button>
      </div>

      {findMsg && (
        <div className="bg-pink-500/20 border border-pink-500/40 text-pink-300 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <Volume2 className="w-4 h-4 text-pink-400" />
          {findMsg}
        </div>
      )}

      {/* Grid 1: Timer & Stopwatch */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Timer Card */}
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-pink-400 uppercase tracking-wider">
            <Timer className="w-4 h-4" />
            Watch Countdown Timer
          </div>

          <div className="text-center bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-3xl font-mono font-black text-white">
              {Math.floor(timerSecondsLeft / 60).toString().padStart(2, '0')}:
              {(timerSecondsLeft % 60).toString().padStart(2, '0')}
            </div>
            <p className="text-[10px] text-slate-400">
              Synced live with Virtual Watch screen
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-4 gap-1.5">
            {[1, 3, 5, 10].map((m) => (
              <button
                key={m}
                onClick={() => handleStartTimer(m)}
                className={`py-2 text-xs font-extrabold rounded-xl border transition-all ${
                  timerMinutes === m && isTimerRunning
                    ? 'bg-pink-600 border-pink-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {m} Min
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="flex-1 py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isTimerRunning ? 'Pause' : 'Start Timer'}
            </button>
            <button
              onClick={handleResetTimer}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stopwatch Card */}
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Radio className="w-4 h-4" />
              Watch Precision Stopwatch
            </span>
            <span className="text-[10px] text-slate-500">{laps.length} Laps</span>
          </div>

          <div className="text-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="text-3xl font-mono font-black text-cyan-300">
              {formatStopwatch(stopwatchMs)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsStopwatchRunning(!isStopwatchRunning)}
              className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
            >
              {isStopwatchRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isStopwatchRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={() => setLaps([...laps, formatStopwatch(stopwatchMs)])}
              disabled={!isStopwatchRunning}
              className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl disabled:opacity-50"
            >
              Lap
            </button>
            <button
              onClick={() => {
                setIsStopwatchRunning(false);
                setStopwatchMs(0);
                setLaps([]);
              }}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Grid 2: Firmware OTA Updates */}
      <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="text-sm font-bold text-white">OTA Firmware Update Manager</h3>
              <p className="text-[10px] text-slate-400">Huafit Watch OS Version {firmware.currentVersion}</p>
            </div>
          </div>

          {firmware.isUpdateAvailable ? (
            <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
              Update Available ({firmware.latestVersion})
            </span>
          ) : (
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
              Up To Date
            </span>
          )}
        </div>

        {/* Changelog List */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Changelog Release Notes
          </span>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {firmware.changelog.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-pink-400 shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* OTA Progress Bar or Download Button */}
        {firmware.updateStatus !== 'completed' && firmware.updateStatus !== 'up_to_date' ? (
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-purple-300">
              <span className="uppercase tracking-wider">
                Status: {firmware.updateStatus}...
              </span>
              <span>{firmware.downloadProgress}%</span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                style={{ width: `${firmware.downloadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex justify-end">
            {firmware.isUpdateAvailable ? (
              <button
                onClick={handleStartOtaUpdate}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download & Flash {firmware.latestVersion} ({firmware.sizeMb} MB)
              </button>
            ) : (
              <div className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                <Check className="w-4 h-4" /> Latest Usagyuun OS Installed
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
