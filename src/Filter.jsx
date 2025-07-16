import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faX } from "@fortawesome/free-solid-svg-icons";

const Filter = ({ setOpen }) => {
  return (
    <div className="">
      <button
        onClick={() => setOpen(true)}
        title="Filter Church by Regions"
        className="cursor-pointer z-50 text-black p-2 rounded-md shadow-md bg-white"
      >
        <FontAwesomeIcon icon={faFilter} className="" />
      </button>
    </div>
  );
};

export default Filter;
