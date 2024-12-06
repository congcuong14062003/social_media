import './ModalAuthenEmail.scss';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { Fragment, useState } from 'react';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { MdEmail } from 'react-icons/md';

function ModalAuthenEmail({ openEmail, closeEmail, title }) {
    const [email, setEmail] = useState('');
    const [accountType, setAccountType] = useState('register'); // Loại tài khoản mặc định

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        border: '1px solid #ccc',
        boxShadow: 24,
    };

    const handleCancel = () => {
        closeEmail();
    };

    const handleSubmit = () => {
        console.log("Email:", email);
        console.log("Account Type:", accountType);
        
        closeEmail();
    };

    return (
        <Fragment>
            <Modal
                open={openEmail}
                onClose={closeEmail}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style }} className="model_content_access">
                    <div className="header_modal">
                        <h2 id="parent-modal-title">{title}</h2>
                    </div>
                    <div className="content_modal">
                        <div className="input-group">
                            <MdEmail className="icon" />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="account-type-select">
                            <FormControl fullWidth>
                                <InputLabel id="account-type-label">Loại tài khoản</InputLabel>
                                <Select
                                    labelId="account-type-label"
                                    value={accountType}
                                    onChange={(e) => setAccountType(e.target.value)}
                                    label="Loại tài khoản"
                                >
                                    <MenuItem value="register">Register</MenuItem>
                                    <MenuItem value="google">Google</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
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

export default ModalAuthenEmail;
