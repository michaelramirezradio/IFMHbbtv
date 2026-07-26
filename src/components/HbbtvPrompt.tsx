import React from 'react';
import { Radio, ChevronRight, Tv } from 'lucide-react';

interface HbbtvPromptProps {
  onOpenMenu: () => void;
  onQuickGreen: () => void;
  onQuickYellow: () => void;
  onQuickBlue: () => void;
  isMenuOpen: boolean;
  audioSource: 'tdt' | 'hd_stream';
  isAudioPlaying: boolean;
}

export const HbbtvPrompt: React.FC<HbbtvPromptProps> = ({
  onOpenMenu,
  onQuickGreen,
  onQuickYellow,
  onQuickBlue,
  isMenuOpen,
  audioSource,
  isAudioPlaying,
}) => {
  if (isMenuOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-md w-full animate-bounce-subtle">
      {/* Main HbbTV Banner Prompt */}
      <div className="bg-slate-900/95 backdrop-blur-md border-2 border-red-500/80 rounded-2xl p-4 shadow-2xl text-white flex flex-col gap-3 transition-all hover:scale-[1.02] cursor-pointer"
           onClick={onOpenMenu}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 border border-white"></span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Tv className="w-5 h-5 text-red-500" />
              <span className="font-extrabold tracking-wider text-sm uppercase text-red-400">HbbTV Interactivo</span>
            </div>
          </div>
          <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white"></span>
            Pulsar [ROJO]
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 pt-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center font-black text-sm text-white shadow">
              IFM
            </div>
            <div>
              <p className="text-sm font-bold text-slate-100 leading-tight">Inolvidable FM Radio</p>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Radio className="w-3 h-3 text-red-400" />
                {audioSource === 'hd_stream' && isAudioPlaying ? (
                  <span className="text-emerald-400 font-semibold">Emitiendo Stream HD</span>
                ) : (
                  <span>Canal TDT Canarias</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center text-xs text-red-400 font-medium group">
            <span>Abrir Menú</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Color Button Shortcut Legend Bar */}
        <div className="grid grid-cols-4 gap-1.5 pt-1 border-t border-slate-800/80 text-[11px] font-bold text-center">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onOpenMenu(); }}
            className="bg-red-600/90 hover:bg-red-500 text-white py-1 px-1.5 rounded-lg flex items-center justify-center gap-1 transition shadow"
            title="Pulsar tecla R o Botón Rojo"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white inline-block"></span>
            <span>Menú</span>
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onQuickGreen(); }}
            className="bg-emerald-600/90 hover:bg-emerald-500 text-white py-1 px-1.5 rounded-lg flex items-center justify-center gap-1 transition shadow"
            title="Pulsar tecla G o Botón Verde"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white inline-block"></span>
            <span>Radio HD</span>
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onQuickYellow(); }}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-1 px-1.5 rounded-lg flex items-center justify-center gap-1 transition shadow"
            title="Pulsar tecla Y o Botón Amarillo"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-slate-950 inline-block"></span>
            <span>Web</span>
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onQuickBlue(); }}
            className="bg-blue-600/90 hover:bg-blue-500 text-white py-1 px-1.5 rounded-lg flex items-center justify-center gap-1 transition shadow"
            title="Pulsar tecla B o Botón Azul"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white inline-block"></span>
            <span>Empresas</span>
          </button>
        </div>
      </div>
    </div>
  );
};
