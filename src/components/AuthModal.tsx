import React from 'react';
import { User } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { X, LogIn, LogOut, CheckCircle2, Cloud, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (err) {
      console.error('Sign-in error:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      onClose();
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative text-center">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-pink-500/30">
          <Cloud className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-white">Firebase Cloud Synchronization</h3>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to automatically sync your custom watch faces, health metrics & time settings across all your devices.
          </p>
        </div>

        {currentUser ? (
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3 text-left">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="Avatar" className="w-10 h-10 rounded-full border border-pink-500" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center font-bold text-white">
                  {currentUser.displayName?.[0] || 'U'}
                </div>
              )}
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">{currentUser.displayName || 'Huafit User'}</div>
                <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold justify-center pt-2 border-t border-slate-800">
              <CheckCircle2 className="w-4 h-4" /> Cloud Firestore Active
            </div>

            <button
              onClick={handleSignOut}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handleGoogleSignIn}
              className="w-full py-3 bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.1 0-5.74-2.09-6.68-4.91H1.21v3.15C3.23 21.36 7.34 24 12 24z" />
                <path fill="#FBBC05" d="M5.32 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.56H1.21C.44 8.1 0 9.99 0 12s.44 3.9 1.21 5.44l4.11-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.23 0 12 0 7.34 0 3.23 2.64 1.21 6.56l4.11 3.15c.94-2.82 3.58-4.96 6.68-4.96z" />
              </svg>
              Sign In with Google Account
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
            >
              Continue in Instant Guest Mode
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
