/**
 * ==========================================================
 * 🏷️ Name Label Printing System
 * A4 Landscape (8 labels per sheet - 4 rows × 2 columns)
 * Data Source: Google Sheet via Google Apps Script Web App
 * ==========================================================
 */

// ==========================================================
// 🔗 1. CONFIGURE YOUR APPS SCRIPT URL HERE
// ==========================================================
// Paste your deployed Google Apps Script Web App URL below:
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwojE0UJ_XlsT6vNw-EEvHje3iqbKiJf4edbP_Z2vmSI3BA8IWgrXP5RZxfcqfYxv5qOw/exec";

// Configurable label dimensions, paddings, and font sizes
const LABEL_SETTINGS = {
  pageWidth: "297mm",
  pageHeight: "210mm",
  pagePadding: "8mm",
  labelGap: "3.5mm",
  labelPadding: "6mm",
  nameFontSize: "22px",
  yearFontSize: "16px",
  departmentFontSize: "14px",
  borderStyle: "solid",
  borderWidth: "1.5px",
  uppercaseDept: false,
  showDepartment: true
};

// Built-in sample dataset for instant testing/preview
const SAMPLE_DATA = [
  { name: "BALAJI K", yearSection: "III - A", department: "INFORMATION TECHNOLOGY" },
  { name: "ARUN KUMAR", yearSection: "III - A", department: "INFORMATION TECHNOLOGY" },
  { name: "PRADHEESH", yearSection: "III - B", department: "ELECTRICAL & ELECTRONICS ENGINEERING" },
  { name: "SURESH", yearSection: "II - A", department: "COMPUTER SCIENCE ENGINEERING" },
  { name: "DEEPIKA R", yearSection: "IV - A", department: "ELECTRONICS & COMMUNICATION ENGINEERING" },
  { name: "KAVITHA S", yearSection: "III - B", department: "INFORMATION TECHNOLOGY" },
  { name: "VIGNESH M", yearSection: "II - A", department: "MECHANICAL ENGINEERING" },
  { name: "POOJA N", yearSection: "IV - B", department: "COMPUTER SCIENCE ENGINEERING" },
  { name: "RAMESH BABU", yearSection: "III - A", department: "CIVIL ENGINEERING" },
  { name: "SNEHA PRIYA", yearSection: "II - A", department: "ARTIFICIAL INTELLIGENCE & DATA SCIENCE" },
  { name: "GOKUL NATH", yearSection: "IV - A", department: "INFORMATION TECHNOLOGY" },
  { name: "HARINI M", yearSection: "III - A", department: "ELECTRICAL & ELECTRONICS ENGINEERING" }
];

// Exact Google Apps Script code to display in the modal
const APPS_SCRIPT_SOURCE = `/**
 * ===================================================================
 * 🏷️ Google Apps Script Backend
 * A4 Name Label Printing System
 * ===================================================================
 *
 * GOOGLE SHEET STRUCTURE
 *
 * Column A → Name
 * Column B → Year & Section
 * Column C → Department
 *
 * Example:
 *
 * | Name      | Year & Section | Department              |
 * |-----------|----------------|-------------------------|
 * | BALAJI K  | III - A        | INFORMATION TECHNOLOGY  |
 * | ARUN KUMAR| III - A        | INFORMATION TECHNOLOGY  |
 *
 * ===================================================================
 */

// ================================================================
// GOOGLE SHEET ID
// ================================================================

const GOOGLE_SHEET_ID =
  "1MRIiaPzlfO0ZrG1LP4aJXJMydyna3G0tLuWe8GVpf3M";

// ================================================================
// SHEET TAB
// ================================================================

const SHEET_TAB_NAME = "Sheet1";

// ================================================================
// WEB APP
// ================================================================

function doGet(e) {
  try {
    // Open the Google Sheet using ID
    const spreadsheet =
      SpreadsheetApp.openById(
        GOOGLE_SHEET_ID
      );

    // Get the sheet/tab
    const sheet =
      spreadsheet.getSheetByName(
        SHEET_TAB_NAME
      );

    if (!sheet) {
      return createJsonResponse({
        status: "error",
        message:
          'Sheet tab "' +
          SHEET_TAB_NAME +
          '" was not found.',
        records: []
      }, e);
    }

    // Get last row
    const lastRow =
      sheet.getLastRow();

    // Only header or empty sheet
    if (lastRow < 2) {
      return createJsonResponse({
        status: "success",
        count: 0,
        records: []
      }, e);
    }

    // ============================================================
    // READ COLUMNS A, B, C
    // ============================================================

    const values =
      sheet
        .getRange(
          2,
          1,
          lastRow - 1,
          3
        )
        .getDisplayValues();

    const records = [];

    // ============================================================
    // PROCESS DATA
    // ============================================================

    for (let i = 0; i < values.length; i++) {
      const row = values[i];
      const name = String(row[0] || "").trim();
      const yearSection = String(row[1] || "").trim();
      const department = String(row[2] || "").trim();

      // Ignore rows without a name
      if (name === "") {
        continue;
      }

      records.push({
        name: name,
        yearSection: yearSection,
        department: department
      });
    }

    // ============================================================
    // SEND RESPONSE
    // ============================================================

    return createJsonResponse({
      status: "success",
      count: records.length,
      records: records
    }, e);

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: error.toString(),
      records: []
    }, e);
  }
}

// ================================================================
// JSON / JSONP RESPONSE
// ================================================================

function createJsonResponse(data, e) {
  const jsonString = JSON.stringify(data);

  const callback =
    e && e.parameter && e.parameter.callback
      ? e.parameter.callback
      : null;

  // JSONP response
  if (callback) {
    return ContentService
      .createTextOutput(callback + "(" + jsonString + ")")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  // Normal JSON response
  return ContentService
    .createTextOutput(jsonString)
    .setMimeType(ContentService.MimeType.JSON);
}`;

