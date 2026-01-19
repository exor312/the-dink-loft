
import React, { useState } from 'react';
import { Booking, BookingStatus, Rates, Announcement, Event } from '../types';
import { Check, X, Plus, Trash, Settings, Calendar, Bell, Trophy, DollarSign, Loader2, AlertCircle, RotateCcw } from 'lucide-react';

interface AdminDashboardProps {
  bookings: Booking[];
  rates: Rates;
  announcements: Announcement[];
  events: Event[];
  updateBookingStatus: (id: string, status: BookingStatus) => Promise<void>;
  updateRates: (rates: Rates) => void;
  addAnnouncement: (ann: Omit<Announcement, 'id' | 'date'>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  addEvent: (evt: Omit<Event, 'id'>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  bookings, rates, announcements, events,
  updateBookingStatus, updateRates, addAnnouncement, deleteAnnouncement, addEvent, deleteEvent
}) => {
  const [tab, setTab] = useState<'bookings' | 'content' | 'rates'>('bookings');
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Forms state
  const [showAnnForm, setShowAnnForm] = useState(false);
  const [newAnn, setNewAnn] = useState({ title: '', content: '' });
  
  const [showEvtForm, setShowEvtForm] = useState(false);
  const [newEvt, setNewEvt] = useState({ 
    title: '', description: '', date: '', time: '', registrationLink: '', imageUrl: '' 
  });

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    setProcessingId(id);
    try {
      await updateBookingStatus(id, status);
    } catch (err) {
      console.error("Admin action failed:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    await addAnnouncement(newAnn);
    setNewAnn({ title: '', content: '' });
    setShowAnnForm(false);
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    await addEvent(newEvt);
    setNewEvt({ title: '', description: '', date: '', time: '', registrationLink: '', imageUrl: '' });
    setShowEvtForm(false);
  };

  // Pending bookings first
  const sortedBookings = [...bookings].sort((a, b) => {
    if (a.status === BookingStatus.PENDING && b.status !== BookingStatus.PENDING) return -1;
    if (a.status !== BookingStatus.PENDING && b.status === BookingStatus.PENDING) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter">Admin Dashboard</h1>
        <div className="flex bg-gray-100 p-1 rounded-2xl mt-6 md:mt-0">
          <button 
            onClick={() => setTab('bookings')}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center space-x-2 ${
              tab === 'bookings' ? 'bg-white shadow-md text-[#CC4E22]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar size={18} />
            <span>Bookings</span>
          </button>
          <button 
            onClick={() => setTab('content')}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center space-x-2 ${
              tab === 'content' ? 'bg-white shadow-md text-[#CC4E22]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Bell size={18} />
            <span>Content</span>
          </button>
          <button 
            onClick={() => setTab('rates')}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center space-x-2 ${
              tab === 'rates' ? 'bg-white shadow-md text-[#CC4E22]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Settings size={18} />
            <span>Management</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden min-h-[600px]">
        {tab === 'bookings' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black italic uppercase">Reservations</h2>
              <div className="flex items-center space-x-2 text-xs font-bold text-gray-400">
                <AlertCircle size={14} />
                <span>Manage player court bookings</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-4 font-bold uppercase text-xs text-gray-400 tracking-widest">Player / ID</th>
                    <th className="pb-4 font-bold uppercase text-xs text-gray-400 tracking-widest">Court / Time</th>
                    <th className="pb-4 font-bold uppercase text-xs text-gray-400 tracking-widest">Amount</th>
                    <th className="pb-4 font-bold uppercase text-xs text-gray-400 tracking-widest">Status</th>
                    <th className="pb-4 font-bold uppercase text-xs text-gray-400 tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sortedBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-6">
                        <div className="font-bold text-gray-900">{b.userName}</div>
                        <div className="text-[10px] font-medium text-gray-400 font-mono tracking-tight uppercase">{b.id}</div>
                      </td>
                      <td className="py-6">
                        <div className="flex items-center space-x-2">
                          <span className="bg-orange-50 text-[#CC4E22] px-2 py-0.5 rounded font-bold text-xs">Court {b.courtId}</span>
                          <span className="text-sm font-bold text-gray-700">{b.date} • {b.startTime}:00</span>
                        </div>
                      </td>
                      <td className="py-6">
                        <span className="font-black text-gray-900">${b.totalPrice}</span>
                      </td>
                      <td className="py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center space-x-2 ${
                          b.status === BookingStatus.CONFIRMED ? 'bg-green-100 text-green-700' :
                          b.status === BookingStatus.PENDING ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {processingId === b.id && <Loader2 className="animate-spin" size={10} />}
                          <span>{b.status}</span>
                        </span>
                      </td>
                      <td className="py-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {processingId === b.id ? (
                            <div className="flex items-center space-x-2 px-4 text-xs font-bold text-[#CC4E22] italic">
                              <Loader2 className="animate-spin" size={16} />
                              <span>Updating...</span>
                            </div>
                          ) : (
                            <>
                              {b.status === BookingStatus.PENDING && (
                                <>
                                  <button 
                                    onClick={() => handleStatusChange(b.id, BookingStatus.CONFIRMED)}
                                    className="p-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-green-100 active:scale-95 flex items-center justify-center"
                                    title="Approve & Confirm"
                                  >
                                    <Check size={18} />
                                  </button>
                                  <button 
                                    onClick={() => handleStatusChange(b.id, BookingStatus.CANCELLED)}
                                    className="p-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-100 active:scale-95 flex items-center justify-center"
                                    title="Reject & Cancel"
                                  >
                                    <X size={18} />
                                  </button>
                                </>
                              )}
                              {b.status === BookingStatus.CONFIRMED && (
                                <button 
                                  onClick={() => handleStatusChange(b.id, BookingStatus.CANCELLED)}
                                  className="p-2.5 bg-gray-100 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-all active:scale-95 flex items-center justify-center border border-gray-200"
                                  title="Cancel Confirmed Booking"
                                >
                                  <X size={18} />
                                </button>
                              )}
                              {b.status === BookingStatus.CANCELLED && (
                                <button 
                                  onClick={() => handleStatusChange(b.id, BookingStatus.PENDING)}
                                  className="p-2.5 bg-gray-100 text-gray-400 hover:text-orange-500 rounded-xl hover:bg-orange-50 transition-all active:scale-95 flex items-center justify-center border border-gray-200"
                                  title="Restore to Pending"
                                >
                                  <RotateCcw size={18} />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-20 text-center text-gray-400 font-bold uppercase italic tracking-widest">
                        No bookings found in the database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'content' && (
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black italic uppercase">Announcements</h2>
                <button 
                  onClick={() => setShowAnnForm(!showAnnForm)}
                  className="p-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  <Plus size={18} />
                </button>
              </div>

              {showAnnForm && (
                <form onSubmit={handleAddAnnouncement} className="mb-8 p-6 bg-gray-50 rounded-2xl space-y-4 border-2 border-dashed border-gray-200">
                  <input 
                    placeholder="Announcement Title" 
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#CC4E22] font-bold"
                    value={newAnn.title}
                    onChange={e => setNewAnn({...newAnn, title: e.target.value})}
                    required
                  />
                  <textarea 
                    placeholder="Content..." 
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#CC4E22] h-24"
                    value={newAnn.content}
                    onChange={e => setNewAnn({...newAnn, content: e.target.value})}
                    required
                  />
                  <div className="flex space-x-2">
                    <button type="submit" className="flex-1 bg-[#CC4E22] text-white py-2 rounded-xl font-bold uppercase italic">Publish</button>
                    <button type="button" onClick={() => setShowAnnForm(false)} className="px-4 py-2 text-gray-500 font-bold">Cancel</button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {announcements.map(ann => (
                  <div key={ann.id} className="p-4 border border-gray-100 rounded-2xl flex items-start justify-between bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div>
                      <h4 className="font-bold text-gray-900">{ann.title}</h4>
                      <p className="text-xs text-gray-400 mb-1">{ann.date}</p>
                      <p className="text-sm text-gray-500 line-clamp-2">{ann.content}</p>
                    </div>
                    <button 
                      onClick={() => deleteAnnouncement(ann.id)}
                      className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black italic uppercase">Events</h2>
                <button 
                  onClick={() => setShowEvtForm(!showEvtForm)}
                  className="p-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  <Plus size={18} />
                </button>
              </div>

              {showEvtForm && (
                <form onSubmit={handleAddEvent} className="mb-8 p-6 bg-gray-50 rounded-2xl space-y-4 border-2 border-dashed border-gray-200">
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      placeholder="Event Title" 
                      className="col-span-2 p-3 rounded-xl border border-gray-200 outline-none focus:border-[#CC4E22] font-bold"
                      value={newEvt.title}
                      onChange={e => setNewEvt({...newEvt, title: e.target.value})}
                      required
                    />
                    <input 
                      type="date"
                      className="p-3 rounded-xl border border-gray-200 outline-none"
                      value={newEvt.date}
                      onChange={e => setNewEvt({...newEvt, date: e.target.value})}
                      required
                    />
                    <input 
                      placeholder="Time (e.g. 6PM)"
                      className="p-3 rounded-xl border border-gray-200 outline-none"
                      value={newEvt.time}
                      onChange={e => setNewEvt({...newEvt, time: e.target.value})}
                      required
                    />
                    <input 
                      placeholder="Registration Link"
                      className="col-span-2 p-3 rounded-xl border border-gray-200 outline-none"
                      value={newEvt.registrationLink}
                      onChange={e => setNewEvt({...newEvt, registrationLink: e.target.value})}
                      required
                    />
                    <input 
                      placeholder="Image URL"
                      className="col-span-2 p-3 rounded-xl border border-gray-200 outline-none"
                      value={newEvt.imageUrl}
                      onChange={e => setNewEvt({...newEvt, imageUrl: e.target.value})}
                    />
                  </div>
                  <textarea 
                    placeholder="Event Description..." 
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#CC4E22] h-20"
                    value={newEvt.description}
                    onChange={e => setNewEvt({...newEvt, description: e.target.value})}
                    required
                  />
                  <div className="flex space-x-2">
                    <button type="submit" className="flex-1 bg-[#CC4E22] text-white py-2 rounded-xl font-bold uppercase italic">Create Event</button>
                    <button type="button" onClick={() => setShowEvtForm(false)} className="px-4 py-2 text-gray-500 font-bold">Cancel</button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {events.map(event => (
                  <div key={event.id} className="p-4 border border-gray-100 rounded-2xl flex items-center space-x-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <img src={event.imageUrl || 'https://picsum.photos/seed/pickleball/100'} alt="" className="w-16 h-16 object-cover rounded-xl bg-gray-100" />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{event.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{event.date} • {event.time}</p>
                    </div>
                    <button 
                      onClick={() => deleteEvent(event.id)}
                      className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'rates' && (
          <div className="p-8 max-w-2xl mx-auto space-y-12">
             <div>
                <div className="flex items-center space-x-3 mb-6">
                  <DollarSign className="text-[#CC4E22]" />
                  <h2 className="text-2xl font-black italic uppercase">Court Pricing</h2>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</span>
                    <input 
                      type="number" 
                      value={rates.courtPerHour}
                      className="w-full pl-8 pr-4 py-4 rounded-xl border-2 border-gray-100 font-black text-xl outline-none focus:border-[#CC4E22]"
                      onChange={(e) => updateRates({...rates, courtPerHour: Number(e.target.value)})}
                    />
                  </div>
                  <span className="font-bold text-gray-400 uppercase text-xs">per hour</span>
                </div>
             </div>

             <div>
                <div className="flex items-center space-x-3 mb-6">
                  <Trophy className="text-[#CC4E22]" />
                  <h2 className="text-2xl font-black italic uppercase">Rental Equipment</h2>
                </div>
                <div className="space-y-3">
                  {rates.rentals.map((item, idx) => (
                    <div key={item.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <div className="flex-1">
                        <input 
                          value={item.name}
                          onChange={(e) => {
                            const newRentals = [...rates.rentals];
                            newRentals[idx].name = e.target.value;
                            updateRates({...rates, rentals: newRentals});
                          }}
                          className="w-full bg-transparent font-bold text-gray-900 outline-none"
                        />
                      </div>
                      <div className="flex items-center space-x-2 w-32">
                        <span className="font-bold text-gray-400">$</span>
                        <input 
                          type="number"
                          value={item.ratePerHour}
                          onChange={(e) => {
                            const newRentals = [...rates.rentals];
                            newRentals[idx].ratePerHour = Number(e.target.value);
                            updateRates({...rates, rentals: newRentals});
                          }}
                          className="w-full bg-white border border-gray-200 rounded px-2 py-1 font-bold text-[#CC4E22] outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
             </div>

             <div className="pt-8">
               <button 
                onClick={() => updateRates(rates)}
                className="w-full py-5 bg-[#CC4E22] text-white rounded-2xl font-black uppercase italic tracking-tighter shadow-xl shadow-orange-100 hover:scale-[1.01] transition-transform active:scale-95"
               >
                 Update Facility Settings
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
