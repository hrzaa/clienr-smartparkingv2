import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { API_BASE_URL } from "../config";

function Update() {
  const [priceId, setPriceId] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState(""); // Tambahkan state untuk nama pengguna
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPriceData() {
      setLoading(true);
      try {
        const apiKey = Cookies.get("token");
        const response = await axios.get(
          `${API_BASE_URL}prices?apiKey=${apiKey}`
        );
        const priceData = response.data.data;

        if (priceData) {
          setPriceId(priceData.priceId);
          setUserId(priceData.userId);
          setPrice(priceData.price);
          setSuccess("");
          setError("");

          // Fetch user data based on userId
          const userResponse = await axios.get(
            `${API_BASE_URL}user/get/${priceData.userId}?apiKey=${apiKey}`
          );
          const userData = userResponse.data.data;

          if (userData) {
            setUserName(userData.username); // Set nama pengguna
          } else {
            setError("No user data found.");
          }
        } else {
          setError("No price data found.");
        }
      } catch (error) {
        setError(
          "Fetch price data error: " +
            (error.response ? error.response.data.message : error.message)
        );
      }
      setLoading(false);
    }

    fetchPriceData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiKey = Cookies.get("token");

      const response = await axios.patch(
        `${API_BASE_URL}price/update/${priceId}?apiKey=${apiKey}`,
        { price: parseFloat(price) }
      );

      if (response.status === 200) {
        setSuccess("Price updated successfully!");
        setError("");
      } else {
        setError(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      setError(
        "Update error: " +
          (error.response ? error.response.data.message : error.message)
      );
    }
    setLoading(false);
  };

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <div className="text-center">
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-10">
              Update Price
            </h1>
          </div>
          <div className="mx-auto max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow mt-3">
            <form className="space-y-6" onSubmit={handleUpdate}>
              {success && (
                <div
                  className="bg-green-100 border-t border-b border-green-500 text-green-700 px-4 py-3"
                  role="alert"
                >
                  <p className="font-bold">{success}</p>
                </div>
              )}
              {error && (
                <div
                  className="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3"
                  role="alert"
                >
                  <p className="font-bold">{error}</p>
                </div>
              )}
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                  <span className="text-gray-700 sm:text-sm">Rp.</span>
                </div>
                <input
                  className="block w-full rounded-md border-0 py-1.5 pl-8 pr-1 text-gray-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  id="price"
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <input
                className="block w-full rounded-md border-0 p-2 text-gray-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                id="userName"
                type="text"
                value={userName}
                readOnly
              />
              <input
                className="block w-full px-4 py-3 mt-4 text-gray-700 bg-white border rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring focus:ring-opacity-40"
                id="priceId"
                type="hidden"
                placeholder="priceId"
                value={priceId}
                readOnly
                required
              />

              <button
                className="block w-full px-4 py-3 mt-4 text-center text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:bg-blue-700 focus:outline-none transition duration-300 ease-in-out transform"
                type="submit"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Update;
