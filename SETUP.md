# Fruitology — Google Sheets Integration Setup Guide

## Step 1: Create Your Google Sheet

1. Go to https://sheets.google.com
2. Create a new spreadsheet
3. Name it: **Fruitology Orders**
4. In Row 1, add these headers in columns A to K:
   - A: Timestamp
   - B: Order Ref
   - C: Name
   - D: Mobile
   - E: Product
   - F: Variant
   - G: Price (৳)
   - H: Courier
   - I: Address
   - J: Note
   - K: Payment Method

---

## Step 2: Open Apps Script

1. In your Google Sheet, click **Extensions → Apps Script**
2. Delete all existing code in the editor
3. Paste the following code:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.timestamp    || new Date().toLocaleString(),
      data.ref          || '',
      data.name         || '',
      data.mobile       || '',
      data.product      || '',
      data.variant      || '',
      data.price        || '',
      data.courier      || '',
      data.address      || '',
      data.note         || '',
      data.paymentMethod|| ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('Fruitology Order API is running.')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

---

## Step 3: Deploy as Web App

1. Click **Deploy → New Deployment**
2. Click the gear icon ⚙️ next to "Type" → select **Web app**
3. Set:
   - Description: `Fruitology Orders`
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Copy the **Web App URL** — it looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`

---

## Step 4: Update Your Website

Open `js/main.js` and replace line 4:

```javascript
// BEFORE:
GOOGLE_SHEET_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',

// AFTER (paste your actual URL):
GOOGLE_SHEET_URL: 'https://script.google.com/macros/s/AKfycbXXXXX.../exec',
```

---

## Step 5: Update Your Phone Numbers

In `js/main.js`, replace:

```javascript
WHATSAPP_NUMBER: '8801XXXXXXXXX',   // Your number: 880 + without leading 0
BKASH_NUMBER:   '01XXXXXXXXX',      // Your bKash number
NAGAD_NUMBER:   '01XXXXXXXXX',      // Your Nagad number
```

**Example:** If your number is 01712345678
- WhatsApp: `8801712345678`
- bKash/Nagad: `01712345678`

---

## Step 6: Update Footer Contact Info

In all 3 HTML files (index.html, products.html, checkout.html),
search for `01XXXXXXXXX` and replace with your actual number.

---

## How to Host for Free on Netlify

1. Go to https://netlify.com and sign up free
2. Drag your entire `fruitology` folder into the Netlify deploy area
3. Your site goes live instantly at `yourname.netlify.app`
4. Later: connect your custom domain (fruitology.store) from Netlify dashboard

---

## Folder Structure

```
fruitology/
├── index.html        ← Home page
├── products.html     ← All products page
├── checkout.html     ← Order + payment page
├── css/
│   └── style.css     ← All styles
├── js/
│   └── main.js       ← Config + logic + Google Sheets
└── SETUP.md          ← This file
```

---

## Quick Checklist Before Going Live

- [ ] Google Sheet created with headers
- [ ] Apps Script deployed and URL copied
- [ ] `GOOGLE_SHEET_URL` updated in `js/main.js`
- [ ] `WHATSAPP_NUMBER` updated in `js/main.js`
- [ ] `BKASH_NUMBER` and `NAGAD_NUMBER` updated
- [ ] Footer phone numbers updated in all HTML files
- [ ] WhatsApp link in checkout.html updated
- [ ] Site uploaded to Netlify

---

*Fruitology — Pure Nak Fazli Mango. Made with love in Bangladesh. 🥭*
