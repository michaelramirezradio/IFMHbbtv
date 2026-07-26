import React, { useState } from 'react';
import { Tv, Code, CheckCircle, ShieldCheck, Download, Copy, RefreshCw, Cpu, Layers, Radio } from 'lucide-react';
import { hbbtvEngine, HbbtvStatus } from '../lib/hbbtvEngine';

interface HbbtvAitInspectorProps {
  status: HbbtvStatus;
  onClose: () => void;
}

export const HbbtvAitInspector: React.FC<HbbtvAitInspectorProps> = ({ status, onClose }) => {
  const [copied, setCopied] = useState(false);
  const aitXml = hbbtvEngine.generateAitXml();

  const handleCopy = () => {
    navigator.clipboard.writeText(aitXml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([aitXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hbbtv_ait_inolvidablefm.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6 text-white animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 p-6 rounded-2xl border-2 border-red-500/80 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg">
            <Tv className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white font-black text-xs px-2 py-0.5 rounded uppercase">
                HbbTV 2.0.3 COMPATIBLE
              </span>
              <span className="text-xs font-mono text-emerald-400">ETSI TS 102 796</span>
            </div>
            <h2 className="text-xl font-black text-white mt-1">Validador HbbTV & Generador AIT TDT</h2>
            <p className="text-xs text-slate-300">
              Formato estándar para emisión en televisores Smart TV (Samsung Tizen, LG webOS, Sony Android TV, Hisense, Philips)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition font-bold text-xs"
        >
          ✕ Cerrar
        </button>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Environment Diagnostic */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col gap-3">
          <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-2">
            <Cpu className="w-4 h-4" />
            Estado del Entorno Smart TV HbbTV
          </h3>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span>Objeto OIPF ApplicationManager:</span>
              <span className={`font-bold px-2 py-0.5 rounded ${status.isHbbtvEnvironment ? 'bg-emerald-950 text-emerald-400 border border-emerald-500' : 'bg-slate-800 text-slate-400'}`}>
                {status.isHbbtvEnvironment ? 'DETECTADO (TV NATIVO)' : 'SIMULADOR / EMULADOR WEB'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span>Registro de Teclas de Color (Keyset):</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                VALOR 0x11F (RED, GREEN, YELLOW, BLUE, NAV)
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span>Canal TDT Video/Audio (type="video/broadcast"):</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                VINCULADO (bindToCurrentChannel)
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span>Resolución de Pantalla Requerida:</span>
              <span className="font-mono text-slate-200">1280x720 (720p HD) / 1920x1080 (1080i)</span>
            </div>
          </div>
        </div>

        {/* Multiplexer Specs */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Layers className="w-4 h-4" />
              Parámetros para Operadores TDT Canarias
            </h3>

            <div className="mt-3 space-y-1.5 text-xs text-slate-300">
              <p>• <strong>Organización ID:</strong> <span className="font-mono text-amber-400">0x000000FA</span> (Inolvidable FM)</p>
              <p>• <strong>Aplicación ID:</strong> <span className="font-mono text-amber-400">0x0001</span></p>
              <p>• <strong>Control Code:</strong> <span className="font-mono text-emerald-400">AUTOSTART</span> (Botón rojo automático)</p>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mt-2 text-[11px]">
                <p className="text-slate-400">
                  Esta aplicación cumple con el perfil <strong className="text-white">DVB-HbbTV 2.0.3</strong> para la señal TDT en las Islas Canarias.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <a
              href="/hbbtv-standalone.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 rounded-xl text-xs transition flex items-center justify-center gap-1"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Ver HTML/CSS/JS Puro</span>
            </a>
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-xl text-xs transition border border-slate-700 flex items-center justify-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? '¡Copiado!' : 'Copiar AIT'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-xl text-xs transition shadow flex items-center justify-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar AIT</span>
            </button>
          </div>
        </div>
      </div>

      {/* AIT XML Preview Box */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto shadow-inner">
        <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2 mb-2 font-sans text-xs">
          <span className="flex items-center gap-1.5 font-bold text-white">
            <Code className="w-4 h-4 text-red-500" />
            Tabla AIT (Application Information Table XML)
          </span>
          <span>hbbtv_ait.xml</span>
        </div>
        <pre>{aitXml}</pre>
      </div>
    </div>
  );
};
