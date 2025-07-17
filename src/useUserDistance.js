import { useState, useEffect, useRef } from "react";
import getDistance from "geolib/es/getPreciseDistance";

const CACHE_KEY = "church_distance_cache";
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes
const ORS_LIMIT = 3;

const useUserDistance = (location, mapData) => {
  const [churchesWithDistance, setChurchesWithDistance] = useState([]);
  const [closestChurch, setClosestChurch] = useState(null);
  const lastRefreshTimeRef = useRef(0);

  const calculateGeolibDistances = () => {
    return mapData.map((church) => ({
      ...church,
      distance:
        getDistance(location.coordinates, {
          latitude: church.lat,
          longitude: church.lng,
        }) / 1000, // km
    }));
  };

  const updateThreeClosestWithORS = async (baseDistances) => {
    const sorted = [...baseDistances].sort((a, b) => a.distance - b.distance);
    const closestThree = sorted.slice(0, ORS_LIMIT);

    const body = {
      locations: [
        [location.coordinates.lng, location.coordinates.lat],
        ...closestThree.map((c) => [c.lng, c.lat]),
      ],
      metrics: ["distance"],
      units: "km",
    };

    try {
      const res = await fetch(
        "https://api.openrouteservice.org/v2/matrix/driving-car",
        {
          method: "POST",
          headers: {
            Authorization: "", // ADD YOUR API KEY
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();
      const distances = data.distances?.[0]?.slice(1) || [];

      if (distances.length !== closestThree.length)
        throw new Error("Distance mismatch from ORS");

      const updated = baseDistances.map((church) => {
        const index = closestThree.findIndex((c) => c.id === church.id);
        return index !== -1
          ? { ...church, distance: distances[index] }
          : church;
      });

      return updated;
    } catch (error) {
      console.warn("ORS failed for top 3, keeping fallback only:", error);
      return baseDistances;
    }
  };

  useEffect(() => {
    if (!location.loaded || location.error || mapData.length === 0) return;

    const now = Date.now();

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { timestamp, data, userLocation } = JSON.parse(cached);
      const cacheAge = now - timestamp;

      const userMovedFar =
        getDistance(userLocation, location.coordinates) > 3000; // 3km

      if (cacheAge < CACHE_TTL && !userMovedFar) {
        setChurchesWithDistance(data);
        setClosestChurch(data.sort((a, b) => a.distance - b.distance)[0]);
        return;
      }
    }

    const fetchAndUpdate = async () => {
      const fallbackDistances = calculateGeolibDistances();
      const updated = await updateThreeClosestWithORS(fallbackDistances);

      setChurchesWithDistance(updated);
      setClosestChurch(updated.sort((a, b) => a.distance - b.distance)[0]);

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          data: updated,
          userLocation: location.coordinates,
        })
      );
    };

    fetchAndUpdate();
    lastRefreshTimeRef.current = now;

    const interval = setInterval(() => {
      if (Date.now() - lastRefreshTimeRef.current >= CACHE_TTL) {
        fetchAndUpdate();
        lastRefreshTimeRef.current = Date.now();
      }
    }, 5 * 60 * 1000); // Check every 5 mins

    return () => clearInterval(interval);
  }, [location, mapData]);

  return { churchesWithDistance, closestChurch };
};

export default useUserDistance;
