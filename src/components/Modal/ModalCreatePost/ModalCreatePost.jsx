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
import { API_CREATE_POST, API_UPDATE_POST } from '../../../API/api_server';
import { LoadingIcon } from '../../../assets/icons/icons';
import ModalIcon from '../ModalIcon/ModalIcon';
import { useLoading } from '../../Loading/Loading';
import { toast } from 'react-toastify';
import { useSocket } from '../../../provider/socket_context';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: '1px solid #ccc',
    boxShadow: 24,
};

export default function ModalCreatePost({ openModel, closeModel, openFile, dataOwner, openIcon, isEdit, dataEdit }) {
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
    const [isMediaChanged, setIsMediaChanged] = useState(false);
    const { showLoading, hideLoading } = useLoading();
    const socket = useSocket();
    useEffect(() => {
        if (openModel) {
            if (isEdit && dataEdit) {
                console.log(123123232312312);
                // Gán dữ liệu bài viết cũ vào các trường input
                setOpenSelectFile(true);
                setValueInput(dataEdit?.post_text || '');
                const emojiObject =
                    typeof dataEdit.react_emoji === 'string' ? JSON.parse(dataEdit.react_emoji) : dataEdit.react_emoji;

                setSelectedIcon(emojiObject || null);
                setSelectedFiles(dataEdit?.media || []);

                const initialPrivacy = dataEdit.post_privacy === 1 ? 'Công khai' : 'Chỉ mình tôi';
                setAccessLabel(initialPrivacy);
                setAccessIcon(initialPrivacy === 'Công khai' ? images.global : images.private);
            } else if (dataOwner) {
                const defaultPrivacy = dataOwner.post_privacy === 1 ? 'Công khai' : 'Chỉ mình tôi';
                setAccessLabel(defaultPrivacy);
                setAccessIcon(defaultPrivacy === 'Công khai' ? images.global : images.private);
            }
        }
    }, [isEdit, dataEdit, dataOwner, openModel]);

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
        if (files.length + selectedFiles.length > 10) {
            toast.error('Vui lòng chọn tối đa 10 ảnh hoặc video'); // Hiển thị thông báo lỗi
            return; // Dừng lại nếu có lỗi
        }
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
        // Update selectedFiles with new files and clear out previous selections
        setSelectedFiles(validFiles);
        setSelectedImages(imageUrls);
        setIsMediaChanged(true);
    };

    const handleCancel = () => {
        setOpenSelectFile(false);
        setSelectedImages([]);
        setSelectedFiles([]);
        setIsMediaChanged(true);
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
        showLoading(); // Hiển thị loading

        try {
            setLoadingSendPost(true);
            const formData = new FormData();
            formData.append('is_media_changed', isMediaChanged);
            formData.append('user_id', dataOwner?.user_id);
            formData.append('post_privacy', accessLabel === 'Công khai' ? 1 : 0);
            formData.append('post_text', valueInput);
            // Kiểm tra nếu có icon được chọn, chuyển thành chuỗi JSON trước khi gửi
            if (selectedIcon) {
                const emojiData = JSON.stringify({
                    label: selectedIcon.label,
                    icon: selectedIcon.icon,
                });
                formData.append('react_emoji', emojiData);
            } else {
                formData.append('react_emoji', '');
            }

            selectedFiles.forEach(({ file, mediaType }) => {
                formData.append('file', file);
                formData.append('media_type', mediaType);
            });

            const apiUrl = isEdit ? API_UPDATE_POST(dataEdit?.post_id) : API_CREATE_POST; // Xác định API phù hợp
            if (isEdit) formData.append('post_id', dataEdit.post_id); // Thêm post_id khi cập nhật

            const response = await postData(apiUrl, formData);
            if (response.status) {
                setLoadingSendPost(false);
                closeModel();
                setTimeout(() => window.location.reload(), 1000);
                if (!isEdit && accessLabel === 'Công khai') {
                    socket.emit('new_post', {
                        user_create_post: dataOwner?.user_id,
                        post_id: response?.post_id,
                        userName: dataOwner?.user_name,
                        postText: valueInput,
                        created_at: new Date().toISOString(),
                    });
                }
            }
        } catch (error) {
            console.error('Lỗi:', error);
        } finally {
            hideLoading(); // Ẩn loading
            // Gửi thông báo qua socket tới bạn bè khi tạo bài viết thành công
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
                        <h2>{isEdit ? 'Chỉnh sửa bài viết' : 'Tạo bài viết'}</h2>
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
                        {openSelectFile && (
                            <div className="file_and_others">
                                <div className="select_file_post">
                                    <MdCancel className="icon-cancel" onClick={handleCancel} />
                                    <div className="images_preview">
                                        <div className="image_container">
                                            {selectedFiles.length > 0 ? (
                                                <div className="image-grid">
                                                    {selectedFiles.map((item, index) => {
                                                        // Kiểm tra xem item.file có hợp lệ không
                                                        if (item) {
                                                            const mediaUrl = item?.file
                                                                ? URL.createObjectURL(item.file)
                                                                : item.media_link;
                                                            return item.media_type === 'image' ||
                                                                item.mediaType === 'image' ? (
                                                                <img
                                                                    key={index}
                                                                    src={mediaUrl}
                                                                    alt={`Selected ${index}`}
                                                                />
                                                            ) : (
                                                                <video key={index} controls className="video-preview">
                                                                    <source src={mediaUrl} type={item?.file?.type} />
                                                                    Trình duyệt của bạn không hỗ trợ thẻ video.
                                                                </video>
                                                            );
                                                        } else {
                                                            // Xử lý trường hợp item.file không hợp lệ
                                                            return <p>Ảnh/Video trống</p>; // Hoặc một giao diện thay thế nào đó
                                                        }
                                                    })}
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="photo_icon">
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
                                        accept="image/*,video/*"
                                        multiple
                                        className="input-file"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="file_and_others">
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
                        </div>
                        <div className="btn_dang">
                            <>
                                {showBtnSubmit && (
                                    <ButtonCustom
                                        type="submit"
                                        onClick={handlePost}
                                        title={isEdit ? 'Cập nhật' : 'Đăng bài'}
                                        className="primary"
                                    />
                                )}
                            </>
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
                        dataIconEdit={selectedIcon}
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
