document.addEventListener("DOMContentLoaded", () => {
    function updateCounter() {
        chrome.storage.local.get("patatasFinas", (data) => {
            console.log("📢 Leyendo de chrome.storage:", data.patatasFinas); // ✅ Log para ver el valor
            document.getElementById("counter").innerText =
                data.patatasFinas || 0;
        });
    }

    // Cargar el valor al abrir el popup
    updateCounter();

    // Escuchar cambios en `chrome.storage` y actualizar el popup en tiempo real
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (changes.patatasFinas) {
            updateCounter();
        }
    });
});
