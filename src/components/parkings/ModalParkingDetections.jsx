import React from "react";
import { Link } from "react-router-dom";

const ModalParkingDetections = ({ closeModal }) => {
  const openLink = (mode) => {
    window.open(`/detection/${mode}`, "_blank");
  };

  return (
    <div
      id="defaultModal"
      tabIndex="-1"
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full overflow-x-hidden overflow-y-auto bg-black bg-opacity-10"
    >
      <div className="relative w-full max-w-sm p-1 h-96 md:h-auto">
        <div className="relative bg-white rounded-sm drop-shadow-2xl">
          <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900">
              Show Parking Information
            </h3>
            <button
              onClick={closeModal}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              data-modal-hide="defaultModal"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 0 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            <Link
              to={"/parking_detections/1"}
              target="blank"
              className="p-2 text-center ring-1 ring-emerald-600 hover:bg-emerald-600 hover:scale-x-95 rounded-sm shadow-sm"
            >
              Version 1
            </Link>
            <Link
              to={"/parking_detections/2"}
              target="blank"
              className="p-2 text-center ring-1 ring-emerald-600 hover:bg-emerald-600 hover:scale-x-95 rounded-sm shadow-sm"
            >
              Version 2
            </Link>
            <Link
              to={"/parking_detections/3"}
              target="blank"
              className="p-2 text-center ring-1 ring-emerald-600 hover:bg-emerald-600 hover:scale-x-95 rounded-sm shadow-sm"
            >
              Version 3
            </Link>
            <Link
              to={"/parking_detections/4"}
              target="blank"
              className="p-2 text-center ring-1 ring-emerald-600 hover:bg-emerald-600 hover:scale-x-95 rounded-sm shadow-sm"
            >
              Version 4
            </Link>
          </div>
          <div className="flex justify-end items-center p-3 space-x-2 border-t border-gray-300 rounded-b-sm">
            <button
              onClick={closeModal}
              type="button"
              className="hover:bg-rose-600 ring-1 ring-rose-600 hover:scale-x-95 font-medium rounded-sm text-sm px-10 py-2 text-center"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalParkingDetections;
