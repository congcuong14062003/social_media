import './ModalAccess.scss';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { Fragment, useState, useEffect } from 'react';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import images from '../../../assets/imgs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function AccessPost({ image, heading, title }) {
    return (
        <div className="access_post_detail">
            <div className="icon_access">
                <img src={image} alt="" />
            </div>
            <div className="text_access">
                <span>{heading}</span>
                <p>{title}</p>
            </div>
        </div>
    );
}

function ModalAccess({ openAccess, closeAccess, initialValue, onAccessChange, title }) {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        border: '1px solid #ccc',
        boxShadow: 24,
    };

    const [selectedValue, setSelectedValue] = useState(initialValue);

    useEffect(() => {
        setSelectedValue(initialValue);
    }, [initialValue]);

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleCancel = () => {
        setSelectedValue(initialValue);
        closeAccess();
    };

    const handleSubmit = () => {
        onAccessChange(selectedValue);
        closeAccess();
    };

    // console.log(selectedValue);
    return (
        <Fragment>
            <Modal
                open={openAccess}
                onClose={handleCancel}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style }} className="model_content_access">
                    <div className="header_modal">
                        <h2 id="parent-modal-title">{title}</h2>
                    </div>
                    <div className="content_modal">
                        <RadioGroup
                            className="group_access"
                            name="access"
                            value={selectedValue}
                            onChange={handleChange}
                        >
                            <FormControlLabel
                                value="Công khai"
                                control={<Radio className="radio_custom" sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />}
                                label={<AccessPost image={images.bigglobal} heading="Công khai" title="Bất kỳ ai ở trên hoặc ngoài Facebook" />}
                                labelPlacement="start"
                            />
                            <FormControlLabel
                                value="Bạn bè"
                                control={<Radio className="radio_custom" sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />}
                                label={<AccessPost image={images.friend} heading="Bạn bè" title="Bạn bè của bạn trên Facebook" />}
                                labelPlacement="start"
                            />
                            <FormControlLabel
                                value="Chỉ mình tôi"
                                control={<Radio className="radio_custom" sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />}
                                label={<AccessPost image={images.private} heading="Chỉ mình tôi" title="" />}
                                labelPlacement="start"
                            />
                        </RadioGroup>
                    </div>
                    <div className="footer_detail_post">
                        <div>
                            <Button onClick={handleCancel} className="cancel_btn_access">Huỷ</Button>
                            <Button onClick={handleSubmit} type="submit" className="submit_btn_access" variant="contained">Xong</Button>
                        </div>
                    </div>
                    <div className="close_modal_detail" onClick={handleCancel}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </div>
                </Box>
            </Modal>
        </Fragment>
    );
}

export default ModalAccess;
