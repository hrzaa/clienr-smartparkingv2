import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Price() {
  const [price, setPrice] = useState("");
  const [priceId, setPriceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchpriceData() {
      setLoading(true);
      try {
        const apiKey = Cookies.get("token");

        const response = await axios.get(
          `${API_BASE_URL}prices?apiKey=${apiKey}`
        );
        const priceData = response.data.data;

        setPrice(priceData.price);
        setPriceId(priceData.priceId);
        setSuccess("");
        setError("");
      } catch (error) {
        setError(
          "Fetch user data error: " +
            (error.response ? error.response.data.message : error.message)
        );
      }
      setLoading(false);
    }

    fetchpriceData();
  }, []);

  // const handleUpdate = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const apiKey = Cookies.get("token");

  //     await axios.patch(
  //       `${API_BASE_URL}user/update/${userId}?apiKey=${apiKey}`,
  //       {
  //         username,
  //         password,
  //       }
  //     );

  //     setSuccess("Akun sudah berhasil diperbarui");
  //     setPassword("");
  //   } catch (error) {
  //     setError(
  //       "Update error: " +
  //         (error.response ? error.response.data.message : error.message)
  //     );
  //   }
  //   setLoading(false);
  // };


  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <div className="text-center">
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-10">
              Price
            </h1>
          </div>
          <div className="mx-auto max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadowmt-3">
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <form className="space-y-6">
                {success && (
                  <div className="text-sm text-center text-green-600">
                    {success}
                  </div>
                )}
                {error && (
                  <div className="text-sm text-center text-red-600">
                    {error}
                  </div>
                )}
                <input
                  className="block w-full px-4 py-3 mt-4 text-gray-700 bg-white border rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring focus:ring-opacity-40"
                  id="price"
                  type="text"
                  placeholder="Price"
                  value={priceId}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
                <input
                  className="block w-full px-4 py-3 mt-4 text-gray-700 bg-white border rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring focus:ring-opacity-40"
                  id="price"
                  type="text"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
                <button
                  className="block w-full px-4 py-3 mt-4 text-center text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:bg-blue-700 focus:outline-none transition duration-300 ease-in-out transform"
                  type="submit"
                >
                  Update
                </button>
              </form>
            )}

            {/* {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            {!loading && !error && (
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {priceData.map((price, index) => (
                    <tr className="bg-white" key={index}>
                      <td className="px-4 py-2">
                        <input
                          className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring focus:ring-opacity-40"
                          id="price"
                          type="text"
                          placeholder="Price"
                          value={price.price}
                          readOnly
                        />
                        <button
                          className="block w-full px-4 py-3 mt-4 text-center text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:bg-blue-700 focus:outline-none transition duration-300 ease-in-out transform"
                          type="submit"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Price;
