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

// Mapeo de fotos oficiales de Radio DJs (Remota CDN + Local de Respaldo)
var djPhotoMap = {
    "Michael Ramírez": {
        remote: "https://inolvidablefm.es/cmsAdmin/uploads/o_1j1fs3ie67ihehj1egulf9hbna.jpg",
        local: "djs/michael_ramirez.jpg"
    },
    "Juan Carlos Santomé": {
        remote: "https://inolvidablefm.es/cmsAdmin/uploads/o_1ijapk7uso8m11sn10r1g05mhia.jpg",
        local: "djs/juan_carlos_santome.jpg"
    },
    "José Ibáñez": {
        remote: "https://inolvidablefm.es/cmsAdmin/uploads/o_1j3j3ev8e11gc114jdf7i2ebari.jpg",
        local: "djs/jose_ibanez.jpg"
    },
    "Jaime Falcón": {
        remote: "https://inolvidablefm.es/cmsAdmin/uploads/o_1ijaq5gkcidervbr0v1jvp1sv7a.png",
        local: "djs/jaime_falcon.png"
    },
    "Carmen Díaz": {
        remote: "https://inolvidablefm.es/cmsAdmin/uploads/o_1j1frnqu0qct1psc106q7ij1r1a.jpg",
        local: "djs/carmen_diaz.jpg"
    },
    "Xavier Valiño": {
        remote: "https://inolvidablefm.es/cmsAdmin/uploads/o_1ffna010eanr12mf1o5m1dtjbi2a.jpg",
        local: "djs/xavier_valino.jpg"
    },
    "Tony Besa": {
        remote: "https://inolvidablefm.es/cmsAdmin/uploads/o_1ijapk7uso8m11sn10r1g05mhia.jpg",
        local: "djs/tony_besa.png"
    }
};

function getDjPhotoSources(djName, fallbackPath) {
    if (djPhotoMap[djName]) {
        return djPhotoMap[djName];
    }
    return {
        remote: fallbackPath || "logo.png",
        local: "logo.png"
    };
}

function handleCoverImgError(img) {
    if (!img) return;
    var fallback = img.getAttribute("data-fallback");
    if (fallback && img.src !== fallback && !img.src.endsWith(fallback)) {
        img.src = fallback;
        img.removeAttribute("data-fallback");
        return;
    }
    if (!img.src.endsWith("logo.png") && !img.src.endsWith("logo.png")) {
        img.src = "logo.png";
    }
}
window.handleCoverImgError = handleCoverImgError;

