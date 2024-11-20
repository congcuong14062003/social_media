import { Link, useNavigate } from 'react-router-dom';
import images from '../../assets/imgs';
import './CreateStory.scss';
import { IoMdSettings } from 'react-icons/io';
import PrimaryIcon from '../../components/PrimaryIcon/PrimaryIcon';
import ModalAccess from '../../components/Modal/ModalAccess/ModalAccess';
import { useContext, useEffect, useRef, useState } from 'react';
import { IoText } from 'react-icons/io5';
import { FaImage } from 'react-icons/fa6';
import AvatarUser from '../../components/AvatarUser/AvatarUser';
import ButtonCustom from '../../components/ButtonCustom/ButtonCustom';
import { TextField } from '@mui/material';
import Cropper from 'react-easy-crop';
import config from '../../configs';
import CloseBtn from '../../components/CloseBtn/CloseBtn';
import { OwnDataContext } from '../../provider/own_data';
import { postData } from '../../ultils/fetchAPI/fetch_API';
import { API_CREATE_STORY } from '../../API/api_server';
import { LoadingIcon } from '../../assets/icons/icons';
import { toast } from 'react-toastify';
import domtoimage from 'dom-to-image-more';
import { useLoading } from '../../components/Loading/Loading';
import { useSocket } from '../../provider/socket_context';

