import React, { useState, useEffect } from "react";
import { List, Page, Icon, useNavigate, Header } from "zmp-ui";
import {
  getAccessToken,
  getPhoneNumber,
  getUserInfo,
  getSetting,
} from "zmp-sdk/apis";
import BottomNavigationPage from "../components/BottomNavigation";
import Post from "./post";
import AccountManager from "./account";
import Search from "./search";
import Insurtech from "./insurtech";
import Home from "./home";
import Event from "./events";
import Survey from "./survey";
import HomeDemo from "./home/HomeDemo";
import HomeWCM from "./home/homeWCM";
import Gift from "./gift";
import LuckeyWheel from "./luckeywheel";
import Welcome from "./welcome";
import Error from "./error";
import ContainBooking from "./containBooking";
import FirstWelcome from "./welcome/welcomeLienKet";
import {
  phoneNumberUser,
  infoUser,
  screenComponent,
} from "../recoil/RecoilState";
import api from "../Common/api";
import dfData from "../Common/DefaultConfig.json";
import { useRecoilState } from "recoil";
import { isEmpty } from "../Common/utility";

const HomePage: React.FunctionComponent = () => {
  const [screen, setScreen] = useState("home");
  const [componentToRender, setComponentToRender] =
    useRecoilState(screenComponent);
  const [phoneNumber, setPhoneNumber] = useRecoilState(phoneNumberUser);
  const [userZalo, setUserZalo] = useRecoilState(infoUser);

  // useEffect(() => {
  //   handleScreenByTab(screen);
  // }, [screen]);

  const handleScreenByTab = async (text) => {
    switch (text) {
      case "post":
        //return <Post></Post>;
        setComponentToRender(<Post />);
        break;
      case "contact":
        //return <Search></Search>;
        setComponentToRender(<Search />);
        break;
      case "me":
        //return <AccountManager></AccountManager>;
        setComponentToRender(<AccountManager />);
        break;
      case "insurtech":
        //return <Insurtech></Insurtech>;
        setComponentToRender(<Insurtech />);
        break;
      case "home":
        //return <HomeWCM></HomeWCM>;
        setComponentToRender(<HomeDemo />);
        break;
      case "survey":
        //return <Survey></Survey>;
        setComponentToRender(<Survey />);
        break;
      case "event":
        //return <Event></Event>;
        setComponentToRender(<Event />);
        break;
      case "wheel":
        //return <LuckeyWheel></LuckeyWheel>;
        setComponentToRender(<Event />);
        break;
      case "welcome":
        //return <Welcome></Welcome>;
        setComponentToRender(<Welcome />);
        break;
      case "error":
        //return <Error></Error>;
        setComponentToRender(<Error />);
        break;
      case "gift":
        //return <Gift></Gift>;
        setComponentToRender(<Gift />);
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
                setComponentToRender(<LuckeyWheel />);
              } else {
                setComponentToRender(<FirstWelcome />);
              }
            })
            .catch((error) => {
              // Xử lý lỗi nếu có
              console.log(error);
              setComponentToRender(<FirstWelcome />);
            });
        } catch (error) {
          // Handle errors if any
          console.log(error);
          setComponentToRender(<FirstWelcome />);
        }
        break;
      default:
        setComponentToRender(<div>Cá nhân</div>);
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

  return (
    <Page
      hideScrollbar={false}
      style={{ height: "100vh", overflow: "hidden" }}
      restoreScroll={true}
    >
      {/* {handleScreenByTab(screen)} */}
      {componentToRender}
      {/* <BottomNavigationPage
        actionTab={(data: string) => setScreen(data)}
      ></BottomNavigationPage> */}
    </Page>
  );
};

export default HomePage;
