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
import { LoadingIcon } from '../../../assets/icons/icons';
import ModalIcon from '../ModalIcon/ModalIcon';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: '1px solid #ccc',
    boxShadow: 24,
};

export default function ModalCreatePost({ openModel, closeModel, openFile, dataOwner, openIcon }) {
    const [openAccess, setOpenAccess] = useState(false);
    const [accessLabel, setAccessLabel] = useState(dataOwner?.post_privacy === 1 ? 'Công khai' : 'Chỉ mình tôi');
    const [accessIcon, setAccessIcon] = useState(dataOwner?.post_privacy === 1 ? images.global : images.private);
    const [openSelectFile, setOpenSelectFile] = useState(false);
    const [valueInput, setValueInput] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]); // State to hold selected files with media types
    const [loadingSendPost, setLoadingSendPost] = useState(false);
    const [openIconModal, setOpenIconModal] = useState(false); // State for Icon Modal
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [showBtnSubmit, setShowBtnSubmit] = useState(false);
    useEffect(() => {
        if (openIcon === true) {
            handleOpenIconModal();
        }
    }, [openIcon]);
    useEffect(() => {
        if (valueInput !== '' || selectedFiles.length > 0 || selectedIcon !== null) {
            console.log('hiện nút');
            setShowBtnSubmit(true);
        } else {
            setShowBtnSubmit(false);
        }
    }, [valueInput, selectedFiles, selectedIcon]);

    const handleOpenAccess = () => {
        setOpenAccess(true);
    };

    const handleCloseAccess = () => {
        setOpenAccess(false);
    };

    const handleAccessChange = (newAccess) => {
        const updatedLabel = getAccessLabel(newAccess);
        setAccessLabel(updatedLabel);
        setAccessIcon(newAccess === 'Công khai' ? images.global : images.private);
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
        const imageUrls = [];
        const validFiles = [];

        files.forEach((file) => {
            const mediaType = file.type.startsWith('image/')
                ? 'image'
                : file.type.startsWith('video/')
                ? 'video'
                : null;

            if (mediaType) {
                imageUrls.push(URL.createObjectURL(file));
                validFiles.push({ file, mediaType }); // Store valid file with its media type
            }
        });

        setSelectedImages(imageUrls);
        setSelectedFiles(validFiles); // Store valid files
    };

    const handleCancel = () => {
        setOpenSelectFile(false);
        setSelectedImages([]);
        setSelectedFiles([]);
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
            const initialAccess = dataOwner.post_privacy === 1 ? 'Công khai' : 'Chỉ mình tôi';
            setAccessLabel(initialAccess);
            setAccessIcon(initialAccess === 'Công khai' ? images.global : images.private);
        }
    }, [dataOwner]);

    const handlePost = async () => {
        setLoadingSendPost(true); // Show loading icon
        const userId = dataOwner?.user_id;
        const privacy = accessLabel === 'Công khai' ? 1 : 0;
        const postText = valueInput;
        const emoji = selectedIcon ? `đang cảm thấy ${selectedIcon?.label} ${selectedIcon?.icon}` : '';
        const formData = new FormData();
        formData.append('user_id', userId);
        formData.append('post_privacy', privacy);
        formData.append('post_text', postText);
        formData.append('react_emoji', emoji);

        for (const { file, mediaType } of selectedFiles) {
            formData.append('file', file);
            formData.append('media_type', mediaType); // Add media type to FormData
        }

        const response = await postData(API_CREATE_POST, formData);
        console.log(response);
        // Handle response as needed
        if (response.status === true) {
            setLoadingSendPost(false);
            closeModel();
            setTimeout(() => {
                window.location.reload(); // Refresh the page on successful post
            }, 2000);
        }
    };

    const hanleChangeInput = (e) => {
        setValueInput(e.target.value);
    };

    const handleOpenIconModal = () => setOpenIconModal(true);
    const handleCloseIconModal = () => setOpenIconModal(false);

    const handleSelectIcon = (icon) => {
        // const newValue = `Đang cảm thấy ${icon.label} ${icon.icon}`;
        // setValueInput(newValue); // Cập nhật giá trị input
        setSelectedIcon(icon);
        setOpenIconModal(false); // Đóng modal sau khi chọn
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
                                <div className="user_name">
                                    {dataOwner?.user_name}{' '}
                                    {selectedIcon && (
                                        <span>{`đang cảm thấy ${selectedIcon.label} ${selectedIcon.icon}`}</span>
                                    )}
                                </div>
                                <div className="access_post" onClick={handleOpenAccess}>
                                    <img src={accessIcon} alt="Access Icon" />
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
                                        <div onClick={handleOpenIconModal}>
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
                                            {selectedFiles.length > 0 && (
                                                <div className={`image-grid`}>
                                                    {selectedFiles.map((item, index) => {
                                                        const { mediaType } = item;
                                                        const mediaUrl = URL.createObjectURL(item.file);
                                                        return mediaType === 'image' ? (
                                                            <img key={index} src={mediaUrl} alt={`Selected ${index}`} />
                                                        ) : (
                                                            <video key={index} controls className="video-preview">
                                                                <source src={mediaUrl} type={item.file.type} />
                                                                Your browser does not support the video tag.
                                                            </video>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                            {!selectedFiles.length && (
                                                <>
                                                    <div className="icon_file_chose">
                                                        <MdAddPhotoAlternate className="icon-add" />
                                                    </div>
                                                    <div className="text-heading">Add photos/videos</div>
                                                    <span className="text-subheading">or drag and drop</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*,video/*" // Accept only images and videos
                                        multiple
                                        className="input-file"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="btn_dang">
                            {loadingSendPost ? (
                                <div className="send_mesage_action">
                                    <ButtonCustom title="" startIcon={<LoadingIcon />} className="primary" />
                                </div>
                            ) : (
                                <>
                                    {showBtnSubmit && (
                                        <ButtonCustom
                                            type="submit"
                                            onClick={handlePost}
                                            title="Đăng bài"
                                            className="primary"
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <span className="close_btn_model">
                        <CloseBtn onClick={closeModel} />
                    </span>

                    <ModalAccess
                        title="Đối tượng bài viết"
                        openAccess={openAccess}
                        closeAccess={handleCloseAccess}
                        initialValue={accessLabel}
                        onAccessChange={handleAccessChange}
                    />
                    <ModalIcon
                        onSelectIcon={handleSelectIcon} // Pass the function here
                        title="Bạn đang cảm thấy thế nào?"
                        openIconModal={openIconModal}
                        handleClose={() => setOpenIconModal(false)}
                    />
                </Box>
            </Modal>
        </div>
    );
}
