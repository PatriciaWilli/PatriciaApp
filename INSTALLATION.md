# Installation & Setup Guide

## Schnellstart

### Voraussetzungen
- Node.js (Version 16 oder höher)
- npm oder yarn

### Installation Schritt für Schritt

1. **Projekt-Dateien entpacken**
   ```bash
   cd event-manager-app
   ```

2. **Dependencies installieren**
   ```bash
   npm install
   ```

3. **Development Server starten**
   ```bash
   npm run dev
   ```
   Die App läuft jetzt auf `http://localhost:5173`

4. **Production Build erstellen**
   ```bash
   npm run build
   ```
   Die fertigen Dateien befinden sich im `dist/` Ordner.

5. **Production Build testen**
   ```bash
   npm run preview
   ```

## Deployment

### Vercel (Empfohlen)

1. **Vercel CLI installieren**
   ```bash
   npm install -g vercel
   ```

2. **Projekt deployen**
   ```bash
   vercel
   ```

3. **Production Deployment**
   ```bash
   vercel --prod
   ```

### Netlify

1. Erstelle ein neues Projekt auf netlify.com
2. Verbinde dein Git Repository
3. Build Settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`

### GitHub Pages

1. Installiere gh-pages:
   ```bash
   npm install gh-pages --save-dev
   ```

2. Füge in package.json hinzu:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. Deploye:
   ```bash
   npm run deploy
   ```

## Projektstruktur

```
event-manager-app/
├── public/              # Statische Assets
│   └── vite.svg        # Favicon
├── src/
│   ├── App.jsx         # Haupt-Komponente
│   ├── main.jsx        # React Entry Point
│   └── index.css       # Global Styles mit Tailwind
├── index.html          # HTML Template
├── package.json        # Dependencies & Scripts
├── vite.config.js      # Vite Konfiguration
├── tailwind.config.js  # Tailwind Konfiguration
├── postcss.config.js   # PostCSS Konfiguration
├── .eslintrc.cjs       # ESLint Konfiguration
├── .gitignore          # Git Ignore Regeln
├── vercel.json         # Vercel Deployment Config
└── README.md           # Projekt-Dokumentation
```

## Entwicklung

### Available Scripts

- `npm run dev` - Startet den Development Server
- `npm run build` - Erstellt Production Build
- `npm run preview` - Testet den Production Build lokal
- `npm run lint` - Führt ESLint aus

### Test-Zugänge

**Normaler User:**
- Email: max@example.com
- Passwort: (beliebig in Demo-Modus)

**Administrator:**
- Email: admin@example.com
- Passwort: (beliebig in Demo-Modus)

## Anpassungen

### Farben ändern
Bearbeite `tailwind.config.js` und `src/App.jsx` für Theme-Änderungen.

### Spieler anpassen
In `src/App.jsx` die `players` Array bearbeiten.

### Events anpassen
In `src/App.jsx` die `events` Array bearbeiten.

## Troubleshooting

### Port bereits in Verwendung
```bash
# Ändere den Port in vite.config.js oder nutze:
npm run dev -- --port 3000
```

### Build Fehler
```bash
# Cache löschen und neu installieren
rm -rf node_modules package-lock.json
npm install
```

### Styling Probleme
```bash
# Tailwind neu bauen
npm run build
```

## Support

Bei Fragen oder Problemen:
1. Prüfe die README.md
2. Schaue in die Browser-Konsole für Fehler
3. Prüfe die Node.js und npm Versionen

## Browser-Support

- Chrome/Edge (empfohlen)
- Firefox
- Safari
- Andere moderne Browser mit ES6+ Support

## Performance-Tipps

1. Nutze Production Build für Deployment
2. Aktiviere Compression auf dem Server
3. Nutze CDN für bessere Ladezeiten
4. Implementiere Service Worker für PWA-Features

## Sicherheitshinweis

⚠️ **WICHTIG**: Diese Demo-App nutzt keine echte Authentifizierung! 

Für Production:
- Implementiere Backend mit echter Auth
- Nutze HTTPS
- Implementiere Datenbankanbindung
- Füge Rate-Limiting hinzu
- Sanitize User-Inputs

## Nächste Schritte

1. ✅ App lokal testen
2. ✅ Anpassungen vornehmen
3. ✅ Backend-Integration planen
4. ✅ Deployment durchführen
5. ✅ PWA-Features aktivieren (Service Worker)

Viel Erfolg! ⚽
