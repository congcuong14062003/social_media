import { useParams } from 'react-router-dom';
import ImageComponent from '../ImageComponent/ImageComponent';
import './ImageProfile.scss';
import { useEffect, useState } from 'react';
import { getData } from '../../ultils/fetchAPI/fetch_API';
import { API_GET_ALL_MEDIA } from '../../API/api_server';
function ImageProfile() {
    const {id_user} = useParams();
    const [listImage, setListImage] = useState([]);

      // Gọi API danh sách ảnh
      useEffect(() => {
        const listImage = async () => {
            try {
                const response = await getData(API_GET_ALL_MEDIA(id_user));
                if (response.status === true) {
                    setListImage(response.data); // Lưu danh sách bài viết vào state
                } else {
                    console.error('Lỗi khi lấy danh sách bài viết:', response.message);
                }
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
            }
        };

        listImage();
    }, [id_user]);
    return (
        <div className="image_profile_container">
            <ImageComponent listImage={listImage} noAll />
        </div>
    );
}

export default ImageProfile;
