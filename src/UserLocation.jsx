import { faCrosshairs } from "@fortawesome/free-solid-svg-icons/faCrosshairs";
import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { flyToChurch } from "./mapUtils";
import { toast } from "react-toastify";
import NProgress from "nprogress";

const UserLocation = ({ mapRef, ZOOM_LEVEL, location, getLocation }) => {
  useEffect(() => {
    if (location.loaded && !location.error) {
      const userLocation = {
        lat: location.coordinates.lat,
        lng: location.coordinates.lng,
      };
      flyToChurch(mapRef, userLocation, () => {}, ZOOM_LEVEL);
    }
  }, [location, mapRef, ZOOM_LEVEL]);

  useEffect(() => {
    if (location.loading) {
      NProgress.start();
    } else if (location.loaded) {
      NProgress.done();
    } else if (location.error) {
      toast.info("Failed to Locate you");
    }
  }, [location]);

  const handleClick = () => {
    getLocation();
  };

  return (
    <>
      <button
        onClick={handleClick}
        title="Locate Me"
        className="cursor-pointer fixed bottom-8 right-4 z-[10000] bg-white text-black p-2 rounded-full shadow-md hover:scale-105 transition-transform"
      >
        <FontAwesomeIcon icon={faCrosshairs} className="text-xl" />
      </button>
    </>
  );
};

export default UserLocation;
