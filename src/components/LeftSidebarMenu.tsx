import React from 'react';
import { Radio, Globe, Building2, Calendar, HelpCircle, X, ChevronRight, Volume2, ShieldCheck, Sparkles, Tv, Layers } from 'lucide-react';
import { HbbTvView } from '../types';
import { INOLVIDABLE_STATION_INFO } from '../data/mockData';

interface LeftSidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: HbbTvView;
  onSelectView: (view: HbbTvView) => void;
  audioSource: 'tdt' | 'hd_stream';
  isAudioPlaying: boolean;
  currentSongTitle?: string;
  currentArtist?: string;
}

export const LeftSidebarMenu: React.FC<LeftSidebarMenuProps> = ({
  isOpen,
  onClose,
  activeView,
  onSelectView,
  audioSource,
  isAudioPlaying,
  currentSongTitle,
  currentArtist,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-full max-w-sm sm:max-w-md bg-slate-950/95 backdrop-blur-xl border-r-2 border-red-600/80 shadow-2xl text-white flex flex-col justify-between p-5 animate-slide-in-left">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-red-600 via-amber-600 to-yellow-500 flex items-center justify-center font-black text-white text-xl shadow-lg border border-red-400/40">
              IFM
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white leading-tight">
                Inolvidable FM
              </h2>
              <p className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                <Tv className="w-3.5 h-3.5" />
                HbbTV 2.0 TDT Canarias
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition border border-slate-800"
            title="Cerrar Menú (Tecla ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audio State Banner in Sidebar */}
        <div className="mb-5 p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Volume2 className={`w-4 h-4 ${audioSource === 'hd_stream' ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
            <div>
              <span className="block font-bold text-slate-200">
                {audioSource === 'hd_stream' ? 'Audio HD Streaming (320 kbps)' : 'Audio TDT Convencional'}
              </span>
              {currentSongTitle && audioSource === 'hd_stream' && (
                <span className="text-[11px] text-emerald-400 truncate max-w-[200px] block">
                  {currentSongTitle} - {currentArtist}
                </span>
              )}
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
            audioSource === 'hd_stream' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
          }`}>
            {audioSource === 'hd_stream' ? 'HD LIVE' : 'TDT'}
          </span>
        </div>

        {/* COLOR KEYS MAIN MENU */}
        <div className="space-y-3">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 px-1">
            Opciones Principales Mando TV
          </p>

          {/* GREEN BUTTON: Escuchar Radio HD */}
          <button
            type="button"
            onClick={() => onSelectView('radio_hd')}
            className={`w-full p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between group shadow-lg ${
              activeView === 'radio_hd'
                ? 'bg-gradient-to-r from-emerald-950 to-slate-900 border-emerald-500 text-white ring-2 ring-emerald-500/40'
                : 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800 text-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs shadow">
                VERDE
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-sm text-emerald-300">
                  <Radio className="w-4 h-4 text-emerald-400" />
                  <span>Escuchar Radio en HD</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  Streaming Alta Calidad (320kbps) + Metadatos
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* YELLOW BUTTON: Web Inolvidable FM */}
          <button
            type="button"
            onClick={() => onSelectView('web')}
            className={`w-full p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between group shadow-lg ${
              activeView === 'web'
                ? 'bg-gradient-to-r from-amber-950 to-slate-900 border-amber-500 text-white ring-2 ring-amber-500/40'
                : 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800 text-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs shadow">
                AMAR.
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-sm text-amber-300">
                  <Globe className="w-4 h-4 text-amber-400" />
                  <span>Web Inolvidable FM</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  Navegar inolvidablefm.com en directo
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* BLUE BUTTON: Inolvidable FM Empresas */}
          <button
            type="button"
            onClick={() => onSelectView('empresas')}
            className={`w-full p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between group shadow-lg ${
              activeView === 'empresas'
                ? 'bg-gradient-to-r from-blue-950 to-slate-900 border-blue-500 text-white ring-2 ring-blue-500/40'
                : 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800 text-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-xs shadow">
                AZUL
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-sm text-blue-300">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span>Inolvidable FM Empresas</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  Portal Comercial & Código QR Modo Demo
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* SECONDARY HBBTV OPTIONS */}
        <div className="mt-6 space-y-2 border-t border-slate-800/80 pt-4">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 px-1">
            Servicios TDT Adicionales
          </p>

          <button
            type="button"
            onClick={() => onSelectView('epg')}
            className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs font-semibold transition ${
              activeView === 'epg'
                ? 'bg-slate-800 border-red-500 text-white'
                : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-400" />
              <span>Guía de Programación (EPG TDT)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          <button
            type="button"
            onClick={() => onSelectView('ait_inspector')}
            className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs font-semibold transition ${
              activeView === 'ait_inspector'
                ? 'bg-slate-800 border-red-500 text-white'
                : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Validador HbbTV & Tabla AIT XML</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          <button
            type="button"
            onClick={() => onSelectView('help')}
            className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs font-semibold transition ${
              activeView === 'help'
                ? 'bg-slate-800 border-red-500 text-white'
                : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Manual de Uso & Mando a Distancia</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="border-t border-slate-800/80 pt-4 text-center">
        <p className="text-xs font-bold text-slate-200">Inolvidable FM Radio • TDT Canarias</p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          Atención Comercial: {INOLVIDABLE_STATION_INFO.contactPhone}
        </p>
        <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>HbbTV v2.0.3 Ready</span>
        </div>
      </div>
    </div>
  );
};
