import { useEffect, useState, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Home from "../GeneralScreens/Home";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";

const PrivateRoute = () => {
  const [auth, setAuth] = useState(null); // use null initially
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setActiveUser, setConfig } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setAuth(false);
      setError("No token found. Please login.");
      navigate("/");
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const controlAuth = async () => {
      try {
        const { data } = await axios.get("/auth/private", config);

        setAuth(true);
        setActiveUser(data.user);
        setConfig(config);
      } catch (err) {
        console.error("Auth failed:", err?.response?.data || err.message);
        localStorage.removeItem("authToken");
        setAuth(false);
        setActiveUser({});
        setError("You are not authorized. Please login.");
        navigate("/");
      }
    };

    controlAuth();
  }, [navigate, setActiveUser, setConfig]);

  if (auth === null) return <div>Loading...</div>;

  return auth ? <Outlet /> : <Home error={error} />;
};

export default PrivateRoute;
