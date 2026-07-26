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

// Tabla de Programación Oficial de Inolvidable FM Canarias (Extraída de inolvidablefm.es/#programas)
var officialWeeklySchedule = {
    // 0 = Domingo, 1 = Lunes, 2 = Martes, 3 = Miércoles, 4 = Jueves, 5 = Viernes, 6 = Sábado
    1: [ // LUNES
        { start: "01:00", end: "05:00", show: "Fórmula Inolvidable Noche", dj: "Emisión Automática", title: "Fórmula Nocturna Inolvidable FM", photo: "logo.png" },
        { start: "05:00", end: "11:00", show: "Morning Inolvidable", dj: "Michael Ramírez", title: "Radio DJ & Conductor del Morning", photo: "djs/michael_ramirez.jpg" },
        { start: "11:00", end: "15:00", show: "Fórmula Inolvidable", dj: "Juan Carlos Santomé", title: "Radio DJ & Coordinador Musical", photo: "djs/juan_carlos_santome.jpg" },
        { start: "15:00", end: "17:00", show: "Prime Time del Atasco", dj: "José Ibáñez", title: "Radio DJ & Conductor de El Prime Time", photo: "djs/jose_ibanez.jpg" },
        { start: "17:00", end: "21:00", show: "Fórmula Inolvidable", dj: "Jaime Falcón", title: "Radio DJ & Especialista Soul/Funk", photo: "djs/jaime_falcon.png" },
        { start: "21:00", end: "23:00", show: "Inolvidables de Colección", dj: "Carmen Díaz", title: "Radio DJ & Conductora de Colección", photo: "djs/carmen_diaz.jpg" },
        { start: "23:00", end: "01:00", show: "Baladas Inolvidables", dj: "Emisión Automática", title: "Selección Nocturna de Baladas", photo: "logo.png" }
    ],
    2: [ // MARTES
        { start: "01:00", end: "05:00", show: "Fórmula Inolvidable Noche", dj: "Emisión Automática", title: "Fórmula Nocturna Inolvidable FM", photo: "logo.png" },
        { start: "05:00", end: "11:00", show: "Morning Inolvidable", dj: "Michael Ramírez", title: "Radio DJ & Conductor del Morning", photo: "djs/michael_ramirez.jpg" },
        { start: "11:00", end: "15:00", show: "Fórmula Inolvidable", dj: "Juan Carlos Santomé", title: "Radio DJ & Coordinador Musical", photo: "djs/juan_carlos_santome.jpg" },
        { start: "15:00", end: "17:00", show: "Prime Time del Atasco", dj: "José Ibáñez", title: "Radio DJ & Conductor de El Prime Time", photo: "djs/jose_ibanez.jpg" },
        { start: "17:00", end: "21:00", show: "Fórmula Inolvidable", dj: "Jaime Falcón", title: "Radio DJ & Especialista Soul/Funk", photo: "djs/jaime_falcon.png" },
        { start: "21:00", end: "23:00", show: "Inolvidables de Colección", dj: "Carmen Díaz", title: "Radio DJ & Conductora de Colección", photo: "djs/carmen_diaz.jpg" },
        { start: "23:00", end: "01:00", show: "Baladas Inolvidables", dj: "Emisión Automática", title: "Selección Nocturna de Baladas", photo: "logo.png" }
    ],
    3: [ // MIÉRCOLES
        { start: "01:00", end: "05:00", show: "Fórmula Inolvidable Noche", dj: "Emisión Automática", title: "Fórmula Nocturna Inolvidable FM", photo: "logo.png" },
        { start: "05:00", end: "11:00", show: "Morning Inolvidable", dj: "Michael Ramírez", title: "Radio DJ & Conductor del Morning", photo: "djs/michael_ramirez.jpg" },
        { start: "11:00", end: "15:00", show: "Fórmula Inolvidable", dj: "Juan Carlos Santomé", title: "Radio DJ & Coordinador Musical", photo: "djs/juan_carlos_santome.jpg" },
        { start: "15:00", end: "17:00", show: "Prime Time del Atasco", dj: "José Ibáñez", title: "Radio DJ & Conductor de El Prime Time", photo: "djs/jose_ibanez.jpg" },
        { start: "17:00", end: "21:00", show: "Fórmula Inolvidable", dj: "Jaime Falcón", title: "Radio DJ & Especialista Soul/Funk", photo: "djs/jaime_falcon.png" },
        { start: "21:00", end: "23:00", show: "Inolvidables de Colección", dj: "Carmen Díaz", title: "Radio DJ & Conductora de Colección", photo: "djs/carmen_diaz.jpg" },
        { start: "23:00", end: "01:00", show: "Baladas Inolvidables", dj: "Emisión Automática", title: "Selección Nocturna de Baladas", photo: "logo.png" }
    ],
    4: [ // JUEVES
        { start: "01:00", end: "05:00", show: "Fórmula Inolvidable Noche", dj: "Emisión Automática", title: "Fórmula Nocturna Inolvidable FM", photo: "logo.png" },
        { start: "05:00", end: "11:00", show: "Morning Inolvidable", dj: "Michael Ramírez", title: "Radio DJ & Conductor del Morning", photo: "djs/michael_ramirez.jpg" },
        { start: "11:00", end: "15:00", show: "Fórmula Inolvidable", dj: "Juan Carlos Santomé", title: "Radio DJ & Coordinador Musical", photo: "djs/juan_carlos_santome.jpg" },
        { start: "15:00", end: "17:00", show: "Prime Time del Atasco", dj: "José Ibáñez", title: "Radio DJ & Conductor de El Prime Time", photo: "djs/jose_ibanez.jpg" },
        { start: "17:00", end: "21:00", show: "Fórmula Inolvidable", dj: "Jaime Falcón", title: "Radio DJ & Especialista Soul/Funk", photo: "djs/jaime_falcon.png" },
        { start: "21:00", end: "23:00", show: "Inolvidables de Colección", dj: "Carmen Díaz", title: "Radio DJ & Conductora de Colección", photo: "djs/carmen_diaz.jpg" },
        { start: "23:00", end: "01:00", show: "Baladas Inolvidables", dj: "Emisión Automática", title: "Selección Nocturna de Baladas", photo: "logo.png" }
    ],
    5: [ // VIERNES
        { start: "01:00", end: "05:00", show: "Fórmula Inolvidable Noche", dj: "Emisión Automática", title: "Fórmula Nocturna Inolvidable FM", photo: "logo.png" },
        { start: "05:00", end: "11:00", show: "Morning Inolvidable", dj: "Michael Ramírez", title: "Radio DJ & Conductor del Morning", photo: "djs/michael_ramirez.jpg" },
        { start: "11:00", end: "15:00", show: "Fórmula Inolvidable", dj: "Juan Carlos Santomé", title: "Radio DJ & Coordinador Musical", photo: "djs/juan_carlos_santome.jpg" },
        { start: "15:00", end: "17:00", show: "Prime Time del Atasco", dj: "José Ibáñez", title: "Radio DJ & Conductor de El Prime Time", photo: "djs/jose_ibanez.jpg" },
        { start: "17:00", end: "21:00", show: "Fórmula Inolvidable", dj: "Jaime Falcón", title: "Radio DJ & Especialista Soul/Funk", photo: "djs/jaime_falcon.png" },
        { start: "21:00", end: "22:00", show: "Inolvidables de Colección", dj: "Carmen Díaz", title: "Radio DJ & Conductora de Colección", photo: "djs/carmen_diaz.jpg" },
        { start: "22:00", end: "23:00", show: "Club 958", dj: "Tony Besa", title: "Radio DJ & Especialista Música Llenapistas", photo: "djs/tony_besa.png" },
        { start: "23:00", end: "01:00", show: "Inolvidables para Bailar", dj: "Emisión Automática", title: "Selección Bailable de Fin de Semana", photo: "logo.png" }
    ],
    6: [ // SÁBADO
        { start: "01:00", end: "07:00", show: "Fórmula Inolvidable Noche", dj: "Emisión Automática", title: "Fórmula Nocturna Inolvidable FM", photo: "logo.png" },
        { start: "07:00", end: "11:00", show: "Lo Mejor del Morning Inolvidable", dj: "Michael Ramírez", title: "Radio DJ & Conductor del Morning", photo: "djs/michael_ramirez.jpg" },
        { start: "11:00", end: "17:00", show: "Fórmula Weekend", dj: "Jaime Falcón", title: "Radio DJ & Especialista Soul/Funk", photo: "djs/jaime_falcon.png" },
        { start: "17:00", end: "22:00", show: "Fórmula Weekend", dj: "Juan Carlos Santomé", title: "Radio DJ & Coordinador Musical", photo: "djs/juan_carlos_santome.jpg" },
        { start: "22:00", end: "23:00", show: "Funkytown", dj: "Jaime Falcón", title: "Radio DJ & Creador de Funkytown", photo: "djs/jaime_falcon.png" },
        { start: "23:00", end: "01:00", show: "Inolvidables para Bailar", dj: "Emisión Automática", title: "Selección Bailable de Fin de Semana", photo: "logo.png" }
    ],
    0: [ // DOMINGO
        { start: "01:00", end: "07:00", show: "Fórmula Inolvidable Noche", dj: "Emisión Automática", title: "Fórmula Nocturna Inolvidable FM", photo: "logo.png" },
        { start: "07:00", end: "11:00", show: "Lo Mejor del Morning Inolvidable", dj: "Michael Ramírez", title: "Radio DJ & Conductor del Morning", photo: "djs/michael_ramirez.jpg" },
        { start: "11:00", end: "15:00", show: "Fórmula Weekend", dj: "José Ibáñez", title: "Radio DJ & Conductor de El Prime Time", photo: "djs/jose_ibanez.jpg" },
        { start: "15:00", end: "18:00", show: "Fórmula Weekend", dj: "Juan Carlos Santomé", title: "Radio DJ & Coordinador Musical", photo: "djs/juan_carlos_santome.jpg" },
        { start: "18:00", end: "22:00", show: "Fórmula Weekend", dj: "Jaime Falcón", title: "Radio DJ & Especialista Soul/Funk", photo: "djs/jaime_falcon.png" },
        { start: "22:00", end: "23:00", show: "Pase Privado", dj: "Xavier Valiño", title: "Periodista & Crítico de Pop y Rock", photo: "djs/xavier_valino.jpg" },
        { start: "23:00", end: "01:00", show: "Baladas Inolvidables", dj: "Emisión Automática", title: "Selección Nocturna de Baladas", photo: "logo.png" }
    ]
};

