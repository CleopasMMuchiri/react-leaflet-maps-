import React, { useCallback, useState } from "react";

const useGeoLocation = () => {
  const [location, setLocation] = useState({
    loading: false,
    loaded: false,
    coordinates: { lat: "", lng: "" },
    error: null,
  });

  const onSuccess = (location) => {
    setLocation({
      loaded: true,
      loading: false,
      coordinates: {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      },
      error: null,
    });
  };

  const onError = (error) => {
    setLocation({
      loaded: true,
      loading: false,
      coordinates: { lat: "", lng: "" },
      error,
    });
  };

  const getLocation = useCallback(() => {
    setLocation((prev) => ({ ...prev, loading: true }));
    if (!("geolocation" in navigator)) {
      onError({
        code: 0,
        message: "Geolocation not supported",
      });
      return;
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);

  return { location, getLocation };
};

export default useGeoLocation;
