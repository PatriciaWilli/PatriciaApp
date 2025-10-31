import React from 'react';

export default function App() {
  const event = {
    title: 'Fussball',
    date: '05.11.2025',
    time: '19:30 - 21:30',
    location: 'Turnhalle',
    count: 8
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>⚽ KTV AH Fussball</h1>
        <p style={styles.subtitle}>Event Manager</p>
      </header>

      <main style={styles.main}>
        <h2 style={styles.heading}>Kommende Events</h2>

        <div style={styles.card}>
          <div style={styles.cardContent}>
            <div style={styles.eventInfo}>
              <h3 style={styles.eventTitle}>{event.title}</h3>
              <p style={styles.detail}>📅 {event.date}</p>
              <p style={styles.detail}>🕐 {event.time}</p>
              <p style={styles.detail}>📍 {event.location}</p>
            </div>
            
            <div style={styles.counter}>
              <div style={styles.count}>{event.count}</div>
              <div style={styles.label}>Teilnehmer</div>
            </div>
          </div>

          <div style={styles.buttons}>
            <button 
              style={{...styles.button, ...styles.greenButton}}
              onClick={() => alert('Zusage gespeichert!')}
            >
              ✓ Zusagen
            </button>
            <button 
              style={{...styles.button, ...styles.redButton}}
              onClick={() => alert('Absage gespeichert!')}
            >
              ✗ Absagen
            </button>
          </div>
        </div>
      </main>

      <footer style={styles.footer}>
        <p>KTV AH Fussball Event Manager v1.0</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '1.5rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  subtitle: {
    margin: '0.25rem 0 0 0',
    fontSize: '0.875rem',
    color: '#c7d2fe'
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#1f2937'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: '1.5rem'
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  eventInfo: {
    flex: 1,
    minWidth: '200px'
  },
  eventTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#1f2937'
  },
  detail: {
    color: '#4b5563',
    marginBottom: '0.5rem'
  },
  counter: {
    textAlign: 'center',
    minWidth: '100px'
  },
  count: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#4f46e5'
  },
  label: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '0.25rem'
  },
  buttons: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap'
  },
  button: {
    flex: 1,
    minWidth: '150px',
    color: 'white',
    fontWeight: '600',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'opacity 0.2s'
  },
  greenButton: {
    backgroundColor: '#10b981'
  },
  redButton: {
    backgroundColor: '#ef4444'
  },
  footer: {
    backgroundColor: 'white',
    borderTop: '1px solid #e5e7eb',
    marginTop: '3rem',
    padding: '1.5rem',
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '0.875rem'
  }
};