// Lista general de Radio DJs para navegación manual
var radioDjs = [
    {
        name: "Michael Ramírez",
        title: "Radio DJ & Conductor del Morning",
        program: "MORNING INOLVIDABLE",
        schedule: "Lunes a Viernes • 05:00 a 11:00 h",
        photo: "djs/michael_ramirez.jpg"
    },
    {
        name: "Juan Carlos Santomé",
        title: "Radio DJ & Coordinador Musical",
        program: "FÓRMULA INOLVIDABLE",
        schedule: "Lunes a Viernes • 11:00 a 15:00 h",
        photo: "djs/juan_carlos_santome.jpg"
    },
    {
        name: "José Ibáñez",
        title: "Radio DJ & Conductor de El Prime Time",
        program: "EL PRIME TIME DEL ATASCO",
        schedule: "Lunes a Viernes • 15:00 a 17:00 h",
        photo: "djs/jose_ibanez.jpg"
    },
    {
        name: "Jaime Falcón",
        title: "Radio DJ & Especialista Soul/Funk",
        program: "EDICIÓN TARDE & FUNKYTOWN",
        schedule: "Lunes a Sábado • 17:00 a 21:00 h",
        photo: "djs/jaime_falcon.png"
    },
    {
        name: "Carmen Díaz",
        title: "Radio DJ & Conductora de Colección",
        program: "INOLVIDABLES DE COLECCIÓN",
        schedule: "Lunes a Viernes • 21:00 a 23:00 h",
        photo: "djs/carmen_diaz.jpg"
    },
    {
        name: "Tony Besa",
        title: "Radio DJ & Especialista Música Llenapistas",
        program: "CLUB 958",
        schedule: "Viernes • 22:00 a 23:00 h",
        photo: "djs/tony_besa.png"
    },
    {
        name: "Xavier Valiño",
        title: "Periodista & Crítico de Pop y Rock",
        program: "PASE PRIVADO",
        schedule: "Domingo • 22:00 a 23:00 h",
        photo: "djs/xavier_valino.jpg"
    }
];

