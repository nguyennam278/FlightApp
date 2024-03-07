import {
  getAccessToken,
  getPhoneNumber,
  getUserInfo,
  getSetting,
} from "zmp-sdk/apis";

import api from "./api";
import dfData from "./DefaultConfig.json";

const getUserZalo = async () => {
  try {
    const { userInfo } = await getUserInfo({});
    return userInfo;
  } catch (error) {
    // xử lý khi gọi api thất bại
    return null;
  }
};

const getPhoneUserZalo = async () => {
  try {
    const accessToken = await getAccessToken({});

    const checkPromise = new Promise((resolve, reject) => {
      getPhoneNumber({
        success: async (data) => {
          let { token } = data;
          try {
            const res = await api.post("ZaloHelperApi/GetPhoneNumber", {
              accessToken: accessToken,
              tokenNumber: token,
              secretKey: dfData.secretKey,
            });
            resolve(res.data.number);
          } catch (err) {
            reject("");
          }
        },
        fail: (error) => {
          if (error.code === -201) {
            // Handle specific fail case if needed
          }
          reject("");
        },
      });
    });

    return checkPromise;
  } catch (error) {
    return "";
  }
};

export { getUserZalo, getPhoneUserZalo };
