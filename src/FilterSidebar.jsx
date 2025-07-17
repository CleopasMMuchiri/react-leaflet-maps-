import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleRight,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import useMapFetch from "./useMapFetch";
import { flyToChurch } from "./mapUtils";
import noData from "./assets/NoData.png";
import failed from "./assets/Failed.png";

const Sidebar = ({ open, setOpen, mapRef, setSelectedChurch }) => {
  const { mapData, loading, error } = useMapFetch();
  const regions = [...new Set(mapData.map((church) => church.region))];
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [filteredChurches, setFilteredChurches] = useState([]);

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
    const regionChurches = mapData.filter((church) => church.region === region);

    setFilteredChurches(regionChurches);
  };

  const handleChurchClick = (church) => {
    flyToChurch(mapRef, church, setSelectedChurch);
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [open]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);

    // cleanup on unmount
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/60 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="fixed top-0 right-0 h-full w-[80vw] max-w-[400px] bg-white shadow-lg z-50"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 p-2 w-full flex justify-between items-center">
              <motion.button
                onClick={() => setOpen(false)}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer p-2 rounded-full transition-colors text-black shadow-lg"
                aria-label="Close Sidebar"
              >
                <FontAwesomeIcon
                  icon={faChevronCircleRight}
                  className="text-xl"
                />
              </motion.button>

              <h2 className="font-bold  md:text-lg lg:text-xl mb-2">
                Select Via Region
              </h2>
            </div>

            {loading ? (
              <div className="h-full w-full flex items-center justify-center text-gray-500">
                <p>Loading church data...</p>
              </div>
            ) : error ? (
              <div className="h-full w-full flex items-center justify-center ">
                <img
                  className="w-3/4 max-w-[250px] h-auto"
                  src={failed}
                  alt="failed to load data"
                />
              </div>
            ) : regions.length === 0 ? (
              <div className="h-full w-full flex items-center justify-center ">
                <img
                  className="w-3/4 max-w-[250px] h-auto"
                  src={noData}
                  alt="failed to load data"
                />
              </div>
            ) : (
              <>
                {regions.map((region) => (
                  <div className="flex flex-col gap-2 px-2" key={region}>
                    <button
                      className="px-4 py-2 rounded-lg flex justify-between items-center w-full cursor-pointer font-semibold hover:bg-gray-300/75 transition-colors duration-200"
                      onClick={() =>
                        setSelectedRegion(
                          selectedRegion === region ? null : region
                        )
                      }
                    >
                      {region}

                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`transition-transform duration-300 ${
                          selectedRegion === region ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>

                    {selectedRegion === region && (
                      <ul className="px-4 pb-2  space-y-1">
                        {mapData
                          .filter((church) => church.region === region)
                          .map((church) => (
                            <li
                              key={church.id}
                              className="cursor-pointer text-blue-700 hover:underline"
                              onClick={() => handleChurchClick(church)}
                            >
                              {church.churchName}
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                ))}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
