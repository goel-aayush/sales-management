import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "../pages/Dashboard";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Main Dashboard Route */}
        <Route path="/" element={<Dashboard />} />

        {/* Fallback for 404 - Redirect to Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
