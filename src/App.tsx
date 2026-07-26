import React, { useState, useEffect, useRef } from 'react';
import { HbbTvView, AudioSourceType, SongMetadata, TvSettings } from './types';
import { INITIAL_PLAYLIST_METADATA } from './data/mockData';
import { hbbtvEngine, HBBTV_KEYS, HbbtvStatus } from './lib/hbbtvEngine';
import { TdtScreen } from './components/TdtScreen';
import { HbbtvPrompt } from './components/HbbtvPrompt';
import { LeftSidebarMenu } from './components/LeftSidebarMenu';
import { AudioHdPlayer } from './components/AudioHdPlayer';
import { WebViewerModal } from './components/WebViewerModal';
import { EmpresasPortal } from './components/EmpresasPortal';
import { EpgDrawer } from './components/EpgDrawer';
import { HelpKeyboardModal } from './components/HelpKeyboardModal';
import { TvRemoteControl } from './components/TvRemoteControl';
import { HbbtvAitInspector } from './components/HbbtvAitInspector';

export default function App() {
  // HbbTV Engine Status
  const [hbbtvStatus, setHbbtvStatus] = useState<HbbtvStatus>({
    isHbbtvEnvironment: false,
    appShown: false,
    keysetRegistered: false,
    broadcastBound: false,
    version: 'HbbTV 2.0.3',
  });

  // HbbTV Navigation State
  const [isHbbtvMenuOpen, setIsHbbtvMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState<HbbTvView>('none');

  // Audio Stream State
  const [audioSource, setAudioSource] = useState<AudioSourceType>('tdt');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  
  // Audio Element Ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Metadata State
  const [playlist, setPlaylist] = useState<SongMetadata[]>(INITIAL_PLAYLIST_METADATA);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  // Settings
  const [settings] = useState<TvSettings>({
    showOsdBanner: true,
    menuOpacity: 0.95,
    autoPlayHdOnGreenKey: true,
    simulationBackground: 'studio',
    tdtChannelNumber: 42,
  });

  const currentSong = playlist[currentSongIndex];

  // Initialize HbbTV Engine on Mount
  useEffect(() => {
    const status = hbbtvEngine.init();
    setHbbtvStatus(status);
  }, []);

  // Sync Broadcast Video Audio vs Internet HD Stream Audio
  useEffect(() => {
    if (audioSource === 'hd_stream') {
      hbbtvEngine.setBroadcastAudioState(false);
    } else {
      hbbtvEngine.setBroadcastAudioState(true);
    }
  }, [audioSource]);

  // Rotate Metadata periodically to simulate live radio broadcast
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSongIndex((prev) => (prev + 1) % playlist.length);
    }, 25000);
    return () => clearInterval(interval);
  }, [playlist.length]);

  // Sync HTML5 Audio element properties
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle Play/Pause for Streaming Audio
  const handleTogglePlay = () => {
    if (!audioRef.current) return;

    if (isAudioPlaying) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsAudioPlaying(true);
          setAudioSource('hd_stream');
        })
        .catch((err) => {
          console.log('Audio autoplay prevented or error:', err);
          setIsAudioPlaying(false);
        });
    }
  };

  // BOTÓN ROJO (Red Key): Toggle Left Sidebar Menu
  const handleRedKey = () => {
    setIsHbbtvMenuOpen((prev) => !prev);
  };

  // BOTÓN VERDE (Green Key): Escuchar Radio HD + Stream
  const handleGreenKey = () => {
    setActiveView('radio_hd');
    setIsHbbtvMenuOpen(true);
    setAudioSource('hd_stream');

    // Desactivar audio de TDT y reproducir streaming HD
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsAudioPlaying(true))
        .catch((err) => console.log('Audio playback error:', err));
    }
  };

  // BOTÓN AMARILLO (Yellow Key): Cargar Web Inolvidable FM
  const handleYellowKey = () => {
    setActiveView('web');
    setIsHbbtvMenuOpen(true);
  };

  // BOTÓN AZUL (Blue Key): Inolvidable FM Empresas & QR Code
  const handleBlueKey = () => {
    setActiveView('empresas');
    setIsHbbtvMenuOpen(true);
  };

  // Close Views & Return to TDT
  const handleCloseView = () => {
    setActiveView('none');
  };

  // Return to TDT Audio
  const handleReturnToTdtAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsAudioPlaying(false);
    setAudioSource('tdt');
  };

  // KEYBOARD LISTENER for Smart TV Remote Keys & PC Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in form inputs or textareas
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
        return;
      }

      const keyCode = e.keyCode || e.which;
      const keyName = e.key ? e.key.toLowerCase() : '';

      // Check both Smart TV numeric KeyCodes and standard Keyboard letters
      if (
        keyCode === HBBTV_KEYS.VK_RED ||
        keyCode === 114 || // F3 / Red
        keyName === 'r' ||
        keyName === '1'
      ) {
        e.preventDefault();
        handleRedKey();
      } else if (
        keyCode === HBBTV_KEYS.VK_GREEN ||
        keyCode === 115 || // F4 / Green
        keyName === 'g' ||
        keyName === '2'
      ) {
        e.preventDefault();
        handleGreenKey();
      } else if (
        keyCode === HBBTV_KEYS.VK_YELLOW ||
        keyCode === 119 || // F8 / Yellow
        keyName === 'y' ||
        keyName === '3'
      ) {
        e.preventDefault();
        handleYellowKey();
      } else if (
        keyCode === HBBTV_KEYS.VK_BLUE ||
        keyCode === 66 || // Blue
        keyName === 'b' ||
        keyName === '4'
      ) {
        e.preventDefault();
        handleBlueKey();
      } else if (
        keyCode === HBBTV_KEYS.VK_BACK ||
        keyCode === 8 ||
        keyCode === 27 ||
        keyCode === 10009 || // Samsung Tizen Back
        keyName === 'escape' ||
        keyName === 'backspace'
      ) {
        handleCloseView();
        setIsHbbtvMenuOpen(false);
      } else if (keyName === 'm') {
        setIsMuted((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans text-white select-none">
      {/* 1. TDT Background Screen & TV Broadcast View */}
      <TdtScreen
        audioSource={audioSource}
        isAudioPlaying={isAudioPlaying}
        onTogglePlay={handleTogglePlay}
        currentSong={currentSong}
        settings={settings}
        audioRef={audioRef}
        onOpenHbbtvMenu={handleRedKey}
      />

      {/* 2. Left Sidebar Menu (Opened with RED BUTTON) */}
      <LeftSidebarMenu
        isOpen={isHbbtvMenuOpen}
        onClose={() => setIsHbbtvMenuOpen(false)}
        activeView={activeView}
        onSelectView={(view) => setActiveView(view)}
        audioSource={audioSource}
        isAudioPlaying={isAudioPlaying}
        currentSongTitle={currentSong.title}
        currentArtist={currentSong.artist}
      />

      {/* 3. Main Dynamic Content Overlay Modal */}
      {activeView !== 'none' && (
        <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md overflow-y-auto p-4 sm:p-8 flex items-center justify-center animate-fade-in">
          <div className="w-full my-auto py-4">
            {activeView === 'radio_hd' && (
              <AudioHdPlayer
                isPlaying={isAudioPlaying}
                onTogglePlay={handleTogglePlay}
                volume={volume}
                onChangeVolume={setVolume}
                isMuted={isMuted}
                onToggleMute={() => setIsMuted((m) => !m)}
                currentSong={currentSong}
                playlist={playlist}
                onSelectSongFromHistory={(song) => {
                  const idx = playlist.findIndex((s) => s.title === song.title);
                  if (idx !== -1) setCurrentSongIndex(idx);
                }}
                onReturnToTdtAudio={handleReturnToTdtAudio}
              />
            )}

            {activeView === 'web' && (
              <WebViewerModal onClose={handleCloseView} />
            )}

            {activeView === 'empresas' && (
              <EmpresasPortal onClose={handleCloseView} />
            )}

            {activeView === 'epg' && (
              <EpgDrawer onClose={handleCloseView} />
            )}

            {activeView === 'help' && (
              <HelpKeyboardModal onClose={handleCloseView} />
            )}

            {activeView === 'ait_inspector' && (
              <HbbtvAitInspector status={hbbtvStatus} onClose={handleCloseView} />
            )}
          </div>
        </div>
      )}

      {/* 4. Bottom Right HbbTV Callout Banner Prompt */}
      <HbbtvPrompt
        onOpenMenu={handleRedKey}
        onQuickGreen={handleGreenKey}
        onQuickYellow={handleYellowKey}
        onQuickBlue={handleBlueKey}
        isMenuOpen={isHbbtvMenuOpen}
        audioSource={audioSource}
        isAudioPlaying={isAudioPlaying}
      />

      {/* 5. Virtual Smart TV Remote Control Widget */}
      <TvRemoteControl
        onRedKey={handleRedKey}
        onGreenKey={handleGreenKey}
        onYellowKey={handleYellowKey}
        onBlueKey={handleBlueKey}
        onCloseMenu={() => {
          setIsHbbtvMenuOpen(false);
          setActiveView('none');
        }}
        onToggleMute={() => setIsMuted((m) => !m)}
        isMuted={isMuted}
        onNavigateUp={() => {}}
        onNavigateDown={() => {}}
        onNavigateSelect={() => {}}
      />
    </div>
  );
}
