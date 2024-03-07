import React, { useState, useEffect } from "react";
import { List, Icon, Box, Button, Text, Avatar, Page } from "zmp-ui";
import {
  openWebview,
  openChat,
  followOA,
  showToast,
  clearStorage,
} from "zmp-sdk/apis";
import ItemPost from "../post/ItemPost";
import api from "../../Common/api";
import { useRecoilState } from "recoil";
import { listBlog } from "../../recoil/RecoilState";
import { handleLogin } from "../../Common/token";
import dfData from "../../Common/DefaultConfig.json";
const { Item } = List;
export default function HomeWCM() {
  const [listPost, setListPost] = useRecoilState(listBlog);

  useEffect(() => {
    getListPostCondition();
  }, []);

  const getListPostCondition = () => {
    api
      .post("PostApp/GetListPostAppByCondition", {})
      .then((res) => {
        if (res.code === 1) {
          if (listPost.length != res.list.length) {
            setListPost([...res.list]);
          }
        }
      })
      .catch((err) => {
        // var promise = new Promise((resolve, reject) => {
        //   resolve(handleLogin());
        // });
        // promise
        //   .then(function (message) {
        //     getListPostCondition();
        //   })
        //   .catch(function (message) {
        //     console.log(message);
        //   });
      });
  };

  const openChatScreen = () => {
    openChat({
      type: "oa",
      id: dfData.oaId,
      message: "Xin Chào",
      success: () => {},
      fail: (err) => {},
    });
  };

  const follow = async () => {
    try {
      rs = await followOA({
        id: dfData.oaId,
      });
      const data = await showToast({
        message: "Cảm ơn bạn đã quan tâm",
      });
    } catch (error) {}
  };

  const openUrlInWebview = () => {
    // const url = "https://saigon.incom.vn/";
    // openWebview({
    //   url: url,
    //   success: (res) => {},
    //   fail: (error) => {
    //     console.log(error);
    //   },
    // });
  };

  const renderListItem = () => {
    if (listPost.length > 0) {
      return (
        <div>
          {listPost.map((item, index) => {
            return <ItemPost index={index} data={item}></ItemPost>;
          })}
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  return (
    <Page
      className="section-container"
      restoreScrollOnBack={true}
      hideScrollbar={true}
      style={{
        backgroundColor: "#fff",
        backgroundSize: "contain",
        backgroundImage: `url(${dfData.url}/images/winmart/background_redwhite.png)`,
      }}
    >
      <Item
        title={<Text size="xLarge">Trò chuyện với chúng tôi</Text>}
        prefix={
          <Avatar size={36} src={`${dfData.url}/images/winmart/winmart.jpg`} />
        }
        suffix={<Icon icon="zi-recall" />}
        onClick={() => {
          openChatScreen();
        }}
      />
      <Box>
        <img
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          role="presentation"
          onClick={() => {
            openUrlInWebview();
          }}
          src={`${dfData.url}/images/winmart/BannerMiniApp.jpg`}
          alt={"img_logo"}
        />
      </Box>

      <Text
        size="xLarge"
        style={{
          fontWeight: 700,
          marginTop: 8,
          marginBottom: 8,

          fontSize: 20,
        }}
        onClick={() => navigate(-1)}
      >
        Tin tức
      </Text>
      <List>{renderListItem()}</List>
    </Page>
  );
}
