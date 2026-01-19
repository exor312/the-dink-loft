
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Trophy, Bell, ChevronRight } from 'lucide-react';
import { Announcement, Event } from '../types';

interface HomeProps {
  announcements: Announcement[];
  events: Event[];
}

export const Home: React.FC<HomeProps> = ({ announcements, events }) => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/loft-court/1920/1080" 
            alt="Pickleball Court" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tighter italic uppercase">
              Master the <span className="text-[#CC4E22]">Dink</span>,<br /> Own the Loft.
            </h1>
            <p className="mt-6 text-xl text-gray-200 max-w-lg">
              Experience premier pickleball on our 6 climate-controlled indoor courts. Open daily from 6 AM to 10 PM.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link 
                to="/calendar" 
                className="inline-flex items-center justify-center px-8 py-4 bg-[#CC4E22] text-white font-bold rounded-full hover:bg-[#a33e1b] transition-all text-lg"
              >
                Book a Court
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link 
                to="/rates" 
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-all text-lg"
              >
                View Rates
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Announcements */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-8">
                <Bell className="text-[#CC4E22]" />
                <h2 className="text-2xl font-black uppercase italic tracking-tight">Announcements</h2>
              </div>
              <div className="space-y-6">
                {announcements.map((ann) => (
                  <div key={ann.id} className="border-l-4 border-[#CC4E22] pl-4 py-2 bg-orange-50/50 rounded-r-xl">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{ann.date}</span>
                    <h3 className="text-lg font-bold text-gray-900 mt-1">{ann.title}</h3>
                    <p className="text-gray-600 mt-2 text-sm leading-relaxed">{ann.content}</p>
                  </div>
                ))}
                {announcements.length === 0 && <p className="text-gray-500">No recent announcements.</p>}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2">
                  <Trophy className="text-[#CC4E22]" />
                  <h2 className="text-2xl font-black uppercase italic tracking-tight">Upcoming Events</h2>
                </div>
                <Link to="/calendar" className="text-[#CC4E22] font-bold text-sm flex items-center hover:underline">
                  Full Calendar <ChevronRight size={16} />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {events.map((event) => (
                  <div key={event.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow flex flex-col">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={event.imageUrl || 'https://picsum.photos/seed/event/400/300'} 
                        alt={event.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full font-bold text-[#CC4E22] text-xs shadow-sm uppercase tracking-wider">
                        {event.date} • {event.time}
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-gray-600 text-sm mb-6 line-clamp-3">{event.description}</p>
                      <div className="mt-auto">
                        <a 
                          href={event.registrationLink}
                          className="w-full inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors"
                        >
                          Register Now
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
                {events.length === 0 && <p className="text-gray-500">No events scheduled yet.</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities CTA */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black italic uppercase tracking-tight mb-4">World-Class Facilities</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-16">
            We've built a space where players of all levels can thrive. From top-tier surfaces to our social lounge, The Dink Loft is your pickleball home.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-[#CC4E22] mb-8 mx-auto">
                <Calendar size={32} />
              </div>
              <h3 className="text-xl font-extrabold mb-4 uppercase">Flexible Bookings</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Book up to 3 hours back-to-back. Seamless online reservation system with instant confirmation.</p>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:-translate-y-1 transition-transform border-t-4 border-[#CC4E22]">
              <div className="w-16 h-16 bg-[#CC4E22] rounded-2xl flex items-center justify-center text-white mb-8 mx-auto">
                <Trophy size={32} />
              </div>
              <h3 className="text-xl font-extrabold mb-4 uppercase">Pro Equipment</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Rent the latest Selkirk and JOOLA paddles. Our pro shop has everything you need to dominate the court.</p>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-[#CC4E22] mb-8 mx-auto">
                <Bell size={32} />
              </div>
              <h3 className="text-xl font-extrabold mb-4 uppercase">Live Community</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Join regular tournaments, clinics, and social mixers. Find your level and level up with us.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
