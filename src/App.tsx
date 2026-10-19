import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { VirtualWatchMockup } from './components/VirtualWatchMockup';
import { UsagyuunCompanionWidget } from './components/UsagyuunCompanionWidget';
import { WallpaperStudio } from './components/WallpaperStudio';
import { TimeDisplaySettings } from './components/TimeDisplaySettings';
import { ActivityTrackingDashboard } from './components/ActivityTrackingDashboard';
import { WorkoutTrackerModal } from './components/WorkoutTrackerModal';
import { PairingManager } from './components/PairingManager';
import { DeviceUtilities } from './components/DeviceUtilities';
import { AuthModal } from './components/AuthModal';
import { ModelPickerModal } from './components/ModelPickerModal';
import { BiometricCalibrationModal } from './components/BiometricCalibrationModal';
import { FloatingSettingsBubble } from './components/FloatingSettingsBubble';
import { ScreenshotPreviewModal } from './components/ScreenshotPreviewModal';

import { 
  WatchDevice, 
  TimeSettings, 
  WatchFace, 
  ActivityMetrics, 
  WorkoutSession, 
  FirmwareInfo, 
  UsagyuunMood,
  UserBiometrics
} from './types/watch';

import { watchCatalogue, SmartWatchModel } from './data/watchCatalogue';
import { defaultBiometrics } from './utils/healthCalculators';

import { 
  initialDevice, 
  initialTimeSettings, 
  presetWatchFaces, 
  initialActivityMetrics, 
  sampleWorkouts, 
  initialFirmware, 
  initialUsagyuunMood,
  usagyuunQuotes
} from './data/initialData';

