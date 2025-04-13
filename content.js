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

function displayFinasFloatingWindow(count) {
    let floatDiv = document.getElementById("burger-counter-float");

    if (!floatDiv) {
        floatDiv = document.createElement("div");
        floatDiv.id = "burger-counter-float";
        floatDiv.style.position = "fixed";
        floatDiv.style.bottom = "20px";
        floatDiv.style.left = "20px";
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
function displayPanFloatingWindow(grandes, pequenos, orden = "") {
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
        🥐 Pequeños: ${pequenos}<br>
        <div style="margin-top:10px;font-size:12px;">
            🧾 Orden: <br>${orden}
        </div>
    `;
}

function countPanes() {
    let items = document.querySelectorAll(".item-name.ng-binding");
    let panG = 0;
    let panP = 0;
    let panOrder = [];

    items.forEach((item) => {
        let rawText = item.innerText.trim();
        let burgerName = normalizeText(
            rawText.replace(/^(\d+\s*x\s*)/, "").trim()
        );

        let panType = burgerPanMap[burgerName];

        if (panType === "G") {
            panG++;
            panOrder.push("Gr");
        } else if (panType === "P") {
            panP++;
            panOrder.push("Pq");
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

    console.log(`🥖 Panes Grandes: ${panG} | 🥐 Panes Pequeños: ${panP}`);
    console.log("📋 Orden de panes:", ordenString);

    // Guardar en storage para que popup pueda accederlo también
    try {
        chrome.storage.local.set(
            {
                panGrande: panG,
                panPequeno: panP,
                ordenPanes: ordenString,
            },
            () => {
                console.log("📌 Orden guardado en storage");
            }
        );
    } catch (err) {
        console.warn("⚠ Error al guardar en storage:", err.message);
    }

    // Mostrar ventana flotante
    displayPanFloatingWindow(panG, panP, ordenString);
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

    displayFinasFloatingWindow(count);
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
