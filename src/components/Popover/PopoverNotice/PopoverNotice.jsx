import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NoticeItem from '../../NoticeItem/NoticeItem';
import './PopoverNotice.scss';
import Popover from '../Popover';
import { API_LIST_NOTIFICATION } from '../../../API/api_server';
import { getData } from '../../../ultils/fetchAPI/fetch_API';

function PopoverNotice() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Gọi API lấy danh sách thông báo
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await getData(API_LIST_NOTIFICATION);
                if (response?.status) {
                    setNotifications(response?.data);
                } else {
                    console.error('Lỗi khi lấy thông báo');
                }
            } catch (error) {
                console.error('Có lỗi khi gọi API thông báo:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <Popover title="Thông báo">
            <div className="link_full_notice">
                <Link to="/notifications">Xem tất cả</Link>
            </div>
            <div className="list_notice">
                {loading ? (
                    <p>Đang tải thông báo...</p>
                ) : notifications.length === 0 ? (
                    <p>Không có thông báo mới.</p>
                ) : (
                    notifications.map((notification, index) => (
                        <NoticeItem key={index} notification={notification} />
                    ))
                )}
            </div>
        </Popover>
    );
}

export default PopoverNotice;
