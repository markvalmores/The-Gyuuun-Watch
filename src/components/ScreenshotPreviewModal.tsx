import React, { useState } from 'react';
import { Camera, Download, X, Check, Share2, Sparkles } from 'lucide-react';

interface ScreenshotPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  modelName: string;
}

export const ScreenshotPreviewModal: React.FC<ScreenshotPreviewModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  modelName,
}) => {
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);

  if (!isOpen || !imageUrl) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `gyuuun-watch-${modelName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadMsg('✨ Screenshot PNG downloaded to your device!');
    setTimeout(() => setDownloadMsg(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative text-center text-slate-100 my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-cyan-400 p-0.5 shadow-md shadow-pink-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Camera className="w-5 h-5 text-pink-400" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Watch Screenshot Captured!</h3>
            <p className="text-xs text-slate-400">{modelName}</p>
          </div>
        </div>

        {downloadMsg && (
          <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 animate-bounce">
            <Check className="w-4 h-4 text-emerald-400" />
            {downloadMsg}
          </div>
        )}

        {/* Screenshot Image Preview Container */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-center max-h-[380px] overflow-hidden shadow-inner">
          <img
            src={imageUrl}
            alt="Watch Screenshot"
            className="max-h-[340px] w-auto object-contain rounded-xl drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
          >
            Close
          </button>
          
          <button
            onClick={handleDownload}
            className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download Full PNG
          </button>
        </div>

      </div>
    </div>
  );
};
