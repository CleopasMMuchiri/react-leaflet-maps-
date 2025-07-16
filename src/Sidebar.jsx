import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleLeft,
  faDirections,
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
            className="h-full w-[80vw] max-w-[400px] bg-neutral-900/90 backdrop-blur shadow-xl z-50"
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
            <div className=" text-white">
              <img
                src={church.image || "https://via.placeholder.com/400x200"}
                alt={church.name}
                className="w-full rounded-lg mb-4"
              />
              <div className="border-b-2 pb-2 border-white w-full flex justify-between items-center px-4 flex-wrap">
                <h2 className="text-2xl font-semibold">{church.name}</h2>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${church.lat},${church.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.button
                    onClick={() => setOpen(false)}
                    whileTap={{ scale: 0.95 }}
                    className="cursor-pointer rounded-full transition-colors text-white shadow-lg"
                    aria-label="Close Sidebar"
                  >
                    <FontAwesomeIcon icon={faDirections} className="text-xl" />
                  </motion.button>
                </a>
              </div>

              <div className="p-4">
                <p className="mb-1 text-lg">Contact: {church.contact}</p>
                <h3>Services Time</h3>
                <ul>
                  {church.services.map((service, index) => (
                    <li key={index}>
                      <span>
                        {service.day} : {service.type}
                      </span>
                      <span>{service.time}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Additional Info
                  </h3>
                  <ul className="space-y-1 text-sm">
                    {church.additionalInfo?.prayerMeeting && (
                      <li>
                        🙏 Prayer Meeting: {church.additionalInfo.prayerMeeting}
                      </li>
                    )}
                    {church.additionalInfo?.choirPractice && (
                      <li>
                        🙏 Choir Practice: {church.additionalInfo.choirPractice}
                      </li>
                    )}
                    {church.additionalInfo?.womenFellowship && (
                      <li>
                        🙏 Women Fellowship:{" "}
                        {church.additionalInfo.womenFellowship}
                      </li>
                    )}
                    {church.additionalInfo?.youthService && (
                      <li>
                        👥 Youth Service: {church.additionalInfo.youthService}
                      </li>
                    )}
                    {church.additionalInfo?.website && (
                      <li>
                        🌐{" "}
                        <a
                          href={church.additionalInfo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 underline"
                        >
                          Church Website
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
