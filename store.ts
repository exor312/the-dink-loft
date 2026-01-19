
import { useState, useEffect } from 'react';
import { 
  Booking, 
  Announcement, 
  Event, 
  Rates, 
  User, 
  BookingStatus,
  CourtId
} from './types';
import { INITIAL_RATES } from './constants';
import { supabase } from './supabase';

const mapBooking = (db: any): Booking => ({
  id: db.id,
  userId: db.user_id,
  userName: db.user_name,
  courtId: db.court_id as CourtId,
  date: db.date,
  startTime: db.start_time,
  duration: db.duration,
  rentals: db.rentals || [],
  totalPrice: db.total_price,
  status: db.status as BookingStatus,
  createdAt: db.created_at
});

const mapEvent = (db: any): Event => ({
  id: db.id,
  title: db.title,
  description: db.description,
  date: db.date,
  time: db.time,
  // Fix: Property name must match Event interface definition 'registrationLink'
  registrationLink: db.registration_link,
  imageUrl: db.image_url
});

export const useStore = () => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [rates, setRates] = useState<Rates>(INITIAL_RATES);

  const syncUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data) {
      setCurrentUser({ 
        id: data.id, 
        email: data.email, 
        name: data.name, 
        phoneNumber: data.phone_number,
        isAdmin: data.is_admin 
      });
    } else if (error) {
      console.error("Profile sync error:", error.message);
    }
  };

  const fetchData = async () => {
    try {
      const [
        { data: bookingData, error: bErr },
        { data: annData, error: aErr },
        { data: eventData, error: eErr },
        { data: rateData, error: rErr }
      ] = await Promise.all([
        supabase.from('bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('announcements').select('*').order('date', { ascending: false }),
        supabase.from('events').select('*').order('date', { ascending: true }),
        supabase.from('rates').select('*').eq('id', 'config').single()
      ]);

      if (bErr) console.error("Bookings fetch error:", bErr);
      if (aErr) console.error("Announcements fetch error:", aErr);
      if (eErr) console.error("Events fetch error:", eErr);
      if (rErr) console.error("Rates fetch error:", rErr);

      if (bookingData) setBookings(bookingData.map(mapBooking));
      if (annData) setAnnouncements(annData as any);
      if (eventData) setEvents(eventData.map(mapEvent));
      if (rateData) setRates({ 
        courtPerHour: rateData.court_per_hour, 
        rentals: rateData.rentals 
      });
    } catch (err) {
      console.error("Data fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();

    const handleAuthState = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await syncUserProfile(session.user.id);
      }
      setLoading(false);
    };
    handleAuthState();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user) {
        await syncUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
      }
    });

    const channel = supabase
      .channel('db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rates' }, fetchData)
      .subscribe();

    return () => { 
      supabase.removeChannel(channel);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password?: string) => {
    if (!password) return false;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("Login error:", error.message);
      return false;
    }
    if (data.user) {
      await syncUserProfile(data.user.id);
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, phone: string, password?: string) => {
    if (!password) return false;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, phone }
      }
    });

    if (authError) {
      throw authError;
    }

    if (authData.user) {
      const { error: profileError } = await supabase.from('users').upsert({ 
        id: authData.user.id,
        name, 
        email, 
        phone_number: phone, 
        is_admin: false 
      });

      if (profileError) console.error("Profile sync error:", profileError.message);
      
      if (authData.session) {
        await syncUserProfile(authData.user.id);
      }
      return true;
    }
    return false;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  const addBooking = async (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt'>) => {
    const { data, error } = await supabase.from('bookings').insert([{
      user_id: bookingData.userId,
      user_name: bookingData.userName,
      court_id: bookingData.courtId,
      date: bookingData.date,
      start_time: bookingData.startTime,
      duration: bookingData.duration,
      rentals: bookingData.rentals,
      total_price: bookingData.totalPrice,
      status: BookingStatus.PENDING
    }]).select().single();

    if (error) {
      console.error("Add booking error:", error.message);
      return null;
    }
    await fetchData();
    return data ? mapBooking(data) : null;
  };

  const updateBookingStatus = async (id: string, status: BookingStatus) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id);
    
    if (error) {
      console.error("Update status error:", error.message);
      alert(`Update failed: ${error.message}. Ensure you have Admin permissions in Supabase RLS policies.`);
      throw error;
    } else {
      await fetchData(); 
    }
  };

  const updateRates = async (newRates: Rates) => {
    const { error } = await supabase.from('rates').update({ 
      court_per_hour: newRates.courtPerHour, 
      rentals: newRates.rentals 
    }).eq('id', 'config');
    if (error) {
      console.error("Update rates error:", error.message);
      alert(`Update rates failed: ${error.message}`);
    } else {
      await fetchData();
      alert("Facility settings updated successfully.");
    }
  };

  const addAnnouncement = async (ann: Omit<Announcement, 'id' | 'date'>) => {
    const { error } = await supabase.from('announcements').insert([{
      title: ann.title,
      content: ann.content,
      date: new Date().toISOString().split('T')[0]
    }]);
    if (error) console.error("Add ann error:", error.message);
    await fetchData();
  };

  const deleteAnnouncement = async (id: string) => {
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (error) console.error("Delete ann error:", error.message);
    await fetchData();
  };

  const addEvent = async (evt: Omit<Event, 'id'>) => {
    const { error } = await supabase.from('events').insert([{
      title: evt.title,
      description: evt.description,
      date: evt.date,
      time: evt.time,
      registration_link: evt.registrationLink,
      image_url: evt.imageUrl
    }]);
    if (error) console.error("Add event error:", error.message);
    await fetchData();
  };

  const deleteEvent = async (id: string) => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) console.error("Delete event error:", error.message);
    await fetchData();
  };

  const isCourtAvailable = (courtId: CourtId, date: string, startTime: number, duration: number) => {
    return !bookings.some(b => 
      b.courtId === courtId && 
      b.date === date && 
      b.status !== BookingStatus.CANCELLED &&
      ((startTime >= b.startTime && startTime < b.startTime + b.duration) ||
       (startTime + duration > b.startTime && startTime + duration <= b.startTime + b.duration) ||
       (startTime <= b.startTime && startTime + duration >= b.startTime + b.duration))
    );
  };

  return {
    loading, currentUser, bookings, announcements, events, rates,
    login, signup, logout, addBooking, updateBookingStatus, updateRates,
    addAnnouncement, deleteAnnouncement, addEvent, deleteEvent, isCourtAvailable
  };
};
