// ✅ Definir `displayFloatingWindow()` antes de usarla
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

// ✅ Ahora sí podemos usar `displayFloatingWindow()`
function countFinas() {
    let items = document.querySelectorAll(
        ".item-variation.ng-scope span.ng-binding"
    );
    let count = 0;

    items.forEach((item) => {
        let productText = item.innerText.trim();
        if (productText.includes("Patatas Finas")) {
            count++;
        }
    });

    console.log("✅ Cantidad de 'Patatas Finas' detectadas:", count);

    // Guardar en Chrome Storage solo si sigue activo
    if (chrome && chrome.storage) {
        chrome.storage.local.set({ patatasFinas: count }, () => {
            console.log("📌 Guardado en storage:", count);
        });
    } else {
        console.warn("⚠ chrome.storage no disponible");
    }

    // 🔹 Ahora sí podemos llamar a `displayFloatingWindow()`
    displayFloatingWindow(count);
}

// Ejecutar cada 3 segundos para actualizar la información
setInterval(countFinas, 3000);
