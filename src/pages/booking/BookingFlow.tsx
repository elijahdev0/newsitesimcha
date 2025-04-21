import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Check, ChevronRight, Package, Calendar, CreditCard } from 'lucide-react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { Button } from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';
import { useBookingStore } from '../../store/bookingStore';
import { formatCurrency } from '../../utils/formatters';
import { courses } from '../../data/courses';
import { extras } from '../../data/extras';
import { courseDates } from '../../data/dates';
import { CourseDate, Extra, BookingExtra } from '../../types';

// Payment form type
type PaymentFormData = {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
};

const BookingFlow: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { isAuthenticated } = useAuthStore();
  const { selectCourse, selectedCourse, selectDate, selectedDate, addExtra, removeExtra, selectedExtras, calculateTotal, createBooking, resetSelection } = useBookingStore();
  
  const [step, setStep] = useState(1);
  const [availableDates, setAvailableDates] = useState<CourseDate[]>([]);
  const [selectedDateObj, setSelectedDateObj] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<PaymentFormData>();
  
  // Filter extras by category for better organization
  const experienceExtras = extras.filter(extra => extra.category === 'experience');
  const tacticalExtras = extras.filter(extra => extra.category === 'tactical');
  const accommodationExtras = extras.filter(extra => extra.category === 'accommodation');
  const mediaExtras = extras.filter(extra => extra.category === 'media');
  
  // Check if an extra is selected
  const isExtraSelected = (extraId: string): boolean => {
    return selectedExtras.some(e => e.id === extraId);
  };
  
  // Toggle extra selection
  const toggleExtra = (extra: Extra) => {
    if (isExtraSelected(extra.id)) {
      removeExtra(extra.id);
    } else {
      addExtra(extra as BookingExtra);
    }
  };
  
  // Navigate to next step
  const nextStep = () => {
    window.scrollTo(0, 0);
    setStep(step + 1);
  };
  
  // Navigate to previous step
  const prevStep = () => {
    window.scrollTo(0, 0);
    setStep(step - 1);
  };
  
  // Complete booking
  const completeBooking = async () => {
    setIsLoading(true);
    try {
      await createBooking();
      setIsBookingComplete(true);
      setStep(4);
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format date for display
  const formatDateStr = (date: Date): string => {
    return format(date, 'MMM d, yyyy');
  };
  
  // Handle date selection from calendar
  const handleDateSelection = (date: Date) => {
    setSelectedDateObj(date);
    
    const selectedCourseDate = availableDates.find(
      d => new Date(d.startDate).toDateString() === date.toDateString()
    );
    
    if (selectedCourseDate) {
      selectDate(selectedCourseDate.id);
    }
  };
  
  // Initialize booking with selected course
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { redirectTo: `/book/${courseId}` } });
      return;
    }
    
    resetSelection();
    
    if (courseId) {
      selectCourse(courseId);
      
      // Get available dates for this course
      const dates = courseDates.filter(date => date.courseId === courseId);
      setAvailableDates(dates);
    }
  }, [courseId, isAuthenticated, navigate, resetSelection, selectCourse]);
  
  if (!selectedCourse) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-tactical-50 pt-32 pb-16">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tactical-700 mx-auto"></div>
            <p className="mt-4">Loading course details...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Header variant="dark-text" />
      <main className="min-h-screen bg-tactical-50 pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Progress Steps */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="flex justify-between">
              <div className={`flex flex-col items-center ${step >= 1 ? 'text-accent-600' : 'text-tactical-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-accent-600 text-white' : 'bg-tactical-200 text-tactical-600'}`}>
                  {step > 1 ? <Check className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                </div>
                <span className="text-sm mt-2">Package</span>
              </div>
              
              <div className="flex-1 flex items-center">
                <div className={`flex-1 h-1 ${step >= 2 ? 'bg-accent-500' : 'bg-tactical-200'}`}></div>
              </div>
              
              <div className={`flex flex-col items-center ${step >= 2 ? 'text-accent-600' : 'text-tactical-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-accent-600 text-white' : 'bg-tactical-200 text-tactical-600'}`}>
                  {step > 2 ? <Check className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                </div>
                <span className="text-sm mt-2">Schedule</span>
              </div>
              
              <div className="flex-1 flex items-center">
                <div className={`flex-1 h-1 ${step >= 3 ? 'bg-accent-500' : 'bg-tactical-200'}`}></div>
              </div>
              
              <div className={`flex flex-col items-center ${step >= 3 ? 'text-accent-600' : 'text-tactical-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-accent-600 text-white' : 'bg-tactical-200 text-tactical-600'}`}>
                  {step > 3 ? <Check className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                </div>
                <span className="text-sm mt-2">Payment</span>
              </div>
            </div>
          </div>
          
          <div className="max-w-5xl mx-auto">
            {/* Step 1: Course Details */}
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h1 className="font-heading text-2xl font-bold text-tactical-900 mb-8">
                  1. Review Your Selected Package
                </h1>
                
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                  <div className="flex-1 border border-gray-200 rounded-lg p-6">
                    <h2 className="font-heading text-xl font-semibold text-tactical-900 mb-4">
                      {selectedCourse.title}
                    </h2>
                    <div className="text-2xl font-bold text-tactical-900 mb-4">
                      {formatCurrency(selectedCourse.price)}
                    </div>
                    <p className="text-tactical-700 mb-4">
                      {selectedCourse.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-tactical-100 text-tactical-800 rounded-full px-3 py-1 text-xs font-medium">
                        {selectedCourse.duration} days
                      </span>
                      <span className="bg-tactical-100 text-tactical-800 rounded-full px-3 py-1 text-xs font-medium">
                        {selectedCourse.rounds} rounds
                      </span>
                      {selectedCourse.hotel && (
                        <span className="bg-tactical-100 text-tactical-800 rounded-full px-3 py-1 text-xs font-medium">
                          Accommodation
                        </span>
                      )}
                    </div>
                    <ul className="space-y-2">
                      {selectedCourse.includes.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-accent-500 mr-2 font-bold">✓</span>
                          <span className="text-sm text-tactical-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-tactical-900 mb-4">Add Optional Extras</h3>
                    
                    {/* Experience Extras */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-tactical-700 mb-2">Experiences</h4>
                      <div className="space-y-2">
                        {experienceExtras.map(extra => (
                          <div 
                            key={extra.id}
                            className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                              isExtraSelected(extra.id) 
                                ? 'border-accent-500 bg-accent-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => toggleExtra(extra)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-medium text-tactical-800">{extra.name}</span>
                                <p className="text-xs text-tactical-600">{extra.description}</p>
                              </div>
                              <span className="font-semibold text-tactical-900">
                                {formatCurrency(extra.price)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Tactical Extras */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-tactical-700 mb-2">Tactical Add-ons</h4>
                      <div className="space-y-2">
                        {tacticalExtras.map(extra => (
                          <div 
                            key={extra.id}
                            className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                              isExtraSelected(extra.id) 
                                ? 'border-accent-500 bg-accent-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => toggleExtra(extra)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-medium text-tactical-800">{extra.name}</span>
                                <p className="text-xs text-tactical-600">{extra.description}</p>
                              </div>
                              <span className="font-semibold text-tactical-900">
                                {formatCurrency(extra.price)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Media Extras */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-tactical-700 mb-2">Media & Merchandise</h4>
                      <div className="space-y-2">
                        {mediaExtras.map(extra => (
                          <div 
                            key={extra.id}
                            className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                              isExtraSelected(extra.id) 
                                ? 'border-accent-500 bg-accent-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => toggleExtra(extra)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-medium text-tactical-800">{extra.name}</span>
                                <p className="text-xs text-tactical-600">{extra.description}</p>
                              </div>
                              <span className="font-semibold text-tactical-900">
                                {formatCurrency(extra.price)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-tactical-700">Package Price:</span>
                      <p className="text-lg font-semibold text-tactical-900">
                        {formatCurrency(selectedCourse.price)}
                      </p>
                    </div>
                    
                    {selectedExtras.length > 0 && (
                      <div>
                        <span className="text-tactical-700">Selected Extras:</span>
                        <p className="text-lg font-semibold text-tactical-900">
                          {formatCurrency(selectedExtras.reduce((sum, extra) => sum + extra.price, 0))}
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <span className="text-tactical-700">Total:</span>
                      <p className="text-xl font-bold text-tactical-900">
                        {formatCurrency(calculateTotal())}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button
                    variant="primary"
                    onClick={nextStep}
                  >
                    Continue to Schedule
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
            
            {/* Step 2: Date Selection */}
            {step === 2 && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h1 className="font-heading text-2xl font-bold text-tactical-900 mb-8">
                  2. Select Training Dates
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-medium text-tactical-900 mb-4">Available Dates</h3>
                    <div className="bg-tactical-50 p-4 rounded-lg">
                      <DatePicker
                        selected={selectedDateObj}
                        onChange={handleDateSelection}
                        includeDates={availableDates.map(date => new Date(date.startDate))}
                        inline
                        minDate={new Date()}
                        className="w-full border rounded-md p-2"
                      />
                    </div>
                    <p className="text-sm text-tactical-600 mt-4">
                      * Green dates indicate available training slots. Select a date to view details.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-tactical-900 mb-4">Training Details</h3>
                    
                    {selectedDate ? (
                      <div className="border border-gray-200 rounded-lg p-6">
                        <div className="mb-4">
                          <h4 className="font-semibold text-tactical-900">Selected Date:</h4>
                          <p className="text-tactical-700">
                            {formatDateStr(new Date(selectedDate.startDate))} to {formatDateStr(new Date(selectedDate.endDate))}
                          </p>
                          <p className="text-sm text-tactical-600 mt-1">
                            Duration: {selectedCourse.duration} days
                          </p>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="font-semibold text-tactical-900">Location:</h4>
                          <p className="text-tactical-700">S-Arms Shooting Range, Tallinn, Estonia</p>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="font-semibold text-tactical-900">Availability:</h4>
                          <p className="text-tactical-700">
                            {selectedDate.maxParticipants - selectedDate.currentParticipants} spots available
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div 
                              className="bg-accent-600 h-2.5 rounded-full" 
                              style={{ width: `${(selectedDate.currentParticipants / selectedDate.maxParticipants) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {selectedCourse.hotel && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-tactical-900">Accommodation:</h4>
                            <p className="text-tactical-700">{selectedCourse.hotel}</p>
                          </div>
                        )}
                        
                        {selectedCourse.transport && (
                          <div>
                            <h4 className="font-semibold text-tactical-900">Transport:</h4>
                            <p className="text-tactical-700">{selectedCourse.transport}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center h-64">
                        <Calendar className="w-12 h-12 text-tactical-400 mb-4" />
                        <p className="text-tactical-700 text-center">
                          Please select a date from the calendar to view training details.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                  >
                    Back to Package
                  </Button>
                  <Button
                    variant="primary"
                    onClick={nextStep}
                    disabled={!selectedDate}
                  >
                    Continue to Payment
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
            
            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h1 className="font-heading text-2xl font-bold text-tactical-900 mb-8">
                  3. Payment Details
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-medium text-tactical-900 mb-4">Booking Summary</h3>
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="mb-4">
                        <h4 className="font-heading text-lg font-semibold text-tactical-900">{selectedCourse.title}</h4>
                        <p className="text-tactical-700 text-sm">
                          {formatDateStr(new Date(selectedDate!.startDate))} to {formatDateStr(new Date(selectedDate!.endDate))}
                        </p>
                      </div>
                      
                      <div className="border-t border-gray-200 my-4 pt-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-tactical-700">Package Price:</span>
                          <span className="font-medium">{formatCurrency(selectedCourse.price)}</span>
                        </div>
                        
                        {selectedExtras.length > 0 && (
                          <>
                            {selectedExtras.map(extra => (
                              <div key={extra.id} className="flex justify-between mb-2">
                                <span className="text-tactical-700">{extra.name}:</span>
                                <span className="font-medium">{formatCurrency(extra.price)}</span>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between">
                          <span className="font-semibold text-tactical-900">Total Amount:</span>
                          <span className="font-bold text-tactical-900">{formatCurrency(calculateTotal())}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="font-medium text-tactical-900 mb-4">Important Information</h3>
                      <div className="bg-tactical-50 p-4 rounded-lg text-sm text-tactical-700">
                        <p className="mb-2">
                          <span className="font-semibold">Deposit:</span> 50% deposit is required to secure your booking.
                        </p>
                        <p className="mb-2">
                          <span className="font-semibold">Cancellation Policy:</span> All deposits are non-refundable. 
                          Rescheduling must be done at least 30 days in advance.
                        </p>
                        <p>
                          <span className="font-semibold">Final Payment:</span> Full payment is due 14 days before training begins.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-tactical-900 mb-4">Payment Method</h3>
                    
                    <form onSubmit={handleSubmit(completeBooking)}>
                      <div className="mb-4">
                        <label htmlFor="cardName" className="block text-sm font-medium text-tactical-700 mb-1">
                          Name on Card
                        </label>
                        <input
                          id="cardName"
                          type="text"
                          className={`
                            w-full px-3 py-2 border rounded-md text-tactical-900
                            ${errors.cardName ? 'border-red-500' : 'border-gray-300'}
                            focus:outline-none focus:ring-2 focus:ring-tactical-400
                          `}
                          placeholder="John Doe"
                          {...register('cardName', { required: 'Name is required' })}
                        />
                        {errors.cardName && (
                          <p className="mt-1 text-sm text-red-600">{errors.cardName.message}</p>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-tactical-700 mb-1">
                          Card Number
                        </label>
                        <input
                          id="cardNumber"
                          type="text"
                          className={`
                            w-full px-3 py-2 border rounded-md text-tactical-900
                            ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}
                            focus:outline-none focus:ring-2 focus:ring-tactical-400
                          `}
                          placeholder="4242 4242 4242 4242"
                          {...register('cardNumber', { 
                            required: 'Card number is required',
                            pattern: {
                              value: /^[0-9]{16}$/,
                              message: 'Enter a valid 16-digit card number'
                            } 
                          })}
                        />
                        {errors.cardNumber && (
                          <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <label htmlFor="expiry" className="block text-sm font-medium text-tactical-700 mb-1">
                            Expiry Date
                          </label>
                          <input
                            id="expiry"
                            type="text"
                            className={`
                              w-full px-3 py-2 border rounded-md text-tactical-900
                              ${errors.expiry ? 'border-red-500' : 'border-gray-300'}
                              focus:outline-none focus:ring-2 focus:ring-tactical-400
                            `}
                            placeholder="MM/YY"
                            {...register('expiry', { 
                              required: 'Expiry date is required',
                              pattern: {
                                value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                                message: 'Enter a valid expiry date (MM/YY)'
                              } 
                            })}
                          />
                          {errors.expiry && (
                            <p className="mt-1 text-sm text-red-600">{errors.expiry.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="cvc" className="block text-sm font-medium text-tactical-700 mb-1">
                            CVC
                          </label>
                          <input
                            id="cvc"
                            type="text"
                            className={`
                              w-full px-3 py-2 border rounded-md text-tactical-900
                              ${errors.cvc ? 'border-red-500' : 'border-gray-300'}
                              focus:outline-none focus:ring-2 focus:ring-tactical-400
                            `}
                            placeholder="123"
                            {...register('cvc', { 
                              required: 'CVC is required',
                              pattern: {
                                value: /^[0-9]{3,4}$/,
                                message: 'Enter a valid CVC'
                              } 
                            })}
                          />
                          {errors.cvc && (
                            <p className="mt-1 text-sm text-red-600">{errors.cvc.message}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevStep}
                        >
                          Back to Schedule
                        </Button>
                        <Button
                          type="submit"
                          variant="accent"
                          isLoading={isLoading}
                        >
                          Complete Booking
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 4: Confirmation */}
            {step === 4 && isBookingComplete && (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="font-heading text-2xl font-bold text-tactical-900 mb-4">
                  Booking Confirmed!
                </h1>
                <p className="text-tactical-700 mb-8 max-w-lg mx-auto">
                  Your booking for {selectedCourse.title} has been confirmed. You will receive a confirmation email with all the details shortly.
                </p>
                
                <div className="bg-tactical-50 p-6 rounded-lg max-w-md mx-auto mb-8">
                  <h3 className="font-semibold text-tactical-900 mb-4">Booking Summary</h3>
                  <div className="flex justify-between mb-2">
                    <span className="text-tactical-700">Package:</span>
                    <span className="font-medium">{selectedCourse.title}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-tactical-700">Dates:</span>
                    <span className="font-medium">
                      {formatDateStr(new Date(selectedDate!.startDate))} to {formatDateStr(new Date(selectedDate!.endDate))}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-tactical-700">Location:</span>
                    <span className="font-medium">S-Arms Shooting Range, Tallinn</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-tactical-700">Total Paid:</span>
                    <span className="font-bold">{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    variant="primary"
                    onClick={() => navigate('/dashboard')}
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.print()}
                  >
                    Print Receipt
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BookingFlow;