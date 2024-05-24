import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import useSWR, { useSWRConfig } from "swr";
import Cookies from "js-cookie";
import moment from "moment";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Users = () => {
   const apiKey = Cookies.get("token");

   const { mutate } = useSWRConfig();
   const fetcher = async () => {
     const response = await axios.get(
       `http://localhost:5000/api/users?apiKey=${apiKey}`
     );
     return response.data;
   };

   const { data } = useSWR("users", fetcher);
   if (!data || !data.data) return <h2>Loading...</h2>;

   const usersData = data.data;

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <div className="text-center">
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-10">
              List All Users
            </h1>
          </div>
          <div className="relative shadow rounded-lg mt-3">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="py-3 px-1 text-center">No</th>
                  <th className="py-3 px-6">Username</th>
                  <th className="py-3 px-6">Role</th>
                </tr>
              </thead>
              <tbody>
                {usersData.map((users, index) => (
                  <tr className="bg-white border-b" key={users.parkingId}>
                    <td className="py-3 px-1 text-center">{index + 1}</td>
                    <td className="py-3 px-6 font-medium text-gray-900">
                      {users.username}
                    </td>
                    <td className="py-3 px-6">
                      <button class="justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        {users.role}
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

export default Users;
