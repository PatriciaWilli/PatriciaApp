import { AuthProvider, useAuth } from './AuthContext'
import Login from './Login'

// Ihre bestehende App-Komponente (umbenennen)
function MainApp() {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header mit Logout */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Event Manager</h1>
          <div className="flex items-center gap-4">
            <span>Hallo, {user?.email}</span>
            <button
              onClick={signOut}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Ihre bestehende App */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2>Hier kommt Ihre Event-Liste...</h2>
        {/* Ihre bestehenden Komponenten */}
      </main>
    </div>
  )
}

// Wrapper-Komponente für Auth-Check
function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Lädt...</div>
      </div>
    )
  }

  // Wenn nicht eingeloggt → Login-Seite zeigen
  if (!user) {
    return <Login />
  }

  // Wenn eingeloggt → App zeigen
  return <MainApp />
}

// Haupt-App mit AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
