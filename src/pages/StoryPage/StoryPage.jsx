import React, { useCallback, useEffect, useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaPlus, FaHandHoldingHeart, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { MdDelete } from 'react-icons/md';
import soundClickHeart from '../../assets/audio/mp3/comedy_pop_finger_in_mouth_001.mp3';
import ClassicPostLoader from '../../skeleton/classic_post_loader';
import StoryPageItem from './StoryPageItem/StoryPageItem';
import { deleteData, getData, postData } from '../../ultils/fetchAPI/fetch_API';
import { API_CREATE_HEART_STORY, API_DELETE_STORY_BY_ID, API_LIST_STORY } from '../../API/api_server';
import config from '../../configs';
import { timeAgo } from '../../ultils/formatDate/format_date';
import images from '../../assets/imgs';
import PrimaryIcon from '../../components/PrimaryIcon/PrimaryIcon';
import { OwnDataContext } from '../../provider/own_data';
import './StoryPage.scss';

function StoryPage() {
    const { pathname } = useLocation();
    const userId = pathname.split('user_id=')[1];
    const dataOwner = useContext(OwnDataContext);
    const [isVisible, setIsVisible] = useState(false);
    const [contentLoaded, setContentLoaded] = useState(false);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [listStory, setListStory] = useState([]);
    const [selectedUserStories, setSelectedUserStories] = useState([]);

    // Fetch all stories and set selected user stories based on userId
    useEffect(() => {
        const fetchStories = async () => {
            const response = await getData(API_LIST_STORY);
            if (response?.status === true) {
                setListStory(response?.stories);
                const userStories = response?.stories.filter((story) => story.user_id === userId);
                if (userStories.length) {
                    setSelectedUserStories(userStories);
                    setCurrentStoryIndex(0);
                }
                setContentLoaded(true);
            }
        };
        fetchStories();
    }, [userId]);

    const handleNextStory = () => {
        setCurrentStoryIndex((prevIndex) => (prevIndex < selectedUserStories.length - 1 ? prevIndex + 1 : 0));
    };

    const handlePrevStory = () => {
        setCurrentStoryIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : selectedUserStories.length - 1));
    };

    const currentStory = selectedUserStories[currentStoryIndex];

    const handleClickHeart = useCallback(async () => {
        try {
            const soundClick = document.querySelector('.sound-click--heart');
            soundClick.play();
            setIsVisible(true);
            setTimeout(() => setIsVisible(false), 1000);
            const response = await postData(API_CREATE_HEART_STORY(currentStory?.story_id));
            if (response?.status === true) {
                setSelectedUserStories((prevStories) =>
                    prevStories.map((story) =>
                        story.story_id === currentStory.story_id
                            ? { ...story, heart_quantity: story.heart_quantity + 1 }
                            : story
                    )
                );
            } else {
                console.error('Error: Could not update heart count.');
            }
        } catch (error) {
            console.error('API call error:', error);
        }
    }, [currentStory]);

    const handleDeleteStory = async () => {
        try {
            const response = await deleteData(API_DELETE_STORY_BY_ID(currentStory?.story_id));
            if (response?.status === true) {
                setTimeout(() => {
                    window.location.href = config.routes.home;
                }, 1000);
            } else {
                console.error('Error: Could not delete story.');
            }
        } catch (error) {
            console.error('API call error:', error);
        }
    };

    const groupStoriesByUser = (stories) => {
        const groupedStories = {};
        stories.forEach((story) => {
            const { user_id } = story;
            if (!groupedStories[user_id]) {
                groupedStories[user_id] = {
                    user_id: story.user_id,
                    user_name: story.user_name,
                    user_avatar: story.user_avatar,
                    stories: [],
                };
            }
            groupedStories[user_id].stories.push(story);
        });
        return Object.values(groupedStories);
    };

    const groupedStories = groupStoriesByUser(listStory);

    return (
        <div className="story_container_main">
            <div className="story-main">
                <div className="container">
                    <div className="story-container">
                        <div className="stories-present">
                            <h2>Stories</h2>
                            <h4>Your Story</h4>
                            <p className="description">
                                Bạn có thể chia sẻ ảnh hoặc viết gì đó
                            </p>
                            <Link to={config.routes.createStory}>
                                <div className="ur-story">
                                    <FaPlus />
                                    <h5>Tạo tin</h5>
                                </div>
                            </Link>
                            <h4>All Stories</h4>
                            <ul className="list-user--stories">
                                {groupedStories.map((data) => (
                                    <StoryPageItem
                                        key={data.user_id}
                                        data={data}
                                        active={data.user_id === userId}
                                        onClick={() => setSelectedUserStories(data.stories)}
                                    />
                                ))}
                            </ul>
                        </div>

                        <div className="content-story--main">
                            {contentLoaded && currentStory ? (
                                <div
                                    className="content-story--container"
                                    style={{ '--background-url': `url(${currentStory?.media_link})` }}
                                >
                                    <div className="pre_story" onClick={handlePrevStory}>
                                        <PrimaryIcon icon={<FaChevronLeft />} />
                                    </div>
                                    <div className="img-content--wrapper">
                                        <div className="content-info">
                                            <div className="white-bar">
                                                {groupedStories?.map((data) => {
                                                    if (data?.user_id === userId) {
                                                        return data?.stories?.map((story, storyIndex) => (
                                                            <div
                                                                key={story.story_id} // Use story_id as key
                                                                className={`white-bar-segment ${currentStoryIndex === storyIndex ? 'active' : ''}`}
                                                            ></div>
                                                        ));
                                                    }
                                                })}
                                            </div>

                                            <div className="content-img--avt">
                                                <img src={currentStory?.user_avatar} alt="" />
                                            </div>
                                            <div className="content-info--detail">
                                                <div className="info">
                                                    <p className="name">
                                                        {currentStory?.user_name}{' '}
                                                        <b>{timeAgo(currentStory?.created_at)}</b>
                                                    </p>
                                                    {dataOwner?.user_id === currentStory?.user_id && (
                                                        <PrimaryIcon
                                                            onClick={handleDeleteStory}
                                                            className="delete_story"
                                                            icon={<MdDelete />}
                                                        />
                                                    )}
                                                </div>
                                                <p className="quantity-heart">
                                                    <FaHandHoldingHeart /> <span>{currentStory.heart_quantity} lượt thích</span>
                                                </p>
                                            </div>
                                        </div>
                                        <img src={currentStory?.media_link} alt="" className="content" />
                                        <div className="icon-heart" onClick={handleClickHeart}>
                                            {isVisible && <img src={images.heartStory} alt="Heart Icon" />}
                                            <lord-icon
                                                src="https://cdn.lordicon.com/ohfmmfhn.json"
                                                trigger="click"
                                                stroke="bold"
                                                state="hover-heartbeat-alt"
                                                colors="red"
                                            />
                                            <p>gửi cho {currentStory?.user_name} lượt thích nào!</p>
                                        </div>
                                    </div>
                                    <div className="next_story" onClick={handleNextStory}>
                                        <PrimaryIcon icon={<FaChevronRight />} />
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
