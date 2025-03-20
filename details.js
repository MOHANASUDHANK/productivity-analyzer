document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.local.get(["productive", "nonProductive"], (data) => {
        const productiveData = data.productive || {};
        const nonProductiveData = data.nonProductive || {};

        const productiveList = document.getElementById("productive-list");
        const nonProductiveList = document.getElementById("non-productive-list");

        let totalProductiveTime = 0;
        let totalNonProductiveTime = 0;
        let productiveDomains = [];
        let nonProductiveDomains = [];

        function formatTime(seconds) {
            if (!seconds || isNaN(seconds)) return "0h 0m 0s";
            let h = Math.floor(seconds / 3600);
            let m = Math.floor((seconds % 3600) / 60);
            let s = Math.floor(seconds % 60);
            return `${h}h ${m}m ${s}s`;
        }

        function extractDomain(url) {
            try {
                return new URL(url).hostname.replace("www.", "");
            } catch (error) {
                return url;
            }
        }

        function getFavicon(url) {
            return `https://www.google.com/s2/favicons?domain=${extractDomain(url)}`;
        }

        // Display Productive Websites
        Object.entries(productiveData).forEach(([url, details]) => {
            if (!details.timeSpent) return;
            let domain = extractDomain(url);
            let favicon = getFavicon(url);
            totalProductiveTime += details.timeSpent;

            let item = document.createElement("div");
            item.classList.add("time-item", "productive");
            item.innerHTML = `<img class="favicon" src="${favicon}" alt="🔗"> <span>${domain}</span> <span>${formatTime(details.timeSpent)}</span>`;
            productiveList.appendChild(item);

            productiveDomains.push({ domain, time: details.timeSpent });
        });

        // Display Non-Productive Websites (Fixed)
        Object.entries(nonProductiveData).forEach(([url, details]) => {
            if (!details.timeSpent) return;
            let domain = extractDomain(url);
            let favicon = getFavicon(url);
            totalNonProductiveTime += details.timeSpent;

            let item = document.createElement("div");
            item.classList.add("time-item", "non-productive");
            item.innerHTML = `<img class="favicon" src="${favicon}" alt="🔗"> <span>${domain}</span> <span>${formatTime(details.timeSpent)}</span>`;
            nonProductiveList.appendChild(item);

            nonProductiveDomains.push({ domain, time: details.timeSpent });
        });

        // Update Pie Chart
        let totalTime = totalProductiveTime + totalNonProductiveTime;
        let productivePercentage = totalTime > 0 ? (totalProductiveTime / totalTime) * 100 : 50;
        document.getElementById("pieChart").style.background = `conic-gradient(
            green 0% ${productivePercentage}%, 
            red ${productivePercentage}% 100%
        )`;
        document.getElementById("piePercentage").innerText = `${productivePercentage.toFixed(1)}% Productive`;

        // Generate Bar Chart for Top 5 Productive Websites
        let barChart = document.getElementById("barChart");
        productiveDomains.sort((a, b) => b.time - a.time).slice(0, 5).forEach(({ domain, time }) => {
            let percentage = totalProductiveTime > 0 ? (time / totalProductiveTime) * 100 : 0;

            barChart.innerHTML += `
                <div class="bar">
                    <span class="bar-label">${domain}</span>
                    <div class="bar-container">
                        <div class="bar-fill" style="width:${percentage}%"></div>
                    </div>
                    <span class="bar-time">${formatTime(time)}</span>
                </div>`;
        });
    });
});
