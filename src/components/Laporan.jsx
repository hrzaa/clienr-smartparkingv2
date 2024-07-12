import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { API_BASE_URL } from "../config";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Laporan = () => {
  const apiKey = Cookies.get("token");

  const [parkingData, setParkingData] = useState([]);
  const [transactionCount, setTransactionCount] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("LOADING");
  const [error, setError] = useState(null);
  const [allData, setAllData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching paginated data for UI display
        const response = await axios.get(
          `${API_BASE_URL}parkings?apiKey=${apiKey}&page=${page}&limit=${limit}`
        );

        if (response.data && Array.isArray(response.data.data)) {
          setParkingData(response.data.data);
          setTotalPages(Math.ceil(response.data.meta.total / limit));
        } else {
          setParkingData([]);
        }

        const allDataResponse = await axios.get(
          `${API_BASE_URL}parkings?apiKey=${apiKey}&page=1&limit=1000`
        );

        if (allDataResponse.data && Array.isArray(allDataResponse.data.data)) {
          setAllData(allDataResponse.data.data);
        } else {
          setAllData([]);
        }

        const getCountResponse = await axios.get(
          `${API_BASE_URL}transactions/count?apiKey=${apiKey}`
        );

        if (
          getCountResponse.data && typeof getCountResponse.data.data === "number"
        ) {
          setTransactionCount(getCountResponse.data.data);
        } else {
          setTransactionCount("N/A");
        }

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [apiKey, page, limit]);
  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrint = async () => {
    // Temporarily display all data for PDF generation
    const tableElement = document.createElement("div");
    tableElement.innerHTML = `
      <div id="print-table">
          <h2 style="margin-bottom: 20px; margin-left: 10px; font-size: 24px; font-weight: bold; text-align: center; color: #4CAF50;">
            Transaction Count: Rp. ${
              transactionCount !== null ? transactionCount : "N/A"
            }
        </h2>
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th class="py-3 px-2 text-center">No</th>
              <th class="py-3 px-3 sm:px-6">Number Plate</th>
              <th class="py-3 px-3 sm:px-6">Status</th>
              <th class="py-3 px-3 sm:px-6">Parking In</th>
              <th class="py-3 px-3 sm:px-6">Parking Out</th>
              <th class="py-3 px-3 sm:px-6">Total Time</th>
              <th class="py-3 px-3 sm:px-6">TransactionId</th>
              <th class="py-3 px-3 sm:px-6">Price</th>
              <th class="py-3 px-3 sm:px-6">Transaction Status</th>
            </tr>
          </thead>
          <tbody>
            ${allData
              .map(
                (parkings, index) => `
              <tr class="bg-white border-b" key=${parkings.id}>
                <td class="py-3 px-1 text-center">${index + 1}</td>
                <td class="py-3 px-3 sm:px-6 font-medium text-gray-900">${
                  parkings.code
                }</td>
                <td class="py-3 px-3 sm:px-6">${parkings.status}</td>
                <td class="py-3 px-3 sm:px-6">${moment(parkings.parkingin)
                  .utc()
                  .add(7, "hours")
                  .format("YYYY-MM-DD HH:mm:ss")}</td>
                <td class="py-3 px-3 sm:px-6">${
                  parkings.parkingout
                    ? moment(parkings.parkingout)
                        .utc()
                        .add(7, "hours")
                        .format("YYYY-MM-DD HH:mm:ss")
                    : "On Progress"
                }</td>
                <td class="py-3 px-3 sm:px-6">${
                  parkings.totaltime !== null
                    ? `${parkings.totaltime} Hours`
                    : "On Progress"
                }</td>
                <td class="py-3 px-3 sm:px-6">${
                  parkings.transactions
                    ? parkings.transactions.transactionId
                    : "N/A"
                }</td>
                <td class="py-3 px-3 sm:px-6">${
                  parkings.transactions &&
                  parkings.transactions.totalprice !== undefined
                    ? `Rp ${parkings.transactions.totalprice.toLocaleString()}`
                    : "Counting"
                }</td>
                <td class="py-3 px-3 sm:px-6">${
                  parkings.transactions
                    ? parkings.transactions.transactionstatus
                    : "N/A"
                }</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;

    document.body.appendChild(tableElement);
    const input = document.getElementById("print-table");
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const margin = 10;
    const imgWidth = pdf.internal.pageSize.width - 2 * margin;
    const pageHeight = pdf.internal.pageSize.height - 2 * margin;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = margin;

    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + margin;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("Laporan.pdf");
    document.body.removeChild(tableElement);
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

  if (error) return <h2>Error loading data</h2>;

  return (
    <div className="flex flex-col sm:flex-row">
      <Navbar />
      <Sidebar />
      <div className="flex-grow p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <div className="flex flex-col mt-5">
            <div className="w-full mx-auto p-2 sm:p-10">
              <button
                onClick={handlePrint}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Generate PDF
              </button>
              <div className="text-center">
                <h1 className="mt-4 text-l font-bold tracking-tight text-gray-900 sm:text-5xl mb-10">
                  Generate Laporan
                </h1>
              </div>
              <div
                id="parking-table"
                className="relative shadow rounded-lg mt-3 overflow-x-auto"
              >
                <h2 className="mb-2 ml-2 text-2xl font-bold tracking-tight text-gray-900">
                  Transaction Count: Rp.  
                   {transactionCount !== null ? transactionCount : "N/A"}
                </h2>
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                      <th className="py-3 px-2 text-center">No</th>
                      <th className="py-3 px-3 sm:px-6">Number Plate</th>
                      <th className="py-3 px-3 sm:px-6">Status</th>
                      <th className="py-3 px-3 sm:px-6">Parking In</th>
                      <th className="py-3 px-3 sm:px-6">Parking Out</th>
                      <th className="py-3 px-3 sm:px-6">Total Time</th>
                      <th className="py-3 px-3 sm:px-6">TransactionId</th>
                      <th className="py-3 px-3 sm:px-6">Price</th>
                      <th className="py-3 px-3 sm:px-6">Transaction Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parkingData.map((parkings, index) => (
                      <tr className="bg-white border-b" key={parkings.id}>
                        <td className="py-3 px-1 text-center">
                          {index + 1 + (page - 1) * limit}
                        </td>
                        <td className="py-3 px-3 sm:px-6 font-medium text-gray-900">
                          {parkings.code}
                        </td>
                        <td className="py-3 px-3 sm:px-6">{parkings.status}</td>
                        <td className="py-3 px-3 sm:px-6">
                          {moment(parkings.parkingin)
                            .utc()
                            .add(7, "hours")
                            .format("YYYY-MM-DD HH:mm:ss")}
                        </td>
                        <td className="py-3 px-3 sm:px-6">
                          {parkings.parkingout
                            ? moment(parkings.parkingout)
                                .utc()
                                .add(7, "hours")
                                .format("YYYY-MM-DD HH:mm:ss")
                            : "On Progress"}
                        </td>
                        <td className="py-3 px-3 sm:px-6">
                          {parkings.totaltime !== null
                            ? `${parkings.totaltime} Hours`
                            : "On Progress"}
                        </td>
                        <td className="py-3 px-3 sm:px-6">
                          {parkings.transactions
                            ? parkings.transactions.transactionId
                            : "N/A"}
                        </td>
                        <td className="py-3 px-3 sm:px-6">
                          {parkings.transactions &&
                          parkings.transactions.totalprice !== undefined
                            ? `Rp ${parkings.transactions.totalprice.toLocaleString()}`
                            : "Counting"}
                        </td>
                        <td className="py-3 px-3 sm:px-6">
                          {parkings.transactions
                            ? parkings.transactions.transactionstatus
                            : "N/A"}
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
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
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

export default Laporan;
