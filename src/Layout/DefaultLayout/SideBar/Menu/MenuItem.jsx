import { NavLink } from 'react-router-dom';

function MenuItem({ to, icon, title, className }) {
    const classes = `menu_items ${className}`;
    return (
        <NavLink className={classes} to={to}>
            
        </NavLink>
    );
}

export default MenuItem;
