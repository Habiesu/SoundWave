import { useContext } from "react"
import { AuthContext } from "../context/AuthContext.jsx"

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('<useAuth> debería ser usado dentro de un <AuthProvider>')
    }
    return context
}