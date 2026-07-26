import React, { useState } from 'react';
import { ExternalLink, RefreshCw, Globe, Shield, ArrowLeft, ArrowRight, Maximize2, Minimize2, Radio, Smartphone, ChevronRight } from 'lucide-react';
import { INOLVIDABLE_STATION_INFO } from '../data/mockData';

interface WebViewerModalProps {
  onClose: () => void;
}

export const WebViewerModal: React.FC<WebViewerModalProps> = ({ onClose }) => {
  const [iframeKey, setIframeKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const handleRefresh = () => {
    setIframeLoaded(false);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className={`flex flex-col bg-slate-900 border-2 border-amber-500/80 rounded-2xl shadow-2xl overflow-hidden transition-all text-white max-w-5xl mx-auto ${
      isFullscreen ? 'fixed inset-4 z-50 rounded-xl' : 'w-full h-[650px]'
    }`}>
      {/* Browser Bar Header */}
      <div className="bg-slate-950 p-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded uppercase tracking-wider">
            BOTÓN AMARILLO
          </span>
          <span className="font-bold text-slate-200 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-amber-400" />
            Navegador Web Inolvidable FM
          </span>
        </div>

        {/* Address Bar */}
        <div className="flex-1 max-w-md bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 flex items-center justify-between text-slate-300 font-mono shadow-inner">
          <div className="flex items-center gap-2 overflow-hidden">
            <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate text-[11px]">{INOLVIDABLE_STATION_INFO.webUrl}</span>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
            HTTPS
          </span>
        </div>

        {/* Browser Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
            title="Recargar Web"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <a
            href={INOLVIDABLE_STATION_INFO.webUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow"
          >
            <span>Abrir en Nueva Pestaña</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
            title={isFullscreen ? 'Reducir' : 'Pantalla Completa'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-red-600/80 hover:bg-red-500 text-white rounded-lg transition font-bold"
            title="Cerrar Web"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Web Preview Content / iFrame Container */}
      <div className="relative flex-1 bg-white overflow-hidden">
        {/* Loading Spinner Indicator */}
        {!iframeLoaded && (
          <div className="absolute inset-0 bg-slate-950 z-10 flex flex-col items-center justify-center gap-4 text-white p-6">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-center">
              <p className="font-bold text-base text-amber-400">Cargando inolvidablefm.com...</p>
              <p className="text-xs text-slate-400 mt-1">Conectando con el portal oficial de la emisora en Canarias</p>
            </div>
          </div>
        )}

        <iframe
          key={iframeKey}
          src={INOLVIDABLE_STATION_INFO.webUrl}
          title="Inolvidable FM Web Oficial"
          className="w-full h-full border-0"
          onLoad={() => setIframeLoaded(true)}
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: '0 0' }}
        />
      </div>

      {/* Web Footer Banner */}
      <div className="bg-slate-950 p-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Sitio Web Oficial Activo
          </span>
          <span>Gran Canaria • Tenerife • Fuerteventura • Lanzarote • TDT</span>
        </div>

        <div className="flex items-center gap-3">
          <span>Zoom: {zoomLevel}%</span>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-white rounded"
          >
            -
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-white rounded"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