// Application state
let currentRecords = [];

// ==========================================================
// 🚀 2. INITIALIZATION
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {
  initUIElements();
  loadSavedSettings();
  applySettingsToStyles();

  // Populate code view block
  const codeBlock = document.getElementById("appsScriptCodeBlock");
  if (codeBlock) {
    codeBlock.textContent = APPS_SCRIPT_SOURCE;
  }

  // Check if user set the URL in the code
  if (isConfiguredScriptUrl(GOOGLE_SCRIPT_URL)) {
    updateSourceStatus(true, "Google Sheet (Connected via Code URL)");
    fetchGoogleSheetData(GOOGLE_SCRIPT_URL);
  } else {
    // Default to sample data
    document.getElementById("toggleSampleData").checked = true;
    updateSourceStatus(false, "Built-in Sample Data (URL not yet configured in JS)");
    currentRecords = [...SAMPLE_DATA];
    renderLabels(currentRecords);
    showStatus("Previewing with sample data. To connect your live sheet, update GOOGLE_SCRIPT_URL in script.js.", "info");
  }
});

// ==========================================================
// 🎨 3. UI EVENT LISTENERS
// ==========================================================

function initUIElements() {
  // Print button
  document.getElementById("printBtn").addEventListener("click", () => {
    if (currentRecords.length === 0) {
      alert("No label data available to print. Please refresh or load data first.");
      return;
    }
    window.print();
  });

  // Refresh data button
  document.getElementById("refreshBtn").addEventListener("click", () => {
    const sampleToggle = document.getElementById("toggleSampleData");
    if (sampleToggle.checked) {
      currentRecords = [...SAMPLE_DATA];
      renderLabels(currentRecords);
      showStatus("Sample data reloaded.", "success");
    } else if (isConfiguredScriptUrl(GOOGLE_SCRIPT_URL)) {
      fetchGoogleSheetData(GOOGLE_SCRIPT_URL);
    } else {
      showStatus("Please paste your Google Apps Script Web App URL into GOOGLE_SCRIPT_URL in script.js.", "error");
    }
  });

  // Toggle sample data
  document.getElementById("toggleSampleData").addEventListener("change", (e) => {
    if (e.target.checked) {
      currentRecords = [...SAMPLE_DATA];
      renderLabels(currentRecords);
      updateSourceStatus(false, "Built-in Sample Data");
      showStatus("Showing built-in sample data.", "info");
    } else {
      if (isConfiguredScriptUrl(GOOGLE_SCRIPT_URL)) {
        fetchGoogleSheetData(GOOGLE_SCRIPT_URL);
      } else {
        currentRecords = [];
        renderLabels([]);
        updateSourceStatus(false, "No Data Source Configured");
        showStatus("Sample data disabled. Update GOOGLE_SCRIPT_URL in the script code to fetch live records.", "info");
      }
    }
  });

  // Zoom slider
  const zoomRange = document.getElementById("zoomRange");
  const zoomVal = document.getElementById("zoomValue");
  zoomRange.addEventListener("input", (e) => {
    const scale = parseInt(e.target.value, 10) / 100;
    zoomVal.textContent = `${e.target.value}%`;
    document.getElementById("pagesContainer").style.transform = `scale(${scale})`;
  });
  // Initial zoom
  document.getElementById("pagesContainer").style.transform = `scale(0.7)`;

  // Apps Script Code modal handlers
  const codeModal = document.getElementById("codeModal");
  document.getElementById("viewCodeBtn").addEventListener("click", () => {
    codeModal.style.display = "flex";
  });
  document.getElementById("closeCodeBtn").addEventListener("click", () => {
    codeModal.style.display = "none";
  });
  document.getElementById("dismissCodeBtn").addEventListener("click", () => {
    codeModal.style.display = "none";
  });
  codeModal.addEventListener("click", (e) => {
    if (e.target === codeModal) codeModal.style.display = "none";
  });

  // Copy code button
  document.getElementById("copyCodeBtn").addEventListener("click", () => {
    navigator.clipboard.writeText(APPS_SCRIPT_SOURCE).then(() => {
      const copyBtn = document.getElementById("copyCodeBtn");
      copyBtn.innerHTML = '<span class="icon">✅</span> Copied to Clipboard!';
      setTimeout(() => {
        copyBtn.innerHTML = '<span class="icon">📋</span> Copy Code';
      }, 2500);
    }).catch(err => {
      console.error("Clipboard error:", err);
      alert("Please select and copy the code manually from the box.");
    });
  });

  // Settings modal handlers
  const settingsModal = document.getElementById("settingsModal");
  document.getElementById("settingsBtn").addEventListener("click", () => {
    settingsModal.style.display = "flex";
  });
  document.getElementById("closeSettingsBtn").addEventListener("click", () => {
    settingsModal.style.display = "none";
  });
  settingsModal.addEventListener("click", (e) => {
    if (e.target === settingsModal) settingsModal.style.display = "none";
  });

  document.getElementById("applySettingsBtn").addEventListener("click", () => {
    saveSettingsFromModal();
    applySettingsToStyles();
    renderLabels(currentRecords);
    settingsModal.style.display = "none";
    showStatus("Settings updated successfully.", "success");
  });

  document.getElementById("resetSettingsBtn").addEventListener("click", () => {
    localStorage.removeItem("label_printer_settings");
    LABEL_SETTINGS.nameFontSize = "22px";
    LABEL_SETTINGS.yearFontSize = "16px";
    LABEL_SETTINGS.departmentFontSize = "14px";
    LABEL_SETTINGS.labelPadding = "6mm";
    LABEL_SETTINGS.pagePadding = "8mm";
    LABEL_SETTINGS.labelGap = "3.5mm";
    LABEL_SETTINGS.borderStyle = "solid";
    LABEL_SETTINGS.borderWidth = "1.5px";
    LABEL_SETTINGS.uppercaseDept = false;
    LABEL_SETTINGS.showDepartment = true;
    populateModalFields();
    applySettingsToStyles();
    renderLabels(currentRecords);
    showStatus("Settings reset to defaults.", "info");
  });
}

