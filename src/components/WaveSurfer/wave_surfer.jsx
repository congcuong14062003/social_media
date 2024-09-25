  import React, { useState, useRef, useEffect } from "react";
  import WaveSurfer from "wavesurfer.js";
  import { FaPlayCircle, FaPause } from "react-icons/fa";
  import './wave_surfer.scss';

  const Waveform = ({ audioUrl }) => {
    const [playing, setPlaying] = useState(false);
    const [loading, setLoading] = useState(true); // Thêm state loading
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

        // Tải âm thanh và sau đó xử lý waveform
        const loadAudio = async () => {
          try {
            await wavesurferRef.current.load(audioUrl);
            setLoading(false); // Đặt loading thành false khi tải xong
          } catch (error) {
            console.error('Error loading audio:', error);
            setLoading(false); // Cũng đặt loading thành false nếu có lỗi
          }
        };

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
        {loading && <div className="loading">Loading...</div>} {/* Hiệu ứng loading */}
        <button className="play-button" onClick={handlePlay} disabled={loading}>
          {!playing ? (
            <FaPlayCircle color="white" fontSize="10em" />
          ) : (
            <FaPause color="white" fontSize="10em" />
          )}
        </button>
        <div className="wave" ref={waveformRef} />
        <audio ref={trackRef} src={audioUrl} />
      </div>
    );
  };

  export default Waveform;
