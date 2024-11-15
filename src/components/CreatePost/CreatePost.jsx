import React, { useContext, useEffect, useState } from 'react';
import AvatarUser from '../AvatarUser/AvatarUser';
import Search from '../Search/Search';
import './CreatePost.scss';
import images from '../../assets/imgs';
import ModalCreatePost from '../Modal/ModalCreatePost/ModalCreatePost';
import { OwnDataContext } from '../../provider/own_data';
import AvatarWithText from '../../skeleton/avatarwithtext';
import { Link } from 'react-router-dom';
import config from '../../configs';
const CreatePost = () => {
    const [open, setOpen] = useState(false);
    const [openFile, setOpenFile] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [openIconModal, setOpenIconModal] = useState(false); // State for Icon Modal
    const dataOwner = useContext(OwnDataContext);

    useEffect(() => {
        if (dataOwner) {
            setLoaded(true);
        }
    }, [dataOwner]);

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
    const handleOpenIcon = () => {
        setOpen(true);
        setOpenIconModal(true);
    };
    return (
        <>
            {loaded ? (
                <div className="container_create_post">
                    <div className="header_post">
                        <Link to={`${config.routes.profile}/${dataOwner?.user_id}`}>
                            <AvatarUser />
                        </Link>

                        <Search
                            onClick={handleOpen}
                            placeholder={dataOwner?.user_name ? `${dataOwner?.user_name} ơi bạn đang nghĩ gì thế` : ''}
                        />
                    </div>
                    <div className="footer_post">
                        <div className="image_and_video" onClick={handleOpenCreatePost}>
                            <img src={images.anhvavideo} alt="" />
                            <span>Ảnh/video</span>
                        </div>
                        <div className="image_and_video" onClick={handleOpenIcon}>
                            <img src={images.iconvahoatdong} alt="" />
                            <span>Cảm xúc/hoạt động</span>
                        </div>
                    </div>
                    <ModalCreatePost
                        dataOwner={dataOwner}
                        openFile={openFile}
                        openIcon={openIconModal}
                        closeModel={handleClose}
                        openModel={open}
                    />
                </div>
            ) : (
                <div className="loading-skeleton">
                    <AvatarWithText />
                </div>
            )}
        </>
    );
};

export default CreatePost;
