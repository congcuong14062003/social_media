import { Link } from "react-router-dom";
import "./StoryPageItem.scss";
import React, { useEffect, useState } from "react";
import AvatarWithText from "../../../skeleton/avatarwithtext";
import PopupInfoShort from "../../../components/PopupInfoShort/PopupInfoShort";
import { timeAgo } from "../../../ultils/formatDate/format_date";
import config from "../../../configs";

function StoryPageItem({ active, data, onClick}) {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if(data) {{
            setLoaded(true)
        }}
    }, [data]);

    return (
        <React.Fragment>
            {loaded ? (
                <li onClick={onClick} className={`user-story--item ${active ? "active" : ""}`}>
                    <Link to={`${config.routes.story}/user_id=${data?.user_id}`}>
                        <div className="img">
                            {/* <PopupInfoShort /> */}
                            <img src={data?.user_avatar} alt="" />
                        </div>
                        <div className="info">
                            <p className="name">{data?.user_name}</p>

                            {/* <p className="time">{timeAgo(data?.created_at)}</p> */}
                            <p className="time">{data?.stories.length} tin mới</p>
                        </div>
                    </Link>
                </li>
            ) : (
                <div className="loading-skeleton">
                    <AvatarWithText />
                </div>
            )}
        </React.Fragment>
    );
}

export default StoryPageItem;
