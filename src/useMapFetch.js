import { useEffect, useState } from "react";
import client from "./contentfulClient.js"; // Assuming you have a client instance
import NProgress from "nprogress";

const useMapFetch = () => {
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      NProgress.start();
      try {
        const response = await client.getEntries({
          content_type: "churchMapData",
        });

        console.log("Map data is:", response);

        const formattedData = response.items.map((item) => ({
          id: item.sys.id, // Keep the unique system ID
          slug: item.fields.slug || null, // Use only the slug field for navigation
          churchName: item.fields.churchName || "Untitled",
          region: item.fields.region || "Unknown region",
          lat: item.fields.location?.lat || 0,
          lng: item.fields.location?.lon || 0,
          landmark: item.fields.landmark || "No Landmark Near Here",
          churchContact: item.fields.churchContact || "",
          churchImage: item.fields.churchImage?.fields?.file?.url
            ? `https:${item.fields.churchImage.fields.file.url}`
            : "default-image-url.jpg",
          services:
            item.fields.services?.map((service) => ({
              day: service.fields.day,
              time: service.fields.time,
              type: service.fields.type,
            })) || [],
          additionalInfo: item.fields.additionalInfo || null,
        }));

        setMapData(formattedData);
      } catch (err) {
        setError(err.message || "Failed to fetch mapData.");
      } finally {
        setLoading(false);
        NProgress.done();
      }
    };

    fetchData();
  }, []);

  return { mapData, loading, error };
};

export default useMapFetch;
