import React, { useState } from 'react';
import { TimeSettings, WatchDevice } from '../types/watch';
import { SmartWatchModel } from '../data/watchCatalogue';
import html2canvas from 'html2canvas-pro';
import { 
  Sliders, 
  X, 
  Camera, 
  Sun, 
  Clock, 
  Eye, 
  Moon, 
  RotateCw, 
  Bluetooth, 
  Sparkles, 
  Zap,
  ChevronUp
} from 'lucide-react';

interface FloatingSettingsBubbleProps {
  settings: TimeSettings;
  onUpdateSettings: (newSettings: TimeSettings) => void;
  device: WatchDevice;
  currentModel: SmartWatchModel;
  onOpenModelPicker: () => void;
  onOpenCalibrationModal: () => void;
  onSync: () => void;
  onCaptureScreenshot: (dataUrl: string) => void;
}

export const FloatingSettingsBubble: React.FC<FloatingSettingsBubbleProps> = ({
  settings,
  onUpdateSettings,
  device,
  currentModel,
  onOpenModelPicker,
  onOpenCalibrationModal,
  onSync,
  onCaptureScreenshot,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  const handleTakeWatchScreenshot = async () => {
    setIsCapturing(true);
    const watchElement = document.getElementById('watch-hardware-container');
    if (watchElement) {
      try {
        const canvas = await html2canvas(watchElement, {
          backgroundColor: null,
          scale: 2,
          useCORS: true,
          logging: false,
          onclone: (clonedDoc) => {
            // Sanitize any remaining Tailwind CSS v4 oklab/oklch colors by converting computed styles
            const allElements = clonedDoc.querySelectorAll('*');
            allElements.forEach((el) => {
              const htmlEl = el as HTMLElement;
              try {
                const computed = window.getComputedStyle(htmlEl);
                if (computed.backgroundColor && computed.backgroundColor !== 'rgba(0, 0, 0, 0)') {
                  htmlEl.style.backgroundColor = computed.backgroundColor;
                }
                if (computed.color) {
                  htmlEl.style.color = computed.color;
                }
                if (computed.borderColor && computed.borderColor !== 'rgba(0, 0, 0, 0)') {
                  htmlEl.style.borderColor = computed.borderColor;
                }
              } catch (e) {
                // Ignore style read errors on non-visual elements
              }
            });
          },
        });
        const dataUrl = canvas.toDataURL('image/png');
        onCaptureScreenshot(dataUrl);
        setIsOpen(false);
      } catch (err) {
        console.error('Screenshot capture error:', err);
      } finally {
        setIsCapturing(false);
      }
    } else {
      setIsCapturing(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Floating Popup Settings Menu */}
      {isOpen && (
        <div className="mb-3 w-80 bg-slate-900/95 border border-pink-500/40 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300 text-slate-100">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">Quick Watch Controls</h4>
                <p className="text-[10px] text-slate-400">Floating Settings & Screenshot</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Primary Action: Take Full Watch Screenshot */}
          <button
            onClick={handleTakeWatchScreenshot}
            disabled={isCapturing}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 active:scale-98 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Camera className={`w-4 h-4 ${isCapturing ? 'animate-spin' : ''}`} />
            {isCapturing ? 'Capturing Watch...' : '📸 Screenshot Entire Watch'}
          </button>

          {/* Quick Control Toggles */}
          <div className="space-y-3 pt-1">
            
            {/* Time Format */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Time Format
              </label>
              <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
                <button
                  onClick={() => onUpdateSettings({ ...settings, timeFormat: '12h' })}
                  className={`py-1.5 rounded-lg ${settings.timeFormat === '12h' ? 'bg-pink-600 text-white' : 'text-slate-400'}`}
                >
                  12-Hour
                </button>
                <button
                  onClick={() => onUpdateSettings({ ...settings, timeFormat: '24h' })}
                  className={`py-1.5 rounded-lg ${settings.timeFormat === '24h' ? 'bg-pink-600 text-white' : 'text-slate-400'}`}
                >
                  24-Hour
                </button>
              </div>
            </div>

            {/* Brightness */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                <span className="flex items-center gap-1">
                  <Sun className="w-3 h-3 text-amber-400" /> Brightness
                </span>
                <span className="text-pink-400 font-mono">{settings.brightness}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={settings.brightness}
                onChange={(e) => onUpdateSettings({ ...settings, brightness: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
            </div>

            {/* Toggles Grid */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onUpdateSettings({ ...settings, alwaysOnDisplay: !settings.alwaysOnDisplay })}
                className={`p-2 rounded-xl border text-[11px] font-bold flex items-center justify-between ${
                  settings.alwaysOnDisplay ? 'bg-indigo-950/60 border-indigo-500 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <span>AOD Mode</span>
                <Moon className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onUpdateSettings({ ...settings, liftToWake: !settings.liftToWake })}
                className={`p-2 rounded-xl border text-[11px] font-bold flex items-center justify-between ${
                  settings.liftToWake ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <span>Lift Wake</span>
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Additional Quick Triggers */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenModelPicker();
                }}
                className="p-2 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 text-[10px] font-bold text-pink-300 truncate text-left"
              >
                Model: {currentModel.name.split(' ')[0]}
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenCalibrationModal();
                }}
                className="p-2 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 text-[10px] font-bold text-cyan-300 truncate text-left"
              >
                Biometric Profile
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Floating Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 p-0.5 shadow-[0_10px_25px_rgba(236,72,153,0.5)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center"
        title="Quick Floating Settings & Watch Screenshot"
      >
        {/* Animated Glow Pulsing Ring */}
        <span className="absolute inset-0 rounded-full bg-pink-500/40 animate-ping pointer-events-none" />

        <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center relative z-10">
          {isOpen ? (
            <ChevronUp className="w-6 h-6 text-pink-400 transition-transform" />
          ) : (
            <div className="flex items-center justify-center text-lg animate-bounce">
              🐰
            </div>
          )}
        </div>
      </button>

    </div>
  );
};
