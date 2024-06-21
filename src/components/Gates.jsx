import React from "react";
import axios from "axios";
import useSWR, { useSWRConfig } from "swr";
// import Cookies from "js-cookie";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { API_BASE_URL } from "../config";

const Gates = () => {

  const { mutate } = useSWRConfig();
  const fetcher = async () => {
    const response = await axios.get(`${API_BASE_URL}gates`);
    return response.data;
  };

  const { data } = useSWR("gates", fetcher);
  if (!data || !data.data) return <h2>Loading...</h2>;

  const gatesData = data.data;
  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <div className="text-center">
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-10">
              Gates
            </h1>
          </div>
          <div className="relative shadow rounded-lg mt-3">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="py-3 px-1 text-center">No</th>
                  <th className="py-3 px-6">Gates</th>
                  <th className="py-3 px-6">Status</th>
                </tr>
              </thead>
              <tbody>
                {gatesData.map((gates, index) => (
                  <tr className="bg-white border-b" key={gates.gatesId}>
                    <td className="py-3 px-1 text-center">{index + 1}</td>
                    <td className="py-3 px-6 font-medium text-gray-900">
                      {gates.gatesName}
                    </td>
                    <td className="py-3 px-6">
                      <button
                        className={`justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                          gates.gateStatus === 1
                            ? "bg-green-600 hover:bg-green-500 focus-visible:outline-green-600"
                            : "bg-red-600 hover:bg-red-500 focus-visible:outline-red-600"
                        }`}
                      >
                        {gates.gateStatus === 1 ? "Open" : "Close"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gates;
