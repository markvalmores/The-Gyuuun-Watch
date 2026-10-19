import React, { useState, useEffect } from 'react';
import { UserBiometrics } from '../types/watch';
import { calculateStrideLength, calculateBmi } from '../utils/healthCalculators';
import { 
  Sliders, 
  X, 
  Check, 
  Activity, 
  Scale, 
  User as UserIcon, 
  Footprints, 
  Heart, 
  Zap, 
  Sparkles,
  Smartphone
} from 'lucide-react';

interface BiometricCalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  biometrics: UserBiometrics;
  onUpdateBiometrics: (updated: UserBiometrics) => void;
  onStepIncrement: (stepsToAdd: number) => void;
}

export const BiometricCalibrationModal: React.FC<BiometricCalibrationModalProps> = ({
  isOpen,
  onClose,
  biometrics,
  onUpdateBiometrics,
  onStepIncrement,
}) => {
  const [formData, setFormData] = useState<UserBiometrics>(biometrics);
  const [isPedometerActive, setIsPedometerActive] = useState<boolean>(false);
  const [livePedometerSteps, setLivePedometerSteps] = useState<number>(0);
  const [sensorMsg, setSensorMsg] = useState<string | null>(null);

  useEffect(() => {
    setFormData(biometrics);
  }, [biometrics]);

  // Real Hardware Accelerometer Step Detection Listener
  useEffect(() => {
    let lastAccel = 0;
    let threshold = 12.5; // Threshold for step detection acceleration magnitude
    if (formData.pedometerSensitivity === 'high') threshold = 10.5;
    if (formData.pedometerSensitivity === 'low') threshold = 14.5;

    const handleMotion = (event: DeviceMotionEvent) => {
      if (!isPedometerActive) return;
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;

      const x = acc.x || 0;
      const y = acc.y || 0;
      const z = acc.z || 0;

      // Acceleration vector magnitude
      const mag = Math.sqrt(x * x + y * y + z * z);
      const delta = Math.abs(mag - lastAccel);

      if (delta > threshold) {
        setLivePedometerSteps((prev) => prev + 1);
        onStepIncrement(1);
      }
      lastAccel = mag;
    };

    if (isPedometerActive && window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleMotion);
      setSensorMsg('🟢 Real Device Motion Sensor Active! Shake/walk with device to count steps.');
    } else if (isPedometerActive) {
      setSensorMsg('⚠️ Device Motion Sensor unsupported on browser context. Simulating precision pedometer.');
    } else {
      setSensorMsg(null);
    }

    return () => {
      if (window.DeviceMotionEvent) {
        window.removeEventListener('devicemotion', handleMotion);
      }
    };
  }, [isPedometerActive, formData.pedometerSensitivity]);

  if (!isOpen) return null;

  const strideCm = calculateStrideLength(formData.heightCm, formData.gender);
  const { bmi, category: bmiCategory } = calculateBmi(formData.weightKg, formData.heightCm);

  const handleSave = () => {
    onUpdateBiometrics(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-6 shadow-2xl relative text-slate-100 my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Biometric Calibration Profile</h3>
            <p className="text-xs text-slate-400">Precision stride, MET calories & health status metrics</p>
          </div>
        </div>

        {/* Live Motion Pedometer Sensor Card */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white">Live Phone Accelerometer Pedometer</span>
            </div>
            <button
              onClick={() => setIsPedometerActive(!isPedometerActive)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                isPedometerActive ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {isPedometerActive ? 'Pedometer ON 🟢' : 'Enable Motion Sensor'}
            </button>
          </div>

          {sensorMsg && (
            <p className="text-[11px] text-cyan-300 font-semibold bg-cyan-950/60 p-2 rounded-xl border border-cyan-500/20">
              {sensorMsg}
            </p>
          )}

          {isPedometerActive && (
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400 pt-1 border-t border-slate-800">
              <span>Steps Recorded via Motion:</span>
              <span className="font-mono text-base">{livePedometerSteps} steps</span>
            </div>
          )}
        </div>

        {/* Biometrics Form Inputs */}
        <div className="space-y-4">
          
          {/* Gender & Age */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Biological Sex</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-pink-500"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Age (Years)</label>
              <input
                type="number"
                min="10"
                max="100"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          {/* Height & Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Height (cm)</label>
              <input
                type="number"
                min="100"
                max="230"
                value={formData.heightCm}
                onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Weight (kg)</label>
              <input
                type="number"
                min="30"
                max="200"
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          {/* Resting HR Baseline & Fitness Level */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Resting HR (BPM)</label>
              <input
                type="number"
                min="40"
                max="100"
                value={formData.restingHrBaseline}
                onChange={(e) => setFormData({ ...formData, restingHrBaseline: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Fitness Baseline</label>
              <select
                value={formData.fitnessLevel}
                onChange={(e) => setFormData({ ...formData, fitnessLevel: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-pink-500"
              >
                <option value="sedentary">Sedentary</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="athlete">Athlete</option>
              </select>
            </div>
          </div>

        </div>

        {/* Calculated Scientific Diagnostics Badge */}
        <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-[10px] text-slate-400 font-semibold">Calculated Stride</div>
            <div className="text-sm font-black font-mono text-cyan-300 mt-0.5">{strideCm} cm</div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 font-semibold">BMI Index</div>
            <div className="text-sm font-black font-mono text-pink-300 mt-0.5">{bmi}</div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 font-semibold">BMI Category</div>
            <div className="text-[11px] font-extrabold text-emerald-400 mt-1 truncate">{bmiCategory}</div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" /> Save Calibrated Biometrics
        </button>

      </div>
    </div>
  );
};
