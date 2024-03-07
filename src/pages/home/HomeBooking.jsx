import React, { useState, useEffect } from "react";
import { List, Page, Box, Text, Avatar } from "zmp-ui";
import { getUserInfo, openChat, openWebview } from "zmp-sdk/apis";
import { useNavigate } from "zmp-ui";
import api from "../../Common/api";
import dfData from "../../Common/DefaultConfig.json";
import { useRecoilState } from "recoil";

import { actionTab } from "../../recoil/RecoilState";
import "./home.css";
import SwiperEvent from "./swiperEvent";
import SwiperSurvey from "./swiperSurvey";
import SwiperAward from "./swiperAward";
export default function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [activeTab, setActiveTab] = useRecoilState(actionTab);
  const [listAll, setListAll] = useState({});
  const { Item } = List;
  useEffect(() => {
    getUser();

  }, []);

  const getList = () => {

  const openChatScreen = async () => {
    try {
      await openChat({
        type: "oa",
        id: dfData.oaId,
        message: "Xin Chào",
      });
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };
  const openUrlInWebview = async () => {
    // try {
    //   await openWebview({
    //     url: "https://www.idgcapitalvietnam.com/",
    //     config: {
    //       style: "bottomSheet",
    //       leftButton: "back",
    //     },
    //   });
    // } catch (error) {
    //   // xử lý khi gọi api thất bại
    //   console.log(error);
    // }
  };
  const getUser = async () => {
    try {
      const { userInfo } = await getUserInfo({});
      setUsername(userInfo);
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };

  return (
    <Page
      hideScrollbar={true}
      className="section-container"
      style={{ paddingBottom: 50 }}
    >
      {/* <Box
        style={{
          width: "95vw",
          height: 120,
          marginBottom: 10,
        }}
      >
        <img
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          role="presentation"
          onClick={() => {
            openUrlInWebview();
          }}
          src="data:image/jpeg;base64,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"
          alt={"img_logo"}
        />
      </Box> */}

      {/* {listAll.listSeminar?.length > 0 && (
        <Box>
          <Box>
            <Text
              size="xLarge"
              style={{
                fontWeight: 700,
                margin: 10,
                float: "left",
                fontSize: 25,
              }}
            >
              Sự kiện
            </Text>

            <Text
              size="xLarge"
              style={{
                fontWeight: 500,
                margin: 10,
                float: "right",
                fontSize: 14,
              }}
              onClick={() => setActiveTab("event")}
            >
              Tất cả
            </Text>
          </Box>

          <Box>
            <SwiperEvent listEvent={listAll.listSeminar} />
          </Box>
        </Box>
      )} */}

      {/* {listAll.listAward?.length > 0 && (
        <Box>
          <Box style={{ marginTop: "5%" }}>
            <Text
              size="xLarge"
              style={{
                fontWeight: 700,
                marginTop: 10,
                float: "left",
                fontSize: 25,
              }}
            >
              Giải thưởng
            </Text>

            <Text
              size="xLarge"
              style={{
                fontWeight: 500,
                margin: 10,
                float: "right",
                fontSize: 14,
              }}
              onClick={() => setActiveTab("award")}
            >
              Tất cả
            </Text>
          </Box>
          <Box>
            <SwiperAward listAward={listAll.listAward} />
          </Box>
        </Box>
      )} */}

      <Box style={{ marginTop: "5%", marginBottom: "5%" }}>
        <Text
          size="xLarge"
          style={{
            fontWeight: 700,
            float: "left",
            fontSize: 25,
          }}
        >
          Khảo sát
        </Text>
        <Text
          size="xLarge"
          style={{
            fontWeight: 500,
            margin: 10,
            float: "right",
            fontSize: 14,
          }}
          onClick={() => setActiveTab("survey")}
        >
          Tất cả
        </Text>
        <Box>
          <SwiperSurvey listSurvey={listAll.listSurvey} />
        </Box>
      </Box>
    </Page>
  );
}
