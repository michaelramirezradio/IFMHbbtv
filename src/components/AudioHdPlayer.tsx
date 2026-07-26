import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, Sparkles, Music2, Info, Clock, RefreshCw, Send, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { SongMetadata } from '../types';
import { INOLVIDABLE_STATION_INFO, INITIAL_PLAYLIST_METADATA } from '../data/mockData';
import { AudioVisualizerCanvas } from './AudioVisualizerCanvas';

interface AudioHdPlayerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  volume: number;
  onChangeVolume: (vol: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  currentSong: SongMetadata;
  playlist: SongMetadata[];
  onSelectSongFromHistory: (song: SongMetadata) => void;
  onReturnToTdtAudio: () => void;
}

export const AudioHdPlayer: React.FC<AudioHdPlayerProps> = ({
  isPlaying,
  onTogglePlay,
  volume,
  onChangeVolume,
  isMuted,
  onToggleMute,
  currentSong,
  playlist,
  onSelectSongFromHistory,
  onReturnToTdtAudio,
}) => {
  const [showDedicationModal, setShowDedicationModal] = useState(false);
  const [dedicationForm, setDedicationForm] = useState({ name: '', city: 'Las Palmas', song: '', message: '' });
  const [dedicationSent, setDedicationSent] = useState(false);
  const [activeTab, setActiveTab] = useState<'metadata' | 'history' | 'lyrics'>('metadata');

  const handleDedicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDedicationSent(true);
    setTimeout(() => {
      setDedicationSent(false);
      setShowDedicationModal(false);
      setDedicationForm({ name: '', city: 'Las Palmas', song: '', message: '' });
    }, 2500);
  };

  return (
    <div className="flex flex-col gap-6 text-white animate-fade-in max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-6 rounded-2xl border-2 border-emerald-500/60 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-900/50">
            <Radio className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                BOTÓN VERDE
              </span>
              <span className="bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 text-xs font-semibold px-2.5 py-0.5 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Internet Streaming Pulse HD
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white mt-1">
              Radio Inolvidable FM en Alta Definición
            </h2>
            <p className="text-xs text-slate-300">
              Audio Hifi 320 kbps • Audio TDT desactivado automáticamente para máxima calidad sonora
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReturnToTdtAudio}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl transition flex items-center gap-2 font-medium"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Volver a Audio TDT Estándar
        </button>
      </div>

      {/* Main Player & Metadata Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Album Art & Live Equalizer */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-between gap-6 shadow-xl">
          <div className="relative group w-full max-w-[280px] aspect-square rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-500/40">
            <img
              src={currentSong.coverUrl}
              alt={currentSong.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
            
            {/* Live HD Badge Overlay */}
            <div className="absolute top-3 right-3 bg-emerald-600/90 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md shadow flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              EMITIENDO HD
            </div>

            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="text-[11px] bg-slate-900/80 px-2 py-0.5 rounded text-emerald-400 font-bold uppercase tracking-wider backdrop-blur-sm">
                {currentSong.programName}
              </span>
              <p className="text-xs text-slate-300 font-medium mt-1 truncate">
                Locutor: {currentSong.hostName || 'Manolo Moreno'}
              </p>
            </div>
          </div>

          {/* Audio Equalizer Visualizer */}
          <div className="w-full">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 px-1 font-semibold">
              <span className="flex items-center gap-1 text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                Ecualizador Espectro HD
              </span>
              <span>{currentSong.bitrate}</span>
            </div>
            <AudioVisualizerCanvas isPlaying={isPlaying} height={75} />
          </div>

          {/* Quick Audio Controls */}
          <div className="w-full bg-slate-950/80 rounded-2xl p-4 border border-slate-800/80 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={onTogglePlay}
                className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg ${
                  isPlaying
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    <span>Pausar HD Stream</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>Reproducir HD Stream</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onToggleMute}
                className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-slate-200 transition"
                title={isMuted ? 'Activar sonido' : 'Silenciar'}
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
              </button>
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-3 px-1 pt-1">
              <Volume2 className="w-4 h-4 text-slate-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-400 w-8 text-right">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Metadata Tabs */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 flex flex-col justify-between shadow-xl">
          <div>
            {/* Metadata Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-5">
              <button
                type="button"
                onClick={() => setActiveTab('metadata')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'metadata'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                <Music2 className="w-4 h-4" />
                Metadatos Canción
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'history'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                <Clock className="w-4 h-4" />
                Historial de Emisión
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('lyrics')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'lyrics'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                <Info className="w-4 h-4" />
                Letra & Programa
              </button>
            </div>

            {/* TAB 1: METADATA */}
            {activeTab === 'metadata' && (
              <div className="flex flex-col gap-5 animate-fade-in">
                <div>
                  <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Sonando Ahora en Directo
                  </span>
                  <h1 className="text-3xl font-black text-white mt-1 leading-tight">
                    {currentSong.title}
                  </h1>
                  <p className="text-xl font-bold text-amber-400 mt-0.5">
                    {currentSong.artist}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold">Álbum:</span>
                    <span className="font-bold text-slate-100">{currentSong.album}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold">Género Musical:</span>
                    <span className="font-bold text-slate-100">{currentSong.genre}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold">Año de Lanzamiento:</span>
                    <span className="font-bold text-slate-100">{currentSong.year || 'Éxito Inolvidable'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold">Programa Actual:</span>
                    <span className="font-bold text-emerald-400">{currentSong.programName}</span>
                  </div>
                </div>

                {/* ICY Stream Stats Bar */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Estado Servidor StreamingPulse
                    </span>
                    <span className="text-slate-400 font-mono">100% ONLINE</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                    <div>
                      <span className="block text-slate-300 font-mono font-bold">Servidor:</span>
                      <span>de4.streamingpulse.com</span>
                    </div>
                    <div>
                      <span className="block text-slate-300 font-mono font-bold">Calidad Audio:</span>
                      <span>320 kbps Stereo AAC</span>
                    </div>
                    <div>
                      <span className="block text-slate-300 font-mono font-bold">Oyentes TDT + Web:</span>
                      <span className="text-emerald-400 font-bold">{currentSong.listenersCount?.toLocaleString()} oyentes</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: HISTORIAL DE CANCIONES */}
            {activeTab === 'history' && (
              <div className="flex flex-col gap-3 animate-fade-in">
                <p className="text-xs text-slate-400 font-medium">
                  Lista de los últimos éxitos emitidos en la señal HD de Inolvidable FM:
                </p>
                <div className="flex flex-col gap-2.5 max-h-[260px] overflow-y-auto pr-1">
                  {playlist.map((song, idx) => (
                    <div
                      key={idx}
                      onClick={() => onSelectSongFromHistory(song)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer ${
                        song.title === currentSong.title
                          ? 'bg-emerald-950/80 border-emerald-500 text-white shadow'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={song.coverUrl} alt={song.title} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="text-xs font-bold leading-snug">{song.title}</p>
                          <p className="text-[11px] text-amber-400 font-medium">{song.artist}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        {song.genre}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: LETRAS / INFO PROGRAMA */}
            {activeTab === 'lyrics' && (
              <div className="flex flex-col gap-4 animate-fade-in text-xs">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-amber-400 text-sm mb-1">Fragmento de Letra Destacada</h4>
                  <p className="italic text-slate-200 text-sm leading-relaxed">
                    "{currentSong.lyricsSnippet || 'Canción seleccionada de nuestra fonoteca histórica de Canarias.'}"
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-wider mb-1">
                    Sobre Inolvidable FM Canarias
                  </h4>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    {INOLVIDABLE_STATION_INFO.slogan}. Transmitiendo para todas las Islas Canarias a través de TDT y frecuencias FM principales en Gran Canaria (94.8 FM) y Tenerife (105.8 FM).
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer Button */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowDedicationModal(true)}
              className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2"
            >
              <Heart className="w-4 h-4 fill-current text-white" />
              Dedicar o Pedir una Canción
            </button>

            <span className="text-[11px] text-slate-400 font-mono">
              URL Stream: {INOLVIDABLE_STATION_INFO.streamUrl}
            </span>
          </div>
        </div>
      </div>

      {/* DEDICATION MODAL */}
      {showDedicationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-emerald-500/80 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fade-in relative">
            <button
              type="button"
              onClick={() => setShowDedicationModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-black text-lg"
            >
              ✕
            </button>

            {dedicationSent ? (
              <div className="py-8 flex flex-col items-center text-center gap-3">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-bounce" />
                <h3 className="text-xl font-bold text-white">¡Petición Enviada con Éxito!</h3>
                <p className="text-xs text-slate-300">
                  Tu dedicatoria llegará al locutor en directo en el estudio de Inolvidable FM Canarias.
                </p>
              </div>
            ) : (
              <form onSubmit={handleDedicationSubmit} className="flex flex-col gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <h3 className="text-base font-bold text-white">Dedicatoria para Inolvidable FM</h3>
                </div>
                <p className="text-slate-300 text-xs">
                  Envía tu mensaje o dedicatoria directamente a nuestro equipo de radio TDT en directo:
                </p>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tu Nombre:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. María del Carmen"
                    value={dedicationForm.name}
                    onChange={(e) => setDedicationForm({ ...dedicationForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Municipio / Isla:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Las Palmas / Santa Cruz de Tenerife"
                    value={dedicationForm.city}
                    onChange={(e) => setDedicationForm({ ...dedicationForm, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Canción Deseada:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Sabor a Mí - Los Panchos"
                    value={dedicationForm.song}
                    onChange={(e) => setDedicationForm({ ...dedicationForm, song: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mensaje o Dedicatoria:</label>
                  <textarea
                    rows={3}
                    placeholder="Escribe tu saludo para los oyentes de la TDT..."
                    value={dedicationForm.message}
                    onChange={(e) => setDedicationForm({ ...dedicationForm, message: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow transition flex items-center justify-center gap-2 mt-1"
                >
                  <Send className="w-4 h-4" />
                  Enviar Dedicatoria a Estudio TDT
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
