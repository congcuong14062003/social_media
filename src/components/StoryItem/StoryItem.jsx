import { Fragment, useEffect, useState } from 'react';
import './StoryItem.scss';
import { Link } from 'react-router-dom';
import images from '../../assets/imgs';
import InstagramStyle from '../../skeleton/insta_style';
function StoryItem({data}) {
    const [loaded, setLoaded] = useState(false);
    setTimeout(() => {
        setLoaded(true);
    }, 1000);
    return (
        <Fragment>
            <li className="story_item">
                {loaded ? (
                    <Link to="/story/123">
                        <img
                            className="media_story"
                            src={data?.media_link}
                            alt=""
                        />
                        <div className="info_container">
                            <span>
                                <img src={data?.user_avatar} alt="" />
                            </span>

                            <div className="name">{data?.user_name}</div>
                        </div>
                    </Link>
                ) : (
                    <div className="loading-skeleton">
                        <InstagramStyle />
                    </div>
                )}
            </li>
        </Fragment>
    );
}

export default StoryItem;
