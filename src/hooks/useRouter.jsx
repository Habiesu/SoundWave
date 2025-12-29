import { useNavigate, useLocation } from "react-router";
import { useCallback } from "react";

export function useRouter() {
    const navigate = useNavigate()
    const location = useLocation()
    const currentPath = location.pathname

    const navigateTo = useCallback((path) => {
        console.log(`Navegando a ${path}`)
        navigate(path)
    }, [navigate])

    return {
        currentPath,
        navigateTo
    }
}
