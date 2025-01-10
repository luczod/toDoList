import { BrowserRouter } from "react-router";
import { useAuth } from "../hooks/auth";
import AuthRoutes from "./auth.routes";
import ListRoutes from "./list.routes";

function AppRoutes() {
  const { logged } = useAuth();

  return (
    <BrowserRouter>{logged ? <ListRoutes /> : <AuthRoutes />}</BrowserRouter>
  );
}

export default AppRoutes;
