import { Route, Routes } from "react-router";
import Home from "../pages/list";

export default function ListRoutes() {
  return (
    <Routes>
      <Route path="/list" element={<Home />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
