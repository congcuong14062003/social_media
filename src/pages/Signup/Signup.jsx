import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ButtonCustom from '../../components/ButtonCustom/ButtonCustom';
import './Signup.scss';
import config from '../../configs';
import { postData } from '../../ultils/fetchAPI/fetch_API';
import { API_CREATE_OTP_SIGNUP, API_SIGNUP_POST } from '../../API/api_server';
import getDataForm from '../../ultils/getDataForm/get_data_form';
import OtpPopup from '../../components/PopupOTP/OtpPopup';
import { LoadingIcon } from '../../assets/icons/icons';
import { useLoading } from '../../components/Loading/Loading';

function Signup() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showOtpPopup, setShowOtpPopup] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [payloadSignup, setPayloadSignup] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { showLoading, hideLoading } = useLoading();
    const handleOtpVerifySuccess = async () => {
        setShowOtpPopup(false);
        console.log(payloadSignup);

        const responseSignup = await postData(API_SIGNUP_POST, payloadSignup);
        if (responseSignup?.status) {
            navigate('/login');
        }
    };
    const handleCloseOtpPopup = () => {
        setShowOtpPopup(false);
    };
    const handleResendOtp = async (e) => {
        await handleSignup(e);
    };
    const handleSignup = async (e) => {
        showLoading(); // Hiển thị loading
        e.preventDefault();
        // Kiểm tra xem có trường nào bị bỏ trống không
        if (!email || !username || !password || !confirmPassword) {
            toast.error('Vui lòng nhập đầy đủ thông tin!');
            hideLoading()
            return;
        }
        // Kiểm tra mật khẩu có khớp không
        if (password !== confirmPassword) {
            toast.error('Mật khẩu không trùng khớp!');
            return;
        }
        const data = getDataForm('.form_signup');
        setPayloadSignup(data);
        try {
            const response = await postData(API_CREATE_OTP_SIGNUP, data);
            if (response?.status) {
                setShowOtpPopup(true);
            } else {
                toast.error('Đăng ký thất bại, vui lòng thử lại!');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại!');
        }
        hideLoading(); // Ẩn loading
    };

    return (
        <div className="login_container">
            <div className="bt-form-login-simple-1">
                <form className="form_signup form" autoComplete="off" onSubmit={handleSignup}>
                    <div className="form-group">
                        <label htmlFor="email">Email: </label>
                        <input
                            name="user_email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Username: </label>
                        <input
                            name="user_name"
                            type="text"
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password </label>
                        <input
                            name="user_password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Confirm password </label>
                        <input
                            name="confirm_password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm password"
                            className="form-input"
                        />
                    </div>
                    <ButtonCustom type="submit" title="Đăng ký" className="primary form-btn" />
                </form>
                <div className="form-option">
                    Bạn đã có tài khoản
                    <Link to={config.routes.login}> Đăng nhập</Link>
                </div>
            </div>
            {showOtpPopup && (
                <OtpPopup
                    email={email}
                    onVerifySuccess={handleOtpVerifySuccess}
                    onClose={handleCloseOtpPopup}
                    onResendOtp={handleResendOtp}
                />
            )}
        </div>
    );
}

export default Signup;
