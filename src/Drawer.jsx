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
import { faDirections } from "@fortawesome/free-solid-svg-icons";

const MobileDrawer = ({ open, setOpen, church }) => {
  useEffect(() => {
    if (open) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [open]);

  if (!church) return null;
  return (
    <DragCloseDrawer open={open} setOpen={setOpen}>
      <div className=" text-black">
        <img
          src={church.image || "https://via.placeholder.com/400x200"}
          alt={church.name}
          className="w-full rounded-lg my-4"
        />
        <div className="border-b-2 pb-2 border-black w-full flex justify-between items-center px-4 flex-wrap">
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
              <FontAwesomeIcon icon={faDirections} className="text-xl text-black" />
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
            <h3 className="text-lg font-semibold mb-2">Additional Info</h3>
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
                  🙏 Women Fellowship: {church.additionalInfo.womenFellowship}
                </li>
              )}
              {church.additionalInfo?.youthService && (
                <li>👥 Youth Service: {church.additionalInfo.youthService}</li>
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
                className="h-2 w-14 cursor-grab touch-none rounded-full bg-neutral-700 active:cursor-grabbing"
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
