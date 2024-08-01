import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ButtonCustom from '../../components/ButtonCustom/ButtonCustom';
import axios from 'axios'; // Import axios
import './Signup.scss';
import config from '../../configs';

function Signup() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Kiểm tra nếu thiếu thông tin
        if (!email || !username || !password) {
            console.log('vào');
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp');
            return;
        }
        const payload = {
            user_email: email,
            user_name: username,
            user_password: password,
        };
        try {
            const response = await axios.post('http://localhost:5000/users/signup', payload);
            if (response.data.status === 200) {
                toast.success(response.data.message);
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else {
                toast.error(response.data.message || 'An error occurred');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };

    return (
        <div className="login_container">
            <div className="bt-form-login-simple-1">
                <form className="form" autoComplete="off" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email: </label>
                        <input
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
                            type="text"
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password </label>
                        <input
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
            <ToastContainer /> 
        </div>
    );
}

export default Signup;
