
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Calendar } from './pages/Calendar';
import { BookingFlow } from './pages/BookingFlow';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/AdminDashboard';
import { useStore } from './store';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage = ({ login, signup }: any) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({ 
    email: '', 
    name: '', 
    phone: '', 
    password: '' 
  });
  const [authError, setAuthError] = React.useState('');
  const [authSuccess, setAuthSuccess] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const success = await login(formData.email, formData.password);
        if (success) {
          navigate('/profile');
        } else {
          setAuthError('Invalid email or password. Please try again.');
        }
      } else {
        if (formData.password.length < 6) {
          setAuthError('Password must be at least 6 characters.');
          setIsLoading(false);
          return;
        }
        const success = await signup(formData.name, formData.email, formData.phone, formData.password);
        if (success) {
          setAuthSuccess('Account created! Please check your email to verify your account if required, otherwise you can now log in.');
          // If auto-logged in (email confirm off), navigate will happen via currentUser observer
          setTimeout(() => setIsLogin(true), 3000);
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-20 px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 md:p-12 border border-gray-100">
        <div className="text-center mb-10">
          <span className="text-xs font-black uppercase italic tracking-[0.2em] text-[#CC4E22] block mb-2">The Dink Loft</span>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900">
            {isLogin ? 'Player Login' : 'Create Account'}
          </h2>
          <p className="text-gray-400 font-medium text-sm mt-2">
            {isLogin ? 'Welcome back to the courts.' : 'Join our premier pickleball community.'}
          </p>
        </div>

        {authError && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold text-center border border-red-100">
            {authError}
          </div>
        )}

        {authSuccess && (
          <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-2xl text-sm font-bold text-center border border-green-100">
            {authSuccess}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          {!isLogin && (
            <>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                <input 
                  required
                  autoFocus
                  className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-[#CC4E22] outline-none font-bold text-gray-900 transition-all placeholder:text-gray-300"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
                <input 
                  required
                  type="tel"
                  className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-[#CC4E22] outline-none font-bold text-gray-900 transition-all placeholder:text-gray-300"
                  placeholder="(555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </>
          )}
          
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
            <input 
              required
              type="email"
              className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-[#CC4E22] outline-none font-bold text-gray-900 transition-all placeholder:text-gray-300"
              placeholder="player@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
            <div className="relative">
              <input 
                required
                type={showPassword ? 'text' : 'password'}
                className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-[#CC4E22] outline-none font-bold text-gray-900 transition-all placeholder:text-gray-300 pr-12"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#CC4E22] transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {!isLogin && <p className="text-[10px] text-gray-400 mt-2 ml-1 font-medium italic">* At least 6 characters</p>}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-5 bg-[#CC4E22] text-white rounded-2xl font-black uppercase italic tracking-tighter hover:bg-[#a33e1b] transition-all shadow-xl shadow-orange-100 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>{isLogin ? 'Sign In to Play' : 'Join the Loft'}</span>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-500 font-bold text-sm">
            {isLogin ? "New to the Loft?" : "Already a member?"}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setAuthError('');
                setAuthSuccess('');
                setFormData({ email: '', name: '', phone: '', password: '' });
              }}
              className="ml-2 text-[#CC4E22] font-black underline italic hover:text-[#a33e1b] transition-colors"
            >
              {isLogin ? 'Create Account' : 'Log In Here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const store = useStore();

  if (store.loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#CC4E22]"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col selection:bg-[#CC4E22] selection:text-white">
        <Navigation currentUser={store.currentUser} logout={store.logout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home announcements={store.announcements} events={store.events} />} />
            <Route path="/calendar" element={<Calendar bookings={store.bookings} events={store.events} />} />
            <Route path="/login" element={store.currentUser ? <Navigate to="/profile" /> : <LoginPage login={store.login} signup={store.signup} />} />
            <Route path="/book" element={<BookingFlow currentUser={store.currentUser} rates={store.rates} isCourtAvailable={store.isCourtAvailable} addBooking={store.addBooking} />} />
            <Route path="/profile" element={<Profile currentUser={store.currentUser} bookings={store.bookings} />} />
            <Route path="/admin" element={store.currentUser?.isAdmin ? 
              <AdminDashboard 
                bookings={store.bookings} 
                rates={store.rates} 
                announcements={store.announcements} 
                events={store.events} 
                updateBookingStatus={store.updateBookingStatus} 
                updateRates={store.updateRates} 
                addAnnouncement={store.addAnnouncement}
                deleteAnnouncement={store.deleteAnnouncement}
                addEvent={store.addEvent}
                deleteEvent={store.deleteEvent}
              /> : <Navigate to="/login" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
