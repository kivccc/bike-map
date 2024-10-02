import { useEffect, useState } from "react";

interface GeoLocation {
  lat: number;
  lng: number;
}

export default function useGeoLocation() {
  const [location, setLocation] = useState<GeoLocation | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          console.error(err.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return location;
}
