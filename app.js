/**
 * Application Engine HbbTV 2.0 - Inolvidable FM Canarias
 * Conforme con las especificaciones de la HbbTV Association (ETSI TS 102 796)
 * Código 100% Vanilla HTML5 / CSS / JavaScript sin dependencias pesadas
 */

// Códigos de tecla estándar HbbTV DVB
var VK_RED = 403;
var VK_GREEN = 404;
var VK_YELLOW = 405;
var VK_BLUE = 406;
var VK_UP = 38;
var VK_DOWN = 40;
var VK_LEFT = 37;
var VK_RIGHT = 39;
var VK_ENTER = 13;
var VK_BACK = 461;

// Máscaras Keyset OIPF
var KEYSET_RED = 0x1;
var KEYSET_GREEN = 0x2;
var KEYSET_YELLOW = 0x4;
var KEYSET_BLUE = 0x8;
var KEYSET_NAVIGATION = 0x10;
var KEYSET_ALL = KEYSET_RED + KEYSET_GREEN + KEYSET_YELLOW + KEYSET_BLUE + KEYSET_NAVIGATION;

// Estado global de la aplicación
var oipfApp = null;
var broadcastVideoObj = null;
var isSidebarOpen = false;
var activePanelId = null;
var isHdStreamPlaying = false;
var currentMenuIndex = 0;

