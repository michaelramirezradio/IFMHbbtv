export type HbbTvView = 'none' | 'menu' | 'radio_hd' | 'web' | 'empresas' | 'epg' | 'help' | 'ait_inspector';

export type AudioSourceType = 'tdt' | 'hd_stream';

export interface SongMetadata {
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  programName: string;
  hostName?: string;
  bitrate: string;
  format: string;
  listenersCount?: number;
  genre: string;
  year?: string;
  playedAt?: string;
  lyricsSnippet?: string;
}

export interface EpgProgram {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
  host: string;
  description: string;
  category: 'Musical' | 'Magacín' | 'Entrevistas' | 'Especial' | 'Noticias';
  isLiveNow?: boolean;
}

export interface BusinessPack {
  id: string;
  title: string;
  tagline: string;
  price: string;
  period: string;
  spotsPerDay: number;
  features: string[];
  popular?: boolean;
}

export interface BusinessContactForm {
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  packSelected: string;
  message: string;
}

export interface TvSettings {
  showOsdBanner: boolean;
  menuOpacity: number; // 0.8 to 1.0
  autoPlayHdOnGreenKey: boolean;
  simulationBackground: 'studio' | 'vinyl' | 'canarias' | 'abstract';
  tdtChannelNumber: number;
}
