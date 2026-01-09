import React, { useEffect, useState, useRef } from 'react';
import { BusLocation } from '../../../../types';

// Mock Route Path (Simple generic route)
const BUS_ROUTE = [
  [28.6139, 77.2090], // Start
  [28.6145, 77.2100],
  [28.6150, 77.2110],
  [28.6160, 77.2120], // School
];

export default function TransportTracking() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const busMarker = useRef<any>(null);
  const [currentLocation, setCurrentLocation] = useState<BusLocation>({
    busId: 'Bus-1A',
    lat: 28.6139,
    lng: 77.2090,
    speed: 40,
    timestamp: Date.now()
  });

  // Initialize Map
  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current && !mapInstance.current) {
      // @ts-ignore - Leaflet loaded via CDN in index.html
      const L = window.L;

      const map = L.map(mapRef.current).setView([28.6139, 77.2090], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // School Marker
      L.marker([28.6160, 77.2120])
        .addTo(map)
        .bindPopup("Greenwood High School")
        .openPopup();

      // Bus Icon
      const busIcon = L.divIcon({
        className: 'custom-bus-icon',
        html: '<div style="background-color: #FBBF24; width: 30px; height: 30px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">🚌</div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      busMarker.current = L.marker([28.6139, 77.2090], { icon: busIcon }).addTo(map);
      mapInstance.current = map;
    }
  }, []);

  // Simulate Live Movement
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLocation(prev => {
        const nextLat = prev.lat + 0.0001;
        const nextLng = prev.lng + 0.0001;
        
        // Update Marker
        if (busMarker.current && typeof window !== 'undefined') {
          // @ts-ignore
          const L = window.L;
          const newLatLng = new L.LatLng(nextLat, nextLng);
          busMarker.current.setLatLng(newLatLng);
          
          if (mapInstance.current) {
            mapInstance.current.panTo(newLatLng);
          }
        }

        return {
          ...prev,
          lat: nextLat,
          lng: nextLng,
          timestamp: Date.now()
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-gray-100 p-4 rounded-xl">
      <div className="bg-white p-4 rounded-t-xl shadow-sm border-b z-10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Route 1A: Morning Pickup</h2>
            <p className="text-sm text-green-600 font-medium animate-pulse">
              ● Live Status: Moving ({currentLocation.speed} km/h)
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">ETA to Home</p>
            <p className="text-xl font-bold text-indigo-600">12 mins</p>
          </div>
        </div>
      </div>
      
      <div 
        ref={mapRef} 
        className="flex-1 w-full rounded-b-xl shadow-inner border border-gray-300 z-0" 
        style={{ minHeight: '400px' }}
      />

      <div className="mt-2 text-center text-xs text-gray-400">
        Powered by OpenStreetMap • Sovereign Tracking
      </div>
    </div>
  );
}
