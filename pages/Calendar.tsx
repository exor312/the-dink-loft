
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
// Fix: startOfToday may not be exported in some versions of date-fns; use Date constructor instead.
import { format, addDays } from 'date-fns';
import { Booking, Event, CourtId, BookingStatus } from '../types';
import { OPERATING_HOURS, COURTS } from '../constants';

interface CalendarProps {
  bookings: Booking[];
  events: Event[];
}

export const Calendar: React.FC<CalendarProps> = ({ bookings, events }) => {
  // Fix: Initializing with current Date
  const [selectedDate, setSelectedDate] = useState(new Date());
  const hours = Array.from({ length: OPERATING_HOURS.end - OPERATING_HOURS.start + 1 }, (_, i) => i + OPERATING_HOURS.start);

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  const getBookingAt = (courtId: CourtId, hour: number) => {
    return bookings.find(b => 
      b.courtId === courtId && 
      b.date === formattedDate && 
      b.status !== BookingStatus.CANCELLED &&
      hour >= b.startTime && hour < b.startTime + b.duration
    );
  };

  const getEventAt = (hour: number) => {
    return events.filter(e => e.date === formattedDate);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">Court Calendar</h1>
          <p className="text-gray-500 mt-2">View real-time availability for all 6 courts.</p>
        </div>
        <div className="flex items-center space-x-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          <button 
            onClick={() => setSelectedDate(prev => addDays(prev, -1))}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="text-lg font-bold min-w-[180px] text-center">
            {format(selectedDate, 'EEEE, MMM do')}
          </span>
          <button 
            onClick={() => setSelectedDate(prev => addDays(prev, 1))}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
        <Link 
          to="/book" 
          className="bg-[#CC4E22] text-white px-8 py-3 rounded-full font-bold hover:bg-[#a33e1b] transition-all text-center"
        >
          Book Now
        </Link>
      </div>

      {/* Events Info Bar */}
      {getEventAt(0).length > 0 && (
        <div className="mb-6 bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-center space-x-3">
          <Info className="text-[#CC4E22]" />
          <div>
            <span className="font-bold text-[#CC4E22]">Events Today: </span>
            {getEventAt(0).map(e => e.title).join(', ')}
          </div>
        </div>
      )}

      {/* Main Scheduler Grid */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed min-w-[800px]">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="w-24 py-4 px-4 text-xs font-bold uppercase tracking-widest border-r border-gray-800">Time</th>
                {COURTS.map(court => (
                  <th key={court} className="py-4 px-4 text-sm font-black italic uppercase">Court {court}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map(hour => (
                <tr key={hour} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-6 px-4 text-center font-bold text-gray-400 text-xs border-r border-gray-50">
                    {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                  </td>
                  {COURTS.map(court => {
                    const booking = getBookingAt(court, hour);
                    const isStart = booking?.startTime === hour;

                    return (
                      <td key={court} className="p-1 border-r border-gray-50">
                        {booking ? (
                          <div className={`h-12 w-full rounded-xl flex flex-col justify-center items-center p-2 text-center shadow-sm border ${
                            booking.status === BookingStatus.CONFIRMED 
                              ? 'bg-[#CC4E22] text-white border-[#CC4E22]' 
                              : 'bg-orange-100 text-[#CC4E22] border-orange-200 border-dashed'
                          }`}>
                            {isStart ? (
                              <>
                                <span className="text-[8px] font-bold uppercase tracking-widest opacity-80 leading-none mb-0.5">
                                  {booking.status === BookingStatus.CONFIRMED ? 'Confirmed' : 'Pending'}
                                </span>
                                <span className="text-[10px] font-black truncate w-full leading-none">{booking.userName}</span>
                              </>
                            ) : (
                              <span className="text-[8px] font-bold uppercase opacity-60">Reserved</span>
                            )}
                          </div>
                        ) : (
                          <div className="h-12 w-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Link 
                              to={`/book?court=${court}&date=${formattedDate}&time=${hour}`} 
                              className="text-[10px] font-bold uppercase text-[#CC4E22] hover:underline"
                            >
                              Available
                            </Link>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-8 flex flex-wrap gap-6 items-center justify-center text-sm font-medium">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-[#CC4E22]" />
          <span>Confirmed Booking</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-orange-100 border border-orange-200 border-dashed" />
          <span>Pending Confirmation</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-400">
          <div className="w-4 h-4 rounded border border-gray-200" />
          <span>Available Slot</span>
        </div>
      </div>
    </div>
  );
};
