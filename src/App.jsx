import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, Check, X, MessageSquare, UserPlus, Settings, LogOut, Plus, Lock, Unlock } from 'lucide-react';

const EventManagerPWA = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [view, setView] = useState('login');
  const [userViewMode, setUserViewMode] = useState('grid');

  const players = [
    { id: 1, nickname: 'Wacki', email: 'max@example.com', active: true },
    { id: 2, nickname: 'Gruppenleiter', email: 'admin@example.com', active: true, isAdmin: true },
    { id: 3, nickname: 'Andres', email: 'andres@example.com', active: true },
    { id: 4, nickname: 'Casanova', email: 'casanova@example.com', active: true },
    { id: 5, nickname: 'Cesar', email: 'cesar@example.com', active: true },
    { id: 6, nickname: 'Fabri', email: 'fabri@example.com', active: true },
    { id: 7, nickname: 'Sergio', email: 'sergio@example.com', active: false },
    { id: 8, nickname: 'Nikola', email: 'nikola@example.com', active: true },
  ];

  const [playerStates, setPlayerStates] = useState(
    players.reduce((acc, player) => {
      acc[player.id] = player.active;
      return acc;
    }, {})
  );

  const togglePlayerStatus = (playerId) => {
    setPlayerStates(prev => ({
      ...prev,
      [playerId]: !prev[playerId]
    }));
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
        4: { status: 'declined', items: [], guests: 0, comment: '' },
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

  const handleLogin = () => {
    const user = players.find(p => p.email === loginEmail);
    if (user && playerStates[user.id]) {
      setCurrentUser(user);
      setView(user.isAdmin ? 'admin' : 'user');
    } else {
      alert('Login fehlgeschlagen oder Benutzer blockiert');
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

    let eventId = events.length + 1;
    
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
    const event = {
      id: events.length + 1,
      ...newEvent,
      responses: {}
    };
    setEvents([...events, event]);
    setShowEventModal(false);
    setNewEvent({ title: '', date: '', timeFrom: '', timeTo: '', location: '' });
  };

  const createUtensil = () => {
    if (!newUtensil.name || !newUtensil.icon) {
      alert('Bitte Name und Icon eingeben');
      return;
    }
    const utensil = {
      id: Date.now().toString(),
      ...newUtensil
    };
    setUtensils([...utensils, utensil]);
    setShowUtensilModal(false);
    setNewUtensil({ name: '', icon: '', season: 'all' });
  };

  const openEventEditModal = (event) => {
    setSelectedEventForEdit(event);
    setShowEventEditModal(true);
  };

  const saveEventResponse = () => {
    setShowEventEditModal(false);
    setSelectedEventForEdit(null);
  };

  const updateUtensilSeason = (utensilId, newSeason) => {
    setUtensils(utensils.map(u => u.id === utensilId ? {...u, season: newSeason} : u));
  };

  const updateUtensilIcon = (utensilId, newIcon) => {
    setUtensils(utensils.map(u => u.id === utensilId ? {...u, icon: newIcon} : u));
  };

  const deleteEvent = (eventId) => {
    if (window.confirm('Event wirklich löschen?')) {
      setEvents(events.filter(e => e.id !== eventId));
      alert('Event wurde gelöscht');
    }
  };

  const editEvent = (event) => {
    setEditingEvent({...event});
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
    alert('Event wurde aktualisiert');
  };

  const deleteUtensil = (utensilId) => {
    if (window.confirm('Utensil wirklich löschen?')) {
      setUtensils(utensils.filter(u => u.id !== utensilId));
    }
  };

  const updateResponse = (eventId, status) => {
    setEvents(events.map(e => {
      if (e.id === eventId) {
        return {
          ...e,
          responses: {
            ...e.responses,
            [currentUser.id]: {
              status,
              items: e.responses[currentUser.id]?.items || [],
              guests: e.responses[currentUser.id]?.guests || 0,
              comment: e.responses[currentUser.id]?.comment || ''
            }
          }
        };
      }
      return e;
    }));
  };

  const toggleUtensil = (eventId, utensilId) => {
    setEvents(events.map(e => {
      if (e.id === eventId) {
        const response = e.responses[currentUser.id] || { status: null, items: [], guests: 0, comment: '' };
        const items = response.items.includes(utensilId)
          ? response.items.filter(i => i !== utensilId)
          : [...response.items, utensilId];
        return {
          ...e,
          responses: {
            ...e.responses,
            [currentUser.id]: { ...response, items }
          }
        };
      }
      return e;
    }));
  };

  const updateGuests = (eventId, guests) => {
    setEvents(events.map(e => {
      if (e.id === eventId) {
        const response = e.responses[currentUser.id] || { status: null, items: [], guests: 0, comment: '' };
        return {
          ...e,
          responses: {
            ...e.responses,
            [currentUser.id]: { ...response, guests: parseInt(guests) || 0 }
          }
        };
      }
      return e;
    }));
  };

  const updateComment = (eventId, comment) => {
    setEvents(events.map(e => {
      if (e.id === eventId) {
        const response = e.responses[currentUser.id] || { status: null, items: [], guests: 0, comment: '' };
        return {
          ...e,
          responses: {
            ...e.responses,
            [currentUser.id]: { ...response, comment }
          }
        };
      }
      return e;
    }));
  };

  const getTotalParticipants = (event) => {
    return Object.values(event.responses).filter(r => r.status === 'accepted').length;
  };

  const getTotalGuests = (event) => {
    return Object.values(event.responses).reduce((sum, r) => sum + (r.guests || 0), 0);
  };

  const getTotalWithGuests = (event) => {
    return getTotalParticipants(event) + getTotalGuests(event);
  };

  const getUtensilsForEvent = (event) => {
    const items = {};
    Object.values(event.responses).forEach(response => {
      response.items?.forEach(itemId => {
        items[itemId] = (items[itemId] || 0) + 1;
      });
    });
    return items;
  };

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <Calendar className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">KTV AH Fussball</h1>
            <p className="text-sm text-gray-600">Event Manager</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="ihre.email@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Passwort</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700"
            >
              Anmelden
            </button>
          </div>

          <div className="mt-6 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
            <p className="font-medium mb-2">Test-Zugänge:</p>
            <p>User: max@example.com</p>
            <p>Admin: admin@example.com</p>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'user') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-indigo-600 text-white p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-bold">KTV AH Fussball</h1>
                <p className="text-sm text-indigo-200">Willkommen, {currentUser.nickname}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex bg-indigo-700 rounded-lg p-1">
                <button
                  onClick={() => setUserViewMode('grid')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    userViewMode === 'grid' ? 'bg-white text-indigo-600' : 'text-white'
                  }`}
                >
                  Übersicht
                </button>
                <button
                  onClick={() => setUserViewMode('detail')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    userViewMode === 'detail' ? 'bg-white text-indigo-600' : 'text-white'
                  }`}
                >
                  Details
                </button>
              </div>
              <button onClick={handleLogout} className="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-lg">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {userViewMode === 'grid' ? (
          <div className="max-w-7xl mx-auto p-4 overflow-x-auto">
            <div className="bg-white rounded-xl shadow-md">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <th className="sticky left-0 bg-indigo-600 px-4 py-3 text-left min-w-[150px]">Spieler</th>
                    {events.slice(0, 10).map(event => (
                      <th key={event.id} className="px-2 py-3 text-center min-w-[120px]">
                        <div className="text-sm">{event.title}</div>
                        <div className="text-xs mt-1">{event.date}</div>
                        <div className="text-xs">{event.timeFrom}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {players.filter(p => playerStates[p.id]).map((player, idx) => (
                    <tr key={player.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="sticky left-0 px-4 py-3 font-medium border-r" style={{backgroundColor: idx % 2 === 0 ? '#f9fafb' : 'white'}}>
                        {player.id === currentUser.id && '★ '}
                        {player.nickname}
                      </td>
                      {events.slice(0, 10).map(event => {
                        const response = event.responses[player.id];
                        return (
                          <td key={event.id} className="px-2 py-2 text-center">
                            {response ? (
                              <div className={`rounded p-2 ${response.status === 'accepted' ? 'bg-green-100' : 'bg-red-100'}`}>
                                {response.status === 'accepted' ? (
                                  <div>
                                    <Check className="w-5 h-5 text-green-700 mx-auto" />
                                    {response.items && response.items.length > 0 && (
                                      <div className="flex justify-center gap-1 text-xs mt-1">
                                        {response.items.map(itemId => {
                                          const u = utensils.find(ut => ut.id === itemId);
                                          return u ? <span key={itemId}>{u.icon}</span> : null;
                                        })}
                                      </div>
                                    )}
                                    {response.guests > 0 && <div className="text-xs font-bold">+{response.guests}</div>}
                                    {response.comment && <MessageSquare className="w-4 h-4 text-blue-600 mx-auto mt-1" />}
                                  </div>
                                ) : (
                                  <X className="w-5 h-5 text-red-700 mx-auto" />
                                )}
                              </div>
                            ) : (
                              <div className="text-gray-300">-</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr className="bg-indigo-100 font-bold">
                    <td className="sticky left-0 bg-indigo-100 px-4 py-3">Total</td>
                    {events.slice(0, 10).map(event => (
                      <td key={event.id} className="px-2 py-3 text-center">
                        <div className="text-lg text-indigo-700">{getTotalWithGuests(event)}</div>
                        <div className="text-xs text-indigo-600">
                          {getTotalParticipants(event)} 
                          {getTotalGuests(event) > 0 && ` +${getTotalGuests(event)}`}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-3 space-y-3">
            {events.map(event => {
              const userResponse = event.responses[currentUser.id];
              const totalParticipants = getTotalParticipants(event);
              const totalGuests = getTotalGuests(event);

              return (
                <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold">{event.title}</h2>
                        <div className="flex gap-3 text-sm mt-2">
                          <span>{event.date}</span>
                          <span>{event.timeFrom} - {event.timeTo}</span>
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg inline-block">
                          <div className="text-3xl font-bold">{getTotalWithGuests(event)}</div>
                          <div className="text-xs">Personen</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex gap-3 mb-4">
                      <button
                        onClick={() => updateResponse(event.id, 'accepted')}
                        className={`flex-1 py-3 rounded-lg font-medium ${
                          userResponse?.status === 'accepted' ? 'bg-green-500 text-white' : 'bg-gray-100'
                        }`}
                      >
                        <Check className="w-5 h-5 inline mr-2" />
                        Zusage
                      </button>
                      <button
                        onClick={() => updateResponse(event.id, 'declined')}
                        className={`flex-1 py-3 rounded-lg font-medium ${
                          userResponse?.status === 'declined' ? 'bg-red-500 text-white' : 'bg-gray-100'
                        }`}
                      >
                        <X className="w-5 h-5 inline mr-2" />
                        Absage
                      </button>
                    </div>

                    {userResponse?.status === 'accepted' && (
                      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium mb-2">Ich bringe mit:</label>
                          <div className="flex gap-2 flex-wrap">
                            {getAvailableUtensils(event.date).map(utensil => (
                              <button
                                key={utensil.id}
                                onClick={() => toggleUtensil(event.id, utensil.id)}
                                className={`px-4 py-2 rounded-lg ${
                                  userResponse.items?.includes(utensil.id) ? 'bg-indigo-500 text-white' : 'bg-white border'
                                }`}
                              >
                                {utensil.icon} {utensil.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Gäste</label>
                            <input
                              type="number"
                              min="0"
                              value={userResponse.guests || 0}
                              onChange={(e) => updateGuests(event.id, e.target.value)}
                              className="w-full px-3 py-2 border rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Kommentar</label>
                            <input
                              type="text"
                              value={userResponse.comment || ''}
                              onChange={(e) => updateComment(event.id, e.target.value)}
                              className="w-full px-3 py-2 border rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showEventEditModal && selectedEventForEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md max-h-screen overflow-y-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedEventForEdit.title}</h3>
              <p className="text-gray-600 mb-4">{selectedEventForEdit.date} • {selectedEventForEdit.timeFrom} - {selectedEventForEdit.timeTo}</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deine Antwort</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => updateResponse(selectedEventForEdit.id, 'accepted')}
                      className={`flex-1 py-3 rounded-lg font-medium ${
                        selectedEventForEdit.responses[currentUser.id]?.status === 'accepted'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100'
                      }`}
                    >
                      <Check className="w-5 h-5 inline mr-2" />
                      Zusage
                    </button>
                    <button
                      onClick={() => updateResponse(selectedEventForEdit.id, 'declined')}
                      className={`flex-1 py-3 rounded-lg font-medium ${
                        selectedEventForEdit.responses[currentUser.id]?.status === 'declined'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100'
                      }`}
                    >
                      <X className="w-5 h-5 inline mr-2" />
                      Absage
                    </button>
                  </div>
                </div>

                {selectedEventForEdit.responses[currentUser.id]?.status === 'accepted' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ich bringe mit:</label>
                      <div className="flex gap-2 flex-wrap">
                        {getAvailableUtensils(selectedEventForEdit.date).map(utensil => (
                          <button
                            key={utensil.id}
                            onClick={() => toggleUtensil(selectedEventForEdit.id, utensil.id)}
                            className={`px-4 py-2 rounded-lg ${
                              selectedEventForEdit.responses[currentUser.id]?.items?.includes(utensil.id)
                                ? 'bg-indigo-500 text-white'
                                : 'bg-white border'
                            }`}
                          >
                            {utensil.icon} {utensil.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gäste</label>
                      <input
                        type="number"
                        min="0"
                        value={selectedEventForEdit.responses[currentUser.id]?.guests || 0}
                        onChange={(e) => updateGuests(selectedEventForEdit.id, e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Kommentar</label>
                      <textarea
                        value={selectedEventForEdit.responses[currentUser.id]?.comment || ''}
                        onChange={(e) => updateComment(selectedEventForEdit.id, e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        rows="3"
                        placeholder="Optional..."
                      />
                    </div>
                  </>
                )}

                <button
                  onClick={saveEventResponse}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                >
                  Fertig
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-purple-600 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-sm text-purple-200">KTV AH Fussball Verwaltung</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            Abmelden
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Spielerverwaltung</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Spitzname</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Aktion</th>
                </tr>
              </thead>
              <tbody>
                {players.map(player => (
                  <tr key={player.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{player.nickname}</td>
                    <td className="py-3 px-4 text-gray-600">{player.email}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => togglePlayerStatus(player.id)}
                        className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                          playerStates[player.id] 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-500' 
                            : 'bg-red-100 text-red-700 hover:bg-red-200 border-2 border-red-500'
                        }`}
                      >
                        {playerStates[player.id] ? (
                          <>
                            <Check className="w-4 h-4" />
                            Aktiv
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4" />
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

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Event-Verwaltung</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSeriesModal(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700"
              >
                <Calendar className="w-5 h-5" />
                Serientermine
              </button>
              <button
                onClick={() => setShowEventModal(true)}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700"
              >
                <Plus className="w-5 h-5" />
                Einzeltermin
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {events.map(event => {
              const totalParticipants = getTotalParticipants(event);
              const totalGuests = getTotalGuests(event);
              const totalWithGuests = getTotalWithGuests(event);
              const utensilsCount = getUtensilsForEvent(event);

              return (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <h3 className="font-bold text-lg">{event.title}</h3>
                        <span className="text-gray-600">{event.date}</span>
                        <span className="text-gray-600">{event.timeFrom} - {event.timeTo}</span>
                        <span className="text-gray-600">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          {totalWithGuests} Personen ({totalParticipants} Spieler
                          {totalGuests > 0 && ` + ${totalGuests} Gäste`})
                        </span>
                        {Object.keys(utensilsCount).length > 0 && (
                          <span className="text-sm text-gray-600">
                            Utensilien: {Object.entries(utensilsCount).map(([id, count]) => {
                              const utensil = utensils.find(u => u.id === id);
                              return utensil ? `${utensil.icon} ${count}` : '';
                            }).join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => editEvent(event)}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium"
                      >
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium"
                      >
                        Löschen
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Utensilien-Verwaltung</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSeasonModal(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
              >
                <Calendar className="w-5 h-5" />
                Saison definieren
              </button>
              <button
                onClick={() => setShowUtensilModal(true)}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700"
              >
                <Plus className="w-5 h-5" />
                Neues Utensil
              </button>
            </div>
          </div>

          <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
            <p><strong>Aktuelle Saison-Einstellung:</strong></p>
            <p>☀️ Sommer: {summerStart.day}.{summerStart.month}. bis {summerEnd.day}.{summerEnd.month}.</p>
            <p>❄️ Winter: Alle anderen Daten</p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span>🌍</span> Ganzjährig
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {utensils.filter(u => u.season === 'all').map(utensil => (
                  <div key={utensil.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <select
                          value={utensil.icon}
                          onChange={(e) => updateUtensilIcon(utensil.id, e.target.value)}
                          className="text-2xl bg-transparent border-none cursor-pointer"
                        >
                          {availableIcons.map(icon => (
                            <option key={icon} value={icon}>{icon}</option>
                          ))}
                        </select>
                        <span className="font-medium text-gray-900">{utensil.name}</span>
                      </div>
                      <button
                        onClick={() => deleteUtensil(utensil.id)}
                        className="text-red-600 hover:bg-red-50 p-1 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <select
                      value={utensil.season}
                      onChange={(e) => updateUtensilSeason(utensil.id, e.target.value)}
                      className="w-full text-xs px-2 py-1 border rounded"
                    >
                      <option value="all">🌍 Ganzjährig</option>
                      <option value="summer">☀️ Nur Sommer</option>
                      <option value="winter">❄️ Nur Winter</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span>☀️</span> Sommer ({summerStart.day}.{summerStart.month}. - {summerEnd.day}.{summerEnd.month}.)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {utensils.filter(u => u.season === 'summer').map(utensil => (
                  <div key={utensil.id} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <select
                          value={utensil.icon}
                          onChange={(e) => updateUtensilIcon(utensil.id, e.target.value)}
                          className="text-2xl bg-transparent border-none cursor-pointer"
                        >
                          {availableIcons.map(icon => (
                            <option key={icon} value={icon}>{icon}</option>
                          ))}
                        </select>
                        <span className="font-medium text-gray-900">{utensil.name}</span>
                      </div>
                      <button
                        onClick={() => deleteUtensil(utensil.id)}
                        className="text-red-600 hover:bg-red-50 p-1 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <select
                      value={utensil.season}
                      onChange={(e) => updateUtensilSeason(utensil.id, e.target.value)}
                      className="w-full text-xs px-2 py-1 border rounded"
                    >
                      <option value="all">🌍 Ganzjährig</option>
                      <option value="summer">☀️ Nur Sommer</option>
                      <option value="winter">❄️ Nur Winter</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span>❄️</span> Winter (nicht {summerStart.day}.{summerStart.month}. - {summerEnd.day}.{summerEnd.month}.)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {utensils.filter(u => u.season === 'winter').map(utensil => (
                  <div key={utensil.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <select
                          value={utensil.icon}
                          onChange={(e) => updateUtensilIcon(utensil.id, e.target.value)}
                          className="text-2xl bg-transparent border-none cursor-pointer"
                        >
                          {availableIcons.map(icon => (
                            <option key={icon} value={icon}>{icon}</option>
                          ))}
                        </select>
                        <span className="font-medium text-gray-900">{utensil.name}</span>
                      </div>
                      <button
                        onClick={() => deleteUtensil(utensil.id)}
                        className="text-red-600 hover:bg-red-50 p-1 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <select
                      value={utensil.season}
                      onChange={(e) => updateUtensilSeason(utensil.id, e.target.value)}
                      className="w-full text-xs px-2 py-1 border rounded"
                    >
                      <option value="all">🌍 Ganzjährig</option>
                      <option value="summer">☀️ Nur Sommer</option>
                      <option value="winter">❄️ Nur Winter</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSeasonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Saison definieren</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">☀️ Sommer Start</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={summerStart.day}
                    onChange={(e) => setSummerStart({...summerStart, day: e.target.value})}
                    className="px-3 py-2 border rounded-lg"
                  >
                    {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                      <option key={d} value={String(d).padStart(2, '0')}>{d}.</option>
                    ))}
                  </select>
                  <select
                    value={summerStart.month}
                    onChange={(e) => setSummerStart({...summerStart, month: e.target.value})}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="01">Januar</option>
                    <option value="02">Februar</option>
                    <option value="03">März</option>
                    <option value="04">April</option>
                    <option value="05">Mai</option>
                    <option value="06">Juni</option>
                    <option value="07">Juli</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">Oktober</option>
                    <option value="11">November</option>
                    <option value="12">Dezember</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">☀️ Sommer Ende</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={summerEnd.day}
                    onChange={(e) => setSummerEnd({...summerEnd, day: e.target.value})}
                    className="px-3 py-2 border rounded-lg"
                  >
                    {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                      <option key={d} value={String(d).padStart(2, '0')}>{d}.</option>
                    ))}
                  </select>
                  <select
                    value={summerEnd.month}
                    onChange={(e) => setSummerEnd({...summerEnd, month: e.target.value})}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="01">Januar</option>
                    <option value="02">Februar</option>
                    <option value="03">März</option>
                    <option value="04">April</option>
                    <option value="05">Mai</option>
                    <option value="06">Juni</option>
                    <option value="07">Juli</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">Oktober</option>
                    <option value="11">November</option>
                    <option value="12">Dezember</option>
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg text-sm text-gray-700">
                <p className="font-medium mb-1">Hinweis:</p>
                <p>Alle Daten außerhalb dieses Zeitraums gelten als Winter.</p>
              </div>

              <button
                onClick={() => setShowSeasonModal(false)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}

      {showUtensilModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Neues Utensil erstellen</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={newUtensil.name}
                  onChange={(e) => setNewUtensil({...newUtensil, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="z.B. Trinkflaschen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon auswählen</label>
                <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
                  {availableIcons.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setNewUtensil({...newUtensil, icon})}
                      className={`text-2xl p-2 rounded hover:bg-gray-100 transition-colors ${
                        newUtensil.icon === icon ? 'bg-purple-100 ring-2 ring-purple-500' : ''
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                {newUtensil.icon && (
                  <p className="text-sm text-gray-600 mt-2">
                    Gewählt: <span className="text-2xl">{newUtensil.icon}</span>
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Saison</label>
                <select
                  value={newUtensil.season}
                  onChange={(e) => setNewUtensil({...newUtensil, season: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">🌍 Ganzjährig</option>
                  <option value="summer">☀️ Sommer</option>
                  <option value="winter">❄️ Winter</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowUtensilModal(false);
                    setNewUtensil({ name: '', icon: '', season: 'all' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  Abbrechen
                </button>
                <button
                  onClick={createUtensil}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
                >
                  Erstellen
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Von (Datum)</label>
                <input
                  type="date"
                  value={seriesEvent.startDate}
                  onChange={(e) => setSeriesEvent({...seriesEvent, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bis (Datum)</label>
                <input
                  type="date"
                  value={seriesEvent.endDate}
                  onChange={(e) => setSeriesEvent({...seriesEvent, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
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
