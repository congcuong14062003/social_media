import { useState } from "react";
import api from "../../API/api_axios"
import { useEffect } from "react";
function TestPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await api.get("/hot");
          setUsers(response.data);
          
        } catch (error) {
          console.error("Lỗi khi lấy danh sách users:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUsers();
    }, []);
  
    if (loading) return <p>Đang tải dữ liệu...</p>;
  
    return (
      <div>
        <h2>Danh sách người dùng</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name} - {user.email}</li>
          ))}
        </ul>
      </div>
    );
}

export default TestPage;
