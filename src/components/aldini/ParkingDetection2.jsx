import axios from "axios";
import React, { useEffect, useState } from "react";

const ParkingDetection2 = () => {
  const [parkingData, setParkingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://harezayoankristianto.online/api/parking_areas"
        // "http://localhost:5000/api/parking_areas"
      );
      setParkingData(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const fetchAndUpdateEverySecond = async () => {
    await fetchData();
    setInterval(fetchData, 2000);
  };

  useEffect(() => {
    fetchAndUpdateEverySecond();
  }, []);

  console.log(parkingData);

  return (
    <>
      {parkingData.length ? (
        <div className="bg-zinc-300 text-zinc-600 w-full min-h-screen p-5">
          <div className="text-center">
            <h1 className="text-xl sm:text-3xl lg:5xl py-10 tracking-widest font-bold">
              PARKING INFORMAITON
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {!loading &&
              parkingData.map((data, i) => {
                return (
                  <div
                    key={data.id}
                    className="bg-zinc-200 p-5 shadow-lg rounded"
                  >
                    <h1 className="text-center text-zinc-600 pb-5 font-semibold text-xl lg:text-2xl">
                      {data.parking_name}
                    </h1>
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                      {data.parkingSpaces.map((item, i) => {
                        return (
                          <div
                            key={item.id}
                            className={`flex justify-center items-center w-full h-20 bg-${
                              item.status ? "red" : "green"
                            }-400 rounded font-semibold text-2xl shadow-lg text-zinc-800`}
                          >
                            {item.space_name}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <div className="bg-zinc-300 text-zinc-600 flex justify-center items-center w-full h-screen">
          <h1 className="tracking-widest font-bold text-2xl sm:text-4xl lg:text-6xl">
            SISTEM IS OFFLINE
          </h1>
        </div>
      )}
      <div className="bg-red-400 h-0"></div>
      <div className="bg-green-400 h-0"></div>
    </>
  );
};

export default ParkingDetection2;
