import React, { useState, useEffect } from "react";
import {
  List,
  Icon,
  Page,
  Box,
  Button,
  Text,
  Avatar,
  Select,
  useNavigate,
  Input,
  Modal,
} from "zmp-ui";
import "./welcome.css";
import {
  getAccessToken,
  getPhoneNumber,
  getUserInfo,
  getSetting,
  closeApp,
} from "zmp-sdk/apis";
import { Spin } from "antd";
import {
  phoneNumberUser,
  infoUser,
  screenComponent,
  checkURLLink,
} from "../../recoil/RecoilState";
import { isEmpty } from "../../Common/utility";
import dfData from "../../Common/DefaultConfig.json";
import api from "../../Common/api";
import { useRecoilState } from "recoil";
import useSetHeader from "../../components/hooks/useSetHeader";

export default function FirstWelcome() {
  const [phoneNumber, setPhoneNumber] = useRecoilState(phoneNumberUser);
  const [userZalo, setUserZalo] = useRecoilState(infoUser);
  const [loading, setLoading] = useState(false);
  const [checkUseLink, setCheckUseLink] = useRecoilState(checkURLLink);

  const navigate = useNavigate();
  const setHeader = useSetHeader();
  useEffect(() => {
    setHeader({
      hasLeftIcon: true,
      type: "secondary",
      title: "LuckeyWheel",
      customTitle: false,
    });
  }, []);

  const closeMiniApp = async () => {
    try {
      await closeApp({});
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };

  const getSettingDf = async () => {
    try {
      setLoading(true);
      const data = await getSetting({
        success: async (data) => {
          try {
            console.log("data Setting", data.authSetting);
            var check1 = false;
            var check2 = false;
            if (data.authSetting["scope.userInfo"] == false) {
              console.log(
                "Check data authSetting scope.userInfo false",
                data.authSetting["scope.userInfo"],
              );
              check1 = await getUser();
            } else {
              console.log(
                "Check data authSetting scope.userInfo true",
                userZalo,
              );

              if (isEmpty(userZalo)) {
                check1 = await getUser();
              } else {
                check1 = true;
              }
            }
            if (!check1) {
              setLoading(false);
            }
            if (data.authSetting["scope.userPhonenumber"] == false) {
              check2 = await getPhoneUser();
            } else {
              if (phoneNumber == "") {
                check2 = await getPhoneUser();
              } else {
                check2 = true;
              }
            }
            setLoading(false);
            if (check1 && check2) {
              navigate("/luckeywheel");
              //setComponentToRender(<LuckeyWheel />);
              if (checkUseLink.isLink) {
                setCheckUseLink({ ...checkUseLink, isLink: false, url: "" });
                navigate(checkUseLink.url);
              } else {
                navigate("/campain");
              }
            }
          } catch (error) {
            console.log("ERROR catch process", error);
            setLoading(false);
          }
        },
        fail: (error) => {
          console.log("ERROR fail", error);
          setLoading(false);
        },
      });
    } catch (error) {
      console.log("ERROR catch getSettingDf", error);
      // xử lý khi gọi api thất bại
      setLoading(false);
    }
  };

  const getUser = async () => {
    try {
      const { userInfo } = await getUserInfo({});
      console.log("Success getUser: ", userInfo);
      setUserZalo({ ...userInfo });
      return true;
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log("error getUser: ", err);
      return false;
    }
  };

  const getPhoneUser = async () => {
    try {
      const accessToken = await getAccessToken({});
      const checkPromise = new Promise((resolve, reject) => {
        getPhoneNumber({
          success: async (data) => {
            let { token } = data;
            try {
              console.log("Data call api log", {
                accessToken: accessToken,
                tokenNumber: token,
                secretKey: dfData.secretKey,
              });
              const res = await api.post("ZaloHelperApi/GetPhoneNumber", {
                accessToken: accessToken,
                tokenNumber: token,
                secretKey: dfData.secretKey,
              });
              console.log("Res getPhonenumber", res.data);
              setPhoneNumber(res.data.number);
              resolve(true);
            } catch (err) {
              console.log("Call API getPhonenumber Error", err);
              reject(false);
            }
          },
          fail: (error) => {
            if (error.code === -201) {
              // Handle specific fail case if needed
            }
            reject(false);
          },
        });
      });

      return checkPromise;
    } catch (error) {
      return false;
    }
  };

  return (
    <Page
      hideScrollbar={true}
      className="welcome-container"
      restoreScrollOnBack={true}
      style={{
        maxHeight: "100vh",
        backgroundColor: "#fff",
        backgroundSize: "cover",
        backgroundImage: `url(${dfData.url}/images/winmart/background_lienket.jpg)`,
      }}
    >
      <Spin spinning={loading}>
        <Box className="divCenter">
          {/* <img
            style={{
              width: 320,
              height: 105,
              objectFit: "contain",
            }}
            src={`${dfData.url}/images/winmart/LogoWinmart.png`}
          /> */}
          <br />
          <br />
          <br />
          <br />
          <br />
        </Box>
        <Box mt={2} className="divCenter">
          <text
            style={{
              fontSize: 32,
              fontFamily: "Inter, sans-serif",
              lineHeight: "34px",
              color: "#fff",
              fontWeight: 700,
              textShadow: "0px 1px 5px rgba(20, 0, 0, 1)",
            }}
          >
            XIN CHÀO
          </text>
        </Box>

        <Box pr={5} pl={5} mt={3}>
          <p
            style={{
              fontSize: 22,
              fontFamily: "Inter, sans-serif",
              lineHeight: "24px",
              color: "#fff",
              fontWeight: 500,
              textAlign: "center",
              textShadow: "0px 1px 5px rgba(20, 0, 0, 1)",
            }}
          >
            Incom nhận thông tin của bạn để thực hiện quay số và xác thực giải
            thưởng.
          </p>
          <p
            style={{
              fontSize: 22,
              fontFamily: "Inter, sans-serif",
              lineHeight: "24px",
              color: "#fff",
              fontWeight: 500,
              textAlign: "center",
              textShadow: "0px 1px 5px rgba(20, 0, 0, 1)",
            }}
          >
            Vui lòng đồng ý chia sẻ với Incom nhé !
          </p>
        </Box>

        <Box className="action-button">
          <Button
            className="lienket"
            onClick={() => {
              getSettingDf();
            }}
          >
            Liên kết thông tin
          </Button>
          <Box
            className="tuchoi"
            onClick={closeMiniApp}
            style={{
              fontSize: 22,
              fontFamily: "Inter, sans-serif",
              lineHeight: "24px",
              color: "#fff",
              fontWeight: 500,
              textAlign: "center",
              textShadow: "0px 1px 5px rgba(20, 0, 0, 1)",
            }}
          >
            Thoát
          </Box>
        </Box>
      </Spin>
    </Page>
  );
}
