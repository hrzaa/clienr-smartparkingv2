import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { API_BASE_URL } from "../config";

const ParkingList = () => {
  const apiKey = Cookies.get("token");
  const [parkingData, setParkingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}parkings?apiKey=${apiKey}&page=${page}&limit=${limit}`
      );
      if (response.data && Array.isArray(response.data.data)) {
        setParkingData(response.data.data);
        setTotalPages(Math.ceil(response.data.meta.total / limit));
      } else {
        setParkingData([]);
        setError(new Error("Invalid response format"));
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const interval = setInterval(() => {
    fetchData();
  }, 5000); // Polling every 5 seconds (adjust as needed)

  return () => clearInterval(interval); // Cleanup interval on unmount or dependencies change
}, [page, apiKey, limit]);


  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  if (loading) return <h2>Loading...</h2>;

  if (error) return <h2>Error: {error.message}</h2>;

  return (
    <div className="flex flex-col sm:flex-row">
      <Navbar />
      <Sidebar />
      <div className="p-4 sm:ml-64 flex-1">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <div className="flex flex-col mt-5">
            <div className="w-full mx-auto p-4 sm:p-10">
              <div className="text-center">
                <h1 className="mt-4 text-l font-bold tracking-tight text-gray-900 sm:text-5xl mb-10">
                  List All Parking
                </h1>
              </div>
              <div className="relative shadow rounded-lg mt-3 overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                      <th className="py-3 px-2 text-center">No</th>
                      <th className="py-3 px-2 sm:px-6">Number Plate</th>
                      <th className="py-3 px-2 sm:px-6">Status</th>
                      <th className="py-3 px-2 sm:px-6">Parking In</th>
                      <th className="py-3 px-2 sm:px-6">Parking Out</th>
                      <th className="py-3 px-2 sm:px-6">Total Time</th>
                      <th className="py-3 px-2 sm:px-6">TransactionId</th>
                      <th className="py-3 px-2 sm:px-6">Price</th>
                      <th className="py-3 px-2 sm:px-6">Transaction Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parkingData.map((parkings, index) => (
                      <tr className="bg-white border-b" key={parkings.id}>
                        <td className="py-3 px-1 text-center">
                          {index + 1 + (page - 1) * limit}
                        </td>
                        <td className="py-3 px-2 sm:px-6 font-medium text-gray-900">
                          {parkings.code}
                        </td>
                        <td className="py-3 px-2 sm:px-6">
                          <button className="justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            {parkings.status}
                          </button>
                        </td>
                        <td className="py-3 px-2 sm:px-6">
                          {moment(parkings.parkingin)
                            .utc()
                            .add(7, "hours")
                            .format("YYYY-MM-DD HH:mm:ss")}
                        </td>
                        <td className="py-3 px-2 sm:px-6">
                          {parkings.parkingout
                            ? moment(parkings.parkingout)
                                .utc()
                                .add(7, "hours")
                                .format("YYYY-MM-DD HH:mm:ss")
                            : "On Progress"}
                        </td>
                        <td className="py-3 px-2 sm:px-6">
                          {parkings.totaltime !== null
                            ? `${parkings.totaltime} Hours`
                            : "On Progress"}
                        </td>
                        <td className="py-3 px-2 sm:px-6">
                          {parkings.transactions
                            ? parkings.transactions.transactionId
                            : "N/A"}
                        </td>
                        <td className="py-3 px-2 sm:px-6">
                          {parkings.transactions &&
                          parkings.transactions.totalprice !== undefined
                            ? `Rp ${parkings.transactions.totalprice.toLocaleString()}`
                            : "Counting"}
                        </td>
                        <td className="py-3 px-2 sm:px-6">
                          {parkings.transactions ? (
                            <button className="justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                              {parkings.transactions.transactionstatus}
                            </button>
                          ) : (
                            "N/A"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingList;
