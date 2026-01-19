
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, Tag, CheckCircle, Clock4, AlertCircle } from 'lucide-react';
import { Booking, BookingStatus } from '../types';

interface ProfileProps {
  currentUser: any;
  bookings: Booking[];
}

export const Profile: React.FC<ProfileProps> = ({ currentUser, bookings }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const newBookingId = searchParams.get('newBooking');

  useEffect(() => {
    if (!currentUser) navigate('/login');
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const userBookings = bookings
    .filter(b => b.userId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED: return <CheckCircle className="text-green-500" size={18} />;
      case BookingStatus.PENDING: return <Clock4 className="text-orange-400" size={18} />;
      case BookingStatus.CANCELLED: return <AlertCircle className="text-red-500" size={18} />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {newBookingId && (
        <div className="mb-10 bg-green-50 border-2 border-green-100 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 shadow-lg shadow-green-100 animate-in fade-in slide-in-from-top duration-500">
          <div className="flex items-center space-x-4">
            <div className="bg-green-500 p-3 rounded-full text-white">
              <CheckCircle size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase italic text-green-800">Booking Submitted!</h2>
              <p className="text-green-700 font-medium">Your request is being reviewed by our staff. We'll notify you once confirmed.</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/profile')} 
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-12">
        {/* User Stats Card */}
        <div className="md:w-1/3 space-y-6">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center">
            <div className="w-24 h-24 bg-orange-100 rounded-full mx-auto flex items-center justify-center text-[#CC4E22] mb-6">
              <span className="text-4xl font-black">{currentUser.name.charAt(0)}</span>
            </div>
            <h2 className="text-2xl font-black italic uppercase text-gray-900">{currentUser.name}</h2>
            <p className="text-gray-500 text-sm mb-6">{currentUser.email}</p>
            <div className="h-px bg-gray-100 w-full mb-6" />
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-2xl">
                <span className="block text-2xl font-black text-gray-900">{userBookings.length}</span>
                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Bookings</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl">
                <span className="block text-2xl font-black text-gray-900">{userBookings.filter(b => b.status === BookingStatus.CONFIRMED).length}</span>
                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Played</span>
              </div>
            </div>
          </div>
        </div>

        {/* History Area */}
        <div className="md:w-2/3">
          <h2 className="text-3xl font-black italic uppercase tracking-tight mb-8">Booking History</h2>
          
          <div className="space-y-4">
            {userBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-orange-50 text-[#CC4E22] rounded-full text-xs font-black uppercase italic">
                      Court {booking.courtId}
                    </span>
                    <div className="flex items-center space-x-1 text-xs font-bold uppercase">
                      {getStatusIcon(booking.status)}
                      <span className={
                        booking.status === BookingStatus.CONFIRMED ? 'text-green-600' : 
                        booking.status === BookingStatus.PENDING ? 'text-orange-500' : 'text-red-500'
                      }>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Calendar size={14} className="text-[#CC4E22]" />
                      <span className="text-sm font-bold text-gray-700">{booking.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Clock size={14} className="text-[#CC4E22]" />
                      <span className="text-sm font-bold text-gray-700">{booking.startTime}:00 ({booking.duration} hr)</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-500">
                      <MapPin size={14} className="text-[#CC4E22]" />
                      <span className="text-sm font-bold text-gray-700">Dink Loft Indoor</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Tag size={14} className="text-[#CC4E22]" />
                      <span className="text-sm font-bold text-gray-700">${booking.totalPrice} Paid</span>
                    </div>
                  </div>
                </div>
                
                {booking.status === BookingStatus.PENDING && (
                  <div className="pt-4 md:pt-0">
                    <p className="text-[10px] text-gray-400 italic mb-2">Show QR at facility to confirm</p>
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${booking.id}`} 
                      alt="Booking QR" 
                      className="w-16 h-16 rounded-lg opacity-80"
                    />
                  </div>
                )}
              </div>
            ))}

            {userBookings.length === 0 && (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold">No bookings found. Time to hit the court!</p>
                <button 
                  onClick={() => navigate('/calendar')} 
                  className="mt-4 bg-[#CC4E22] text-white px-6 py-2 rounded-full font-bold hover:bg-[#a33e1b]"
                >
                  Book a Court
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
