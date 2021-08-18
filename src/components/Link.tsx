import { Link, LinkProps, useLocation } from "react-router-dom";

const Navbar = ({ children, ...restProps }: LinkProps) => {
    const location = useLocation()

    return (
        <Link className={location.pathname === restProps.to ? 'link-active' : 'link-inactive'} {...restProps}>
            {children}
        </Link>
    );
}

export default Navbar;