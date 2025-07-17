import React from "react";
import Basic from "./Basic.jsx";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import useMapFetch from "./useMapFetch.js";
import { ToastContainer } from "react-toastify";
import "nprogress/nprogress.css";
const App = () => {
  return (
    <>
      <Basic />
      <ToastContainer />
    </>
  );
};

export default App;
