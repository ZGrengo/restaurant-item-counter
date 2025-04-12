document.addEventListener("DOMContentLoaded", () => {
    function updateCounters() {
        chrome.storage.local.get(
            ["patatasFinas", "panGrande", "panPequeno"],
            (data) => {
                console.log("📦 Datos desde storage:", data);

                document.getElementById("counter").innerText =
                    data.patatasFinas ?? 0;
                document.getElementById("panGrande").innerText =
                    data.panGrande ?? 0;
                document.getElementById("panPequeno").innerText =
                    data.panPequeno ?? 0;
            }
        );
    }

    updateCounters();

    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (changes.patatasFinas || changes.panGrande || changes.panPequeno) {
            updateCounters();
        }
    });
});
