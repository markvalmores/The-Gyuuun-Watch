import React, { useState } from 'react';
import { ActivityMetrics, WorkoutSession, UserBiometrics } from '../types/watch';
import { calculateHealthEvaluation, calculateMetCalories } from '../utils/healthCalculators';
import { 
  Footprints, 
  Flame, 
  Heart, 
  Sparkles, 
  Moon, 
  RotateCw, 
  Dumbbell, 
  Check, 
  TrendingUp, 
  Compass, 
  Timer,
  Zap,
  Activity,
  Sliders,
  ShieldCheck,
  Award,
  CheckCircle2
} from 'lucide-react';

interface ActivityTrackingDashboardProps {
  activityMetrics: ActivityMetrics;
  workouts: WorkoutSession[];
  biometrics: UserBiometrics;
  onSyncData: () => void;
  isSyncing: boolean;
  onOpenWorkoutModal: () => void;
  onOpenCalibrationModal: () => void;
}

export const ActivityTrackingDashboard: React.FC<ActivityTrackingDashboardProps> = ({
  activityMetrics,
  workouts,
  biometrics,
  onSyncData,
  isSyncing,
  onOpenWorkoutModal,
  onOpenCalibrationModal,
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'health_status' | 'sleep' | 'workouts'>('today');

  const healthEval = calculateHealthEvaluation(activityMetrics, biometrics);
  const metData = calculateMetCalories(
    activityMetrics.steps, 
    biometrics.weightKg, 
    biometrics.heightCm, 
    biometrics.gender
  );

  const stepPercent = Math.min(100, Math.round((activityMetrics.steps / activityMetrics.stepGoal) * 100));

  // Render SVG Heart Rate Timeline
  const maxBpm = 160;
  const minBpm = 50;
  const points = activityMetrics.hourlyData.map((d, index) => {
    const x = (index / (activityMetrics.hourlyData.length - 1)) * 300;
    const y = 80 - ((d.heartRate - minBpm) / (maxBpm - minBpm)) * 60;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-pink-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Accurate Health Status & Pedometer</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Calibrated with MET metabolic equations, stride math, and real-time physical pedometer algorithms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCalibrationModal}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            Calibrate Profile
          </button>

          <button
            onClick={onOpenWorkoutModal}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-pink-500/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <Dumbbell className="w-4 h-4" />
            Start Workout
          </button>

          <button
            onClick={onSyncData}
            disabled={isSyncing}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition-all disabled:opacity-50"
            title="Sync Latest Health Metrics"
          >
            <RotateCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-pink-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('today')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'today'
              ? 'bg-pink-600/20 text-pink-300 border border-pink-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Today's Summary
        </button>

        <button
          onClick={() => setActiveTab('health_status')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'health_status'
              ? 'bg-pink-600/20 text-pink-300 border border-pink-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Accurate Health Status ({healthEval.overallScore}/100)
        </button>

        <button
          onClick={() => setActiveTab('sleep')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'sleep'
              ? 'bg-pink-600/20 text-pink-300 border border-pink-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Sleep Stages
        </button>

        <button
          onClick={() => setActiveTab('workouts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'workouts'
              ? 'bg-pink-600/20 text-pink-300 border border-pink-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Workout History ({workouts.length})
        </button>
      </div>

      {/* Tab Content 1: Today's Summary */}
      {activeTab === 'today' && (
        <div className="space-y-6">
          
          {/* Top 4 KPI Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Steps Ring Card */}
            <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Steps Taken</span>
                <Footprints className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-white">
                {activityMetrics.steps.toLocaleString()}
              </div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <span>Goal: {activityMetrics.stepGoal.toLocaleString()}</span>
                <span className="text-cyan-400 font-bold">{stepPercent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${stepPercent}%` }}
                />
              </div>
            </div>

            {/* MET Calorie Burned */}
            <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">MET Calorie Burn</span>
                <Flame className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-white">
                {metData.calories > 0 ? metData.calories : activityMetrics.calories} <span className="text-xs text-amber-400 font-normal">kcal</span>
              </div>
              <p className="text-[10px] text-amber-300 font-semibold">
                Calibrated for {biometrics.weightKg}kg body mass
              </p>
            </div>

            {/* Accurate Distance */}
            <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Accurate Distance</span>
                <Compass className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-white">
                {metData.distanceKm > 0 ? metData.distanceKm : activityMetrics.distanceKm} <span className="text-xs text-emerald-400 font-normal">km</span>
              </div>
              <p className="text-[10px] text-emerald-300 font-semibold">
                Stride: {healthEval.strideLengthCm} cm / step
              </p>
            </div>

            {/* Active Minutes */}
            <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Active Minutes</span>
                <Timer className="w-4 h-4 text-pink-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-white">
                {activityMetrics.activeMinutes} <span className="text-xs text-pink-400 font-normal">min</span>
              </div>
              <p className="text-[11px] text-slate-400">
                150 min weekly target progress
              </p>
            </div>

          </div>

          {/* Continuous Heart Rate & Vitals Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Heart Rate Timeline Chart */}
            <div className="lg:col-span-8 bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500 animate-pulse" />
                  <div>
                    <h3 className="text-sm font-bold text-white">24-Hour Continuous Heart Rate</h3>
                    <p className="text-[10px] text-slate-400">Optical sensor readings with Cardio Zone analysis</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-bold">
                  <span className="text-slate-400">Resting: <span className="text-white">{activityMetrics.heartRateRest} BPM</span></span>
                  <span className="text-slate-400">Peak: <span className="text-red-400">{activityMetrics.heartRateMax} BPM</span></span>
                </div>
              </div>

              {/* SVG Heart Rate Graph */}
              <div className="relative bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                <svg className="w-full h-36 overflow-visible" viewBox="0 0 300 80">
                  <line x1="0" y1="20" x2="300" y2="20" stroke="#334155" strokeDasharray="3 3" />
                  <line x1="0" y1="50" x2="300" y2="50" stroke="#334155" strokeDasharray="3 3" />

                  <defs>
                    <linearGradient id="hrGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <polygon points={`0,80 ${points} 300,80`} fill="url(#hrGradient)" />

                  <polyline
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                  />

                  {activityMetrics.hourlyData.map((d, index) => {
                    const x = (index / (activityMetrics.hourlyData.length - 1)) * 300;
                    const y = 80 - ((d.heartRate - minBpm) / (maxBpm - minBpm)) * 60;
                    return (
                      <circle
                        key={index}
                        cx={x}
                        cy={y}
                        r="3.5"
                        fill="#ffffff"
                        stroke="#ef4444"
                        strokeWidth="2"
                      />
                    );
                  })}
                </svg>

                <div className="flex justify-between text-[9px] font-mono font-bold text-slate-500 pt-2 border-t border-slate-800">
                  {activityMetrics.hourlyData.map((d, i) => (
                    <span key={i}>{d.hour}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* SpO2 & Stress Level Gauges */}
            <div className="lg:col-span-4 space-y-4">
              
              <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white">SpO2 Blood Oxygen</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Normal
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-mono text-cyan-300">{activityMetrics.spO2}%</span>
                  <span className="text-xs text-slate-400">Oxygen Saturation</span>
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-white">Stress Level</span>
                  </div>
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                    Relaxed
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-mono text-purple-300">{activityMetrics.stressLevel}</span>
                  <span className="text-xs text-slate-400">/ 100 Low Stress</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* Tab Content 2: Accurate Health Status Index */}
      {activeTab === 'health_status' && (
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <h3 className="text-base sm:text-lg font-bold text-white">Biometric Health Status Diagnostic</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluated across cardiovascular efficiency, MET metabolic rate, sleep recovery & SpO2 oxygenation.
              </p>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-2xl flex items-center gap-3">
              <Award className="w-6 h-6 text-emerald-400" />
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Overall Health Score</div>
                <div className="text-2xl font-black font-mono text-white">
                  {healthEval.overallScore} <span className="text-xs text-emerald-400 font-normal">/ 100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostic Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Status Rating</div>
              <div className="text-sm font-black text-emerald-400 mt-1">{healthEval.statusRating}</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Cardio Zone</div>
              <div className="text-sm font-black text-cyan-300 mt-1">{healthEval.cardioZone}</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">VO2 Max Estimate</div>
              <div className="text-sm font-black font-mono text-purple-300 mt-1">{healthEval.vo2MaxEstimate} ml/kg/min</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">BMI Classification</div>
              <div className="text-sm font-black text-pink-300 mt-1">{healthEval.bmi} ({healthEval.bmiCategory})</div>
            </div>
          </div>

          {/* Actionable Medical Recommendations */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Personalized Biometric Recommendations
            </span>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {healthEval.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}

      {/* Tab Content 3: Sleep Stages */}
      {activeTab === 'sleep' && (
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="text-sm font-bold text-white">Sleep Quality & Stage Breakdown</h3>
                <p className="text-[10px] text-slate-400">Recorded last night via Huafit sleep sensors</p>
              </div>
            </div>

            <div className="bg-indigo-500/20 border border-indigo-500/40 px-3 py-1 rounded-xl text-indigo-300 font-extrabold text-xs flex items-center gap-1.5">
              <span>Sleep Score:</span>
              <span className="text-lg text-white font-mono">{activityMetrics.sleepScore}</span>
              <span>/ 100</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-950 p-3 rounded-2xl border border-indigo-900/40">
              <div className="text-[10px] font-bold text-indigo-300">Deep Sleep</div>
              <div className="text-lg font-black font-mono text-white mt-1">{activityMetrics.sleepDeepMinutes} min</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-2xl border border-blue-900/40">
              <div className="text-[10px] font-bold text-blue-300">Light Sleep</div>
              <div className="text-lg font-black font-mono text-white mt-1">{activityMetrics.sleepLightMinutes} min</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-2xl border border-purple-900/40">
              <div className="text-[10px] font-bold text-purple-300">REM Sleep</div>
              <div className="text-lg font-black font-mono text-white mt-1">{activityMetrics.sleepRemMinutes} min</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div className="text-[10px] font-bold text-slate-400">Awake Time</div>
              <div className="text-lg font-black font-mono text-white mt-1">{activityMetrics.sleepAwakeMinutes} min</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 4: Workout History */}
      {activeTab === 'workouts' && (
        <div className="space-y-3">
          {workouts.map((w) => (
            <div
              key={w.id}
              className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>{w.type}</span>
                    <span className="text-[9px] bg-pink-500/20 text-pink-300 px-1.5 py-0.5 rounded border border-pink-500/30 font-semibold">
                      {w.usagyuunCheers} Usagyuun High-Fives
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {Math.floor(w.durationSeconds / 60)} mins · Avg HR {w.avgBpm} BPM
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-black text-amber-400 font-mono">
                  {w.caloriesBurned} kcal
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {w.distanceKm > 0 ? `${w.distanceKm} km` : 'Cardio Session'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
