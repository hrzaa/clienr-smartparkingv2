import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { API_BASE_URL } from "../config";

const Payment = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define the function to fetch data
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}transactions`);
        if (!response.ok) {
          throw new Error(`tidak ada request payment`);
          // throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTransactions(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    // Call fetch function immediately and set interval
    fetchTransactions();
    const intervalId = setInterval(fetchTransactions, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <div className="text-center">
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {!loading && !error && (
              <div
                className="relative overflow-hidden"
                style={{ paddingTop: "56.25%" /* 16:9 Aspect Ratio */ }}
              >
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={transactions.data.snap_redirect_url}
                  title="Payment Page"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
