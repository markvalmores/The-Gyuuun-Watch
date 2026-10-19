import { 
  WatchDevice, 
  TimeSettings, 
  WatchFace, 
  ActivityMetrics, 
  WorkoutSession, 
  FirmwareInfo, 
  UsagyuunMood 
} from '../types/watch';

export const initialDevice: WatchDevice = {
  id: 'gyuuun-vtuber-8821',
  deviceName: 'The Gyuuun Watch GT Usagyuun Edition',
  modelCode: 'GYUUUN-VTUBER-X1',
  macAddress: 'C4:8E:51:88:9F:22',
  batteryLevel: 88,
  isCharging: false,
  connectionStatus: 'connected',
  firmwareVersion: 'v3.2.0-USAGYUUN',
  lastSyncTime: 'Just now',
  rssi: -58,
  bluetoothSupported: true,
};

export const initialTimeSettings: TimeSettings = {
  timeFormat: '12h',
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Tokyo',
  autoSyncTime: true,
  screenTimeout: 15,
  brightness: 85,
  liftToWake: true,
  alwaysOnDisplay: true,
  aodStyle: 'usagyuun',
  widgets: ['steps', 'hr', 'usagyuun_mascot', 'battery', 'weather', 'sleep'],
};

export const presetWatchFaces: WatchFace[] = [
  {
    id: 'face-usagyuun-stage',
    title: 'Usagyuun VTuber Concert',
    bgType: 'usagyuun_animated',
    bgValue: 'linear-gradient(135deg, #7000ff 0%, #ff007f 50%, #00f0ff 100%)',
    fontStyle: 'vtuber',
    fontColor: '#ffffff',
    timePosition: 'top',
    complications: ['steps', 'usagyuun_mascot', 'battery', 'hr'],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'face-cyber-bunny',
    title: 'Cyberpunk Neon Rabbit',
    bgType: 'gradient',
    bgValue: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)',
    fontStyle: 'cyber',
    fontColor: '#38bdf8',
    timePosition: 'center',
    complications: ['steps', 'hr', 'battery'],
    isActive: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'face-kawaii-pastel',
    title: 'Cozy Cloud Usagyuun',
    bgType: 'gradient',
    bgValue: 'linear-gradient(135deg, #fce7f3 0%, #e0e7ff 50%, #f3e8ff 100%)',
    fontStyle: 'rounded',
    fontColor: '#4338ca',
    timePosition: 'top',
    complications: ['usagyuun_mascot', 'weather', 'steps'],
    isActive: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'face-minimal-amoled',
    title: 'AMOLED Dark Minimal',
    bgType: 'gradient',
    bgValue: 'radial-gradient(circle at center, #111827 0%, #000000 100%)',
    fontStyle: 'digital',
    fontColor: '#22c55e',
    timePosition: 'center',
    complications: ['steps', 'battery'],
    isActive: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'face-dance-athletic',
    title: 'Dance Cardio Gold',
    bgType: 'gradient',
    bgValue: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    fontStyle: 'classic',
    fontColor: '#ffffff',
    timePosition: 'bottom',
    complications: ['steps', 'hr', 'usagyuun_mascot'],
    isActive: false,
    createdAt: new Date().toISOString(),
  },
];

export const initialActivityMetrics: ActivityMetrics = {
  steps: 8420,
  stepGoal: 10000,
  calories: 468,
  distanceKm: 5.82,
  activeMinutes: 52,
  heartRateCurrent: 72,
  heartRateRest: 64,
  heartRateMax: 148,
  spO2: 99,
  stressLevel: 24,
  sleepHours: 7.8,
  sleepScore: 88,
  sleepDeepMinutes: 135,
  sleepLightMinutes: 240,
  sleepRemMinutes: 85,
  sleepAwakeMinutes: 8,
  hourlyData: [
    { hour: '06:00', steps: 120, heartRate: 62 },
    { hour: '08:00', steps: 1420, heartRate: 85 },
    { hour: '10:00', steps: 2310, heartRate: 78 },
    { hour: '12:00', steps: 3950, heartRate: 92 },
    { hour: '14:00', steps: 5600, heartRate: 74 },
    { hour: '16:00', steps: 7200, heartRate: 110 },
    { hour: '18:00', steps: 8420, heartRate: 72 },
  ],
  lastSyncedAt: new Date().toISOString(),
};

