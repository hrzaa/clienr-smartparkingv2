import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";

const ParkingDetection3 = () => {
  const [parkingData, setParkingData] = useState([]);
  const [parkingStatus, setParkingStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("LOADING");
  const [error, setError] = useState(null);
  const [allStatus, setAllStatus] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}parking_areas`);
      if (!response.data.length) {
        setParkingData([]);
      } else if (response.data === "full") {
        setParkingData("full");
      } else {
        const newAllStatus = response.data.flatMap((parking) =>
          parking.parking_spaces.map((space) => space.status)
        );
        setAllStatus(newAllStatus);
        if (JSON.stringify(parkingStatus) !== JSON.stringify(newAllStatus)) {
          const updatedParkingData = response.data.map((item) => ({
            ...item,
            img_url: `${item.img_url}?t=${new Date().getTime()}`,
          }));
          setParkingStatus(newAllStatus);
          setParkingData(updatedParkingData);
        }
      }
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let currentStageLoading = 0;
    const loadingStages = ["LOADING", "LOADING.", "LOADING..", "LOADING..."];

    const interval = setInterval(() => {
      currentStageLoading = (currentStageLoading + 1) % loadingStages.length;
      setLoadingText(loadingStages[currentStageLoading]);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen bg-zinc-300 text-zinc-800">
        <h1 className="font-bold text-2xl lg:text-5xl text-center">
          {loadingText}
        </h1>
      </div>
    );
  }

  if (parkingData === "full") {
    return (
      <div className="flex justify-center items-center w-full min-h-screen bg-zinc-300 text-zinc-800">
        <h1 className="font-bold text-2xl lg:text-5xl text-center">
          PARKING FULL
        </h1>
      </div>
    );
  }

  return (
    <>
      {parkingData.length ? (
        <div className="w-full min-h-screen bg-zinc-300 text-zinc-800 p-3">
          <h1 className="text-center font-semibold text-xl lg:text-5xl p-10">
            PARKING INFORMATION
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {parkingData.map((item) => {
              return (
                <div
                  key={item.id}
                  className="p-3 bg-zinc-200 rounded shadow-lg"
                >
                  <div>
                    <h1 className="font-semibold text-xl text-center">
                      {item.name}
                    </h1>
                    <p className="text-sm mb-2">Location : {item.location}</p>
                  </div>
                  <img
                    src={item.img_url}
                    alt={item.img}
                    className="w-full rounded shadow-lg"
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center w-full min-h-screen bg-zinc-300 text-zinc-800">
          <h1 className="font-bold text-2xl lg:text-5xl text-center">
            SISTEM IS OFFLINE
          </h1>
        </div>
      )}
    </>
  );
};

export default ParkingDetection3;
