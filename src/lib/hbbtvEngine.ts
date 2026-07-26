/**
  * HbbTV ETSI TS 102 796 / OIPF Application Engine Helper
  * Handles keyset registration, broadcast video object management, and remote key code mapping for Smart TVs.
  */

// Standard HbbTV Key Codes according to ETSI TS 102 796
export const HBBTV_KEYS = {
  VK_RED: 403,
  VK_GREEN: 404,
  VK_YELLOW: 405,
  VK_BLUE: 406,
  VK_UP: 38,
  VK_DOWN: 40,
  VK_LEFT: 37,
  VK_RIGHT: 39,
  VK_ENTER: 13,
  VK_BACK: 461,
  VK_PLAY: 415,
  VK_PAUSE: 19,
  VK_STOP: 413,
  VK_FAST_FWD: 417,
  VK_REWIND: 412,
  VK_0: 48,
  VK_1: 49,
  VK_2: 50,
  VK_3: 51,
  VK_4: 52,
  VK_5: 53,
  VK_6: 54,
  VK_7: 55,
  VK_8: 56,
  VK_9: 57,
};

// Keyset bitmasks according to OIPF Specification
export const HBBTV_KEYSET = {
  RED: 0x1,
  GREEN: 0x2,
  YELLOW: 0x4,
  BLUE: 0x8,
  NAVIGATION: 0x10,
  VCR: 0x20,
  NUMERIC: 0x100,
  ALL: 0x1 + 0x2 + 0x4 + 0x8 + 0x10 + 0x20 + 0x100,
};

export interface HbbtvStatus {
  isHbbtvEnvironment: boolean;
  appShown: boolean;
  keysetRegistered: boolean;
  broadcastBound: boolean;
  version: string;
}

class HbbtvEngine {
  private oipfApp: any = null;
  private broadcastVideoObj: HTMLObjectElement | null = null;
  private isInitialized = false;

  public init(): HbbtvStatus {
    const status: HbbtvStatus = {
      isHbbtvEnvironment: false,
      appShown: false,
      keysetRegistered: false,
      broadcastBound: false,
      version: 'HbbTV 2.0.3 / OIPF v1.2',
    };

    try {
      // 1. Check for OIPF Application Manager
      const appMan = document.getElementById('oipfAppMan') as any;
      if (appMan && typeof appMan.getOwnerApplication === 'function') {
        status.isHbbtvEnvironment = true;
        this.oipfApp = appMan.getOwnerApplication(document);

        if (this.oipfApp) {
          // Show the HbbTV graphic plane on top of broadcast video
          if (typeof this.oipfApp.show === 'function') {
            this.oipfApp.show();
            status.appShown = true;
          }
          if (typeof this.oipfApp.activate === 'function') {
            this.oipfApp.activate();
          }

          // Register color keys and navigation keys so TV passes them to JS
          if (this.oipfApp.privateData && this.oipfApp.privateData.keyset) {
            this.oipfApp.privateData.keyset.setValue(HBBTV_KEYSET.ALL);
            status.keysetRegistered = true;
          }
        }
      } else {
        // Polyfill window.VK_* for Smart TV browser fallback
        (window as any).VK_RED = HBBTV_KEYS.VK_RED;
        (window as any).VK_GREEN = HBBTV_KEYS.VK_GREEN;
        (window as any).VK_YELLOW = HBBTV_KEYS.VK_YELLOW;
        (window as any).VK_BLUE = HBBTV_KEYS.VK_BLUE;
        (window as any).VK_UP = HBBTV_KEYS.VK_UP;
        (window as any).VK_DOWN = HBBTV_KEYS.VK_DOWN;
        (window as any).VK_LEFT = HBBTV_KEYS.VK_LEFT;
        (window as any).VK_RIGHT = HBBTV_KEYS.VK_RIGHT;
        (window as any).VK_ENTER = HBBTV_KEYS.VK_ENTER;
        (window as any).VK_BACK = HBBTV_KEYS.VK_BACK;
      }

      // 2. Bind Broadcast Video Object
      this.broadcastVideoObj = document.getElementById('broadcastVideo') as HTMLObjectElement;
      if (this.broadcastVideoObj && typeof (this.broadcastVideoObj as any).bindToCurrentChannel === 'function') {
        try {
          (this.broadcastVideoObj as any).bindToCurrentChannel();
          status.broadcastBound = true;
        } catch (e) {
          console.warn('HbbTV broadcast video bind warning:', e);
        }
      }

      this.isInitialized = true;
    } catch (err) {
      console.warn('HbbTV Engine initialization warning (running in browser mode):', err);
    }

    return status;
  }

  // Mute or stop broadcast video audio when switching to HD Internet Stream
  public setBroadcastAudioState(enabled: boolean) {
    if (!this.broadcastVideoObj) return;

    try {
      const bVideo = this.broadcastVideoObj as any;
      if (enabled) {
        if (typeof bVideo.bindToCurrentChannel === 'function') {
          bVideo.bindToCurrentChannel();
        }
        if (bVideo.audio) {
          bVideo.audio.mute = false;
        }
      } else {
        // Disable broadcast audio while HD Internet Stream plays
        if (bVideo.audio) {
          bVideo.audio.mute = true;
        } else if (typeof bVideo.stop === 'function') {
          bVideo.stop();
        }
      }
    } catch (e) {
      console.warn('Failed to toggle broadcast audio:', e);
    }
  }

  // Generate HbbTV AIT XML (Application Information Table) for TDT multiplexer signaling
  public generateAitXml(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<mhp:ServiceDiscovery xmlns:mhp="urn:dvb:mhp:2009" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <mhp:ApplicationDiscoveryDomain>
    <mhp:Application>
      <mhp:appName>Inolvidable FM HbbTV</mhp:appName>
      <mhp:applicationIdentifier>
        <mhp:orgId>0x000000FA</mhp:orgId>
        <mhp:appId>0x0001</mhp:appId>
      </mhp:applicationIdentifier>
      <mhp:applicationControlCode>AUTOSTART</mhp:applicationControlCode>
      <mhp:visibility>VISIBLE_ALL</mhp:visibility>
      <mhp:serviceBound>true</mhp:serviceBound>
      <mhp:priority>1</mhp:priority>
      <mhp:transport>
        <mhp:URLBase>https://www.inolvidablefm.com/hbbtv/</mhp:URLBase>
      </mhp:transport>
      <mhp:location>index.html</mhp:location>
      <mhp:boundary>
        <mhp:extension>inolvidablefm.com</mhp:extension>
      </mhp:boundary>
      <mhp:parentalRating>
        <mhp:scheme>urn:dvb:mhp:2009:parentalRating</mhp:scheme>
        <mhp:value>0</mhp:value>
      </mhp:parentalRating>
    </mhp:Application>
  </mhp:ApplicationDiscoveryDomain>
</mhp:ServiceDiscovery>`;
  }
}

export const hbbtvEngine = new HbbtvEngine();