// ==========================================================
// 📊 4. GOOGLE SHEETS DATA FETCHING
// ==========================================================

async function fetchGoogleSheetData(url) {
  showStatus("Fetching latest records from Google Sheet...", "info");
  const refreshBtn = document.getElementById("refreshBtn");
  refreshBtn.disabled = true;
  refreshBtn.innerHTML = '<span class="icon">⏳</span> Fetching...';

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Parse records from response
    let records = [];
    if (Array.isArray(data)) {
      records = data;
    } else if (data && Array.isArray(data.records)) {
      records = data.records;
    } else if (data && Array.isArray(data.data)) {
      records = data.data;
    } else {
      throw new Error("Invalid response structure. Expected array of records.");
    }

    // Clean and filter rows
    const cleanedRecords = records.filter(row => {
      const name = (row.name || row.Name || "").toString().trim();
      return name.length > 0;
    }).map(row => ({
      name: (row.name || row.Name || "").toString().trim(),
      yearSection: (row.yearSection || row["Year & Section"] || row.year || "").toString().trim(),
      department: (row.department || row.Department || row.dept || "").toString().trim()
    }));

    currentRecords = cleanedRecords;
    renderLabels(currentRecords);
    document.getElementById("toggleSampleData").checked = false;
    updateSourceStatus(true, `Google Sheet (${cleanedRecords.length} records)`);

    if (cleanedRecords.length === 0) {
      showStatus("Connected to Google Sheet, but no rows found.", "info");
    } else {
      showStatus(`Successfully loaded ${cleanedRecords.length} records from Google Sheet.`, "success");
    }
  } catch (err) {
    console.error("Fetch error:", err);
    updateSourceStatus(false, "Connection Failed");
    showStatus(`Failed to fetch Google Sheet: ${err.message}. Check Web App deployment permissions ('Anyone').`, "error");
  } finally {
    refreshBtn.disabled = false;
    refreshBtn.innerHTML = '<span class="icon">🔄</span> Refresh Data';
  }
}

