# AI Reading Companion

This is a Chrome Extension built for the Google Hackathon. It acts as an intelligent assistant for reading web content, providing summaries, simple explanations, translations, and more.

## Features

* **AI Summarizer:** Instantly generates a concise summary of any article.
* **Explain Like I'm 12:** Highlight any confusing text for a simple explanation.
* **Quick Translator:** Translates summaries into five different languages.
* **Custom Prompts:** Give the AI specific instructions on how to process text.
* **Interactive History:** Automatically saves your summaries for later review.

## How to Install and Run

### Step 1: Get Your Free API Token
This extension requires a free Hugging Face API token to work.
1.  Go to [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) and sign up for a free account.
2.  Click **"+ Create new token"**, give it a name, and generate the token.
3.  **Copy the token immediately.** You will need it in Step 3.

### Step 2: Download the Code
1.  Click the green **"<> Code"** button on this page and choose **"Download ZIP"**.
2.  Unzip the downloaded file on your computer.

### Step 3: Add Your API Token
1.  Open the unzipped project folder.
2.  Open the file named `background.js` in a text editor (like VS Code or Notepad).
3.  At the very top of the file, find the line `const API_TOKEN = ...`.
4.  Paste your copied Hugging Face token inside the quotes, replacing the placeholder text. It should look like this:
    ```javascript
    const API_TOKEN = "hf_YourActualTokenHere...";
    ```
5.  Save and close the file.

### Step 4: Load the Extension in Chrome
1.  Open your Chrome browser and navigate to `chrome://extensions`.
2.  Turn on the **"Developer mode"** toggle in the top-right corner.
3.  Click the **"Load unpacked"** button and select the project folder you just edited.

**You're Ready!** The AI Reading Companion icon will appear in your extensions toolbar.
