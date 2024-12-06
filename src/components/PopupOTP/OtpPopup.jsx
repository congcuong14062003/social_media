import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { postData } from '../../ultils/fetchAPI/fetch_API';
import { API_VERIFY_OTP } from '../../API/api_server';
import './OtpPopup.scss';
import ButtonCustom from '../ButtonCustom/ButtonCustom';

const OtpPopup = ({ email, otpExpiration, onVerifySuccess, onClose, onResendOtp }) => {
    const [otp, setOtp] = useState('');
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const expirationTime = new Date(otpExpiration); 
            return Math.max(0, Math.floor((expirationTime - now) / 1000)); 
        };

        setTimeLeft(calculateTimeLeft());

        const intervalId = setInterval(() => {
            const remaining = calculateTimeLeft();
            setTimeLeft(remaining);
            if (remaining <= 0) {
                clearInterval(intervalId);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [otpExpiration]); // Đảm bảo chỉ thay đổi khi otpExpiration thay đổi

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        // if (timeLeft === 0) {
        //     return;
        // }
        const response = await postData(API_VERIFY_OTP, {
            input_code_otp: otp,
            user_email: email,
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
                    {timeLeft === 0 ? (
                        <p>
                            Mã hiện tại đã hết hạn,{' '}
                            <b
                                onClick={(e) => {
                                    onResendOtp(e);
                                }}
                            >
                                Gửi lại
                            </b>
                        </p>
                    ) : (
                        <p>
                            Mã xác thực còn hiệu lực trong: <i className="text-danger">{timeLeft} giây</i>
                        </p>
                    )}
                    <div className="span-btn">
                        <ButtonCustom title="Xác nhận" className="primary" type="submit" />
                        <ButtonCustom type="reset" onClick={onClose} title="Huỷ" className="secondary" />
                    </div>
                </form>
            </div>
        </div>
    );
};

OtpPopup.propTypes = {
    email: PropTypes.string.isRequired,
    otpExpiration: PropTypes.string.isRequired, // Thêm `otpExpiration` từ server
    onVerifySuccess: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onResendOtp: PropTypes.func.isRequired,
};

export default OtpPopup;
