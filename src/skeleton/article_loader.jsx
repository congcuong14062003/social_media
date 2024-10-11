import React from 'react'
import ContentLoader from 'react-content-loader'

const ArticleLoader = props => (
  <ContentLoader
    width={850} 
    height={1200} 
    viewBox="0 0 850 1300"
    backgroundColor="gray"  // Black background
    foregroundColor="white"  // White foreground
    {...props}
  >
    {/* Title and Author */}
    <rect x="42" y="57" rx="4" ry="4" width="550" height="35" />  {/* Wider title */}
    <rect x="42" y="120" rx="4" ry="4" width="120" height="20" />  {/* Wider author */}
    <rect x="187" y="120" rx="4" ry="4" width="250" height="20" />  {/* Wider author */}
    <circle cx="739" cy="124" r="9" />
    <circle cx="765" cy="124" r="9" />

    {/* Image Placeholder */}
    <rect x="217" y="180" rx="4" ry="4" width="433" height="350" />  {/* Larger image */}

    {/* Content Area */}
    <rect x="359" y="550" rx="4" ry="4" width="250" height="15" />  {/* Wider content line */}
    <rect x="48" y="600" rx="4" ry="4" width="720" height="25" />  {/* Wider, taller content line */}
    <rect x="49" y="650" rx="4" ry="4" width="650" height="25" />  {/* Wider, taller content line */}
    <rect x="48" y="700" rx="4" ry="4" width="720" height="25" />  {/* Wider, taller content line */}
    <rect x="49" y="750" rx="4" ry="4" width="580" height="25" />  {/* Wider, taller content line */}
    <rect x="48" y="800" rx="4" ry="4" width="720" height="25" />  {/* Wider, taller content line */}
    <rect x="48" y="850" rx="4" ry="4" width="650" height="25" />  {/* Wider, taller content line */}
    <rect x="48" y="900" rx="4" ry="4" width="720" height="25" />  {/* Wider, taller content line */}
    <rect x="49" y="950" rx="4" ry="4" width="480" height="25" />  {/* Wider, taller content line */}

    {/* Social Icons */}
    <circle cx="713" cy="1020" r="9" />
    <circle cx="739" cy="1020" r="9" />
    <rect x="41" y="1050" rx="4" ry="4" width="720" height="3" /> 

    {/* Comments */}
    <rect x="122" y="1100" rx="4" ry="4" width="420" height="15" />  {/* Wider comments */}
    <circle cx="79" cy="1130" r="28" />  {/* Larger circle */}
    <rect x="135" y="1131" rx="4" ry="4" width="180" height="12" />  {/* Wider comments */}
    <rect x="123" y="1170" rx="4" ry="4" width="420" height="15" />  {/* Wider comments */}
    <circle cx="80" cy="1190" r="28" />  {/* Larger circle */}
    <rect x="136" y="1191" rx="4" ry="4" width="180" height="12" />  {/* Wider comments */}
    <rect x="124" y="1240" rx="4" ry="4" width="420" height="15" />  {/* Wider comments */}
    <circle cx="81" cy="1260" r="28" />  {/* Larger circle */}
    <rect x="137" y="1261" rx="4" ry="4" width="180" height="12" />  {/* Wider comments */}
    <rect x="125" y="1310" rx="4" ry="4" width="420" height="15" />  {/* Wider comments */}
    <circle cx="82" cy="1330" r="28" />  {/* Larger circle */}
    <rect x="138" y="1331" rx="4" ry="4" width="180" height="12" />  {/* Wider comments */}
  </ContentLoader>
)

ArticleLoader.metadata = {
  name: 'Sridhar Easwaran',
  github: 'sridhareaswaran',
  description: 'Article or News',
  filename: 'ArticleLoader',
}

export default ArticleLoader