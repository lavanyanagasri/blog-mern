import React, { useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = React.createContext();

const AuthContextProvider = (props) => {
  const [activeUser, setActiveUser] = useState({});
  const [config, setConfig] = useState({}); // Init empty

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setActiveUser({});
      return;
    }

    const updatedConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    setConfig(updatedConfig);

    const controlAuth = async () => {
      try {
        const { data } = await axios.get("/auth/private", updatedConfig);
        setActiveUser(data.user);
      } catch (error) {
        localStorage.removeItem("authToken");
        setActiveUser({});
      }
    };

    controlAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ activeUser, setActiveUser, config, setConfig }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
