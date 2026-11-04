# Google Sheets Backend & Google Apps Script Setup Guide

Follow these steps to initialize your Google Sheets database and deploy the backend Web App.

---

## Step 1: Create a Google Spreadsheet

1. Open your browser and go to [Google Sheets](https://sheets.new).
2. Name your spreadsheet: **`Unit Review Arcade - Student Tracking Database`**.

---

## Step 2: Open the Apps Script Editor

1. In the Google Sheets menu, click **Extensions** > **Apps Script**.
2. Rename the project in the top-left from "Untitled project" to **`Unit Review Arcade Backend`**.
3. In the script editor, delete any code inside `Code.gs`.
4. Copy and paste the entire contents of [`google-apps-script/Code.gs`](./Code.gs) into the editor.
5. Click the **Save** disk icon (or press `Ctrl + S`).

---

## Step 3: Run the Database Setup Routine

1. In the Apps Script toolbar, find the function selector dropdown (next to "Run" and "Debug").
2. Select **`setupArcadeDatabase`** and click **Run**.
3. **Authorization**: Google will ask you to authorize permissions (reading/writing to the attached spreadsheet):
   - Click **Review permissions**.
   - Choose your Google account.
   - Click **Advanced** > **Go to Unit Review Arcade Backend (unsafe)** *(standard for personal scripts)*.
   - Click **Allow**.
4. Check your Google Spreadsheet tabs at the bottom. You will see:
   - 📁 **`Students`** (with headers: `student_id`, `student_number`, `full_name`, `grade`, `class`, `pin_salt`, `pin_hash`, `is_active`, `failed_attempts`, `locked_until`, `created_at`, `last_login_at`)
   - 📁 **`Sessions`** (with session and ping headers)
   - 📁 **`Attempts`** (prepared for Phase 2 game tracking)
   - 📁 **`Answers`** (prepared for Phase 2 question tracking)
   - 📁 **`Dashboard`** (styled overview with live formulas for 7A, 7B, 8A, 8B)

---

## Step 4: Add Student Accounts (Zero Plaintext PIN Exposure)

You can seed demo accounts or real students directly within Apps Script. PINs are salted and hashed immediately; plaintext PINs are **never saved** to the sheet.

### Option A: Create Demo Students
1. In the function dropdown, select **`createDemoStudentAccounts`** and click **Run**.
2. This creates 8 test accounts across all classes:
   - **7A**: Student Number `701` (PIN `1234`), `702` (PIN `4321`)
   - **7B**: Student Number `703` (PIN `1111`), `704` (PIN `2222`)
   - **8A**: Student Number `801` (PIN `1234`), `802` (PIN `4321`)
   - **8B**: Student Number `803` (PIN `1111`), `804` (PIN `2222`)

### Option B: Add a Custom Student
At the bottom of `Code.gs`, you can run:
```javascript
createStudentAccount("142", "Mehmet Demir", "7", "7A", "5892");
```

---

## Step 5: Deploy the Web App

1. In the top-right corner of the Apps Script editor, click **Deploy** > **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Configure the settings:
   - **Description**: `Unit Review Arcade API v1`
   - **Execute as**: **`Me`** (`your_email@gmail.com`)
   - **Who has access**: **`Anyone`** *(Required so students can authenticate without Google logins)*
4. Click **Deploy**.
5. Copy the **Web App URL** provided (it looks like `https://script.google.com/macros/s/AKfycbx.../exec`).

---

## Step 6: Connect Web App URL to Frontend

You can configure the URL in two ways:

### Method 1: Environment Variable (`.env.local`)
Create a file named `.env.local` in the project root:
```env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

### Method 2: Direct in App
When running in development or smartboard, you can test without an active Apps Script deployment by enabling **Demo / Offline Mode** in the settings, or entering the Web App URL dynamically.

---

## Security Architecture Summary

- **Salted SHA-256 (1,000 rounds)** prevents precomputed rainbow table attacks.
- **5-attempt Brute Force Lockout** (15-minute freeze) defends against 4-digit PIN brute forcing.
- **12-Hour Session Expiration** validated server-side.
- **Sanitized JSON Responses** return only the student's first name, display name, and class (no PINs, hashes, or sensitive records are ever transmitted).
