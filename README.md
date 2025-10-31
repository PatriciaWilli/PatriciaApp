# KTV AH Fussball Event Manager

Eine Progressive Web App (PWA) für die Verwaltung von Fussball-Events, Spielern und Zusagen.

## Features

### Für Spieler:
- **Übersichtsansicht**: Tabellarische Darstellung aller Events und Spielerzusagen
- **Detailansicht**: Einzelne Events mit allen Details
- **Zusagen/Absagen**: Einfache Rückmeldung für Events
- **Utensilien-Management**: Auswahl welche Gegenstände mitgebracht werden
- **Gäste anmelden**: Möglichkeit zusätzliche Personen anzumelden
- **Kommentare**: Optional Kommentare zu Events hinzufügen

### Für Administratoren:
- **Spielerverwaltung**: Spieler aktivieren/blockieren
- **Event-Erstellung**: Einzelne Events oder Serientermine erstellen
- **Event-Bearbeitung**: Bestehende Events anpassen oder löschen
- **Utensilien-Verwaltung**: Gegenstände mit Icons und Saisonzuordnung verwalten
- **Saison-Konfiguration**: Sommer/Winter-Zeiträume definieren
- **Teilnehmer-Übersicht**: Anzahl Zusagen und Gäste pro Event sehen

## Technologie

- **React 18**: Moderne UI-Entwicklung
- **Vite**: Schneller Build-Prozess
- **Tailwind CSS**: Utility-First CSS Framework
- **Lucide React**: Icon-Bibliothek
- **Progressive Web App**: Offline-Funktionalität (PWA-ready)

## Installation

```bash
# Dependencies installieren
npm install

# Development-Server starten
npm run dev

# Production-Build erstellen
npm run build

# Production-Build testen
npm run preview
```

## Test-Zugänge

### Normaler User:
- Email: max@example.com
- Rolle: Spieler

### Administrator:
- Email: admin@example.com
- Rolle: Admin mit vollem Zugriff

*Hinweis: In dieser Demo-Version wird kein tatsächliches Passwort benötigt.*

## Deployment

Die App ist bereit für Deployment auf:
- Vercel (vercel.json konfiguriert)
- Netlify
- Jeden Static-Host

### Vercel Deployment:
```bash
npm install -g vercel
vercel
```

## Projektstruktur

```
event-manager-app/
├── public/           # Statische Assets
├── src/
│   ├── App.jsx      # Haupt-Komponente (EventManagerPWA)
│   ├── main.jsx     # React Entry Point
│   └── index.css    # Tailwind-Styles
├── index.html       # HTML Template
├── package.json     # Dependencies
├── vite.config.js   # Vite Konfiguration
├── tailwind.config.js
└── postcss.config.js
```

## Features im Detail

### Saisonale Utensilien
Die App unterstützt saisonale Zuordnung von Utensilien:
- **Ganzjährig**: Immer verfügbar
- **Sommer**: Nur in definierten Sommermonaten
- **Winter**: Außerhalb der Sommermonate

### Serientermine
Administratoren können wiederkehrende Events erstellen:
- Wochentag auswählen
- Zeitraum definieren
- Automatische Erstellung aller Termine

### Responsive Design
- Mobile-First Ansatz
- Optimiert für Smartphones
- Funktioniert auch auf Tablets und Desktop

## Browser-Support

- Chrome/Edge (empfohlen)
- Firefox
- Safari
- Andere moderne Browser

## Lizenz

© 2025 KTV AH Fussball - Alle Rechte vorbehalten