// Lista de canciones para simulación de metadatos de radio en vivo
var songPlaylist = [
    { title: "Como Una Ola", artist: "Rocío Jurado", album: "Grandes Éxitos (1981)", cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80" },
    { title: "Un Beso y Una Flor", artist: "Nino Bravo", album: "Un Beso y Una Flor (1972)", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80" },
    { title: "Vivir Así Es Morir De Amor", artist: "Camilo Sesto", album: "Sentimientos (1978)", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80" },
    { title: "Me Olvidé de Vivir", artist: "Julio Iglesias", album: "A mis 33 años (1977)", cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80" },
    { title: "La Puerta de Alcalá", artist: "Ana Belén y Víctor Manuel", album: "Para la Ternura (1986)", cover: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&q=80" }
];
var songIndex = 0;

/**
 * Inicialización de la Aplicación HbbTV en Smart TV
 */
function initHbbtvApp() {
    console.log("[HbbTV Engine] Inicializando aplicación para Televisión TDT...");

    try {
        // 1. Obtener gestor de aplicación OIPF
        var appMan = document.getElementById("oipfAppMan");
        if (appMan && typeof appMan.getOwnerApplication === "function") {
            oipfApp = appMan.getOwnerApplication(document);
            if (oipfApp) {
                // Hacer visible el plano gráfico sobre la señal de TV
                if (typeof oipfApp.show === "function") oipfApp.show();
                if (typeof oipfApp.activate === "function") oipfApp.activate();

                // Registrar botones de colores y navegación en el mando
                if (oipfApp.privateData && oipfApp.privateData.keyset) {
                    oipfApp.privateData.keyset.setValue(KEYSET_ALL);
                    console.log("[HbbTV Engine] Keyset registrado con éxito: 0x1F");
                }
            }
        }

        // 2. Vincular vídeo/audio de emisión TDT
        broadcastVideoObj = document.getElementById("broadcastVideo");
        if (broadcastVideoObj && typeof broadcastVideoObj.bindToCurrentChannel === "function") {
            try {
                broadcastVideoObj.bindToCurrentChannel();
                console.log("[HbbTV Engine] Objeto video/broadcast vinculado a canal TDT");
            } catch (e) {
                console.warn("[HbbTV Engine] Advertencia bindToCurrentChannel:", e);
            }
        }

        // 3. Registrar eventos de teclado / mando a distancia
        document.addEventListener("keydown", handleGlobalKeyDown, false);

        // 4. Iniciar rotación de metadatos de emisión en directo
        setInterval(rotateLiveSongMetadata, 10000);

    } catch (err) {
        console.warn("[HbbTV Engine] Modo navegador de escritorio (Fallback emulador activo):", err);
    }
}

/**
 * Gestor Central de Eventos de Teclado y Mando
 */
function handleGlobalKeyDown(e) {
    var keyCode = e.keyCode || e.which;
    var keyName = e.key ? e.key.toLowerCase() : "";

    console.log("[HbbTV Key Event] KeyCode pressed:", keyCode, "KeyName:", keyName);

    // Mapeo Botón Rojo (Menú)
    if (keyCode === VK_RED || keyCode === 114 || keyName === "r" || keyName === "1") {
        e.preventDefault();
        toggleSidebarMenu();
        return;
    }

    // Mapeo Botón Verde (Radio HD)
    if (keyCode === VK_GREEN || keyCode === 115 || keyName === "g" || keyName === "2") {
        e.preventDefault();
        selectGreenRadioHd();
        return;
    }

    // Mapeo Botón Amarillo (Web)
    if (keyCode === VK_YELLOW || keyCode === 119 || keyName === "y" || keyName === "3") {
        e.preventDefault();
        selectYellowWeb();
        return;
    }

    // Mapeo Botón Azul (Empresas QR)
    if (keyCode === VK_BLUE || keyCode === 66 || keyName === "b" || keyName === "4") {
        e.preventDefault();
        selectBlueEmpresas();
        return;
    }

    // Prevenir scroll nativo del navegador de TV para flechas y barra espaciadora
    if (keyCode === VK_LEFT || keyCode === VK_RIGHT || keyCode === 33 || keyCode === 34 || keyCode === 32 || keyName === "arrowleft" || keyName === "arrowright" || keyName === "pageup" || keyName === "pagedown") {
        e.preventDefault();
        return;
    }

    // Mapeo Teclas NAVEGACIÓN (Arriba / Abajo)
    if (keyCode === VK_UP || keyName === "arrowup") {
        e.preventDefault();
        if (isSidebarOpen) navigateMenu(-1);
        return;
    }
    if (keyCode === VK_DOWN || keyName === "arrowdown") {
        e.preventDefault();
        if (isSidebarOpen) navigateMenu(1);
        return;
    }

    // Mapeo Tecla ENTER / OK
    if (keyCode === VK_ENTER || keyName === "enter") {
        e.preventDefault();
        if (isSidebarOpen) triggerMenuSelection(currentMenuIndex);
        return;
    }

    // Mapeo Tecla ATRÁS / ESC / BACKSPACE
    if (keyCode === VK_BACK || keyCode === 8 || keyCode === 27 || keyCode === 10009 || keyName === "escape" || keyName === "backspace") {
        e.preventDefault();
        closeAllPanels();
        closeSidebarMenu();
        return;
    }
}

/**
 * Abrir / Cerrar Menú Lateral
 */
function toggleSidebarMenu() {
    isSidebarOpen = !isSidebarOpen;
    var sidebar = document.getElementById("sidebarMenu");
    var redPrompt = document.getElementById("redPrompt");

    if (isSidebarOpen) {
        sidebar.classList.add("open");
        redPrompt.style.display = "none";
    } else {
        sidebar.classList.remove("open");
        redPrompt.style.display = "flex";
    }
}

function closeSidebarMenu() {
    isSidebarOpen = false;
    document.getElementById("sidebarMenu").classList.remove("open");
    document.getElementById("redPrompt").style.display = "flex";
}

/**
 * Navegación con Flechas por el Menú Lateral
 */
function navigateMenu(direction) {
    document.getElementById("mItem" + currentMenuIndex).classList.remove("active");
    currentMenuIndex = (currentMenuIndex + direction + 3) % 3;
    document.getElementById("mItem" + currentMenuIndex).classList.add("active");
}

function triggerMenuSelection(index) {
    if (index === 0) selectGreenRadioHd();
    else if (index === 1) selectYellowWeb();
    else if (index === 2) selectBlueEmpresas();
}

/**
 * OPCIÓN VERDE: Radio HD Streaming
 */
function selectGreenRadioHd() {
    closeSidebarMenu();
    openPanel("panelRadioHd");
    playHdStreamAudio();

    document.getElementById("audioStatusBadge").innerText = "AUDIO: STREAMING HD 320 Kbps";
    document.getElementById("audioStatusBadge").style.color = "#4ade80";
}

/**
 * OPCIÓN AMARILLA: Portal Web
 */
function selectYellowWeb() {
    closeSidebarMenu();
    openPanel("panelWeb");
}

/**
 * OPCIÓN AZUL: Empresas & Código QR
 */
function selectBlueEmpresas() {
    closeSidebarMenu();
    openPanel("panelEmpresas");
}

/**
 * Gestión de Paneles de Pantalla
 */
function openPanel(panelId) {
    closeAllPanels();
    activePanelId = panelId;
    var targetPanel = document.getElementById(panelId);
    if (targetPanel) {
        targetPanel.classList.add("active");
    }
}

function closeAllPanels() {
    activePanelId = null;
    var panels = document.querySelectorAll(".content-panel");
    for (var i = 0; i < panels.length; i++) {
        panels[i].classList.remove("active");
    }
}

/**
 * Control del Audio Streaming HD e Interrupción de Audio TDT
 */
function playHdStreamAudio() {
    var audio = document.getElementById("hdStreamAudio");
    if (audio) {
        // Silenciar audio broadcast TDT
        if (broadcastVideoObj) {
            try {
                if (broadcastVideoObj.audio) broadcastVideoObj.audio.mute = true;
            } catch (e) {}
        }

        audio.play().then(function() {
            isHdStreamPlaying = true;
            document.getElementById("btnPlayPause").innerText = "⏸ Pausar Stream HD";
        }).catch(function(err) {
            console.warn("Autoplay bloqueado:", err);
        });
    }
}

function toggleHdStreamAudio() {
    var audio = document.getElementById("hdStreamAudio");
    if (!audio) return;

    if (isHdStreamPlaying) {
        audio.pause();
        isHdStreamPlaying = false;
        document.getElementById("btnPlayPause").innerText = "▶ Reproducir Stream HD";
    } else {
        playHdStreamAudio();
    }
}

function restoreTdtAudio() {
    var audio = document.getElementById("hdStreamAudio");
    if (audio) {
        audio.pause();
        isHdStreamPlaying = false;
    }

    // Reactivar audio broadcast TDT
    if (broadcastVideoObj) {
        try {
            if (typeof broadcastVideoObj.bindToCurrentChannel === "function") {
                broadcastVideoObj.bindToCurrentChannel();
            }
            if (broadcastVideoObj.audio) broadcastVideoObj.audio.mute = false;
        } catch (e) {}
    }

    document.getElementById("audioStatusBadge").innerText = "AUDIO: TDT CONVENCIONAL";
    document.getElementById("audioStatusBadge").style.color = "#38bdf8";
    alert("Audio restaurado a la señal de Televisión TDT habitual.");
}

/**
 * Actualizar canción y metadatos en directo
 */
function rotateLiveSongMetadata() {
    songIndex = (songIndex + 1) % songPlaylist.length;
    var currentSong = songPlaylist[songIndex];

    var songTitleEl = document.getElementById("songTitle");
    var songArtistEl = document.getElementById("songArtist");
    var songAlbumEl = document.getElementById("songAlbum");
    var coverImgEl = document.getElementById("coverImg");

    if (songTitleEl) songTitleEl.innerText = currentSong.title;
    if (songArtistEl) songArtistEl.innerText = currentSong.artist;
    if (songAlbumEl) songAlbumEl.innerText = currentSong.album;
    if (coverImgEl) coverImgEl.src = currentSong.cover;
}
