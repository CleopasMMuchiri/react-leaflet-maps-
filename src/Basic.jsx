import React, { useRef, useState, useEffect } from "react";
import osm_provider from "./osm_provider";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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

const Basic = () => {
  const [center, setCenter] = useState({ lat: -1.287092, lng: 37.103469 });
  const ZOOM_LEVEL = 13;
  const mapRef = useRef();
  console.log("Tile URL:", osm_provider.maptiler.url);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1028); //  Check if mobile
  const [openDrawer, setOpenDrawer] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [selectedChurch, setSelectedChurch] = useState(null);

  const { location, getLocation } = useGeoLocation();

  const userLocationIcon = new L.divIcon({
    className: "user-location-icon",
    iconSize: [15, 15],
    iconAnchor: [15, 50],
    popupAnchor: [-5, -40],
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
          {churches.map((church) => (
            <Marker
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
                Contact: {church.contact} <br />
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
          <Marker
            icon={userLocationIcon}
            position={[location.coordinates.lat, location.coordinates.lng]}
          >
            <Popup>
              <strong>Gotcha</strong>
            </Popup>
          </Marker>
        )}

        <UserLocation
          mapRef={mapRef}
          ZOOM_LEVEL={ZOOM_LEVEL}
          location={location}
          getLocation={getLocation}
        />
      </MapContainer>

      {!isMobile && (
        <>
          <button
            onClick={() => setSidebar(true)}
            className="cursor-pointer fixed top-4 right-4 z-50 text-black p-3 rounded-md shadow-md"
          >
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
          <Sidebar
            open={sidebar}
            setOpen={setSidebar}
            church={selectedChurch}
          />
        </>
      )}

      {isMobile && (
        <>
          <button
            onClick={() => setOpenDrawer(true)}
            className="cursor-pointer fixed top-4 right-4 z-50 text-black p-3 rounded-md shadow-md"
          >
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
          <MobileDrawer
            open={openDrawer}
            setOpen={setOpenDrawer}
            church={selectedChurch}
          />
        </>
      )}
    </div>
  );
};

export default Basic;
