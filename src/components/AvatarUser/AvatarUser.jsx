import images from '../../assets/imgs';
import './AvatarUser.scss';
function AvatarUser({avatar}) {
    return (
        <div className="avatar_user">
            <img src={avatar} alt="" />
        </div>
    );
}

export default AvatarUser;
