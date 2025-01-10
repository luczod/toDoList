import { Route, Routes } from "react-router";
import Login from "../pages/SignIn/login";
import Register from "../pages/SignIn/register";

export default function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
