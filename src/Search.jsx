import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faX } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { AnimatePresence, easeInOut, motion } from "framer-motion";
import { flyToChurch } from "./mapUtils";

const Search = ({ churches, setSelectedChurches, mapRef }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState("");
  const [search, setSearch] = useState(false);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const filtered = churches
      .filter((church) =>
        church.name.toLowerCase().includes(query.toLocaleLowerCase())
      )
      .slice(0, 3);
    setResults(filtered);
  }, [query, churches]);

  const handleFlyTo = (church) => {
    flyToChurch(mapRef, church, setSelectedChurches);
    setSearch(false);
  };
  return (
    <div className="">
      <button
        onClick={() => setSearch(true)}
        title="Seach for a Church"
        className="cursor-pointer text-black p-2 rounded-md shadow-md bg-white"
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} className="" />
      </button>

      {search && (
        <AnimatePresence>
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
            className="rounded-lg py-2 px-4 bg-white w-[80vw] max-w-[400px] z-50 fixed top-4 right-4 flex flex-col justify-between gap-4"
          >
            <div className="rounded-lg py-2 px-4 bg-white w-[80vw] max-w-[400px] z-50 fixed top-4 right-4 flex justify-between gap-4">
              <input
                type="search"
                className="w-full outline-none border-b-2 active:border-b-2 active:border-b-blue-900 "
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="flex justify-center items-center gap-2">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="cursor-pointer"
                />
                <FontAwesomeIcon
                  icon={faX}
                  className="cursor-pointer"
                  onClick={() => {
                    setSearch(false);
                    setQuery("");
                    setResults([]);
                  }}
                />
              </div>
            </div>

            <div className="pt-4">
              {results.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {results.map((church) => (
                    <li
                      key={church.id}
                      onClick={() => {
                        handleFlyTo(church);
                        setSearch(false);
                        setQuery("");
                        setResults([]);
                      }}
                      className="cursor-pointer hover:bg-gray-100 p-2 rounded transition-all"
                    >
                      <p className="font-semibold">{church.name}</p>
                      {church.region && (
                        <p className="text-sm text-gray-500">
                          Region: {church.region}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {query && results.length === 0 && (
                <p className="text-sm text-gray-500 mt-4">No matches found.</p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default Search;
