chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set(
        {
            patatasFinas: 0,
            panGrande: 0,
            panPequeno: 0,
            ordenPanes: "",
        },
        () => {
            console.log("✅ Storage inicializado en background");
        }
    );
});
