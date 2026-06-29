# Google Sheets Integration — Setup Guide

## Overview

Each city has one Google Sheet with two tabs:

| Tab | Columns |
|-----|---------|
| **Events** | EventID · Date · Time · Location · MapsURL · Notes |
| **RSVPs** | EventID · Timestamp · Name · GuestCount |

The city page fetches both tabs as CSVs to display events and attendees. RSVPs are submitted via a Google Apps Script web app that appends rows to the RSVPs tab.

---

## Step 1 — Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet.
   Name it something like **Book Reports — Boulder**.

2. Rename **Sheet1** to `Events`.

3. Add a second sheet tab named `RSVPs`.

4. Set up the headers exactly as follows (case-sensitive):

**Events tab — Row 1:**
```
EventID | Date | Time | Location | MapsURL | Notes
```

**RSVPs tab — Row 1:**
```
EventID | Timestamp | Name | GuestCount
```

### Adding an event (Events tab example)

| EventID | Date | Time | Location | MapsURL | Notes |
|---------|------|------|----------|---------|-------|
| boulder-2026-07-15 | 2026-07-15 | 7:00 PM | No Name Bar | https://maps.google.com/?q=No+Name+Bar+Boulder+CO | Upstairs room reserved |

- **EventID**: any unique string, e.g. `boulder-YYYY-MM-DD`
- **Date**: ISO format `YYYY-MM-DD` — the page uses this to filter past events
- **MapsURL**: optional; if blank, the page auto-generates a Google Maps search link
- **Notes**: optional; shown in italic under the location

---

## Step 2 — Publish the Sheet as CSV

The city page fetches data via two public CSV URLs — one per tab.

1. Open the spreadsheet.
2. **File → Share → Publish to web**
3. Under "Link", change the first dropdown from "Entire Document" to **Events**, second dropdown to **Comma-separated values (.csv)**.
4. Click **Publish** → copy the URL. Paste it as `EVENTS_CSV_URL` in the city page's `CONFIG` block.
5. Repeat: change the tab dropdown to **RSVPs** → copy that URL → paste as `RSVPS_CSV_URL`.

The URLs look like:
```
https://docs.google.com/spreadsheets/d/SHEET_ID/pub?gid=0&single=true&output=csv
https://docs.google.com/spreadsheets/d/SHEET_ID/pub?gid=12345&single=true&output=csv
```

> **Note:** Published CSV updates may lag 1–5 minutes behind edits to the sheet.

---

## Step 3 — Deploy the Apps Script

The RSVP form POSTs to a Google Apps Script web app, which appends a row to the RSVPs tab.

1. Open the spreadsheet.
2. **Extensions → Apps Script**
3. Delete any existing code, then paste the contents of `apps-script/Code.gs` from this repo.
4. Click **Save** (floppy disk icon).
5. Click **Deploy → New deployment**:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Click **Deploy** → authorize when prompted.
7. Copy the **Web app URL** (looks like `https://script.google.com/macros/s/LONG_ID/exec`).
8. Paste it as `APPS_SCRIPT_URL` in the city page's `CONFIG` block.

> **Re-deploying after code changes:** go to Deploy → Manage deployments → edit the existing deployment → choose "New version" → Deploy. The URL stays the same.

---

## Step 4 — Update the City Page CONFIG

Open `boulder/index.html` (or the relevant city page) and find the `CONFIG` block near the bottom:

```javascript
const CONFIG = {
  EVENTS_CSV_URL:   '',   // ← paste Events CSV URL here
  RSVPS_CSV_URL:    '',   // ← paste RSVPs CSV URL here
  APPS_SCRIPT_URL:  '',   // ← paste Apps Script URL here
  CITY_LABEL:       'Boulder',
};
```

Save and push to GitHub. The page will now load live data.

---

## Managing Events

- **Add event**: add a row to the Events tab. The page picks it up within a few minutes.
- **Cancel event**: delete the row (or add a `Cancelled` column and filter on it — not yet implemented).
- **Remove an RSVP**: delete the row from the RSVPs tab. The user can email the organizer to request this.

## Version control

Google Sheets has built-in version history (**File → Version history → See version history**). If data is accidentally deleted, restore a previous version from there.
