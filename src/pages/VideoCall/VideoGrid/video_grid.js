import React, { useEffect, useRef } from 'react';

const VideoGrid = ({ peers }) => {
  const videoGridRef = useRef();

  useEffect(() => {
    if (videoGridRef.current && peers.length > 0) {
      while (videoGridRef.current.firstChild) {
        videoGridRef.current.removeChild(videoGridRef.current.firstChild);
      }

      peers.forEach(peer => {
        const videoElement = document.createElement('video');
        videoElement.srcObject = peer.stream;
        videoElement.autoplay = true;
        videoElement.playsInline = true;
        videoElement.width = 300;
        videoElement.height = 300;

        videoGridRef.current.appendChild(videoElement);
      });
    }
  }, [peers]);

  return (
    <div id="video-grid" ref={videoGridRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 300px)', gridAutoRows: '300px' }}></div>
  );
};

export default VideoGrid;
