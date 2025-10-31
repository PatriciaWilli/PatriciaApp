# 🚀 Quick Start Guide - KTV AH Fussball Event Manager

## In 3 Minuten startklar!

### 1️⃣ Download & Extract
```bash
# ZIP entpacken
unzip event-manager-app.zip
cd event-manager-app
```

### 2️⃣ Install & Run
```bash
# Dependencies installieren (dauert ca. 1-2 Minuten)
npm install

# Development Server starten
npm run dev
```

### 3️⃣ Browser öffnen
Öffne: **http://localhost:5173**

---

## 🎯 Sofort loslegen

### Als User einloggen:
- **Email:** max@example.com
- **Passwort:** (beliebig)

➡️ Du siehst: Events, Zusagen/Absagen, Utensilien

### Als Admin einloggen:
- **Email:** admin@example.com
- **Passwort:** (beliebig)

➡️ Du siehst: Spielerverwaltung, Event-Erstellung, Utensilien-Verwaltung

---

## 📱 Features auf einen Blick

### User-Bereich:
✅ Event-Übersicht (Grid & Detail-Ansicht)  
✅ Zusagen/Absagen für Events  
✅ Utensilien mitbringen (z.B. Ball, Pumpe)  
✅ Gäste anmelden  
✅ Kommentare hinzufügen  

### Admin-Bereich:
✅ Spieler aktivieren/blockieren  
✅ Einzelne Events erstellen  
✅ Serientermine erstellen (z.B. jeden Dienstag)  
✅ Events bearbeiten & löschen  
✅ Utensilien verwalten (mit Icons & Saisons)  
✅ Sommer/Winter-Zeiträume definieren  
✅ Teilnehmer-Übersicht pro Event  

---

## 🌐 Production Deployment

### Vercel (1 Minute):
```bash
npm install -g vercel
vercel
```

### Netlify:
1. Gehe zu netlify.com
2. "Add new site" → "Deploy manually"
3. Ziehe den `dist` Ordner rein (nach `npm run build`)

### GitHub Pages:
```bash
npm install gh-pages --save-dev
npm run deploy
```

---

## 🔧 Häufige Anpassungen

### Spieler ändern:
`src/App.jsx` → `players` Array bearbeiten

### Standard-Events ändern:
`src/App.jsx` → `events` Array bearbeiten

### Farben ändern:
- Hauptfarbe: Suche nach `indigo-` und ersetze mit gewünschter Farbe
- Admin-Farbe: Suche nach `purple-`

### Logo ändern:
Ersetze `public/vite.svg` mit deinem Logo

---

## 💡 Tipps

**🎨 Mobile-First:** Die App funktioniert perfekt auf Smartphones!

**📊 Übersichts-Modus:** Perfekt für Meeting-Screens (Grid-Ansicht)

**⚙️ Saison-Feature:** Utensilien können auf Sommer/Winter beschränkt werden

**📅 Serientermine:** Erstelle z.B. jeden Dienstag für 6 Monate automatisch

---

## ⚠️ Wichtig für Production

Diese Demo-App hat **KEINE echte Authentifizierung**!

Für echten Einsatz benötigst du:
- ✅ Backend (z.B. Node.js/Express, Firebase, Supabase)
- ✅ Datenbank (z.B. PostgreSQL, MongoDB)
- ✅ Echte User-Authentication
- ✅ API-Endpoints für CRUD-Operationen
- ✅ HTTPS/SSL

---

## 📞 Troubleshooting

**Problem:** Port bereits belegt  
**Lösung:** `npm run dev -- --port 3000`

**Problem:** Tailwind-Styles fehlen  
**Lösung:** `npm run build` ausführen

**Problem:** Icons fehlen  
**Lösung:** `npm install lucide-react --save`

---

## 📚 Weitere Dokumentation

- **README.md** - Vollständige Feature-Liste
- **INSTALLATION.md** - Detaillierte Setup-Anleitung

---

## ✨ Viel Erfolg!

Bei Fragen: Dokumentation lesen oder Browser-Konsole checken 🔍

**Happy Coding! ⚽🎉**
