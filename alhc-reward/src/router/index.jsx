import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DetailPage from "../pages/DetailPage";
import { useUser } from "../hooks/useUser";

export default function Router() {
  const { phone } = useUser();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/detail"
        element={phone ? <DetailPage /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}