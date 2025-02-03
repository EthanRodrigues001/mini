"use client";

import { useEffect, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

interface UserLocation {
  latitude: number;
  longitude: number;
}

const Map = ({ userLocation }: { userLocation: UserLocation | null }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyC5xlyNAz23Mi0PnEnwO8eqMeNovrxnqms", // Replace with your actual API key
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      zoom={10}
      center={
        userLocation
          ? { lat: userLocation.latitude, lng: userLocation.longitude }
          : { lat: 37.7749, lng: -122.4194 } // Default center (San Francisco)
      }
      mapContainerStyle={{ width: "100%", height: "400px" }}
    >
      {userLocation && (
        <Marker
          position={{ lat: userLocation.latitude, lng: userLocation.longitude }}
        />
      )}
    </GoogleMap>
  );
};

export default function Home() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        () => {
          setError("Unable to retrieve your location.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <div>
      {error && <p>{error}</p>}
      {userLocation ? (
        <>
          <Map userLocation={userLocation} />
          <p>Latitude: {userLocation.latitude}</p>
          <p>Longitude: {userLocation.longitude}</p>
        </>
      ) : (
        <p>Loading location...</p>
      )}
    </div>
  );
}
