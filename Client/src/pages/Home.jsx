import React, { useState, useEffect } from 'react';

const BookingForm = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [tractors, setTractors] = useState([]);
  const [selectedTractor, setSelectedTractor] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Mock tractor data
  useEffect(() => {
    const mockTractors = [
      { id: 1, name: 'John Deere 5075E', price: 120, eta: '5 min', position: { lat: 40.7128, lng: -74.0060 } },
      { id: 2, name: 'Massey Ferguson 5713', price: 135, eta: '7 min', position: { lat: 40.7228, lng: -74.0160 } },
      { id: 3, name: 'New Holland T6', price: 110, eta: '10 min', position: { lat: 40.7028, lng: -74.0060 } },
    ];
    setTractors(mockTractors);
  }, []);

  const handleBookTractor = (tractor) => {
    setSelectedTractor(tractor);
  };

  const confirmBooking = () => {
    setBookingConfirmed(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Form */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-green-800">Book a Tractor</h2>
            
            {!bookingConfirmed ? (
              <>
                <div className="mb-4">
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="Enter pickup location"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div className="mb-6">
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Where to?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                {pickup && destination && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Available Tractors</h3>
                    <div className="space-y-4">
                      {tractors.map(tractor => (
                        <div key={tractor.id} className="border border-gray-200 rounded-lg p-4 hover:bg-green-50 transition-colors">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold">{tractor.name}</h4>
                              <p className="text-sm text-gray-600">ETA: {tractor.eta}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">${tractor.price}</p>
                              <button
                                onClick={() => handleBookTractor(tractor)}
                                className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                              >
                                Book
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedTractor && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-lg mb-2">Confirm Your Booking</h3>
                    <p className="mb-2"><span className="font-semibold">Tractor:</span> {selectedTractor.name}</p>
                    <p className="mb-2"><span className="font-semibold">Price:</span> ${selectedTractor.price}</p>
                    <p className="mb-4"><span className="font-semibold">ETA:</span> {selectedTractor.eta}</p>
                    <button
                      onClick={confirmBooking}
                      className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors font-semibold"
                    >
                      Confirm Tractor Booking
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-green-600 text-5xl mb-4">✓</div>
                <h3 className="text-2xl font-semibold mb-2">Booking Confirmed!</h3>
                <p className="mb-4">Your {selectedTractor.name} is on the way.</p>
                <p className="mb-4">ETA: {selectedTractor.eta}</p>
                <button
                  onClick={() => {
                    setBookingConfirmed(false);
                    setSelectedTractor(null);
                    setPickup('');
                    setDestination('');
                  }}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Book Another Tractor
                </button>
              </div>
            )}
          </div>
          
          {/* Map */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-green-800">Map View</h2>
            <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-600">
                <p className="text-xl mb-2">Map would be displayed here</p>
                <p className="text-sm">In a real application, this would show an interactive map</p>
                <p className="text-sm">with available tractors and your selected route.</p>
                
                {/* Simple map representation */}
                <div className="relative mt-8 mx-auto w-64 h-48 bg-blue-50 border border-blue-200 rounded">
                  {/* Route line */}
                  <div className="absolute top-1/2 left-4 right-4 h-1 bg-blue-500"></div>
                  
                  {/* Pickup marker */}
                  <div className="absolute top-1/2 left-8 transform -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full"></div>
                  <div className="absolute top-1/2 left-6 transform -translate-y-full -mt-2 text-xs font-semibold">Pickup</div>
                  
                  {/* Destination marker */}
                  <div className="absolute top-1/2 right-8 transform -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full"></div>
                  <div className="absolute top-1/2 right-6 transform -translate-y-full -mt-2 text-xs font-semibold">Destination</div>
                  
                  {/* Tractor markers */}
                  <div className="absolute top-1/3 left-1/3 transform -translate-y-1/2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold">T</div>
                  <div className="absolute top-2/3 left-1/2 transform -translate-y-1/2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold">T</div>
                  <div className="absolute top-3/4 right-1/4 transform -translate-y-1/2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold">T</div>
                </div>
              </div>
            </div>
            
            {selectedTractor && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold mb-2">Selected Tractor Location</h3>
                <p>{selectedTractor.name} is located at coordinates:</p>
                <p className="text-sm">Lat: {selectedTractor.position.lat}, Lng: {selectedTractor.position.lng}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingForm;