import { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [editServiceModal, setEditServiceModal] = useState(false);

  return (
    <GlobalContext.Provider value={{ editServiceModal, setEditServiceModal }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useBarberGlobal = () => useContext(GlobalContext);
