import React, { useState, useRef, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import { FaPlayCircle, FaPause } from "react-icons/fa";
import './wave_surfer.scss';

const Waveform = ({ audioUrl }) => {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    if (waveformRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        barWidth: 2,
        barRadius: 2,
        barGap: 3,
        barMinHeight: 10,
        cursorWidth: 1,
        container: waveformRef.current,
        backend: "WebAudio",
        height: 50,
        progressColor: "#66ff33",
        responsive: true,
        waveColor: "#C4C4C4",
        cursorColor: "transparent"
      });

      const loadAudio = async () => {
        try {
          await wavesurferRef.current.load(audioUrl);
          setLoading(false);
          const audioDuration = wavesurferRef.current.getDuration();
          setDuration(audioDuration);
        } catch (error) {
          console.error('Error loading audio:', error);
          setLoading(false);
        }
      };

      wavesurferRef.current.on('audioprocess', () => {
        setCurrentTime(wavesurferRef.current.getCurrentTime());
      });

      wavesurferRef.current.on('finish', () => {
        setPlaying(false); // Đặt lại trạng thái khi audio chạy hết
        setCurrentTime(0); // Đặt lại thời gian hiện tại về 0
      });

      loadAudio();

      return () => {
        if (wavesurferRef.current) {
          wavesurferRef.current.destroy();
        }
      };
    }
  }, [audioUrl]);

  const handlePlay = () => {
    setPlaying(!playing);
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  return (
    <div className="waveform-container">
      {loading && <div className="loading">Loading...</div>}
      <button className="play-button" onClick={handlePlay} disabled={loading}>
        {!playing ? (
          <FaPlayCircle color="white" fontSize="10em" />
        ) : (
          <FaPause color="white" fontSize="10em" />
        )}
      </button>
      <div className="wave" ref={waveformRef} />
      <audio ref={trackRef} src={audioUrl} />
      <div className="time-container">
        <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
      </div>
    </div>
  );
};

// Hàm để định dạng thời gian
const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export default Waveform;
