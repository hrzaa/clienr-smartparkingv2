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
import Aldini from "./components/aldini/index";
import Login from "./components/Login";
import Register from "./components/Register";
import Settings from "./components/Settings";
import PrivateRoute from "./components/PrivateRoute";
import ParkingDetection1 from "./components/aldini/ParkingDetection1";
import ParkingDetection2 from "./components/aldini/ParkingDetection2";

function App() {
  useEffect(() => {
    document.title = `Smart Parking`;
  });

  return (
    <div className="container">
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
          {/* <Route
            path="/gates"
            element={
              <PrivateRoute>
                <Gates />
              </PrivateRoute>
            }
          /> */}
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
          {/* <Route path="/parkings" element={<ParkingList />} /> */}
          <Route path="/parkingsv1" element={<ParkingListv1 />} />
          <Route path="/emptyParking" element={<EmptyParking />} />
          <Route path="/laporan" element={<Laporan />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/Success" element={<Success />} />
          <Route path="/parking_areas_1" element={<ParkingDetection1 />} />
          <Route path="/parking_areas_2" element={<ParkingDetection2 />} />
          <Route path="/aldini" element={<Aldini />} />
          <Route path="/gates" element={<Gates />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
