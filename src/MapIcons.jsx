// utils/mapIcons.js
import L from "leaflet";
import userLocationPin from "./assets/map-pin-solid.svg";
import defaultPinLocator from "./assets/location-pin-solid.svg";
import nearPin from "./assets/location-dot-solid.svg";

export const userLocationIcon = new L.Icon({
  iconUrl: userLocationPin,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});
export const defaultPin = new L.Icon({
  iconUrl: defaultPinLocator,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});
export const closeChurchPin = new L.Icon({
  iconUrl: nearPin,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});