// Tabla de Programación Oficial de Inolvidable FM Canarias (Extraída de inolvidablefm.es/#programas)
var officialWeeklySchedule = {
    // 0 = Domingo, 1 = Lunes, 2 = Martes, 3 = Miércoles, 4 = Jueves, 5 = Viernes, 6 = Sábado
    1: [ // LUNES
        { start: "01:00", end: "05:00", show: "Fórmula Inolvidable Noche", dj: "Emisión Automática", title: "Fórmula Nocturna Inolvidable FM", photo: "logo.png" },
        { start: "05:00", end: "11:00", show: "Morning Inolvidable", dj: "Michael Ramírez", title: "Radio DJ & Conductor del Morning", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1j1fs3ie67ihehj1egulf9hbna.jpg" },
        { start: "11:00", end: "15:00", show: "Fórmula Inolvidable", dj: "Juan Carlos Santomé", title: "Radio DJ & Coordinador Musical", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1ijapk7uso8m11sn10r1g05mhia.jpg" },
        { start: "15:00", end: "17:00", show: "Prime Time del Atasco", dj: "José Ibáñez", title: "Radio DJ & Conductor de El Prime Time", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1j3j3ev8e11gc114jdf7i2ebari.jpg" },
        { start: "17:00", end: "21:00", show: "Fórmula Inolvidable", dj: "Jaime Falcón", title: "Radio DJ & Especialista Soul/Funk", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1ijaq5gkcidervbr0v1jvp1sv7a.png" },
        { start: "21:00", end: "23:00", show: "Inolvidables de Colección", dj: "Carmen Díaz", title: "Radio DJ & Conductora de Colección", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1j1frnqu0qct1psc106q7ij1r1a.jpg" },
        { start: "23:00", end: "01:00", show: "Baladas Inolvidables", dj: "Emisión Automática", title: "Selección Nocturna de Baladas", photo: "logo.png" }
    ],
    2: [ // MARTES
        { start: "01:00", end: "05:00", show: "Fórmula Inolvidable Noche", dj: "Emisión Automática", title: "Fórmula Nocturna Inolvidable FM", photo: "logo.png" },
        { start: "05:00", end: "11:00", show: "Morning Inolvidable", dj: "Michael Ramírez", title: "Radio DJ & Conductor del Morning", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1j1fs3ie67ihehj1egulf9hbna.jpg" },
        { start: "11:00", end: "15:00", show: "Fórmula Inolvidable", dj: "Juan Carlos Santomé", title: "Radio DJ & Coordinador Musical", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1ijapk7uso8m11sn10r1g05mhia.jpg" },
        { start: "15:00", end: "17:00", show: "Prime Time del Atasco", dj: "José Ibáñez", title: "Radio DJ & Conductor de El Prime Time", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1j3j3ev8e11gc114jdf7i2ebari.jpg" },
        { start: "17:00", end: "21:00", show: "Fórmula Inolvidable", dj: "Jaime Falcón", title: "Radio DJ & Especialista Soul/Funk", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1ijaq5gkcidervbr0v1jvp1sv7a.png" },
        { start: "21:00", end: "23:00", show: "Inolvidables de Colección", dj: "Carmen Díaz", title: "Radio DJ & Conductora de Colección", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1j1frnqu0qct1psc106q7ij1r1a.jpg" },
        { start: "23:00", end: "01:00", show: "Baladas Inolvidables", dj: "Emisión Automática", title: "Selección Nocturna de Baladas", photo: "logo.png" }
    ],
    3: [ // MIÉRCOLES
        { start: "01:00", end: "05:00", show: "Fórmula Inolvidable Noche", dj: "Emisión Automática", title: "Fórmula Nocturna Inolvidable FM", photo: "logo.png" },
        { start: "05:00", end: "11:00", show: "Morning Inolvidable", dj: "Michael Ramírez", title: "Radio DJ & Conductor del Morning", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1j1fs3ie67ihehj1egulf9hbna.jpg" },
        { start: "11:00", end: "15:00", show: "Fórmula Inolvidable", dj: "Juan Carlos Santomé", title: "Radio DJ & Coordinador Musical", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1ijapk7uso8m11sn10r1g05mhia.jpg" },
        { start: "15:00", end: "17:00", show: "Prime Time del Atasco", dj: "José Ibáñez", title: "Radio DJ & Conductor de El Prime Time", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1j3j3ev8e11gc114jdf7i2ebari.jpg" },
        { start: "17:00", end: "21:00", show: "Fórmula Inolvidable", dj: "Jaime Falcón", title: "Radio DJ & Especialista Soul/Funk", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1ijaq5gkcidervbr0v1jvp1sv7a.png" },
        { start: "21:00", end: "23:00", show: "Inolvidables de Colección", dj: "Carmen Díaz", title: "Radio DJ & Conductora de Colección", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1j1frnqu0qct1psc106q7ij1r1a.jpg" },
        { start: "23:00", end: "01:00", show: "Baladas Inolvidables", dj: "Emisión Automática", title: "Selección Nocturna de Baladas", photo: "logo.png" }
    ],
    4: [ // JUEVES
        { start: "01:00", end: "05:00", show: "Fórmula Inolvidable Noche", dj: "Emisión Automática", title: "Fórmula Nocturna Inolvidable FM", photo: "logo.png" },
        { start: "05:00", end: "11:00", show: "Morning Inolvidable", dj: "Michael Ramírez", title: "Radio DJ & Conductor del Morning", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1j1fs3ie67ihehj1egulf9hbna.jpg" },
        { start: "11:00", end: "15:00", show: "Fórmula Inolvidable", dj: "Juan Carlos Santomé", title: "Radio DJ & Coordinador Musical", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1ijapk7uso8m11sn10r1g05mhia.jpg" },
        { start: "15:00", end: "17:00", show: "Prime Time del Atasco", dj: "José Ibáñez", title: "Radio DJ & Conductor de El Prime Time", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1j3j3ev8e11gc114jdf7i2ebari.jpg" },
        { start: "17:00", end: "21:00", show: "Fórmula Inolvidable", dj: "Jaime Falcón", title: "Radio DJ & Especialista Soul/Funk", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1ijaq5gkcidervbr0v1jvp1sv7a.png" },
        { start: "21:00", end: "23:00", show: "Inolvidables de Colección", dj: "Carmen Díaz", title: "Radio DJ & Conductora de Colección", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1j1frnqu0qct1psc106q7ij1r1a.jpg" },
        { start: "23:00", end: "01:00", show: "Baladas Inolvidables", dj: "Emisión Automática", title: "Selección Nocturna de Baladas", photo: "logo.png" }
    ],
    5: [ // VIERNES
        { start: "01:00", end: "05:00", show: "Fórmula Inolvidable Noche", dj: "Emisión Automática", title: "Fórmula Nocturna Inolvidable FM", photo: "logo.png" },
        { start: "05:00", end: "11:00", show: "Morning Inolvidable", dj: "Michael Ramírez", title: "Radio DJ & Conductor del Morning", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1j1fs3ie67ihehj1egulf9hbna.jpg" },
        { start: "11:00", end: "15:00", show: "Fórmula Inolvidable", dj: "Juan Carlos Santomé", title: "Radio DJ & Coordinador Musical", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1ijapk7uso8m11sn10r1g05mhia.jpg" },
        { start: "15:00", end: "17:00", show: "Prime Time del Atasco", dj: "José Ibáñez", title: "Radio DJ & Conductor de El Prime Time", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1j3j3ev8e11gc114jdf7i2ebari.jpg" },
        { start: "17:00", end: "21:00", show: "Fórmula Inolvidable", dj: "Jaime Falcón", title: "Radio DJ & Especialista Soul/Funk", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1ijaq5gkcidervbr0v1jvp1sv7a.png" },
        { start: "21:00", end: "22:00", show: "Inolvidables de Colección", dj: "Carmen Díaz", title: "Radio DJ & Conductora de Colección", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1j1frnqu0qct1psc106q7ij1r1a.jpg" },
        { start: "22:00", end: "23:00", show: "Club 958", dj: "Tony Besa", title: "Radio DJ & Especialista Música Llenapistas", photo: "djs/tony_besa.png" },
        { start: "23:00", end: "01:00", show: "Inolvidables para Bailar", dj: "Emisión Automática", title: "Selección Bailable de Fin de Semana", photo: "logo.png" }
    ],
    6: [ // SÁBADO
        { start: "01:00", end: "07:00", show: "Fórmula Inolvidable Noche", dj: "Emisión Automática", title: "Fórmula Nocturna Inolvidable FM", photo: "logo.png" },
        { start: "07:00", end: "11:00", show: "Lo Mejor del Morning Inolvidable", dj: "Michael Ramírez", title: "Radio DJ & Conductor del Morning", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1j1fs3ie67ihehj1egulf9hbna.jpg" },
        { start: "11:00", end: "17:00", show: "Fórmula Weekend", dj: "Jaime Falcón", title: "Radio DJ & Especialista Soul/Funk", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1ijaq5gkcidervbr0v1jvp1sv7a.png" },
        { start: "17:00", end: "22:00", show: "Fórmula Weekend", dj: "Juan Carlos Santomé", title: "Radio DJ & Coordinador Musical", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1ijapk7uso8m11sn10r1g05mhia.jpg" },
        { start: "22:00", end: "23:00", show: "Funkytown", dj: "Jaime Falcón", title: "Radio DJ & Creador de Funkytown", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1ijaq5gkcidervbr0v1jvp1sv7a.png" },
        { start: "23:00", end: "01:00", show: "Inolvidables para Bailar", dj: "Emisión Automática", title: "Selección Bailable de Fin de Semana", photo: "logo.png" }
    ],
    0: [ // DOMINGO
        { start: "01:00", end: "07:00", show: "Fórmula Inolvidable Noche", dj: "Emisión Automática", title: "Fórmula Nocturna Inolvidable FM", photo: "logo.png" },
        { start: "07:00", end: "11:00", show: "Lo Mejor del Morning Inolvidable", dj: "Michael Ramírez", title: "Radio DJ & Conductor del Morning", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1j1fs3ie67ihehj1egulf9hbna.jpg" },
        { start: "11:00", end: "15:00", show: "Fórmula Weekend", dj: "José Ibáñez", title: "Radio DJ & Conductor de El Prime Time", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1j3j3ev8e11gc114jdf7i2ebari.jpg" },
        { start: "15:00", end: "18:00", show: "Fórmula Weekend", dj: "Juan Carlos Santomé", title: "Radio DJ & Coordinador Musical", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1ijapk7uso8m11sn10r1g05mhia.jpg" },
        { start: "18:00", end: "22:00", show: "Fórmula Weekend", dj: "Jaime Falcón", title: "Radio DJ & Especialista Soul/Funk", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1ijaq5gkcidervbr0v1jvp1sv7a.png" },
        { start: "22:00", end: "23:00", show: "Pase Privado", dj: "Xavier Valiño", title: "Periodista & Crítico de Pop y Rock", photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1ffna010eanr12mf1o5m1dtjbi2a.jpg" },
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
        photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1j1fs3ie67ihehj1egulf9hbna.jpg"
    },
    {
        name: "Juan Carlos Santomé",
        title: "Radio DJ & Coordinador Musical",
        program: "FÓRMULA INOLVIDABLE",
        schedule: "Lunes a Viernes • 11:00 a 15:00 h",
        photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1ijapk7uso8m11sn10r1g05mhia.jpg"
    },
    {
        name: "José Ibáñez",
        title: "Radio DJ & Conductor de El Prime Time",
        program: "EL PRIME TIME DEL ATASCO",
        schedule: "Lunes a Viernes • 15:00 a 17:00 h",
        photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1j3j3ev8e11gc114jdf7i2ebari.jpg"
    },
    {
        name: "Jaime Falcón",
        title: "Radio DJ & Especialista Soul/Funk",
        program: "EDICIÓN TARDE & FUNKYTOWN",
        schedule: "Lunes a Sábado • 17:00 a 21:00 h",
        photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1ijaq5gkcidervbr0v1jvp1sv7a.png"
    },
    {
        name: "Carmen Díaz",
        title: "Radio DJ & Conductora de Colección",
        program: "INOLVIDABLES DE COLECCIÓN",
        schedule: "Lunes a Viernes • 21:00 a 23:00 h",
        photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1j1frnqu0qct1psc106q7ij1r1a.jpg"
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
        photo: "https://inolvidablefm.es/cmsAdmin/uploads/o_1ffna010eanr12mf1o5m1dtjbi2a.jpg"
    }
];

/**
 * Obtener las partes de tiempo oficial en Madrid (España) - Europe/Madrid
 */
function getMadridTimeParts() {
    var now = new Date();
    try {
        var dayName = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Madrid", weekday: "short" }).format(now);
        var dayMap = { "Sun": 0, "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6 };
        var day = (dayMap[dayName] !== undefined) ? dayMap[dayName] : now.getDay();

        var timeStr = new Intl.DateTimeFormat("en-US", {
            timeZone: "Europe/Madrid",
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

function getCanaryTimeParts() {
    return getMadridTimeParts();
}

/**
 * Obtener el programa y Radio DJ en directo según la parrilla oficial y la hora exacta de Madrid (España)
 */
function getLiveProgramAndDj() {
    var madridTime = getMadridTimeParts();
    var day = madridTime.day;
    var nowMinutes = madridTime.nowMinutes;

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
 * OPCIÓN AMARILLA: Conócenos (Presentación Corporativa)
 */
function selectYellowWeb() {
    closeSidebarMenu();
    openPanel("panelWeb");
}

function selectYellowConocenos() {
    selectYellowWeb();
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
        if (panels[i].id === "panelTdtSplit" || panels[i].id === "panelMobileIntranet") {
            panels[i].style.display = "none";
        }
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
            if (songAlbumEl) songAlbumEl.innerText = liveData.start + " a " + liveData.end + " h";
            if (liveBadgeEl) liveBadgeEl.innerText = "🔴 EN DIRECTO HD";

            if (coverImgEl) {
                coverImgEl.style.opacity = "0.3";
                setTimeout(function() {
                    var sources = getDjPhotoSources(liveData.dj, liveData.photo);
                    coverImgEl.setAttribute("data-fallback", sources.local);
                    coverImgEl.onerror = function() { handleCoverImgError(this); };
                    coverImgEl.src = sources.remote;
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
            var sources = getDjPhotoSources(dj.name, dj.photo);
            coverImgEl.setAttribute("data-fallback", sources.local);
            coverImgEl.onerror = function() { handleCoverImgError(this); };
            coverImgEl.src = sources.remote;
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

/* ==========================================================================
   PORTAL COMERCIAL Y CARTELERÍA DIGITAL TDT PARA BARES
   ========================================================================== */

var currentTheme = "pizarra";
var mobileOrderItems = [];

/**
 * Actualizar la información del cartel publicitario del bar en tiempo real
 */
function updateBarOffer() {
    var barName = document.getElementById("barNameInput") ? document.getElementById("barNameInput").value : "Bar Restaurante La Plaza";
    var barLoc = document.getElementById("barLocationInput") ? document.getElementById("barLocationInput").value : "Las Palmas de Gran Canaria";
    var offerTitle = document.getElementById("offerTitleInput") ? document.getElementById("offerTitleInput").value : "Menú Ejecutivo del Día";
    var timeSlot = document.getElementById("timeSlotInput") ? document.getElementById("timeSlotInput").value : "Almuerzos (12:00 - 16:00 h)";
    var firstDish = document.getElementById("firstDishInput") ? document.getElementById("firstDishInput").value : "Puchero Canario con Siete Carnes";
    var secondDish = document.getElementById("secondDishInput") ? document.getElementById("secondDishInput").value : "Cherne a la Espalda con Papas Arrugadas y Mojo";
    var dessert = document.getElementById("dessertInput") ? document.getElementById("dessertInput").value : "Mousse de Gofio + Copa de Vino o Cerveza";
    var price = document.getElementById("priceInput") ? document.getElementById("priceInput").value : "12,50 €";
    var photoUrl = document.getElementById("photoUrlInput") ? document.getElementById("photoUrlInput").value : "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80";

    // 1. Actualizar Vista Previa Miniatura
    if (document.getElementById("previewBarName")) document.getElementById("previewBarName").innerText = barName || "Bar Restaurante";
    if (document.getElementById("previewBarLocation")) document.getElementById("previewBarLocation").innerText = "📍 " + (barLoc || "Canarias");
    if (document.getElementById("previewOfferTitle")) document.getElementById("previewOfferTitle").innerText = offerTitle || "OFERTA DEL DÍA";
    if (document.getElementById("previewFirstDish")) document.getElementById("previewFirstDish").innerText = firstDish;
    if (document.getElementById("previewSecondDish")) document.getElementById("previewSecondDish").innerText = secondDish;
    if (document.getElementById("previewDessert")) document.getElementById("previewDessert").innerText = dessert;
    if (document.getElementById("previewPrice")) document.getElementById("previewPrice").innerText = price;
    if (document.getElementById("previewDishImg")) document.getElementById("previewDishImg").src = photoUrl;

    // 2. Actualizar Pantalla TDT Fullscreen 50/50
    if (document.getElementById("fullBarName")) document.getElementById("fullBarName").innerText = barName || "Bar Restaurante";
    if (document.getElementById("fullBarLocation")) document.getElementById("fullBarLocation").innerText = "📍 " + (barLoc || "Canarias");
    if (document.getElementById("fullTimeSlot")) document.getElementById("fullTimeSlot").innerText = timeSlot.split(" ")[0].toUpperCase() || "OFERTA";
    if (document.getElementById("fullOfferTitle")) document.getElementById("fullOfferTitle").innerText = offerTitle || "MENÚ DEL DÍA";
    if (document.getElementById("fullFirstDish")) document.getElementById("fullFirstDish").innerText = firstDish;
    if (document.getElementById("fullSecondDish")) document.getElementById("fullSecondDish").innerText = secondDish;
    if (document.getElementById("fullDessert")) document.getElementById("fullDessert").innerText = dessert;
    if (document.getElementById("fullPrice")) document.getElementById("fullPrice").innerText = price;
    if (document.getElementById("fullDishImg")) document.getElementById("fullDishImg").src = photoUrl;

    // 3. Generar Código QR Dinámico (Apunta al modo Carta Móvil con el parámetro del bar)
    var mobileUrl = window.location.origin + window.location.pathname + "?mode=mobile_intranet&bar=" + encodeURIComponent(barName);
    var qrApiUrl = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + encodeURIComponent(mobileUrl);
    
    if (document.getElementById("previewQrImg")) document.getElementById("previewQrImg").src = qrApiUrl;
    if (document.getElementById("fullQrImg")) document.getElementById("fullQrImg").src = qrApiUrl;

    // 4. Sincronizar Carta Móvil
    if (document.getElementById("mobileBarName")) document.getElementById("mobileBarName").innerText = barName;
    if (document.getElementById("mobileBarLocation")) document.getElementById("mobileBarLocation").innerText = "📍 " + barLoc + " • TDT Inolvidable FM";
    if (document.getElementById("mobileOfferTitle")) document.getElementById("mobileOfferTitle").innerText = offerTitle;
    if (document.getElementById("mobilePriceTag")) document.getElementById("mobilePriceTag").innerText = price;
    if (document.getElementById("mobFirstDishTitle")) document.getElementById("mobFirstDishTitle").innerText = firstDish;
    if (document.getElementById("mobSecondDishTitle")) document.getElementById("mobSecondDishTitle").innerText = secondDish;
    if (document.getElementById("mobDessertTitle")) document.getElementById("mobDessertTitle").innerText = dessert;

    // 5. Sincronizar Metadatos del DJ en Split
    var liveData = getLiveProgramAndDj();
    if (liveData) {
        if (document.getElementById("splitProgramName")) document.getElementById("splitProgramName").innerText = "PROGRAMA: " + liveData.show;
        if (document.getElementById("splitDjName")) document.getElementById("splitDjName").innerText = liveData.dj;
        if (document.getElementById("splitShowTitle")) document.getElementById("splitShowTitle").innerText = liveData.title;
        if (document.getElementById("miniProgramText")) document.getElementById("miniProgramText").innerText = liveData.show;
        if (document.getElementById("miniSongText")) document.getElementById("miniSongText").innerText = liveData.dj;
        
        var splitPhotoEl = document.getElementById("splitDjPhoto");
        if (splitPhotoEl) {
            var sources = getDjPhotoSources(liveData.dj, liveData.photo);
            splitPhotoEl.setAttribute("data-fallback", sources.local);
            splitPhotoEl.onerror = function() { handleCoverImgError(this); };
            splitPhotoEl.src = sources.remote;
        }
    }
}
window.updateBarOffer = updateBarOffer;

/**
 * Seleccionar plantilla de diseño visual para el cartel
 */
function selectTheme(themeName) {
    currentTheme = themeName;

    // Actualizar botones de plantilla
    var themeBtns = document.querySelectorAll(".theme-btn");
    themeBtns.forEach(function(btn) {
        if (btn.getAttribute("data-theme") === themeName) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    // Aplicar clase de tema a las cajas del cartel
    var miniCartel = document.getElementById("miniCartelBox");
    var fullCartel = document.getElementById("fullCartelThemeBox");

    if (miniCartel) {
        miniCartel.className = "mini-split-right theme-" + themeName;
    }
    if (fullCartel) {
        fullCartel.className = "bar-cartel-full-card theme-" + themeName;
    }
}
window.selectTheme = selectTheme;

/**
 * Seleccionar preset de foto de plato
 */
function selectPhotoPreset(url) {
    var photoInput = document.getElementById("photoUrlInput");
    if (photoInput) {
        photoInput.value = url;
        updateBarOffer();
    }
    var chips = document.querySelectorAll(".chip-btn");
    chips.forEach(function(c) {
        if (c.getAttribute("onclick") && c.getAttribute("onclick").indexOf(url) !== -1) {
            c.classList.add("active");
        } else {
            c.classList.remove("active");
        }
    });
}
window.selectPhotoPreset = selectPhotoPreset;

/**
 * Abrir Modo Pantalla Completa TDT 50/50
 */
function openTdtSplitMode() {
    updateBarOffer();
    closeAllPanels();
    var splitPanel = document.getElementById("panelTdtSplit");
    if (splitPanel) {
        splitPanel.style.display = "flex";
        activePanelId = "panelTdtSplit";
    }
}
window.openTdtSplitMode = openTdtSplitMode;

/**
 * Simular escaneo de código QR (Abre vista de carta móvil para clientes)
 */
function simulateQrScan() {
    updateBarOffer();
    var mobilePanel = document.getElementById("panelMobileIntranet");
    if (mobilePanel) {
        mobilePanel.style.display = "flex";
    }
}
window.simulateQrScan = simulateQrScan;

/**
 * Cerrar la carta móvil del cliente
 */
function closeMobileIntranet() {
    var mobilePanel = document.getElementById("panelMobileIntranet");
    if (mobilePanel) {
        mobilePanel.style.display = "none";
    }
}
window.closeMobileIntranet = closeMobileIntranet;

/**
 * Cambiar de pestaña dentro del Portal de Empresas (Editor vs Tarifas)
 */
function switchEmpresasTab(tab) {
    var secEditor = document.getElementById("secEmpresasEditor");
    var secRates = document.getElementById("secEmpresasRates");
    var tabEditor = document.getElementById("tabBtnEditor");
    var tabRates = document.getElementById("tabBtnRates");

    if (tab === "editor") {
        if (secEditor) secEditor.style.display = "flex";
        if (secRates) secRates.style.display = "none";
        if (tabEditor) tabEditor.classList.add("active");
        if (tabRates) tabRates.classList.remove("active");
    } else if (tab === "rates") {
        if (secEditor) secEditor.style.display = "none";
        if (secRates) secRates.style.display = "flex";
        if (tabEditor) tabEditor.classList.remove("active");
        if (tabRates) tabRates.classList.add("active");
    }
}
window.switchEmpresasTab = switchEmpresasTab;

/**
 * Añadir plato al pedido de simulación del cliente en mesa
 */
function addDishToMobileOrder(dishName) {
    mobileOrderItems.push(dishName);
    var listEl = document.getElementById("orderItemsList");
    var countEl = document.getElementById("orderItemCount");

    if (countEl) countEl.innerText = mobileOrderItems.length + " Platos";

    if (listEl) {
        listEl.innerHTML = "";
        mobileOrderItems.forEach(function(item, idx) {
            var li = document.createElement("li");
            li.innerHTML = "✔ " + item;
            listEl.appendChild(li);
        });
    }
}
window.addDishToMobileOrder = addDishToMobileOrder;

/**
 * Enviar pedido desde el smartphone
 */
function submitMobileOrder() {
    if (mobileOrderItems.length === 0) {
        alert("Por favor, seleccione al menos un plato antes de enviar su pedido.");
        return;
    }
    var tableNum = document.getElementById("mobileTableNum") ? document.getElementById("mobileTableNum").value : "Mesa 1";
    alert("🚀 ¡PEDIDO ENVIADO A COCINA!\n\nEstablecimiento: " + (document.getElementById("barNameInput") ? document.getElementById("barNameInput").value : "Bar") + "\nUbicación: " + tableNum + "\nPlatos pedidos:\n" + mobileOrderItems.join("\n") + "\n\n¡Gracias por utilizar la Cartelería Digital TDT Inolvidable FM!");
    mobileOrderItems = [];
    var listEl = document.getElementById("orderItemsList");
    var countEl = document.getElementById("orderItemCount");
    if (countEl) countEl.innerText = "0 Platos";
    if (listEl) listEl.innerHTML = '<li class="empty-msg">Pulsa "+ Añadir" en los platos para seleccionarlos.</li>';
}
window.submitMobileOrder = submitMobileOrder;

// Detectar parámetro URL si se abre escaneando el QR desde un móvil real
window.addEventListener("DOMContentLoaded", function() {
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("mode") === "mobile_intranet") {
        var barParam = urlParams.get("bar");
        if (barParam && document.getElementById("barNameInput")) {
            document.getElementById("barNameInput").value = barParam;
        }
        simulateQrScan();
    }
    updateBarOffer();
});

