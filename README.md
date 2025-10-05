AI Reading Companion
This is a Chrome Extension built for the Google Hackathon. It acts as an intelligent assistant for reading web content, providing summaries, simple explanations, translations, and more.


Features
AI Summarizer: Instantly generates a concise summary of any article.

Explain Like I'm 12: Highlight any confusing text for a simple explanation.

Quick Translator: Translates summaries into five different languages.

Custom Prompts: Give the AI specific instructions on how to process text.

Interactive History: Automatically saves your summaries for later review.


How to Install and Run
Step 1: Get Your Free API Token
This extension requires a free Hugging Face API token to work.

Go to huggingface.co/settings/tokens and sign up for a free account.

Click "+ Create new token", give it a name, and generate the token.

Copy the token immediately. You will need it in Step 4.

Step 2: Download the Code
Click the green "<> Code" button on this page and choose "Download ZIP". Unzip the downloaded file on your computer.

Step 3: Add Your API Token
Open the unzipped project folder.

Open the file named background.js in a text editor.

At the very top of the file, paste your copied Hugging Face token into the API_TOKEN variable, replacing the placeholder text.

Save and close the file.

Step 4: Load the Extension in Chrome
Open your Chrome browser and navigate to chrome://extensions.


Turn on the "Developer mode" toggle in the top-right corner.

Click the "Load unpacked" button and select the project folder you just edited.

You're Ready! The AI Reading Companion icon will appear in your extensions toolbar.

This new README.md solves the problem completely. Now, before you upload the final code to GitHub, you must remove your personal token from background.js.

Just replace your key with the placeholder text, like this:
const API_TOKEN = "PASTE_YOUR_HUGGING_FACE_TOKEN_HERE";
