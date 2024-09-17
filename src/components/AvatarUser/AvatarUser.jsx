import { useContext } from 'react';
import images from '../../assets/imgs';
import './AvatarUser.scss';
import { OwnDataContext } from '../../provider/own_data';
function AvatarUser({avatar}) {
    const dataUser = useContext(OwnDataContext);
    return (
        <div className="avatar_user">
            <img src={avatar || dataUser?.avatar} alt="" />
        </div>
    );
}

export default AvatarUser;
