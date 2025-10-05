// AI Reading Companion - Content Script
// Handles interactions with the webpage content.

let explainButton = null;
let explanationPanel = null;

document.addEventListener('mouseup', handleTextSelection);
document.addEventListener('mousedown', handleMouseDown);

function handleTextSelection() {
    setTimeout(() => {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText.length > 10) {
            createExplainButton(selectedText);
        } else {
            removeExplainButton();
        }
    }, 10);
}

function handleMouseDown(event) {
    if (explainButton && !explainButton.contains(event.target)) {
        removeExplainButton();
    }
    if (explanationPanel && !explanationPanel.contains(event.target)) {
        removeExplanationPanel();
    }
}

function createExplainButton(selectedText) {
    removeExplainButton();
    const selectionRect = window.getSelection().getRangeAt(0).getBoundingClientRect();
    
    explainButton = document.createElement('button');
    explainButton.className = 'ai-explain-btn';
    explainButton.innerText = '✨ Explain Like I\'m 12';
    
    document.body.appendChild(explainButton);

    const btnRect = explainButton.getBoundingClientRect();
    explainButton.style.top = `${window.scrollY + selectionRect.bottom + 5}px`;
    explainButton.style.left = `${window.scrollX + selectionRect.left + (selectionRect.width / 2) - (btnRect.width / 2)}px`;

    explainButton.onclick = () => {
        chrome.runtime.sendMessage({ action: "explain", text: selectedText });
        explainButton.innerText = 'Thinking...';
        explainButton.disabled = true;
    };
}

function removeExplainButton() {
    if (explainButton) {
        explainButton.remove();
        explainButton = null;
    }
}

function showExplanationPanel(explanation) {
    removeExplanationPanel();
    explanationPanel = document.createElement('div');
    explanationPanel.className = 'ai-explanation-panel';

    explanationPanel.innerHTML = `
        <div class="ai-explanation-header">
            <h3>Here's a simpler take:</h3>
            <button class="ai-close-btn">&times;</button>
        </div>
        <p class="ai-explanation-text">${explanation}</p>
    `;

    document.body.appendChild(explanationPanel);
    explanationPanel.querySelector('.ai-close-btn').onclick = removeExplanationPanel;
    setTimeout(() => explanationPanel.classList.add('visible'), 10);
}

function removeExplanationPanel() {
    if (explanationPanel) {
        explanationPanel.classList.remove('visible');
        setTimeout(() => {
            if (explanationPanel) {
                explanationPanel.remove();
                explanationPanel = null;
            }
        }, 300);
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getPageContent") {
        sendResponse({ content: document.body.innerText });
    }
    if (request.action === "show_explanation") {
        showExplanationPanel(request.explanation);
        removeExplainButton();
    }
});

