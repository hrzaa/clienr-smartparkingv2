import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

const Payment = () => {
  const [transactions, setTransactions] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}transactions`);
        const data = await response.json();

        if (data && data.data) {
          setTransactions(data);
          setError(null);
        } else {
          setTransactions(null);
          setError("Belum ada transaksi...");
        }
      } catch (error) {
        setTransactions(null);
        setError("Error fetching transactions: " + error.message);
      }
    };

    fetchTransactions();
    const intervalId = setInterval(fetchTransactions, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="p-4 flex items-center justify-center min-h-screen">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 w-full">
        <div className="text-center">
          {error ? (
            <div className="flex justify-center items-center min-h-screen">
              <a
                href="#"
                className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {error}
                </h5>
              </a>
            </div>
          ) : transactions &&
            transactions.data &&
            transactions.data.snap_redirect_url ? (
            <div
              className="relative overflow-hidden"
              style={{ paddingTop: "56.25%" /* 16:9 Aspect Ratio */ }}
            >
              <iframe
                key={transactions.data.snap_redirect_url}
                className="absolute top-0 left-0 w-full h-full"
                src={transactions.data.snap_redirect_url}
                title="Payment Page"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <p>Belum ada transaksi...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
