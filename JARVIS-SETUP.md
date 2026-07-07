# Turn on your talking Jarvis (about 10 minutes, once)

Talking Jarvis runs a tiny program on **your computer** so your secret API key
never touches the browser or the internet. Do this once and it's yours.

## What you need to do

### 1. Install Node.js (the engine — 2 min)
Go to **https://nodejs.org**, download the big green **LTS** button, run the
installer, click through. Done. (If you already have it, skip this.)

### 2. Get your Claude API key (2 min)
- Go to **https://console.anthropic.com**
- Sign in → **API Keys** (left menu) → **Create Key**
- Copy the key (it starts with `sk-ant-`). You'll paste it in step 4.
- Note: this is a paid API — add a little credit under **Billing**. Asking Jarvis
  a question costs a fraction of a cent.

### 3. Get the project onto your computer (2 min)
Download this project as a folder (a `.zip` you unzip, or `git clone`). You'll
have a folder with `server.js` and `package.json` in it.

### 4. Add your key (1 min)
- In the project folder, find the file named **`.env.example`**
- Make a copy of it and rename the copy to just **`.env`**
- Open `.env` in any text editor. It has one line:
  `ANTHROPIC_API_KEY=sk-ant-your-key-here`
- Replace `sk-ant-your-key-here` with the key you copied. Save.

### 5. Start it (1 min)
- Open **Terminal** (Mac) or **Command Prompt** (Windows)
- Type `cd ` then drag the project folder onto the window, press Enter
- Type `npm install` press Enter, wait for it to finish
- Type `npm start` press Enter
- You'll see: **App running at http://localhost:3000**

### 6. Talk to Jarvis
- Open **http://localhost:3000/jarvis.html** in Chrome
- Click **Load book**, pick your `Michael-Ringy-book.json`
- Ask anything: *"Who are my 5 best closes this week and why?"*

To use it again later: repeat step 5 (`npm start`) and open the link. That's it.

---

**Your key is safe:** it lives only in the `.env` file on your machine, is read
only by the server on your machine, and is never sent to the browser, never
committed to the project (`.env` is git-ignored), and never seen by anyone else.
