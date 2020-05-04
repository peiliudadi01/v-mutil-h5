import axios from "axios";
// axios.defaults.baseURL = window.env === "prod" ? window.prodBaseUrl : window.devBaseUrl;
axios.defaults.baseURL = window.hostUrl;
axios.defaults.timeout = 120000;

axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // console.log("-----------------config-------------", config);
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
export const getFetch = async (url, params = {}) => {
  try{
    if(Object.keys(params).length){
      let str = "";
      Object.keys(params).map(it=>{
        str += it + "=" + params[it] + "&";
      });
      url = url + "?" + str.substring(0, str.length-1);
    }
    const res = await axios.get(url);
    return res.data;
  }catch(e){
    console.log("=======rrrrrrrrrrrrrrrrrrrrr================");
    return {
      code:-1,
      message:e.message,
      status:false,
    };
  }
};

export const postFetch = async (url,params = {}) => {
  try{
    const res = await axios.post(url,params);
    return res.data;
  }catch(e){
    return {
      code:-1,
      message:e.message,
      status:false,
    };
  }
};

