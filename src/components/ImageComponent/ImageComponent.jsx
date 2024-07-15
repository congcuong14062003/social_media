import './ImageComponent.scss';
import images from '../../assets/imgs';
import ComponentProfile from '../ComponentProfile/ComponentProfile';
function ImageComponent() {
    return (
        <ComponentProfile title="Ảnh" link="/profile/anh" linktitle="Xem tất cả ảnh">
            <div className="image_user_profile">
                <div className="img_item">
                    <img src={images.boy} alt="" />
                </div>

            </div>
        </ComponentProfile>
    );
}

export default ImageComponent;
