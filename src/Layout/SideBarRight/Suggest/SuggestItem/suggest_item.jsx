import { Link } from "react-router-dom";
import "./suggest_item.scss";
import { useContext, useEffect, useState } from "react";
import AvatarWithText from "../../../../skeleton/avatarwithtext";
import PopupInfoShort from "../../../../component/PopupInfoShort/popup_info_short";
import { getCountMutualFriends } from "../../../../services/fetch_api";
import { OwnDataContext } from "../../../../provider/own_data";
import { getData } from "../../../../ultils/fetchAPI/fetch_API";
import { API_GET_INFO_USER_PROFILE_BY_ID } from "../../../../API/api_server";

function SuggestItem({ user_id, data = {} }) {
  const [loading, setLoading] = useState(true);
  const [countMutualFr, setCountMutualFr] = useState(0);
  const [dataUser, setDataUser] = useState(data);
  const dataOwner = useContext(OwnDataContext);


  useEffect(() => {
    const fetchDataUser = async () => {
      if (!user_id) return;
      if (user_id && Object.keys(data).length === 0) {
        try {
          const response = await getData(
            API_GET_INFO_USER_PROFILE_BY_ID(user_id)
          );
          if (response?.status) {
            setDataUser(response?.data);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchDataUser();
  }, [user_id]);

  useEffect(() => {
    const fetchMutualFriendsCount = async () => {
      try {
        if (dataOwner && user_id) {
          const mutualCount = await getCountMutualFriends(
            user_id,
            dataOwner?.user_id
          );
          setCountMutualFr(mutualCount);
        }
      } catch (error) {
        console.error("Error fetching mutual friends count:", error.message);
      }
    };

    fetchMutualFriendsCount();
  }, [user_id, dataOwner]);

  return (
    <li className="list-suggest--item">
      {loading ? (
        <div className="loading-skeleton">
          <AvatarWithText />
        </div>
      ) : (
        <Link to={`/profile/${dataUser?.user_id}`}>
          <div className="avt-suggest popup">
            <PopupInfoShort user_id={dataUser?.user_id} />
            <img src={dataUser?.avatar} alt="User Avatar" />
          </div>
          <div className="name-suggest">
            <b>{dataUser?.user_name}</b>
            <p>{countMutualFr} bạn chung</p>
          </div>
        </Link>
      )}
    </li>
  );
}

export default SuggestItem;
