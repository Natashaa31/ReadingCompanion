// AI Reading Companion - Popup Script
// Handles all user interactions within the extension's popup.

document.addEventListener('DOMContentLoaded', () => {
    const summarizerTabBtn = document.querySelector('[data-tab="summarizer"]');
    const historyTabBtn = document.querySelector('[data-tab="history"]');
    const summarizerView = document.getElementById('summarizer');
    const historyView = document.getElementById('history');
    const summarizeBtn = document.getElementById('summarizeBtn');
    const customPromptInput = document.getElementById('customPrompt');
    const summaryResultDiv = document.getElementById('summaryResult');
    const translateContainer = document.getElementById('translate-container');
    const languageSelect = document.getElementById('language-select');
    const translateBtn = document.getElementById('translateBtn');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    let currentSummary = "";

    summarizerTabBtn.addEventListener('click', () => {
        summarizerTabBtn.classList.add('active');
        historyTabBtn.classList.remove('active');
        summarizerView.classList.add('active');
        historyView.classList.remove('active');
    });

    historyTabBtn.addEventListener('click', () => {
        historyTabBtn.classList.add('active');
        summarizerTabBtn.classList.remove('active');
        historyView.classList.add('active');
        summarizerView.classList.remove('active');
        loadHistory(); 
    });

    summarizeBtn.addEventListener('click', () => {
        summaryResultDiv.innerText = "Processing, please wait...";
        translateContainer.style.display = 'none';
        const customPrompt = customPromptInput.value.trim();
        chrome.runtime.sendMessage({ action: "summarize", customPrompt: customPrompt }, (response) => {
            if (chrome.runtime.lastError) {
                summaryResult.innerText = `Error: ${chrome.runtime.lastError.message}`;
                return;
            }
            currentSummary = response.summary || "Could not generate a result.";
            summaryResultDiv.innerText = currentSummary;
            if (response.summary) {
                translateContainer.style.display = 'flex';
            }
        });
    });

    translateBtn.addEventListener('click', () => {
        const selectedLang = languageSelect.value;
        summaryResultDiv.innerText = `Translating to ${languageSelect.options[languageSelect.selectedIndex].text}...`;
        chrome.runtime.sendMessage({ action: "translate", text: currentSummary, lang: selectedLang }, (response) => {
            if (chrome.runtime.lastError) {
                summaryResult.innerText = `Error: ${chrome.runtime.lastError.message}`;
                return;
            }
            summaryResultDiv.innerText = response.translation || "Could not translate.";
        });
    });

    function loadHistory() {
        historyList.innerHTML = '<p>Loading history...</p>';
        chrome.storage.local.get(['summaryHistory'], (result) => {
            const history = result.summaryHistory || [];
            if (history.length === 0) {
                historyList.innerHTML = '<p>No summaries saved yet.</p>';
                return;
            }
            historyList.innerHTML = '';
            history.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                const formattedDate = new Date(item.date).toLocaleString();
                historyItem.innerHTML = `
                    <div class="history-item-header">
                        <h3 class="history-title">${item.title}</h3>
                        <span class="history-date">${formattedDate}</span>
                    </div>
                    <p class="history-summary">${item.summary}</p>
                `;
                historyItem.addEventListener('click', (e) => {
                    if (e.target.className !== 'history-title') {
                        historyItem.classList.toggle('expanded');
                    }
                });
                historyItem.querySelector('.history-title').addEventListener('click', () => {
                    chrome.tabs.create({ url: item.url });
                });
                historyList.appendChild(historyItem);
            });
        });
    }

    clearHistoryBtn.addEventListener('click', () => {
        chrome.storage.local.set({ summaryHistory: [] }, () => {
            loadHistory();
        });
    });
});

