
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';

interface NavigationProps {
  currentUser: any;
  logout: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentUser, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Rates', path: '/rates' },
    { name: 'Rules', path: '/rules' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-extrabold text-[#CC4E22] tracking-tighter uppercase italic">
                THE DINK LOFT
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold transition-colors duration-200 ${
                  isActive(link.path) ? 'text-[#CC4E22]' : 'text-gray-600 hover:text-[#CC4E22]'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="h-6 w-px bg-gray-200 mx-2" />
            
            {currentUser ? (
              <div className="flex items-center space-x-4">
                {currentUser.isAdmin && (
                  <Link to="/admin" className="p-2 text-gray-600 hover:text-[#CC4E22]">
                    <LayoutDashboard size={20} />
                  </Link>
                )}
                <Link to="/profile" className="p-2 text-gray-600 hover:text-[#CC4E22]">
                  <User size={20} />
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-sm font-semibold text-gray-600 hover:text-[#CC4E22]"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-[#CC4E22] text-white px-6 py-2 rounded-full font-bold hover:bg-[#a33e1b] transition-all"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-[#CC4E22] focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Links */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-3 rounded-md text-base font-bold ${
                  isActive(link.path) ? 'text-[#CC4E22] bg-orange-50' : 'text-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100">
              {currentUser ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-3 rounded-md text-base font-bold text-gray-700"
                  >
                    My Profile
                  </Link>
                  {currentUser.isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-3 rounded-md text-base font-bold text-gray-700"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-3 rounded-md text-base font-bold text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 bg-[#CC4E22] text-white rounded-md text-center font-bold"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
