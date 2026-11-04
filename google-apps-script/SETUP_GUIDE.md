# Standalone Google Apps Script Backend & Google Sheets Setup Guide

This guide is specifically tailored for a **standalone Google Apps Script project** created at [script.google.com](https://script.google.com).

---

## 1. How to Find Your Google Spreadsheet ID

1. Create or open your tracking spreadsheet at [sheets.new](https://sheets.new).
2. Look at the browser address bar:
   ```
   https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
                                         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
   ```
3. Copy the string of characters between `/d/` and `/edit`. That is your **`SPREADSHEET_ID`**.

---

## 2. Connect Your Standalone Apps Script Project to the Spreadsheet

In your standalone Apps Script project at [script.google.com](https://script.google.com):

1. Paste the updated code from [`google-apps-script/Code.gs`](./Code.gs) into your script editor.
2. Click **Save** (disk icon).

You have two simple ways to link your Spreadsheet ID:

### Method A (Recommended — Easiest):
1. In the Apps Script toolbar function dropdown, select **`setSpreadsheetId`**.
2. Temporarily edit line 78 in `Code.gs` or run this command in a quick helper:
   ```javascript
   function runMySetup() {
     setSpreadsheetId("PASTE_YOUR_SPREADSHEET_ID_HERE");
   }
   ```
3. Select `runMySetup` and click **Run**.
4. Check the Execution Log:
   `✅ Successfully connected to Spreadsheet: 'Unit Review Arcade - Student Tracking' (ID: ...)`

### Method B (Via Project Settings):
1. In the left navigation panel of Apps Script, click the **Project Settings** (gear icon ⚙️).
2. Scroll down to **Script Properties**.
3. Click **Add script property**:
   - **Property**: `SPREADSHEET_ID`
   - **Value**: *(Paste your Spreadsheet ID)*
4. Click **Save script properties**.

---

## 3. Run the Database Setup Routine

1. Switch back to the **Editor** (`< >` icon) in Apps Script.
2. In the function dropdown, select **`setupArcadeDatabase`** and click **Run**.
3. If Google requests authorization:
   - Click **Review permissions**.
   - Select your Google account.
   - Click **Advanced** > **Go to Unit Review Arcade Backend (unsafe)**.
   - Click **Allow**.
4. Open your Google Spreadsheet. You will see 5 formatted, styled tabs:
   - 📁 **`Students`**
   - 📁 **`Sessions`**
   - 📁 **`Attempts`** *(Ready for Phase 2 telemetry)*
   - 📁 **`Answers`** *(Ready for Phase 2 diagnostics)*
   - 📁 **`Dashboard`** *(Live formula summary for classes 7A, 7B, 8A, 8B)*

---

## 4. Deploy the Web App

1. In the top-right corner, click **Deploy** > **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Settings:
   - **Description**: `Unit Review Arcade Standalone API v1`
   - **Execute as**: **`Me`**
   - **Who has access**: **`Anyone`** *(Required so students can authenticate without Google logins)*
4. Click **Deploy**.
5. Copy the **Web App URL** (`https://script.google.com/macros/s/.../exec`).

---

## 5. Security & Production Checklist

### A. PIN Hashing & Server-Side Secret Pepper
- **Why it matters**: 4-digit PINs have low entropy (10,000 combinations). If an attacker gets read access to a sheet, ordinary salted SHA-256 can be brute-forced offline in under a second.
- **The Pepper Defense**: `Code.gs` uses a two-tier key derivation:
  `pin + ":" + salt + ":" + pepper`
- The `PEPPER_SECRET` is generated automatically and stored in **Script Properties**, which is **completely inaccessible** from the Google Sheet.
- Even if someone exports or views the entire spreadsheet, they cannot crack the PINs because the pepper key is absent from the sheet.

### B. Demo Accounts vs. Production Roster
- To test initially, run **`createDemoStudentAccounts`** in Apps Script. This creates 8 test accounts for `7A`, `7B`, `8A`, `8B`.
- **Before going to production with real students**:
  1. Run **`removeDemoAccounts`** in the Apps Script function runner to wipe demo credentials.
  2. Use **`importStudentsRoster(studentsArray)`** with real student rosters.
  3. Recommend 4 to 6 digit PINs for real students.

### C. Session Token & Brute-Force Defense
- **Tokens**: 64-character cryptographic tokens (`uat_...`) generated server-side.
- **Expiration**: Enforced server-side after 12 hours.
- **Rate Limiting**: 5 consecutive failed PIN attempts automatically locks the student account for 15 minutes (`locked_until`).
- **Sanitized Outputs**: The client only receives first name and class (no salts, hashes, or full names).
