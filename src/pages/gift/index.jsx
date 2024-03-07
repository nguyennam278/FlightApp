import React, { useState, useEffect } from "react";
import { List, Icon, Page, Box, Button, Text, Input, DatePicker } from "zmp-ui";

import {
  getAccessToken,
  getPhoneNumber,
  getUserInfo,
  openChat,
} from "zmp-sdk/apis";
import { phoneNumberUser } from "../../recoil/RecoilState";

import dfData from "../../Common/DefaultConfig.json";
import api from "../../Common/api";
import "./gift.css";
import moment from "moment";
import { useRecoilState } from "recoil";
import { actionTab } from "../../recoil/RecoilState";
export default function Gift() {
  const [phoneNumber, setPhoneNumber] = useRecoilState(phoneNumberUser);
  const [fullname, setFullname] = useState("");
  const [errMess, setErrMess] = useState("");
  const [cccd, setCccd] = useState("");
  const [birthday, setBirthday] = useState("");

  const [step, setStep] = useState(1);

  useEffect(() => {
    getUser();
    getPhoneUser();
  }, []);

  useEffect(() => {
    stepper();
  }, [step]);
  const stepper = () => {
    const step2 = document.getElementById("step2");
    const step3 = document.getElementById("step3");

    if (step === 2) {
      step2.classList.add("active");
    }
    if (step === 3) {
      step3.classList.add("active");
    }
  };
  const getUser = async () => {
    try {
      const { userInfo } = await getUserInfo({});

      setFullname(userInfo.name);
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };
  const getPhoneUser = async () => {
    try {
      const accessToken = await getAccessToken({});
      getPhoneNumber({
        success: async (data) => {
          let { token } = data;
          api
            .post("ZaloHelperApi/GetPhoneNumber", {
              accessToken: accessToken,
              tokenNumber: token,
              secretKey: dfData.secretKey,
            })
            .then((res) => {
              console.log(res.data.number);
              setPhoneNumber(res.data.number);
            })
            .catch((err) => console.log("Err:", err));
        },
        fail: (error) => {
          console.log(error);
        },
      });
    } catch (error) {
      console.log(error);
    }
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

  const validateInfoUser = () => {
    if (!fullname) {
      setErrMess("Vui lòng nhập họ tên!!!");
      return false;
    }

    if (!phoneNumber) {
      setErrMess("Vui lòng nhập số điện thoại!!!");
      return false;
    }
    if (!cccd) {
      setErrMess("Vui lòng nhập số căn cước công dân!!!");
      return false;
    }

    if (!birthday) {
      setErrMess("Vui lòng nhập ngày sinh!!!");
      return false;
    }

    return true;
  };

  const nextStep = () => {
    let check = validateInfoUser();
    if (check == true) {
      setStep(3);
    }
  };
  const showViewByStep = (step) => {
    if (step == 1) {
      return (
        <div>
          <div className="thongbao">
            <div className="chucmung">Chúc mừng bạn đã đạt giải </div>
            <div>Hình ảnh</div>
          </div>
          <div className="button-nhangiai">
            <Button fullWidth id="next1" onClick={() => setStep(2)}>
              Nhập thông tin nhận giải thưởng
            </Button>
          </div>
        </div>
      );
    } else if (step == 2) {
      return (
        <div>
          <div className="thongbao">
            <Text.Title
              style={{
                marginTop: 10,
                marginBottom: 10,
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              Vui lòng hoàn tất thông tin nhận giải
            </Text.Title>
            <Input
              label="Họ tên"
              value={fullname}
              onChange={(event) => setFullname(event.target.value)}
            />
            <Input
              label="Số điện thoại"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
            />
            <Input
              label="Số căn cước công dân"
              value={cccd}
              onChange={(event) => setCccd(event.target.value)}
            />
            <DatePicker
              mask
              maskClosable
              label="Ngày sinh"
              dateFormat="dd/mm/yyyy"
              title="Ngày sinh"
              onChange={(value) => {
                setBirthday(moment(value).format());
              }}
            />
          </div>
          <div className="errMessage">{errMess ? errMess : ""}</div>
          <div className="button-xacnhan">
            <Button fullWidth onClick={() => nextStep()}>
              Xác nhận
            </Button>
          </div>
        </div>
      );
    } else if (step === 3) {
      return (
        <div>
          <div className="huongdan">
            <Text.Title>Hướng dẫn nhắn tin với OA WinMart:</Text.Title>
            <div>Bước 1:</div>
            <div>Bước 2:</div>
            <div>Bước 3:</div>
            <div>Bước 4:</div>
          </div>
          <div className="button-nhantin">
            <Button fullWidth onClick={() => openChatScreen()}>
              Nhắn tin với OA WinMart
            </Button>
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  };

  return (
    <Page hideScrollbar={true} className="section-container page">
      <div className="container">
        <div className="steps">
          <span className="circle active" id="step1">
            1
          </span>
          <span className="circle" id="step2">
            2
          </span>
          <span className="circle" id="step3">
            3
          </span>
          <div className="progress-bar">
            <span className="indicator"></span>
          </div>
        </div>
      </div>
      <Box> {showViewByStep(step)}</Box>
    </Page>
  );
}