/**
 * Obtener las partes de tiempo oficial en Canarias (Atlantic/Canary)
 */
function getCanaryTimeParts() {
    var now = new Date();
    try {
        var dayName = new Intl.DateTimeFormat("en-US", { timeZone: "Atlantic/Canary", weekday: "short" }).format(now);
        var dayMap = { "Sun": 0, "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6 };
        var day = (dayMap[dayName] !== undefined) ? dayMap[dayName] : now.getDay();

        var timeStr = new Intl.DateTimeFormat("en-US", {
            timeZone: "Atlantic/Canary",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        }).format(now);

        var parts = timeStr.split(":");
        var hour = parseInt(parts[0], 10);
        if (hour === 24) hour = 0;
        var minute = parseInt(parts[1], 10);

        return { day: day, hour: hour, minute: minute, nowMinutes: hour * 60 + minute };
    } catch (e) {
        var h = now.getHours();
        var m = now.getMinutes();
        return { day: now.getDay(), hour: h, minute: m, nowMinutes: h * 60 + m };
    }
}

/**
 * Obtener el programa y Radio DJ en directo según la parrilla oficial y la hora exacta del usuario
 */
function getLiveProgramAndDj() {
    var canaryTime = getCanaryTimeParts();
    var day = canaryTime.day;
    var nowMinutes = canaryTime.nowMinutes;

    var daySchedule = officialWeeklySchedule[day];
    if (daySchedule) {
        for (var i = 0; i < daySchedule.length; i++) {
            var item = daySchedule[i];
            var startParts = item.start.split(":");
            var endParts = item.end.split(":");
            var startMin = parseInt(startParts[0], 10) * 60 + parseInt(startParts[1], 10);
            var endMin = parseInt(endParts[0], 10) * 60 + parseInt(endParts[1], 10);

            if (endMin < startMin) {
                // Rango nocturno cruzando la medianoche (ej. 23:00 a 01:00)
                if (nowMinutes >= startMin || nowMinutes < endMin) {
                    return item;
                }
            } else if (nowMinutes >= startMin && nowMinutes < endMin) {
                return item;
            }
        }
    }
    return daySchedule ? daySchedule[0] : null;
}

var currentDjIndex = 0;
var isManualDjOverride = false;

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

        // 4. Iniciar actualización continua de metadatos según el horario en tiempo real
        updateLiveDjMetadata();
        setInterval(updateLiveDjMetadata, 10000);

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
    updateLiveDjMetadata();
    playHdStreamAudio();

    var statusBadge = document.getElementById("audioStatusBadge");
    if (statusBadge) {
        statusBadge.innerText = "AUDIO: STREAMING HD 320 Kbps";
        statusBadge.style.color = "#4ade80";
    }
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

    var statusBadge = document.getElementById("audioStatusBadge");
    if (statusBadge) {
        statusBadge.innerText = "AUDIO: TDT CONVENCIONAL";
        statusBadge.style.color = "#38bdf8";
    }
    alert("Audio restaurado a la señal de Televisión TDT habitual.");
}

