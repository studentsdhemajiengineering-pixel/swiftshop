
'use client';

import { useState, useEffect } from 'react';

export function useGeolocation() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });
    };

    const handleError = (error: GeolocationPositionError) => {
      setError(`Error getting location: ${error.message}`);
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  }, []);

  useEffect(() => {
    if (location) {
      const fetchAddress = async () => {
        try {
          const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
          if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE' || apiKey === 'DUMMY_API_KEY_FOR_TESTING') {
            console.warn('Google Maps API key is not configured. Please add it to your .env file.');
            setAddress('Please configure API Key');
            setLoading(false);
            return;
          }

          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${apiKey}`
          );

          const data = await response.json();

          if (data.status === 'OK' && data.results[0]) {
            const formattedAddress = data.results[0].formatted_address;
            setAddress(formattedAddress);
          } else {
            setError(`Geocoding failed: ${data.status}`);
          }
        } catch (err) {
          setError('Failed to fetch address');
        } finally {
          setLoading(false);
        }
      };

      fetchAddress();
    }
  }, [location]);

  return { location, address, loading, error };
}
