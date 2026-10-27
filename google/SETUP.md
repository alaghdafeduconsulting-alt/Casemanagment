# Putting فضاء آفاق on Google (about 10 minutes, once)

You need two files from this folder:
- `Code.gs`: the part that saves data into your Google Sheet
- `index.html` (in the main folder): the app itself

Do this on a computer, signed in to **your** Gmail account. Your team doesn't need to do any of it.

## 1. Create the Google Sheet

1. Go to **sheets.new**. A new empty spreadsheet opens.
2. At the top left, rename it to `فضاء آفاق — البيانات`.

All the data is stored here. Only you can open this sheet; the team uses the app and never sees the sheet.

## 2. Open the script editor

1. In the sheet menu, click **Extensions → Apps Script**. A new tab opens.
2. You'll see a file called `Code.gs` with a few lines in it. Select everything in it and delete it.
3. Open `Code.gs` (the file I sent), copy everything, and paste it there.

## 3. Add the app page

1. In the Apps Script tab, next to **Files**, click **+** and choose **HTML**.
2. Name it exactly `index` (Google adds `.html` itself).
3. Delete what's inside, then copy everything from `index.html` and paste it in.
4. Click the **Save** icon (💾).

## 4. Create the sheet tabs (run once)

1. In the toolbar, open the function menu (next to **Run** and **Debug**) and choose `setup`.
2. Click **Run**.
3. Google asks for permission:
   - Click **Review permissions** and choose your account.
   - It may say "Google hasn't verified this app". That's normal for your own script. Click **Advanced**, then **Go to … (unsafe)**, then **Allow**.
4. Go back to the sheet tab. You'll see new tabs: الإعدادات، الأطفال، السجلات، الأهداف، الأنشطة.

## 5. Choose the team code

1. Open the **الإعدادات** tab.
2. In cell **B1**, type a secret code, for example `khotowat-2026`.

Anyone who has the link and this code can use the app. To lock someone out later, change the code and give the new one only to the team.

## 6. Publish the app

1. In the Apps Script tab, click **Deploy → New deployment**.
2. Click the ⚙️ next to "Select type" and choose **Web app**.
3. Fill in:
   - **Execute as:** Me
   - **Who has access:** Anyone with Google account
4. Click **Deploy** and copy the **Web app URL**.

## 7. Send it to the team

Send them the **link** and the **team code**, for example on WhatsApp. The first time they open it, they type their name and the code, and the phone remembers both.

Tip: on the phone, use "Add to Home screen" so it opens like an app.

---

## When I send you an updated version later

1. Replace the contents of `index` (and `Code.gs` if it changed) the same way.
2. Click **Deploy → Manage deployments**, then click ✏️.
3. Under **Version**, choose **New version**, then click **Deploy**.

The link stays the same.

## Good to know

- Google shows a small grey line at the top: "This application was created by a Google Apps Script user". That's normal.
- Other people's changes appear within 30 seconds, or right away if you reload.
- To back up, use **File → Make a copy** in the sheet.
