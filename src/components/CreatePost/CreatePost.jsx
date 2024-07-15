import React from 'react';
import AvatarUser from '../AvatarUser/AvatarUser';
import Search from '../Search/Search';
import './CreatePost.scss';
import images from '../../assets/imgs';
import ModalCreatePost from '../Modal/ModalCreatePost/ModalCreatePost';
const CreatePost = () => {
    const [open, setOpen] = React.useState(false);
    const [openFile, setOpenFile] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpenCreatePost = () => {
        setOpen(true);
        setOpenFile(true);
    };
    return (
        <div className="container_create_post">
            <div className="header_post">
                <AvatarUser />
                <Search onClick={handleOpen} placeholder="Công ơi bạn đang nghĩ gì thế" />
            </div>
            <div className="footer_post">
                <div className="image_and_video" onClick={handleOpenCreatePost}>
                    <img src={images.anhvavideo} alt="" />
                    <span>Ảnh/video</span>
                </div>
                <div className="image_and_video">
                    <img src={images.iconvahoatdong} alt="" />
                    <span>Cảm xúc/hoạt động</span>
                </div>
            </div>
            <ModalCreatePost openFile={openFile} closeModel={handleClose} openModel={open} />
        </div>
    );
};

export default CreatePost;
