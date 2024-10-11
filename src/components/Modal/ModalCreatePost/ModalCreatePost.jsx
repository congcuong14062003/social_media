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

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: '1px solid #ccc',
    boxShadow: 24,
};

const getCSSVariableValue = (variableName) => {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
};

export default function ModalCreatePost({ openModel, closeModel, openFile, dataOwner }) {
    const [openAccess, setOpenAccess] = useState(false);
    const [accessLabel, setAccessLabel] = useState('Công khai');
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

    const handlePost = async () => {
        // Handle post submission logic here
        // const formData = new FormData();

        // Lấy các giá trị cần thiết
        const userId = dataOwner?.user_id; // Giả sử `dataOwner` chứa thông tin người dùng
        const privacy = accessLabel === 'Công khai' ? 1 : accessLabel === 'Bạn bè' ? 2 : 0;
        const postText = valueInput; // Nội dung bài viết từ textarea
        const response = await postData(API_CREATE_POST, {
            user_id: userId,
            post_privacy: privacy,
            post_text: postText,
        });
        console.log(response);
        if ((response.status = true)) {
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }

        // Nếu có ảnh/video được chọn
        // selectedImages.forEach((image, index) => {
        //     formData.append(`file_${index}`, image); // Chèn file vào formData
        // });
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
                                    <img src={images.global} alt="" />
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
                        initialValue={accessLabel}
                        onAccessChange={handleAccessChange}
                    />
                </Box>
            </Modal>
        </div>
    );
}
