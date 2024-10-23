import React, { useContext, useEffect, useState } from 'react';
import './ListStory.scss';
import { Link } from 'react-router-dom';
import { FaPlus, FaCircleChevronLeft, FaCircleChevronRight } from 'react-icons/fa6';
import StoryItem from '../StoryItem/StoryItem';
import { OwnDataContext } from '../../provider/own_data';
import { getData } from '../../ultils/fetchAPI/fetch_API';
import { API_LIST_STORY } from '../../API/api_server';
import FacebookStoryLoader from '../../skeleton/facebook_story_loader';

function ListStory() {
    const dataOwner = useContext(OwnDataContext);
    const [indexItemStart, setIndexItemStart] = useState(0);
    const [listStory, setListStory] = useState([]);
    const [loadedStory, setLoadedStory] = useState(false);

    useEffect(() => {
        if (dataOwner) {
            setLoadedStory(true);
        } else {
            setLoadedStory(false);
        }
    }, [dataOwner]);

    useEffect(() => {
        const fetchStories = async () => {
            const response = await getData(API_LIST_STORY);
            if (response.status === true) {
                setListStory(response.stories);
            }
        };
        fetchStories();
    }, []);

    const handleTransition = (stateClick) => {
        setIndexItemStart((prevIndex) => {
            const newIndex = stateClick === 'next' ? prevIndex + 1 : prevIndex - 1;
            return Math.max(0, Math.min(newIndex, listStory.length - 4));
        });
    };

    useEffect(() => {
        const btnPrev = document.querySelector('.btn.btn-prev');
        const btnNext = document.querySelector('.btn.btn-next');

        if (btnPrev && btnNext) {
            btnPrev.style.display = indexItemStart <= 0 ? 'none' : 'block';
            btnNext.style.display = indexItemStart >= listStory.length - 4 ? 'none' : 'block';
        }
    }, [indexItemStart, listStory]);

    return (
        <React.Fragment>
            <div className="list_stories_container">
                {listStory.length > 4 && (
                    <FaCircleChevronLeft
                        className="btn btn-prev"
                        onClick={() => handleTransition('prev')}
                    />
                )}

                <ul
                    className="list_story"
                    style={{
                        transform: `translateX(-${indexItemStart * 25}%)`, // Dịch chuyển slide
                    }}
                >
                    {loadedStory ? (
                        <li className="story_item add_story_icon">
                            <Link to="/story/create">
                                <img className="avt_logo" src={dataOwner?.avatar} alt="" />
                                <div className="icon_container">
                                    <FaPlus />
                                </div>
                                <p>Tạo tin</p>
                            </Link>
                        </li>
                    ) : (
                        <div className="loading-skeleton">
                            <FacebookStoryLoader />
                        </div>
                    )}

                    {listStory.slice(indexItemStart, indexItemStart + 4).map((data, index) => (
                        <StoryItem key={index} data={data} />
                    ))}
                </ul>

                {listStory.length > 4 && (
                    <FaCircleChevronRight
                        className="btn btn-next"
                        onClick={() => handleTransition('next')}
                    />
                )}
            </div>
        </React.Fragment>
    );
}



export default ListStory;
