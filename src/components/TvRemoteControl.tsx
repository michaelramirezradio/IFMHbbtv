import React, { useState } from 'react';
import { Tv, Volume2, VolumeX, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, CornerDownLeft, RotateCcw, Power, Minimize2, Maximize2 } from 'lucide-react';

interface TvRemoteControlProps {
  onRedKey: () => void;
  onGreenKey: () => void;
  onYellowKey: () => void;
  onBlueKey: () => void;
  onCloseMenu: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
  onNavigateUp?: () => void;
  onNavigateDown?: () => void;
  onNavigateSelect?: () => void;
}

export const TvRemoteControl: React.FC<TvRemoteControlProps> = ({
  onRedKey,
  onGreenKey,
  onYellowKey,
  onBlueKey,
  onCloseMenu,
  onToggleMute,
  isMuted,
  onNavigateUp,
  onNavigateDown,
  onNavigateSelect,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="fixed bottom-6 left-6 z-40 transition-all">
      {isExpanded ? (
        <div className="bg-slate-900/95 backdrop-blur-xl border-2 border-slate-700/80 rounded-3xl p-4 shadow-2xl text-white w-64 flex flex-col gap-4 animate-slide-in-left select-none">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Tv className="w-4 h-4 text-red-500" />
              <span className="font-extrabold text-xs uppercase tracking-wider text-slate-200">Mando TV HbbTV</span>
            </div>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Minimizar mando"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* COLOR KEYS BAR */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase text-slate-400 text-center">Botones de Color</span>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={onRedKey}
                className="h-10 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-black text-xs shadow-md transition flex flex-col items-center justify-center border border-red-400/50"
                title="Menú [R]"
              >
                <span>R</span>
                <span className="text-[8px] font-normal opacity-80">Menú</span>
              </button>
              <button
                type="button"
                onClick={onGreenKey}
                className="h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs shadow-md transition flex flex-col items-center justify-center border border-emerald-400/50"
                title="Radio HD [G]"
              >
                <span>G</span>
                <span className="text-[8px] font-normal opacity-80">Radio</span>
              </button>
              <button
                type="button"
                onClick={onYellowKey}
                className="h-10 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs shadow-md transition flex flex-col items-center justify-center border border-amber-300"
                title="Web [Y]"
              >
                <span>Y</span>
                <span className="text-[8px] font-normal opacity-80">Web</span>
              </button>
              <button
                type="button"
                onClick={onBlueKey}
                className="h-10 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-black text-xs shadow-md transition flex flex-col items-center justify-center border border-blue-400/50"
                title="Empresas [B]"
              >
                <span>B</span>
                <span className="text-[8px] font-normal opacity-80">QR</span>
              </button>
            </div>
          </div>

          {/* D-PAD DIRECTIONAL NAVIGATION */}
          <div className="flex flex-col items-center gap-1 my-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Navegación</span>
            <div className="relative w-32 h-32 bg-slate-950 rounded-full border border-slate-800 flex items-center justify-center p-2 shadow-inner">
              <button
                type="button"
                onClick={onNavigateUp}
                className="absolute top-1 p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition"
                title="Arriba"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onNavigateDown}
                className="absolute bottom-1 p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition"
                title="Abajo"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onCloseMenu}
                className="absolute left-1 p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition"
                title="Atrás / Izquierda"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onNavigateSelect}
                className="absolute right-1 p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition"
                title="Derecha"
              >
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* OK CENTER BUTTON */}
              <button
                type="button"
                onClick={onNavigateSelect}
                className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-400 font-extrabold text-xs shadow border border-slate-700 flex items-center justify-center"
              >
                OK
              </button>
            </div>
          </div>

          {/* UTILITY BUTTONS */}
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold pt-1 border-t border-slate-800">
            <button
              type="button"
              onClick={onCloseMenu}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition flex items-center justify-center gap-1.5"
              title="Salir / Atrás"
            >
              <RotateCcw className="w-3.5 h-3.5 text-red-400" />
              <span>Atrás</span>
            </button>
            <button
              type="button"
              onClick={onToggleMute}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition flex items-center justify-center gap-1.5"
              title="Silenciar Audio"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
              <span>Mute</span>
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="bg-slate-900/90 border-2 border-slate-700 hover:border-red-500 text-white font-bold p-3 rounded-2xl shadow-2xl flex items-center gap-2 hover:scale-105 transition"
        >
          <Tv className="w-5 h-5 text-red-500" />
          <span className="text-xs">Mando TV</span>
        </button>
      )}
    </div>
  );
};
