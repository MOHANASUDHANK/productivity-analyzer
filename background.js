let activeTabId = null;
let activeStartTime = null;
let tabTimeData = {}; // Stores tabId -> domain mapping

// Function to update time spent on a tab
function updateTabTime(tabId) {
    if (activeTabId !== null && activeStartTime !== null) {
        let currentTime = Date.now();
        let timeSpent = (currentTime - activeStartTime) / 1000; // Convert to seconds
        let domain = tabTimeData[activeTabId];

        if (!domain) return;

        chrome.storage.local.get(["productive", "nonProductive"], (data) => {
            let productive = data.productive || {};
            let nonProductive = data.nonProductive || {};

            if (productive[domain]) {
                productive[domain].timeSpent = (productive[domain].timeSpent || 0) + timeSpent;
            } else if (nonProductive[domain]) {
                nonProductive[domain].timeSpent = (nonProductive[domain].timeSpent || 0) + timeSpent;
            }

            chrome.storage.local.set({ productive, nonProductive });
        });
    }
}

// Listener for tab activation
chrome.tabs.onActivated.addListener((activeInfo) => {
    updateTabTime(activeTabId);
    activeTabId = activeInfo.tabId;
    activeStartTime = Date.now();

    chrome.tabs.get(activeTabId, (tab) => {
        if (chrome.runtime.lastError || !tab || !tab.url) return;
        let domain = new URL(tab.url).hostname.replace("www.", "");
        tabTimeData[activeTabId] = domain;
    });
});

// Listener for tab removal
chrome.tabs.onRemoved.addListener((tabId) => {
    if (tabId === activeTabId) {
        updateTabTime(tabId);
        delete tabTimeData[tabId];

        activeTabId = null;
        activeStartTime = null;
    }
});

// Listener for page navigation (URL changes within the same tab)
chrome.webNavigation.onCommitted.addListener((details) => {
    if (details.tabId === activeTabId) {
        updateTabTime(activeTabId);
        activeStartTime = Date.now();

        chrome.tabs.get(details.tabId, (tab) => {
            if (chrome.runtime.lastError || !tab || !tab.url) return;
            let domain = new URL(tab.url).hostname.replace("www.", "");
            tabTimeData[details.tabId] = domain;
        });
    }
});

// Handle AI Analysis Request
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getAIResponse") {
        fetchAIResponse(request.message)
            .then((aiResponse) => {
                let isProductive = aiResponse.trim().toLowerCase() === "yes";

                chrome.storage.local.get({ productive: {}, nonProductive: {} }, (result) => {
                    let productive = result.productive;
                    let nonProductive = result.nonProductive;
                    let { domain, favicon } = request;

                    // Preserve existing time spent
                    let existingTime = (productive[domain]?.timeSpent || nonProductive[domain]?.timeSpent || 0);

                    // Remove from the opposite category
                    delete productive[domain];
                    delete nonProductive[domain];

                    if (isProductive) {
                        productive[domain] = { timeSpent: existingTime, favicon };
                    } else {
                        nonProductive[domain] = { timeSpent: existingTime, favicon };
                    }

                    chrome.storage.local.set({ productive, nonProductive }, () => {
                        sendResponse(aiResponse);
                    });
                });
            })
            .catch((error) => {
                sendResponse("Error: " + error.message);
            });

        return true;
    }
});

// Fetch AI Response
async function fetchAIResponse(message) {
    const result = await chrome.storage.local.get("gemini-api-key");
    const apiKey = result["gemini-api-key"];

    if (!apiKey) return "Error: API key not found";

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] }),
            }
        );

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("📜 Raw AI Response Data:", data);

        return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No valid response from AI.";
    } catch (error) {
        return "Error fetching AI response.";
    }
}