/**
 * Actualizar foto, nombre, función y programa del Radio DJ según la parrilla oficial
 */
function updateLiveDjMetadata() {
    var programNameEl = document.getElementById("programName");
    var songTitleEl = document.getElementById("songTitle");
    var songArtistEl = document.getElementById("songArtist");
    var songAlbumEl = document.getElementById("songAlbum");
    var coverImgEl = document.getElementById("coverImg");
    var liveBadgeEl = document.getElementById("liveBadge");

    if (!isManualDjOverride) {
        var liveData = getLiveProgramAndDj();
        if (liveData) {
            if (programNameEl) programNameEl.innerText = "PROGRAMA EN DIRECTO: " + liveData.show;
            if (songTitleEl) songTitleEl.innerText = liveData.dj;
            if (songArtistEl) songArtistEl.innerText = liveData.title;
            if (songAlbumEl) songAlbumEl.innerText = liveData.start + " a " + liveData.end + " h (Canarias)";
            if (liveBadgeEl) liveBadgeEl.innerText = "🔴 EN DIRECTO HD";

            if (coverImgEl) {
                coverImgEl.style.opacity = "0.3";
                setTimeout(function() {
                    coverImgEl.src = liveData.photo;
                    coverImgEl.alt = liveData.dj + " - " + liveData.show;
                    coverImgEl.style.opacity = "1";
                }, 150);
            }
            return;
        }
    }

    // Modo exploración manual de equipo/voces
    var dj = radioDjs[currentDjIndex];
    if (!dj) return;

    if (programNameEl) programNameEl.innerText = "PROGRAMA: " + dj.program;
    if (songTitleEl) songTitleEl.innerText = dj.name;
    if (songArtistEl) songArtistEl.innerText = dj.title;
    if (songAlbumEl) songAlbumEl.innerText = dj.schedule;
    if (liveBadgeEl) liveBadgeEl.innerText = "👤 VER EQUIPO DJ";

    if (coverImgEl) {
        coverImgEl.style.opacity = "0.3";
        setTimeout(function() {
            coverImgEl.src = dj.photo;
            coverImgEl.alt = "Foto de " + dj.name + " - Radio DJ Inolvidable FM";
            coverImgEl.style.opacity = "1";
        }, 150);
    }
}

/**
 * Rotar manualmente entre los locutores o volver al programa en directo
 */
function rotateLiveDj() {
    isManualDjOverride = true;
    currentDjIndex = (currentDjIndex + 1) % radioDjs.length;
    updateLiveDjMetadata();
}

/**
 * Volver a sincronizar con el programa en directo
 */
function resetToLiveSchedule() {
    isManualDjOverride = false;
    updateLiveDjMetadata();
}
