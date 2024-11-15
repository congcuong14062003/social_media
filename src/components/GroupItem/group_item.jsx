import { Link } from "react-router-dom";
import "./group_item.scss";
import { useEffect, useState } from "react";
import { API_GROUP_DETAIL } from "../../API/api_server";
import AvatarWithText from "../../skeleton/avatarwithtext";
import { getData } from "../../ultils/fetchAPI/fetch_API";
function GroupItem({ group_id }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  useEffect(() => {
    try {
      if (!group_id) return;

      const fetchData = async () => {
        const response = await getData(API_GROUP_DETAIL(group_id));
        if (response?.status) {
          setLoading(true);
          setData(response?.data);
        }
      };
      fetchData();
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <li className="list-group--item">
      {loading && data ? (
        <Link to={`/group/` + data?.group_id}>
          <div className="avt-group ">
            <img src={data?.avatar_media_link} alt="" />
          </div>
          <div className="name-group">
            <b>{data?.group_name}</b>
          </div>
        </Link>
      ) : (
        <div className="loading-skeleton">
          <AvatarWithText />
        </div>
      )}
    </li>
  );
}

export default GroupItem;
