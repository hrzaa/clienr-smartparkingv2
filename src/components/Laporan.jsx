import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}parkings?apiKey=${apiKey}`
      );
      if (response.data && Array.isArray(response.data.data)) {
        setParkingData(response.data.data);
      } else {
        setParkingData([]); // Pastikan set ke array jika data tidak sesuai
      }
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePrint = async () => {
    const input = document.getElementById("parking-table");
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgWidth = 190;
    const pageHeight = pdf.internal.pageSize.height;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 10;

    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("Laporan.pdf");
  };

  if (loading) return <h2>Loading...</h2>;
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
            <div id="parking-table" className="relative shadow rounded-lg mt-3 overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th className="py-3 px-1 text-center">No</th>
                    <th className="py-3 px-3 sm:px-6">Code</th>
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
                      <td className="py-3 px-1 text-center">{index + 1}</td>
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
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default Laporan;
