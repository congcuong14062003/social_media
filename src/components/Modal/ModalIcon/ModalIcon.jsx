import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { Fragment, useEffect, useState } from 'react';
import './ModalIcon.scss'; // Thêm CSS nếu cần
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// Danh sách icon và nhãn tương ứng
const emotionIcons = [
    { label: 'Có phúc', icon: '😊' },
    { label: 'Được yêu', icon: '🥰' },
    { label: 'Đáng yêu', icon: '😍' },
    { label: 'Hào hứng', icon: '😆' },
    { label: 'Điên', icon: '🤪' },
    { label: 'Sung sướng', icon: '😌' },
    { label: 'Khổ cực', icon: '😣' },
    { label: 'Hạnh phúc', icon: '😁' },
    { label: 'Buồn', icon: '😢' },
    { label: 'Biết ơn', icon: '🙏' },
    { label: 'Tuyệt vời', icon: '😎' },
    { label: 'Vui vẻ', icon: '😊' },
];

function ModalIcon({ title, openIconModal, handleClose, onSelectIcon, dataIconEdit }) {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        border: '1px solid #ccc',
        boxShadow: 24,
        padding: '16px',
        borderRadius: '8px',
    };
    console.log(dataIconEdit);

    const [selectedIcon, setSelectedIcon] = useState(null);
    useEffect(() => {
        if (dataIconEdit) setSelectedIcon(dataIconEdit); // Lấy icon đã chọn từ dữ liệu đã sửa
    }, [dataIconEdit]);

    const handleIconClick = (icon) => {
        setSelectedIcon(icon);
        onSelectIcon(icon); // Gửi icon đã chọn ra ngoài
        handleClose(); // Đóng modal sau khi chọn
    };
    console.log('selected icon: ', selectedIcon);

    return (
        <Fragment>
            <Modal open={openIconModal} onClose={handleClose}>
                <Box sx={{ ...style }} className="modal_icon_container">
                    <div className="header_modal">
                        <h2 id="parent-modal-title">{title}</h2>
                    </div>
                    <div className="icon-list">
                        {emotionIcons.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className={`icon-item ${selectedIcon?.label === item?.label ? 'selected' : ''}`}
                                    onClick={() => handleIconClick(item)}
                                >
                                    <span className="icon">{item.icon}</span>
                                    <span className="label">{item.label}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="close_modal_detail" onClick={() => handleClose()}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </div>
                </Box>
            </Modal>
        </Fragment>
    );
}

export default ModalIcon;
