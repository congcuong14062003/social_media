import React, { useEffect, useState } from 'react';
import { MdEmail, MdOutlinePassword } from 'react-icons/md';
import './ForgotPassword.scss';
import { postData, putData } from '../../ultils/fetchAPI/fetch_API';
import { API_CREATE_LINK_OTP, API_UPDATE_USER_PASSWORD, API_VERIFY_OTP } from '../../API/api_server';
import { getURLParam } from '../../ultils/getParamURL/get_param_URL';
import config from '../../configs';
import { Link, useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton/BackButton';
import images from '../../assets/imgs';
import ButtonCustom from '../../components/ButtonCustom/ButtonCustom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [isVerify, setIsVerify] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const params = getURLParam();
    if (params.input_code !== '') {
      setInputCode(params.input_code);
      setEmail(params.email);
    }
  }, []);

  const handleEmailSubmit = async (e) => {
    try {
      e.preventDefault();
      await postData(API_CREATE_LINK_OTP, { user_email: email });
    } catch (error) {
      console.error(error.message);
    }

  };

  useEffect(() => {
    const handleVerification = async () => {
      if (inputCode && email) {
        try {
          const response = await postData(API_VERIFY_OTP, { user_email: email, input_code_otp: inputCode });
          if (response.status === true) {
            setIsVerify(true);
          } else {
            setIsVerify(false);
          }
        } catch (err) {
          setIsVerify(false);
        }
      }
    };
    handleVerification();
  }, [email, inputCode]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      if (newPassword === confirmPassword) {
        const response = await putData(API_UPDATE_USER_PASSWORD, {
          user_email: email,
          user_password: newPassword,
        });
        if(response.status === true) {
          navigate(config.routes.login)
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="forgot-password-main">
      <div className="forgot-password-container">
        <img className="img-thumb" src={images.bgAuthen} alt="" />
        <div className="forgot-password-box">
          <img src={images.logo} alt="Logo" className="logo" />
          <h2>Quên mật khẩu</h2>
          {!isVerify ? (
            <form onSubmit={handleEmailSubmit}>
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
              {/* <button type="submit" className="forgot-password-button">Gửi mã OTP</button> */}
              <ButtonCustom type="submit" className="forgot-password-button primary" title="Gửi mã OTP" />
            </form>
          ) : (
            <form onSubmit={handlePasswordReset}>
              <div className="input-group">
                <MdOutlinePassword className="icon" />
                <input
                  type="password"
                  placeholder="Mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <MdOutlinePassword className="icon" />
                <input
                  type="password"
                  placeholder="Nhắc lại mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {/* <button type="submit" className="forgot-password-button">Đặt lại mật khẩu</button> */}
              <ButtonCustom type="submit" className="forgot-password-button primary" title="Đặt lại mật khẩu" />
            </form>
          )}
          <BackButton />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
