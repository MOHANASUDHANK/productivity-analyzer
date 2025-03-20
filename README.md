# 📊 Productivity Analyzer - Chrome Extension

A **Chrome extension** that accurately tracks the 
time you spend on different websites and intelligently categorizes them as **Productive** or **Non-Productive** using **Gemini AI**.
Gain valuable insights with real-time tracking, a detailed breakdown of your browsing habits, and visual analytics through **interactive charts**..

---

## 🚀 Features
✅ **Track Website Usage** – Records time spent on each active tab in real-time.  
🤖 **AI Classification** – Uses **Gemini AI** to analyze and classify websites.  
📊 **Insightful Dashboard** – Displays website usage with **pie charts** and **bar charts**.  
🔍 **Detailed View** – See top 5 productive sites and a breakdown of your time.  

---

## 📦 Installation (For Testing Locally)

1. **Download the Repository**  
   - Click the **Code** button → **Download ZIP** and extract it.

2. **Load the Extension in Chrome**  
   - Open Chrome and go to:
     ```
     chrome://extensions/
     ```
   - Enable **Developer Mode** (top-right corner).  
   - Click **Load unpacked** and select the **extracted folder**.

3. **Set Up the Gemini API Key**  
   - Open the **Chrome Console** (`Ctrl + Shift + J` on Windows/Linux or `Cmd + Option + J` on Mac).  
   - Run this command:
   ```js
   chrome.storage.local.set({ "gemini-api-key": "YOUR_API_KEY" });
   ```

---

## 📊 How It Works

1. **Active Tab Tracking**  
   - Records time for the currently active tab and updates it on tab switch or close.

2. **AI Classification**  
   - Sends the webpage URL to **Gemini AI** with the prompt:  
     > *"Analyze this webpage: Is it productive? Yes or No?"*  
   - Stores the classification and **time spent** in **local storage**.

3. **Popup View**  
   - Displays:
      - **Top 3** productive and non-productive sites.  
      - **Total time** breakdown.  
      - A **Details** button for deeper insights.

4. **Detailed View**  
   - Shows:
      - All tracked sites by category.  
      - A **Pie Chart** of **Productive vs Non-Productive** time.  
      - **Bar Chart** of the **Top 5** productive websites.  

---

## 📸 Screenshots

📌 **Popup View**  
![image](https://github.com/user-attachments/assets/7e43cdf5-21b3-4ccd-b9c5-1a279e3da6d6)


📌 **Detailed Insights Page**  
![image](https://github.com/user-attachments/assets/55d7b194-d32a-4516-ab5a-5dde38025e33)
![image](https://github.com/user-attachments/assets/7cfd4532-6416-46df-995d-38e81c5eeea9)
![image](https://github.com/user-attachments/assets/a5d7d36b-4677-4940-b4c8-929cda7b6b7e)


---

## 🛠️ Project Structure

```
📂 productivity-analyzer
├── 📄 background.js      // Core logic: Tracks time and manages AI classification
├── 📄 content.js        // Sends webpage info for AI classification
├── 📄 manifest.json     // Chrome extension configuration
├── 📄 popup.html        // Main popup UI
├── 📄 popup.js         // Logic for the popup interface
├── 📄 details.html      // Detailed view interface
├── 📄 details.js       // Logic to generate charts and display data
├── 📄 styles.css       // Styling for detailed insights (dark theme)
├── 📄 popup.css        // Popup-specific styling
└── 📄 icon.png         // Extension icon
```

---

## 🦑 Usage Instructions

1. **Click the Extension Icon**  
   - View time spent on productive and non-productive websites.

2. **Open "Details" Page**  
   - Analyze usage patterns through charts and a detailed list.

3. **Customize AI Detection**  
   - Modify the AI prompt in `content.js` if you want finer control over classification.

---

## 📢 Contributing

Contributions are welcome! If you want to enhance the extension:

1. Fork the repository.
2. Create a new branch:
   ```
   git checkout -b feature/new-feature
   ```
3. Make your changes and test them.
4. Submit a pull request.

---

## 📝 License

This project is licensed under the **MIT License** – you’re free to use, modify, and distribute it.

---

## 📩 Contact

For suggestions or improvements, open an **issue** or reach out via:

- GitHub: [MOHANASUDHANK](https://github.com/mohanasudhank)
- Email: mohanasudhank2004@gmail.com

---

🌟 **If you found this useful, give it a star on GitHub!** 🌟

