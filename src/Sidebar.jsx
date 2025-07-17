import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleLeft,
  faDirections,
  faMapPin,
} from "@fortawesome/free-solid-svg-icons";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import noData from "./assets/NoData.png";
import failed from "./assets/Failed.png";

const Sidebar = ({ open, setOpen, church, loading, error }) => {
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
            ) : !church || Object.keys(church).length === 0 ? (
              <div className="h-full w-full flex items-center justify-center ">
                <img
                  className="w-3/4 max-w-[250px] h-auto"
                  src={noData}
                  alt="failed to load data"
                />
              </div>
            ) : (
              <>
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
                    src={
                      church.churchImage ||
                      "https://via.placeholder.com/400x200"
                    }
                    alt={church.churchName}
                    className="w-full rounded-b-lg  mb-4"
                  />

                  {/* Title & Top Info */}
                  <div className="border-b border-black/20 pb-3 mb-4 px-4 flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <h2 className="text-2xl font-semibold">
                        {church.churchName}
                      </h2>
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
                      <button
                        onClick={() => setOpen(false)}
                        className="cursor-pointer rounded-full p-2 text-black shadow-lg bg-gray-200 hover:bg-gray-300 active:scale-95"
                        aria-label="Get Directions"
                      >
                        <FontAwesomeIcon
                          icon={faDirections}
                          className="text-xl"
                        />
                      </button>
                    </a>
                  </div>

                  {/* Distance */}
                  {church.distance && (
                    <div className="mx-4 mb-4 px-4 py-2 flex items-center gap-3 bg-gray-100 rounded-lg shadow">
                      <FontAwesomeIcon
                        icon={faMapPin}
                        className="text-black/70"
                      />
                      <p className="font-medium ">
                        {church.distance.toFixed(1)} km from your location
                      </p>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="px-4 mb-4">
                    <h3 className="text-lg font-semibold mb-1">Contact</h3>
                    <p className="text-black/90">{church.churchContact}</p>
                  </div>

                  {/* Service Times */}
                  <div className="px-4 mb-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Service Times
                    </h3>
                    <ul className="space-y-1 text-sm text-black">
                      {church.services.map((service, index) => (
                        <li
                          key={index}
                          className="flex justify-between border-b border-black/10 py-1"
                        >
                          <span className="font-medium">
                            {service.day} – {service.type}
                          </span>
                          <span className="font-medium">
                            {service.language}
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
                      {documentToReactComponents(church.additionalInfo, {
                        renderNode: {
                          "embedded-asset-block": (node) => {
                            const { file, title } = node.data.target.fields;
                            if (file.contentType.startsWith("image/")) {
                              return (
                                <img
                                  src={file.url}
                                  alt={title || "Church Media"}
                                  className="w-full my-4 rounded-lg"
                                />
                              );
                            } else if (file.contentType.startsWith("video/")) {
                              return (
                                <video
                                  className="w-full my-4 rounded-lg"
                                  controls
                                >
                                  <source
                                    src={file.url}
                                    type={file.contentType}
                                  />
                                </video>
                              );
                            }
                            return null;
                          },

                          paragraph: (node, children) => (
                            <p className="my-4">{children}</p>
                          ),

                          "heading-1": (node, children) => (
                            <h1 className="text-lg font-bold my-4">
                              {children}
                            </h1>
                          ),
                          "heading-2": (node, children) => (
                            <h2 className="text-lg font-bold my-4">
                              {children}
                            </h2>
                          ),

                          // Handle other rich text elements as needed
                          "unordered-list": (node, children) => (
                            <ul className="list-disc ml-8 my-4">{children}</ul>
                          ),
                          "ordered-list": (node, children) => (
                            <ol className="list-decimal ml-8 my-4">
                              {children}
                            </ol>
                          ),
                          "list-item": (node, children) => (
                            <li className="mb-1">{children}</li>
                          ),

                          hyperlink: (node, children) => (
                            <a
                              href={node.data.uri}
                              className="cursor-pointer font-bold text-chocolate hover:underline hover:underline-offset-2 duration-300 ease-in-out transition-all"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {children}
                            </a>
                          ),

                          blockquote: (node, children) => (
                            <blockquote className="text-color_seven border-l-4 border-color_seven pl-4  my-4">
                              {children}
                            </blockquote>
                          ),
                        },
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
