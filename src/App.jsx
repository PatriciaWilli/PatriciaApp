import React from 'react';

function App() {
  const events = [
    {
      id: 1,
      title: 'Fussball',
      date: '2025-11-05',
      timeFrom: '19:30',
      timeTo: '21:30',
      location: 'Turnhalle',
      participants: 8
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: '#4f46e5', 
        color: 'white', 
        padding: '1.5rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
            ⚽ KTV AH Fussball
          </h1>
          <p style={{ color: '#c7d2fe', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
            Event Manager
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
          Kommende Events
        </h2>

        {/* Events Liste */}
        {events.map((event) => (
          <div
            key={event.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '1.5rem',
              marginBottom: '1rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                  {event.title}
                </h3>
                
                <div style={{ color: '#4b5563', marginBottom: '0.5rem' }}>
                  <span style={{ marginRight: '0.5rem' }}>📅</span>
                  <span>{formatDate(event.date)}</span>
                </div>
                
                <div style={{ color: '#4b5563', marginBottom: '0.5rem' }}>
                  <span style={{ marginRight: '0.5rem' }}>🕐</span>
                  <span>{event.timeFrom} - {event.timeTo}</span>
                </div>
                
                <div style={{ color: '#4b5563' }}>
                  <span style={{ marginRight: '0.5rem' }}>📍</span>
                  <span>{event.location}</span>
                </div>
              </div>

              {/* Teilnehmer-Anzahl */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#4f46e5' }}>
                  {event.participants}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  Teilnehmer
                </div>
              </div>
            </div>

            {/* Aktions-Buttons */}
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button 
                style={{
                  flex: 1,
                  backgroundColor: '#10b981',
                  color: 'white',
                  fontWeight: '600',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  minWidth: '150px'
                }}
                onClick={() => alert('Zusage wird gespeichert (später mit Supabase)')}
              >
                ✓ Zusagen
              </button>
              <button 
                style={{
                  flex: 1,
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontWeight: '600',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  minWidth: '150px'
                }}
                onClick={() => alert('Absage wird gespeichert (später mit Supabase)')}
              >
                ✗ Absagen
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer style={{ 
        backgroundColor: 'white', 
        borderTop: '1px solid #e5e7eb',
        marginTop: '3rem',
        padding: '1.5rem',
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '0.875rem'
      }}>
        <p>KTV AH Fussball Event Manager v1.0</p>
      </footer>
    </div>
  );
}

export default App;
