import config from "../../../configs";
import axios from "../axios";

const apiListUser = (data) => {
  return axios({
    url: "/users/list",
    method: "POST",
    data: { ...data, codeFunc: config.codeRoles.user.view },
  });
};

const apiCreateUser = (data) => {
  return axios({
    url: "/users/create",
    method: "POST",
    data: { ...data, codeFunc: config.codeRoles.user.create },
  });
};

const apiDetailUser = (data) => {
  return axios({
    url: "/users/detail",
    method: "GET",
    params: { ...data, codeFunc: config.codeRoles.user.view },
  });
};

const apiListSelection = (data) => {
  return axios({
    url: "/users/list-selection",
    method: "POST",
    data: data,
  });
};

const apiListStatus = (data) => {
  return axios({
    url: "/users/list-status",
    method: "GET",
    params: data,
  });
};

const apiUpdateStatus = (data) => {
  return axios({
    url: "/users/status",
    method: "GET",
    params: { ...data, codeFunc: config.codeRoles.user.update },
  });
};

const apiUpdateUser = (data) => {
  return axios({
    url: "/users/update",
    method: "POST",
    data: { ...data, codeFunc: config.codeRoles.user.update },
  });
};

export {
  apiListUser,
  apiCreateUser,
  apiDetailUser,
  apiListSelection,
  apiListStatus,
  apiUpdateStatus,
  apiUpdateUser,
};
