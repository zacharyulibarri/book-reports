/**
 * bookreports.club — Google Apps Script
 * Deploy as: Extensions → Apps Script → Deploy → New deployment → Web app
 *   Execute as: Me
 *   Who has access: Anyone
 *
 * Receives RSVP POSTs from the city pages and appends them to the RSVPs tab.
 *
 * Sheet structure expected (two tabs per spreadsheet):
 *
 *   Tab "Events":  EventID | Date       | Time    | Location      | MapsURL | Notes
 *   Tab "RSVPs":   EventID | Timestamp  | Name    | GuestCount
 *
 * One spreadsheet per city. This script is deployed separately per city,
 * or you can share it across cities — just point each city page at its own deployment URL.
 */

// ── RSVP submission ──────────────────────────────────────────────────────────
function doPost(e) {
  try {
    var eventId   = e.parameter.eventId   || '';
    var name      = e.parameter.name      || 'Anonymous';
    var guests    = parseInt(e.parameter.guests, 10) || 0;

    if (!eventId) {
      return jsonResponse({ success: false, error: 'Missing eventId' });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RSVPs');
    if (!sheet) {
      return jsonResponse({ success: false, error: 'RSVPs tab not found' });
    }

    sheet.appendRow([eventId, new Date(), name, guests]);

    return jsonResponse({ success: true });

  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}


// ── Health check / GET ───────────────────────────────────────────────────────
function doGet(e) {
  return jsonResponse({ ok: true, message: 'bookreports.club RSVP endpoint' });
}


// ── Helper ───────────────────────────────────────────────────────────────────
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
