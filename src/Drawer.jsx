import React, { useEffect } from "react";
import {
  motion,
  useDragControls,
  useMotionValue,
  useAnimate,
} from "framer-motion";
import useMeasure from "react-use-measure";
import "./drawer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDirections, faMapPin } from "@fortawesome/free-solid-svg-icons";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import noData from "./assets/NoData.png";
import failed from "./assets/Failed.png";

const MobileDrawer = ({ open, setOpen, church, loading, error }) => {
  useEffect(() => {
    if (open) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [open]);

  if (!church) return null;
  return (
    <DragCloseDrawer open={open} setOpen={setOpen}>
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
        <div className="h-full w-full flex items-center justify-center">
          <img
            className="w-3/4 max-w-[250px] h-auto"
            src={noData}
            alt="No data"
          />
        </div>
      ) : (
        <div className="text-black">
          {/* Image */}
          <img
            src={church.churchImage || "https://via.placeholder.com/400x200"}
            alt={church.churchName}
            className="w-full rounded-lg my-4"
          />

          {/* Top Bar: Church Name + Region + Directions */}
          <div className="border-b border-black/20 pb-3 mb-4 px-2 flex justify-between items-start flex-wrap gap-2">
            <div>
              <h2 className="text-lg md:text-xl font-semibold">
                {church.churchName}
              </h2>
              {church.region && (
                <p className="text-sm text-black/60 flex items-center gap-1">
                  <FontAwesomeIcon icon={faMapPin} />
                  <span>{church.region}</span>
                </p>
              )}
            </div>

            {/* Directions */}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${church.lat},${church.lng}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                onClick={() => setOpen(false)}
                className="active:scale-95 cursor-pointer rounded-full p-2 bg-gray-200 text-black shadow-md hover:bg-gray-300 flex justify-center items-center"
                aria-label="Get Directions"
              >
                <FontAwesomeIcon icon={faDirections} className="text-xl" />
              </button>
            </a>
          </div>

          {/* Distance */}

          {church.distance && (
            <div className="mx-4 mb-4 px-2 py-2 flex items-center gap-3 bg-gray-100 rounded-lg shadow">
              <FontAwesomeIcon icon={faMapPin} className="text-black/70" />
              <p className="font-medium">
                {church.distance.toFixed(1)} km from your location
              </p>
            </div>
          )}

          {/* Contact */}
          <div className="px-2 mb-4">
            <h3 className="text-lg font-semibold mb-1">Contact</h3>
            <p className="text-black/90">{church.churchContact}</p>
          </div>

          {/* Service Times */}
          <div className="px-2 mb-4">
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
                  <span>{service.language}</span>
                  <span className="font-light">{service.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Info */}
          {church.additionalInfo && (
            <div className="px-4 mb-6">
              <h3 className="text-lg font-semibold mb-2">Additional Info</h3>
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
                        <video className="w-full my-4 rounded-lg" controls>
                          <source src={file.url} type={file.contentType} />
                        </video>
                      );
                    }
                    return null;
                  },

                  paragraph: (node, children) => (
                    <p className="my-4">{children}</p>
                  ),

                  "heading-1": (node, children) => (
                    <h1 className="text-lg font-bold my-4">{children}</h1>
                  ),
                  "heading-2": (node, children) => (
                    <h2 className="font-bold my-4">{children}</h2>
                  ),

                  // Handle other rich text elements as needed
                  "unordered-list": (node, children) => (
                    <ul className="list-disc ml-4 my-4">{children}</ul>
                  ),
                  "ordered-list": (node, children) => (
                    <ol className="list-decimal ml-4 my-4">{children}</ol>
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
      )}
    </DragCloseDrawer>
  );
};

export default MobileDrawer;

const DragCloseDrawer = ({ open, setOpen, children }) => {
  const [scope, animate] = useAnimate();
  const controls = useDragControls();
  const y = useMotionValue(0);
  const [drawerRef, { height }] = useMeasure();

  const handleClose = async () => {
    animate(scope.current, {
      opacity: [1, 0],
    });

    const yStart = typeof y.get() === "number" ? y.get() : 0;

    await animate("#drawer", {
      y: [yStart, height],
    });

    setOpen(false);
  };

  return (
    <>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleClose}
          ref={scope}
          className="fixed inset-0 bg-black/60 z-50"
        >
          <motion.div
            ref={drawerRef}
            id="drawer"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            style={{ y }}
            transition={{ ease: "easeInOut" }}
            onDragEnd={() => {
              if (y.get() >= 100) {
                handleClose();
              }
            }}
            drag="y"
            dragControls={controls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            className="absolute bottom-0 h-[75vh] w-full overflow-hidden rounded-t-3xl bg-white backdrop-blur"
          >
            <div className="absolute left-0 right-0 top-0 z-10 flex justify-center bg-white p-4">
              <button
                onPointerDown={(e) => {
                  controls.start(e);
                }}
                className="h-3 w-14 cursor-grab touch-none rounded-full bg-neutral-700 active:cursor-grabbing"
              ></button>
            </div>
            <div className="scroll-place relative z-0 h-full overflow-y-scroll">
              <div className="w-full">{children}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};
