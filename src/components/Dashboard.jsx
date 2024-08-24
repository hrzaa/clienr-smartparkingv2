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

  const { data: transactionsData, error: transactionsError } = useSWR(
    `${API_BASE_URL}sumTransactions?apiKey=${apiKey}`,
    fetcher
  );

  // Menentukan apakah data kosong atau ada error
  const isLoading = !parkingsData || !usersData || !transactionsData;
  const isError = parkingsError || usersError || transactionsError;
  const isEmptyData =
    parkingsData?.data.length === 0 &&
    usersData?.data.length === 0 &&
    !transactionsData?.data;

  // Menentukan nilai untuk ditampilkan
  const totalParkingsLength = parkingsData?.data.length || 0;
  const totalUsersLength = usersData?.data.length || 0;
  const totalTransactions = transactionsData?.data || 0;

  return (
    <div className="flex">
      <Navbar />
      <Sidebar />
      <div className="flex-grow p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-16 sm:mt-14">
          <div className="text-center">
            <h1 className="mt-4 text-2xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-10">
              Dashboard
            </h1>
          </div>
          {isLoading ? (
            <h2 className="text-center text-xl text-gray-700">Loading...</h2>
          ) : isError ? (
            <h2 className="text-center text-xl text-red-500">
              Error loading data
            </h2>
          ) : isEmptyData ? (
            <h2 className="text-center text-xl text-gray-500">Data kosong</h2>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <a
                href="#"
                className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
              >
                <p className="font-normal text-gray-700">Total Visitors</p>
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                  {totalParkingsLength}
                </h5>
              </a>
              <a
                href="#"
                className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
              >
                <p className="font-normal text-gray-700">
                  Total Paid Transactions
                </p>
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                  {`Rp. ${totalTransactions}`}
                </h5>
              </a>
              <a
                href="#"
                className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
              >
                <p className="font-normal text-gray-700">User Sign Up</p>
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                  {totalUsersLength}
                </h5>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

