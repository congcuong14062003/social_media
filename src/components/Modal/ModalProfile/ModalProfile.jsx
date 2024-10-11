import './ModalProfile.scss';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import CloseBtn from '../../CloseBtn/CloseBtn';
import ButtonCustom from '../../ButtonCustom/ButtonCustom';
import { useState, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import processCroppedImg from './cropImage';
import { postData, putData } from '../../../ultils/fetchAPI/fetch_API';
import { API_UPDATE_USER } from '../../../API/api_server';
import { useNavigate } from 'react-router-dom';
import config from '../../../configs';

function ModalProfile({ openModel, closeModel, dataUser }) {
    const [avatar, setAvatar] = useState('');
    const [coverPhoto, setCoverPhoto] = useState('');
    const [user_name, setUsername] = useState('');
    const [date_of_birth, setDob] = useState('');
    const [user_work, setWorkplace] = useState('');
    const [user_school, setSchoolPlace] = useState('');
    const [user_address, setAddress] = useState('');
    const [fileInput, setFileInput] = useState(null); // Biến lưu file ảnh được chọn
    const [coverFileInput, setCoverFileInput] = useState(null); // Biến lưu file ảnh bìa được chọn
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showAvatarCropper, setShowAvatarCropper] = useState(false); // Hiển thị cropper cho ảnh đại diện
    const [showCoverCropper, setShowCoverCropper] = useState(false); // Hiển thị cropper cho ảnh bìa
    const [dataUsers, setDataUsers] = useState('');
    const navigate = useNavigate();
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        border: '1px solid #ccc',
        boxShadow: 24,
    };

    useEffect(() => {
        if (dataUser) {
            setDataUsers(dataUser);
            setAvatar(dataUser.avatar);
            setCoverPhoto(dataUser.cover);
            setUsername(dataUser.user_name);
            setDob(dataUser.date_of_birth);
            setWorkplace(dataUser.user_work);
            setSchoolPlace(dataUser.user_school);
            setAddress(dataUser.user_address);
        }
    }, [dataUser]);

    // Khi người dùng chọn ảnh đại diện
    const handleAvatarFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setFileInput(imageUrl);
            setShowAvatarCropper(true);
        }
    };

    // Khi người dùng chọn ảnh bìa
    const handleCoverFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setCoverFileInput(imageUrl);
            setShowCoverCropper(true);
        }
    };

    // Xử lý khi crop ảnh đại diện hoàn tất
    const onAvatarCropComplete = async () => {
        const croppedImage = await processCroppedImg(fileInput, croppedAreaPixels);
        setAvatar(croppedImage);
        setShowAvatarCropper(false);
    };

    // Xử lý khi crop ảnh bìa hoàn tất
    const onCoverCropComplete = async () => {
        const croppedImage = await processCroppedImg(coverFileInput, croppedAreaPixels);
        setCoverPhoto(croppedImage);
        setShowCoverCropper(false);
    };

    const handleSubmit = async () => {
        try {
            // Khởi tạo FormData
            const formData = new FormData();
    
            // Thêm ảnh đại diện nếu có
            if (fileInput) {
                const avatarFile = await fetch(avatar).then(res => res.blob()); // Chuyển ảnh từ URL sang Blob
                formData.append('avatar', avatarFile, 'avatar.jpg'); // Tên file tùy chỉnh
            }
    
            // Thêm ảnh bìa nếu có
            if (coverFileInput) {
                const coverFile = await fetch(coverPhoto).then(res => res.blob()); // Chuyển ảnh từ URL sang Blob
                formData.append('cover', coverFile, 'cover.jpg'); // Tên file tùy chỉnh
            }
    
            // Thêm các thông tin người dùng
            formData.append('user_name', user_name);
            formData.append('date_of_birth', date_of_birth);
            formData.append('user_work', user_work);
            formData.append('user_school', user_school);
            formData.append('user_address', user_address);
    
            // Gửi request cập nhật thông tin
            const response = await putData(API_UPDATE_USER, formData);
            // Xử lý phản hồi từ API
            if(response?.status === true) {
                window.location.reload(); // Tải lại trang
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Có lỗi xảy ra!');
        }
    };

    return (
        <div className="modal_container_profile">
            <Modal
                open={openModel}
                onClose={closeModel}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style }} className="model_content_profile">
                    <div className="header_modal">
                        <h2 id="parent-modal-title">Chỉnh sửa trang cá nhân</h2>
                    </div>
                    <div className="content_modal">
                        {/* Avatar Input */}
                        <div className="form_group">
                            <div className="title">
                                <div className="heading">Ảnh đại diện</div>
                                <ButtonCustom
                                    title="Chỉnh sửa"
                                    className="primary"
                                    onClick={() => document.getElementById('avatarInput').click()}
                                />
                                <input
                                    type="file"
                                    id="avatarInput"
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={handleAvatarFileChange}
                                />
                            </div>
                            <div className="avatar_image">
                                {avatar && <img src={avatar} alt="Avatar" className="profile_avatar" />}
                            </div>
                        </div>

                        {/* Hiển thị Cropper nếu cần cắt ảnh đại diện */}
                        {showAvatarCropper && (
                            <div className="cropper_container">
                                <Cropper
                                    className="copper_image_story"
                                    image={fileInput}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1} // Tỷ lệ 1:1 cho hình tròn
                                    onCropChange={setCrop}
                                    onCropComplete={(croppedArea, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
                                    onZoomChange={setZoom}
                                />
                                <ButtonCustom title="Cắt ảnh" className="primary" onClick={onAvatarCropComplete} />
                            </div>
                        )}

                        {/* Cover Photo Input */}
                        <div className="form_group">
                            <div className="title">
                                <div className="heading">Ảnh bìa</div>
                                <ButtonCustom
                                    title="Chỉnh sửa"
                                    className="primary"
                                    onClick={() => document.getElementById('coverInput').click()}
                                />
                                <input
                                    type="file"
                                    id="coverInput"
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={handleCoverFileChange}
                                />
                            </div>
                            <div className="cover_image">
                                {coverPhoto ? (
                                    <img src={coverPhoto} alt="Cover" className="profile_cover" />
                                ) : (
                                    <div className="cover_image_placeholder">Chưa có ảnh bìa</div>
                                )}
                            </div>
                        </div>

                        {/* Hiển thị Cropper nếu cần cắt ảnh bìa */}
                        {showCoverCropper && (
                            <div className="cropper_container">
                                <Cropper
                                    className="copper_image_story"
                                    image={coverFileInput}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={4 / 2} // Tỷ lệ 3:1 cho ảnh bìa
                                    onCropChange={setCrop}
                                    onCropComplete={(croppedArea, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
                                    onZoomChange={setZoom}
                                />
                                <ButtonCustom title="Cắt ảnh" className="primary" onClick={onCoverCropComplete} />
                            </div>
                        )}

                        {/* Username Input */}
                        <div className="form_group">
                            <label>Username</label>
                            <input type="text" value={user_name} onChange={(e) => setUsername(e.target.value)} />
                        </div>

                        {/* Date of Birth Input */}
                        <div className="form_group">
                            <label>Ngày sinh</label>
                            <input type="date" value={date_of_birth} onChange={(e) => setDob(e.target.value)} />
                        </div>

                        {/* Workplace Input */}
                        <div className="form_group">
                            <label>Nơi làm việc</label>
                            <input type="text" value={user_work} onChange={(e) => setWorkplace(e.target.value)} />
                        </div>

                        {/* Nickname Input */}
                        <div className="form_group">
                            <label>Học tại</label>
                            <input type="text" value={user_school} onChange={(e) => setSchoolPlace(e.target.value)} />
                        </div>

                        {/* Address Input */}
                        <div className="form_group">
                            <label>Địa chỉ</label>
                            <input type="text" value={user_address} onChange={(e) => setAddress(e.target.value)} />
                        </div>

                        {/* Submit Button */}
                        <ButtonCustom title="Cập nhật" className="primary" onClick={handleSubmit} />
                    </div>

                    <span className="close_btn_model">
                        <CloseBtn onClick={closeModel} />
                    </span>
                </Box>
            </Modal>
        </div>
    );
}

export default ModalProfile;
