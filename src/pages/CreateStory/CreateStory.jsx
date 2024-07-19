import { Link, useNavigate } from 'react-router-dom';
import images from '../../assets/imgs';
import CloseBtn from '../../components/CloseBtn/CloseBtn';
import config from '../../configs';
import './CreateStory.scss';
import { IoMdSettings } from 'react-icons/io';
import PrimaryIcon from '../../components/PrimaryIcon/PrimaryIcon';
import ModalAccess from '../../components/Modal/ModalAccess/ModalAccess';
import { useContext, useRef, useState } from 'react';
import { IoText } from 'react-icons/io5';
import { FaImage } from 'react-icons/fa6';
import AvatarUser from '../../components/AvatarUser/AvatarUser';
import ButtonCustom from '../../components/ButtonCustom/ButtonCustom';
import { TextField } from '@mui/material';
function CreateStory() {
    const [openAccess, setOpenAccess] = useState(false);

    const handleOpenAccess = () => {
        setOpenAccess(true);
    };
    const handleCloseAccess = () => {
        setOpenAccess(false);
    };
    const [accessLabel, setAccessLabel] = useState('Công khai');
    const handleAccessChange = (newAccess) => {
        setAccessLabel(getAccessLabel(newAccess));
    };
    const getAccessLabel = (value) => {
        switch (value) {
            case 'Công khai':
                return 'Công khai';
            case 'Bạn bè':
                return 'Bạn bè';
            case 'Chỉ mình tôi':
                return 'Chỉ mình tôi';
            default:
                return '';
        }
    };

    // useEffect(() => {
    //     document.title = titlePage;
    // }, [titlePage]);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    // const { setImage } = useContext(ImageContext);

    const handleFileChange = () => {
        const file = inputRef.current.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // setImage(reader.result);
                navigate('/story/create/preview/image');
            };
            reader.readAsDataURL(file);
        }
    };
    return (
        <div className="create_story_container">
            <div className="left_container">
                <div className="content_left_story">
                    <div className="body_left">
                        <div className="container_body">
                            <div className="header_body">
                                <p>Tin của bạn</p>
                                <div onClick={handleOpenAccess} className="icon_setting">
                                    <PrimaryIcon icon={<IoMdSettings />} />
                                </div>
                            </div>
                            <div className="user_infor">
                                <AvatarUser />
                                <div className="name_user">Công Cường</div>
                            </div>
                        </div>
                    </div>

                    <div className="text_action_container">
                        <div className="text_fild_content">
                            <TextField
                                id="outlined-multiline-static"
                                multiline
                                rows={6}
                                className="text_fild"
                                placeholder="Bắt đầu nhập"
                            />
                        </div>
                    </div>
                    {true && (
                        <div className="action_left_story">
                            <div className="btn_cancel_story">
                                <ButtonCustom className="secondary" title="Bỏ" />
                            </div>
                            <div className="btn_ok_story">
                                <ButtonCustom title="Chia sẻ lên tin" />
                            </div>
                        </div>
                    )}

                    <ModalAccess
                        onAccessChange={handleAccessChange}
                        initialValue={accessLabel}
                        title="Quyền riêng tư của tin"
                        openAccess={openAccess}
                        closeAccess={handleCloseAccess}
                    />
                </div>
                {/* <div className="action_go_home">
                    <Link to={config.routes.home}>
                        <CloseBtn className="close_create_story" />
                    </Link>
                    <div className="logo_app">
                        <img src={images.logo} alt="" />
                    </div>
                </div> */}
            </div>
            <div className="right_container">
                {false && (
                    <div className="image_or_text">
                        <label htmlFor="create_story_image" className="direct create_story_image_container">
                            <div className="icon">
                                <FaImage />
                            </div>
                            <p>Tạo tin ảnh</p>
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            id="create-story--image"
                            hidden
                            // ref={inputRef}
                            // onChange={handleFileChange}
                        />
                        <div className="direct create_story_text_container">
                            <div className="icon">
                                <IoText />
                            </div>
                            <p>Tạo tin dạng văn bản</p>
                        </div>
                    </div>
                )}
                <div className="text_render_container">
                    <div className="content_render">
                        <p className="title_render">Xem trước</p>
                        <div className="body_render">
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateStory;
