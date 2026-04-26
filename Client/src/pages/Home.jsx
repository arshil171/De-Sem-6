// import { useState } from "react";
// import {
//   GoogleMap,
//   LoadScript,
//   DirectionsRenderer,
//   Marker,
// } from "@react-google-maps/api";

// const BookingForm = () => {
//   const [pickupLocation, setPickupLocation] = useState("");
//   const [destination, setDestination] = useState("");
//   const [bookingStatus, setBookingStatus] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });
//   const [directions, setDirections] = useState(null);
//   const [tractorPosition, setTractorPosition] = useState(null);

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     setMessage({ type: "", text: "" });
//     setDirections(null);
//     setTractorPosition(null);

//     if (pickupLocation && destination) {
//       setBookingStatus(
//         `Booking a tractor from "${pickupLocation}" to "${destination}". Please wait...`
//       );
//       setIsLoading(true);
//       setMessage({
//         type: "info",
//         text: `Booking a tractor from "${pickupLocation}" to "${destination}". Please wait...`,
//       });

//       setTimeout(() => {
//         setBookingStatus(
//           `Tractor booked successfully from "${pickupLocation}" to "${destination}"!`
//         );
//         setIsLoading(false);
//         setMessage({
//           type: "success",
//           text: `Tractor booked successfully from "${pickupLocation}" to "${destination}"!`,
//         });

//         // Get directions
//         const directionsService = new window.google.maps.DirectionsService();
//         directionsService.route(
//           {
//             origin: pickupLocation,
//             destination: destination,
//             travelMode: window.google.maps.TravelMode.DRIVING,
//           },
//           (result, status) => {
//             if (status === "OK") {
//               setDirections(result);

//               // Animate tractor along the route
//               const route = result.routes[0].overview_path;
//               let step = 0;
//               setTractorPosition(route[0].toJSON());

//               const interval = setInterval(() => {
//                 step++;
//                 if (step < route.length) {
//                   setTractorPosition(route[step].toJSON());
//                 } else {
//                   clearInterval(interval);
//                 }
//               }, 500); // move every 0.5s
//             } else {
//               console.error(`Error fetching directions: ${status}`);
//             }
//           }
//         );
//       }, 2000);
//     } else {
//       setBookingStatus("Please enter both pickup and destination locations.");
//       setMessage({
//         type: "error",
//         text: "Please enter both pickup and destination locations.",
//       });
//     }
//   };

//   const messageClasses = {
//     success: "bg-green-100 text-green-700 border border-green-300",
//     error: "bg-red-100 text-red-700 border border-red-300",
//     info: "bg-blue-100 text-blue-700 border border-blue-300",
//   };

//   return (
//     <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
//       <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
//         Book a Tractor
//       </h2>

//       {/* Booking Form */}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label
//             htmlFor="pickup"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Pickup Point:
//           </label>
//           <input
//             type="text"
//             id="pickup"
//             value={pickupLocation}
//             onChange={(e) => setPickupLocation(e.target.value)}
//             placeholder="Enter pickup location"
//             disabled={isLoading}
//             className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
//             required
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="destination"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Where to?
//           </label>
//           <input
//             type="text"
//             id="destination"
//             value={destination}
//             onChange={(e) => setDestination(e.target.value)}
//             placeholder="Enter destination"
//             disabled={isLoading}
//             className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={isLoading}
//           className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
//         >
//           {isLoading ? "Booking..." : "Book Tractor"}
//         </button>
//       </form>

//       {/* Status Message */}
//       {message.text && (
//         <div
//           className={`mt-4 p-3 rounded-lg text-sm ${messageClasses[message.type]}`}
//         >
//           {message.text}
//         </div>
//       )}

//       {/* Google Map (shows after booking) */}
//       {directions && (
//         <div className="mt-6">
//           <LoadScript googleMapsApiKey="">   
//             <GoogleMap
//               mapContainerClassName="h-96 w-full"
//               zoom={12}
//               center={tractorPosition || { lat: 20.5937, lng: 78.9629 }}
//             >
//               <DirectionsRenderer directions={directions} />
//               {tractorPosition && (
//                 <Marker
//                   position={tractorPosition}
//                   icon={{
//                     url: "https://cdn-icons-png.flaticon.com/512/1995/1995574.png",
//                     scaledSize: new window.google.maps.Size(40, 40),
//                   }}
//                 />
//               )}
//             </GoogleMap>
//           </LoadScript>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookingForm;








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
      <nav className="bg-green-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tractor Booking</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#" className="hover:underline">Bookings</a></li>
              <li><a href="#" className="hover:underline">Help</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
              <li><a href="#" className="hover:underline">About US</a></li>
            </ul>
          </nav>
        </div>
      </nav>


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

      <footer className="bg-gray-800 text-white p-6 mt-8">
        <div className="container mx-auto text-center">
          <p>© 2023 TractorUber. All rights reserved.</p>
          <p className="mt-2 text-sm text-gray-400">Book tractors on demand for your agricultural needs</p>
        </div>
      </footer>
    </div>
  );
};

export default BookingForm;