import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import useSWR, { useSWRConfig } from "swr";
import Cookies from "js-cookie";
import moment from "moment";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const ParkingList = () => {
  

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <div className="flex flex-col mt-5">
            <div className="w-full mx-auto p-10">
              <div className="text-center">
                <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-10">
                  List All Parking
                </h1>
              </div>
              <div className="relative shadow rounded-lg mt-3">
            
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingList;
