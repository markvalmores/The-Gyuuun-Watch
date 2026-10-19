import React, { useState } from 'react';
import { WatchFace, ClockStyle, TimePosition, BackgroundType } from '../types/watch';
import { presetWatchFaces } from '../data/initialData';
import { 
  Palette, 
  Sparkles, 
  Check, 
  Upload, 
  Plus, 
  Layers, 
  Clock, 
  Footprints, 
  Heart, 
  Battery, 
  Save, 
  RotateCcw,
  Zap
} from 'lucide-react';

interface WallpaperStudioProps {
  currentFace: WatchFace;
  onUpdateFace: (updatedFace: WatchFace) => void;
  savedFaces: WatchFace[];
  onSaveNewFace: (newFace: WatchFace) => void;
  onSelectFace: (face: WatchFace) => void;
}

export const WallpaperStudio: React.FC<WallpaperStudioProps> = ({
  currentFace,
  onUpdateFace,
  savedFaces,
  onSaveNewFace,
  onSelectFace,
}) => {
  const [faceTitle, setFaceTitle] = useState<string>(currentFace.title || 'My Custom Usagyuun Face');
  const [customImageUrl, setCustomImageUrl] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Gradient options
  const gradientPresets = [
    { name: 'Usagyuun Stage', value: 'linear-gradient(135deg, #7000ff 0%, #ff007f 50%, #00f0ff 100%)' },
    { name: 'Cyber Neon', value: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)' },
    { name: 'Kawaii Cloud', value: 'linear-gradient(135deg, #fce7f3 0%, #e0e7ff 50%, #f3e8ff 100%)' },
    { name: 'Sunset Athletic', value: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' },
    { name: 'AMOLED Pure Dark', value: 'radial-gradient(circle at center, #111827 0%, #000000 100%)' },
    { name: 'Electric Lime', value: 'linear-gradient(135deg, #064e3b 0%, #10b981 50%, #a3e635 100%)' },
  ];

  // Font options
  const fontStyles: { id: ClockStyle; label: string; sample: string }[] = [
    { id: 'vtuber', label: 'VTuber Bold', sample: '12:45' },
    { id: 'digital', label: 'Digital Matrix', sample: '12:45' },
    { id: 'cyber', label: 'Cyberpunk Neon', sample: '12:45' },
    { id: 'rounded', label: 'Kawaii Rounded', sample: '12:45' },
    { id: 'classic', label: 'Classic Elegance', sample: '12:45' },
  ];

  // Font colors
  const colorSwatches = [
    '#ffffff', '#f472b6', '#38bdf8', '#4ade80', '#facc15', '#a855f7', '#fb923c', '#e2e8f0'
  ];

  // Complication options
  const availableComplications = [
    { id: 'steps', label: 'Step Counter', icon: Footprints },
    { id: 'hr', label: 'Heart Rate', icon: Heart },
    { id: 'usagyuun_mascot', label: 'Usagyuun Mascot', icon: Zap },
    { id: 'battery', label: 'Battery Level', icon: Battery },
  ];

  const handleComplicationToggle = (id: string) => {
    let updatedComplications = [...currentFace.complications];
    if (updatedComplications.includes(id)) {
      updatedComplications = updatedComplications.filter((c) => c !== id);
    } else {
      updatedComplications.push(id);
    }
    onUpdateFace({ ...currentFace, complications: updatedComplications });
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setCustomImageUrl(url);
        onUpdateFace({
          ...currentFace,
          bgType: 'custom_image',
          bgValue: `url(${url}) center/cover no-repeat`,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveToGallery = () => {
    const newFace: WatchFace = {
      ...currentFace,
      id: `custom-face-${Date.now()}`,
      title: faceTitle,
      createdAt: new Date().toISOString(),
    };
    onSaveNewFace(newFace);
    setSaveSuccessMsg('✨ Watch Face synced & saved to gallery!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-pink-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Custom Wallpaper Studio</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Design, personalize & upload custom watch faces synced directly to your Huafit Watch!
          </p>
        </div>

        <button
          onClick={handleSaveToGallery}
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-pink-500/20 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap"
        >
          <Save className="w-4 h-4" />
          Sync & Save Watch Face
        </button>
      </div>

      {saveSuccessMsg && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          {saveSuccessMsg}
        </div>
      )}

      {/* Main Studio Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Customization Panel */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Watch Face Title Input */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Watch Face Title
            </label>
            <input
              type="text"
              value={faceTitle}
              onChange={(e) => {
                setFaceTitle(e.target.value);
                onUpdateFace({ ...currentFace, title: e.target.value });
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-pink-500"
              placeholder="e.g. Usagyuun Party Edition"
            />
          </div>

          {/* Background Selector */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-pink-400" />
                Select Background Wallpaper
              </span>
            </div>

            {/* Gradient Presets */}
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
              {gradientPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    onUpdateFace({
                      ...currentFace,
                      bgType: 'gradient',
                      bgValue: preset.value,
                    })
                  }
                  className={`h-16 rounded-xl border-2 flex flex-col justify-end p-2 transition-all relative overflow-hidden ${
                    currentFace.bgValue === preset.value ? 'border-pink-500 shadow-md shadow-pink-500/30' : 'border-slate-800 hover:border-slate-700'
                  }`}
                  style={{ background: preset.value }}
                >
                  <span className="text-[10px] font-bold text-white drop-shadow truncate">
                    {preset.name}
                  </span>
                  {currentFace.bgValue === preset.value && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Custom Image Upload */}
            <div className="pt-2 border-t border-slate-800">
              <label className="flex items-center justify-center gap-2 p-3 bg-slate-950 hover:bg-slate-800/80 rounded-xl border border-dashed border-slate-700 cursor-pointer text-xs font-semibold text-slate-300 transition-colors">
                <Upload className="w-4 h-4 text-pink-400" />
                Upload Custom Image / Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Clock Font Style & Color */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-4">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              Clock Font Style & Color
            </span>

            {/* Font Styles */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {fontStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => onUpdateFace({ ...currentFace, fontStyle: style.id })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    currentFace.fontStyle === style.id
                      ? 'bg-pink-600/20 border-pink-500 text-pink-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-[10px] font-medium text-slate-400">{style.label}</div>
                  <div className="text-sm font-bold text-white">{style.sample}</div>
                </button>
              ))}
            </div>

            {/* Color Swatches */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400">Clock Text Color</span>
              <div className="flex items-center gap-2 flex-wrap">
                {colorSwatches.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => onUpdateFace({ ...currentFace, fontColor: color })}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      currentFace.fontColor === color ? 'border-pink-500 scale-110 shadow-md' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Complications / Active Widgets */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Watch Face Complications & Widgets
            </span>
            <div className="grid grid-cols-2 gap-2">
              {availableComplications.map((comp) => {
                const IconComponent = comp.icon;
                const isSelected = currentFace.complications.includes(comp.id);
                return (
                  <button
                    key={comp.id}
                    onClick={() => handleComplicationToggle(comp.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all text-xs font-bold ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-cyan-400" />
                      <span>{comp.label}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Preset Gallery */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Presets & Saved Gallery
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {savedFaces.length} Faces
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
              {savedFaces.map((face) => (
                <div
                  key={face.id}
                  onClick={() => onSelectFace(face)}
                  className={`cursor-pointer rounded-2xl border-2 p-3 transition-all relative overflow-hidden flex flex-col justify-between h-36 shadow-lg ${
                    currentFace.id === face.id ? 'border-pink-500 ring-2 ring-pink-500/30' : 'border-slate-800 hover:border-slate-700'
                  }`}
                  style={{ background: face.bgValue }}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold text-white drop-shadow">
                    <span className="truncate max-w-[90px] bg-black/40 px-1.5 py-0.5 rounded">
                      {face.title}
                    </span>
                    {face.isActive && (
                      <span className="bg-pink-500 text-white px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="text-center font-bold text-xl drop-shadow" style={{ color: face.fontColor }}>
                    12:45
                  </div>

                  <div className="flex items-center gap-1 text-[9px] text-white/80 bg-black/40 px-1.5 py-0.5 rounded w-max">
                    <Zap className="w-2.5 h-2.5 text-yellow-300" />
                    <span>{face.complications.length} Widgets</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
