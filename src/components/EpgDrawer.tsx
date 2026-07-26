import React from 'react';
import { Calendar, Clock, Tv, User, Radio, Sparkles, X } from 'lucide-react';
import { MOCK_EPG_SCHEDULE } from '../data/mockData';

interface EpgDrawerProps {
  onClose: () => void;
}

export const EpgDrawer: React.FC<EpgDrawerProps> = ({ onClose }) => {
  return (
    <div className="flex flex-col gap-6 text-white animate-fade-in max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 p-6 rounded-2xl border-2 border-red-500/80 shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Guía de Programación TDT (EPG)</h2>
            <p className="text-xs text-slate-300">Horario oficial de Inolvidable FM para las Islas Canarias</p>
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

      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold border-b border-slate-800 pb-3">
          <span className="flex items-center gap-1.5 text-amber-400">
            <Clock className="w-4 h-4" />
            Programación de Hoy
          </span>
          <span>TDT Canal 42 • Gran Canaria & Tenerife</span>
        </div>

        <div className="flex flex-col gap-3">
          {MOCK_EPG_SCHEDULE.map((program) => (
            <div
              key={program.id}
              className={`p-4 rounded-xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                program.isLiveNow
                  ? 'bg-red-950/80 border-red-500 text-white shadow-lg shadow-red-900/30'
                  : 'bg-slate-950/70 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-center shrink-0 min-w-[70px]">
                  <span className="text-sm font-black font-mono text-amber-400">{program.startTime}</span>
                  <span className="text-[10px] text-slate-400 block font-mono">a {program.endTime}</span>
                  {program.isLiveNow && (
                    <span className="mt-1 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase block animate-pulse">
                      EN DIRECTO
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-white">{program.title}</h3>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-semibold">
                      {program.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{program.description}</p>
                </div>
              </div>

              <div className="shrink-0 text-right md:border-l md:border-slate-800 md:pl-4 text-xs text-slate-400">
                <span className="block text-[10px] text-slate-400 font-semibold">Presentado por:</span>
                <span className="font-bold text-slate-200">{program.host}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
