import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./screens/Login";
import CustomerList from "./screens/CustomerList";
import CustomerDetail from "./screens/CustomerDetail";
import Notifications from "./screens/Notifications";
import Layout from "./layout/Layout";
import { useState } from "react";
import { tokenStorage } from "./utils/axios";

function PrivateRoute({ children }) {
  const token = tokenStorage.getAccess();

  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
      !!tokenStorage.getAccess()
    );
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)}/>} />

      {/* Private */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        {/* default route → customers */}
        <Route index element={<CustomerList />} />

        <Route path="customer/:id" element={<CustomerDetail />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}