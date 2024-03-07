import React, { useState, useEffect } from "react";
import {
  Page,
  Box,
  Text,
  Modal,
  Button,
  Icon,
  useNavigate,
  Input,
  DatePicker,
} from "zmp-ui";
import "./luckywheel.css";
import dfData from "../../Common/DefaultConfig.json";
import api from "../../Common/api";
import { isEmpty } from "../../Common/utility";
import { useLocation, useParams } from "react-router-dom";
import WheelGift from "./WheelGift";
import WheelVoucher from "./WheelVoucher";

const LuckeyWheel = () => {
  const [dataWheel, setDataWheel] = useState({});
  const [isShow, setIsShow] = useState({
    status: false,
    message: "",
  });
  const [dataPost, setDataPost] = useState({});

  const segments = ["GT1", "GT2", "GT3", "GT4", "GT5", "GT6"];
  let { campainCode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setDataPost({ ...location.state });
  }, [location.state]);

  useEffect(() => {
    if (campainCode != undefined) {
      handleDataWheel(campainCode);
    }
  }, [campainCode]);

  useEffect(() => {
    if (!isEmpty(dataWheel)) {
      if (dataWheel.data.categoryCampaignId != 1 && !dataPost?.SpinCode) {
        navigate(`/welcomeWheelGift/${campainCode}`, {
          state: dataWheel.data,
        });
      }
    }
  }, [dataWheel]);

  const handleDataWheel = (campainCode) => {
    //Chỗ này để viết api
    api
      .post("LuckyWheelApi/CheckCampaign", {
        CampaignCode: campainCode,
      })
      .then((res) => {
        var obj = {
          data: res.Data,
          listAward: segments,
          listColor: ["#F9A928", "#FF3535"],
          isSpin: res.Data.isActive,
          content: res.Data.campaignDesc,
          listPrize: res.ListPrize,
        };
        setDataWheel({ ...obj });
        console.log("res: ", res);
        if (res.Code !== 1) {
          setIsShow({ ...isShow, status: true, message: res.Message });
        }
      })
      .catch((err) => {});
  };

  return (
    <div>
      {!isEmpty(dataWheel) && (
        <>
          {dataWheel?.data.categoryCampaignId == 1 ? (
            <WheelVoucher campain={dataWheel}></WheelVoucher>
          ) : (
            <>
              {!isEmpty(dataPost) && (
                <WheelGift campain={dataWheel} dataPost={dataPost}></WheelGift>
              )}
            </>
          )}
        </>
      )}
      <Modal
        modalClassName="test"
        visible={isShow.status}
        onClose={() => {
          setIsShow({ ...isShow, status: false });
        }}
      >
        <Box>
          <Box flex justifyContent={"center"}>
            <img
              style={{ width: "70%", height: "40%" }}
              src={`${dfData.url}/images/winmart/icon_bag_happy2.png`}
            />
          </Box>

          <Box style={{ margin: 15 }}>{isShow.message}</Box>
        </Box>
      </Modal>
    </div>
  );
};

export default LuckeyWheel;
