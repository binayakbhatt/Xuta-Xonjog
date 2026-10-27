import React, { useState } from 'react';
import { Printer, Save, Package, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [activeTab, setActiveTab] = useState('booking');
  const [toast, setToast] = useState(null);

  // Booking Form State
  const [booking, setBooking] = useState({
    date: new Date().toISOString().split('T')[0],
    supplierName: '',
    customerName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'Assam',
    pinCode: '',
    sku: '',
    productDescription: '',
    totalPrice: '',
    bookingAmount: '',
  });

  // Dispatch Form State
  const [dispatch, setDispatch] = useState({
    orderId: '',
    trackingId: '',
    weight: '',
    bnplCustomerId: '',
  });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      // Supabase insertion logic
      const { data, error } = await supabase.from('bookings').insert([booking]);
      if (error) throw error;
      
      showToast('Booking successfully saved to database!');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleDispatchSubmit = async (e) => {
    e.preventDefault();
    
    // India Post Tracking ID Validation (e.g., EE123456789IN)
    const trackingRegex = /^[A-Z]{2}[0-9]{9}[A-Z]{2}$/;
    if (!trackingRegex.test(dispatch.trackingId)) {
      showToast('Invalid India Post Tracking ID format (e.g., EE123456789IN)', 'error');
      return;
    }

    try {
      // Supabase update logic
      const { data, error } = await supabase.from('dispatches').insert([dispatch]);
      if (error) throw error;

      showToast('Dispatch details updated securely!');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Toast Notification (Hidden on Print) */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg flex items-center gap-2 text-white print-hide ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header (Hidden on Print) */}
      <header className="bg-red-700 text-white p-4 shadow-md print-hide">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package /> Xuta Xonjog System
          </h1>
          <div className="text-sm opacity-80">India Post - Dhemaji Sub-Division</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 mt-6">
        
        {/* Tabs (Hidden on Print) */}
        <div className="flex border-b border-gray-300 mb-6 print-hide">
          <button
            className={`py-2 px-6 font-semibold flex items-center gap-2 ${activeTab === 'booking' ? 'border-b-2 border-red-600 text-red-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('booking')}
          >
            <Package size={18} /> Booking Entry
          </button>
          <button
            className={`py-2 px-6 font-semibold flex items-center gap-2 ${activeTab === 'dispatch' ? 'border-b-2 border-red-600 text-red-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('dispatch')}
          >
            <Send size={18} /> Dispatch Update
          </button>
        </div>

        {/* BOOKING TAB */}
        {activeTab === 'booking' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            {/* Printable Receipt Header (Only visible on print) */}
            <div className="hidden print:block text-center mb-8 border-b-2 border-gray-800 pb-4">
               <h1 className="text-3xl font-bold">INDIA POST</h1>
               <h2 className="text-xl">Xuta Xonjog - Booking Receipt</h2>
               <p>Dhemaji Sub-Division</p>
            </div>

            <form onSubmit={handleBookingSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date & Supplier */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold mb-1">Date</label>
                  <input type="date" className="border rounded p-2" value={booking.date} onChange={e => setBooking({...booking, date: e.target.value})} required />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold mb-1">Supplier / Weaver Name</label>
                  <input type="text" className="border rounded p-2" placeholder="e.g. Rumi Gogoi" value={booking.supplierName} onChange={e => setBooking({...booking, supplierName: e.target.value})} required />
                </div>

                {/* Customer Details */}
                <div className="flex flex-col md:col-span-2 mt-4">
                  <h3 className="font-bold border-b pb-1 mb-2">Customer & Address Details</h3>
                </div>
                
                <div className="flex flex-col md:col-span-2">
                  <label className="text-sm font-semibold mb-1">Customer Full Name</label>
                  <input type="text" className="border rounded p-2" value={booking.customerName} onChange={e => setBooking({...booking, customerName: e.target.value})} required />
                </div>
                
                <div className="flex flex-col md:col-span-2">
                  <label className="text-sm font-semibold mb-1">Address Line 1 (House No, Street, Village)</label>
                  <input type="text" className="border rounded p-2" value={booking.addressLine1} onChange={e => setBooking({...booking, addressLine1: e.target.value})} required />
                </div>

                <div className="flex flex-col md:col-span-2">
                  <label className="text-sm font-semibold mb-1">Address Line 2 (Landmark, Area)</label>
                  <input type="text" className="border rounded p-2" value={booking.addressLine2} onChange={e => setBooking({...booking, addressLine2: e.target.value})} />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold mb-1">City / Town</label>
                  <input type="text" className="border rounded p-2" value={booking.city} onChange={e => setBooking({...booking, city: e.target.value})} required />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold mb-1">PIN Code</label>
                  <input type="text" maxLength="6" pattern="[0-9]{6}" className="border rounded p-2" placeholder="6 Digits" value={booking.pinCode} onChange={e => setBooking({...booking, pinCode: e.target.value})} required />
                </div>

                {/* Product Details */}
                <div className="flex flex-col md:col-span-2 mt-4">
                  <h3 className="font-bold border-b pb-1 mb-2">Product & Payment</h3>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold mb-1">SKU Number</label>
                  <input type="text" className="border rounded p-2" value={booking.sku} onChange={e => setBooking({...booking, sku: e.target.value})} required />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold mb-1">Product Description</label>
                  <input type="text" className="border rounded p-2" value={booking.productDescription} onChange={e => setBooking({...booking, productDescription: e.target.value})} required />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold mb-1">Total Product Price (₹)</label>
                  <input type="number" className="border rounded p-2" value={booking.totalPrice} onChange={e => setBooking({...booking, totalPrice: e.target.value})} required />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold mb-1 text-red-700">Booking Amount Collected (₹)</label>
                  <input type="number" className="border rounded p-2 border-red-300 bg-red-50" value={booking.bookingAmount} onChange={e => setBooking({...booking, bookingAmount: e.target.value})} required />
                </div>
              </div>

              {/* Action Buttons (Hidden on Print) */}
              <div className="mt-8 flex gap-4 print-hide">
                <button type="submit" className="bg-red-700 hover:bg-red-800 text-white py-2 px-6 rounded-md font-semibold flex items-center gap-2 transition-colors">
                  <Save size={18} /> Save to Database
                </button>
                <button type="button" onClick={handlePrint} className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-md font-semibold flex items-center gap-2 transition-colors">
                  <Printer size={18} /> Print Receipt
                </button>
              </div>
              
              {/* Receipt Footer (Only visible on print) */}
              <div className="hidden print:block mt-16 flex justify-between text-sm border-t pt-4">
                 <div>
                    <p>_______________________</p>
                    <p className="mt-1">Customer Signature</p>
                 </div>
                 <div className="text-right">
                    <p>_______________________</p>
                    <p className="mt-1">Counter PA Signature</p>
                 </div>
              </div>

            </form>
          </div>
        )}

        {/* DISPATCH TAB */}
        {activeTab === 'dispatch' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 print-hide">
            <h2 className="text-xl font-bold mb-6 border-b pb-2">Update Dispatch Details</h2>
            <form onSubmit={handleDispatchSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="flex flex-col md:col-span-2">
                  <label className="text-sm font-semibold mb-1">System Order ID</label>
                  <input type="text" className="border rounded p-2" placeholder="Enter Booking Order ID" value={dispatch.orderId} onChange={e => setDispatch({...dispatch, orderId: e.target.value})} required />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold mb-1">India Post Tracking ID</label>
                  <input type="text" className="border rounded p-2 uppercase" placeholder="e.g. EE123456789IN" value={dispatch.trackingId} onChange={e => setDispatch({...dispatch, trackingId: e.target.value.toUpperCase()})} required />
                  <span className="text-xs text-gray-500 mt-1">Format: 13-character alphanumeric</span>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold mb-1">Parcel Weight (in grams)</label>
                  <input type="number" className="border rounded p-2" placeholder="e.g. 500" value={dispatch.weight} onChange={e => setDispatch({...dispatch, weight: e.target.value})} required />
                </div>

                <div className="flex flex-col md:col-span-2">
                  <label className="text-sm font-semibold mb-1">BNPL / Advance Customer ID</label>
                  <input type="text" className="border rounded p-2" placeholder="Enter BNPL ID (if applicable)" value={dispatch.bnplCustomerId} onChange={e => setDispatch({...dispatch, bnplCustomerId: e.target.value})} />
                </div>

              </div>

              <div className="mt-8 flex gap-4">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-semibold flex items-center gap-2 transition-colors">
                  <Send size={18} /> Update Dispatch
                </button>
              </div>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}