import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'studio' | 'settings' | 'pairing' | 'utilities'>('dashboard');

  // Core Smartwatch Model & Device States
  const [currentModel, setCurrentModel] = useState<SmartWatchModel>(watchCatalogue[0]);
  const [device, setDevice] = useState<WatchDevice>(initialDevice);
  const [timeSettings, setTimeSettings] = useState<TimeSettings>(initialTimeSettings);
  const [activeWatchFace, setActiveWatchFace] = useState<WatchFace>(presetWatchFaces[0]);
  const [savedWatchFaces, setSavedWatchFaces] = useState<WatchFace[]>(presetWatchFaces);
  const [activityMetrics, setActivityMetrics] = useState<ActivityMetrics>(initialActivityMetrics);
  const [biometrics, setBiometrics] = useState<UserBiometrics>(defaultBiometrics);
  const [workouts, setWorkouts] = useState<WorkoutSession[]>(sampleWorkouts);
  const [firmware, setFirmware] = useState<FirmwareInfo>(initialFirmware);
  const [usagyuunMood, setUsagyuunMood] = useState<UsagyuunMood>(initialUsagyuunMood);

  // App UI States
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isFindingWatch, setIsFindingWatch] = useState<boolean>(false);
  const [timerWatchSeconds, setTimerWatchSeconds] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isModelPickerOpen, setIsModelPickerOpen] = useState<boolean>(false);
  const [isCalibrationOpen, setIsCalibrationOpen] = useState<boolean>(false);
  const [workoutModalOpen, setWorkoutModalOpen] = useState<boolean>(false);

  // Screenshot Preview State
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [isScreenshotModalOpen, setIsScreenshotModalOpen] = useState<boolean>(false);

  // Auth Listener & Real Device Battery Sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const settingsRef = doc(db, 'users', user.uid, 'settings', 'default');
          const settingsSnap = await getDoc(settingsRef);
          if (settingsSnap.exists()) {
            setTimeSettings(settingsSnap.data() as TimeSettings);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${user.uid}/settings/default`);
        }
      }
    });

    let batteryInstance: any = null;
    const handleBatteryUpdate = (b: any) => {
      const realLevel = Math.round(b.level * 100);
      const realCharging = b.charging;
      setDevice((prev) => ({
        ...prev,
        batteryLevel: realLevel,
        isCharging: realCharging,
      }));
    };

    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        batteryInstance = battery;
        handleBatteryUpdate(battery);

        battery.addEventListener('levelchange', () => handleBatteryUpdate(battery));
        battery.addEventListener('chargingchange', () => handleBatteryUpdate(battery));
      }).catch((err: any) => {
        console.warn('Device Battery API restricted or unavailable in context:', err);
      });
    }

    return () => {
      unsubscribe();
      if (batteryInstance) {
        batteryInstance.removeEventListener('levelchange', () => handleBatteryUpdate(batteryInstance));
        batteryInstance.removeEventListener('chargingchange', () => handleBatteryUpdate(batteryInstance));
      }
    };
  }, []);

  const handleUpdateSettings = async (newSettings: TimeSettings) => {
    setTimeSettings(newSettings);
    if (currentUser) {
      try {
        await setDoc(doc(db, 'users', currentUser.uid, 'settings', 'default'), newSettings);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}/settings/default`);
      }
    }
  };

  const handleSyncData = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setActivityMetrics((prev) => ({
        ...prev,
        steps: prev.steps + Math.floor(Math.random() * 80 + 20),
        calories: prev.calories + Math.floor(Math.random() * 8 + 2),
        lastSyncedAt: new Date().toISOString(),
      }));
      setDevice((prev) => ({
        ...prev,
        lastSyncTime: 'Just now',
      }));
      setIsSyncing(false);
    }, 1200);
  };

  const handleCheer = () => {
    setUsagyuunMood((prev) => {
      const nextCount = prev.cheerCount + 1;
      const nextQuote = usagyuunQuotes[nextCount % usagyuunQuotes.length];
      return {
        ...prev,
        cheerCount: nextCount,
        currentQuote: nextQuote,
        energyLevel: Math.min(100, prev.energyLevel + 5),
      };
    });

    setActivityMetrics((prev) => ({
      ...prev,
      steps: prev.steps + 25,
      calories: prev.calories + 3,
    }));
  };

  const handleStepIncrement = (add: number) => {
    setActivityMetrics((prev) => ({
      ...prev,
      steps: prev.steps + add,
    }));
  };

  const handleSaveNewWatchFace = async (newFace: WatchFace) => {
    const updatedGallery = [newFace, ...savedWatchFaces];
    setSavedWatchFaces(updatedGallery);
    setActiveWatchFace(newFace);

    if (currentUser) {
      try {
        await setDoc(doc(db, 'users', currentUser.uid, 'wallpapers', newFace.id), newFace);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}/wallpapers/${newFace.id}`);
      }
    }
  };

  const handleResetWatch = () => {
    setDevice(initialDevice);
    setTimeSettings(initialTimeSettings);
    setActiveWatchFace(presetWatchFaces[0]);
    setActivityMetrics(initialActivityMetrics);
    setUsagyuunMood(initialUsagyuunMood);
    setCurrentModel(watchCatalogue[0]);
    setBiometrics(defaultBiometrics);
  };

  const handleCaptureScreenshot = (dataUrl: string) => {
    setScreenshotUrl(dataUrl);
    setIsScreenshotModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        device={device}
        currentModel={currentModel}
        onOpenModelPicker={() => setIsModelPickerOpen(true)}
        onSync={handleSyncData}
        isSyncing={isSyncing}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Top Split View: Virtual Smart Watch + Companion Mascot */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/60 p-6 rounded-3xl border border-slate-800/80 backdrop-blur-sm shadow-2xl">
          
          {/* Smart Watch Mockup Interactive Display */}
          <div className="lg:col-span-5 flex justify-center">
            <VirtualWatchMockup
              watchFace={activeWatchFace}
              timeSettings={timeSettings}
              activityMetrics={activityMetrics}
              device={device}
              usagyuunMood={usagyuunMood}
              currentModel={currentModel}
              isFindingWatch={isFindingWatch}
              timerSeconds={timerWatchSeconds}
              onCheerClick={handleCheer}
            />
          </div>

          {/* Usagyuun VTuber Cheer Companion Card */}
          <div className="lg:col-span-7">
            <UsagyuunCompanionWidget
              mood={usagyuunMood}
              activityMetrics={activityMetrics}
              onCheer={handleCheer}
            />
          </div>

        </section>

        {/* Tab Navigation Views */}
        <section className="transition-all duration-300">
          
          {activeTab === 'dashboard' && (
            <ActivityTrackingDashboard
              activityMetrics={activityMetrics}
              workouts={workouts}
              biometrics={biometrics}
              onSyncData={handleSyncData}
              isSyncing={isSyncing}
              onOpenWorkoutModal={() => setWorkoutModalOpen(true)}
              onOpenCalibrationModal={() => setIsCalibrationOpen(true)}
            />
          )}

          {activeTab === 'studio' && (
            <WallpaperStudio
              currentFace={activeWatchFace}
              onUpdateFace={(face) => setActiveWatchFace(face)}
              savedFaces={savedWatchFaces}
              onSaveNewFace={handleSaveNewWatchFace}
              onSelectFace={(face) => setActiveWatchFace(face)}
            />
          )}

          {activeTab === 'settings' && (
            <TimeDisplaySettings
              settings={timeSettings}
              onUpdateSettings={handleUpdateSettings}
              onSyncTimeWithWatch={handleSyncData}
            />
          )}

          {activeTab === 'pairing' && (
            <PairingManager
              device={device}
              onUpdateDevice={(dev) => setDevice(dev)}
              onResetWatch={handleResetWatch}
            />
          )}

          {activeTab === 'utilities' && (
            <DeviceUtilities
              firmware={firmware}
              onUpdateFirmware={(fw) => setFirmware(fw)}
              onSetWatchTimer={(secs) => setTimerWatchSeconds(secs)}
              onTriggerFindMyWatch={() => {
                setIsFindingWatch(true);
                setTimeout(() => setIsFindingWatch(false), 5000);
              }}
              device={device}
            />
          )}

        </section>

      </main>

      {/* Floating Settings & Screenshot Bubble */}
      <FloatingSettingsBubble
        settings={timeSettings}
        onUpdateSettings={handleUpdateSettings}
        device={device}
        currentModel={currentModel}
        onOpenModelPicker={() => setIsModelPickerOpen(true)}
        onOpenCalibrationModal={() => setIsCalibrationOpen(true)}
        onSync={handleSyncData}
        onCaptureScreenshot={handleCaptureScreenshot}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-500 py-6 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            The Gyuuun Watch by Usagyuun VTuber · Powered by Google AI Studio
          </span>
          <span className="text-slate-400 font-mono">
            Equipped: {currentModel.name} · Model Code: {device.modelCode}
          </span>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
      />

      <ModelPickerModal
        isOpen={isModelPickerOpen}
        onClose={() => setIsModelPickerOpen(false)}
        currentModel={currentModel}
        onSelectModel={(model) => {
          setCurrentModel(model);
          setDevice((prev) => ({
            ...prev,
            deviceName: model.name,
            modelCode: model.id.toUpperCase(),
          }));
        }}
      />

      <BiometricCalibrationModal
        isOpen={isCalibrationOpen}
        onClose={() => setIsCalibrationOpen(false)}
        biometrics={biometrics}
        onUpdateBiometrics={(b) => setBiometrics(b)}
        onStepIncrement={handleStepIncrement}
      />

      <WorkoutTrackerModal
        isOpen={workoutModalOpen}
        onClose={() => setWorkoutModalOpen(false)}
        onSaveWorkout={(workout) => setWorkouts([workout, ...workouts])}
      />

      <ScreenshotPreviewModal
        isOpen={isScreenshotModalOpen}
        onClose={() => setIsScreenshotModalOpen(false)}
        imageUrl={screenshotUrl}
        modelName={currentModel.name}
      />

    </div>
  );
}
