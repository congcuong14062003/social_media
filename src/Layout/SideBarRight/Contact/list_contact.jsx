import "./list_contact.scss";
import ContactItem from "./ContactItem/contact_item";
import { useContext, useEffect, useState } from "react";
import { OwnDataContext } from "../../../provider/own_data";
import { getData } from "../../../ultils/fetchAPI/fetch_API";
import { API_FRIEND_LIST } from "../../../API/api_server";
import { useSocket } from "../../../provider/socket_context";
function ListContact() {
  const dataOwner = useContext(OwnDataContext);
  const [dataFriend, setDataFriend] = useState([]);
  const [listUsersOnline, setListUsersOnline] = useState([]);
  const [loading, setLoading] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    try {
      if (dataOwner) {
        const fetchData = async () => {
          const responseFriend = await getData(
            API_FRIEND_LIST(dataOwner?.user_id)
          );
          setDataFriend(responseFriend?.data);
          return responseFriend?.status;
        };
        setLoading(fetchData());
      }
    } catch (error) {
      console.log(error.message);
    }
  }, [dataOwner]);
  useEffect(() => {
    if (socket) {
      // socket.emit("registerUser", { user_id: dataOwner?.user_id });

      // Đăng ký sự kiện onlineUsers
      socket.on("onlineUsers", (data) => {
        setListUsersOnline(data);
      });
    }
  }, [socket]);

  return (
    <div className="list-contact--container">
      <ul className="list-contact">
        {dataFriend ? (
          dataFriend?.map((item, index) => (
            <ContactItem
              data={item}
              key={index}
              loading={loading}
              active={
                listUsersOnline && listUsersOnline?.includes(item?.friend_id)
              }
            />
          ))
        ) : (
          <h5 className="text-center" style={{margin: "5px 0"}}>Không có bạn bè nào</h5>
        )}
      </ul>
    </div>
  );
}

export default ListContact;
