import React from 'react';
import ContentLoader from 'react-content-loader';

const AvatarLoader = props => (
  <ContentLoader 
    backgroundColor="gray" 
    foregroundColor="lightgray" 
    viewBox="0 0 50 50" 
    height={50} 
    width={50} 
    {...props}
  >
    {/* Avatar hình tròn */}
    <circle cx="20" cy="20" r="40" />
  </ContentLoader>
);

AvatarLoader.metadata = {
  name: 'Simple Circle Avatar Loader',
  github: 'your-github-username', // Thay đổi bằng username Github của bạn
  description: 'Loader chỉ có avatar hình tròn',
  filename: 'AvatarLoader', // tên file
};

export default AvatarLoader;
