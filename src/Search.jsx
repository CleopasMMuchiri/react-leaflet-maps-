import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faX } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { AnimatePresence, easeInOut, motion } from "framer-motion";
import { flyToChurch } from "./mapUtils";

const Search = ({ churches, setSelectedChurches, mapRef, loading, error }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState(false);

  function useDebounce(value, delay) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
      const timer = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
  }

  const debouncedQuery = useDebounce(query.trim().toLowerCase(), 300);

  useEffect(() => {
    if (!debouncedQuery) return setResults([]);

    const filtered = churches
      .filter((church) =>
        church.churchName.toLowerCase().includes(debouncedQuery)
      )
      .slice(0, 3);

    setResults(filtered);
  }, [debouncedQuery, churches]);

  const handleFlyTo = (church) => {
    flyToChurch(mapRef, church, setSelectedChurches);
    setSearch(false);
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const i = text.toLowerCase().indexOf(query.toLocaleLowerCase());
    if (i === -1) return text;
    return (
      <>
        {text.slice(0, i)}
        <span className="bg-yellow-200">{text.slice(i, i + query.length)}</span>
        {text.slice(i + query.length)}
      </>
    );
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
                disabled={loading || error}
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
              {loading ? (
                <ul className="mt-4 text-gray-500">Loading Church data</ul>
              ) : error ? (
                <ul className="mt-4 text-red-500">Sorry no church found</ul>
              ) : (
                <>
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
                          <p className="font-semibold">
                            {highlightMatch(church.churchName, query)}
                          </p>
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
                    <p className="text-sm text-gray-500 mt-4">
                      No matches found.
                    </p>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default Search;
