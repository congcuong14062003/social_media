import './ImageComponent.scss';
import images from '../../assets/imgs';
import ComponentProfile from '../ComponentProfile/ComponentProfile';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getData } from '../../ultils/fetchAPI/fetch_API';
import { API_GET_ALL_MEDIA } from '../../API/api_server';
function ImageComponent({noAll}) {
    const { id_user } = useParams();
    const [listImage, setListImage] = useState();
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
    console.log(listImage?.length);

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
