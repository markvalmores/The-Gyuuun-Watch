import React, { useState, useEffect } from 'react';
import { WorkoutSession } from '../types/watch';
import { 
  Dumbbell, 
  X, 
  Play, 
  Pause, 
  Check, 
  Flame, 
  Heart, 
  Zap, 
  MapPin, 
  Timer 
} from 'lucide-react';

interface WorkoutTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveWorkout: (newWorkout: WorkoutSession) => void;
}

export const WorkoutTrackerModal: React.FC<WorkoutTrackerModalProps> = ({
  isOpen,
  onClose,
  onSaveWorkout,
}) => {
  const [selectedType, setSelectedType] = useState<WorkoutSession['type']>('Usagyuun Dance Cardio');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);
  const [calories, setCalories] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [currentBpm, setCurrentBpm] = useState<number>(128);
  const [cheerCount, setCheerCount] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
        
        // Calorie burn calculation based on activity type
        setCalories((prev) => prev + Math.floor(Math.random() * 2 + 1));
        
        if (['Outdoor Run', 'Cycling', 'Walking'].includes(selectedType)) {
          setDistance((prev) => Number((prev + 0.003).toFixed(2)));
        }

        // Slight natural heart rate fluctuations
        const bpmFluctuation = Math.floor(Math.random() * 5) - 2;
        setCurrentBpm((prev) => Math.min(175, Math.max(110, prev + bpmFluctuation)));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, selectedType]);

  if (!isOpen) return null;

  const handleStart = () => setIsActive(true);
  const handlePause = () => setIsActive(false);

  const handleCheerHighFive = () => {
    setCheerCount((prev) => prev + 1);
    setCalories((prev) => prev + 5);
  };

  const handleFinish = () => {
    setIsActive(false);
    const newWorkout: WorkoutSession = {
      id: `workout-${Date.now()}`,
      type: selectedType,
      durationSeconds: Math.max(1, seconds),
      caloriesBurned: Math.max(10, calories),
      distanceKm: distance,
      avgBpm: currentBpm,
      maxBpm: currentBpm + 15,
      usagyuunCheers: cheerCount,
      timestamp: new Date().toISOString(),
    };
    onSaveWorkout(newWorkout);
    onClose();
  };

  const workoutTypes: WorkoutSession['type'][] = [
    'Usagyuun Dance Cardio',
    'Outdoor Run',
    'Cycling',
    'Jump Rope',
    'HIIT',
    'Walking',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-6 shadow-2xl relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/30">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Live Workout Tracking</h3>
            <p className="text-xs text-slate-400">Syncs continuously with your Huafit Smart Watch</p>
          </div>
        </div>

        {/* Workout Mode Picker (if not active) */}
        {!isActive && seconds === 0 && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Choose Workout Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              {workoutTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left ${
                    selectedType === t
                      ? 'bg-pink-600/30 border-pink-500 text-pink-300 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live Active Tracker Stats Screen */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 text-center">
          <div className="text-xs font-bold text-pink-400 uppercase tracking-widest">
            {selectedType}
          </div>

          {/* Time Counter */}
          <div className="text-4xl font-mono font-black text-white tracking-wider">
            {Math.floor(seconds / 60).toString().padStart(2, '0')}:
            {(seconds % 60).toString().padStart(2, '0')}
          </div>

          {/* Calorie & Pulse Grid */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
            <div className="p-2 bg-slate-900 rounded-xl">
              <div className="flex items-center justify-center gap-1 text-[10px] text-amber-400 font-bold">
                <Flame className="w-3 h-3" /> Burned
              </div>
              <div className="text-lg font-black font-mono text-white mt-0.5">{calories} <span className="text-[10px] font-normal">kcal</span></div>
            </div>

            <div className="p-2 bg-slate-900 rounded-xl">
              <div className="flex items-center justify-center gap-1 text-[10px] text-red-400 font-bold">
                <Heart className="w-3 h-3 animate-pulse" /> Pulse
              </div>
              <div className="text-lg font-black font-mono text-white mt-0.5">{currentBpm} <span className="text-[10px] font-normal">bpm</span></div>
            </div>

            <div className="p-2 bg-slate-900 rounded-xl">
              <div className="flex items-center justify-center gap-1 text-[10px] text-pink-400 font-bold">
                <Zap className="w-3 h-3" /> High-Fives
              </div>
              <div className="text-lg font-black font-mono text-white mt-0.5">{cheerCount}</div>
            </div>
          </div>

          {/* Usagyuun Cheer Button */}
          {isActive && (
            <button
              onClick={handleCheerHighFive}
              className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 active:scale-98 text-white font-black text-xs rounded-xl shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-yellow-300 animate-bounce" />
              High-Five Usagyuun! (+5 Calorie Boost)
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {!isActive ? (
            <button
              onClick={handleStart}
              className="flex-1 py-3 bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" /> Start Workout
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <Pause className="w-4 h-4" /> Pause
            </button>
          )}

          {seconds > 0 && (
            <button
              onClick={handleFinish}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" /> Save Workout
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
