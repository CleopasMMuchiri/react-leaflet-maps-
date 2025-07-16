import React, { useRef, useState, useEffect } from "react";
import osm_provider from "./osm_provider";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import churches from "./churches.json";
import MarkerClusterGroup from "react-leaflet-markercluster";
import MobileDrawer from "./Drawer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "./Sidebar";
import UserLocation from "./UserLocation";
import useGeoLocation from "./useGeoLocation";
import L from "leaflet";
import getDistance from "geolib/es/getPreciseDistance";
import userLocationPin from "./assets/map-pin-solid.svg";
import defaultPinLocator from "./assets/location-pin-solid.svg";
import nearPin from "./assets/location-dot-solid.svg";
import { motion, AnimatePresence } from "framer-motion";
import Search from "./Search";
import Filter from "./Filter";
import FilterSidebar from "./FilterSidebar";

const Basic = () => {
  const [center, setCenter] = useState({ lat: -1.287092, lng: 37.103469 });
  const ZOOM_LEVEL = 13;
  const mapRef = useRef();
  console.log("Tile URL:", osm_provider.maptiler.url);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1028); //  Check if mobile
  const [openDrawer, setOpenDrawer] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [filterSidebar, setFilterSidebar] = useState(false);
  const [selectedChurch, setSelectedChurch] = useState(null);
  const [churchesWithDistance, setChurchesWithDistance] = useState([]);
  const [closestChurch, setClosestChurch] = useState(null);

  const { location, getLocation } = useGeoLocation();

  const userLocationIcon = new L.Icon({
    iconUrl: userLocationPin,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

  const defaultPin = new L.Icon({
    iconUrl: defaultPinLocator,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

  const closeChurchPin = new L.Icon({
    iconUrl: nearPin,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
  // ✅ Update state when screen resizes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1028);
      if (window.innerWidth >= 1028) {
        setOpenDrawer(false); // Close drawer on desktop
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (location.loaded && !location.error) {
      const updated = churches.map((church) => {
        const distance = getDistance(
          {
            latitude: location.coordinates.lat,
            longitude: location.coordinates.lng,
          },
          {
            latitude: church.lat,
            longitude: church.lng,
          }
        );

        return {
          ...church,
          distance: distance / 1000,
        };
      });

      const sorted = updated.sort((a, b) => a.distance - b.distance);
      setChurchesWithDistance(updated);
      setClosestChurch(sorted[0]);
    }
  }, [location]);

  const displayedChurches =
    churchesWithDistance.length > 0 ? churchesWithDistance : churches;
  return (
    <div className="row">
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
              icon={
                church.distance !== undefined && church.distance < 5
                  ? closeChurchPin
                  : defaultPin
              }
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
                <strong>{church.name}</strong>
                <br />
                <p>Contact: {church.contact}</p>
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
                  Closest Church: {closestChurch.name}
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
                  Let’s Go to Church
                </button>
              </a>
            </motion.div>
          </AnimatePresence>
        )}
      </MapContainer>

      {!isMobile && (
        <Sidebar open={sidebar} setOpen={setSidebar} church={selectedChurch} />
      )}

      {isMobile && (
        <MobileDrawer
          open={openDrawer}
          setOpen={setOpenDrawer}
          church={selectedChurch}
        />
      )}

      <div className="fixed top-4 right-4 z-50 flex flex-wrap gap-2">
        <Search
          churches={displayedChurches}
          setSelectedChurch={setSelectedChurch}
          mapRef={mapRef}
        />
        <Filter setOpen={setFilterSidebar} />
      </div>

      <FilterSidebar
        open={filterSidebar}
        setOpen={setFilterSidebar}
        mapRef={mapRef}
        setSelectedChurch={setSelectedChurch}
      />
    </div>
  );
};

export default Basic;
