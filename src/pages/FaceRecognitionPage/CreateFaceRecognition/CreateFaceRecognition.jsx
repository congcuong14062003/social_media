import React, { useContext, useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import "./CreateFaceRecognition.scss";
import { postData } from '../../../ultils/fetchAPI/fetch_API';
import { API_CREATE_FACE_RECOGNITION_BY_ID } from '../../../API/api_server';
import { OwnDataContext } from '../../../provider/own_data';

import BackButton from '../../../components/BackButton/BackButton';
import { dataURLtoBlob } from '../../../ultils/dataURLtoBLOB/dataURL_to_BLOB';

const CreateFaceRecognitionPage = () => {
  const dataOwner = useContext(OwnDataContext);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUpLoading] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prevDots => (prevDots + 1) % 4);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const setupFaceDetection = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        setLoading(true);
      } catch (err) {
        console.error("Error loading Face API models:", err);
      }
    };

    const startVideo = async () => {
      if (videoRef.current && !videoRef.current.srcObject) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
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

    const detectFace = async () => {
      if (!canvasRef.current || !videoRef.current) return;

      const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
      faceapi.matchDimensions(canvasRef.current, displaySize);

      const captureInterval = setInterval(async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks().withFaceDescriptors();

        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);

        if (resizedDetections.length > 0 && capturedImages.length < 10) {
          await captureImage(videoRef.current);
        }
      }, 500);

      return () => clearInterval(captureInterval);
    };

    const captureImage = async (video) => {
      if (!video || !canvasRef.current) return;

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg');

      setCapturedImages(prevImages => {
        if (prevImages.length < 10) {
          return [...prevImages, imageData];
        } else {
          // Stop the video stream
          const stream = video.srcObject;
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
          // Hide the video container
          document.querySelector('.video-container')?.remove();
          // Set uploading state to true
          setUpLoading(true);
        }
        return prevImages;
      });
    };

    const init = async () => {
      await setupFaceDetection();
      await startVideo();
    };

    init();

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject?.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const formData = new FormData();
      capturedImages.forEach((image, index) => {
        const blob = dataURLtoBlob(image);
        formData.append('images_face_recognition', blob, `image_${index}.jpg`);
      });
      const response = await postData(API_CREATE_FACE_RECOGNITION_BY_ID, formData);
      if (response.status) {
        window.location.href = "/setting/";
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
            <div className="loading text-danger">Đang tải mô hình nhận diện...</div>
          ) : (
            <>
              <div className="video-container">
                <div className="line"></div>
                <video ref={videoRef} autoPlay muted width="640" height="480" />
                <canvas ref={canvasRef} className="overlay" width="640" height="480" />
              </div>
              {!uploading && (
                <h6 className='text-danger'>Đang thu thập dữ liệu khuôn mặt {'.'.repeat(dots)} </h6>
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
              {uploading && (
                <h5>Đang gửi dữ liệu {'.'.repeat(dots)} </h5>
              )}
            </>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default CreateFaceRecognitionPage;
