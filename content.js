console.log("🧠 content.js inicializado");

const burgerPanMap = {
    "m-30": "G",
    "kevin bacon": "G",
    "kevin costner": "G",
    "kevin chingona": "G",
    "la kiki": "G",
    retro: "G",
    "bomba sexy 2.0": "G",
    "la greenchofa": "G",
    pigma: "G",
    moza: "G",
    kikiller: "G",
    "the beast": "G",
    "don vito": "P",
    "mas-s-mash": "P",
    "hat trick": "P",
    "la muslona": "P",
    "goiko kids": "P",
    smashic: "P",
    "classic smash": "P",
    "basic onion smash": "P",
    "single smash": "P",
};

function normalizeText(text) {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

// Ventana flotante unificada
function displayFloatingDashboard(panG, panP, orden, patatasFinas) {
    let wrapper = document.getElementById("goikounter-wrapper");

    if (!wrapper) {
        wrapper = document.createElement("div");
        wrapper.id = "goikounter-wrapper";
        wrapper.style.position = "fixed";
        wrapper.style.top = "2px";
        wrapper.style.left = "140px";
        wrapper.style.display = "flex";
        wrapper.style.flexDirection = "row";
        wrapper.style.gap = "12px";
        wrapper.style.zIndex = "9999";
        document.body.appendChild(wrapper);
    }

    // Contenedor de panes
    let panesDiv = document.getElementById("goikounter-panes");
    if (!panesDiv) {
        panesDiv = document.createElement("div");
        panesDiv.id = "goikounter-panes";
        panesDiv.style.background = "#0B83C8";
        panesDiv.style.color = "#fff";
        panesDiv.style.padding = "10px";
        panesDiv.style.borderRadius = "8px";
        panesDiv.style.fontFamily = "Arial, sans-serif";
        panesDiv.style.fontSize = "16px";
        panesDiv.style.minWidth = "130px";
        panesDiv.style.boxShadow = "0 0 6px rgba(0,0,0,0.4)";
        wrapper.appendChild(panesDiv);
    }

    panesDiv.innerHTML = `
        Panes🥖 G: ${panG} / P: ${panP}<br>
        <span style="font-size:16px;opacity:0.8;font-weight:600;">${orden}</span>
    `;

    // Contenedor patatas
    let patatasDiv = document.getElementById("goikounter-patatas");
    if (!patatasDiv) {
        patatasDiv = document.createElement("div");
        patatasDiv.id = "goikounter-patatas";
        patatasDiv.style.background = "#0B83C8";
        patatasDiv.style.color = "#fff";
        patatasDiv.style.padding = "10px";
        patatasDiv.style.borderRadius = "8px";
        patatasDiv.style.fontFamily = "Arial, sans-serif";
        patatasDiv.style.fontSize = "16px";
        patatasDiv.style.minWidth = "90px";
        patatasDiv.style.boxShadow = "0 0 6px rgba(0,0,0,0.4)";
        wrapper.appendChild(patatasDiv);
    }

    patatasDiv.innerHTML = `
        <strong>Patatas 🍟 </strong><br>
         Finas: ${patatasFinas}
    `;
}

// Contar panes
function countPanes() {
    const items = document.querySelectorAll(".item-name.ng-binding");
    let panG = 0;
    let panP = 0;
    let panOrder = [];

    items.forEach((item) => {
        let rawText = item.innerText.trim(); // "2 x Kevin Bacon"
        let match = rawText.match(/^(\d+)\s*x\s*/);
        let quantity = match ? parseInt(match[1]) : 1;

        let burgerName = normalizeText(
            rawText.replace(/^(\d+\s*x\s*)/, "").trim()
        );

        let panType = burgerPanMap[burgerName];

        if (panType === "G") {
            panG += quantity;
            for (let i = 0; i < quantity; i++) panOrder.push("Gr");
        } else if (panType === "P") {
            panP += quantity;
            for (let i = 0; i < quantity; i++) panOrder.push("Pq");
        } else {
            console.warn("❓ Burger no encontrada en el mapa:", burgerName);
        }
    });

    // Agrupar el orden por secuencias consecutivas
    let finalOrder = [];
    let current = null;
    let count = 0;

    for (let i = 0; i <= panOrder.length; i++) {
        if (panOrder[i] === current) {
            count++;
        } else {
            if (current !== null) {
                finalOrder.push(`${current}x${count}`);
            }
            current = panOrder[i];
            count = 1;
        }
    }

    const ordenString = finalOrder.join("-");

    // Guardar también en storage (opcional)
    chrome.storage.local.set(
        {
            panGrande: panG,
            panPequeno: panP,
            ordenPanes: ordenString,
        },
        () => console.log("📌 Panes guardados")
    );

    // Compartir datos para la ventana flotante
    window._goikoState = window._goikoState || {};
    window._goikoState.panG = panG;
    window._goikoState.panP = panP;
    window._goikoState.orden = ordenString;

    if (window._goikoState.patatas !== undefined) {
        displayFloatingDashboard(
            panG,
            panP,
            ordenString,
            window._goikoState.patatas
        );
    }
}

// Contar Patatas Finas
function countFinas() {
    let orders = document.querySelectorAll(".item-name.ng-binding");
    let totalFinas = 0;

    orders.forEach((item) => {
        let rawText = item.innerText.trim(); // "2 x Kevin Bacon"
        let match = rawText.match(/^(\d+)\s*x\s*/);
        let quantity = match ? parseInt(match[1]) : 1;

        const variationContainer = item.parentElement.querySelectorAll(
            ".item-variation.ng-scope span.ng-binding"
        );

        variationContainer.forEach((span) => {
            let text = span.innerText.trim();
            if (
                text.includes("Patatas Finas") ||
                text.includes("House fries")
            ) {
                totalFinas += quantity;
            }
        });
    });

    chrome.storage.local.set({ patatasFinas: totalFinas }, () => {
        console.log("📌 Patatas guardadas:", totalFinas);
    });

    window._goikoState = window._goikoState || {};
    window._goikoState.patatas = totalFinas;

    if (
        window._goikoState.panG !== undefined &&
        window._goikoState.orden !== undefined
    ) {
        displayFloatingDashboard(
            window._goikoState.panG,
            window._goikoState.panP,
            window._goikoState.orden,
            totalFinas
        );
    }
}

// Ejecutar cada 3 segundos
function detectarPedidoManual() {
    chrome.storage.local.get("codigoPedidoManual", (data) => {
        const codigoManual = (data.codigoPedidoManual || "")
            .trim()
            .toUpperCase();
        if (!codigoManual) return;

        const pedidos = document.querySelectorAll(".ticket-note i.ng-binding");

        pedidos.forEach((elem) => {
            const texto = elem.innerText.toUpperCase();
            if (texto.includes(codigoManual)) {
                console.log("🚨 Pedido manual detectado:", codigoManual);
                chrome.storage.local.remove("codigoPedidoManual"); // evitar repeticiones
                reproducirAlerta();
            }
        });
    });
}

function reproducirAlerta() {
    const audio = new Audio(chrome.runtime.getURL("alerta.mp3")); // ⚠️ poné el archivo en la raíz
    audio.volume = 1;
    audio
        .play()
        .catch((err) =>
            console.warn("🔇 No se pudo reproducir el sonido:", err)
        );
}

// Añadí esto dentro del setInterval general
setInterval(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
        countFinas();
        countPanes();
        detectarPedidoManual(); // 👈 esta línea
    } else {
        console.warn("⛔ chrome.storage no disponible aún.");
    }
}, 3000);
