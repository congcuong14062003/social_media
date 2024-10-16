import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaAngleLeft } from 'react-icons/fa';
import './BackButton.scss';
import ButtonCustom from '../ButtonCustom/ButtonCustom';

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <ButtonCustom startIcon={<FaAngleLeft />} title="Quay lại" className="primary" onClick={handleBack} />
  );
};

export default BackButton;
