import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faXmark } from '@fortawesome/free-solid-svg-icons';
import './ModalCreatePost.scss';
import AvatarUser from '../../AvatarUser/AvatarUser';
import images from '../../../assets/imgs';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import ModalAccess from '../ModalAccess/ModalAccess';
import { MdArrowDropDown, MdPhoto, MdAddPhotoAlternate, MdCancel } from 'react-icons/md';
import { useEffect, useState } from 'react';
import CloseBtn from '../../CloseBtn/CloseBtn';
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

export default function ModalCreatePost({ openModel, closeModel, openFile }) {
    const [openAccess, setOpenAccess] = useState(false);
    const [accessLabel, setAccessLabel] = useState('Công khai');
    // const [attachment, setAttachment] = useState();
    const [openSelectFile, setOpenSelectFile] = useState(false);
    const [valueInput, setValueInput] = useState('');

    // if(openFile) {
    //     setOpenSelectFile(true);
    // }
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
    const [selectedImage, setSelectedImage] = useState(null);
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setSelectedImage(imageURL);
        }
    };
    // setStyleBtn({
    //     backgroundColor: getCSSVariableValue('--disable-button'),
    //     color: getCSSVariableValue('--disable-button-text'),
    //     cursor: 'not-allowed',
    // });

    // setStyleBtn({
    //     backgroundColor: getCSSVariableValue('--primary-color'),
    //     cursor: 'pointer',
    //     color: '#fff',
    // });
    // useEffect(() => {
    //     console.log('selected image: ', selectedImage);
    //     console.log('valueInput: ', valueInput);
    //     if (selectedImage || valueInput) {
    //         setStyleBtn({
    //             backgroundColor: getCSSVariableValue('--primary-color'),
    //             cursor: 'pointer',
    //             color: '#fff',
    //         });
    //     } else {
    //         setStyleBtn({
    //             backgroundColor: getCSSVariableValue('--disable-button'),
    //             color: getCSSVariableValue('--disable-button-text'),
    //             cursor: 'not-allowed',
    //         });
    //     }
    // }, [selectedImage, valueInput]);
    const handleCancel = () => {
        setOpenSelectFile(false);
        setSelectedImage(null);
    };
    const handleOpenSelectFile = () => {
        setOpenSelectFile(true);
    };
    useEffect(() => {
        if (openFile) {
            setOpenSelectFile(true);
        }
    }, [openFile]);

    const [styleBtn, setStyleBtn] = useState({});
    const hanleChangeInput = (e) => {
        const inputValue = e.target.value;
        setValueInput(inputValue);
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
                                <div className="user_name">Công Cường</div>
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
                                placeholder="Công ơi bạn đang nghĩ gì thế?"
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
                                    {selectedImage ? (
                                        <img src={selectedImage} alt="Selected" className="selected-image" />
                                    ) : (
                                        <>
                                            <div>
                                                <MdAddPhotoAlternate className="icon-add" />
                                            </div>
                                            <div className="text-heading">Add photos</div>
                                            <span className="text-subheading">or drag and drop</span>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="input-file"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="btn_dang">
                            <Button variant="contained">Đăng bài</Button>
                        </div>
                    </div>

                    {/* <div className="close_modal" onClick={closeModel}>
                        <FontAwesomeIcon icon={faXmark} />
                    </div> */}
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
