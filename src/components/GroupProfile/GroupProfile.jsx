import { useParams } from 'react-router-dom';
import ImageComponent from '../ImageComponent/ImageComponent';
import './GroupProfile.scss';
import { useEffect, useState } from 'react';
import { getData } from '../../ultils/fetchAPI/fetch_API';
import { API_GET_ALL_MEDIA, API_LIST_GROUP_BY_USERID } from '../../API/api_server';
import HorizontalItem from '../HorizontalItem/HorizontalItem';
import config from '../../configs';
function GroupProfile() {
    const { id_user } = useParams();
    const [listGroup, setListGroup] = useState([]);

    // Gọi API danh sách ảnh
    useEffect(() => {
        const listGroup = async () => {
            try {
                const response = await getData(API_LIST_GROUP_BY_USERID(id_user));
                if (response.status === true) {
                    setListGroup(response.data); // Lưu danh sách bài viết vào state
                } else {
                    console.error('Lỗi khi lấy danh sách bài viết:', response.message);
                }
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
            }
        };

        listGroup();
    }, [id_user]);
    return (
        <>
            {listGroup.length <= 0 ? (
                <div className="no_group">
                    <h1>Chưa có nhóm</h1>
                </div>
            ) : (
                <div className="group_profile_container">
                    {listGroup &&
                        listGroup.map((data, index) => (
                            <HorizontalItem
                                to={`${config.routes.group}/${data?.group_id}`}
                                key={index}
                                title={data?.group_name}
                                avt={data?.avatar_media_link}
                            />
                        ))}
                </div>
            )}
        </>
    );
}

export default GroupProfile;
