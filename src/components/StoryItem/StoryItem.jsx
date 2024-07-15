import { Fragment, useState } from 'react';
import './StoryItem.scss';
import { Link } from 'react-router-dom';
import images from '../../assets/imgs';
function StoryItem() {
    const [loaded, setLoaded] = useState(false);
    setTimeout(() => {
        setLoaded(true);
    }, 2000);
    return (
        <Fragment>
            <li className="story_item">
                {/* {loaded ? ( */}
                <Link to="/story/123">
                    <img
                        className="media_story"
                        src="https://gaixinhbikini.com/wp-content/uploads/2022/08/Hinh-anh-gai-Nga-dep-luvvn-51.jpg"
                        alt=""
                    />
                    <div className="info_container">
                        <span>
                            <img src={images.avt} alt="" />
                        </span>

                        <div className="name">Dasha Taran</div>
                    </div>
                </Link>
                {/* // ) : (
            //     <div className="loading-skeleton">
            //         <InstagramStyle />
            //     </div>
            // )} */}
            </li>
        </Fragment>
    );
}

export default StoryItem;
