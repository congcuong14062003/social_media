import { Fragment, useEffect, useState } from 'react';
import './StoryItem.scss';
import { Link } from 'react-router-dom';
import images from '../../assets/imgs';
import InstagramStyle from '../../skeleton/insta_style';
import FacebookStoryLoader from '../../skeleton/facebook_story_loader';
import config from '../../configs';
function StoryItem({ data }) {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        if (data) {
            setLoaded(true);
        }
    }, [data]);
    return (
        <Fragment>
            <li className="story_item">
                {loaded ? (
                    <Link to={`${config.routes.story}/user_id=${data.user_id}`}>
                        <img className="media_story" src={data?.stories[0].media_link} alt="" />
                        <div className="info_container">
                            <span>
                                <img src={data?.user_avatar} alt="" />
                            </span>
                            <div className="name">{data?.user_name}</div>
                        </div>
                    </Link>
                ) : (
                    <div className="loading-skeleton">
                        <FacebookStoryLoader />
                    </div>
                )}
            </li>
        </Fragment>
    );
}

export default StoryItem;
