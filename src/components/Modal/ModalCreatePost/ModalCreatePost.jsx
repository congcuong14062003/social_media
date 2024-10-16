import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faXmark } from '@fortawesome/free-solid-svg-icons';
import './ModalCreatePost.scss';
import AvatarUser from '../../AvatarUser/AvatarUser';
import images from '../../../assets/imgs';
import Button from '@mui/material/Button';
import ModalAccess from '../ModalAccess/ModalAccess';
import { MdAddPhotoAlternate, MdCancel } from 'react-icons/md';
import { useEffect, useState } from 'react';
import CloseBtn from '../../CloseBtn/CloseBtn';
import ButtonCustom from '../../ButtonCustom/ButtonCustom';
import { postData } from '../../../ultils/fetchAPI/fetch_API';
import { API_CREATE_POST } from '../../../API/api_server';

// Modal style
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: '1px solid #ccc',
    boxShadow: 24,
};

// Component
export default function ModalCreatePost({ openModel, closeModel, openFile, dataOwner }) {
    const [openAccess, setOpenAccess] = useState(false);
    const [accessLabel, setAccessLabel] = useState(dataOwner?.post_privacy === 1 ? "Công khai" : "Chỉ mình tôi");
    const [accessIcon, setAccessIcon] = useState(dataOwner?.post_privacy === 1 ? images.global : images.private);
    const [openSelectFile, setOpenSelectFile] = useState(false);
    const [valueInput, setValueInput] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);

    const handleOpenAccess = () => {
        setOpenAccess(true);
    };

    const handleCloseAccess = () => {
        setOpenAccess(false);
    };

    const handleAccessChange = (newAccess) => {
        const updatedLabel = getAccessLabel(newAccess);
        setAccessLabel(updatedLabel);
        setAccessIcon(newAccess === 'Công khai' ? images.global : images.private); // Update icon based on access level
    };

    const getAccessLabel = (value) => {
        switch (value) {
            case 'Công khai':
                return 'Công khai';
            case 'Chỉ mình tôi':
                return 'Chỉ mình tôi';
            default:
                return '';
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const imageUrls = files.map((file) => URL.createObjectURL(file));
        setSelectedImages(imageUrls);
    };

    const handleCancel = () => {
        setOpenSelectFile(false);
        setSelectedImages([]);
    };

    const handleOpenSelectFile = () => {
        setOpenSelectFile(true);
    };

    useEffect(() => {
        if (openFile) {
            setOpenSelectFile(true);
        }
    }, [openFile]);

    useEffect(() => {
        if (dataOwner) {
            const initialAccess = dataOwner.post_privacy === 1 ? "Công khai" : "Chỉ mình tôi";
            setAccessLabel(initialAccess);
            setAccessIcon(initialAccess === "Công khai" ? images.global : images.private);
        }
    }, [dataOwner]);

    const handlePost = async () => {
        const userId = dataOwner?.user_id; // Get user ID
        const privacy = accessLabel === 'Công khai' ? 1 : 0; // Determine privacy value
        const postText = valueInput; // Get post content

        // Log for debugging
        console.log('Access Label:', accessLabel); 

        // Send POST request
        const response = await postData(API_CREATE_POST, {
            user_id: userId,
            post_privacy: privacy,
            post_text: postText,
        });

        console.log(response);

        if (response.status) {
            setTimeout(() => {
                window.location.reload(); // Refresh the page on successful post
            }, 1000);
        }
    };

    const hanleChangeInput = (e) => {
        setValueInput(e.target.value);
    };

    return (
        <div className="modal_container">
            <Modal
                open={openModel}
                onClose={closeModel}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style }} className="model_content">
                    <div className="header_modal">
                        <h2 id="parent-modal-title">Tạo bài viết</h2>
                    </div>
                    <div className="content_modal">
                        <div className="user_control">
                            <AvatarUser />
                            <div className="infor_user">
                                <div className="user_name">{dataOwner?.user_name}</div>
                                <div className="access_post" onClick={handleOpenAccess}>
                                    <img src={accessIcon} alt="Access Icon" /> {/* Use the state for icon */}
                                    <span>{accessLabel}</span>
                                    <FontAwesomeIcon icon={faCaretDown} />
                                </div>
                            </div>
                        </div>

                        <div className="input_post">
                            <textarea
                                onChange={hanleChangeInput}
                                value={valueInput}
                                rows={4}
                                className="text_input_post"
                                placeholder={`${dataOwner?.user_name} ơi bạn đang nghĩ gì thế`}
                            />
                        </div>

                        <div className="file_and_others">
                            {!openSelectFile && (
                                <div className="option_activity">
                                    <p>Thêm vào bài viết của bạn</p>
                                    <div className="activities_post">
                                        <div onClick={handleOpenSelectFile}>
                                            <img src={images.anhvavideo} alt="" />
                                        </div>
                                        <div>
                                            <img src={images.usertag} alt="" />
                                        </div>
                                        <div>
                                            <img src={images.iconvahoatdong} alt="" />
                                        </div>
                                        <div>
                                            <img src={images.location} alt="" />
                                        </div>
                                        <div>
                                            <img src={images.gif} alt="" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {openSelectFile && (
                                <div className="select_file_post">
                                    <MdCancel className="icon-cancel" onClick={handleCancel} />
                                    <div className="images_preview">
                                        <div className="image_container">
                                            {selectedImages.length > 0 && (
                                                <div className={`image-grid`}>
                                                    {selectedImages.map((image, index) => (
                                                        <img key={index} src={image} alt={`Selected ${index}`} />
                                                    ))}
                                                </div>
                                            )}
                                            {!selectedImages.length && (
                                                <>
                                                    <div>
                                                        <MdAddPhotoAlternate className="icon-add" />
                                                    </div>
                                                    <div className="text-heading">Add photos</div>
                                                    <span className="text-subheading">or drag and drop</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="input-file"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="btn_dang">
                            <ButtonCustom type="submit" onClick={handlePost} title="Đăng bài" className="primary" />
                        </div>
                    </div>

                    <span className="close_btn_model">
                        <CloseBtn onClick={closeModel} />
                    </span>

                    <ModalAccess
                        title="Đối tượng bài viết"
                        openAccess={openAccess}
                        closeAccess={handleCloseAccess}
                        initialValue={accessLabel} // Truyền giá trị accessLabel vào ModalAccess
                        onAccessChange={handleAccessChange}
                    />
                </Box>
            </Modal>
        </div>
    );
}
