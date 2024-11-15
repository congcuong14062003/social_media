import { useEffect, useState } from "react";
import { API_FRIEND_SUGGEST } from "../../../API/api_server";
import { getData } from "../../../ultils/fetchAPI/fetch_API";
import "./list_suggest.scss";
import SuggestItem from "./SuggestItem/suggest_item";
function ListSuggest() {
  const [data, setData] = useState([]);
  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await getData(API_FRIEND_SUGGEST);
        if (response?.status) {
          console.log(response.data);
          setData(response.data);
        }
      };
      fetchData();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  return (
    <div className="list-suggest--container">
      <ul className="list-suggest">
        {data?.length ?
          data?.map((item, index) => (
            <SuggestItem key={index} user_id={item?.user_id} />
          ))
        :(
            <h5 className="text-center" style={{margin: "5px 0"}}>Bạn không có gợi ý kết bạn nào</h5>
        )
        }
      </ul>
    </div>
  );
}

export default ListSuggest;
