
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <span className="text-3xl font-extrabold text-[#CC4E22] tracking-tighter uppercase italic block mb-4">
            THE DINK LOFT
          </span>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            The ultimate pickleball destination. 6 professional courts, premium rentals, and a community of players dedicated to the game.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[#CC4E22] transition-colors"><Instagram size={20} /></a>
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[#CC4E22] transition-colors"><Facebook size={20} /></a>
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[#CC4E22] transition-colors"><Twitter size={20} /></a>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 border-b-2 border-[#CC4E22] inline-block">Quick Links</h4>
          <ul className="space-y-4 text-gray-400">
            <li><Link to="/calendar" className="hover:text-white transition-colors">Court Calendar</Link></li>
            <li><Link to="/rates" className="hover:text-white transition-colors">Pricing & Rates</Link></li>
            <li><Link to="/rules" className="hover:text-white transition-colors">Rules & Regulations</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">About the Loft</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 border-b-2 border-[#CC4E22] inline-block">Support</h4>
          <ul className="space-y-4 text-gray-400">
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link to="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
            <li><Link to="/login" className="hover:text-white transition-colors">Manage Booking</Link></li>
            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 border-b-2 border-[#CC4E22] inline-block">Visit Us</h4>
          <ul className="space-y-4 text-gray-400">
            <li className="flex items-start space-x-3">
              <MapPin className="text-[#CC4E22] mt-1 shrink-0" size={18} />
              <span>123 Pickleball Way, <br />Netview, ST 12345</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="text-[#CC4E22] shrink-0" size={18} />
              <span>(555) 123-DINK</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="text-[#CC4E22] shrink-0" size={18} />
              <span>hello@dinkloft.com</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-xs">
        &copy; {new Date().getFullYear()} The Dink Loft. All rights reserved. Designed for Pickleball Enthusiasts.
      </div>
    </footer>
  );
};
