import React, { useState, useEffect } from 'react';
import { 
  WatchFace, 
  TimeSettings, 
  ActivityMetrics, 
  WatchDevice, 
  UsagyuunMood 
} from '../types/watch';
import { SmartWatchModel } from '../data/watchCatalogue';
import { 
  Heart, 
  Footprints, 
  Battery, 
  CloudSun, 
  Sparkles, 
  Flame, 
  Music, 
  Bell, 
  Volume2, 
  RotateCw,
  Power,
  Zap
} from 'lucide-react';

interface VirtualWatchMockupProps {
  watchFace: WatchFace;
  timeSettings: TimeSettings;
  activityMetrics: ActivityMetrics;
  device: WatchDevice;
  usagyuunMood: UsagyuunMood;
  currentModel: SmartWatchModel;
  isFindingWatch?: boolean;
  timerSeconds?: number | null;
  onTapWatchScreen?: () => void;
  onCheerClick?: () => void;
}

export const VirtualWatchMockup: React.FC<VirtualWatchMockupProps> = ({
  watchFace,
  timeSettings,
  activityMetrics,
  device,
  usagyuunMood,
  currentModel,
  isFindingWatch = false,
  timerSeconds = null,
  onTapWatchScreen,
  onCheerClick,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [screenMode, setScreenMode] = useState<'watchface' | 'widgets' | 'usagyuun' | 'timer'>('watchface');
  const [isScreenOn, setIsScreenOn] = useState<boolean>(true);
  const [notification, setNotification] = useState<string | null>(null);

  // Live Clock Tick
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      
      let formattedTime = '';
      if (timeSettings.timeFormat === '12h') {
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        formattedTime = `${hours}:${minutes} ${ampm}`;
      } else {
        formattedTime = `${hours.toString().padStart(2, '0')}:${minutes}`;
      }

      setCurrentTime(formattedTime);

      const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      setCurrentDate(`${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [timeSettings.timeFormat]);

  // Handle Find My Watch alert popup
  useEffect(() => {
    if (isFindingWatch) {
      setNotification('🔔 FIND MY WATCH: Ringing & Flashing!');
    }
  }, [isFindingWatch]);

  const handleSideButton = () => {
    setIsScreenOn((prev) => !prev);
  };

  const cycleScreenMode = () => {
    if (!isScreenOn) {
      setIsScreenOn(true);
      return;
    }
    const modes: ('watchface' | 'widgets' | 'usagyuun' | 'timer')[] = ['watchface', 'widgets', 'usagyuun', 'timer'];
    const currentIndex = modes.indexOf(screenMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setScreenMode(nextMode);
    if (onTapWatchScreen) onTapWatchScreen();
  };

  // Font family mappings
  const getClockFontClass = () => {
    switch (watchFace.fontStyle) {
      case 'digital':
        return 'font-mono tracking-widest font-black';
      case 'cyber':
        return 'font-mono tracking-tight font-extrabold text-cyan-300 drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]';
      case 'rounded':
        return 'font-sans font-extrabold tracking-normal text-pink-200';
      case 'classic':
        return 'font-serif font-bold tracking-wide text-amber-200';
      case 'vtuber':
      default:
        return 'font-extrabold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]';
    }
  };

  // Casing geometry classes based on selected SmartWatchModel
  const getCasingShapeClass = () => {
    switch (currentModel.casingShape) {
      case 'circle':
        return 'w-72 h-72 rounded-full';
      case 'capsule':
        return 'w-48 h-80 rounded-[60px]';
      case 'ultra_octagonal':
      case 'rugged_bezel':
        return 'w-72 h-80 rounded-[44px] border-4';
      case 'square':
        return 'w-72 h-80 rounded-[28px]';
      case 'curved_square':
      default:
        return 'w-72 h-80 rounded-[52px]';
    }
  };

  const getScreenShapeClass = () => {
    if (currentModel.casingShape === 'circle') {
      return 'rounded-full w-60 h-60';
    }
    if (currentModel.casingShape === 'capsule') {
      return 'rounded-[48px] w-36 h-72';
    }
    return 'rounded-[38px] w-full h-full';
  };

  const brightnessStyle = {
    filter: `brightness(${isScreenOn ? Math.max(0.3, timeSettings.brightness / 100) : 0.05})`,
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-2 sm:p-4">
      
      {/* Smart Watch Hardware Casing Wrapper */}
      <div 
        id="watch-hardware-container" 
        className={`relative p-2 bg-slate-950/40 rounded-[60px] transition-all duration-300 ${isFindingWatch ? 'animate-bounce' : ''}`}
      >
        
        {/* Watch Strap (Top) */}
        <div className="w-32 h-16 mx-auto bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-t-3xl border-t-2 border-x-2 border-slate-700 shadow-inner flex flex-col justify-end p-1">
          <div className="w-full h-1 bg-slate-950/60 rounded-full my-1"></div>
          <div className="w-full h-1 bg-slate-950/60 rounded-full my-1"></div>
        </div>

        {/* Custom Transparent PNG Watch Overlay Mode or Dynamic Casing */}
        <div 
          className={`relative ${getCasingShapeClass()} p-4 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex items-center justify-center border-4 transition-all duration-300`}
          style={{ 
            background: currentModel.casingShape === 'custom_png' ? 'transparent' : currentModel.finishColor,
            borderColor: currentModel.bezelBorderColor || '#475569'
          }}
        >
          
          {/* Custom PNG Image Overlay if equipped */}
          {currentModel.casingShape === 'custom_png' && currentModel.customPngUrl && (
            <img 
              src={currentModel.customPngUrl} 
              alt="Custom PNG Casing"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20"
            />
          )}

          {/* Metallic Side Crown Button */}
          <button
            onClick={cycleScreenMode}
            className="absolute -right-5 top-24 w-5 h-12 bg-gradient-to-r from-slate-600 via-slate-400 to-slate-700 rounded-r-lg border-y border-r border-slate-500 shadow-md flex items-center justify-center hover:brightness-125 active:scale-95 transition-all group z-30"
            title="Rotate / Click Digital Crown"
          >
            <div className="w-1 h-8 bg-slate-800 rounded-full group-hover:bg-pink-500 transition-colors"></div>
          </button>

          {/* Power Button */}
          <button
            onClick={handleSideButton}
            className="absolute -right-4 bottom-20 w-4 h-8 bg-gradient-to-r from-slate-700 to-slate-800 rounded-r-md border-y border-r border-slate-600 active:scale-95 transition-transform z-30"
            title="Power / Screen Toggle Button"
          >
            <Power className="w-3 h-3 text-slate-400 mx-auto" />
          </button>

          {/* Inner Screen Frame */}
          <div 
            onClick={cycleScreenMode}
            style={brightnessStyle}
            className={`relative ${getScreenShapeClass()} overflow-hidden cursor-pointer select-none border-2 transition-all duration-300 ${
              isFindingWatch ? 'border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.9)]' : 'border-slate-900 shadow-inner'
            }`}
          >
            {/* Background Watch Face Canvas */}
            <div 
              className="absolute inset-0 transition-all duration-500"
              style={{ background: watchFace.bgValue }}
            >
              {watchFace.bgType === 'usagyuun_animated' && (
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-500/30 via-purple-600/20 to-transparent animate-pulse" />
              )}
            </div>

            {/* Screen Content Overlay */}
            <div className="relative z-10 w-full h-full p-3 sm:p-4 flex flex-col justify-between text-white">
              
              {/* Top Screen Status Bar */}
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-white/80 px-1 pt-1 drop-shadow">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="tracking-tight truncate max-w-[80px]">{currentModel.name.split(' ')[0]}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px]">{device.batteryLevel}%</span>
                  {device.isCharging ? (
                    <Zap className="w-3.5 h-3.5 text-yellow-300 animate-bounce" />
                  ) : (
                    <Battery className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </div>
              </div>

              {/* Notification Banner Popup */}
              {notification && (
                <div className="absolute top-8 left-2 right-2 bg-pink-600/95 text-white p-2 rounded-xl backdrop-blur-md shadow-lg border border-pink-400 text-xs font-bold text-center animate-bounce z-30 flex items-center justify-between">
                  <span className="truncate">{notification}</span>
                  <button onClick={() => setNotification(null)} className="ml-1 text-white hover:text-pink-200">×</button>
                </div>
              )}

              {/* Mode 1: Main Watch Face Display */}
              {screenMode === 'watchface' && (
                <div className="my-auto flex flex-col items-center justify-center text-center py-1">
                  <div className="text-[10px] font-bold tracking-widest text-pink-200/90 uppercase mb-1 drop-shadow">
                    {currentDate}
                  </div>

                  <div className={`text-2xl sm:text-3xl ${getClockFontClass()} my-0.5`} style={{ color: watchFace.fontColor }}>
                    {currentTime || '12:00'}
                  </div>

                  {/* Usagyuun Mascot Mini Avatar */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onCheerClick) onCheerClick();
                    }}
                    className="my-1.5 p-1 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-lg hover:scale-105 active:scale-95 transition-transform"
                  >
                    <div className="w-7 h-7 rounded-full bg-pink-500/30 flex items-center justify-center text-base animate-bounce">
                      🐰
                    </div>
                    <div className="text-left pr-1">
                      <div className="text-[8px] font-bold text-pink-300 flex items-center gap-0.5">
                        <Sparkles className="w-2 h-2 text-yellow-300" /> Usagyuun
                      </div>
                      <div className="text-[9px] font-extrabold text-white leading-none">
                        {usagyuunMood.cheerCount} Cheers
                      </div>
                    </div>
                  </div>

                  {/* Active Complications Grid */}
                  <div className="grid grid-cols-2 gap-1 w-full mt-0.5">
                    {watchFace.complications.includes('steps') && (
                      <div className="bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded-lg border border-white/10 flex items-center gap-1 text-[9px] font-bold">
                        <Footprints className="w-2.5 h-2.5 text-cyan-400" />
                        <span className="text-white truncate">{activityMetrics.steps}</span>
                      </div>
                    )}
                    {watchFace.complications.includes('hr') && (
                      <div className="bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded-lg border border-white/10 flex items-center gap-1 text-[9px] font-bold">
                        <Heart className="w-2.5 h-2.5 text-red-400 animate-pulse" />
                        <span className="text-white truncate">{activityMetrics.heartRateCurrent} bpm</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Mode 2: Widgets Screen */}
              {screenMode === 'widgets' && (
                <div className="my-auto flex flex-col gap-1.5 py-1 overflow-y-auto max-h-[190px] no-scrollbar">
                  <div className="text-[9px] font-bold text-pink-300 uppercase tracking-wider text-center">
                    {currentModel.brand} Widgets
                  </div>

                  <div className="bg-slate-900/80 p-1.5 rounded-xl border border-cyan-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Footprints className="w-3.5 h-3.5 text-cyan-400" />
                      <div>
                        <div className="text-[8px] text-slate-400">Steps</div>
                        <div className="text-[10px] font-bold">{activityMetrics.steps}</div>
                      </div>
                    </div>
                    <div className="text-[9px] font-bold text-cyan-400">
                      {Math.round((activityMetrics.steps / activityMetrics.stepGoal) * 100)}%
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1">
                    <div className="bg-slate-900/80 p-1.5 rounded-xl border border-red-500/30 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                      <div>
                        <div className="text-[8px] text-slate-400">Pulse</div>
                        <div className="text-[10px] font-bold">{activityMetrics.heartRateCurrent}</div>
                      </div>
                    </div>
                    <div className="bg-slate-900/80 p-1.5 rounded-xl border border-blue-500/30 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      <div>
                        <div className="text-[8px] text-slate-400">SpO2</div>
                        <div className="text-[10px] font-bold">{activityMetrics.spO2}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mode 3: Usagyuun Screen */}
              {screenMode === 'usagyuun' && (
                <div className="my-auto flex flex-col items-center justify-center text-center p-1">
                  <div className="w-10 h-10 rounded-full bg-pink-500/20 border border-pink-400 flex items-center justify-center text-xl animate-bounce my-0.5">
                    🐰✨
                  </div>
                  <div className="text-[9px] font-black text-pink-300">
                    USAGYUUN LIVE
                  </div>
                  <p className="text-[9px] text-white/90 italic my-1 bg-black/60 p-1.5 rounded-xl border border-pink-500/30 line-clamp-2">
                    "{usagyuunMood.currentQuote}"
                  </p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onCheerClick) onCheerClick();
                    }}
                    className="px-2.5 py-0.5 bg-pink-500 text-white font-extrabold text-[9px] rounded-full shadow my-0.5"
                  >
                    🙌 High Five +1
                  </button>
                </div>
              )}

              {/* Mode 4: Timer */}
              {screenMode === 'timer' && (
                <div className="my-auto flex flex-col items-center justify-center text-center">
                  <div className="text-[9px] font-bold text-cyan-300 uppercase tracking-widest mb-1">
                    Watch Timer
                  </div>
                  <div className="text-2xl font-mono font-black text-white my-1">
                    {timerSeconds !== null 
                      ? `${Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:${(timerSeconds % 60).toString().padStart(2, '0')}`
                      : '05:00'}
                  </div>
                </div>
              )}

              {/* Bottom Screen Navigation Indicator Dots */}
              <div className="flex items-center justify-center gap-1 pb-0.5">
                <span className={`w-1 h-1 rounded-full transition-all ${screenMode === 'watchface' ? 'bg-pink-400 w-2.5' : 'bg-white/40'}`} />
                <span className={`w-1 h-1 rounded-full transition-all ${screenMode === 'widgets' ? 'bg-pink-400 w-2.5' : 'bg-white/40'}`} />
                <span className={`w-1 h-1 rounded-full transition-all ${screenMode === 'usagyuun' ? 'bg-pink-400 w-2.5' : 'bg-white/40'}`} />
                <span className={`w-1 h-1 rounded-full transition-all ${screenMode === 'timer' ? 'bg-pink-400 w-2.5' : 'bg-white/40'}`} />
              </div>

            </div>
          </div>
        </div>

        {/* Watch Strap (Bottom) */}
        <div className="w-32 h-16 mx-auto bg-gradient-to-t from-slate-900 via-slate-800 to-slate-900 rounded-b-3xl border-b-2 border-x-2 border-slate-700 shadow-inner flex flex-col justify-start p-1">
          <div className="w-full h-1 bg-slate-950/60 rounded-full my-1"></div>
          <div className="w-full h-1 bg-slate-950/60 rounded-full my-1"></div>
        </div>

      </div>

      <div className="mt-2 text-center">
        <p className="text-[11px] text-slate-400 font-semibold">
          Equipped: <span className="text-pink-300 font-bold">{currentModel.name}</span> ({currentModel.brand})
        </p>
      </div>
    </div>
  );
};
