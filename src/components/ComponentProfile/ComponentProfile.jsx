import { Link } from 'react-router-dom';
import './ComponentProfile.scss';
function ComponentProfile({ title, link, linktitle, children }) {
    return (
        <div className="component_profile_container">
            <div className="header_component">
                <p className="title">{title}</p>
                <div className="link_component">
                    <Link to={link}>{linktitle}</Link>
                </div>
            </div>
            <div className='childern_component'>{children}</div>
        </div>
    );
}

export default ComponentProfile;