// ==========================================================
// 🖨️ 5. A4 LANDSCAPE PAGINATION & RENDERING (8 LABELS / SHEET)
// ==========================================================

const LABELS_PER_PAGE = 8; // 4 rows × 2 columns

function renderLabels(records) {
  const container = document.getElementById("pagesContainer");
  const totalRecordsEl = document.getElementById("totalRecordsCount");
  const totalPagesEl = document.getElementById("totalPagesCount");

  container.innerHTML = "";
  totalRecordsEl.textContent = records.length;

  if (records.length === 0) {
    totalPagesEl.textContent = "0";
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📄</div>
        <h3>No records to display</h3>
        <p>Enable "Use Sample Data" above or configure GOOGLE_SCRIPT_URL to load labels.</p>
      </div>
    `;
    return;
  }

  // Calculate pages: Ceiling(Total Records / 8)
  const totalPages = Math.ceil(records.length / LABELS_PER_PAGE);
  totalPagesEl.textContent = totalPages;

  // Split records into chunks of 8
  for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
    const pageRecords = records.slice(pageIndex * LABELS_PER_PAGE, (pageIndex + 1) * LABELS_PER_PAGE);

    // Page wrapper for screen layout
    const pageWrapper = document.createElement("div");
    pageWrapper.className = "page-wrapper";

    // Visual page indicator (screen only)
    const pageBadge = document.createElement("div");
    pageBadge.className = "page-badge no-print";
    pageBadge.textContent = `A4 Sheet ${pageIndex + 1} of ${totalPages} (${pageRecords.length} labels)`;
    pageWrapper.appendChild(pageBadge);

    // The physical A4 landscape sheet
    const a4Sheet = document.createElement("div");
    a4Sheet.className = "a4-sheet";

    // 4 rows × 2 columns grid
    const labelsGrid = document.createElement("div");
    labelsGrid.className = "labels-grid";

    // Add 8 label slots
    for (let i = 0; i < LABELS_PER_PAGE; i++) {
      const item = pageRecords[i];
      const labelCard = document.createElement("div");
      labelCard.className = "name-label";

      if (item) {
        // Name: Automatic uppercase + bold
        const nameEl = document.createElement("div");
        nameEl.className = "label-name";
        nameEl.textContent = item.name.toUpperCase();

        // Year & Section: normal, below name
        const yearEl = document.createElement("div");
        yearEl.className = "label-year";
        yearEl.textContent = item.yearSection || item.year || "";

        labelCard.appendChild(nameEl);
        labelCard.appendChild(yearEl);

        // Department: normal, below Year & Section
        if (LABEL_SETTINGS.showDepartment && item.department) {
          const deptEl = document.createElement("div");
          deptEl.className = "label-department";
          deptEl.textContent = LABEL_SETTINGS.uppercaseDept
            ? item.department.toUpperCase()
            : item.department;
          labelCard.appendChild(deptEl);
        }
      } else {
        // Empty slot placeholder to maintain 4×2 grid alignment on last page
        labelCard.classList.add("empty-label");
      }

      labelsGrid.appendChild(labelCard);
    }

    a4Sheet.appendChild(labelsGrid);
    pageWrapper.appendChild(a4Sheet);
    container.appendChild(pageWrapper);
  }
}

// ==========================================================
// ⚙️ 6. SETTINGS & STYLES MANAGEMENT
// ==========================================================

function applySettingsToStyles() {
  const root = document.documentElement;
  root.style.setProperty("--name-font-size", LABEL_SETTINGS.nameFontSize);
  root.style.setProperty("--year-font-size", LABEL_SETTINGS.yearFontSize);
  root.style.setProperty("--dept-font-size", LABEL_SETTINGS.departmentFontSize);
  root.style.setProperty("--label-padding", LABEL_SETTINGS.labelPadding);
  root.style.setProperty("--page-padding", LABEL_SETTINGS.pagePadding);
  root.style.setProperty("--label-gap", LABEL_SETTINGS.labelGap);
  root.style.setProperty("--label-border-width", LABEL_SETTINGS.borderWidth);

  // Border style class on container
  const container = document.getElementById("pagesContainer");
  container.classList.remove("border-solid", "border-dashed", "border-dotted");
  container.classList.add(`border-${LABEL_SETTINGS.borderStyle || 'solid'}`);
}

function loadSavedSettings() {
  try {
    const saved = localStorage.getItem("label_printer_settings");
    if (saved) {
      Object.assign(LABEL_SETTINGS, JSON.parse(saved));
    }
  } catch (e) {
    console.warn("Could not load settings:", e);
  }
  populateModalFields();
}

function populateModalFields() {
  document.getElementById("cfgNameFontSize").value = parseInt(LABEL_SETTINGS.nameFontSize, 10);
  document.getElementById("cfgYearFontSize").value = parseInt(LABEL_SETTINGS.yearFontSize, 10);
  document.getElementById("cfgDeptFontSize").value = parseInt(LABEL_SETTINGS.departmentFontSize, 10);
  document.getElementById("cfgLabelPadding").value = parseInt(LABEL_SETTINGS.labelPadding, 10);
  document.getElementById("cfgPagePadding").value = parseInt(LABEL_SETTINGS.pagePadding, 10);
  document.getElementById("cfgLabelGap").value = parseFloat(LABEL_SETTINGS.labelGap);
  document.getElementById("cfgBorderStyle").value = LABEL_SETTINGS.borderStyle || "solid";
  document.getElementById("cfgBorderWidth").value = parseFloat(LABEL_SETTINGS.borderWidth) || 1.5;
  document.getElementById("cfgUppercaseDept").checked = !!LABEL_SETTINGS.uppercaseDept;
  document.getElementById("cfgShowDepartment").checked = !!LABEL_SETTINGS.showDepartment;
}

function saveSettingsFromModal() {
  LABEL_SETTINGS.nameFontSize = `${document.getElementById("cfgNameFontSize").value}px`;
  LABEL_SETTINGS.yearFontSize = `${document.getElementById("cfgYearFontSize").value}px`;
  LABEL_SETTINGS.departmentFontSize = `${document.getElementById("cfgDeptFontSize").value}px`;
  LABEL_SETTINGS.labelPadding = `${document.getElementById("cfgLabelPadding").value}mm`;
  LABEL_SETTINGS.pagePadding = `${document.getElementById("cfgPagePadding").value}mm`;
  LABEL_SETTINGS.labelGap = `${document.getElementById("cfgLabelGap").value}mm`;
  LABEL_SETTINGS.borderStyle = document.getElementById("cfgBorderStyle").value;
  LABEL_SETTINGS.borderWidth = `${document.getElementById("cfgBorderWidth").value}px`;
  LABEL_SETTINGS.uppercaseDept = document.getElementById("cfgUppercaseDept").checked;
  LABEL_SETTINGS.showDepartment = document.getElementById("cfgShowDepartment").checked;

  localStorage.setItem("label_printer_settings", JSON.stringify(LABEL_SETTINGS));
}

// ==========================================================
// 🛠️ 7. HELPER UTILITIES
// ==========================================================

function updateSourceStatus(isActive, message) {
  const dot = document.getElementById("statusDot");
  const text = document.getElementById("sourceStatusText");
  if (isActive) {
    dot.classList.add("active");
  } else {
    dot.classList.remove("active");
  }
  text.innerHTML = `<strong>Data Source:</strong> ${message}`;
}

function showStatus(message, type = "info") {
  const banner = document.getElementById("statusBanner");
  const msgSpan = document.getElementById("statusMessage");

  banner.className = `status-banner no-print ${type}`;
  msgSpan.textContent = message;
  banner.style.display = "block";

  if (type === "success") {
    setTimeout(() => {
      banner.style.display = "none";
    }, 4000);
  }
}

function isConfiguredScriptUrl(url) {
  if (!url || typeof url !== "string") return false;
  if (url === "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (_) {
    return false;
  }
}
