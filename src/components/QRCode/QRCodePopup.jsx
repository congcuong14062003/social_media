import React from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // Import thành phần từ thư viện
import './QRCodePopup.scss';

const QRCodePopup = ({ show, url, onClose }) => {
  if (!show) {
    return null;
  }
  console.log({ show, url, onClose });

  return (
    <div className="qr-code-popup-overlay" onClick={onClose}>
      <div className="qr-code-popup" onClick={(e) => e.stopPropagation()}>
        <QRCodeCanvas value={url} size={256} /> {/* Sử dụng QRCodeCanvas */}
      </div>
    </div>
  );
};

export default QRCodePopup;
