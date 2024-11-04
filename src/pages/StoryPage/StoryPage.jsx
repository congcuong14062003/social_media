import React, { useCallback, useEffect, useState, useRef, useContext } from 'react';
import './StoryPage.scss';
import { FaPlus, FaHandHoldingHeart } from 'react-icons/fa6';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import soundClickHeart from '../../assets/audio/mp3/comedy_pop_finger_in_mouth_001.mp3';
import ClassicPostLoader from '../../skeleton/classic_post_loader';
import StoryPageItem from './StoryPageItem/StoryPageItem';
import { deleteData, getData, postData } from '../../ultils/fetchAPI/fetch_API';
import { API_CREATE_HEART_STORY, API_DELETE_STORY_BY_ID, API_LIST_STORY, API_STORY_BY_ID } from '../../API/api_server';
import config from '../../configs';
import { timeAgo } from '../../ultils/formatDate/format_date';
import images from '../../assets/imgs';
import PrimaryIcon from '../../components/PrimaryIcon/PrimaryIcon';
import { OwnDataContext } from '../../provider/own_data';

function StoryPage() {
    const dataOwner = useContext(OwnDataContext);
    const [isVisible, setIsVisible] = useState(false);
    const [heartQuantity, setHeartQuantity] = useState(1000);
    const [contentLoaded, setContentLoaded] = useState(false);
    const [dataStory, setDataStory] = useState();
    const [listStory, setListStory] = useState([]);
    const { id_story } = useParams();
    // console.log(">>>:", id_story);

    const navigate = useNavigate();
    const [progress, setProgress] = useState(0); // Quản lý tiến trình.
    const progressInterval = useRef(null); // Lưu interval để reset khi cần.

    const handleClickHeart = useCallback(async () => {
        try {
            const soundClick = document.querySelector('.sound-click--heart');
            soundClick.play(); // Phát âm thanh khi nhấn tim.
            setIsVisible(true); // Hiển thị icon
            setTimeout(() => setIsVisible(false), 1000); // Ẩn sau 1 giây
            const response = await postData(API_CREATE_HEART_STORY(id_story));
            if (response?.status === true) {
                setHeartQuantity((prev) => prev + 1);
            } else {
                console.error('Lỗi: Không thể cập nhật tim.');
            }
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    }, [id_story]);

    // Tự động tải dữ liệu tin theo ID.
    useEffect(() => {
        const fetchStory = async () => {
            const response = await getData(API_STORY_BY_ID(id_story));
            if (response?.status === true) {
                setDataStory(response?.story);
                setHeartQuantity(response?.story.heart_quantity); // Lấy số lượng tim từ API.
                setContentLoaded(true);
            }
        };
        fetchStory();
    }, [id_story]);

    // Lấy danh sách tất cả tin.
    useEffect(() => {
        const fetchStories = async () => {
            const response = await getData(API_LIST_STORY);
            if (response?.status === true) {
                setListStory(response?.stories);
                setContentLoaded(true);
            }
        };
        fetchStories();
    }, []);

    // Quản lý thanh tiến trình và tự động chuyển tin.
    // useEffect(() => {
    //     setProgress(0); // Reset progress khi đổi tin.

    //     progressInterval.current = setInterval(() => {
    //         setProgress((prev) => {
    //             if (prev >= 100) {
    //                 // Nếu tiến trình đạt 100%, chuyển sang tin kế tiếp.
    //                 nextStory();
    //                 return 0;
    //             }
    //             return prev + 2; // Cập nhật progress mỗi 100ms (100ms * 50 lần = 5 giây).
    //         });
    //     }, 100);

    //     return () => clearInterval(progressInterval.current); // Clear interval khi component unmount hoặc đổi tin.
    // }, [id_story]);

    // const nextStory = () => {
    //     if (listStory.length <= 0 && !id_story) return;
    //     const currentIndex = listStory.findIndex((story) => {
    //         console.log(story.story_id, id_story);

    //         return story.story_id === id_story;
    //     });
    //     console.log(':::::::::', currentIndex);

    //     const nextIndex = (currentIndex + 1) % listStory.length; // Quay vòng khi đến tin cuối.
    //     navigate(`/story/${listStory[nextIndex]?.story_id}`);
    // };
    // xoá story
    const handleDeleteStory = async () => {
        try {
            const response = await deleteData(API_DELETE_STORY_BY_ID(id_story));
            if (response?.status === true) {
                // Xóa tin khỏi danh sách tin.
                setTimeout(() => {
                    window.location.href = config.routes.home;
                }, 1000);
            } else {
                console.error('Lỗi: Không thể xóa tin.');
            }
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };
    return (
        <div className="story_container_main">
            <div className="story-main">
                <div className="container">
                    <div className="story-container">
                        <div className="stories-present">
                            <h2>Tin</h2>
                            <h4>Tin của bạn</h4>
                            <p className="description">
                                Bạn có thể tạo tin bằng ảnh hoặc văn bản để chia sẻ với bạn bè.
                            </p>
                            <Link to={config.routes.createStory}>
                                <div className="ur-story">
                                    <FaPlus />
                                    <h5>Tạo tin của bạn</h5>
                                </div>
                            </Link>
                            <h4>Tất cả tin</h4>
                            <ul className="list-user--stories">
                                {listStory.map((data) => (
                                    <StoryPageItem
                                        key={data.story_id}
                                        data={data}
                                        active={data.story_id === id_story}
                                    />
                                ))}
                            </ul>
                        </div>

                        <div className="content-story--main">
                            {contentLoaded ? (
                                <div
                                    className="content-story--container"
                                    style={{
                                        '--background-url': `url(${dataStory?.media_link})`,
                                    }}
                                >
                                    {/* Thanh tiến trình */}
                                    {/* <div className="progress-bar">
                                        <div className="progress" style={{ width: `${progress}%` }}></div>
                                    </div> */}

                                    <div className="img-content--wrapper">
                                        <div className="content-info">
                                            <div className="content-img--avt">
                                                <img src={dataStory?.user_avatar} alt="" />
                                            </div>
                                            <div className="content-info--detail">
                                                <div className="info">
                                                    <p className="name">
                                                        {dataStory?.user_name} <b>{timeAgo(dataStory?.created_at)}</b>
                                                    </p>
                                                    {dataOwner?.user_id === dataStory?.user_id ? (
                                                        <PrimaryIcon
                                                            onClick={handleDeleteStory}
                                                            className="delete_story"
                                                            icon={<MdDelete />}
                                                        />
                                                    ) : (
                                                        ''
                                                    )}
                                                </div>
                                                <p className="quantity-heart">
                                                    <FaHandHoldingHeart /> <p>{heartQuantity} lượt thích</p>
                                                </p>
                                            </div>
                                        </div>
                                        <img src={dataStory?.media_link} alt="" className="content" />
                                        <div className="icon-heart" onClick={handleClickHeart}>
                                            {isVisible && <img src={images.heartStory} alt="Heart Icon" />}{' '}
                                            <lord-icon
                                                src="https://cdn.lordicon.com/ohfmmfhn.json"
                                                trigger="click"
                                                stroke="bold"
                                                state="hover-heartbeat-alt"
                                                colors="red"
                                            />
                                            <p>Tặng {dataStory?.user_name} một lượt yêu thích ngay nào</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="loading-skeleton" style={{ transform: 'translateX(25%)' }}>
                                    <ClassicPostLoader />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <audio style={{ display: 'none' }} src={soundClickHeart} className="sound-click--heart"></audio>
        </div>
    );
}

export default StoryPage;
