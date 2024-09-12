import './ImageComponent.scss';
import images from '../../assets/imgs';
import ComponentProfile from '../ComponentProfile/ComponentProfile';
import { useParams } from 'react-router-dom';
function ImageComponent() {
    const { id_user } = useParams();
    
    return (
        <ComponentProfile title="Ảnh" link={`/profile/${id_user}/anh`} linktitle="Xem tất cả ảnh">
            <div className="image_user_profile">
                <div className="img_item">
                    <img src={images.boy} alt="" />
                </div>

            </div>
        </ComponentProfile>
    );
}

export default ImageComponent;
