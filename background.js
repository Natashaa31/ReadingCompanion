// AI Reading Companion - Background Service Worker
// Handles all API calls and data persistence.

const API_TOKEN = "PASTE_YOUR_HUGGING_FACE_TOKEN_HERE";

const SUMMARIZE_API_URL = "https://api-inference.huggingface.co/models/sshleifer/distilbart-cnn-12-6";
const CUSTOM_PROMPT_API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-small";
const EXPLAIN_API_URL = "https://api-inference.huggingface.co/models/sshleifer/distilbart-cnn-12-6";
const TRANSLATE_API_BASE = "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-en-";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "summarize") {
        const customPrompt = request.customPrompt;
        getCurrentTab().then(tab => {
            if (!tab) { return; }
            chrome.tabs.sendMessage(tab.id, { action: "getPageContent" }, (response) => {
                if (chrome.runtime.lastError || !response || !response.content) {
                    sendResponse({ summary: "Could not read content from the page." });
                    return;
                }
                const shortContent = response.content.substring(0, 4000);
                
                let apiUrl;
                let finalPrompt;

                if (customPrompt && customPrompt.length > 0) {
                    apiUrl = CUSTOM_PROMPT_API_URL;
                    finalPrompt = `Based on the following text, ${customPrompt}:\n\n${shortContent}`;
                } else {
                    apiUrl = SUMMARIZE_API_URL;
                    finalPrompt = shortContent;
                }

                fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_TOKEN}`},
                    body: JSON.stringify({ inputs: finalPrompt })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        if (data.error.includes("is currently loading")) {
                            sendResponse({ summary: "The AI model is warming up... Please try again in 20 seconds." });
                        } else {
                            sendResponse({ summary: "The AI couldn't process that request. Try a simpler instruction or a different page." });
                        }
                        return;
                    }
                    try {
                        let resultText;
                        if (apiUrl === CUSTOM_PROMPT_API_URL) {
                            resultText = data[0].generated_text;
                        } else {
                            resultText = data[0].summary_text;
                        }
                        sendResponse({ summary: resultText.trim() });
                        if (!customPrompt || customPrompt.length === 0) {
                           saveSummaryToHistory(tab.url, tab.title, resultText);
                        }
                    } catch (e) {
                        sendResponse({ summary: "The API returned an unexpected response." });
                    }
                })
                .catch(error => sendResponse({ summary: "Failed to connect to the API." }));
            });
        });
        return true;
    }

    if (request.action === "explain") {
        const prompt = `Summarize the following text in a very simple way, as if you were explaining it to a 12-year-old. \n\nText: "${request.text}"`;
        fetch(EXPLAIN_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_TOKEN}` },
            body: JSON.stringify({ inputs: prompt })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                 if (data.error.includes("is currently loading")) {
                    chrome.tabs.sendMessage(sender.tab.id, { action: "show_explanation", explanation: "The explanation AI is warming up... Please try again in 20 seconds." });
                } else {
                    chrome.tabs.sendMessage(sender.tab.id, { action: "show_explanation", explanation: data.error });
                }
                return;
            }
            const explanation = data[0].summary_text;
            chrome.tabs.sendMessage(sender.tab.id, { action: "show_explanation", explanation: explanation });
        })
        .catch(error => {
            chrome.tabs.sendMessage(sender.tab.id, { action: "show_explanation", explanation: "Failed to connect to the Explain API." });
        });
        return true;
    }

    if (request.action === "translate") {
        let langCode = request.lang;
        if (langCode === 'ja') {
            langCode = 'jap';
        }
        const TRANSLATE_API_URL = `${TRANSLATE_API_BASE}${langCode}`;
        fetch(TRANSLATE_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_TOKEN}`},
            body: JSON.stringify({ inputs: request.text })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                sendResponse({ translation: data.error });
                return;
            }
            const translation = data[0].translation_text;
            sendResponse({ translation: translation.trim() });
        })
        .catch(error => sendResponse({ translation: "Failed to connect to the Translate API." }));
        return true;
    }
});

function saveSummaryToHistory(url, title, summary) {
    const newItem = { url, title, summary, date: new Date().toISOString() };
    chrome.storage.local.get(['summaryHistory'], (result) => {
        const history = result.summaryHistory || [];
        history.unshift(newItem);
        if (history.length > 50) {
            history.pop();
        }
        chrome.storage.local.set({ summaryHistory: history });
    });
}

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

