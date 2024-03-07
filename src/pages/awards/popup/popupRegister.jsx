import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Page,
  Box,
  Text,
  Modal,
  Button,
  Input,
  ImageViewer,
  Icon,
} from "zmp-ui";
import dfData from "../../../Common/DefaultConfig.json";
import api from "../../../Common/api";
import {
  getAccessToken,
  getPhoneNumber,
  getUserInfo,
  showToast,
} from "zmp-sdk/apis";

import { phoneNumberUser } from "../../../recoil/RecoilState";
import { useRecoilState } from "recoil";

const PopupRegister = forwardRef((props, ref) => {
  const [popupRegister, setPopupRegister] = useState(false);
  const [phoneNumber, setPhoneNumber] = useRecoilState(phoneNumberUser);
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [infoUser, setInfoUser] = useState("");
  const [fullname, setFullname] = useState("");
  const [errMess, setErrMess] = useState("");

  const open = () => {
    getUser();
    getPhoneUser();
    setPopupRegister(true);
  };

  useImperativeHandle(ref, () => ({
    open,
  }));

  const getUser = async () => {
    try {
      const { userInfo } = await getUserInfo({});
      setFullname(userInfo.name);
      setInfoUser(userInfo);
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
            .then((res) => setPhoneNumber(res.data.number))
            .catch((err) => console.log(err));
        },
        fail: (error) => {
          console.log(error);
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  const openToast = async (text) => {
    try {
      const data = await showToast({
        message: text,
      });
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };

  const handleSubmit = () => {
    setErrMess("");
    let obj = {
      seminarId: props.seminarId,
      fullName: fullname,
      phoneNumber: phoneNumber,
      email: email,
      company: company,
      position: position,
      avatar: infoUser.avatar,
    };
    let check = validateRegister();
    if (check == true) {
      api.post("/SeminarApi/RegisterSeminar", obj).then((res) => {
        setPopupRegister(false);
        setEmail("");
        setCompany("");
        setInfoUser("");
        setPosition("");
      });
      openToast("Đăng ký thành công!!!");
      close();
    }
  };
  const validateRegister = () => {
    const emailRegex = RegExp(
      /^[\w-_+]+([.-]?[\w-_+]+)*@[\w-_+]+([.-]?[\w-_+]+)*(\.[\w-_+]{2,})+$/,
    );

    if (!fullname) {
      setErrMess("Vui lòng nhập họ tên!!");
      return false;
    }

    if (!phoneNumber) {
      setErrMess("Vui lòng nhập số điện thoại!!");
      return false;
    }

    if (!email) {
      setErrMess("Vui lòng nhập địa chỉ email!!");
      return false;
    }

    if (!emailRegex.test(email)) {
      setErrMess("Vui lòng nhập đúng định dạng email!!!");
      return false;
    }
    if (!company) {
      setErrMess("Vui lòng nhập công ty đang làm việc!!");
      return false;
    }

    if (!position) {
      setErrMess("Vui lòng nhập chức vụ ở công ty!!");
      return false;
    }

    return true;
  };

  return (
    <>
      <Modal
        maskClosable={false}
        mask={true}
        visible={popupRegister}
        title={
          <Icon
            style={{ color: "#000000", float: "right" }}
            icon="zi-close-circle"
            onClick={() => {
              setPopupRegister(false);
            }}
          />
        }
        height="90vh"
        mask="true"
        maskClosable="false"
        onClose={() => {
          setPopupRegister(false);
        }}
      >
        <Box textAlign="center" p={2}>
          <b>Đăng ký</b>
        </Box>

        <Box mt={3}>
          <Box mt={3}>
            <Input
              label={<b>Tên:</b>}
              value={fullname}
              onChange={(e) => {
                setFullname(e.target.value);
              }}
            />
          </Box>
          <Box mt={3}>
            <Input
              label={<b>Số điện thoại</b>}
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
            />
          </Box>
          <Box mt={3}>
            <Input
              label={<b>Email</b>}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </Box>
          <Box mt={3}>
            <Input
              label={<b>Công ty</b>}
              value={company}
              onChange={(e) => {
                setCompany(e.target.value);
              }}
            />
          </Box>
          <Box mt={3}>
            <Input
              label={<b>Chức vụ</b>}
              value={position}
              onChange={(e) => {
                setPosition(e.target.value);
              }}
            />
          </Box>
          <Box mt={4}>
            <span style={{ color: "red", fontWeight: 700 }}>
              {errMess ? errMess : ""}
            </span>
          </Box>
          <Box mt={5} style={{ paddingBottom: 10, marginBottom: 10 }}>
            <Button fullWidth onClick={handleSubmit}>
              Đăng ký
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
});

export default PopupRegister;
