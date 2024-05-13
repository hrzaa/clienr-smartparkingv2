import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ParkingList from "./components/ParkingList";
import EmptyParking from "./components/EmptyParking";
import Login from "./components/Login";

function App() {
  useEffect(() => {
    document.title = `Smart Parking`;
  });

  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/parkings" element={<ParkingList />} />
          <Route path="/emptyParking" element={<EmptyParking />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
