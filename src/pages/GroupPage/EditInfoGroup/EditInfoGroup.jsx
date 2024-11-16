import React, { useState, useCallback, useEffect } from 'react';
import './EditInfoGroup.scss';
import getCroppedImg from '../../../ultils/cropImage/get_crop_image';
import Cropper from 'react-easy-crop';
import BackButton from '../../../components/BackButton/BackButton';
import { useParams } from 'react-router-dom';
import { API_GROUP_DETAIL, API_UPDATE_GROUP } from '../../../API/api_server';
import { getData, postData } from '../../../ultils/fetchAPI/fetch_API';
import ButtonCustom from '../../../components/ButtonCustom/ButtonCustom';
import config from '../../../configs';
import { fetchBlob } from '../../../ultils/fetchBlob/fetchBlob';
import { useLoading } from '../../../components/Loading/Loading';

function EditInfoGroupPage() {
    const { group_id } = useParams();
    const [groupName, setGroupName] = useState('');
    const [privacy, setPrivacy] = useState('public');
    const [introduction, setIntroduction] = useState('');
    const [dataGroup, setDataGroup] = useState(null);
    const { showLoading, hideLoading } = useLoading();
    const [isShowCropContainer, setIsShowCropContainer] = useState(false);
    const [editingImage, setEditingImage] = useState(null); // "avatar" hoặc "cover"
    const [fileKey, setFileKey] = useState(0); // Reset input file

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

    useEffect(() => {
        const fetchGroupDetail = async () => {
            try {
                const response = await getData(API_GROUP_DETAIL(group_id));
                if (response?.status) {
                    const groupData = response?.data;
                    setDataGroup(groupData);
                    setGroupName(groupData.group_name || '');
                    setPrivacy(groupData.group_privacy === 1 ? 'public' : 'private');
                    setIntroduction(groupData.group_slogan || '');
                }
            } catch (error) {
                console.error('Error fetching group detail:', error);
            }
        };

        fetchGroupDetail();
    }, [group_id]);

    const generateCroppedImage = useCallback(
        async (image, setCroppedImage) => {
            if (image && croppedAreaPixels) {
                try {
                    const croppedImage = await getCroppedImg(image, croppedAreaPixels);
                    setCroppedImage(croppedImage);
                    setIsShowCropContainer(false);
                    setEditingImage(null);
                } catch (e) {
                    console.error('Error generating cropped image:', e);
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
        e.preventDefault();
        showLoading();
        try {
            const payload = new FormData();
            payload.append('group_name', groupName);
            payload.append('group_slogan', introduction);
            payload.append('group_privacy', privacy === 'public' ? 1 : 0);
    
            // Nếu có ảnh cắt, sử dụng ảnh đã cắt, nếu không thì sử dụng ảnh gốc.
            if (croppedAvatar) {
                const avatarBlob = await fetchBlob(croppedAvatar);
                payload.append('avatar', avatarBlob);
            } else if (avatarImage) {
                const avatarBlob = await fetchBlob(avatarImage);
                payload.append('avatar', avatarBlob);
            } else {
                // Nếu không có ảnh đại diện mới, dùng ảnh cũ.
                payload.append('avatar', dataGroup?.avatar_media_link);
            }
    
            if (croppedCover) {
                const coverBlob = await fetchBlob(croppedCover);
                payload.append('cover', coverBlob);
            } else if (coverImage) {
                const coverBlob = await fetchBlob(coverImage);
                payload.append('cover', coverBlob);
            } else {
                // Nếu không có ảnh bìa mới, dùng ảnh cũ.
                payload.append('cover', dataGroup?.cover_media_link);
            }
    
            const response = await postData(API_UPDATE_GROUP(group_id), payload);
            if (response?.status) {
                window.location.href = `${config.routes.group}/${group_id}/admin`;
            }
        } catch (error) {
            console.error('Error updating group:', error);
        }
        hideLoading();
    };
    

    return (
        <div className="edit_group_container">
            <div className="edit-group-page">
                <BackButton />
                <form onSubmit={handleSubmit}>
                    <h1>Sửa thông tin nhóm</h1>
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
                                <select id="privacy" value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                                    <option value="public">Công khai</option>
                                    <option value="private">Riêng tư</option>
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
                                        src={croppedAvatar ?? dataGroup?.avatar_media_link ?? 'https://cdn-icons-png.flaticon.com/512/166/166289.png'}
                                        alt="Cropped Avatar"
                                        className="cropped-image avatar"
                                    />
                                </label>
                                <input
                                    id="avatar"
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    key={fileKey}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cover">
                                    <h3>Ảnh bìa nhóm:</h3>
                                    <img
                                        src={croppedCover ?? dataGroup?.cover_media_link ?? 'https://cdn-icons-png.flaticon.com/512/166/166289.png'}
                                        alt="Cropped Cover"
                                        className="cropped-image cover"
                                    />
                                </label>
                                <input
                                    id="cover"
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleCoverChange}
                                    key={fileKey}
                                />
                            </div>
                        </div>
                    </div>
                    <ButtonCustom type="submit" title="Lưu thay đổi" className="primary" />
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

export default EditInfoGroupPage;
