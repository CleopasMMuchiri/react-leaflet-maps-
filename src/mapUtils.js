export const flyToChurch = (mapRef, church, setSelectedChurch, zoom = 16) => {
  if (mapRef.current && church) {
    mapRef.current.flyTo([church.lat, church.lng], zoom, { animate: true });
    setSelectedChurch(church);
  }
};
