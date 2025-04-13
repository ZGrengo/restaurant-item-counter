chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set(
        {
            patatasFinas: 0,
            panGrande: 0,
            panPequeno: 0,
        },
        () => {
            console.log("📦 Storage inicializado en background.");
        }
    );
});

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        files: ["content.js"],
    });
});
