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
    const data = await response.json();
    if(data.status === 200) {
      toast.success(data.message);
    } else {
      toast.error(data.message)
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const getData = async (url_endpoint, payload,  headers = {}) => {
  const url = url_endpoint;
  const options = {
    method: 'GET',
    headers: {
      ...headers,
    },
    body: JSON.stringify(payload),
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
