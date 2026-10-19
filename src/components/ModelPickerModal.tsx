import React, { useState, useRef } from 'react';
import { SmartWatchModel, watchCatalogue } from '../data/watchCatalogue';
import { 
  Watch, 
  X, 
  Check, 
  Sparkles, 
  Upload, 
  Sliders, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Battery, 
  Cpu, 
  Plus, 
  Palette,
  Image as ImageIcon
} from 'lucide-react';

interface ModelPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentModel: SmartWatchModel;
  onSelectModel: (model: SmartWatchModel) => void;
}

export const ModelPickerModal: React.FC<ModelPickerModalProps> = ({
  isOpen,
  onClose,
  currentModel,
  onSelectModel,
}) => {
  const [activeTab, setActiveTab] = useState<'catalogue' | 'builder' | 'upload'>('catalogue');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Builder state
  const [builderName, setBuilderName] = useState<string>('Usagyuun Hybrid Ultra');
  const [builderShape, setBuilderShape] = useState<SmartWatchModel['casingShape']>('ultra_octagonal');
  const [builderColor, setBuilderColor] = useState<string>('linear-gradient(135deg, #7000ff 0%, #ff007f 100%)');
  const [builderBorder, setBuilderBorder] = useState<string>('#ec4899');
  const [builderStrap, setBuilderStrap] = useState<SmartWatchModel['strapTexture']>('usagyuun_pink');

  // Upload PNG state
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [transparentPngUrl, setTransparentPngUrl] = useState<string | null>(null);
  const [threshold, setThreshold] = useState<number>(240); // 0-255 white threshold
  const [maskX, setMaskX] = useState<number>(0);
  const [maskY, setMaskY] = useState<number>(0);
  const [maskScale, setMaskScale] = useState<number>(100);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!isOpen) return null;

  const categories = [
    'All',
    'Apple',
    'Samsung',
    'Garmin',
    'Google/Fitbit',
    'Xiaomi/Amazfit',
    'Huawei/Honor',
    'Luxury/Pro',
  ];

  const filteredCatalogue = selectedCategory === 'All'
    ? watchCatalogue
    : watchCatalogue.filter((m) => m.category === selectedCategory);

  // Background removal canvas processor
  const processImageToTransparentPng = (imageSrc: string, targetThreshold: number) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Threshold background pixels to transparent alpha = 0
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // If pixel is near white/light grey, make it transparent
        if (r >= targetThreshold && g >= targetThreshold && b >= targetThreshold) {
          data[i + 3] = 0; // Alpha = 0
        }
      }

      ctx.putImageData(imageData, 0, 0);
      const resultDataUrl = canvas.toDataURL('image/png');
      setTransparentPngUrl(resultDataUrl);
    };
    img.src = imageSrc;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        setUploadedImageSrc(src);
        processImageToTransparentPng(src, threshold);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThresholdChange = (newVal: number) => {
    setThreshold(newVal);
    if (uploadedImageSrc) {
      processImageToTransparentPng(uploadedImageSrc, newVal);
    }
  };

  const handleEquipCustomBuilderModel = () => {
    const customModel: SmartWatchModel = {
      id: `custom-build-${Date.now()}`,
      name: builderName,
      brand: 'Custom Hybrid',
      category: 'Custom',
      casingShape: builderShape,
      material: 'Custom Alloy Composite',
      finishColor: builderColor,
      bezelBorderColor: builderBorder,
      screenAspect: builderShape === 'circle' ? 'circle' : 'curved',
      crownStyle: 'dual',
      strapTexture: builderStrap,
      description: 'Custom hybrid smartwatch design created in the Gyuun Watch Studio.',
      batteryHours: 120,
      waterproofRating: '5 ATM',
    };
    onSelectModel(customModel);
    onClose();
  };

  const handleEquipCustomPngModel = () => {
    if (!transparentPngUrl) return;
    const pngModel: SmartWatchModel = {
      id: `custom-png-${Date.now()}`,
      name: 'Custom PNG Watch Casing',
      brand: 'Custom Photo',
      category: 'Custom',
      casingShape: 'custom_png',
      material: 'Uploaded Transparent PNG Frame',
      finishColor: 'transparent',
      bezelBorderColor: '#ec4899',
      screenAspect: 'curved',
      crownStyle: 'rotary',
      strapTexture: 'silicone',
      description: 'Custom photo smartwatch with transparent background overlay.',
      batteryHours: 96,
      waterproofRating: 'Splashproof',
      customPngUrl: transparentPngUrl,
      customX: maskX,
      customY: maskY,
      customWidth: maskScale,
      customHeight: maskScale,
    };
    onSelectModel(pngModel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl my-auto p-5 sm:p-6 space-y-6 shadow-2xl relative text-slate-100 max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-pink-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Watch className="w-5 h-5 text-pink-400" />
              </div>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Smart Watch Model Catalogue (34 Models)
              </h2>
              <p className="text-xs text-slate-400">
                Choose from 34 real smartwatch models or mix brand styles & upload custom PNG frames!
              </p>
            </div>
          </div>

          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-bold text-pink-300">
            Equipped: {currentModel.name}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('catalogue')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'catalogue'
                ? 'bg-pink-600/20 text-pink-300 border border-pink-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Brand Catalogue (34 Models)
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'builder'
                ? 'bg-pink-600/20 text-pink-300 border border-pink-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ✨ Mix & Match Brand Builder
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'upload'
                ? 'bg-pink-600/20 text-pink-300 border border-pink-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🖼️ Upload Image → Transparent PNG Watch
          </button>
        </div>

        {/* Tab 1: Catalogue Picker */}
        {activeTab === 'catalogue' && (
          <div className="space-y-4 overflow-y-auto pr-1 flex-1">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-pink-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Model Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredCatalogue.map((model) => {
                const isSelected = currentModel.id === model.id;
                return (
                  <div
                    key={model.id}
                    className={`bg-slate-950 p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 relative ${
                      isSelected
                        ? 'border-pink-500 ring-2 ring-pink-500/30 shadow-lg shadow-pink-500/10'
                        : 'border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-extrabold text-pink-400">{model.brand}</span>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {model.waterproofRating}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white leading-tight">
                        {model.name}
                      </h4>

                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {model.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-900">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Material: {model.material}</span>
                        <span className="text-cyan-400 font-mono">{model.batteryHours}h battery</span>
                      </div>

                      <button
                        onClick={() => {
                          onSelectModel(model);
                          onClose();
                        }}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Equipped
                          </>
                        ) : (
                          'Equip Model'
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* Tab 2: Mix & Match Brand Builder */}
        {activeTab === 'builder' && (
          <div className="space-y-5 overflow-y-auto pr-1 flex-1">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              
              {/* Custom Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Custom Smart Watch Name</label>
                <input
                  type="text"
                  value={builderName}
                  onChange={(e) => setBuilderName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-pink-500"
                  placeholder="e.g. Galaxy Apple Ultra Hybrid"
                />
              </div>

              {/* Base Casing Shape */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Base Casing Shape</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'ultra_octagonal', label: 'Ultra Octagonal' },
                    { id: 'circle', label: 'Classic Circular' },
                    { id: 'curved_square', label: 'Curved Square' },
                    { id: 'rugged_bezel', label: 'Rugged Armor' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setBuilderShape(s.id as SmartWatchModel['casingShape'])}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        builderShape === s.id
                          ? 'bg-pink-600/30 border-pink-500 text-pink-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Metallic Finish Color */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Metallic Alloy Finish</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { name: 'Usagyuun Neon', value: 'linear-gradient(135deg, #7000ff 0%, #ff007f 100%)', border: '#ec4899' },
                    { name: 'Titanium Gray', value: 'linear-gradient(135deg, #64748b 0%, #334155 100%)', border: '#ea580c' },
                    { name: 'Jet Black', value: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '#38bdf8' },
                    { name: '18K Gold', value: 'linear-gradient(135deg, #fef08a 0%, #eab308 100%)', border: '#facc15' },
                    { name: 'Emerald Green', value: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', border: '#10b981' },
                    { name: 'Sapphire Silver', value: 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)', border: '#e2e8f0' },
                  ].map((col, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setBuilderColor(col.value);
                        setBuilderBorder(col.border);
                      }}
                      className={`h-12 rounded-xl border-2 flex flex-col justify-end p-1 transition-all ${
                        builderColor === col.value ? 'border-pink-500 scale-105 shadow-md' : 'border-slate-800'
                      }`}
                      style={{ background: col.value }}
                    >
                      <span className="text-[9px] font-bold text-white drop-shadow truncate">
                        {col.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Equip Custom Hybrid Button */}
              <button
                onClick={handleEquipCustomBuilderModel}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" /> Equip Custom Hybrid Model
              </button>

            </div>
          </div>
        )}

        {/* Tab 3: Upload Image -> Transparent PNG Watch */}
        {activeTab === 'upload' && (
          <div className="space-y-4 overflow-y-auto pr-1 flex-1">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-pink-400" />
                    Convert Photo to Transparent PNG Watch
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Upload any smartwatch photo or drawing. Background removal creates a transparent overlay!
                  </p>
                </div>

                <label className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-2 shadow">
                  <Upload className="w-4 h-4" /> Upload Watch Image
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              {uploadedImageSrc && (
                <div className="space-y-4 pt-3 border-t border-slate-800">
                  
                  {/* Background Threshold Slider */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                      <span>Background Removal Threshold</span>
                      <span className="text-pink-400 font-mono font-bold">{threshold}</span>
                    </div>
                    <input
                      type="range"
                      min="150"
                      max="255"
                      value={threshold}
                      onChange={(e) => handleThresholdChange(Number(e.target.value))}
                      className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>

                  {/* Mask Positioning & Scale Sliders */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-semibold">Screen X Offset</label>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={maskX}
                        onChange={(e) => setMaskX(Number(e.target.value))}
                        className="w-full accent-pink-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-semibold">Screen Y Offset</label>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={maskY}
                        onChange={(e) => setMaskY(Number(e.target.value))}
                        className="w-full accent-pink-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-semibold">Screen Size Scale</label>
                      <input
                        type="range"
                        min="60"
                        max="140"
                        value={maskScale}
                        onChange={(e) => setMaskScale(Number(e.target.value))}
                        className="w-full accent-pink-500"
                      />
                    </div>
                  </div>

                  {/* Preview Container */}
                  <div className="relative w-48 h-48 mx-auto bg-slate-900 rounded-2xl p-2 border border-slate-800 flex items-center justify-center overflow-hidden">
                    {transparentPngUrl && (
                      <img src={transparentPngUrl} alt="Transparent PNG Watch" className="w-full h-full object-contain" />
                    )}
                  </div>

                  <button
                    onClick={handleEquipCustomPngModel}
                    className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Equip Custom Transparent PNG Watch
                  </button>

                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
