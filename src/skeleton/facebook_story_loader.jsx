import React from 'react';
import ContentLoader from 'react-content-loader';

const FacebookStoryLoader = ({
  width = 150,
  height = 250,
  backgroundColor = "#f0f0f0",
  foregroundColor = "#e0e0e0",
  ...props
}) => (
  <ContentLoader 
    viewBox={`0 0 ${width} ${height}`} 
    width={width}
    height={height}
    backgroundColor={backgroundColor}
    foregroundColor={foregroundColor}
    {...props}
  >
    {/* Avatar với viền */}
    <circle cx="30" cy="30" r="30" /> {/* Avatar */}
    <circle cx="30" cy="30" r="26" fill={backgroundColor} /> {/* Viền trong */}

    {/* Ảnh lớn phía dưới avatar */}
    <rect x="0" y="70" rx="10" ry="10" width="100%" height="120" />

    {/* Tên người dùng */}
    <rect x="10" y="200" rx="5" ry="5" width="80%" height="15" />
  </ContentLoader>
);

export default FacebookStoryLoader;
