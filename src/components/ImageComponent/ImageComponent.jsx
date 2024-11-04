import './ImageComponent.scss';
import images from '../../assets/imgs';
import ComponentProfile from '../ComponentProfile/ComponentProfile';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getData } from '../../ultils/fetchAPI/fetch_API';
import { API_GET_ALL_MEDIA } from '../../API/api_server';
function ImageComponent({noAll, listImage}) {
    const { id_user } = useParams();
    return (
        <ComponentProfile title="Ảnh" link={`/profile/${id_user}/anh`} linktitle={noAll || "Xem tất cả ảnh"}>
            <div className="image_user_profile">
                {listImage?.length > 0 &&
                    listImage?.map((image, index) => (
                        <div key={index} className="img_item">
                            <img src={image?.media_link} alt="" />
                        </div>
                    ))}
            </div>
        </ComponentProfile>
    );
}

export default ImageComponent;
