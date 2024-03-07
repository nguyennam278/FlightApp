import React, { useState, useEffect } from "react";
import { List, Icon, Box, Button, Text, Page } from "zmp-ui";
import { openWebview, openChat, getSetting, showToast } from "zmp-sdk/apis";
import api from "../../Common/api";
import { useNavigate } from "react-router";
import { useRecoilState } from "recoil";
import { getUserZalo, getPhoneUserZalo } from "../../Common/ApiZaloCommon";
import { Icon as IconIfy } from "@iconify/react";
import {
  phoneNumberUser,
  infoUser,
  checkURLLink,
} from "../../recoil/RecoilState";
import { isEmpty } from "../../Common/utility";
import "./home.css";
import SwiperEvent from "./swiperEvent";
import SwiperSurvey from "./swiperSurvey";
import SwiperBlog from "./SwiperBlog";
import useSetHeader from "../../components/hooks/useSetHeader";
import ContainBooking from "../containBooking";
const { Item } = List;
export default function HomeDemo() {
  const navigate = useNavigate();
  const setHeader = useSetHeader();
  const [phoneNumber, setPhoneNumber] = useRecoilState(phoneNumberUser);
  const [userZalo, setUserZalo] = useRecoilState(infoUser);
  const [listPost, setListPost] = useState([]);
  const [listAll, setListAll] = useState({});
  const [listDemo, setListDemo] = useState([
    {
      key: 1,
      title: "Tin tức",
      navigate: "/post",
    },
    {
      key: 2,
      title: "Khảo sát",
      navigate: "/survey",
    },
    {
      key: 3,
      title: "Sự kiện",
      navigate: "/event",
    },
    // {
    //   key: 4,
    //   title: "Tra cứu",
    //   navigate: "/contact",
    // },
    {
      key: 5,
      title: "Vòng quay may mắn",
      navigate: "/firstWelcome",
    },
    // {
    //   key: 6,
    //   title: "Member ship",
    //   navigate: "/post",
    // },
  ]);

  useEffect(() => {
    setHeader({
      customTitle: true,
      hasLeftIcon: false,
      type: "secondary",
    });
    getList();
    getListPostCondition();
  }, []);

  const getListPostCondition = () => {
    api
      .post("PostApp/GetListPostAppByCondition", {})
      .then((res) => {
        if (res.code === 1) {
          setListPost([...res.list.slice(0, 5)]);
        }
      })
      .catch((err) => {});
  };

  const getList = () => {
    api.get(`/HomePageApi/GetListHomePage?itemCount=5&page=1`).then((res) => {
      setListAll({ ...res.data });
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

  return (
    <Page className="section-container" hideScrollbar={true}>
      <Box className="home-booking">
        <Box className="ticket">
          <div>
            <img
              style={{ width: 80, height: 80 }}
              src="https://www.jotform.com/uploads/SofieFrank/form_files/flight-ticket.620609faa7e2b9.73277468.png"
            />
          </div>

          <div style={{ fontSize: 20, paddingBottom: "2%", paddingTop: "3%" }}>
            <b>High Flights</b>
          </div>
          <div>Easiest way to reserve your flights.</div>
        </Box>

        <Box className="needFlight">
          <div>Need a flight</div>
          <div
            style={{
              fontSize: 20,
            }}
          >
            <h2 style={{ marginLeft: "15%" }}>HIGH</h2>
            <h2>FLIGHTS</h2>
          </div>

          <div style={{ marginBottom: "2%" }}>
            Always have a ticket reserved for you
          </div>
          <i className="fa-solid fa-plane"></i>

          <Box style={{ padding: 8 }}>
            {" "}
            <Button
              onClick={() => navigate("/contain_booking")}
              style={{ background: "#333" }}
              fullWidth
            >
              Start Your Journey
            </Button>
          </Box>
        </Box>
      </Box>
    </Page>
  );
}
