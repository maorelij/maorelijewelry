# Maor & Eli Jewelry 💜

PWA לקטלוג תכשיטים של מאור ואלי.
מבוסס על אותה תשתית של Omer's Kitchen.

## 📁 מבנה התיקייה

```
maorelijewelry/
├── index.html       ← האפליקציה הראשית (קטלוג, פריט, popup הזמנה)
├── install.html     ← דף הוראות התקנה (iOS + Android)
├── manifest.json    ← PWA manifest
├── sw.js            ← Service Worker
├── icons/
│   ├── icon-192.png ← אייקון 192x192 (להוסיף)
│   └── icon-512.png ← אייקון 512x512 (להוסיף)
└── images/          ← תמונות התכשיטים (להוסיף)
```

## 🛠️ עריכה מהירה

### החלפת מספרי וואטסאפ
ב־`index.html`, חפש `SELLERS` ועדכן:
```js
const SELLERS = {
  maor: { name: 'מאור', phone: '972501234567' },  // בלי + ובלי 0 בהתחלה
  eli:  { name: 'אלי',  phone: '972501234568' },
};
```

### הוספת/עריכת פריטים
ב־`index.html`, חפש `PRODUCTS` ועדכן את המערך:
```js
{
  id: 5,
  name: 'שם הפריט',
  price: 40,
  category: 'necklaces',  // necklaces | bracelets | rings | earrings
  image: 'my-photo.jpg',  // קובץ ב-/images/  או null לאימוג'י
  emoji: '💜',
  description: 'תיאור...\nשורה שנייה...'
}
```

### הוספת קטגוריה חדשה
חפש `CATEGORIES` ב־`index.html`:
```js
{ id: 'charms', name: 'תליונים', emoji: '✨' },
```
ואז השתמש ב־`category: 'charms'` בפריטים.

## 🖼️ תמונות

שים תמונות בתיקיית `images/`. גודל מומלץ: 800×800 px, JPG או WEBP.
ב־`PRODUCTS` ציין את שם הקובץ ב־`image`.
אם אין תמונה, השאר `image: null` והאימוג'י יוצג במקום.

## 🎨 אייקונים

צור 2 גרסאות מהלוגו:
- `icons/icon-192.png` — 192×192 px
- `icons/icon-512.png` — 512×512 px

(אפשר עם https://realfavicongenerator.net/ או https://maskable.app/)

## 🚀 פריסה ל־Vercel

1. צור repository חדש ב־GitHub: `maorelijewelry`
2. העלה את כל הקבצים מהתיקייה הזו ל־root של ה־repo
3. ב־Vercel: New Project → Import מ־GitHub → בחר את ה־repo
4. Framework Preset: **Other** (אין צורך בהגדרות בנייה)
5. Deploy

## 🔄 חשוב מאוד — מנגנון עדכונים אוטומטיים

האפליקציה משתמשת באותה לוגיקה של Omer's Kitchen v36+ —
**אף משתמש לא צריך למחוק ולהתקין מחדש**. העדכון קורה אוטומטית.

**איך זה עובד:**
- כל 30 שניות הדפדפן בודק אם יש גרסה חדשה של ה־Service Worker
- אם יש — ה־SW החדש מותקן עם `skipWaiting()` ותופס שליטה מיד
- כל הטאבים הפתוחים מקבלים הודעה ומבצעים reload עם toast יפה

**מה שאתה צריך לעשות אחרי כל שינוי:**

1. ערוך את הקבצים (index.html / מחירים / תמונות וכו')
2. **חשוב!** עלה את מספר הגרסה ב־`sw.js`:
   ```js
   const VERSION = 'maoreli-v3';  // → 'maoreli-v4', 'maoreli-v5'...
   ```
3. push ל־GitHub
4. Vercel יבנה אוטומטית
5. תוך 30 שניות — כל המכשירים יקבלו את העדכון

⚠️ אם שכחת להעלות גרסה ב־`sw.js`, השינויים שלך **לא יגיעו** למשתמשים שכבר התקינו! זה הכלל החשוב ביותר.

---

עשוי באהבה 💜
