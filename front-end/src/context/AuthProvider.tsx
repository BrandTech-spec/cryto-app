import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";


import { getCurrentUser } from "@/lib/appwrite/api";
import { User } from "@/lib/appwrite/appWriteConfig";

export const INITIAL_USER = {
    $id: '',
    user_name: '',
    password: '',
    email: '',
    available_balance: 0,
    profite: 0,
    passcode: '',
    user_id: '',
    image_url: '',
   
  };

  export const trade_data = {
    open_price:0,
    close_price:0,
    percentage_changes:0,
    price_changes:0
  }

const INITIAL_STATE = {
  tradeData:trade_data,
  setTradeData:() => {},
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

type IContextType = {
  user: User;
  isLoading: boolean;
  tradeData: typeof trade_data, 
  setTradeData:React.Dispatch<React.SetStateAction<typeof trade_data>>,
  setUser: React.Dispatch<React.SetStateAction<User>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState< typeof INITIAL_USER>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tradeData, setTradeData] = useState(trade_data)

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentAccount = await getCurrentUser();
      if (currentAccount) {
        setUser(currentAccount);
        setIsAuthenticated(true);
       navigate("/buy");
        return true;
      }

      return false;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cookieFallback = localStorage.getItem("cookieFallback");
    if (
      cookieFallback === "[]" ||
      cookieFallback === null ||
      cookieFallback === undefined
    ) {
       navigate("/landing");
    }

    checkAuthUser();
  }, []);

  const value = {
    user,
    setUser,
    tradeData,
    setTradeData,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);