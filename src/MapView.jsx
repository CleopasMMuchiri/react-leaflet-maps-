import React from "react";
import { userLocationIcon, defaultPin, closeChurchPin } from "./MapIcons";
import osm_provider from "./osm_provider";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Tooltip,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import UserLocation from "./UserLocation";
import { motion, AnimatePresence } from "framer-motion";
const MapView = ({
  center,
  mapRef,
  ZOOM_LEVEL,
  location,
  displayedChurches,
  setSelectedChurch,
  getLocation,
  closestChurch,
  isMobile,
  setOpenDrawer,
  setSidebar,
}) => {
  const getPinIcon = (church) => {
    if (church.distance !== undefined && church.distance < 5) {
      return closeChurchPin;
    }
    return defaultPin;
  };

  return (
    <MapContainer
      center={center}
      zoom={ZOOM_LEVEL}
      ref={mapRef}
      style={{ height: "100vh", width: "100%", zIndex: 10 }}
    >
      <TileLayer
        url={osm_provider.maptiler.url}
        attribution={osm_provider.maptiler.attribution}
      />
      <MarkerClusterGroup>
        {displayedChurches.map((church) => (
          <Marker
            icon={getPinIcon(church)}
            key={church.id}
            position={[church.lat, church.lng]}
            eventHandlers={{
              click: () => {
                setSelectedChurch(church);
                {
                  isMobile ? setOpenDrawer(true) : setSidebar(true);
                }
              },
            }}
          >
            <Popup>
              <strong>{church.churchName}</strong>
              <br />
              <p>Contact: {church.churchContact}</p>
              <br />
              {church.distance !== undefined && (
                <p>Distance: {church.distance.toFixed(1)} km</p>
              )}
              <br />
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${church.lat},${church.lng}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Directions
              </a>
            </Popup>
            <Tooltip
              direction="right" // top, right, bottom, left, center, auto
              permanent // makes it always visible
              sticky // makes it follow the mouse
              opacity={0.9}
            >
              {church.churchName}
            </Tooltip>
          </Marker>
        ))}
      </MarkerClusterGroup>

      {location.loaded && !location.error && (
        <>
          <Circle
            center={[location.coordinates.lat, location.coordinates.lng]}
            radius={5000}
            pathOptions={{ fillColor: "green", color: "blue" }}
          />
          <Marker
            icon={userLocationIcon}
            position={[location.coordinates.lat, location.coordinates.lng]}
          >
            <Popup>
              <strong>You are here</strong>
            </Popup>
          </Marker>
        </>
      )}

      <UserLocation
        mapRef={mapRef}
        ZOOM_LEVEL={ZOOM_LEVEL}
        location={location}
        getLocation={getLocation}
      />

      {closestChurch && location.loaded && (
        <AnimatePresence>
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
            className="fixed bottom-2 bg-white p-4 rounded-md shadow-lg z-[1000] flex flex-col gap-4"
          >
            <div>
              <p className="font-semibold">
                Closest Church: {closestChurch.churchName}
              </p>
              <p className="text-sm text-gray-600">
                Approximately {closestChurch.distance.toFixed(1)} km away
              </p>
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${closestChurch.lat},${closestChurch.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold underline"
            >
              <button className="hover:underline cursor-pointer">
                Get Directions
              </button>
            </a>
          </motion.div>
        </AnimatePresence>
      )}
    </MapContainer>
  );
};

export default MapView;
