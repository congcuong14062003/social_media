import React, { useEffect, useState } from 'react';
import './ListStory.scss';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa6';
import { FaCircleChevronLeft, FaCircleChevronRight } from 'react-icons/fa6';
import StoryItem from '../StoryItem/StoryItem';
import images from '../../assets/imgs';

function ListStory() {
    const [indexItemStart, setIndexItemStart] = useState(0);

    useEffect(() => {
        const btnPrev = document.querySelector('.btn.btn-prev');
        const btnNext = document.querySelector('.btn.btn-next');

        const handleTransition = (stateClick) => {
            setIndexItemStart((prevIndex) => (stateClick === 'next' ? prevIndex + 1 : prevIndex - 1));
        };

        btnPrev.addEventListener('click', () => handleTransition('prev'));
        btnNext.addEventListener('click', () => handleTransition('next'));

        return () => {
            btnPrev.removeEventListener('click', () => handleTransition('prev'));
            btnNext.removeEventListener('click', () => handleTransition('next'));
        };
    }, []);

    useEffect(() => {
        const btnPrev = document.querySelector('.btn.btn-prev');
        const btnNext = document.querySelector('.btn.btn-next');
        const listStories = document.querySelector('.list_story');
        const totalItems = document.querySelectorAll('.story_item').length;
        const maxIndex = totalItems - 4; // 4 là số lượng phần tử hiển thị cùng lúc

        if (indexItemStart <= 0) {
            btnPrev.style.display = 'none';
        } else {
            btnPrev.style.display = 'block';
        }

        if (indexItemStart >= maxIndex) {
            btnNext.style.display = 'none';
        } else {
            btnNext.style.display = 'block';
        }

        listStories.style.transform = `translateX(calc(-25% * ${indexItemStart}))`;
    }, [indexItemStart]);

    return (
        <React.Fragment>
            <div className="list_stories_container">
                <FaCircleChevronLeft className="btn btn-prev" />
                <ul className="list_story">
                    <li className="story_item add_story_icon">
                        <Link to="/story/create">
                            <img
                                className="avt_logo"
                                src={images.avt}
                                alt=""
                            />
                            <div className="icon_container">
                                <FaPlus />
                            </div>
                            <p>Tạo tin</p>
                        </Link>
                    </li>
                    <StoryItem />
                    <StoryItem />
                    <StoryItem />
                    <StoryItem />
                    <StoryItem />
                    <StoryItem />
                    <StoryItem />
                    <StoryItem />
                    <StoryItem />
                    <StoryItem />
                    <StoryItem />
                    <StoryItem />
                    <StoryItem />
                    <StoryItem />
                </ul>
                <FaCircleChevronRight className="btn btn-next" />
            </div>
        </React.Fragment>
    );
}

export default ListStory;
