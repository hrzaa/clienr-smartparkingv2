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
  const [loadingText, setLoadingText] = useState("LOADING");
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);

  const isEqual = (a, b) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (JSON.stringify(a[i]) !== JSON.stringify(b[i])) return false;
    }
    return true;
  };

const fetchData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}parkings`, {
      params: {
        apiKey,
        page,
        limit,
        search_query: search.trim() !== "" ? search : undefined,
      },
    });

    if (response.data && Array.isArray(response.data.data)) {
      const newParkingData = response.data.data;
      if (!isEqual(parkingData, newParkingData)) {
        setParkingData(newParkingData);
        setTotalPages(Math.ceil(response.data.meta.total / limit));
      }
      setError(null); // Clear any previous errors
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

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, [page, limit, search, apiKey]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

const handleSearchSubmit = (e) => {
  e.preventDefault();
  if (search.trim() === "") {
    setPage(1);
    setSearch(""); // Clear search
  }
  fetchData(); // Fetch data based on current search value
};

  const handleDelete = async (parkingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this parking entry?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(
        `${API_BASE_URL}parkings/remove/${parkingId}?apiKey=${apiKey}`
      );

      setParkingData(
        parkingData.filter((parking) => parking.parkingId !== parkingId)
      );
      alert("Parking entry deleted successfully.");
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting parking entry:", error);
      alert("Failed to delete parking entry.");
    }
  };

  const handleDetail = async (parkingId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}parkings/${parkingId}?apiKey=${apiKey}`
      );
      if (response.data) {
        setModalData(response.data.data);
        setIsModalVisible(true);
      } else {
        console.error("Data not found");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setModalData(null);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  useEffect(() => {
    let currentStageLoading = 0;
    const loadingStages = ["LOADING", "LOADING.", "LOADING..", "LOADING..."];

    const interval = setInterval(() => {
      currentStageLoading = (currentStageLoading + 1) % loadingStages.length;
      setLoadingText(loadingStages[currentStageLoading]);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen text-zinc-800">
        <h1 className="font-bold text-2xl lg:text-5xl text-center">
          {loadingText}
        </h1>
      </div>
    );
  }

  // if (error) return <h2>Error: {error.message}</h2>;

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
                <form onSubmit={handleSearchSubmit}>
                  <input
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    type="text"
                    placeholder="Search by code"
                    value={search}
                    onChange={handleSearchChange}
                  />
                  <button type="submit">Search</button>
                </form>
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
                      <th className="py-3 px-2 sm:px-6">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {error ? (
                      <tr>
                        <td colSpan="10" className="py-3 px-6 text-center">
                          Data code not found
                        </td>
                      </tr>
                    ) : (
                      parkingData.map((parkings, index) => (
                        <tr
                          className="bg-white border-b"
                          key={parkings.parkingId}
                        >
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
                            {parkings.parkingOut
                              ? moment(parkings.parkingout)
                                  .utc()
                                  .add(7, "hours")
                                  .format("YYYY-MM-DD HH:mm:ss")
                              : "On Progress"}
                          </td>
                          <td className="py-3 px-2 sm:px-6">
                            {parkings.totalTime !== null
                              ? `${parkings.totaltime} Hours`
                              : "On Progress"}
                          </td>
                          <td className="py-3 px-2 sm:px-6">
                            {parkings.transactions.transactionId
                              ? parkings.transactions.transactionId
                              : "N/A"}
                          </td>
                          <td className="py-3 px-2 sm:px-6">
                            {parkings.transactions.totalprice !== undefined
                              ? `Rp ${parkings.transactions.totalprice.toLocaleString()}`
                              : "Counting"}
                          </td>
                          <td className="py-3 px-2 sm:px-6">
                            {parkings.transactions.transactionstatus ? (
                              <button className="justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                                {parkings.transactions.transactionstatus}
                              </button>
                            ) : (
                              "N/A"
                            )}
                          </td>
                          <td className="py-3 px-2 sm:px-6">
                            <div className="flex items-center justify-end gap-x-1">
                              <button
                                type="submit"
                                className="rounded-md bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                onClick={() => handleDetail(parkings.parkingId)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-4 h-4"
                                >
                                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                  <path
                                    fillRule="evenodd"
                                    d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {isModalVisible && modalData && (
                  <Modal
                    modalData={modalData}
                    handleCloseModal={handleCloseModal}
                    handleDelete={handleDelete}
                  />
                )}
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

const Modal = ({ modalData, handleCloseModal, handleDelete }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <center>
          <h2 className="text-xl font-semibold mb-4">
            Detail Parking Plat {modalData.code}
          </h2>
        </center>
        <div className="sm:col-span-2">
          <label
            htmlFor="first-name"
            className="block text-sm font-semibold leading-6 text-gray-900"
          >
            Parking Id
          </label>
          <div className="mt-2.5">
            <input
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={modalData.parkingId}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="first-name"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Parking In
            </label>
            <div className="mt-2.5">
              <input
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={moment(modalData.parkingin)
                  .utc()
                  .add(7, "hours")
                  .format("YYYY-MM-DD HH:mm:ss")}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="last-name"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Parking Out
            </label>
            <div className="mt-2.5">
              <input
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={
                  modalData.parkingout
                    ? moment(modalData.parkingout)
                        .utc()
                        .add(7, "hours")
                        .format("YYYY-MM-DD HH:mm:ss")
                    : "On Progress"
                }
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="first-name"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Status Parking
            </label>
            <div className="mt-2.5">
              <input
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={modalData.status}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="last-name"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Total Time
            </label>
            <div className="mt-2.5">
              <input
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={
                  modalData.totaltime ? modalData.totaltime : "On Progress"
                }
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="first-name"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Transaction Id
            </label>
            <div className="mt-2.5">
              <input
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={
                  modalData.transactions
                    ? modalData.transactions.transactionId
                    : "-"
                }
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="last-name"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Total Price
            </label>
            <div className="mt-2.5">
              <input
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={
                  modalData.transactions
                    ? modalData.transactions.totalprice
                    : "Counting"
                }
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="first-name"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Transaction Status
            </label>
            <div className="mt-2.5">
              <input
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={
                  modalData.transactions
                    ? modalData.transactions.transactionstatus
                    : "-"
                }
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="last-name"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Pay At
            </label>
            <div className="mt-2.5">
              <input
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={
                  modalData.transactions
                    ? modalData.transactions.updated_at
                    : "-  "
                }
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="first-name"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Payment URL
            </label>
            <div className="mt-2.5">
              <a
                href={modalData.transactions.snap_redirect_url}
                target="_blank"
                className="inline-block w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                {modalData.transactions.snap_redirect_url}
              </a>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="text-sm font-semibold leading-6 text-red-500"
            onClick={() => handleDelete(modalData.parkingId)}
          >
            Delete
          </button>
          <button
            type="submit"
            className="rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
            onClick={handleCloseModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParkingList;
