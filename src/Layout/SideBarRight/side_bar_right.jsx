import React, { useEffect, useState } from "react";
import "./side_bar_right.scss";
import ListContact from "./Contact/list_contact";
import ListSuggest from "./Suggest/list_suggest";
import iconsHbbd from "../../www/icons/hbbd.png";
import { Link } from "react-router-dom";
import { getData } from "../../ultils/fetchAPI/fetch_API";
import { API_FRIEND_DATE_OF_BIRTH } from "../../API/api_server";
function SideBarRight() {
  const [data, setData] = useState([]);
  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await getData(API_FRIEND_DATE_OF_BIRTH);
        if (response?.status) {
          setData(response?.data);
        }
      };
      fetchData();
    } catch (error) {
      console.error(error.message);
    }
  }, []);


  return (
    <React.Fragment>
      <div id="sidebar-right--container">
        <span className="sidebar-right--span">
          {data && (
            <>
              <h4>Sinh nhật</h4>
              <div className="dob-container">
                <img src={iconsHbbd} alt="" />
                <p>
                  Hôm nay là sinh nhật của {" "}
                  {data.map((item, index) => (
                    <React.Fragment key={item.user_id}>
                      {index > 0 && ", "}
                      <Link to={"/profile/" + item.user_id}>
                        <b>{item.user_name}</b>
                      </Link>
                    </React.Fragment>
                  ))}
                </p>
              </div>
            </>
          )}

          <h4>Người liên hệ</h4>
          <ListContact />
          <h4>Gợi ý cho bạn</h4>
          <ListSuggest />
        </span>
      </div>
    </React.Fragment>
  );
}

export default SideBarRight;
