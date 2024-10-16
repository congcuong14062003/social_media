// src/components/OtpPopup.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { postData } from '../../ultils/fetchAPI/fetch_API';
import { API_VERIFY_OTP } from '../../API/api_server';
import "./OtpPopup.scss";
import ButtonCustom from '../ButtonCustom/ButtonCustom';

const OtpPopup = ({ email, onVerifySuccess, onClose, onResendOtp }) => {
    const [otp, setOtp] = useState('');
    const [time, setTime] = useState(60);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        setTime(60);
        const intervalId = setInterval(() => {
            setTime((time) => {
                if (time === 0) {
                    clearInterval(intervalId);
                    setIsExpired(true);
                    return time;
                }
                return time - 1;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [isExpired]);

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        const response = await postData(API_VERIFY_OTP, {
            "input_code_otp": otp,
            "user_email": email
        });
        setOtp('');
        if (response?.status) {
            onVerifySuccess();
        }
    };

    return (
        <div className="otp-popup">
            <div className="otp-box">
                <h3>Nhập mã OTP đã gửi vào hộp thư của {email}</h3>
                <form onSubmit={handleOtpSubmit}>
                    <input
                        type="text"
                        placeholder="Nhập mã OTP (bao gồm 5 ký tự)"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength="5"
                        required
                    />
                    {isExpired ? (
                        <p>Mã hiện tại đã hết hạn, <b onClick={(e) => {
                            setIsExpired(false);
                            onResendOtp(e);
                        }
                        }>Gửi lại</b> </p>
                    ) : (
                        <p>Mã xác thực còn hiệu lực trong: <i className="text-danger">{time} giây</i> </p>
                    )}
                    <div className="span-btn">
                        {/* <button type="submit" className="otp-button">Xác nhận</button> */}
                        <ButtonCustom title="Xác nhận" className="primary" type="submit" />
                        <ButtonCustom type="reset" onClick={onClose} title="Huỷ" className="secondary" />
                        {/* <button
                            type="reset"
                            className="otp-button danger"
                            onClick={onClose}
                        >
                            Hủy
                        </button> */}

                    </div>
                </form>
            </div>
        </div >
    );
};

OtpPopup.propTypes = {
    email: PropTypes.string.isRequired,
    payloadSignup: PropTypes.object.isRequired,
    onVerifySuccess: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onResendOtp: PropTypes.func.isRequired,
};

export default OtpPopup;
