import React, { useState, useRef, useEffect } from 'react';
import { WatchDevice } from '../types/watch';
import { 
  Bluetooth, 
  QrCode, 
  RotateCcw, 
  Camera, 
  Check, 
  AlertTriangle, 
  Wifi, 
  Zap, 
  Smartphone, 
  Radio, 
  RefreshCw,
  Watch
} from 'lucide-react';

interface PairingManagerProps {
  device: WatchDevice;
  onUpdateDevice: (updatedDevice: WatchDevice) => void;
  onResetWatch: () => void;
}

export const PairingManager: React.FC<PairingManagerProps> = ({
  device,
  onUpdateDevice,
  onResetWatch,
}) => {
  const [activeMode, setActiveMode] = useState<'qr' | 'ble' | 'reset'>('qr');
  
  // Camera Scanner state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  // Simulated BLE Scan state
  const [isScanningBle, setIsScanningBle] = useState<boolean>(false);
  const [bleDevices, setBleDevices] = useState<
    { name: string; mac: string; rssi: number; model: string }[]
  >([]);

  // Reset confirmation modal
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [pairSuccessMsg, setPairSuccessMsg] = useState<string | null>(null);

  // Start Camera QR Scanner Stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.warn('Camera stream error:', err);
      setCameraError('Camera access unavailable. You can use the Huafit Test QR button below!');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  // Simulate scanning QR Code
  const handleSimulateQrScan = (modelName: string, mac: string) => {
    stopCamera();
    onUpdateDevice({
      ...device,
      deviceName: modelName,
      macAddress: mac,
      connectionStatus: 'connected',
      lastSyncTime: 'Just now',
    });
    setPairSuccessMsg(`🎉 Successfully paired with ${modelName} via Gyuun QR Scan!`);
    setTimeout(() => setPairSuccessMsg(null), 4000);
  };

  // Bluetooth LE Scan Handler
  const handleBleScan = async () => {
    setIsScanningBle(true);
    setBleDevices([]);

    // Web Bluetooth API attempt
    if ('bluetooth' in navigator) {
      try {
        // @ts-ignore
        const bleDevice = await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ['battery_service', 'heart_rate'],
        });
        if (bleDevice) {
          onUpdateDevice({
            ...device,
            deviceName: bleDevice.name || 'The Gyuuun Watch GT BLE',
            connectionStatus: 'connected',
            lastSyncTime: 'Just now',
          });
          setPairSuccessMsg(`🎉 Paired with ${bleDevice.name || 'The Gyuuun Watch'} via Web Bluetooth!`);
          setIsScanningBle(false);
          return;
        }
      } catch (e) {
        console.warn('Web Bluetooth picker dismissed or unsupported, using BLE simulator', e);
      }
    }

    // Fallback Bluetooth Simulator
    setTimeout(() => {
      setBleDevices([
        { name: 'The Gyuuun Watch GT Usagyuun Ed.', mac: 'C4:8E:51:88:9F:22', rssi: -58, model: 'GYUUUN-VTUBER-X1' },
        { name: 'The Gyuuun Active Band Pro', mac: 'A1:7B:33:99:11:88', rssi: -68, model: 'GYUUUN-ACTIVE-8' },
        { name: 'The Gyuuun Watch Ultra Titanium', mac: 'E8:90:12:44:00:11', rssi: -75, model: 'GYUUUN-ULTRA-PRO' },
      ]);
      setIsScanningBle(false);
    }, 1500);
  };

  const handleConnectBleDevice = (name: string, mac: string) => {
    onUpdateDevice({
      ...device,
      deviceName: name,
      macAddress: mac,
      connectionStatus: 'connected',
      lastSyncTime: 'Just now',
    });
    setPairSuccessMsg(`🎉 Connected to ${name} via Bluetooth LE!`);
    setTimeout(() => setPairSuccessMsg(null), 4000);
  };

  const handleExecuteReset = () => {
    onResetWatch();
    setShowResetConfirm(false);
    setPairSuccessMsg('⚠️ Smart Watch successfully restored to factory defaults.');
    setTimeout(() => setPairSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bluetooth className="w-5 h-5 text-pink-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Device Pairing & Watch Management</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Scan Huafit watch screen QR codes, discover Bluetooth LE devices, and manage factory resets.
          </p>
        </div>

        {/* Current Paired Device Badge */}
        <div className="bg-slate-950 px-3.5 py-2 rounded-2xl border border-slate-800 flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${
            device.connectionStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
          }`} />
          <div>
            <div className="text-xs font-bold text-white">{device.deviceName}</div>
            <div className="text-[10px] text-slate-400 font-mono">{device.macAddress}</div>
          </div>
        </div>
      </div>

      {pairSuccessMsg && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          {pairSuccessMsg}
        </div>
      )}

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => {
            setActiveMode('qr');
            stopCamera();
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeMode === 'qr'
              ? 'bg-pink-600/20 text-pink-300 border border-pink-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <QrCode className="w-4 h-4" />
          Scan Gyuun Watch QR Code
        </button>

        <button
          onClick={() => {
            setActiveMode('ble');
            stopCamera();
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeMode === 'ble'
              ? 'bg-pink-600/20 text-pink-300 border border-pink-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bluetooth className="w-4 h-4" />
          Bluetooth LE Scan
        </button>

        <button
          onClick={() => {
            setActiveMode('reset');
            stopCamera();
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeMode === 'reset'
              ? 'bg-red-600/20 text-red-300 border border-red-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          Reset Smart Watch
        </button>
      </div>

      {/* Mode 1: QR Code Scanner */}
      {activeMode === 'qr' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Camera Feed Container */}
          <div className="lg:col-span-7 bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-pink-400" />
                Live Camera QR Scanner
              </span>

              {!isCameraActive ? (
                <button
                  onClick={startCamera}
                  className="px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" /> Start Camera
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
                >
                  Stop Camera
                </button>
              )}
            </div>

            {/* Video Viewport / Reticle */}
            <div className="relative w-full h-64 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
              {isCameraActive ? (
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4 space-y-2">
                  <QrCode className="w-12 h-12 text-slate-600 mx-auto animate-pulse" />
                  <p className="text-xs text-slate-400">
                    Point your phone camera at the QR code shown on your Huafit Watch screen.
                  </p>
                </div>
              )}

              {/* Targeting Overlay Frame */}
              <div className="absolute inset-12 border-2 border-pink-500/80 rounded-2xl pointer-events-none flex flex-col justify-between p-2 shadow-[0_0_20px_rgba(236,72,153,0.4)]">
                <div className="flex justify-between">
                  <span className="w-3 h-3 border-t-2 border-l-2 border-pink-400" />
                  <span className="w-3 h-3 border-t-2 border-r-2 border-pink-400" />
                </div>
                <div className="flex justify-between">
                  <span className="w-3 h-3 border-b-2 border-l-2 border-pink-400" />
                  <span className="w-3 h-3 border-b-2 border-r-2 border-pink-400" />
                </div>
              </div>
            </div>

            {cameraError && (
              <p className="text-xs text-amber-400 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                {cameraError}
              </p>
            )}
          </div>

          {/* Test QR Sample Generator */}
          <div className="lg:col-span-5 bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-4">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Instant Test QR Code pairing
            </span>
            <p className="text-xs text-slate-400">
              Click any sample Huafit Watch model to simulate instant camera QR scanning:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleSimulateQrScan('Huafit Watch GT Usagyuun Ed.', 'C4:8E:51:88:9F:22')}
                className="w-full p-3 bg-slate-950 hover:bg-slate-800 rounded-2xl border border-slate-800 text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Watch className="w-3.5 h-3.5 text-pink-400" />
                    Huafit Watch GT Usagyuun Ed.
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">QR: HUAFIT-VTUBER-X1-8821</div>
                </div>
                <Check className="w-4 h-4 text-pink-400" />
              </button>

              <button
                onClick={() => handleSimulateQrScan('Huafit Active Band Pro', 'A1:7B:33:99:11:88')}
                className="w-full p-3 bg-slate-950 hover:bg-slate-800 rounded-2xl border border-slate-800 text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Watch className="w-3.5 h-3.5 text-cyan-400" />
                    Huafit Active Band Pro
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">QR: HUAFIT-ACTIVE-8820</div>
                </div>
                <Check className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Mode 2: Bluetooth LE Scan */}
      {activeMode === 'ble' && (
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Bluetooth className="w-4 h-4 text-cyan-400" />
              Bluetooth Low Energy (BLE) Discovery
            </span>

            <button
              onClick={handleBleScan}
              disabled={isScanningBle}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanningBle ? 'animate-spin' : ''}`} />
              {isScanningBle ? 'Scanning Bluetooth...' : 'Scan Nearby Huafit Watches'}
            </button>
          </div>

          <div className="space-y-2">
            {bleDevices.length === 0 && !isScanningBle && (
              <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                Click "Scan Nearby Huafit Watches" to trigger Web Bluetooth / BLE discovery.
              </div>
            )}

            {isScanningBle && (
              <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-cyan-400 text-xs font-bold animate-pulse flex items-center justify-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400 animate-spin" />
                Searching for active Bluetooth broadcast signals...
              </div>
            )}

            {bleDevices.map((dev, i) => (
              <div
                key={i}
                className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Bluetooth className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{dev.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {dev.mac} · RSSI: {dev.rssi} dBm
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleConnectBleDevice(dev.name, dev.mac)}
                  className="px-3.5 py-1.5 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-xl shadow transition-colors"
                >
                  Pair Device
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mode 3: Factory Reset Smart Watch */}
      {activeMode === 'reset' && (
        <div className="bg-slate-900 p-5 rounded-3xl border border-red-500/30 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            Reset Smart Watch to Factory Defaults
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Performing a factory reset will clear the watch RAM cache, restore default Usagyuun watch faces, reset time settings to 12h, and unpair Bluetooth connection.
          </p>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/20 flex items-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Initiate Factory Reset
          </button>
        </div>
      )}

      {/* Factory Reset Modal Confirmation */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/40 rounded-3xl p-6 max-w-md w-full space-y-5 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Confirm Factory Reset?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to reset {device.deviceName}? All cached health logs will be saved to Firebase before unpairing.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteReset}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/30"
              >
                Yes, Reset Watch
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
