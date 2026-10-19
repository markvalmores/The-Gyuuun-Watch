export type WatchConnectionStatus = 'connected' | 'disconnected' | 'pairing' | 'syncing';

export interface WatchDevice {
  id: string;
  deviceName: string;
  modelCode: string;
  macAddress: string;
  batteryLevel: number; // 0 to 100
  isCharging: boolean;
  connectionStatus: WatchConnectionStatus;
  firmwareVersion: string;
  lastSyncTime: string;
  rssi: number; // dBm signal strength e.g. -62
  bluetoothSupported: boolean;
}

export type TimeFormat = '12h' | '24h';
export type ClockStyle = 'digital' | 'cyber' | 'rounded' | 'classic' | 'vtuber';
export type TimePosition = 'top' | 'center' | 'bottom';

export interface TimeSettings {
  timeFormat: TimeFormat;
  timeZone: string;
  autoSyncTime: boolean;
  screenTimeout: number; // seconds, 0 = Always On
  brightness: number; // 1-100
  liftToWake: boolean;
  alwaysOnDisplay: boolean;
  aodStyle: string;
  widgets: string[]; // enabled widget IDs
}

export type BackgroundType = 'preset' | 'gradient' | 'custom_image' | 'usagyuun_animated';

export interface WatchFace {
  id: string;
  title: string;
  bgType: BackgroundType;
  bgValue: string; // preset ID, gradient CSS, or image URL
  fontStyle: ClockStyle;
  fontColor: string; // hex
  timePosition: TimePosition;
  complications: string[]; // e.g. ['steps', 'hr', 'usagyuun_mascot', 'battery', 'weather']
  isActive: boolean;
  createdAt: string;
}

export interface HourlyMetric {
  hour: string; // e.g. "08:00"
  steps: number;
  heartRate: number;
}

export interface ActivityMetrics {
  steps: number;
  stepGoal: number;
  calories: number; // kcal
  distanceKm: number;
  activeMinutes: number;
  heartRateCurrent: number;
  heartRateRest: number;
  heartRateMax: number;
  spO2: number; // percentage
  stressLevel: number; // 0-100
  sleepHours: number;
  sleepScore: number;
  sleepDeepMinutes: number;
  sleepLightMinutes: number;
  sleepRemMinutes: number;
  sleepAwakeMinutes: number;
  hourlyData: HourlyMetric[];
  lastSyncedAt: string;
}

export interface UserBiometrics {
  gender: 'male' | 'female' | 'other';
  age: number;
  heightCm: number;
  weightKg: number;
  restingHrBaseline: number;
  fitnessLevel: 'sedentary' | 'moderate' | 'active' | 'athlete';
  pedometerSensitivity: 'low' | 'medium' | 'high';
}

export interface HealthStatusEvaluation {
  overallScore: number; // 0 - 100
  statusRating: 'Optimal Biometrics' | 'Excellent Health' | 'Balanced Vitals' | 'Mild Fatigue' | 'Recovery Recommended';
  bmi: number;
  bmiCategory: string;
  strideLengthCm: number;
  metCalorieRate: number; // kcal/min
  cardioZone: 'Warm-up / Recovery' | 'Fat Burn Zone' | 'Aerobic Endurance' | 'Anaerobic Peak';
  vo2MaxEstimate: number; // ml/kg/min
  recommendations: string[];
}

export interface WorkoutSession {
  id: string;
  type: 'Usagyuun Dance Cardio' | 'Outdoor Run' | 'Cycling' | 'Jump Rope' | 'HIIT' | 'Walking';
  durationSeconds: number;
  caloriesBurned: number;
  distanceKm: number;
  avgBpm: number;
  maxBpm: number;
  usagyuunCheers: number;
  timestamp: string;
}

export interface FirmwareInfo {
  currentVersion: string;
  latestVersion: string;
  releaseDate: string;
  sizeMb: number;
  changelog: string[];
  isUpdateAvailable: boolean;
  updateStatus: 'up_to_date' | 'downloading' | 'flashing' | 'rebooting' | 'completed';
  downloadProgress: number; // 0-100
}

export interface UsagyuunMood {
  state: 'dancing' | 'cheering' | 'sleeping' | 'highfive' | 'streaming';
  energyLevel: number; // 0-100
  cheerCount: number;
  currentQuote: string;
}
