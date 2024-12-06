import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import './LoginFaceRecognition.scss';
import { getData, postData } from '../../../ultils/fetchAPI/fetch_API';
import {
    API_ALL_FACE_RECOGNITION,
    API_ALL_FACE_RECOGNITION_BY_ID,
    API_GET_FACE_RECOGNITION_BY_ID,
    API_LOGIN_FACE_RECOGNITION,
} from '../../../API/api_server';
import BackButton from '../../../components/BackButton/BackButton';
import Box from '@mui/material/Box';

import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { Select, MenuItem, InputLabel, FormControl, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { MdEmail } from 'react-icons/md';
import ButtonCustom from '../../../components/ButtonCustom/ButtonCustom';
import { useNavigate } from 'react-router-dom';

const LoginFaceRecognition = ({ titlePage }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [isDetect, setIsDetect] = useState(false);
    const [dots, setDots] = useState(0);
    const [nameUser, setNameUser] = useState('');
    let labeledFaceDescriptors = [];
    const [openModalEmail, setOpenModaEmail] = useState(false);
    const [email, setEmail] = useState('');
    const [accountType, setAccountType] = useState('register'); // Loại tài khoản mặc định
    const navigate = useNavigate();

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        border: '1px solid #ccc',
        boxShadow: 24,
    };
    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prevDots) => (prevDots + 1) % 4);
        }, 300);

        return () => clearInterval(interval);
    }, []);
    const handleSubmitCheckEmail = async (e) => {
        try {
            const response = await postData(API_ALL_FACE_RECOGNITION_BY_ID, {
                user_email: email,
                type_account: accountType,
            });
            if (response?.status) {
                setIsDetect(true);
                setImages(response?.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!isDetect && images?.length <= 0) return;
        const loadFaceAPI = async () => {
            if (!faceapi.nets.faceRecognitionNet.isLoaded) {
                await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
            }
            if (!faceapi.nets.faceLandmark68Net.isLoaded) {
                await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
            }
            if (!faceapi.nets.ssdMobilenetv1.isLoaded) {
                await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
            }

            labeledFaceDescriptors = await loadLabeledImages();
            setLoading(true);
        };

        const loadLabeledImages = async () => {
            try {
                const data = images;

                const descriptors = await Promise.all(
                    data.map(async (record) => {
                        try {
                            // Fetch từng ảnh từ media_link
                            const img = await faceapi.fetchImage(record.media_link);
                            const detection = await faceapi
                                .detectSingleFace(img)
                                .withFaceLandmarks()
                                .withFaceDescriptor();

                            if (detection) {
                                return new faceapi.LabeledFaceDescriptors(record.user_id_encode, [
                                    detection.descriptor,
                                ]);
                            } else {
                                console.warn(`Không thể phát hiện khuôn mặt trong ảnh: ${record.media_link}`);
                                return null;
                            }
                        } catch (err) {
                            console.error(`Lỗi khi xử lý ảnh ${record.media_link}:`, err);
                            return null;
                        }
                    }),
                );

                return descriptors.filter((desc) => desc !== null);
            } catch (error) {
                console.error('Lỗi khi tải ảnh và phát hiện khuôn mặt:', error);
                return [];
            }
        };

        const getCameraStream = () => {
            navigator.mediaDevices
                .getUserMedia({ video: { width: 640, height: 480 } })
                .then((stream) => {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        startFaceDetection();
                    };
                })
                .catch((error) => {
                    console.error('Lỗi truy cập camera: ', error);
                });
        };

        const findBestMatch = (descriptor) => {
            if (labeledFaceDescriptors.length === 0) return null;

            const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.4); // Ngưỡng phù hợp
            const bestMatch = faceMatcher.findBestMatch(descriptor);

            if (bestMatch.label === 'unknown' || bestMatch.distance > 0.4) {
                return null; // Không tìm thấy khớp chính xác
            }
            return bestMatch;
        };

        const startFaceDetection = async () => {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            faceapi.matchDimensions(canvas, {
                width: video.videoWidth,
                height: video.videoHeight,
            });

            const detectionInterval = setInterval(async () => {
                const detections = await faceapi
                    .detectAllFaces(video, new faceapi.SsdMobilenetv1Options())
                    .withFaceLandmarks()
                    .withFaceDescriptors();

                const resizedDetections = faceapi.resizeResults(detections, {
                    width: video.videoWidth,
                    height: video.videoHeight,
                });

                const context = canvas.getContext('2d', { willReadFrequently: true });
                context.clearRect(0, 0, canvas.width, canvas.height);

                let detected = false; // Cờ để kiểm tra nhận diện thành công
                let bestDistance = null;

                resizedDetections.forEach((detect) => {
                    const bestMatch = findBestMatch(detect.descriptor);

                    if (bestMatch) {
                        const user_id_encode = bestMatch.label;

                        if (user_id_encode !== nameUser) {
                            setNameUser(user_id_encode);
                            loginWithFaceRecognition(user_id_encode);
                        }

                        detected = true; // Đã nhận diện thành công
                    }

                    faceapi.draw.drawFaceLandmarks(canvas, detect);
                });

                if (!detected) {
                    setNameUser('Không nhận diện được khuôn mặt phù hợp');
                }
            }, 200);

            return () => clearInterval(detectionInterval);
        };

        const loginWithFaceRecognition = async (user_id_encode) => {
            try {
                const response = await postData(API_LOGIN_FACE_RECOGNITION, {
                    user_id_encode,
                });
                if (response?.status) {
                    console.log('Đăng nhập thành công:', response.data);
                    window.location.href = '/';
                } else {
                    console.error('Đăng nhập thất bại:', response.message);
                }
            } catch (error) {
                console.error('Lỗi khi gửi yêu cầu đăng nhập:', error);
            }
        };

        loadFaceAPI().then(getCameraStream);

        return () => {
            if (videoRef.current) {
                const stream = videoRef.current.srcObject;
                if (stream) {
                    stream.getTracks().forEach((track) => track.stop());
                }
            }
        };
    }, [isDetect, images]);
    const handleOpenAuthenEmail = () => {
        setOpenModaEmail(true);
    };
    const handleCloseAuthenEmail = () => {
        setOpenModaEmail(false);
    };
    return (
        <div className="login-face-recognition">
            {isDetect && (
                <div className="login-face-recognition-container">
                    <BackButton />
                    <h3>Nhận Diện Khuôn Mặt để Đăng Nhập</h3>
                    {!loading ? (
                        <div className="loading text-danger">Đang tải mô hình nhận diện...</div>
                    ) : (
                        <>
                            <div className="video-container">
                                <div className="line"></div>
                                <video ref={videoRef} autoPlay muted></video>
                                <canvas ref={canvasRef} className="overlay"></canvas>
                            </div>
                            {nameUser === 'Không nhận diện được khuôn mặt phù hợp' ? (
                                <h6 className="text-warning">{nameUser}</h6>
                            ) : nameUser ? (
                                <h4>{nameUser}</h4>
                            ) : (
                                <h6 className="text-danger">Đang kiểm tra dữ liệu khuôn mặt {'.'.repeat(dots)}</h6>
                            )}
                        </>
                    )}
                </div>
            )}
            <Modal
                open={!isDetect}
                // onClose={handleCloseAuthenEmail}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style }} className="model_authen_email">
                    <div className="header_modal">
                        <h2 id="parent-modal-title">Nhập email để xác thực</h2>
                    </div>
                    <div className="content_modal">
                        <div className="input-group">
                            <InputLabel id="email-label">Email</InputLabel>

                            <TextField
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                id="outlined-basic"
                                variant="outlined"
                                className="custom_textfield"
                            />
                        </div>
                        <div className="input-group">
                            <InputLabel id="account-type-label">Loại tài khoản</InputLabel>

                            <Select
                                labelId="account-type-label"
                                value={accountType}
                                onChange={(e) => setAccountType(e.target.value)}
                                label="Loại tài khoản"
                                className="custom_textfield"
                            >
                                <MenuItem value="register">Register</MenuItem>
                                <MenuItem value="google">Google</MenuItem>
                            </Select>
                        </div>
                    </div>
                    <div className="footer_detail_post">
                        <div>
                            <ButtonCustom
                                onClick={handleSubmitCheckEmail}
                                type="submit"
                                variant="contained"
                                title="Xong"
                            />
                            <ButtonCustom
                                className="secondary"
                                variant="contained"
                                onClick={() => navigate(-1)}
                                title="Huỷ"
                            />
                            {/* <Button
                                onClick={handleSubmitCheckEmail}
                                type="submit"
                                className="submit_btn_access"
                                variant="contained"
                            >
                                Xong
                            </Button> */}
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default LoginFaceRecognition;
