import { supabase } from './supabaseClient'

// ================================================
// EVENTS CRUD OPERATIONEN
// ================================================

/**
 * Event erstellen
 */
export const createEvent = async (eventData) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .insert([
        {
          title: eventData.title,
          description: eventData.description,
          location: eventData.location,
          start_date: eventData.startDate,
          end_date: eventData.endDate,
          category: eventData.category,
          user_id: (await supabase.auth.getUser()).data.user.id
        }
      ])
      .select()

    if (error) throw error
    return { data: data[0], error: null }
  } catch (error) {
    console.error('Error creating event:', error)
    return { data: null, error }
  }
}

/**
 * Alle Events abrufen
 */
export const getAllEvents = async () => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          email,
          avatar_url
        )
      `)
      .order('start_date', { ascending: true })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching events:', error)
    return { data: null, error }
  }
}

/**
 * Events des aktuellen Users abrufen
 */
export const getUserEvents = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id)
      .order('start_date', { ascending: true })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching user events:', error)
    return { data: null, error }
  }
}

/**
 * Einzelnes Event abrufen
 */
export const getEvent = async (eventId) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          email,
          avatar_url
        ),
        event_participants (
          id,
          status,
          profiles:user_id (
            id,
            name,
            email,
            avatar_url
          )
        )
      `)
      .eq('id', eventId)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching event:', error)
    return { data: null, error }
  }
}

/**
 * Event aktualisieren
 */
export const updateEvent = async (eventId, updates) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', eventId)
      .select()

    if (error) throw error
    return { data: data[0], error: null }
  } catch (error) {
    console.error('Error updating event:', error)
    return { data: null, error }
  }
}

/**
 * Event löschen
 */
export const deleteEvent = async (eventId) => {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId)

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error deleting event:', error)
    return { error }
  }
}

// ================================================
// EVENT PARTICIPANTS OPERATIONEN
// ================================================

/**
 * Teilnehmer zu Event hinzufügen
 */
export const addParticipant = async (eventId, userId) => {
  try {
    const { data, error } = await supabase
      .from('event_participants')
      .insert([
        {
          event_id: eventId,
          user_id: userId,
          status: 'pending'
        }
      ])
      .select()

    if (error) throw error
    return { data: data[0], error: null }
  } catch (error) {
    console.error('Error adding participant:', error)
    return { data: null, error }
  }
}

/**
 * Teilnahme-Status aktualisieren
 */
export const updateParticipantStatus = async (participantId, status) => {
  try {
    const { data, error } = await supabase
      .from('event_participants')
      .update({ status })
      .eq('id', participantId)
      .select()

    if (error) throw error
    return { data: data[0], error: null }
  } catch (error) {
    console.error('Error updating participant status:', error)
    return { data: null, error }
  }
}

/**
 * Teilnehmer entfernen
 */
export const removeParticipant = async (participantId) => {
  try {
    const { error } = await supabase
      .from('event_participants')
      .delete()
      .eq('id', participantId)

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error removing participant:', error)
    return { error }
  }
}

// ================================================
// USER PROFILE OPERATIONEN
// ================================================

/**
 * User-Profil abrufen
 */
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return { data: null, error }
  }
}

/**
 * User-Profil aktualisieren
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()

    if (error) throw error
    return { data: data[0], error: null }
  } catch (error) {
    console.error('Error updating user profile:', error)
    return { data: null, error }
  }
}

// ================================================
// REALTIME SUBSCRIPTIONS
// ================================================

/**
 * Realtime Updates für Events abonnieren
 */
export const subscribeToEvents = (callback) => {
  const channel = supabase
    .channel('events-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'events'
      },
      callback
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

/**
 * Beispiel-Verwendung:
 * 
 * useEffect(() => {
 *   const unsubscribe = subscribeToEvents((payload) => {
 *     console.log('Event changed:', payload)
 *     // Update UI accordingly
 *   })
 *   
 *   return () => unsubscribe()
 * }, [])
 */
