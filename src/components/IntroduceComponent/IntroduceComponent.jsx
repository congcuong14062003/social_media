import './IntroduceComponent.scss';
import images from '../../assets/imgs';
import ButtonCustom from '../ButtonCustom/ButtonCustom';
import ComponentProfile from '../ComponentProfile/ComponentProfile';
function IntroduceComponent() {
    return (
        <ComponentProfile title="Giới thiệu">
            <div className="content_introduce">
                <div className="list_infor_introduce">
                    <img src={images.lamviec} alt="" />
                    <p>
                        Làm việc tại <span>Trường THPT Hà Bắc</span>
                    </p>
                </div>
                <div className="list_infor_introduce">
                    <img src={images.livefrom} alt="" />
                    <p>
                        Sống tại <span>Hà Nội</span>
                    </p>
                </div>
                <div className="list_infor_introduce">
                    <img src={images.dentu} alt="" />
                    <p>
                        Đến từ <span>Hải Dương</span>
                    </p>
                </div>
                <div className="list_infor_introduce">
                    <img src={images.thamgia} alt="" />
                    <p>
                        Tham gia vào <span> Tháng 10 năm 2017</span>
                    </p>
                </div>
            </div>
            <div className="btn_edit_introduce">
                <ButtonCustom className="secondary" title="Chỉnh sửa chi tiết" />
            </div>
        </ComponentProfile>
    );
}

export default IntroduceComponent;
