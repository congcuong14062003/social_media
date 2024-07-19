import images from '../../assets/imgs';
import './AvatarUser.scss';
function AvatarUser() {
    return (
        <div className="avatar_user">
            <img src={images.avt} alt="" />
        </div>
    );
}

export default AvatarUser;
