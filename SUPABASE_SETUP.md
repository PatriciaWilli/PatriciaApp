# 🚀 Supabase Integration - Installation Guide

## Schritt 1: Package installieren
```bash
npm install @supabase/supabase-js
```

## Schritt 2: Umgebungsvariablen einrichten

1. Kopieren Sie die `.env` Datei in das Root-Verzeichnis Ihres Projekts
2. Stellen Sie sicher, dass `.env` in `.gitignore` steht:
   ```
   # .gitignore
   .env
   .env.local
   ```

## Schritt 3: Datenbank-Schema einrichten

1. Gehen Sie zu Ihrem Supabase Dashboard: https://app.supabase.com
2. Wählen Sie Ihr Projekt aus
3. Navigieren Sie zu "SQL Editor" im linken Menü
4. Öffnen Sie `supabase-schema.sql` und kopieren Sie den gesamten Inhalt
5. Fügen Sie ihn in den SQL Editor ein
6. Klicken Sie auf "Run" um das Schema zu erstellen

## Schritt 4: Dateien in Ihr Projekt kopieren

Kopieren Sie die folgenden Dateien in Ihr `src/` Verzeichnis:

```
src/
├── supabaseClient.js      # Supabase Client-Konfiguration
├── AuthContext.jsx        # Authentication Context
└── Login.jsx              # Login/Register Komponente
```

## Schritt 5: App.jsx aktualisieren

Umschließen Sie Ihre App mit dem AuthProvider:

```jsx
import { AuthProvider } from './AuthContext'
import Login from './Login'
import { useAuth } from './AuthContext'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Lädt...</div>
  }

  if (!user) {
    return <Login />
  }

  return (
    <div>
      {/* Ihre bestehende App */}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
```

## Schritt 6: Email-Templates konfigurieren (Optional)

1. Gehen Sie zu "Authentication" > "Email Templates" in Supabase
2. Passen Sie die Templates für Bestätigungs-Emails an
3. Konfigurieren Sie die Redirect-URL in "Authentication" > "URL Configuration"

## Schritt 7: Testen

```bash
npm run dev
```

Besuchen Sie http://localhost:5173 und testen Sie:
- ✅ Registrierung eines neuen Users
- ✅ Login mit Email/Passwort
- ✅ Logout
- ✅ Datenbank-Einträge im Supabase Dashboard prüfen

## 📚 Nützliche Ressourcen

- Supabase Docs: https://supabase.com/docs
- Auth Helpers: https://supabase.com/docs/guides/auth
- Row Level Security: https://supabase.com/docs/guides/auth/row-level-security

## ⚠️ Wichtige Sicherheitshinweise

1. **NIEMALS** Ihre `service_role` Key im Frontend verwenden
2. Verwenden Sie nur den `anon` Key im Frontend
3. Alle sensiblen Operationen über Row Level Security (RLS) absichern
4. `.env` Datei NICHT in Git committen

## 🔧 Troubleshooting

### Problem: "Invalid API Key"
- Überprüfen Sie, ob die Umgebungsvariablen korrekt gesetzt sind
- Server neustarten nach .env Änderungen

### Problem: "Row Level Security Policy Violation"
- Überprüfen Sie die RLS Policies in Supabase
- Stellen Sie sicher, dass das SQL-Schema korrekt ausgeführt wurde

### Problem: Email-Bestätigung funktioniert nicht
- Überprüfen Sie die Email-Templates in Supabase
- Prüfen Sie die Site URL in den Auth Settings
