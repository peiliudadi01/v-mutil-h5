// import axios from "axios";
import { getSmsCode, addUser, getShareCheck } from "@shared/api";
import { postFetch, getFetch} from "@util/request";
// console.log("addUser", addUser, window, axios);

//获取入住人信息
export const getCheckInfoByShare = async (params) => {
  const res = await new Promise(res => {
    // console.log("参数---------------", params, getShareCheck);
    res(getFetch(getShareCheck, params));
  });
  return res;
};

//添加入住人
export const addUserByShare = async (params) => {
  const res = await new Promise(res => {
    res(postFetch(addUser, params));
  });
  return res;
};

//获取验证码
export const getSmsCodeByShare = async (params) => {
  const res = await new Promise(res => {
    res(postFetch(getSmsCode, params));
  });
  return res;
};

