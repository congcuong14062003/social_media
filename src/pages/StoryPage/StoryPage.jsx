import React, { useCallback, useEffect, useState } from "react";
import "./StoryPage.scss";
import { FaPlus } from "react-icons/fa6";
import { FaHandHoldingHeart } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import soundClickHeart from "../../assets/audio/mp3/comedy_pop_finger_in_mouth_001.mp3";
import ClassicPostLoader from "../../skeleton/classic_post_loader";
import StoryPageItem from "./StoryPageItem/StoryPageItem";
import { getData } from "../../ultils/fetchAPI/fetch_API";
import { API_LIST_STORY, API_STORY_BY_ID } from "../../API/api_server";
import config from "../../configs";
import { timeAgo } from "../../ultils/formatDate/format_date";

function StoryPage() {
    const [heartQuantity, setHeartQuantity] = useState(1000);
    const [contentLoaded, setContentLoaded] = useState(false);
    const [dataStory, setDataStory] = useState();
    const [listStory, setListStory] = useState([]);
    const { id_story } = useParams();

    // useEffect(() => {
    //     setTimeout(() => {
    //         setContentLoaded(true);
    //     }, 2000);
    // }, []);

    const handleClickHeart = useCallback(() => {
        const soundClick = document.querySelector(".sound-click--heart");
        soundClick.play();
        setHeartQuantity((heartQuantity) => heartQuantity + 1);
    }, []);

    useEffect(() => {
        const dataStory = async () => {
            const response = await getData(API_STORY_BY_ID(id_story));
            if (response?.status === true) {
                setDataStory(response?.story);
                setContentLoaded(true);
            }
        };
        dataStory();
    }, [id_story]);

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

    return (
        <div className="story_container_main">
            <div className="story-main">
                <div className="container">
                    <div className="story-container">
                        <div className="stories-present">
                            <h2>Tin</h2>
                            <h4>Tin của bạn</h4>
                            <p className="description">Bạn có thể tạo tin bằng ảnh hoặc văn bản để chia sẻ với bạn bè.</p>
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
                                        // Truyền active nếu id_story trong params trùng với story_id
                                        active={data.story_id === id_story}
                                    />
                                ))}
                            </ul>
                        </div>

                        <div className="content-story--main">
                            {contentLoaded ? (
                                <div
                                    className="content-story--container"
                                    style={{ '--background-url': `url(${dataStory?.media_link})` }}
                                >
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
                                                    <MdDelete />
                                                </div>
                                                <p className="quantity-heart">
                                                    <FaHandHoldingHeart /> <p>{heartQuantity} lượt thích</p>
                                                </p>
                                            </div>
                                        </div>
                                        <img
                                            src={dataStory?.media_link}
                                            alt=""
                                            className="content"
                                        />
                                        <div
                                            className="icon-heart"
                                            onClick={() => setTimeout(handleClickHeart, 500)}
                                        >
                                            <lord-icon
                                                src="https://cdn.lordicon.com/ohfmmfhn.json"
                                                trigger="click"
                                                stroke="bold"
                                                state="hover-heartbeat-alt"
                                                colors="red"
                                            />
                                            <p>
                                                Tặng {dataStory?.user_name} một lượt yêu thích ngay nào
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="loading-skeleton" style={{ transform: "translateX(25%)" }}>
                                    <ClassicPostLoader />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <audio style={{ display: "none" }} src={soundClickHeart} className="sound-click--heart"></audio>
        </div>
    );
}

export default StoryPage;
