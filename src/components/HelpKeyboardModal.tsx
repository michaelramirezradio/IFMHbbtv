import React from 'react';
import { HelpCircle, Tv, Keyboard, ShieldCheck } from 'lucide-react';

interface HelpKeyboardModalProps {
  onClose: () => void;
}

export const HelpKeyboardModal: React.FC<HelpKeyboardModalProps> = ({ onClose }) => {
  return (
    <div className="flex flex-col gap-6 text-white animate-fade-in max-w-3xl mx-auto">
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 p-6 rounded-2xl border-2 border-amber-500/80 shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shadow-lg">
            <HelpCircle className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Manual de Controles HbbTV</h2>
            <p className="text-xs text-slate-300">Guía de interacción mediante teclado de PC y Mando de Televisión Smart TV</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition font-bold"
        >
          ✕ Cerrar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Color Keys Legend */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col gap-3">
          <h3 className="text-sm font-extrabold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-2">
            <Tv className="w-4 h-4" />
            Botones de Color en Mando TV
          </h3>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-500/80 flex items-center justify-between">
              <span className="font-bold text-white">[ROJO] o Tecla R / 1</span>
              <span className="text-red-300">Abrir / Cerrar Menú HbbTV</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/80 flex items-center justify-between">
              <span className="font-bold text-white">[VERDE] o Tecla G / 2</span>
              <span className="text-emerald-300">Escuchar Radio HD & Metadatos</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-500/80 flex items-center justify-between">
              <span className="font-bold text-white">[AMARILLO] o Tecla Y / 3</span>
              <span className="text-amber-300">Web Inolvidable FM</span>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-950/80 border border-blue-500/80 flex items-center justify-between">
              <span className="font-bold text-white">[AZUL] o Tecla B / 4</span>
              <span className="text-blue-300">Inolvidable FM Empresas & QR</span>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Legend */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col gap-3">
          <h3 className="text-sm font-extrabold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-2">
            <Keyboard className="w-4 h-4" />
            Atajos en Teclado
          </h3>

          <div className="space-y-2 text-xs">
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-amber-400">ESC / Backspace</span>
              <span className="text-slate-300">Volver a Pantalla TDT</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-amber-400">Flechas ↑ ↓ ← →</span>
              <span className="text-slate-300">Navegar por el Menú</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-amber-400">ENTER / OK</span>
              <span className="text-slate-300">Seleccionar Opcion</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-amber-400">Tecla M</span>
              <span className="text-slate-300">Silenciar / Activar Sonido</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
