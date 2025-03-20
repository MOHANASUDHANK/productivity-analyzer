document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.local.get(["productive", "nonProductive"], (data) => {
        console.log("✅ Retrieved Data:", data);

        const productiveData = data.productive || {};
        const nonProductiveData = data.nonProductive || {};

        let productiveTime = 0;
        let nonProductiveTime = 0;

        const productiveList = document.getElementById("productive-list");
        const nonProductiveList = document.getElementById("non-productive-list");
        const totalTimeElement = document.getElementById("total-time");

        function formatTime(seconds) {
            if (!seconds || isNaN(seconds)) return "0h 0m 0s";
            let h = Math.floor(seconds / 3600);
            let m = Math.floor((seconds % 3600) / 60);
            let s = Math.floor(seconds % 60);
            return `${h}h ${m}m ${s}s`;
        }

        function getFavicon(domain) {
            return `https://www.google.com/s2/favicons?domain=${domain}`;
        }

        function getTopThreeSorted(data) {
            return Object.entries(data)
                .filter(([_, details]) => details.timeSpent) // Remove entries without time
                .sort((a, b) => b[1].timeSpent - a[1].timeSpent) // Sort descending
                .slice(0, 3); // Get top 3
        }

        // Get top 3 Productive & Non-Productive domains
        const topProductive = getTopThreeSorted(productiveData);
        const topNonProductive = getTopThreeSorted(nonProductiveData);

        // Display Productive Websites
        topProductive.forEach(([domain, details]) => {
            let favicon = details.favicon || getFavicon(domain);
            productiveTime += details.timeSpent;

            let item = document.createElement("div");
            item.classList.add("time-item", "productive");
            item.innerHTML = `<span><img class="favicon" src="${favicon}" alt="🔗"> ${domain}</span> <span>${formatTime(details.timeSpent)}</span>`;
            productiveList.appendChild(item);
        });

        // Display Non-Productive Websites
        topNonProductive.forEach(([domain, details]) => {
            let favicon = details.favicon || getFavicon(domain);
            nonProductiveTime += details.timeSpent;

            let item = document.createElement("div");
            item.classList.add("time-item", "non-productive");
            item.innerHTML = `<span><img class="favicon" src="${favicon}" alt="🔗"> ${domain}</span> <span>${formatTime(details.timeSpent)}</span>`;
            nonProductiveList.appendChild(item);
        });

        totalTimeElement.innerHTML = `🟢 Productive: ${formatTime(productiveTime)} <br> 🔴 Non-Productive: ${formatTime(nonProductiveTime)}`;
    });

    // Handle details page link
    document.getElementById("viewDetails").addEventListener("click", function () {
        chrome.tabs.create({ url: "details.html" });
    });
});
