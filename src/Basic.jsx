import React, { useRef, useState, useEffect } from "react";
import osm_provider from "./osm_provider";
import { MapContainer, TileLayer } from "react-leaflet";
import { toast } from "react-toastify";
import "leaflet/dist/leaflet.css";
import MobileDrawer from "./Drawer";
import Sidebar from "./Sidebar";
import useGeoLocation from "./useGeoLocation";
import Search from "./Search";
import Filter from "./Filter";
import FilterSidebar from "./FilterSidebar";
import useMapFetch from "./useMapFetch";
import noData from "./assets/NoData.png";
import failed from "./assets/Failed.png";
import useUserDistance from "./useUserDistance";
import useIsMobile from "./useIsMobile";
import MapView from "./MapView";

const Basic = () => {
  const { mapData, loading, error } = useMapFetch();
  const ZOOM_LEVEL = 13;
  const mapRef = useRef();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [filterSidebar, setFilterSidebar] = useState(false);
  const [selectedChurch, setSelectedChurch] = useState(null);
  const { location, getLocation } = useGeoLocation();
  const { churchesWithDistance, closestChurch } = useUserDistance(
    location,
    mapData
  );
  const isMobile = useIsMobile();

  const [center, setCenter] = useState({
    lat: -1.2005474672562824,
    lng: 36.934835698614044,
  });

  useEffect(() => {
    if (error || (!loading && mapData.length === 0)) {
      toast.error("Failed to load Map data, kindly reload the page");
    }
  }, [mapData, loading, error]);

  useEffect(() => {
    if (!loading && !error && mapData.length > 0) {
      const centerCoords = mapData.find(
        (church) => church.slug === "goa-kahawa-wendani"
      );

      if (centerCoords?.lat && centerCoords?.lng) {
        setCenter({
          lat: centerCoords.lat,
          lng: centerCoords.lng,
        });
      }
    }
  }, [mapData, loading, error]);

  const displayedChurches =
    churchesWithDistance.length > 0 ? churchesWithDistance : mapData;

  if (loading) {
    return (
      <MapContainer
        center={center}
        zoom={ZOOM_LEVEL}
        className="w-full h-screen flex flex-col justify-center items-center"
      >
        <TileLayer
          url={osm_provider.maptiler.url}
          attribution={osm_provider.maptiler.attribution}
        />
      </MapContainer>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center ">
        <img className="" src={failed} alt="failed to load data" />
      </div>
    );
  }

  if (mapData.length === 0) {
    return (
      <MapContainer
        center={center}
        zoom={ZOOM_LEVEL}
        className="w-full h-screen flex flex-col justify-center items-center"
      >
        <TileLayer
          url={osm_provider.maptiler.url}
          attribution={osm_provider.maptiler.attribution}
        />
      </MapContainer>
    );
  }

  return (
    <>
      <div className="row">
        {center?.lat && center?.lng ? (
          <MapView
            center={center}
            mapRef={mapRef}
            ZOOM_LEVEL={ZOOM_LEVEL}
            location={location}
            displayedChurches={displayedChurches}
            setSelectedChurch={setSelectedChurch}
            getLocation={getLocation}
            closestChurch={closestChurch}
            isMobile={isMobile}
            setOpenDrawer={setOpenDrawer}
            setSidebar={setSidebar}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center ">
            <img className="" src={noData} alt="failed to load data" />
          </div>
        )}

        {!isMobile && (
          <Sidebar
            open={sidebar}
            setOpen={setSidebar}
            church={selectedChurch}
            loading={loading}
            error={error}
          />
        )}

        {isMobile && (
          <MobileDrawer
            open={openDrawer}
            setOpen={setOpenDrawer}
            church={selectedChurch}
            loading={loading}
            error={error}
          />
        )}

        <div className="fixed top-4 right-4 z-50 flex flex-wrap gap-2">
          <Search
            churches={displayedChurches}
            setSelectedChurch={setSelectedChurch}
            mapRef={mapRef}
            loading={loading}
            error={error}
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
    </>
  );
};

export default Basic;
