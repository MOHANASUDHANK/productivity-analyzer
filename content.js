function analyzePage() {
    const url = window.location.href;
    const domain = new URL(url).hostname.replace("www.", ""); // Extract domain name
    const favicon = document.querySelector("link[rel~='icon']")?.href || `https://www.google.com/s2/favicons?domain=${domain}`;
    const message = `Analyze this webpage: URL: ${url} if it contains productive content say Yes else say No`;

    console.log("🚀 Sending message to background script:", { domain, favicon });

    chrome.runtime.sendMessage({ action: "getAIResponse", message, domain, favicon }, (response) => {
        if (chrome.runtime.lastError) {
            console.log("❌ Error sending message:", chrome.runtime.lastError.message);
            return;
        }

        if (!response) {
            console.log("❌ No response received from background script.");
            return;
        }

        console.log("✅ Received AI Response for", domain, ":", response);
    });
}

analyzePage();
