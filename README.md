# 🏷️ Name Label Printing System

A simple, fast, and automated web-based **A4 Name Label Printing System** that reads participant/student data directly from a **Google Sheet** and formats the data into clean, bordered, ready-to-print labels.

The system is calibrated for **8 labels per A4 landscape sheet** (4 rows × 2 columns).

---

## ✨ Features

* 📊 **Google Sheet data source**: Directly connects to Google Sheets via Google Apps Script.
* ✍️ **Manual data entry**: Add, edit, or remove participants in the Google Sheet.
* 🔒 **Code-configured URL**: The Apps Script URL is set directly in the code — no cluttered input boxes in the website.
* 🔲 **Distinct label border**: Each label is framed by a clear border for printing and scissor trimming.
* 📜 **Apps Script code viewer**: Integrated in-app button with one-click **Copy Code** to view and copy the Google Apps Script backend code.
* 🔄 **Instant synchronization**: Pulls latest records with one click on **Refresh Data**.
* 🖨️ **Print all records**: Automatic browser printing without manual copy-pasting.
* 👁️ **A4 print preview**: Scalable on-screen preview displaying the exact A4 layout before printing.
* 📄 **Automatic pagination**: Records automatically grouped into pages of 8 ($\lceil \text{Total Records} / 8 \rceil$).
* 📐 **A4 Landscape format**: 297mm × 210mm layout.
* 🏷️ **8 labels per sheet**: 2 columns × 4 rows.
* 🔤 **Arial font typography**: Clean, legible, professional layout.
* **NAME in UPPERCASE & BOLD**: Automatically converts lowercase/mixed case to uppercase.
* **Year & Section**: Displayed directly below the name in normal font weight.
* **Department**: Displayed below Year & Section.
* 🚫 **Zero manual selection**: Automatically formats and prints all valid records.
* ⚙️ **Configurable**: In-browser settings modal to tweak font sizes, padding, borders, and gaps on the fly.

---

## 📋 Google Sheet Format

Use a Google Sheet with a tab named:

```text
Sheet1
```

Column layout:
* **Column A** → Name
* **Column B** → Year & Section
* **Column C** → Department

| Column A | Column B       | Column C                             |
| :------- | :------------- | :----------------------------------- |
| **Name** | **Year & Section** | **Department**                   |
| BALAJI K | III - A        | INFORMATION TECHNOLOGY               |
| ARUN KUMAR | III - A      | INFORMATION TECHNOLOGY               |
| PRADHEESH| III - B        | ELECTRICAL & ELECTRONICS ENGINEERING |
| SURESH   | II - A         | COMPUTER SCIENCE ENGINEERING         |

> **Note**: Empty rows (or rows without a Name) are automatically ignored.

---

## 🏗️ Project Structure

```text
Name-Label-Printer/
├── index.html     # Self-contained standalone application (HTML + CSS + JS)
├── style.css      # External stylesheet (also embedded in index.html)
├── script.js      # External JavaScript logic (also embedded in index.html)
├── Code.gs        # Google Apps Script Web App backend
└── README.md      # Documentation & deployment guide
```

---

## ⚙️ Google Apps Script Setup

### Step 1 — Create / Open Google Sheet
1. Open your Google Sheet (e.g. Sheet ID: `1MRIiaPzlfO0ZrG1LP4aJXJMydyna3G0tLuWe8GVpf3M`).
2. Ensure you have the `Sheet1` tab with headers in Row 1.

### Step 2 — Open Apps Script
1. Click **Extensions** → **Apps Script**.
2. Click the **📜 Apps Script Code** button in the web app (or open [`Code.gs`](file:///c:/Users/BALAJI/OneDrive/Desktop/new/Code.gs)), and copy the code.
3. Paste it into `Code.gs` in the Apps Script editor.
4. Verify your `GOOGLE_SHEET_ID` matches your sheet ID.
5. Click **Save** (💾 icon).

### Step 3 — Deploy as Web App
1. Click **Deploy** → **New deployment**.
2. Select type: **Web app** (gear icon).
3. Set **Execute as**: `Me`.
4. Set **Who has access**: `Anyone`.
5. Click **Deploy**.
6. Authorize access when prompted.
7. Copy the generated **Web app URL** (`https://script.google.com/macros/s/.../exec`).

---

## 🔗 Connecting the Website

Open [**`index.html`**](file:///c:/Users/BALAJI/OneDrive/Desktop/new/index.html) and find line 889:
```javascript
const GOOGLE_SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";
```
Replace it with your deployed URL:
```javascript
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycb.../exec";
```
Save the file and refresh your browser. That's it!

---

## 🖨️ Printing Guidelines

1. Click the **🖨️ Print Labels** button (or press `Ctrl + P`).
2. In the print dialog, verify the following:
   - **Destination**: Select your printer or **Save as PDF**.
   - **Layout**: **Landscape**
   - **Paper Size**: **A4**
   - **Margins**: **None** or **Default** (Recommended: None)
   - **Scale**: **100%**
   - **Background graphics**: Enabled (ensures sharp borders).
