import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import useSWR, { useSWRConfig } from "swr";
import Cookies from "js-cookie";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { API_BASE_URL } from "../config";


const fetcher = async (url) => {
  const response = await axios.get(url);
  return response.data;
};


const Dashboard = () => {

  const apiKey = Cookies.get("token");
  
  const { data: parkingsData, error: parkingsError } = useSWR(
    `${API_BASE_URL}parkings?apiKey=${apiKey}`,
    fetcher
  );

  const { data: usersData, error: usersError } = useSWR(
    `${API_BASE_URL}users?apiKey=${apiKey}`,
    fetcher
  );

   if (parkingsError || usersError) {
     return <h2>Error loading data</h2>;
   }

   if (!parkingsData || !usersData) {
     return <h2>Loading...</h2>;
   }

   const totalParkingsLength = parkingsData.data.length;
   const totalUsersLength = usersData.data.length;

 
  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <div className="text-center">
            <h1 className="mt-4 font-bold tracking-tight text-gray-900 sm:text-5xl mb-10">
              Dashboard
            </h1>
          </div>
          <div class="grid grid-cols-3 gap-4 mb-4">
            <a
              href="#"
              class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 "
            >
              <p class="font-normal text-gray-700">Total Visitors</p>
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                {totalParkingsLength}
              </h5>
            </a>
            <a
              href="#"
              class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 "
            >
              <p class="font-normal text-gray-700">Parking Available</p>
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                10
              </h5>
            </a>
            <a
              href="#"
              class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 "
            >
              <p class="font-normal text-gray-700">User signups this week</p>
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                { totalUsersLength }
              </h5>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
