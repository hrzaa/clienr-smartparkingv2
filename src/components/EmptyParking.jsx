import axios from "axios";
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { API_BASE_URL } from "../config";

const EmptyParking = () => {
  const [parkingData, setParkingData] = useState([]);
  const [areaName, setAreaName] = useState([
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}areas`
        );
        setParkingData(response.data.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    // fetchData();

    const fetchAndUpdateEverySecond = async () => {
      await fetchData();
      setInterval(fetchData, 2000);
    };

    fetchAndUpdateEverySecond();
  }, []);

  useEffect(() => {
    if (parkingData.length) {
      setAreaName(
        areaName.filter((area) =>
          parkingData.some((data) => data.area.includes(area))
        )
      );
    }
  }, [parkingData]);

  console.log(parkingData);

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <div className="flex justify-center items-center gap-x-1 w-full pt-5 mb-10">
            <div className="w-5 h-5 rounded-full shadow bg-red-400 border-4 border-green-400"></div>
            <h1 className="text-5xl font-bold text-slate-800">
              PARKING INFORMATION
            </h1>
            <div className="w-5 h-5 rounded-full shadow bg-red-400 border-4 border-green-400"></div>
            {/* <div className="w-5 h-5 rounded-full shadow bg-green-400"></div> */}
          </div>
          
            {!loading &&
              areaName.map((area, index) => (
                <div key={index} className="flex items-center gap-x-5 mb-3">
                  <div className="w-1/5">
                    <h1 className="flex items-center justify-end text-3xl h-14 text-slate-600">
                      AREA =
                      <span className="font-bold text-3xl text-slate-800 ml-3">
                        {area}
                      </span>
                    </h1>
                  </div>
                  <div className="flex flex-wrap bg-slate-300 w-3/5 gap-2 p-2 rounded-full shadow">
                    {parkingData.map((item) => {
                      if (item.area.includes(area))
                        return (
                          <div
                            key={item.areaId}
                            className={`flex justify-center items-center w-14 h-14 bg-${
                              item.status ? "red" : "green"
                            }-400 font-semibold text-2xl rounded-full shadow`}
                          >
                            {item.area}
                          </div>
                        );
                    })}
                  </div>
                </div>
              ))}
          
        </div>
      </div>
    </div>
  );
};

export default EmptyParking;
