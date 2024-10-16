import './IntroduceComponent.scss';
import images from '../../assets/imgs';
import ButtonCustom from '../ButtonCustom/ButtonCustom';
import ComponentProfile from '../ComponentProfile/ComponentProfile';
import { useContext } from 'react';
import { OwnDataContext } from '../../provider/own_data';
const formatJoinDate = (isoDate) => {
    const date = new Date(isoDate);
    const month = date.toLocaleString('vi-VN', { month: 'numeric' }); // Lấy tháng dạng số
    const year = date.getFullYear(); // Lấy năm

    return `tháng ${month} năm ${year}`;
};
function IntroduceComponent() {
    const dataOwner = useContext(OwnDataContext);
    return (
        <ComponentProfile title="Giới thiệu">
            <div className="content_introduce">
                {dataOwner?.date_of_birth && (
                    <div className="list_infor_introduce">
                        <img src={images.lamviec} alt="" />
                        <p>
                            Ngày sinh <span>{dataOwner?.date_of_birth}</span>
                        </p>
                    </div>
                )}
                {dataOwner?.user_work  && (
                    <div className="list_infor_introduce">
                        <img src={images.lamviec} alt="" />
                        <p>
                            Làm việc tại <span>{dataOwner?.user_work}</span>
                        </p>
                    </div>
                )}
                {dataOwner?.user_address && (
                    <div className="list_infor_introduce">
                        <img src={images.livefrom} alt="" />
                        <p>
                            Địa chỉ <span>{dataOwner?.user_address}</span>
                        </p>
                    </div>
                )}
                {dataOwner?.user_school && (
                    <div className="list_infor_introduce">
                        <img src={images.dentu} alt="" />
                        <p>
                            Học tại <span>{dataOwner?.user_school}</span>
                        </p>
                    </div>
                )}
                {dataOwner?.user_work && (
                    <div className="list_infor_introduce">
                        <img src={images.thamgia} alt="" />
                        <p>
                            Tham gia vào <span>{formatJoinDate(dataOwner?.created_at)}</span>
                        </p>
                    </div>
                )}
            </div>
        </ComponentProfile>
    );
}

export default IntroduceComponent;
