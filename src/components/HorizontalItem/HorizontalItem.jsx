import { Link } from 'react-router-dom';
import './HorizontalItem.scss';
import AvatarUser from '../AvatarUser/AvatarUser';
import AvatarWithText from '../../skeleton/avatarwithtext';
import { useState } from 'react';
function HorizontalItem({ avt, icon, title, className, dark, handleClick, to, isActive }) {
    const classes = `container_item ${className} ${isActive ? 'active' : ''}`;
    const [loaded, setLoaded] = useState(false);
    setTimeout(() => {
        setLoaded(true);
    }, 1000);
    return (
        <Link to={to}>
            {loaded ? (
                <div onClick={handleClick && handleClick} className={classes}>
                    {avt && (
                        <div className="avatar_user_item">
                            <AvatarUser avatar={avt} />
                        </div>
                    )}
                    {icon && <div className="icon_item">{icon}</div>}
                    <div className="title_item">{title}</div>
                </div>
            ) : (
                <div className="loading-skeleton">
                    <AvatarWithText />
                </div>
            )}
        </Link>
    );
}

export default HorizontalItem;
