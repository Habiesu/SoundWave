/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const Login = () => {
        setIsLoggedIn(true)
    }

    const Logout = () => {
        setIsLoggedIn(false)
    }

    const value = {
        isLoggedIn,
        Login,
        Logout
    }
    return (
        // En versiones anteriores a React 18.3, en vez de AutoContext value={value} se usaba AutoContext.Provider value={value}, en este caso no porque tengo React en su versión 19.2.0
        <AuthContext value={value}>
            {children}
        </AuthContext>
    )
}
