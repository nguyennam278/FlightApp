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
import { followOA, getUserInfo } from "zmp-sdk/apis";
import "./welcome.css";
import {
  phoneNumberUser,
  infoUser,
  checkURLLink,
} from "../../recoil/RecoilState";
import { isEmpty } from "../../Common/utility";
import { useLocation, useParams } from "react-router-dom";
import dfData from "../../Common/DefaultConfig.json";
import api from "../../Common/api";

import { useRecoilState } from "recoil";

export default function Welcome() {
  const [phoneNumber, setPhoneNumber] = useRecoilState(phoneNumberUser);
  const [userZalo, setUserZalo] = useRecoilState(infoUser);
  const [eventCode, setEventCode] = useState("");
  const [store, setStore] = useState("");
  const [errMess, setErrMess] = useState("");
  const [isShow, setIsShow] = useState({
    status: false,
    message: "",
  });
  const [checkUseLink, setCheckUseLink] = useRecoilState(checkURLLink);
  const [dataWheel, setDataWheel] = useState({});
  const navigate = useNavigate();
  let { campainCode } = useParams();
  const location = useLocation();
  const { OtpGroup, Option } = Select;

  useEffect(() => {
    if (checkUseLink.isLink) {
      navigate("/first_welcome");
    } else {
      setDataWheel({ ...location.state });
      console.log("userZalo: ", userZalo);
      if (userZalo?.followedOA == false) {
        follow();
      }
    }
  }, [location.state, checkUseLink]);

  const validate = () => {
    setErrMess("");
    if (!store) {
      setErrMess("Vui lòng chọn vị trí siêu thị mua hàng");
      return false;
    }
    if (!eventCode) {
      setErrMess("Vui lòng nhập mã hóa đơn để tham gia");
      return false;
    }
    if (phoneNumber == "") {
      setIsShow({
        ...isShow,
        status: true,
        message:
          "Bạn vui lòng cho phép truy cập số điện thoại để tham gia chương trình",
      });
      return false;
    }
    return true;
  };

  const admit = async () => {
    let checkValidate = validate();
    if (checkValidate) {
      const dataPost = {
        CampaignCode: campainCode,
        SpinCode: eventCode,
        PhoneNumber: phoneNumber,
        Location: store,
        UserNameZalo: userZalo.name,
        UserZaloId: userZalo.id,
      };
      api.post("LuckyWheelApi/CheckSpinCode", dataPost).then((res) => {
        console.log("rs: ", res);
        if (res.Code == 1) {
          navigate(`/luckywheel/${campainCode}`, {
            state: dataPost,
          });
        } else {
          setErrMess(res.Message);
        }
      });
    }
  };

  const follow = async () => {
    try {
      followOA({
        id: dfData.oaId,
        success: async (res) => {
          await getUser();
        },
        fail: (err) => {},
      });
    } catch (error) {}
  };

  const getUser = async () => {
    try {
      const { userInfo } = await getUserInfo({});
      userInfo.followedOA == true;

      setUserZalo({ ...userInfo });
    } catch (error) {
      // xử lý khi gọi api thất bại
    }
  };

  return (
    <Page
      hideScrollbar={true}
      className="welcome-container"
      style={{
        height: "95vh",
        backgroundColor: "#fff",
        backgroundSize: "cover",
        backgroundImage: dataWheel?.backgroundImage
          ? `url(${dataWheel?.backgroundImage})`
          : `url(${dfData.url}/images/winmart/new_bg_more_tet.png)`,
      }}
    >
      <Box className="container">
        <Box
          className="divCenter"
          style={{
            backgroundSize: "cover",
            backgroundImage: `url(${dfData.url}/images/winmart/new_frame1.png)`,
            padding: 16,
            height: "140px",
            marginTop: "8vh",
          }}
        >
          <text
            style={{
              width: "100%",
              textAlign: "center",
              color: "white",
              fontSize: 22,
              fontFamily: "Inter, sans-serif",
              fontWeight: "700",
              wordWrap: "break-word",
              lineHeight: "30px",
            }}
          >
            Quý khách vui lòng điền đúng mã hóa đơn để làm căn cứ nhận giải nhé
            !
          </text>
        </Box>

        <Box
          className="input-info"
          style={{
            backgroundSize: "cover",
            backgroundImage: `url(${dfData.url}/images/winmart/new_frame2.png)`,
          }}
        >
          <Box mt={6}>
            {" "}
            <Select
              className="stylePlaceHolder"
              placeholder="Vị trí siêu thị mua hàng"
              onChange={(value) => setStore(value)}
              closeOnSelect={true}
            >
              <OtpGroup label="Chọn vị trí">
                <Option value="hanoi" title="Hà Nội" />
                <Option value="hcm" title="Thành phố Hồ Chí Minh" />
                <Option value="ctmb" title="Các tỉnh miền Bắc (Trừ Hà Nội)" />
                <Option value="ctmt" title="Các tỉnh miền Trung" />
                <Option
                  value="ctmn"
                  title="Các tỉnh miền Nam (Trừ Hồ Chí Minh)"
                />
              </OtpGroup>
            </Select>
          </Box>

          <Box mt={6}>
            {" "}
            <Input
              className="stylePlaceHolder"
              placeholder="Mã hóa đơn"
              value={eventCode}
              onChange={(event) => {
                const value = event.target.value.replace(/[^0-9]/g, "");
                if (value.length <= 15) {
                  setEventCode(value);
                }
              }}
            />
          </Box>
          {/* <Box mt={6}>
            {" "}
            <Input
              value={phoneNumber}
              style={{ color: "green" }}
              readOnly="true"
            />
          </Box> */}

          <p style={{ fontSize: 18, fontWeight: 700, color: "#FFCF23" }}>
            {errMess ? errMess : ""}
          </p>
          <Box mt={6} className="divCenter" flexDirection={"row"}>
            <Button
              className="button-back"
              onClick={() => navigate("/campain")}
            >
              Hủy
            </Button>
            <Button className="button-agree" onClick={admit}>
              Đồng ý
            </Button>
          </Box>
        </Box>
      </Box>
    </Page>
  );
}
