
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Info, CreditCard, ChevronRight, ChevronLeft, MapPin, Clock, CalendarIcon, Users } from 'lucide-react';
import { format } from 'date-fns';
import { CourtId, BookingStatus, RentalItem } from '../types';
import { OPERATING_HOURS, COURTS } from '../constants';

interface BookingFlowProps {
  currentUser: any;
  rates: any;
  isCourtAvailable: (courtId: CourtId, date: string, startTime: number, duration: number) => boolean;
  addBooking: (data: any) => Promise<any>;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({ currentUser, rates, isCourtAvailable, addBooking }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    courtId: (Number(searchParams.get('court')) as CourtId) || 1,
    date: searchParams.get('date') || format(new Date(), 'yyyy-MM-dd'),
    startTime: Number(searchParams.get('time')) || 8,
    duration: 1,
    rentals: [] as { itemId: string; quantity: number }[]
  });

  useEffect(() => {
    if (!currentUser) navigate('/login');
  }, [currentUser, navigate]);

  const handleRentalToggle = (item: RentalItem) => {
    const existing = formData.rentals.find(r => r.itemId === item.id);
    if (existing) {
      setFormData(prev => ({
        ...prev,
        rentals: prev.rentals.filter(r => r.itemId !== item.id)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        rentals: [...prev.rentals, { itemId: item.id, quantity: 1 }]
      }));
    }
  };

  const calculateTotal = () => {
    const courtCost = formData.duration * rates.courtPerHour;
    const rentalCost = formData.rentals.reduce((sum, rental) => {
      const item = rates.rentals.find((r: RentalItem) => r.id === rental.itemId);
      return sum + (item ? item.ratePerHour * formData.duration : 0);
    }, 0);
    return courtCost + rentalCost;
  };

  const availableHours = useMemo(() => {
    const possibleHours = Array.from(
      { length: OPERATING_HOURS.end - OPERATING_HOURS.start - formData.duration + 1 }, 
      (_, i) => i + OPERATING_HOURS.start
    );
    
    return possibleHours.filter(h => 
      isCourtAvailable(formData.courtId, formData.date, h, formData.duration)
    );
  }, [formData.courtId, formData.date, formData.duration, isCourtAvailable]);

  useEffect(() => {
    if (availableHours.length > 0 && !availableHours.includes(formData.startTime)) {
      setFormData(prev => ({ ...prev, startTime: availableHours[0] }));
    }
  }, [availableHours]);

  const isCurrentSelectionAvailable = availableHours.includes(formData.startTime);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const booking = await addBooking({
        userId: currentUser.id,
        userName: currentUser.name,
        ...formData,
        totalPrice: calculateTotal(),
      });
      if (booking) {
        navigate('/profile?newBooking=' + booking.id);
      } else {
        alert("Failed to create booking. Please check console for errors.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  if (!currentUser) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-12">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex flex-col items-center flex-1 relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${
              step >= s ? 'bg-[#CC4E22] border-[#CC4E22] text-white' : 'bg-white border-gray-200 text-gray-400'
            }`}>
              {step > s ? <Check size={20} /> : s}
            </div>
            <span className={`text-[10px] font-bold uppercase mt-2 tracking-widest ${
              step >= s ? 'text-[#CC4E22]' : 'text-gray-400'
            }`}>
              {s === 1 ? 'Rules' : s === 2 ? 'Details' : s === 3 ? 'Rentals' : 'Pay'}
            </span>
            {s < 4 && (
              <div className={`absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-0.5 transition-colors ${
                step > s ? 'bg-[#CC4E22]' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black italic uppercase tracking-tight">Rules & Regulations</h2>
            <div className="prose prose-sm text-gray-600 space-y-4 max-h-64 overflow-y-auto p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p>1. <strong>Footwear:</strong> Only non-marking court shoes are allowed. No running shoes or sandals.</p>
              <p>2. <strong>Cancellations:</strong> Bookings must be cancelled at least 24 hours in advance for a full refund.</p>
              <p>3. <strong>Duration:</strong> Maximum 3 hours per booking. Back-to-back bookings allowed.</p>
              <p>4. <strong>Etiquette:</strong> Please respect fellow players. Keep noise levels reasonable.</p>
              <p>5. <strong>Equipment:</strong> Rentals must be returned to the pro shop in original condition.</p>
            </div>
            <label className="flex items-center space-x-3 cursor-pointer p-4 rounded-xl border-2 transition-all border-gray-100 hover:border-orange-200 bg-orange-50/20">
              <input 
                type="checkbox" 
                checked={agreed} 
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 accent-[#CC4E22]" 
              />
              <span className="font-semibold text-gray-700">I have read and agree to all facility rules.</span>
            </label>
            <div className="flex justify-end pt-6">
              <button 
                onClick={nextStep}
                disabled={!agreed}
                className="bg-[#CC4E22] text-white px-10 py-4 rounded-full font-bold hover:bg-[#a33e1b] transition-all disabled:opacity-50 flex items-center"
              >
                Continue
                <ChevronRight className="ml-2" size={20} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-black italic uppercase tracking-tight">Booking Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest">Select Court</label>
                <div className="grid grid-cols-3 gap-3">
                  {COURTS.map(c => (
                    <button
                      key={c}
                      onClick={() => setFormData({...formData, courtId: c})}
                      className={`py-3 rounded-xl font-bold border-2 transition-all ${
                        formData.courtId === c ? 'bg-[#CC4E22] border-[#CC4E22] text-white' : 'bg-white border-gray-100 hover:border-orange-200'
                      }`}
                    >
                      Court {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest">Duration (Hours)</label>
                <div className="flex space-x-3">
                  {[1, 2, 3].map(d => (
                    <button
                      key={d}
                      onClick={() => setFormData({...formData, duration: d})}
                      className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${
                        formData.duration === d ? 'bg-[#CC4E22] border-[#CC4E22] text-white' : 'bg-white border-gray-100 hover:border-orange-200'
                      }`}
                    >
                      {d} hr{d > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 italic font-medium">* Max 3 hours per booking</p>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest">Date</label>
                <input 
                  type="date"
                  value={formData.date}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-[#CC4E22] outline-none font-bold"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest">Available Start Times</label>
                <select
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: Number(e.target.value)})}
                  className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-[#CC4E22] outline-none font-bold appearance-none bg-white"
                >
                  {availableHours.length > 0 ? (
                    availableHours.map(h => (
                      <option key={h} value={h}>
                        {h > 12 ? `${h-12} PM` : h === 12 ? '12 PM' : `${h} AM`}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No available slots for this duration</option>
                  )}
                </select>
              </div>
            </div>

            {availableHours.length === 0 && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center space-x-3 border border-red-100">
                <Info size={20} />
                <span className="font-bold">No available slots found for a {formData.duration}-hour booking on this date/court.</span>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <button onClick={prevStep} className="px-8 py-4 font-bold text-gray-500 hover:text-[#CC4E22] transition-colors">Back</button>
              <button 
                onClick={nextStep}
                disabled={!isCurrentSelectionAvailable || availableHours.length === 0}
                className="bg-[#CC4E22] text-white px-10 py-4 rounded-full font-bold hover:bg-[#a33e1b] transition-all disabled:opacity-50 flex items-center"
              >
                Next Step
                <ChevronRight className="ml-2" size={20} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-black italic uppercase tracking-tight">Equipment Rentals</h2>
            <p className="text-gray-500">Need some gear? Select items below. Prices are per hour.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rates.rentals.map((item: RentalItem) => {
                const isSelected = formData.rentals.some(r => r.itemId === item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleRentalToggle(item)}
                    className={`p-6 rounded-2xl border-2 text-left transition-all flex justify-between items-center ${
                      isSelected ? 'bg-orange-50 border-[#CC4E22]' : 'bg-white border-gray-100 hover:border-orange-200'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">{item.name}</h4>
                      <p className="text-[#CC4E22] font-bold text-sm">${item.ratePerHour}/hr</p>
                    </div>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-[#CC4E22] border-[#CC4E22] text-white' : 'border-gray-200 text-transparent'
                    }`}>
                      <Check size={16} />
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between pt-6">
              <button onClick={prevStep} className="px-8 py-4 font-bold text-gray-500 hover:text-[#CC4E22] transition-colors">Back</button>
              <button 
                onClick={nextStep}
                className="bg-[#CC4E22] text-white px-10 py-4 rounded-full font-bold hover:bg-[#a33e1b] transition-all flex items-center"
              >
                Review Summary
                <ChevronRight className="ml-2" size={20} />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-black italic uppercase tracking-tight">Booking Summary</h2>
            
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-gray-200 pb-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Court</span>
                  <div className="flex items-center space-x-2 font-bold text-gray-900">
                    <MapPin size={16} className="text-[#CC4E22]" />
                    <span>Court {formData.courtId}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Date</span>
                  <div className="flex items-center space-x-2 font-bold text-gray-900">
                    <CalendarIcon size={16} className="text-[#CC4E22]" />
                    <span>{formData.date}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Time</span>
                  <div className="flex items-center space-x-2 font-bold text-gray-900">
                    <Clock size={16} className="text-[#CC4E22]" />
                    <span>{formData.startTime}:00 ({formData.duration} hr)</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Player</span>
                  <div className="flex items-center space-x-2 font-bold text-gray-900">
                    <Users size={16} className="text-[#CC4E22]" />
                    <span>{currentUser.name}</span>
                  </div>
                </div>
              </div>

              {formData.rentals.length > 0 && (
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Equipments</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {formData.rentals.map(r => {
                      const item = rates.rentals.find((ri: RentalItem) => ri.id === r.itemId);
                      return (
                        <div key={r.itemId} className="flex justify-between items-center text-sm font-bold bg-white p-3 rounded-xl border border-gray-100">
                          <span>{item?.name}</span>
                          <span className="text-[#CC4E22]">${item?.ratePerHour * formData.duration}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4">
                <span className="text-xl font-black uppercase italic italic tracking-tight">Total Bill</span>
                <span className="text-4xl font-black text-[#CC4E22]">${calculateTotal()}</span>
              </div>
            </div>

            <div className="bg-[#CC4E22]/5 p-8 rounded-3xl border-2 border-dashed border-[#CC4E22]/20 text-center space-y-4">
              <h3 className="font-bold text-xl uppercase italic">Payment Method</h3>
              <p className="text-gray-600 text-sm max-w-sm mx-auto">Please scan the QR code below at the facility front desk or pay via your banking app. Once paid, staff will confirm your booking manually.</p>
              <div className="w-48 h-48 bg-white mx-auto rounded-2xl shadow-lg flex items-center justify-center p-4 border border-gray-100">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TheDinkLoftBooking" 
                  alt="Payment QR" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <button onClick={prevStep} className="px-8 py-4 font-bold text-gray-500 hover:text-[#CC4E22] transition-colors">Back</button>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#CC4E22] text-white px-12 py-4 rounded-full font-bold hover:bg-[#a33e1b] transition-all shadow-xl shadow-orange-200 flex items-center disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Complete Booking'}
                <CreditCard className="ml-2" size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
