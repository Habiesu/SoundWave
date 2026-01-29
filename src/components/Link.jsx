import { Link as NavLink } from "react-router"
import { useRouter } from "../hooks/useRouter"
import styles from "../styles/Sidebar.module.css"

export function Link({ href, children, className, ...restOfProps }) {

    const {currentPath, navigateTo} = useRouter()
    const isActive = href === currentPath

    const computedClassName = isActive
        ? `${className || styles.navLink} ${styles.active}`.trim()
        : className || styles.navLink

    return (
        <NavLink aria-current={isActive ? 'page' : undefined} to={href} {...restOfProps} className={computedClassName} onClick={() => navigateTo(href)}>
            {children}
        </NavLink>
    )
} 