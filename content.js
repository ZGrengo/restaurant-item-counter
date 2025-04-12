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
        .normalize("NFD") // separa letras de acentos
        .replace(/[\u0300-\u036f]/g, "") // remueve acentos
        .toLowerCase(); // fuerza minúsculas
}

function displayFloatingWindow(count) {
    let floatDiv = document.getElementById("burger-counter-float");

    if (!floatDiv) {
        floatDiv = document.createElement("div");
        floatDiv.id = "burger-counter-float";
        floatDiv.style.position = "fixed";
        floatDiv.style.bottom = "20px";
        floatDiv.style.right = "20px";
        floatDiv.style.background = "rgba(0,0,0,0.8)";
        floatDiv.style.color = "#fff";
        floatDiv.style.padding = "15px";
        floatDiv.style.borderRadius = "8px";
        floatDiv.style.fontFamily = "Arial, sans-serif";
        floatDiv.style.zIndex = "9999";
        document.body.appendChild(floatDiv);
    }

    floatDiv.innerHTML = `<strong>Conteo de Patatas Finas: ${count}</strong>`;
}

function displayPanFloatingWindow(grandes, pequenos) {
    let id = "pan-counter-float";
    let floatDiv = document.getElementById(id);

    if (!floatDiv) {
        floatDiv = document.createElement("div");
        floatDiv.id = id;
        floatDiv.style.position = "fixed";
        floatDiv.style.bottom = "70px";
        floatDiv.style.right = "20px";
        floatDiv.style.background = "rgba(0,0,0,0.8)";
        floatDiv.style.color = "#fff";
        floatDiv.style.padding = "15px";
        floatDiv.style.borderRadius = "8px";
        floatDiv.style.fontFamily = "Arial, sans-serif";
        floatDiv.style.zIndex = "9999";
        document.body.appendChild(floatDiv);
    }

    floatDiv.innerHTML = `
        <strong>Panes:</strong><br>
        🥖 Grandes: ${grandes}<br>
        🥐 Pequeños: ${pequenos}
    `;
}

//Funcion para contar panes
function countPanes() {
    let items = document.querySelectorAll(".item-name.ng-binding");
    let panG = 0;
    let panP = 0;

    items.forEach((item) => {
        let rawText = item.innerText.trim();
        let burgerName = normalizeText(
            rawText.replace(/^(\d+\s*x\s*)/, "").trim()
        );

        let panType = burgerPanMap[burgerName.toLowerCase()];

        if (panType === "G") panG++;
        else if (panType === "P") panP++;
        else console.warn("❓ Burger no encontrada en el mapa:", burgerName);
    });

    console.log(`🥖 Panes Grandes: ${panG} | 🥐 Panes Pequeños: ${panP}`);

    // Guardar en storage para que popup lo pueda leer
    try {
        chrome.storage.local.set({ panGrande: panG, panPequeno: panP }, () => {
            console.log("📌 Guardado en storage:", count);
        });
    } catch (err) {
        console.warn("⚠ Error al guardar en storage:", err.message);
    }

    displayPanFloatingWindow(panG, panP);
}

// Funcion para contar finas
function countFinas() {
    let items = document.querySelectorAll(
        ".item-variation.ng-scope span.ng-binding"
    );
    let count = 0;

    items.forEach((item) => {
        let productText = item.innerText.trim();
        if (
            productText.includes("Patatas Finas") ||
            productText.includes("House fries")
        ) {
            count++;
        }
    });

    console.log("✅ Cantidad de 'Patatas Finas' detectadas:", count);

    try {
        chrome.storage.local.set({ patatasFinas: count }, () => {
            console.log("📌 Guardado en storage:", count);
        });
    } catch (err) {
        console.warn("⚠ Error al guardar en storage:", err.message);
    }

    displayFloatingWindow(count);
}

// Ejecutar cada 3 segundos para actualizar la información
setInterval(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
        countFinas();
        countPanes();
    } else {
        console.warn("⛔ chrome.storage no disponible aún.");
    }
}, 3000);
