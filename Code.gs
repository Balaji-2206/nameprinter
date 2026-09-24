/**
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
 *
 * IMPORTANT:
 * Replace GOOGLE_SHEET_ID with your actual Google Sheet ID.
 *
 * Example Google Sheet URL:
 *
 * https://docs.google.com/spreadsheets/d/1ABCxyz123456789/edit
 *
 * Sheet ID:
 *
 * 1ABCxyz123456789
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
}
