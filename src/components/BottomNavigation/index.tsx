import React, { useState, useEffect } from "react";
import { BottomNavigation, useNavigate, Icon, Page } from "zmp-ui";
import {
  getAccessToken,
  getPhoneNumber,
  getUserInfo,
  getSetting,
} from "zmp-sdk/apis";
import { Icon as IconIfy } from "@iconify/react";
import { useRecoilState } from "recoil";
import {
  phoneNumberUser,
  infoUser,
  checkURLLink,
  actionTab,
} from "../../recoil/RecoilState";
import api from "../../Common/api";
import dfData from "../../Common/DefaultConfig.json";
import { isEmpty } from "../../Common/utility";

const BottomNavigationPage: React.FunctionComponent = (props) => {
  const [activeTab, setActiveTab] = useRecoilState(actionTab);
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useRecoilState(phoneNumberUser);
  const [userZalo, setUserZalo] = useRecoilState(infoUser);
  const [isUseLink, setIsUseLink] = useRecoilState(checkURLLink);

  const path = window.location.pathname;

  useEffect(() => {
    handleScreenByTab(activeTab);
  }, [activeTab]);

  const handleScreenByTab = async (text) => {
    switch (text) {
      case "post":
        navigate("/post, { animate: false }");
        break;
      case "contact":
        navigate("/me", { animate: false });
        break;
      case "me":
        navigate("/me", { animate: false });
        break;
      case "insurtech":
        navigate("/me", { animate: false });
        break;
      case "home":
        navigate("/homeDemo", { animate: false });
        break;
      case "survey":
        break;
      case "event":
        break;
      case "wheel":
        break;
      case "welcome":
        break;
      case "error":
        break;
      case "gift":
        break;
      case "first_welcome":
        try {
          const check = new Promise((resolve, reject) => {
            getSetting({
              success: async (data) => {
                if (data.authSetting["scope.userInfo"] === false) {
                  resolve(false);
                } else {
                  if (isEmpty(userZalo)) {
                    await getUser();
                  }
                }
                if (data.authSetting["scope.userPhonenumber"] == false) {
                  resolve(false);
                } else {
                  if (
                    data.authSetting["scope.userPhonenumber"] == true &&
                    phoneNumber == ""
                  ) {
                    await getPhoneUser();
                  }
                }
                resolve(true);
              },
              fail: (error) => {
                reject(false);
              },
            });
          });
          check
            .then((result) => {
              if (result) {
                //setComponentToRender(<Welcome />);
                //setComponentToRender(<LuckeyWheel />);

                if (path.includes("/luckywheel/")) {
                  var list = path.split("/luckywheel/");
                } else {
                  navigate("/campain");
                }
              } else {
                //setComponentToRender(<FirstWelcome />);
                console.log("path: ", path);
                if (path.includes("/luckywheel/")) {
                  var list = path.split("/luckywheel/");
                  setIsUseLink({
                    ...isUseLink,
                    isLink: true,
                    url: `/luckywheel/${list[1]}`,
                  });
                }
                navigate("/first_welcome");
              }
            })
            .catch((error) => {
              // Xử lý lỗi nếu có
              //console.log(error);
              navigate("/first_welcome");
            });
        } catch (error) {
          // Handle errors if any
          //setComponentToRender(<FirstWelcome />);
          navigate("/first_welcome");
        }
        break;
      default:
        break;
    }
  };

  const getUser = async () => {
    try {
      const { userInfo } = await getUserInfo({});
      setUserZalo({ ...userInfo });
    } catch (error: any) {
      // xử lý khi gọi api thất bại
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
              const res = await api.post("ZaloHelperApi/GetPhoneNumber", {
                accessToken: accessToken,
                tokenNumber: token,
                secretKey: dfData.secretKey,
              });
              setPhoneNumber(res.data.number);
              resolve(true);
            } catch (err) {
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

  const handleTabChange = (key: string): void => {
    setActiveTab(key);
  };

  return (
    <Page className="page">
      <BottomNavigation
        fixed
        activeKey={activeTab}
        onChange={(key) => handleTabChange(key)}
      >
        {/* <BottomNavigation.Item
          key="post"
          label="Tin tức"
          icon={<Icon icon="zi-chat" />}
          activeIcon={<Icon icon="zi-chat-solid" />}
        /> */}

        <BottomNavigation.Item
          key="home"
          label="Trang chủ"
          icon={<Icon icon="zi-home" />}
          activeIcon={<Icon icon="zi-home" />}
        />

        {/* <BottomNavigation.Item
          key="wheel"
          label="Wheel"
          icon={<Icon icon="zi-heart" />}
          activeIcon={<Icon icon="zi-heart-solid" />}
        /> */}

        {/* <BottomNavigation.Item
          key="error"
          label="Error Page"
          icon={<Icon icon="zi-heart" />}
          activeIcon={<Icon icon="zi-heart-solid" />}
        /> */}
        {/* <BottomNavigation.Item
          key="first_welcome"
          label="Vòng quay"
          icon={<IconIfy icon="solar:wheel-broken" />}
          activeIcon={<IconIfy icon="solar:wheel-broken" />}
        /> */}
        {/* <BottomNavigation.Item
          key="gift"
          label="Gift"
          icon={<Icon icon="zi-home" />}
          activeIcon={<Icon icon="zi-home" />}
        /> */}
        {/* <BottomNavigation.Item
          key="survey"
          label="Khảo sát"
          icon={<Icon icon="zi-poll" />}
          activeIcon={<Icon icon="zi-poll-solid" />}
        />

        <BottomNavigation.Item
          key="event"
          label="Sự kiện"
          icon={<Icon icon="zi-group" />}
          activeIcon={<Icon icon="zi-group-solid" />}
        /> */}
        {/* <BottomNavigation.Item
          key="insurtech"
          label="Bảo hiểm"
          icon={<Icon icon="zi-heart" />}
          activeIcon={<Icon icon="zi-heart-solid" />}
        />
        <BottomNavigation.Item
          key="contact"
          label="Tra cứu"
          icon={<Icon icon="zi-poll" />}
          activeIcon={<Icon icon="zi-poll-solid" />}
        /> */}
        <BottomNavigation.Item
          key="me"
          label="Cá nhân"
          icon={<Icon icon="zi-user" />}
          activeIcon={<Icon icon="zi-user-solid" />}
        />

        {/* <BottomNavigation.Item
          key="first_welcome"
          label="First"
          icon={<Icon icon="zi-user" />}
          activeIcon={<Icon icon="zi-user-solid" />}
        /> */}
      </BottomNavigation>
    </Page>
  );
};

export default BottomNavigationPage;
