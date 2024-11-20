import './IntroduceComponent.scss';
import images from '../../assets/imgs';
import ButtonCustom from '../ButtonCustom/ButtonCustom';
import ComponentProfile from '../ComponentProfile/ComponentProfile';
import { useContext } from 'react';
import { OwnDataContext } from '../../provider/own_data';
import { formatJoinDate } from '../../ultils/formatDate/format_date';
// const formatJoinDate = (isoDate) => {
//     const date = new Date(isoDate);
//     const month = date.toLocaleString('vi-VN', { month: 'numeric' }); // Lấy tháng dạng số
//     const year = date.getFullYear(); // Lấy năm

//     return `tháng ${month} năm ${year}`;
// };
function IntroduceComponent({dataUser}) {
    // const dataOwner = useContext(OwnDataContext);
    return (
        <ComponentProfile title="Giới thiệu">
            <div className="content_introduce">
                {dataUser?.date_of_birth && (
                    <div className="list_infor_introduce">
                        <img src={images.lamviec} alt="" />
                        <p>
                            Ngày sinh <span>{dataUser?.date_of_birth}</span>
                        </p>
                    </div>
                )}
                {dataUser?.user_work  && (
                    <div className="list_infor_introduce">
                        <img src={images.lamviec} alt="" />
                        <p>
                            Làm việc tại <span>{dataUser?.user_work}</span>
                        </p>
                    </div>
                )}
                {dataUser?.user_address && (
                    <div className="list_infor_introduce">
                        <img src={images.livefrom} alt="" />
                        <p>
                            Địa chỉ <span>{dataUser?.user_address}</span>
                        </p>
                    </div>
                )}
                {dataUser?.user_school && (
                    <div className="list_infor_introduce">
                        <img src={images.dentu} alt="" />
                        <p>
                            Học tại <span>{dataUser?.user_school}</span>
                        </p>
                    </div>
                )}
                {dataUser?.created_at && (
                    <div className="list_infor_introduce">
                        <img src={images.thamgia} alt="" />
                        <p>
                            Tham gia vào <span>{formatJoinDate(dataUser?.created_at)}</span>
                        </p>
                    </div>
                )}
            </div>
        </ComponentProfile>
    );
}

export default IntroduceComponent;
