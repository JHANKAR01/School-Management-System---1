import { useState, useEffect } from 'react';

interface Coords {
  lat: number;
  lng: number;
}

export const useGeofencing = (schoolLocation: Coords, radiusMeters: number = 50) => {
  const [isWithinFence, setIsWithinFence] = useState<boolean>(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [isMockLocation, setIsMockLocation] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Haversine formula to calculate distance between two points in meters
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      setLoading(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy, altitude, altitudeAccuracy } = position.coords;
        
        // 1. Mock Location Detection Heuristics (Basic)
        // On Android Native, we'd use `isFromMockProvider`. 
        // On Web, we check if accuracy is suspiciously perfect or altitude is missing/perfect.
        // This is a "Tier 3" heuristic.
        let isMock = false;
        if (accuracy === 0) isMock = true; // Suspicious
        // if (altitude === null && altitudeAccuracy === null) isMock = true; // Often missing in simple mocks

        setIsMockLocation(isMock);

        // 2. Geofence Calculation
        const dist = calculateDistance(
          latitude, 
          longitude, 
          schoolLocation.lat, 
          schoolLocation.lng
        );
        
        setDistance(dist);
        setIsWithinFence(dist <= radiusMeters);
        setLoading(false);
      },
      (error) => {
        console.error("Error obtaining location", error);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [schoolLocation, radiusMeters]);

  return { isWithinFence, distance, isMockLocation, loading };
};
