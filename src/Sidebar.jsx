import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleLeft,
  faDirections,
  faMapPin,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ open, setOpen, church }) => {
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

  if (!church) return null;

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
            className="h-full w-[80vw] max-w-[400px] bg-white backdrop-blur shadow-xl z-50"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute p-2 w-full flex justify-end">
              <motion.button
                onClick={() => setOpen(false)}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer p-2 rounded-full transition-colors text-white shadow-lg"
                aria-label="Close Sidebar"
              >
                <FontAwesomeIcon
                  icon={faChevronCircleLeft}
                  className="text-xl"
                />
              </motion.button>
            </div>
            <div className="text-black">
              {/* Church Image */}
              <img
                src={church.image || "https://via.placeholder.com/400x200"}
                alt={church.name}
                className="w-full rounded-b-lg  mb-4"
              />

              {/* Title & Top Info */}
              <div className="border-b border-black/20 pb-3 mb-4 px-4 flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h2 className="text-2xl font-semibold">{church.name}</h2>
                  {church.region && (
                    <p className="text-sm border-black/60 flex items-center gap-1">
                      <FontAwesomeIcon icon={faMapPin} />
                      <span>{church.region}</span>
                    </p>
                  )}
                </div>

                {/* Directions Button */}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${church.lat},${church.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.button
                    onClick={() => setOpen(false)}
                    whileTap={{ scale: 0.95 }}
                    className="cursor-pointer rounded-full p-2 text-black shadow-lg bg-gray-200 hover:bg-gray-300"
                    aria-label="Get Directions"
                  >
                    <FontAwesomeIcon icon={faDirections} className="text-xl" />
                  </motion.button>
                </a>
              </div>

              {/* Distance */}
              {church.distance && (
                <div className="mx-4 mb-4 px-4 py-2 flex items-center gap-3 bg-gray-100 rounded-lg shadow">
                  <FontAwesomeIcon icon={faMapPin} className="text-black/70" />
                  <p className="font-medium ">
                    {church.distance.toFixed(1)} km from your location
                  </p>
                </div>
              )}

              {/* Contact Info */}
              <div className="px-4 mb-4">
                <h3 className="text-lg font-semibold mb-1">Contact</h3>
                <p className="text-black/90">{church.contact}</p>
              </div>

              {/* Service Times */}
              <div className="px-4 mb-4">
                <h3 className="text-lg font-semibold mb-2">Service Times</h3>
                <ul className="space-y-1 text-sm text-black">
                  {church.services.map((service, index) => (
                    <li
                      key={index}
                      className="flex justify-between border-b border-black/10 py-1"
                    >
                      <span className="font-medium">
                        {service.day} – {service.type}
                      </span>
                      <span className="font-light">{service.time}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Additional Info */}
              {church.additionalInfo && (
                <div className="px-4 mb-6">
                  <h3 className="text-lg font-semibold mb-2">
                    Additional Info
                  </h3>
                  <ul className="space-y-1 text-sm text-black/90">
                    {church.additionalInfo.prayerMeeting && (
                      <li>
                        <FontAwesomeIcon
                          icon={faMapPin}
                          className="mr-2 text-black/60"
                        />
                        Prayer Meeting: {church.additionalInfo.prayerMeeting}
                      </li>
                    )}
                    {church.additionalInfo.choirPractice && (
                      <li>
                        <FontAwesomeIcon
                          icon={faMapPin}
                          className="mr-2 text-black/60"
                        />
                        Choir Practice: {church.additionalInfo.choirPractice}
                      </li>
                    )}
                    {church.additionalInfo.womenFellowship && (
                      <li>
                        <FontAwesomeIcon
                          icon={faMapPin}
                          className="mr-2 text-black/60"
                        />
                        Women Fellowship:{" "}
                        {church.additionalInfo.womenFellowship}
                      </li>
                    )}
                    {church.additionalInfo.youthService && (
                      <li>
                        <FontAwesomeIcon
                          icon={faMapPin}
                          className="mr-2 text-black/60"
                        />
                        Youth Service: {church.additionalInfo.youthService}
                      </li>
                    )}
                    {church.additionalInfo.website && (
                      <li>
                        <FontAwesomeIcon
                          icon={faMapPin}
                          className="mr-2 text-black/60"
                        />
                        <a
                          href={church.additionalInfo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 underline"
                        >
                          Visit Church Website
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
