import React from 'react';
import AvatarUser from '../AvatarUser/AvatarUser';
import Search from '../Search/Search';
import './CreatePost.scss';
import images from '../../assets/imgs';
const CreatePost = () => {
    return (
        <div className="container_create_post">
            <div className="header_post">
                <AvatarUser />
                <Search placeholder="Công ơi bạn đang nghĩ gì thế" />
            </div>
            <div className="footer_post">
                <div className="image_and_video">
                    <img src={images.anhvavideo} alt="" />
                    <span>Ảnh/video</span>
                </div>
                <div className="image_and_video">
                    <img src={images.iconvahoatdong} alt="" />
                    <span>Cảm xúc/hoạt động</span>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
