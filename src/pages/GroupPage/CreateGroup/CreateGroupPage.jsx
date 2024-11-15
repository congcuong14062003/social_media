import React, { useState, useCallback } from 'react';
import './CreateGroupPage.scss';
import getCroppedImg from '../../../ultils/cropImage/get_crop_image';
import Cropper from 'react-easy-crop';
import { toast } from 'react-toastify';
import { postData } from '../../../ultils/fetchAPI/fetch_API';
import { API_GROUP_CREATE } from '../../../API/api_server';
import { fetchBlob } from '../../../ultils/fetchBlob/fetchBlob';
import BackButton from '../../../components/BackButton/BackButton';
import ButtonCustom from '../../../components/ButtonCustom/ButtonCustom';
import config from '../../../configs';
import { useLoading } from '../../../components/Loading/Loading';

function CreateGroupPage() {
    const [isShowCropContainer, setIsShowCropContainer] = useState(false);
    const [editingImage, setEditingImage] = useState(null); // "avatar" hoặc "cover"
    const [fileKey, setFileKey] = useState(0); // Key để reset input file

    const [groupName, setGroupName] = useState('');
    const [privacy, setPrivacy] = useState(1);
    const [introduction, setIntroduction] = useState('');

    const { showLoading, hideLoading } = useLoading();

    const [avatarImage, setAvatarImage] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [croppedAvatar, setCroppedAvatar] = useState(null);
    const [croppedCover, setCroppedCover] = useState(null);

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const generateCroppedImage = useCallback(
        async (image, setCroppedImage) => {
            if (image && croppedAreaPixels) {
                try {
                    const croppedImage = await getCroppedImg(image, croppedAreaPixels);
                    setCroppedImage(croppedImage);
                    setIsShowCropContainer(false);
                    setEditingImage(null);
                } catch (e) {
                    console.error(e);
                }
            }
        },
        [croppedAreaPixels],
    );

    const handleAvatarChange = (e) => {
        setEditingImage('avatar');
        setIsShowCropContainer(true);
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setAvatarImage(imageUrl);
            setCroppedAvatar(null);
        }
    };

    const handleCoverChange = (e) => {
        setEditingImage('cover');
        setIsShowCropContainer(true);
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setCoverImage(imageUrl);
            setCroppedCover(null);
        }
    };

    const cancelCrop = () => {
        if (editingImage === 'avatar') {
            setAvatarImage(null);
            setCroppedAvatar(null);
        } else if (editingImage === 'cover') {
            setCoverImage(null);
            setCroppedCover(null);
        }
        setEditingImage(null);
        setIsShowCropContainer(false);
        setFileKey((prevKey) => prevKey + 1); // Làm mới input file
    };

    const handleSubmit = async (e) => {
        showLoading();
        try {
            e.preventDefault();
            const payload = new FormData();
            payload.append('group_name', groupName);
            payload.append('group_slogan', introduction);
            payload.append('group_privacy', privacy);

            // Ưu tiên ảnh đã cắt nếu có
            payload.append('avatar', await fetchBlob(croppedAvatar || avatarImage));
            payload.append('cover', await fetchBlob(croppedCover || coverImage));

            const response = await postData(API_GROUP_CREATE, payload);
            if (response?.status) {
                window.location.href = `${config.routes.group}`;
            }
        } catch (error) {
            console.error(error);
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
        }
        hideLoading();
    };

    return (
        <div className="create_group_container">
            <div className="create-group-page">
                <BackButton />
                <form onSubmit={handleSubmit}>
                    <h1>Tạo nhóm</h1>
                    <div className="side-container">
                        <div className="side-left">
                            <div className="form-group">
                                <label htmlFor="groupName">Tên nhóm:</label>
                                <input
                                    type="text"
                                    id="groupName"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="privacy">Quyền riêng tư:</label>
                                <select id="privacy" value={privacy} onChange={(e) => setPrivacy(Number(e.target.value))}>
                                    <option value={1}>Công khai</option>
                                    <option value={0}>Riêng tư</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="introduction">Giới thiệu nhóm:</label>
                                <textarea
                                    id="introduction"
                                    value={introduction}
                                    onChange={(e) => setIntroduction(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="side-right">
                            <div className="form-group">
                                <label htmlFor="avatar">
                                    <h3>Ảnh đại diện nhóm:</h3>
                                    <img
                                        src={croppedAvatar ?? "https://cdn-icons-png.flaticon.com/512/166/166289.png"}
                                        alt="Avatar"
                                        className="cropped-image avatar"
                                    />
                                </label>
                                <input
                                    id="avatar"
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    key={fileKey} // Làm mới input
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cover">
                                    <h3>Ảnh bìa nhóm:</h3>
                                    <div className="cover_image">
                                        {croppedCover ? (
                                            <img src={croppedCover} alt="Cover" className="profile_cover" />
                                        ) : (
                                            <div className="cover_image_placeholder">Chưa có ảnh bìa</div>
                                        )}
                                    </div>
                                </label>
                                <input
                                    id="cover"
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleCoverChange}
                                    key={fileKey} // Làm mới input
                                />
                            </div>
                        </div>
                    </div>
                    <ButtonCustom type="submit" title="Tạo nhóm" className="primary" />
                </form>
                {isShowCropContainer && (
                    <div className="crop-img-container">
                        {editingImage === 'avatar' && avatarImage && (
                            <div className="crop-container">
                                <Cropper
                                    image={avatarImage}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                />
                                <div className="btn-container">
                                    <button
                                        type="button"
                                        className="btn-func crop"
                                        onClick={() => generateCroppedImage(avatarImage, setCroppedAvatar)}
                                    >
                                        Cắt ảnh đại diện
                                    </button>
                                    <button type="button" className="btn-func cancel" onClick={cancelCrop}>
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        )}
                        {editingImage === 'cover' && coverImage && (
                            <div className="crop-container">
                                <Cropper
                                    image={coverImage}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={2.5}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                />
                                <div className="btn-container">
                                    <button
                                        type="button"
                                        className="btn-func crop"
                                        onClick={() => generateCroppedImage(coverImage, setCroppedCover)}
                                    >
                                        Cắt ảnh bìa
                                    </button>
                                    <button type="button" className="btn-func cancel" onClick={cancelCrop}>
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CreateGroupPage;
