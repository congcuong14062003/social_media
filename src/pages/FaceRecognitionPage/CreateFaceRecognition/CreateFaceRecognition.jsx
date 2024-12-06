import React, { useContext, useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import "./CreateFaceRecognition.scss";
import { postData } from '../../../ultils/fetchAPI/fetch_API';
import { API_CREATE_FACE_RECOGNITION_BY_ID } from '../../../API/api_server';
import { OwnDataContext } from '../../../provider/own_data';

import BackButton from '../../../components/BackButton/BackButton';
import { dataURLtoBlob } from '../../../ultils/dataURLtoBLOB/dataURL_to_BLOB';

const CreateFaceRecognitionPage = ({ titlePage }) => {
  const dataOwner = useContext(OwnDataContext);
  const [error, setError] = useState(null); // State để hiển thị lỗi khi khuôn mặt đã tồn tại
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUpLoading] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [dots, setDots] = useState(0);

  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots + 1) % 4);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const setupFaceDetection = async () => {
    try {
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models"); // Tải mô hình SSD Mobilenet
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      setLoading(true);
    } catch (err) {
      console.error("Error loading Face API models:", err);
    }
  };
  const detectFace = async () => {
    if (!canvasRef.current || !videoRef.current) return;

    const displaySize = {
      width: videoRef.current.videoWidth,
      height: videoRef.current.videoHeight,
    };
    faceapi.matchDimensions(canvasRef.current, displaySize);

    const captureInterval = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const detections = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detections) {
        const resizedDetections = faceapi.resizeResults(
          [detections],
          displaySize
        );
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);

        // Kiểm tra nếu danh sách existingFaces không rỗng và tạo FaceMatcher

        if (capturedImages.length < 5) {
          await captureImage(videoRef.current); // Tiến hành thu thập hình ảnh khi không có lỗi
        }
      }
    }, 500);

    return () => clearInterval(captureInterval);
  };

  const captureImage = async (video) => {
    if (!video || !canvasRef.current) return;
    console.log("Đang chụp");

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/jpeg");

    setCapturedImages((prevImages) => {
      if (prevImages.length < 5) {
        return [...prevImages, imageData];
      } else {
        // Dừng video stream khi đã có 5 ảnh
        const stream = video.srcObject;
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
        // Ẩn container video
        document.querySelector(".video-container")?.remove();
        // Đặt trạng thái đang tải lên
        setUpLoading(true);
      }
      return prevImages;
    });
  };
  useEffect(() => {
    const startVideo = async () => {
      if (videoRef.current && !videoRef.current.srcObject) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {},
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              videoRef.current.play();
              detectFace();
            };
          }
        } catch (err) {
          console.error("Error starting video:", err);
        }
      }
    };

    const init = async () => {
      await setupFaceDetection();
      await startVideo();
    };

    init();

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject
          ?.getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, [loading]);
  // useEffect khi uploading
  useEffect(() => {
    console.log(capturedImages);

    const fetchData = async () => {
      const formData = new FormData();
      capturedImages.forEach((image, index) => {
        const blob = dataURLtoBlob(image);
        formData.append("images_face_recognition", blob, `image_${index}.jpg`);
      });
      const response = await postData(
        API_CREATE_FACE_RECOGNITION_BY_ID,
        formData
      );
      if (response?.status) {
        window.location.href = "/setting/"; // Điều hướng sau khi upload thành công
      }
    };
    if (uploading) {
      fetchData();
    }
  }, [capturedImages, dataOwner, uploading]);

  return (
    <React.Fragment>
      <div className="face-recognition--container">
        <div className="face-recognition">
          <BackButton />
          <h3>Tạo nhận diện khuôn mặt</h3>
          {!loading ? (
            <div className="loading text-danger">
              Đang tải mô hình nhận diện...
            </div>
          ) : (
            <>
              <div className="video-container">
                <div className="line"></div>
                <video ref={videoRef} autoPlay muted width="640" height="480" />
                <canvas
                  ref={canvasRef}
                  className="overlay"
                  width="640"
                  height="480"
                />
              </div>
              {error && <div className="error text-danger">{error}</div>}
              {!uploading && (
                <h6 className="text-danger">
                  Đang thu thập dữ liệu khuôn mặt {".".repeat(dots)}{" "}
                </h6>
              )}
              {capturedImages.length > 0 && (
                <ul className="captured-images">
                  {capturedImages.map((img, index) => (
                    <li key={index}>
                      <img src={img} alt={`Captured ${index}`} />
                    </li>
                  ))}
                </ul>
              )}
              {uploading && <h5>Đang gửi dữ liệu {".".repeat(dots)} </h5>}
            </>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};



export default CreateFaceRecognitionPage;