export const sampleWorkouts: WorkoutSession[] = [
  {
    id: 'workout-1',
    type: 'Usagyuun Dance Cardio',
    durationSeconds: 1800,
    caloriesBurned: 240,
    distanceKm: 2.1,
    avgBpm: 138,
    maxBpm: 162,
    usagyuunCheers: 18,
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'workout-2',
    type: 'Outdoor Run',
    durationSeconds: 2100,
    caloriesBurned: 310,
    distanceKm: 4.5,
    avgBpm: 145,
    maxBpm: 168,
    usagyuunCheers: 12,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'workout-3',
    type: 'Jump Rope',
    durationSeconds: 900,
    caloriesBurned: 150,
    distanceKm: 0.8,
    avgBpm: 152,
    maxBpm: 172,
    usagyuunCheers: 25,
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export const initialFirmware: FirmwareInfo = {
  currentVersion: 'v3.2.0-USAGYUUN',
  latestVersion: 'v3.2.5-USAGYUUN-PRO',
  releaseDate: 'October 2026',
  sizeMb: 14.8,
  changelog: [
    '✨ Added new Infinite Usagyuun AI Speech & Positivity Engine',
    '⚡ Optimized Bluetooth LE 5.3 battery sync algorithm',
    '❤️ Improved SpO2 and continuous HR accuracy during Dance Cardio',
    '🕒 Added 24-hour custom font rendering with live glow effects',
    '🔔 Fixed timer alert vibration pattern sync',
  ],
  isUpdateAvailable: true,
  updateStatus: 'up_to_date',
  downloadProgress: 0,
};

export const initialUsagyuunMood: UsagyuunMood = {
  state: 'dancing',
  energyLevel: 95,
  cheerCount: 42,
  currentQuote: 'WOOOOO! Let’s crush those 10,000 steps together! GO GO GO! (⁠≧⁠▽⁠≦⁠) 🐰✨',
};

// --- Massive Procedural Infinite Positivity Speech Engine ---

const energeticOpeners = [
  "WOOOOO!!",
  "HYPER DANCE POWER!!",
  "HOLD THE PHONE!!",
  "LISTEN TO USAGYUUN!!",
  "WARNING: 1000% POSITIVITY OVERLOAD!!",
  "ALERT!! MAXIMUM AWESOMENESS DETECTED!!",
  "VIBE CHECK 100/10!!",
  "BREAKING NEWS FROM VTUBER HQ!!",
  "FEET ON FIRE!!",
  "UNSTOPPABLE FORCE ENCOUNTERED!!"
];

const heartwarmingAffirmations = [
  "You are doing SO MUCH BETTER than you think! Usagyuun gives you a giant fluffy hug!",
  "Whatever made today tough, remember you are worthy, loved, and completely capable!",
  "Your smile literally boosts global happiness by +500%! Never forget that!",
  "You are an absolute superstar walking among stars! Keep your head held high!",
  "Usagyuun's rabbit sensors confirm: You have a heart of pure gold!",
  "Every single small step you take is creating a magnificent future!",
  "Take a deep breath in... and let go of stress! You are safe and doing amazing!",
  "Usagyuun is sitting right on your wrist cheering for you 24/7!"
];

const funnyMetaphors = [
  "If steps were boba pearls, you just drank an entire ocean! 🧋",
  "You burned enough energy today to power a tiny rocket ship to the moon!",
  "Ear wiggles going at 5,000 RPM in your honor right now!",
  "If being awesome was a crime, you'd be serving a lifetime sentence!",
  "Scientists just proved: You are 100% made of stardust and pure greatness!",
  "The VTuber chat is literally spamming infinite hearts for you right now!"
];

const kaomojiEndings = [
  "(⁠≧⁠▽⁠≦⁠) 🐰✨",
  "(⁠⊃⁠｡⁠•⁠́⁠‿⁠•⁠̀⁠)⁠⊃ 💖",
  "(⁠*⁠＾⁠3⁠＾⁠)⁠/⁠～⁠♡ 🎉",
  "└⁠(⁠~⁠7⁠~⁠)⁠┐ ⚡",
  "(⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)⁠❤ 🧋",
  "(⁠✧⁠ω⁠✧⁠) 🌟",
  "٩(◕‿◕)۶ 🔥",
  "(b ❛ᴗ❛)b 💕"
];

// Infinite Random Speech Combinations Generator
export function generateProceduralUsagyuunSpeech(category?: string): string {
  const opener = energeticOpeners[Math.floor(Math.random() * energeticOpeners.length)];
  const affirmation = heartwarmingAffirmations[Math.floor(Math.random() * heartwarmingAffirmations.length)];
  const metaphor = funnyMetaphors[Math.floor(Math.random() * funnyMetaphors.length)];
  const kaomoji = kaomojiEndings[Math.floor(Math.random() * kaomojiEndings.length)];

  if (category === 'comfort') {
    return `(⁠⊃⁠｡⁠•⁠́⁠‿⁠•⁠̀⁠)⁠⊃ ${affirmation} Usagyuun is always right here with you! 💖`;
  }

  if (category === 'funny') {
    return `${opener} ${metaphor} ${kaomoji}`;
  }

  if (category === 'hype') {
    return `${opener} ${affirmation} ${kaomoji}`;
  }

  // Random blend
  const rand = Math.random();
  if (rand < 0.5) {
    return `${opener} ${affirmation} ${kaomoji}`;
  } else {
    return `${opener} ${metaphor} ${kaomoji}`;
  }
}

export const usagyuunQuotes = [
  "WOOOOO! Let’s crush those 10,000 steps together! GO GO GO! (⁠≧⁠▽⁠≦⁠) 🐰✨",
  "HYPER DANCE POWER! You burned 400+ calories today! 🎉",
  "High Five!! Keep moving, VTuber Stream is LIVE on your wrist! (⁠✧⁠ω⁠✧⁠) 📺⚡",
  "Heart rate is super healthy! Time for a quick boba tea break? (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)⁠❤ 🧋",
  "Awesome sleep score last night! Usagyuun is so proud of you! (⁠⊃⁠｡⁠•⁠́⁠‿⁠•⁠̀⁠)⁠⊃ 💤💖",
  "VIBE CHECK PASSED! Ear wiggles at 100% capacity! └⁠(⁠~⁠7⁠~⁠)⁠┐ 🐰💃",
  "Firmware updated & ready for action! Let's conquer the day!",
];