function CreateStory() {
    const socket = useSocket();
    const dataOwner = useContext(OwnDataContext);
    const [openAccess, setOpenAccess] = useState(false);
    const [openImageStory, setOpenImageStory] = useState(false);
    const [openTextStory, setOpenTextStory] = useState(false);
    const [valueInput, setValueInput] = useState('Bắt đầu nhập');
    const [fileInput, setFileInput] = useState('');
    const [color, setColor] = useState('#ffffff');
    const [fontSize, setFontSize] = useState(22);
    const [fontFamily, setFontFamily] = useState('Arial');
    const [fontWeight, setFontWeight] = useState(900);
    const [backgroundImage, setBackgroundImage] = useState(images.bg1);
    const [bgImageStory, setBgImageStory] = useState('');
    const [hiddenCropper, setHiddenCropper] = useState(false);
    const [loading, setLoading] = useState(false);
    const { showLoading, hideLoading } = useLoading();
    const [btnCutImage, setBtnCutImage] = useState(false);
    const bgImages = [
        images.bg1,
        images.bg2,
        images.bg3,
        images.bg4,
        images.bg5,
        images.bg6,
        images.bg7,
        images.bg8,
        images.bg9,
        images.bg10,
    ];
    const [accessLabel, setAccessLabel] = useState('Công khai');

    // Khởi tạo quyền truy cập dựa trên story_privacy
    useEffect(() => {
        if (dataOwner?.story_privacy === 0) {
            setAccessLabel('Chỉ mình tôi');
        } else if (dataOwner?.story_privacy === 1) {
            setAccessLabel('Công khai');
        }
    }, [dataOwner]);

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

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const image = new Image();
        image.src = fileInput;

        image.onload = () => {
            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;
            ctx.drawImage(
                image,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
            );

            // Sử dụng Promise để đảm bảo blob được cập nhật
            canvas.toBlob((blob) => {
                if (blob) {
                    const croppedFile = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
                    setBgImageStory(URL.createObjectURL(croppedFile)); // Hiển thị ảnh trực tiếp
                }
            }, 'image/jpeg');
        };
    };

    const inputRef = useRef(null);
    const navigate = useNavigate();

    const handleFileChange = () => {
        const file = inputRef.current.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            // Clear ảnh cũ trước khi set ảnh mới
            setFileInput('');
            setBgImageStory('');

            setOpenImageStory(true);
            setFileInput(imageURL);
        }
    };

    const textStyle = {
        color: color,
        fontSize: `${fontSize}px`,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        cursor: 'move',
    };
    const handleOnChangeInput = (e) => {
        const value = e.target.value;
        if (value) {
            setValueInput(e.target.value);
        } else {
            setValueInput('Bắt đầu nhập');
        }
    };

    const handleAccessChange = (newAccess) => {
        setAccessLabel(getAccessLabel(newAccess));
    };
    const handleOpenAccess = () => {
        setOpenAccess(true);
    };
    const handleCloseAccess = () => {
        setOpenAccess(false);
    };
    const handleOpenTextStory = () => {
        setOpenTextStory(true);
        setBtnCutImage(true);
    };
    const handleCancel = () => {
        setOpenTextStory(false);
        setOpenImageStory(false);
        setHiddenCropper(false);
        setBtnCutImage(false);
        setFileInput('');
    };
    // Xử lí cắt ảnh
    const handleCutImage = () => {
        setHiddenCropper(true);
        setBtnCutImage(true);
    };
    const handleImageClick = () => {
        setHiddenCropper(false);
        setBtnCutImage(false);
    };
    console.log('file input: ', fileInput);
    console.log('bgImage: ', bgImageStory);

    // đăng tin ảnh hoặc dạng văn bản
    const handleCreateStory = async () => {
        if (!bgImageStory && !valueInput) {
            toast.error('Vui lòng chọn ảnh hoặc nhập văn bản');
            return;
        }
        showLoading();
        let blob;

        try {
            if (bgImageStory) {
                const response = await fetch(bgImageStory);
                if (!response.ok) throw new Error('Lỗi khi tải ảnh.');
                blob = await response.blob();
            } else if (valueInput) {
                const contentTextInput = document.querySelector('.preview');
                // Sử dụng `dom-to-image-more` để chuyển đổi DOM thành PNG
                const dataUrl = await domtoimage.toPng(contentTextInput, { quality: 1 });
                const response = await fetch(dataUrl);
                blob = await response.blob();
            }

            const payload = new FormData();
            payload.append('content', blob);
            payload.append('user_id', dataOwner.user_id);
            payload.append('story_privacy', accessLabel === 'Công khai' ? 1 : 0);

            const responseData = await postData(API_CREATE_STORY, payload);
            if (responseData.status === true) {
                socket.emit('new_story', {
                    sender_id: dataOwner?.user_id,
                    content: `${dataOwner?.user_name} vừa đăng một tin mới`,
                    link_notice: `${config.routes.story}/user_id=${dataOwner?.user_id}`,
                    created_at: new Date().toISOString(),
                });
                toast.success('Tin đã được đăng thành công!');
                navigate(config.routes.home);
            } else {
                throw new Error('Đăng tin thất bại.');
            }
        } catch (error) {
            console.error('Error uploading story:', error);
            toast.error('Đã xảy ra lỗi khi đăng tin.');
        } finally {
            hideLoading();
            setBgImageStory('');
            setFileInput('');
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
                            <Link to={`${config.routes.profile}/${dataOwner?.user_id}`}>
                                <div className="user_infor">
                                    <AvatarUser />
                                    <div className="name_user">{dataOwner?.user_name}</div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    {openTextStory && (
                        <div className="text_action_container">
                            <div className="text_fild_content">
                                <TextField
                                    id="outlined-multiline-static"
                                    multiline
                                    rows={6}
                                    onChange={handleOnChangeInput}
                                    className="text_fild"
                                    placeholder="Bắt đầu nhập"
                                />
                            </div>
                            <div className="control-group">
                                <label htmlFor="colorPicker">Màu chữ:</label>
                                <input
                                    type="color"
                                    id="colorPicker"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                />
                            </div>

                            <div className="control-group">
                                <label htmlFor="fontSize">Cỡ chữ:</label>
                                <input
                                    type="number"
                                    id="fontSize"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(e.target.value)}
                                />
                            </div>
                            <div className="control-group">
                                <label htmlFor="fontFamily">Phông chữ:</label>
                                <select
                                    id="fontFamily"
                                    value={fontFamily}
                                    onChange={(e) => setFontFamily(e.target.value)}
                                >
                                    <option value="Arial" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                                        Arial
                                    </option>
                                    <option value="Times New Roman" style={{ fontFamily: 'Times New Roman, serif' }}>
                                        Times New Roman
                                    </option>
                                    <option value="Verdana" style={{ fontFamily: 'Verdana, sans-serif' }}>
                                        Verdana
                                    </option>
                                    <option value="Roboto" style={{ fontFamily: 'Roboto, sans-serif' }}>
                                        Roboto
                                    </option>
                                    <option value="Open Sans" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                                        Open Sans
                                    </option>
                                    <option value="Montserrat" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                        Montserrat
                                    </option>
                                    <option value="Playfair Display" style={{ fontFamily: 'Playfair Display, serif' }}>
                                        Playfair Display
                                    </option>
                                    <option value="Lobster" style={{ fontFamily: 'Lobster, cursive' }}>
                                        Lobster
                                    </option>
                                    <option value="Pacifico" style={{ fontFamily: 'Pacifico, cursive' }}>
                                        Pacifico
                                    </option>
                                    <option value="Dancing Script" style={{ fontFamily: 'Dancing Script, cursive' }}>
                                        Dancing Script
                                    </option>
                                </select>
                            </div>
                            <div className="control-group">
                                <label htmlFor="fontWeight">Độ dày chữ:</label>
                                <select
                                    id="fontWeight"
                                    value={fontWeight}
                                    onChange={(e) => setFontWeight(parseInt(e.target.value))}
                                >
                                    <option value={400} style={{ fontWeight: 400 }}>
                                        400
                                    </option>
                                    <option value={500} style={{ fontWeight: 500 }}>
                                        500
                                    </option>
                                    <option value={600} style={{ fontWeight: 600 }}>
                                        600
                                    </option>
                                    <option value={700} style={{ fontWeight: 700 }}>
                                        700
                                    </option>
                                    <option value={800} style={{ fontWeight: 800 }}>
                                        800
                                    </option>
                                    <option value={900} style={{ fontWeight: 900 }}>
                                        900
                                    </option>
                                </select>
                            </div>
                            <div className="control-group">
                                <label>Hình nền:</label>
                                <div className="bg-images">
                                    {bgImages.map((imgItem, index) => (
                                        <img
                                            key={index}
                                            src={imgItem}
                                            alt={`background ${index + 1}`}
                                            onClick={() => setBackgroundImage(imgItem)}
                                            className="bg-image"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {(openTextStory || openImageStory) && (
                        <div className="action_left_story">
                            <>
                                <div className="btn_cancel_story" onClick={handleCancel}>
                                    <ButtonCustom className="secondary" title="Bỏ" />
                                </div>
                                <div className="btn_ok_story">
                                    <ButtonCustom
                                        onClick={handleCreateStory}
                                        className="primary"
                                        title="Chia sẻ lên tin"
                                    />
                                </div>
                            </>
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
            </div>
            <div className="right_container">
                {openTextStory || openImageStory || (
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
                            id="create_story_image"
                            hidden
                            ref={inputRef}
                            onChange={handleFileChange}
                        />
                        <div className="direct create_story_text_container" onClick={handleOpenTextStory}>
                            <div className="icon">
                                <IoText />
                            </div>
                            <p>Tạo tin dạng văn bản</p>
                        </div>
                    </div>
                )}
                {(openTextStory || openImageStory) && (
                    <div className="text_render_container">
                        <div className="content_render">
                            <p className="title_render">Xem trước</p>
                            <div className="body_render">
                                {openTextStory && (
                                    <div className="preview">
                                        <div
                                            className="content_text_input"
                                            style={{
                                                background: `url("${backgroundImage}") top center / cover no-repeat`,
                                            }}
                                        >
                                            <p className="text-status" style={textStyle}>
                                                {valueInput}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {openImageStory && (
                                    <div
                                        onClick={handleImageClick}
                                        className="content_img_input"
                                        style={{ background: `url("${bgImageStory}") top center / cover no-repeat` }}
                                    >
                                        {hiddenCropper || (
                                            <Cropper
                                                className="copper_image_story"
                                                image={fileInput}
                                                crop={crop}
                                                zoom={zoom}
                                                aspect={3 / 4}
                                                onCropChange={setCrop}
                                                onCropComplete={onCropComplete}
                                                onZoomChange={setZoom}
                                            />
                                        )}
                                    </div>
                                )}
                                {btnCutImage || (
                                    <div className="btn_cut_image" onClick={handleCutImage}>
                                        <ButtonCustom title="Cắt ảnh" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CreateStory;
