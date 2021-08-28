import "./NavLink.css"
import { Link, LinkProps, useLocation } from "react-router-dom"

const NavLink = ({ children, ...restProps }: LinkProps) => {
  const location = useLocation()
//   return (
//     <Link to={link} className={className || "link"}>
//       {label}
//     </Link>
//   )
  return (
    <Link
      className={
        location.pathname === restProps.to ? "link-active" : "link-inactive"
      }
      {...restProps}
    >
      {children}
    </Link>
  )
}

export default NavLink
