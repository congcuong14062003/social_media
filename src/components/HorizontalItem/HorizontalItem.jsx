import { Link } from 'react-router-dom';
import './HorizontalItem.scss';
import AvatarUser from '../AvatarUser/AvatarUser';
function HorizontalItem({ avt, icon, title, className, dark, handleClick, to, isActive}) {
    const classes = `container_item ${className} ${isActive ? 'active' : ''}`;
    return (
        <Link to={to}>
            <div onClick={handleClick && handleClick} className={classes}>
                {avt && <div className="avatar_user_item"><AvatarUser avatar={avt} /></div>}
                {icon && <div className="icon_item">{icon}</div>}
                <div className="title_item">{title}</div>
            </div>
        </Link>
    );
}

export default HorizontalItem;
