import React, { useState, useEffect } from "react";
import { List, Icon, Box, Button, Text, Avatar, Page } from "zmp-ui";
import { openWebview, openChat, followOA, showToast } from "zmp-sdk/apis";
import api from "../../Common/api";
import { useRecoilState } from "recoil";
import { listBlog } from "../../recoil/RecoilState";
import { handleLogin } from "../../Common/token";
import useSetHeader from "../../components/hooks/useSetHeader";

import ItemPost from "./ItemPost";

const { Item } = List;
export default function Post() {
  const [listPost, setListPost] = useRecoilState(listBlog);
  const setHeader = useSetHeader();

  useEffect(() => {
    setHeader({
      hasLeftIcon: true,
      type: "secondary",
      title: "Blog",
      customTitle: false,
    });
  }, []);

  useEffect(() => {
    getListPostCondition();
    //follow();
  }, [listPost]);

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
        var promise = new Promise((resolve, reject) => {
          resolve(handleLogin());
        });
        promise
          .then(function (message) {
            //getListPostCondition();
          })
          .catch(function (message) {
            console.log(message);
          });
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
    const url = "https://saigon.incom.vn/";
    openWebview({
      url: url,
      success: (res) => {},
      fail: (error) => {
        console.log(error);
      },
    });
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
      style={{ backgroundColor: "#fff" }}
    >
      <Item
        title={<Text size="xLarge">Trò chuyện với chúng tôi</Text>}
        prefix={
          <Avatar
            size={36}
            src="https://saigon.incom.vn/wp-content/themes/hd/assets/images/logo.png"
          />
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
          src={
            "https://saigon.incom.vn/wp-content/uploads/2020/04/banner-home-01-1536x539.jpg"
          }
          alt={"img_logo"}
        />
      </Box>

      <Text
        size="xLarge"
        style={{
          fontWeight: 700,
          marginTop: 8,
          marginBottom: 8,
        }}
        onClick={() => navigate(-1)}
      >
        Tin tức
      </Text>
      <List>{renderListItem()}</List>
    </Page>
  );
}
