import React, { useRef, useEffect } from 'react';
import { Tv, Radio, Wifi, Volume2, Sparkles, Disc, Camera, MapPin, ChevronRight, Play, Pause } from 'lucide-react';
import { SongMetadata, TvSettings } from '../types';
import { INOLVIDABLE_STATION_INFO } from '../data/mockData';

interface TdtScreenProps {
  audioSource: 'tdt' | 'hd_stream';
  isAudioPlaying: boolean;
  onTogglePlay: () => void;
  currentSong: SongMetadata;
  settings: TvSettings;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  onOpenHbbtvMenu: () => void;
}

export const TdtScreen: React.FC<TdtScreenProps> = ({
  audioSource,
  isAudioPlaying,
  onTogglePlay,
  currentSong,
  settings,
  audioRef,
  onOpenHbbtvMenu,
}) => {
  const videoCanvasRef = useRef<HTMLCanvasElement>(null);

  // Animate background vinyl / radio wave effect on canvas
  useEffect(() => {
    const canvas = videoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      // Dark gradient TV background
      const grad = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, w / 1.2);
      grad.addColorStop(0, '#1e1b4b');
      grad.addColorStop(0.5, '#0f172a');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Draw subtle radio signal waves in background
      angle += 0.02;
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.lineWidth = 2;

      for (let r = 100; r < w * 0.8; r += 120) {
        ctx.beginPath();
        const currentR = (r + angle * 40) % (w * 0.8);
        ctx.arc(w / 2, h / 2, currentR, 0, Math.PI * 2);
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative w-full h-full min-h-screen bg-slate-950 overflow-hidden select-none font-sans">
      {/* Background Canvas Studio Visual */}
      <canvas ref={videoCanvasRef} width={1280} height={720} className="absolute inset-0 w-full h-full object-cover" />

      {/* Hidden Real HTML5 Audio Element for Internet HD Stream */}
      <audio
        ref={audioRef}
        src={INOLVIDABLE_STATION_INFO.streamUrl}
        preload="none"
        crossOrigin="anonymous"
      />

      {/* Simulated Live Broadcast Studio Visual Card in Center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white text-center pointer-events-none">
        <div className="relative group max-w-lg w-full bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border-2 border-red-500/40 shadow-2xl flex flex-col items-center gap-5">
          <div className="relative">
            {/* Spinning Record / Radio Mic Visual */}
            <div className={`w-36 h-36 rounded-full bg-gradient-to-tr from-slate-950 via-slate-900 to-red-950 border-4 border-red-500/80 shadow-2xl flex items-center justify-center ${
              isAudioPlaying ? 'animate-spin-slow' : ''
            }`}>
              <Disc className="w-20 h-20 text-red-500/90" />
            </div>
            <div className="absolute -top-2 -right-2 bg-red-600 text-white font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              TDT CANARIAS
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Inolvidable FM Radio</h1>
            <p className="text-xs text-amber-400 font-semibold mt-1">
              {INOLVIDABLE_STATION_INFO.slogan}
            </p>
          </div>

          {/* Current Playing Audio Info */}
          <div className="bg-slate-950/90 px-4 py-2.5 rounded-2xl border border-slate-800 text-xs w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-left truncate">
              <Radio className={`w-4 h-4 shrink-0 ${audioSource === 'hd_stream' ? 'text-emerald-400 animate-pulse' : 'text-red-400'}`} />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Fuente Audio Actual:</span>
                <span className="font-bold text-white truncate">
                  {audioSource === 'hd_stream'
                    ? `Internet HD: ${currentSong.title} - ${currentSong.artist}`
                    : 'Audio Convencional TDT Canarias'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onTogglePlay}
              className="pointer-events-auto bg-red-600 hover:bg-red-500 text-white p-2 rounded-xl transition shadow"
              title={isAudioPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isAudioPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* TOP OSD TV BANNER (On-Screen Display) */}
      {settings.showOsdBanner && (
        <div className="absolute top-6 left-6 right-6 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-800/80 rounded-2xl p-3.5 text-white flex flex-wrap items-center justify-between gap-4 shadow-2xl animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="bg-red-600 text-white font-black text-base px-3 py-1 rounded-xl shadow font-mono">
              Ch {settings.tdtChannelNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm text-white">INOLVIDABLE FM RADIO</h3>
                <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                  1080i HD TDT
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                <MapPin className="w-3 h-3 text-red-400" />
                <span>Las Palmas • Santa Cruz de Tenerife • Islas Canarias</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1 text-emerald-400 font-bold">
                <Wifi className="w-3.5 h-3.5" />
                <span>Señal: 99%</span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-1 text-slate-300 font-medium">
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{audioSource === 'hd_stream' ? 'Audio: Internet HD (320k)' : 'Audio: TDT Stereo'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenHbbtvMenu}
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow transition flex items-center gap-1.5 animate-pulse"
            >
              <span>[ROJO] Menú HbbTV</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
