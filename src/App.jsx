import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, Check, X, MessageSquare, UserPlus, Settings, LogOut, Plus, Lock, Unlock, Edit2, Trash2, User, Mail, Key } from 'lucide-react';

const EventManagerPWA = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [view, setView] = useState('login');
  const [userViewMode, setUserViewMode] = useState('grid');

  // User-Liste mit Passwörtern
  const [users, setUsers] = useState([
    { id: 1, nickname: 'Wacki', email: 'max@example.com', password: 'demo123', active: true },
    { id: 2, nickname: 'Gruppenleiter', email: 'admin@example.com', password: 'admin123', active: true, isAdmin: true },
    { id: 3, nickname: 'Andres', email: 'andres@example.com', password: 'demo123', active: true },
    { id: 4, nickname: 'Casanova', email: 'casanova@example.com', password: 'demo123', active: true },
    { id: 5, nickname: 'Cesar', email: 'cesar@example.com', password: 'demo123', active: true },
    { id: 6, nickname: 'Fabri', email: 'fabri@example.com', password: 'demo123', active: true },
    { id: 7, nickname: 'Sergio', email: 'sergio@example.com', password: 'demo123', active: false },
    { id: 8, nickname: 'Nikola', email: 'nikola@example.com', password: 'demo123', active: true },
  ]);

  // States für Benutzerverwaltung
  const [showUserModal, setShowUserModal] = useState(false);
  const [showUserEditModal, setShowUserEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    nickname: '',
    email: '',
    password: ''
  });
  const [passwordChange, setPasswordChange] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [playerStates, setPlayerStates] = useState(
    users.reduce((acc, user) => {
      acc[user.id] = user.active;
      return acc;
    }, {})
  );

  const togglePlayerStatus = (playerId) => {
    setPlayerStates(prev => ({
      ...prev,
      [playerId]: !prev[playerId]
    }));
    setUsers(prev => prev.map(user => 
      user.id === playerId ? { ...user, active: !user.active } : user
    ));
  };

  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Fussball',
      date: '05.11.2025',
      timeFrom: '19:30',
      timeTo: '21:30',
      location: 'Turnhalle',
      responses: {
        1: { status: 'accepted', items: ['ball'], guests: 0, comment: '' },
        3: { status: 'accepted', items: [], guests: 0, comment: '' },
        4: { status: 'declined', items: [], guests: 0, comment: 'Kann leider nicht' },
      }
    },
    {
      id: 2,
      title: 'Fussball',
      date: '12.11.2025',
      timeFrom: '19:30',
      timeTo: '21:30',
      location: 'Turnhalle',
      responses: {}
    },
    {
      id: 3,
      title: 'Fussball',
      date: '19.11.2025',
      timeFrom: '19:30',
      timeTo: '21:30',
      location: 'Turnhalle',
      responses: {}
    }
  ]);

  const [utensils, setUtensils] = useState([
    { id: 'hallenball', name: 'Hallenball', icon: '🏐', season: 'winter' },
    { id: 'ball', name: 'Ball', icon: '⚽', season: 'summer' },
    { id: 'ueberzieher', name: 'Überzieher', icon: '👕', season: 'winter' },
    { id: 'pumpe', name: 'Pumpe', icon: '🔧', season: 'all' }
  ]);

  const availableIcons = ['⚽', '🏐', '🏀', '🎾', '🏈', '⚾', '🥎', '🏓', '🏸', '🏒', '🏑', '🥍', '🏹', '🎯', '🥊', '🥋', '⛳', '🏌️', '🎿', '⛷️', '🏂', '🤿', '🏊', '🚴', '🤸', '🤾', '⛹️', '🏋️', '🤺', '🧗', '🤼', '🔧', '🛠️', '👕', '🧤', '🧣', '🧢', '👟', '🥾', '💧', '🧴', '🧊', '☀️', '❄️', '🌡️', '💨', '⚡'];

  const [summerStart, setSummerStart] = useState({ month: '04', day: '01' });
  const [summerEnd, setSummerEnd] = useState({ month: '10', day: '31' });

  const [showEventModal, setShowEventModal] = useState(false);
  const [showSeriesModal, setShowSeriesModal] = useState(false);
  const [showUtensilModal, setShowUtensilModal] = useState(false);
  const [showSeasonModal, setShowSeasonModal] = useState(false);
  const [editingUtensil, setEditingUtensil] = useState(null);
  const [selectedEventForEdit, setSelectedEventForEdit] = useState(null);
  const [showEventEditModal, setShowEventEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showAdminEventEditModal, setShowAdminEventEditModal] = useState(false);
  const [showCommentTooltip, setShowCommentTooltip] = useState(null);
  
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    timeFrom: '',
    timeTo: '',
    location: ''
  });
  
  const [seriesEvent, setSeriesEvent] = useState({
    title: '',
    weekday: '2',
    timeFrom: '',
    timeTo: '',
    location: '',
    startDate: '',
    endDate: ''
  });
  
  const [newUtensil, setNewUtensil] = useState({
    name: '',
    icon: '',
    season: 'all'
  });

  // Funktion zum Prüfen ob ein Datum in der Vergangenheit liegt
  const isEventPast = (dateString) => {
    const [day, month, year] = dateString.split('.');
    const eventDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate < today;
  };

  // Automatisches Löschen vergangener Events beim Laden
  useEffect(() => {
    const cleanupOldEvents = () => {
      setEvents(prevEvents => prevEvents.filter(event => !isEventPast(event.date)));
    };
    
    cleanupOldEvents();
    // Täglich prüfen
    const interval = setInterval(cleanupOldEvents, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Benutzerverwaltungs-Funktionen
  const handleCreateUser = () => {
    if (!newUser.nickname || !newUser.email || !newUser.password) {
      alert('Bitte alle Felder ausfüllen');
      return;
    }
    
    if (users.find(u => u.email === newUser.email)) {
      alert('Diese E-Mail-Adresse wird bereits verwendet');
      return;
    }

    const userId = Math.max(...users.map(u => u.id), 0) + 1;
    const user = {
      id: userId,
      nickname: newUser.nickname,
      email: newUser.email,
      password: newUser.password,
      active: true,
      isAdmin: false
    };
    
    setUsers([...users, user]);
    setPlayerStates({...playerStates, [userId]: true});
    setShowUserModal(false);
    setNewUser({ nickname: '', email: '', password: '' });
    alert('Benutzer erfolgreich erstellt');
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
    setShowUserEditModal(true);
  };

  const handleUpdateUser = () => {
    if (!editingUser.nickname || !editingUser.email || !editingUser.password) {
      alert('Bitte alle Felder ausfüllen');
      return;
    }
    
    if (users.find(u => u.email === editingUser.email && u.id !== editingUser.id)) {
      alert('Diese E-Mail-Adresse wird bereits verwendet');
      return;
    }

    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    
    if (currentUser && currentUser.id === editingUser.id) {
      setCurrentUser(editingUser);
    }
    
    setShowUserEditModal(false);
    setEditingUser(null);
    alert('Benutzer erfolgreich aktualisiert');
  };

  const handleDeleteUser = (userId) => {
    if (currentUser && currentUser.id === userId) {
      alert('Sie können sich nicht selbst löschen');
      return;
    }
    
    if (window.confirm('Möchten Sie diesen Benutzer wirklich löschen?')) {
      setUsers(users.filter(u => u.id !== userId));
      
      setEvents(events.map(event => {
        const newResponses = { ...event.responses };
        delete newResponses[userId];
        return { ...event, responses: newResponses };
      }));
      
      const newPlayerStates = { ...playerStates };
      delete newPlayerStates[userId];
      setPlayerStates(newPlayerStates);
      
      alert('Benutzer erfolgreich gelöscht');
    }
  };

  const handlePasswordChange = () => {
    if (!passwordChange.currentPassword || !passwordChange.newPassword || !passwordChange.confirmPassword) {
      alert('Bitte alle Felder ausfüllen');
      return;
    }
    
    if (currentUser.password !== passwordChange.currentPassword) {
      alert('Das aktuelle Passwort ist nicht korrekt');
      return;
    }
    
    if (passwordChange.newPassword !== passwordChange.confirmPassword) {
      alert('Die neuen Passwörter stimmen nicht überein');
      return;
    }
    
    if (passwordChange.newPassword.length < 6) {
      alert('Das neue Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }

    const updatedUser = { ...currentUser, password: passwordChange.newPassword };
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    setShowPasswordModal(false);
    setPasswordChange({ currentPassword: '', newPassword: '', confirmPassword: '' });
    alert('Passwort erfolgreich geändert');
  };

  const handleLogin = () => {
    const user = users.find(p => p.email === loginEmail && p.password === loginPassword);
    if (user && playerStates[user.id]) {
      setCurrentUser(user);
      setView(user.isAdmin ? 'admin' : 'user');
    } else {
      alert('Login fehlgeschlagen - E-Mail, Passwort falsch oder Benutzer blockiert');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('login');
    setLoginEmail('');
    setLoginPassword('');
  };

  const getSeasonFromDate = (dateString) => {
    const parts = dateString.split('.');
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    
    const summerStartMonth = parseInt(summerStart.month);
    const summerStartDay = parseInt(summerStart.day);
    const summerEndMonth = parseInt(summerEnd.month);
    const summerEndDay = parseInt(summerEnd.day);
    
    const currentDate = month * 100 + day;
    const startDate = summerStartMonth * 100 + summerStartDay;
    const endDate = summerEndMonth * 100 + summerEndDay;
    
    if (currentDate >= startDate && currentDate <= endDate) {
      return 'summer';
    }
    return 'winter';
  };

  const getAvailableUtensils = (eventDate) => {
    const season = getSeasonFromDate(eventDate);
    return utensils.filter(u => u.season === 'all' || u.season === season);
  };

  const createSeriesEvents = () => {
    if (!seriesEvent.title || !seriesEvent.timeFrom || !seriesEvent.timeTo || !seriesEvent.location || !seriesEvent.startDate || !seriesEvent.endDate) {
      alert('Bitte alle Felder ausfüllen');
      return;
    }

    const targetWeekday = parseInt(seriesEvent.weekday);
    const startParts = seriesEvent.startDate.split('-');
    const endParts = seriesEvent.endDate.split('-');
    
    const startDate = new Date(parseInt(startParts[0]), parseInt(startParts[1]) - 1, parseInt(startParts[2]));
    const endDate = new Date(parseInt(endParts[0]), parseInt(endParts[1]) - 1, parseInt(endParts[2]));

    const newEvents = [];
    let currentDate = new Date(startDate);
    
    while (currentDate.getDay() !== targetWeekday) {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    let eventId = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
    
    while (currentDate <= endDate) {
      const day = String(currentDate.getDate()).padStart(2, '0');
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const year = currentDate.getFullYear();
      
      newEvents.push({
        id: eventId++,
        title: seriesEvent.title,
        date: `${day}.${month}.${year}`,
        timeFrom: seriesEvent.timeFrom,
        timeTo: seriesEvent.timeTo,
        location: seriesEvent.location,
        responses: {}
      });
      
      currentDate.setDate(currentDate.getDate() + 7);
    }

    setEvents([...events, ...newEvents]);
    setShowSeriesModal(false);
    setSeriesEvent({ title: '', weekday: '2', timeFrom: '', timeTo: '', location: '', startDate: '', endDate: '' });
    alert(`${newEvents.length} Termine erstellt`);
  };

  const createEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.timeFrom || !newEvent.timeTo || !newEvent.location) {
      alert('Bitte alle Felder ausfüllen');
      return;
    }

    const eventId = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
    setEvents([...events, {
      id: eventId,
      ...newEvent,
      responses: {}
    }]);
    setShowEventModal(false);
    setNewEvent({ title: '', date: '', timeFrom: '', timeTo: '', location: '' });
  };

  const deleteEvent = (eventId) => {
    if (window.confirm('Möchten Sie dieses Event wirklich löschen?')) {
      setEvents(events.filter(e => e.id !== eventId));
    }
  };

  const openEditEventModal = (event) => {
    setEditingEvent({ ...event });
    setShowAdminEventEditModal(true);
  };

  const saveEditedEvent = () => {
    if (!editingEvent.title || !editingEvent.date || !editingEvent.timeFrom || !editingEvent.timeTo || !editingEvent.location) {
      alert('Bitte alle Felder ausfüllen');
      return;
    }

    setEvents(events.map(e => e.id === editingEvent.id ? editingEvent : e));
    setShowAdminEventEditModal(false);
    setEditingEvent(null);
  };

  const addUtensil = () => {
    if (!newUtensil.name || !newUtensil.icon) {
      alert('Bitte Name und Icon auswählen');
      return;
    }

    if (editingUtensil) {
      setUtensils(utensils.map(u => 
        u.id === editingUtensil.id 
          ? { ...editingUtensil, name: newUtensil.name, icon: newUtensil.icon, season: newUtensil.season }
          : u
      ));
      setEditingUtensil(null);
    } else {
      const utensilId = utensils.length > 0 ? Math.max(...utensils.map(u => parseInt(u.id) || 0)) + 1 : 1;
      setUtensils([...utensils, {
        id: utensilId.toString(),
        name: newUtensil.name,
        icon: newUtensil.icon,
        season: newUtensil.season
      }]);
    }
    
    setShowUtensilModal(false);
    setNewUtensil({ name: '', icon: '', season: 'all' });
  };

  const editUtensil = (utensil) => {
    setEditingUtensil(utensil);
    setNewUtensil({
      name: utensil.name,
      icon: utensil.icon,
      season: utensil.season
    });
    setShowUtensilModal(true);
  };

  const deleteUtensil = (utensilId) => {
    if (window.confirm('Möchten Sie dieses Utensil wirklich löschen?')) {
      setUtensils(utensils.filter(u => u.id !== utensilId));
      
      setEvents(events.map(event => ({
        ...event,
        responses: Object.fromEntries(
          Object.entries(event.responses).map(([playerId, response]) => [
            playerId,
            { ...response, items: response.items.filter(item => item !== utensilId) }
          ])
        )
      })));
    }
  };

  const updateSeasonConfig = () => {
    setShowSeasonModal(false);
    alert('Saison-Konfiguration aktualisiert');
  };

  const handleResponse = (eventId, status) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        const currentResponse = event.responses[currentUser.id] || { items: [], guests: 0, comment: '' };
        return {
          ...event,
          responses: {
            ...event.responses,
            [currentUser.id]: {
              ...currentResponse,
              status
            }
          }
        };
      }
      return event;
    }));
  };

  const updateItems = (eventId, items) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        const currentResponse = event.responses[currentUser.id] || { status: 'accepted', guests: 0, comment: '' };
        return {
          ...event,
          responses: {
            ...event.responses,
            [currentUser.id]: {
              ...currentResponse,
              items
            }
          }
        };
      }
      return event;
    }));
  };

  const updateGuests = (eventId, guests) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        const currentResponse = event.responses[currentUser.id] || { status: 'accepted', items: [], comment: '' };
        return {
          ...event,
          responses: {
            ...event.responses,
            [currentUser.id]: {
              ...currentResponse,
              guests: parseInt(guests) || 0
            }
          }
        };
      }
      return event;
    }));
  };

  const updateComment = (eventId, comment) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        const currentResponse = event.responses[currentUser.id] || { status: 'accepted', items: [], guests: 0 };
        return {
          ...event,
          responses: {
            ...event.responses,
            [currentUser.id]: {
              ...currentResponse,
              comment
            }
          }
        };
      }
      return event;
    }));
  };

  const sortedEvents = [...events].sort((a, b) => {
    const dateA = a.date.split('.').reverse().join('');
    const dateB = b.date.split('.').reverse().join('');
    return dateA.localeCompare(dateB);
  });

  // Nur zukünftige Events anzeigen
  const upcomingEvents = sortedEvents.filter(event => !isEventPast(event.date));

  const acceptedCount = (event) => {
    return Object.values(event.responses).filter(r => r.status === 'accepted').length;
  };

  const guestCount = (event) => {
    return Object.values(event.responses).reduce((sum, r) => sum + (r.guests || 0), 0);
  };

  // Login View
  if (view === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">KTV AH Fussball</h1>
            <p className="text-gray-600 mt-2">Event Manager</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-Mail</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="deine@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Passwort</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Anmelden
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Demo-Login:<br />
              <span className="font-medium">Admin:</span> admin@example.com / admin123<br />
              <span className="font-medium">User:</span> max@example.com / demo123
            </p>
          </div>
        </div>
      </div>
    );
  }

  // User View
  if (view === 'user') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">KTV AH Fussball</h1>
              <p className="text-sm opacity-90">Hallo, {currentUser.nickname}!</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Passwort ändern"
              >
                <Key className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Abmelden"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto p-4">
            <div className="flex gap-2">
              <button
                onClick={() => setUserViewMode('grid')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  userViewMode === 'grid'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Übersicht
              </button>
              <button
                onClick={() => setUserViewMode('detail')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  userViewMode === 'detail'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Details
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto p-4">
          {userViewMode === 'grid' ? (
            // Grid View - Übersicht (Spieler vertikal, Termine horizontal)
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-green-600 to-blue-700 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold sticky left-0 bg-gradient-to-r from-green-600 to-blue-700 z-10">Spieler</th>
                      {upcomingEvents.map(event => (
                        <th key={event.id} className="px-4 py-3 text-center text-sm font-semibold min-w-[160px]">
                          <div className="font-medium">{event.date}</div>
                          <div className="text-xs opacity-90 mt-1">{event.title}</div>
                          <div className="text-xs opacity-75">{event.timeFrom}</div>
                          <div className="mt-2 pt-2 border-t border-white/30">
                            <div className="text-xs opacity-90 flex items-center justify-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>{acceptedCount(event)} Spieler + {guestCount(event)} Gäste</span>
                            </div>
                            <div className="text-sm font-bold mt-1">
                              Total: {acceptedCount(event) + guestCount(event)} Personen
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.filter(p => playerStates[p.id]).map(player => (
                      <tr key={player.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">
                          {player.nickname}
                        </td>
                        {upcomingEvents.map(event => {
                          const response = event.responses[player.id];
                          return (
                            <td key={event.id} className="px-4 py-3 text-center">
                              <div className="flex flex-col items-center gap-1">
                                {response?.status === 'accepted' ? (
                                  <>
                                    <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                                      <Check className="w-5 h-5 text-green-600" />
                                    </div>
                                    {response.guests > 0 && (
                                      <span className="text-xs text-gray-600 font-medium">+{response.guests}</span>
                                    )}
                                    {response.items && response.items.length > 0 && (
                                      <div className="flex gap-0.5 flex-wrap justify-center">
                                        {response.items.map(itemId => {
                                          const item = utensils.find(u => u.id === itemId);
                                          return item ? (
                                            <span key={itemId} className="text-lg" title={item.name}>
                                              {item.icon}
                                            </span>
                                          ) : null;
                                        })}
                                      </div>
                                    )}
                                    {response.comment && (
                                      <div className="relative">
                                        <button
                                          onMouseEnter={() => setShowCommentTooltip(`${event.id}-${player.id}`)}
                                          onMouseLeave={() => setShowCommentTooltip(null)}
                                          className="p-1 hover:bg-gray-100 rounded"
                                        >
                                          <MessageSquare className="w-4 h-4 text-blue-500 fill-blue-100" />
                                        </button>
                                        {showCommentTooltip === `${event.id}-${player.id}` && (
                                          <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap max-w-xs">
                                            {response.comment}
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                              <div className="border-4 border-transparent border-t-gray-900"></div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </>
                                ) : response?.status === 'declined' ? (
                                  <>
                                    <div className="inline-flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                                      <X className="w-5 h-5 text-red-600" />
                                    </div>
                                    {response.comment && (
                                      <div className="relative">
                                        <button
                                          onMouseEnter={() => setShowCommentTooltip(`${event.id}-${player.id}`)}
                                          onMouseLeave={() => setShowCommentTooltip(null)}
                                          className="p-1 hover:bg-gray-100 rounded"
                                        >
                                          <MessageSquare className="w-4 h-4 text-blue-500 fill-blue-100" />
                                        </button>
                                        {showCommentTooltip === `${event.id}-${player.id}` && (
                                          <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap max-w-xs">
                                            {response.comment}
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                              <div className="border-4 border-transparent border-t-gray-900"></div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <div className="text-gray-400">-</div>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            // Detail View
            <div className="space-y-4">
              {upcomingEvents.map(event => {
                const userResponse = event.responses[currentUser.id] || {};
                const availableItems = getAvailableUtensils(event.date);
                
                return (
                  <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white p-6">
                      <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{event.timeFrom} - {event.timeTo}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{acceptedCount(event)} Zusagen + {guestCount(event)} Gäste</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Zusage/Absage */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Deine Antwort</label>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleResponse(event.id, 'accepted')}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                              userResponse.status === 'accepted'
                                ? 'bg-green-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <Check className="w-5 h-5 inline mr-2" />
                            Zusagen
                          </button>
                          <button
                            onClick={() => handleResponse(event.id, 'declined')}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                              userResponse.status === 'declined'
                                ? 'bg-red-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <X className="w-5 h-5 inline mr-2" />
                            Absagen
                          </button>
                        </div>
                      </div>

                      {userResponse.status === 'accepted' && (
                        <>
                          {/* Utensilien */}
                          {availableItems.length > 0 && (
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Was bringst du mit?
                              </label>
                              <div className="grid grid-cols-2 gap-3">
                                {availableItems.map(item => (
                                  <button
                                    key={item.id}
                                    onClick={() => {
                                      const currentItems = userResponse.items || [];
                                      const newItems = currentItems.includes(item.id)
                                        ? currentItems.filter(i => i !== item.id)
                                        : [...currentItems, item.id];
                                      updateItems(event.id, newItems);
                                    }}
                                    className={`p-4 rounded-lg border-2 transition-all ${
                                      (userResponse.items || []).includes(item.id)
                                        ? 'border-green-600 bg-green-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                  >
                                    <div className="text-3xl mb-1">{item.icon}</div>
                                    <div className="text-sm font-medium text-gray-700">{item.name}</div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Gäste */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                              Gäste anmelden
                            </label>
                            <div className="flex items-center gap-3">
                              <UserPlus className="w-5 h-5 text-gray-600" />
                              <input
                                type="number"
                                min="0"
                                value={userResponse.guests || 0}
                                onChange={(e) => updateGuests(event.id, e.target.value)}
                                className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                              />
                              <span className="text-sm text-gray-600">zusätzliche Person(en)</span>
                            </div>
                          </div>

                          {/* Kommentar */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                              Kommentar (optional)
                            </label>
                            <textarea
                              value={userResponse.comment || ''}
                              onChange={(e) => updateComment(event.id, e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                              rows="3"
                              placeholder="Dein Kommentar..."
                            />
                          </div>
                        </>
                      )}

                      {userResponse.status === 'declined' && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Kommentar (optional)
                          </label>
                          <textarea
                            value={userResponse.comment || ''}
                            onChange={(e) => updateComment(event.id, e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                            rows="3"
                            placeholder="Grund für die Absage..."
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Passwort ändern Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Key className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Passwort ändern</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Aktuelles Passwort</label>
                  <input
                    type="password"
                    value={passwordChange.currentPassword}
                    onChange={(e) => setPasswordChange({...passwordChange, currentPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="••••••••"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Neues Passwort</label>
                  <input
                    type="password"
                    value={passwordChange.newPassword}
                    onChange={(e) => setPasswordChange({...passwordChange, newPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-gray-500 mt-1">Mindestens 6 Zeichen</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Neues Passwort bestätigen</label>
                  <input
                    type="password"
                    value={passwordChange.confirmPassword}
                    onChange={(e) => setPasswordChange({...passwordChange, confirmPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="••••••••"
                  />
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordChange({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handlePasswordChange}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                  >
                    Speichern
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Admin View
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-700 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-sm opacity-90">KTV AH Fussball Event Manager</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Abmelden</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setView('admin')}
              className="px-6 py-4 font-medium border-b-2 border-purple-600 text-purple-600 whitespace-nowrap"
            >
              Übersicht
            </button>
            <button
              onClick={() => setView('admin-users')}
              className="px-6 py-4 font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 whitespace-nowrap"
            >
              Benutzerverwaltung
            </button>
            <button
              onClick={() => setView('admin-players')}
              className="px-6 py-4 font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 whitespace-nowrap"
            >
              Spielerverwaltung
            </button>
            <button
              onClick={() => setView('admin-events')}
              className="px-6 py-4 font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 whitespace-nowrap"
            >
              Event-Verwaltung
            </button>
            <button
              onClick={() => setView('admin-utensils')}
              className="px-6 py-4 font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 whitespace-nowrap"
            >
              Utensilien
            </button>
            <button
              onClick={() => setView('admin-season')}
              className="px-6 py-4 font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 whitespace-nowrap"
            >
              Saison
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4">
        {view === 'admin' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-purple-600 to-blue-700 text-white">
              <h2 className="text-2xl font-bold">Event Übersicht</h2>
              <p className="text-sm opacity-90 mt-1">Alle Events und Teilnehmer im Überblick</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-600 to-blue-700 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold sticky left-0 bg-gradient-to-r from-purple-600 to-blue-700 z-10">Spieler</th>
                    {upcomingEvents.map(event => (
                      <th key={event.id} className="px-4 py-3 text-center text-sm font-semibold min-w-[160px]">
                        <div className="font-medium">{event.date}</div>
                        <div className="text-xs opacity-90 mt-1">{event.title}</div>
                        <div className="text-xs opacity-75">{event.timeFrom}</div>
                        <div className="mt-2 pt-2 border-t border-white/30">
                          <div className="text-xs opacity-90 flex items-center justify-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>{acceptedCount(event)} Spieler + {guestCount(event)} Gäste</span>
                          </div>
                          <div className="text-sm font-bold mt-1">
                            Total: {acceptedCount(event) + guestCount(event)} Personen
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.filter(p => playerStates[p.id]).map(player => (
                    <tr key={player.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">
                        {player.nickname}
                      </td>
                      {upcomingEvents.map(event => {
                        const response = event.responses[player.id];
                        return (
                          <td key={event.id} className="px-4 py-3 text-center">
                            <div className="flex flex-col items-center gap-1">
                              {response?.status === 'accepted' ? (
                                <>
                                  <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                                    <Check className="w-5 h-5 text-green-600" />
                                  </div>
                                  {response.guests > 0 && (
                                    <span className="text-xs text-gray-600 font-medium">+{response.guests}</span>
                                  )}
                                  {response.items && response.items.length > 0 && (
                                    <div className="flex gap-0.5 flex-wrap justify-center">
                                      {response.items.map(itemId => {
                                        const item = utensils.find(u => u.id === itemId);
                                        return item ? (
                                          <span key={itemId} className="text-lg" title={item.name}>
                                            {item.icon}
                                          </span>
                                        ) : null;
                                      })}
                                    </div>
                                  )}
                                  {response.comment && (
                                    <div className="relative">
                                      <button
                                        onMouseEnter={() => setShowCommentTooltip(`${event.id}-${player.id}`)}
                                        onMouseLeave={() => setShowCommentTooltip(null)}
                                        className="p-1 hover:bg-gray-100 rounded"
                                      >
                                        <MessageSquare className="w-4 h-4 text-blue-500 fill-blue-100" />
                                      </button>
                                      {showCommentTooltip === `${event.id}-${player.id}` && (
                                        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap max-w-xs">
                                          {response.comment}
                                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                            <div className="border-4 border-transparent border-t-gray-900"></div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </>
                              ) : response?.status === 'declined' ? (
                                <>
                                  <div className="inline-flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                                    <X className="w-5 h-5 text-red-600" />
                                  </div>
                                  {response.comment && (
                                    <div className="relative">
                                      <button
                                        onMouseEnter={() => setShowCommentTooltip(`${event.id}-${player.id}`)}
                                        onMouseLeave={() => setShowCommentTooltip(null)}
                                        className="p-1 hover:bg-gray-100 rounded"
                                      >
                                        <MessageSquare className="w-4 h-4 text-blue-500 fill-blue-100" />
                                      </button>
                                      {showCommentTooltip === `${event.id}-${player.id}` && (
                                        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap max-w-xs">
                                          {response.comment}
                                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                            <div className="border-4 border-transparent border-t-gray-900"></div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="text-gray-400">-</div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {view === 'admin-users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Benutzerverwaltung</h2>
              <button
                onClick={() => setShowUserModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
              >
                <Plus className="w-5 h-5" />
                Neuer Benutzer
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nickname</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">E-Mail</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Passwort</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Rolle</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">{user.nickname}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{user.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Key className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500 font-mono">{'•'.repeat(8)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.active ? 'Aktiv' : 'Blockiert'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.isAdmin ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Bearbeiten"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Löschen"
                              disabled={currentUser && currentUser.id === user.id}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {view === 'admin-players' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Spielerverwaltung</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nickname</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">E-Mail</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map(player => (
                      <tr key={player.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{player.nickname}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{player.email}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => togglePlayerStatus(player.id)}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                              playerStates[player.id]
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            {playerStates[player.id] ? (
                              <>
                                <Unlock className="w-4 h-4" />
                                Aktiv
                              </>
                            ) : (
                              <>
                                <Lock className="w-4 h-4" />
                                Blockiert
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {view === 'admin-events' && (
          <div className="space-y-6">
            <div className="flex gap-3">
              <button
                onClick={() => setShowEventModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
              >
                <Plus className="w-5 h-5" />
                Einzelnes Event
              </button>
              <button
                onClick={() => setShowSeriesModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
              >
                <Plus className="w-5 h-5" />
                Serientermine
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Datum</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Titel</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Zeit</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ort</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Zusagen</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {upcomingEvents.map(event => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{event.date}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{event.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{event.timeFrom} - {event.timeTo}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{event.location}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {acceptedCount(event)} + {guestCount(event)} Gäste
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditEventModal(event)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Bearbeiten"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteEvent(event.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Löschen"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {view === 'admin-utensils' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Utensilien-Verwaltung</h2>
              <button
                onClick={() => {
                  setEditingUtensil(null);
                  setNewUtensil({ name: '', icon: '', season: 'all' });
                  setShowUtensilModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
              >
                <Plus className="w-5 h-5" />
                Neues Utensil
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {utensils.map(utensil => (
                <div key={utensil.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{utensil.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{utensil.name}</h3>
                        <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${
                          utensil.season === 'summer' ? 'bg-yellow-100 text-yellow-800' :
                          utensil.season === 'winter' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {utensil.season === 'summer' ? 'Sommer' : utensil.season === 'winter' ? 'Winter' : 'Ganzjährig'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editUtensil(utensil)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteUtensil(utensil.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'admin-season' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Saison-Konfiguration</h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="max-w-2xl space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sommer-Saison</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start (Monat)</label>
                      <select
                        value={summerStart.month}
                        onChange={(e) => setSummerStart({...summerStart, month: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                          <option key={m} value={String(m).padStart(2, '0')}>
                            {new Date(2000, m - 1).toLocaleDateString('de-DE', { month: 'long' })}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start (Tag)</label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={parseInt(summerStart.day)}
                        onChange={(e) => setSummerStart({...summerStart, day: String(e.target.value).padStart(2, '0')})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ende (Monat)</label>
                      <select
                        value={summerEnd.month}
                        onChange={(e) => setSummerEnd({...summerEnd, month: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                          <option key={m} value={String(m).padStart(2, '0')}>
                            {new Date(2000, m - 1).toLocaleDateString('de-DE', { month: 'long' })}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ende (Tag)</label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={parseInt(summerEnd.day)}
                        onChange={(e) => setSummerEnd({...summerEnd, day: String(e.target.value).padStart(2, '0')})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Aktuell:</strong> Sommer vom {summerStart.day}.{summerStart.month}. bis {summerEnd.day}.{summerEnd.month}.
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Alle anderen Zeiträume gelten als Winter-Saison.
                  </p>
                </div>

                <button
                  onClick={updateSeasonConfig}
                  className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
                >
                  Speichern
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals - Benutzerverwaltung */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Neuen Benutzer erstellen</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nickname</label>
                <input
                  type="text"
                  value={newUser.nickname}
                  onChange={(e) => setNewUser({...newUser, nickname: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="z.B. MaxMustermann"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-Mail</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="max@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Passwort</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Mindestens 6 Zeichen"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowUserModal(false);
                    setNewUser({ nickname: '', email: '', password: '' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleCreateUser}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
                >
                  Erstellen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUserEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Benutzer bearbeiten</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nickname</label>
                <input
                  type="text"
                  value={editingUser.nickname}
                  onChange={(e) => setEditingUser({...editingUser, nickname: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-Mail</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Passwort</label>
                <input
                  type="password"
                  value={editingUser.password}
                  onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Neues Passwort eingeben"
                />
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingUser.active}
                    onChange={(e) => setEditingUser({...editingUser, active: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Benutzer aktiv</span>
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingUser.isAdmin || false}
                    onChange={(e) => setEditingUser({...editingUser, isAdmin: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Administrator-Rechte</span>
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowUserEditModal(false);
                    setEditingUser(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleUpdateUser}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Speichern
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weitere Modals (Event, Series, Utensil) - identisch zur vorherigen Version */}
      {showUtensilModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {editingUtensil ? 'Utensil bearbeiten' : 'Neues Utensil'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={newUtensil.name}
                  onChange={(e) => setNewUtensil({...newUtensil, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="z.B. Ball, Pumpe, ..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon wählen</label>
                <div className="grid grid-cols-8 gap-2 max-h-60 overflow-y-auto p-2 border border-gray-300 rounded-lg">
                  {availableIcons.map(icon => (
                    <button
                      key={icon}
                      onClick={() => setNewUtensil({...newUtensil, icon})}
                      className={`p-3 text-2xl rounded-lg transition-all ${
                        newUtensil.icon === icon
                          ? 'bg-purple-100 ring-2 ring-purple-500'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Saison</label>
                <select
                  value={newUtensil.season}
                  onChange={(e) => setNewUtensil({...newUtensil, season: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Ganzjährig</option>
                  <option value="summer">Sommer</option>
                  <option value="winter">Winter</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowUtensilModal(false);
                    setEditingUtensil(null);
                    setNewUtensil({ name: '', icon: '', season: 'all' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  Abbrechen
                </button>
                <button
                  onClick={addUtensil}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
                >
                  {editingUtensil ? 'Aktualisieren' : 'Erstellen'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSeriesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Serientermine erstellen</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titel</label>
                <input
                  type="text"
                  value={seriesEvent.title}
                  onChange={(e) => setSeriesEvent({...seriesEvent, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="z.B. Fussball"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Wochentag</label>
                <select
                  value={seriesEvent.weekday}
                  onChange={(e) => setSeriesEvent({...seriesEvent, weekday: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="1">Montag</option>
                  <option value="2">Dienstag</option>
                  <option value="3">Mittwoch</option>
                  <option value="4">Donnerstag</option>
                  <option value="5">Freitag</option>
                  <option value="6">Samstag</option>
                  <option value="0">Sonntag</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Startdatum</label>
                  <input
                    type="date"
                    value={seriesEvent.startDate}
                    onChange={(e) => setSeriesEvent({...seriesEvent, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Enddatum</label>
                  <input
                    type="date"
                    value={seriesEvent.endDate}
                    onChange={(e) => setSeriesEvent({...seriesEvent, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Von</label>
                  <input
                    type="text"
                    value={seriesEvent.timeFrom}
                    onChange={(e) => setSeriesEvent({...seriesEvent, timeFrom: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="HH:MM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bis</label>
                  <input
                    type="text"
                    value={seriesEvent.timeTo}
                    onChange={(e) => setSeriesEvent({...seriesEvent, timeTo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="HH:MM"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ort</label>
                <input
                  type="text"
                  value={seriesEvent.location}
                  onChange={(e) => setSeriesEvent({...seriesEvent, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="z.B. Turnhalle"
                />
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-sm text-gray-700">
                <p className="font-medium mb-1">Hinweis:</p>
                <p>Es werden automatisch alle gewählten Wochentage zwischen Start- und Enddatum erstellt.</p>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowSeriesModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  Abbrechen
                </button>
                <button
                  onClick={createSeriesEvents}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                >
                  Erstellen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Neues Event erstellen</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titel</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="z.B. Fussball"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Datum</label>
                <input
                  type="text"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="DD.MM.YYYY"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Von</label>
                  <input
                    type="text"
                    value={newEvent.timeFrom}
                    onChange={(e) => setNewEvent({...newEvent, timeFrom: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="HH:MM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bis</label>
                  <input
                    type="text"
                    value={newEvent.timeTo}
                    onChange={(e) => setNewEvent({...newEvent, timeTo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="HH:MM"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ort</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="z.B. Turnhalle"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEventModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  Abbrechen
                </button>
                <button
                  onClick={createEvent}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
                >
                  Erstellen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAdminEventEditModal && editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Event bearbeiten</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titel</label>
                <input
                  type="text"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Datum</label>
                <input
                  type="text"
                  value={editingEvent.date}
                  onChange={(e) => setEditingEvent({...editingEvent, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="DD.MM.YYYY"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Von</label>
                  <input
                    type="text"
                    value={editingEvent.timeFrom}
                    onChange={(e) => setEditingEvent({...editingEvent, timeFrom: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="HH:MM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bis</label>
                  <input
                    type="text"
                    value={editingEvent.timeTo}
                    onChange={(e) => setEditingEvent({...editingEvent, timeTo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="HH:MM"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ort</label>
                <input
                  type="text"
                  value={editingEvent.location}
                  onChange={(e) => setEditingEvent({...editingEvent, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAdminEventEditModal(false);
                    setEditingEvent(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  Abbrechen
                </button>
                <button
                  onClick={saveEditedEvent}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Speichern
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagerPWA;
