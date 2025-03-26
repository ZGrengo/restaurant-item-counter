chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ patatasFinas: 0 });
});
