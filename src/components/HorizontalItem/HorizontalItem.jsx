import { Link } from 'react-router-dom';
import './HorizontalItem.scss';
function HorizontalItem({ avt, icon, title, className, dark, handleClick }) {
    const classes = `container_item ${className}`;
    return (
        <Link>
            <div onClick={handleClick && handleClick} className={classes}>
                {avt && <div className="avatar_user_item">{avt}</div>}
                {icon && <div className="icon_item">{icon}</div>}
                <div className="title_item">{title}</div>
            </div>
        </Link>
    );
}

export default HorizontalItem;
