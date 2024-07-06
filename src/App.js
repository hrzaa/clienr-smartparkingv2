import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Users from "./components/Users";
import Price from "./components/Price";
import ParkingList from "./components/ParkingList";
import ParkingListv1 from "./components/ParkingListv1";
import EmptyParking from "./components/EmptyParking";
import Laporan from "./components/Laporan";
import Payment from "./components/Payment";
import Success from "./components/Success";
import Gates from "./components/Gates";
import Login from "./components/Login";
import Register from "./components/Register";
import Settings from "./components/Settings";
import PrivateRoute from "./components/PrivateRoute";
import ParkingDetection2 from "./components/parkings/ParkingDetection2";
import ParkingDetection3 from "./components/parkings/ParkingDetection3";
import ParkingDetection4 from "./components/parkings/ParkingDetection4";
import ParkingDetection1 from "./components/parkings/ParkingDetection1";

function App() {
  useEffect(() => {
    document.title = `Smart Parking`;
  });

  return (
    <Router>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/parkings"
          element={
            <PrivateRoute>
              <ParkingList />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          }
        />
        <Route
          path="/price"
          element={
            <PrivateRoute>
              <Price />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/parkingsv1" element={<ParkingListv1 />} />
        <Route path="/emptyParking" element={<EmptyParking />} />
        <Route path="/laporan" element={<Laporan />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/Success" element={<Success />} />
        <Route path="/gates" element={<Gates />} />
        <Route path="/parking_detections/1" element={<ParkingDetection1 />} />
        <Route path="/parking_detections/2" element={<ParkingDetection2 />} />
        <Route path="/parking_detections/3" element={<ParkingDetection3 />} />
        <Route path="/parking_detections/4" element={<ParkingDetection4 />} />
      </Routes>
    </Router>
  );
}

export default App;
