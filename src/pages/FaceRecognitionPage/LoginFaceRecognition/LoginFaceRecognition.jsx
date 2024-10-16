import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import './LoginFaceRecognition.scss';
import { getData, postData } from '../../../ultils/fetchAPI/fetch_API';
import { API_ALL_FACE_RECOGNITION, API_LOGIN_FACE_RECOGNITION } from '../../../API/api_server';
import BackButton from '../../../components/BackButton/BackButton';

const LoginFaceRecognition = ({ titlePage }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState(0);
  const [nameUser, setNameUser] = useState('');
  let labeledFaceDescriptors = []; // Store labeled face descriptors

  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots + 1) % 4);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadFaceAPI = async () => {
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceExpressionNet.loadFromUri('/models');
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');

      labeledFaceDescriptors = await loadLabeledImages(); // Load labeled images
      setLoading(true);
      console.log("Face API models loaded");
    };

    const loadLabeledImages = async () => {
      try {
        const response = await getData(API_ALL_FACE_RECOGNITION);
        const data = response.data;
        console.log(data);

        const descriptors = [];
        for (const record of data) {
          const img = await faceapi.fetchImage(record.media_link);
          const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
          if (detections) {
            descriptors.push(new faceapi.LabeledFaceDescriptors(record.user_id_encode, [detections.descriptor]));
          } else {
            console.log(`Không thể phát hiện khuôn mặt trong ảnh: ${record.media_link}`);
          }
        }
        return descriptors;
      } catch (error) {
        console.error('Lỗi khi tải ảnh và phát hiện khuôn mặt:', error);
        return [];
      }
    };

    const getCameraStream = () => {
      if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then((stream) => {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              startFaceDetection(); // Start face detection after video is loaded
            };
          })
          .catch((error) => {
            console.error('Error accessing the camera: ', error);
          });
      }
    };

    const startFaceDetection = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      let lastDetectedUserId = null; // Lưu trữ user_id_encode của khuôn mặt trước đó

      if (!video || !canvas) {
        console.error('Video or canvas element is not defined');
        return;
      }

      faceapi.matchDimensions(canvas, {
        width: video.videoWidth,
        height: video.videoHeight
      });

      const detectionInterval = setInterval(async () => {
        if (video.videoWidth === 0 || video.videoHeight === 0) {
          console.warn('Video dimensions are not valid');
          return;
        }

        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks().withFaceDescriptors();

        const resizedDetections = faceapi.resizeResults(detections, {
          width: video.videoWidth,
          height: video.videoHeight
        });

        const context = canvas.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
        }

        resizedDetections.forEach(async detect => {
          const bestMatch = findBestMatch(detect.descriptor);
          if (context) {
            faceapi.draw.drawFaceLandmarks(canvas, detect);
          }
          if (bestMatch) {
            const user_id_encode = bestMatch.label;

            if (user_id_encode !== lastDetectedUserId) {
              setNameUser(user_id_encode);
              await loginWithFaceRecognition(user_id_encode); // Fetch API vào login khi phát hiện khuôn mặt mới
              lastDetectedUserId = user_id_encode; // Cập nhật khuôn mặt đã nhận diện
            }
          } else {
            setNameUser('');
          }
        });
      }, 200);

      // Cleanup function to stop detection and camera stream
      return () => {
        clearInterval(detectionInterval);
        if (videoRef.current) {
          const stream = videoRef.current.srcObject;
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
        }
      };
    };

    const findBestMatch = (descriptor) => {
      if (labeledFaceDescriptors.length === 0) return null;
      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);
      const bestMatch = faceMatcher.findBestMatch(descriptor);
      return bestMatch._label === 'Chưa thể xác nhận' ? null : bestMatch; // Return null if no best match
    };

    const loginWithFaceRecognition = async (user_id_encode) => {
      try {
        const response = await postData(API_LOGIN_FACE_RECOGNITION, { user_id_encode });
        if (response.status) {
          console.log('Đăng nhập thành công:', response.data);
          window.location.href = "/";
        } else {
          console.error('Đăng nhập thất bại:', response.message);
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu đăng nhập:', error);
      }
    };

    loadFaceAPI().then(getCameraStream);

    return () => {
      // Cleanup function to stop camera stream
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
    };
  }, [titlePage]);

  return (
    <div className="login-face-recognition">
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
            {nameUser === '' ? (
              <h6 className="text-danger">Đang kiểm tra dữ liệu khuôn mặt {'.'.repeat(dots)}</h6>
            ) : (
              <h4>{nameUser}</h4>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LoginFaceRecognition;
