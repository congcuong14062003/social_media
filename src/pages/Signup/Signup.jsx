import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ButtonCustom from '../../components/ButtonCustom/ButtonCustom';
import './Signup.scss';
import config from '../../configs';
import { postData } from '../../ultils/fetchAPI/fetch_API';
import { API_SIGNUP_POST } from '../../API/api_server';
import getDataForm from '../../ultils/getDataForm/get_data_form';

function Signup() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !username || !password) {
            console.log('vào');
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        if (password !== confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp');
            return;
        }
        const data = getDataForm('.form_signup');
        const respone = await postData(API_SIGNUP_POST, data)
        if (respone.status === 200) {
            navigate('/login');
        }
    };
    return (
        <div className="login_container">
            <div className="bt-form-login-simple-1">
                <form className="form_signup form" autoComplete="off" onSubmit={handleSubmit}>
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
        </div>
    );
}

export default Signup;
