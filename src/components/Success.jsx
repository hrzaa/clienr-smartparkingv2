import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Success = () => {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <div className="text-center">
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-10">
              Generate Success
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
