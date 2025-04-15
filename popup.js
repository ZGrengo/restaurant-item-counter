document.addEventListener("DOMContentLoaded", () => {
    // Cargar valores desde storage
    chrome.storage.local.get(
        [
            "patatasFinas",
            "panGrande",
            "panPequeno",
            "ordenPanes",
            "codigoPedidoManual",
        ],
        (data) => {
            document.getElementById("patatasFinas").innerText =
                data.patatasFinas ?? 0;
            document.getElementById("panGrande").innerText =
                data.panGrande ?? 0;
            document.getElementById("panPequeno").innerText =
                data.panPequeno ?? 0;
            document.getElementById("ordenPanes").innerText =
                data.ordenPanes ?? "";
            document.getElementById("pedidoManualInput").value =
                data.codigoPedidoManual || "";
        }
    );

    // Guardar código de pedido manual
    document.getElementById("guardarCodigo").addEventListener("click", () => {
        const codigo = document
            .getElementById("pedidoManualInput")
            .value.trim();
        if (codigo) {
            chrome.storage.local.set({ codigoPedidoManual: codigo }, () => {
                alert(`✅ Código "${codigo}" guardado`);
            });
        }
    });
});
