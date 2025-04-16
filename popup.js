document.addEventListener("DOMContentLoaded", () => {
    function updateCounter() {
        chrome.storage.local.get(
            ["panesSala", "panesDelivery", "patatasFinas"],
            (data) => {
                const panG =
                    (data.panesSala?.G || 0) + (data.panesDelivery?.G || 0);
                const panP =
                    (data.panesSala?.P || 0) + (data.panesDelivery?.P || 0);
                const panVG =
                    (data.panesSala?.panVegano || 0) +
                    (data.panesDelivery?.panVegano || 0);
                const patatas = data.patatasFinas || 0;

                document.getElementById("panGrande").innerText = panG;
                document.getElementById("panPequeno").innerText = panP;
                document.getElementById("panVegano").innerText = panVG;
                document.getElementById("patatasFinas").innerText = patatas;
            }
        );
    }

    updateCounter();

    chrome.storage.onChanged.addListener(() => {
        updateCounter();
    });

    document.getElementById("guardarCodigo").addEventListener("click", () => {
        const input = document.getElementById("pedidoManualInput").value.trim();
        if (input) {
            chrome.storage.local.set({
                codigoPedidoManual: input.toUpperCase(),
            });
        }
    });
});
