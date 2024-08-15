import { toast } from "react-toastify";
import getToken from "../getToken/get_token";


const fetchData = async (url, options = {}) => {
  try {
    const token = getToken();

    const mergedOptions = {
      ...options,
      credentials: 'include',
      headers: {
        ...options.headers,
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    };

    const response = await fetch(url, mergedOptions);
    console.log("Response: ", (response));
    if (!response.ok) {
      throw new Error(response.message);
    }
    // Kiểm tra xem phản hồi có nội dung không
    let data;
    try {
      data = await response.json();
    } catch (e) {
      // Nếu không phải JSON hợp lệ, sử dụng phản hồi gốc
      data = response;
    }

    if (data?.status === false && data.data?.message) {
      toast.error(data?.message);
    } else if (data?.message && data?.message) {
      toast.success(data?.message);
    }
    return data;
  } catch (error) {
    console.log(error.message ?? error);
    toast.error(error.message ?? error);
  }
};


export const getData = async (url_endpoint, headers = {}) => {
  const url = url_endpoint;
  const options = {
    method: 'GET',
    headers: {
      ...headers,
    },
  };

  return await fetchData(url, options);
};

export const postData = async (url_endpoint, payload, headers = {}) => {
  const url = url_endpoint;
  const options = {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  };
  return await fetchData(url, options);
};

export const putData = async (url_endpoint, payload, headers = {}) => {
  const url = url_endpoint;
  const options = {
    method: 'PUT',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  };
  return await fetchData(url, options);
};

export const deleteData = async (url_endpoint, headers = {}) => {
  const url = url_endpoint;
  const options = {
    method: 'DELETE',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  };
  return await fetchData(url, options);
};
