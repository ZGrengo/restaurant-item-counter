console.log("🧠 Goikounter content.js inicializado");

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
    "la moza": "G",
    "la kikiller": "G",
    "the beast": "G",
    "don vito": "P",
    "mas-s-mash": "P",
    "hat trick": "P",
    "la muslona": "P",
    "goiko kids": "P",
    "la smashic": "P",
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

// 🧾 Detección de código manual
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
                chrome.storage.local.remove("codigoPedidoManual");
                reproducirAlerta();
            }
        });
    });
}

function reproducirAlerta() {
    const audio = new Audio(chrome.runtime.getURL("alerta.mp3"));
    audio.volume = 1;
    audio
        .play()
        .catch((err) =>
            console.warn("🔇 No se pudo reproducir el sonido:", err)
        );
}

// 🍟 Conteo de patatas
function countFinas() {
    let orders = document.querySelectorAll(".item-name.ng-binding");
    let totalFinas = 0;

    orders.forEach((item) => {
        const match = item.innerText.match(/^(\d+)\s*x\s*/);
        const quantity = match ? parseInt(match[1]) : 1;

        const variationContainer = item.parentElement.querySelectorAll(
            ".item-variation.ng-scope span.ng-binding"
        );

        variationContainer.forEach((span) => {
            const text = span.innerText.trim();
            if (
                text.includes("Patatas Finas") ||
                text.includes("House fries")
            ) {
                totalFinas += quantity;
            }
        });
    });

    chrome.storage.local.set({ patatasFinas: totalFinas });
    window._goikoState = window._goikoState || {};
    window._goikoState.patatas = totalFinas;
}

// 🥖 Conteo de panes por tipo
function countPanesPorTipo() {
    const pedidos = document.querySelectorAll("md-card-content.ticketItems");
    const resultados = {
        sala: { G: 0, P: 0, orden: [] },
        delivery: { G: 0, P: 0, orden: [] },
    };

    pedidos.forEach((pedido) => {
        const tipoTexto = (
            pedido.previousElementSibling?.querySelector(
                ".md-subhead.ng-binding.flex"
            )?.innerText || ""
        ).toLowerCase();

        let tipo = null;
        let esBasic = false;

        if (
            tipoTexto.includes("delivery basics") ||
            tipoTexto.includes("delivery dk")
        ) {
            tipo = "delivery";
            esBasic = true; // ← este es el truco
        } else if (tipoTexto.includes("delivery")) {
            tipo = "delivery";
        } else if (tipoTexto.includes("sala")) {
            tipo = "sala";
        }

        if (!tipo) return;

        const items = pedido.querySelectorAll(".item-name.ng-binding");

        items.forEach((item) => {
            const rawText = item.innerText.trim();
            const match = rawText.match(/^(\d+)\s*x\s*/);
            const quantity = match ? parseInt(match[1]) : 1;

            const burgerName = normalizeText(
                rawText.replace(/^(\d+\s*x\s*)/, "").trim()
            );

            const panType = burgerPanMap[burgerName];

            if (panType === "G") {
                resultados[tipo].G += quantity;
                if (!esBasic) {
                    for (let i = 0; i < quantity; i++)
                        resultados[tipo].orden.push("Gr");
                }
            } else if (panType === "P") {
                resultados[tipo].P += quantity;
                if (!esBasic) {
                    for (let i = 0; i < quantity; i++)
                        resultados[tipo].orden.push("Pq");
                }
            }
        });
    });

    // Armar string de orden por tipo
    for (let tipo in resultados) {
        const arr = resultados[tipo].orden;
        let finalOrden = [];
        let current = null;
        let count = 0;

        for (let i = 0; i <= arr.length; i++) {
            if (arr[i] === current) {
                count++;
            } else {
                if (current !== null) finalOrden.push(`${current}x${count}`);
                current = arr[i];
                count = 1;
            }
        }

        resultados[tipo].ordenString = finalOrden.join("-");
    }

    console.log("📦 Conteo de panes por tipo:", resultados);

    chrome.storage.local.set({
        panesSala: resultados.sala,
        panesDelivery: resultados.delivery,
    });

    displayPanesPorTipo(resultados);
}

// 🧾 Mostrar contadores en pantalla
function displayPanesPorTipo(resultados) {
    const existing = document.getElementById("goikounter-wrapper");
    if (existing) existing.remove();

    const wrapper = document.createElement("div");
    wrapper.id = "goikounter-wrapper";
    wrapper.style.position = "fixed";
    wrapper.style.top = "2px";
    wrapper.style.left = "140px";
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "row";
    wrapper.style.gap = "12px";
    wrapper.style.zIndex = "9999";
    document.body.appendChild(wrapper);

    for (let tipo of ["sala", "delivery"]) {
        const data = resultados[tipo];
        const div = document.createElement("div");
        div.className = "goikounter-block";
        div.style.background = "#0B83C8";
        div.style.color = "#fff";
        div.style.padding = "10px";
        div.style.borderRadius = "8px";
        div.style.fontFamily = "Arial, sans-serif";
        div.style.fontSize = "16px";
        div.style.minWidth = "110px";
        div.style.boxShadow = "0 0 6px rgba(0,0,0,0.4)";
        div.innerHTML = `
            <strong>${tipo.toUpperCase()}</strong>
            G: ${data.G} / P: ${data.P}<br>
            <span style="font-size:16px;font-weight:600;">${
                data.ordenString
            }</span>
        `;
        wrapper.appendChild(div);
    }

    // 🟦 Patatas finas
    const patatas = window._goikoState?.patatas ?? 0;
    const patatasDiv = document.createElement("div");
    patatasDiv.className = "goikounter-block";
    patatasDiv.style.background = "#0B83C8";
    patatasDiv.style.color = "#fff";
    patatasDiv.style.padding = "10px";
    patatasDiv.style.borderRadius = "8px";
    patatasDiv.style.fontFamily = "Arial, sans-serif";
    patatasDiv.style.fontSize = "16px";
    patatasDiv.style.minWidth = "90px";
    patatasDiv.style.boxShadow = "0 0 6px rgba(0,0,0,0.4)";
    patatasDiv.innerHTML = `
        <strong>PATATAS 🍟</strong><br>
        Finas: ${patatas}
    `;
    wrapper.appendChild(patatasDiv);
}

// 🔁 Intervalo principal
setInterval(() => {
    if (chrome?.storage) {
        countFinas();
        countPanesPorTipo();
        detectarPedidoManual();
    } else {
        console.warn("⛔ chrome.storage no disponible aún.");
    }
}, 3000);
