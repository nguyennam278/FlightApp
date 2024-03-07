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
import {
  followOA,
  openChat,
  openProfile,
  getUserInfo,
  showToast,
  saveImageToGallery,
} from "zmp-sdk/apis";
import WheelComponent from "./wheel";
import { useRecoilState } from "recoil";
import { Spin } from "antd";
import "./luckywheel.css";
import dfData from "../../Common/DefaultConfig.json";
import { phoneNumberUser, infoUser } from "../../recoil/RecoilState";
import api from "../../Common/api";
import { isEmpty } from "../../Common/utility";
import { useLocation, useParams } from "react-router-dom";
import moment from "moment";

const WheelVoucher = (props) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [award, setAward] = useState({});
  const [dataVoucher, setDataVoucher] = useState({});
  const [dataWheel, setDataWheel] = useState({});
  const [isShowRule, setIsShowRule] = useState(false);
  const [phoneNumber, setPhoneNumber] = useRecoilState(phoneNumberUser);
  const [userZalo, setUserZalo] = useRecoilState(infoUser);
  const [showStatus, setShowStatus] = useState({
    isShow: false,
    message: "",
  });

  const [dataCustomer, setDataCutomer] = useState({
    historySpinId: "",
    phonenumber: "",
    cid: "",
    buyTime: moment().format(),
    FullName: "",
  });

  const [errMess, setErrMess] = useState({
    errFullName: "",
    errPhoneNumber: "",
    errCccd: "",
    errDate: "",
  });
  const [dataPost, setDataPost] = useState({});
  const [confirmPopUp, setConfirmPopup] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSpinAllow, setIsSpinAllow] = useState(true);
  const percent = [0.0, 0.0, 1, 0.0, 0.0, 0.0, 0.0, 0.0];

  useEffect(() => {
    var obj = {
      CampaignCode: props.campain.data.campaignCode,
      SpinCode: generateRandomString(),
      PhoneNumber: phoneNumber,
      Location: "hcm",
      UserNameZalo: userZalo.name,
      UserZaloId: userZalo.id,
    };
    setDataCutomer({
      ...dataCustomer,
      FullName: userZalo.name,
      phonenumber: phoneNumber,
    });
    setDataPost({ ...obj });
    setDataWheel({ ...props.campain });
    console.log(props.campain.listAward);
    if (userZalo?.followedOA == false) {
      follow();
    }
  }, [props.campain, userZalo]);

  useEffect(() => {
    if (!isEmpty(dataPost)) {
      checkSpin();
    }
  }, [dataPost]);

  useEffect(() => {
    stepper();
  }, [step]);

  const saveImage = (src) => {
    saveImageToGallery({
      imageUrl: src,
      success: (res) => {
        showToast({
          message: "Lưu ảnh thành công",
          success: (data) => {},
          fail: (error) => {},
        });
      },
      fail: (error) => {},
    });
  };

  const generateRandomString = () => {
    var result = "";
    var characters = "0123456789";
    var charactersLength = characters.length;

    for (var i = 0; i < 15; i++) {
      var randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters.charAt(randomIndex);
    }
    return result;
  };

  const checkSpin = async () => {
    api
      .post("LuckyWheelApi/CheckSpinCode", dataPost)
      .then((res) => {
        if (res.Code != 1) {
          setIsSpinAllow(false);
        }
      })
      .catch((error) => setIsSpinAllow(false));
  };

  const stepper = () => {
    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const step3 = document.getElementById("step3");
    const title1 = document.getElementById("title-step1");
    const title2 = document.getElementById("title-step2");
    const title3 = document.getElementById("title-step3");

    if (step === 2) {
      step2.classList.add("active");
      title2.style.color = "#FF0000";

      step1.classList.remove("active");
      title1.style.color = "#ddd";
      title3.style.color = "#ddd";
    }
    if (step === 3) {
      step3.classList.add("active");
      title3.style.color = "#FF0000";

      step2.classList.remove("active");
      title2.style.color = "#ddd";
      step1.classList.remove("active");
      title1.style.color = "#ddd";
    }
  };

  const validateInfoUser = () => {
    var check = true;
    var objErr = { ...errMess };
    if (dataCustomer.FullName == "") {
      objErr.errFullName = "Vui lòng nhập họ và tên";
      check = false;
    }
    if (dataCustomer.phoneNumber == "") {
      objErr.errPhoneNumber = "Vui lòng nhập số điện thoại";
      check = false;
    }
    if (dataCustomer.cid == "") {
      objErr.errCccd = "Vui lòng nhập số căn cước công dân";
      check = false;
    }
    // if (dataCustomer.buyTime == "") {
    //   objErr.errDate = "Vui lòng nhập ngày mua hoá đơn";
    //   check = false;
    // }
    setErrMess({ ...objErr });
    return check;
  };

  const getVoucherWinning = () => {
    api
      .post("LuckyWheelApi/GetVoucherWinning", {
        CampaignCode: campain?.campaignCode,
        UserZaloId: userZalo.id,
      })
      .then((res) => {
        if (res.Code == 1) {
          setDataVoucher(res.Data);
        } else {
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const nextStep = () => {
    setConfirmPopup(false);
    setLoading(true);
    let check = validateInfoUser();
    if (check === true) {
      setErrMess({
        errFullName: "",
        errPhoneNumber: "",
        errCccd: "",
        errDate: "",
      });
      var dtPost = {
        historySpinId: award.HistorySpinId,
        phonenumber: phoneNumber,
        fullName: dataCustomer.FullName,
        cid: dataCustomer.cid,
        buyTime: moment(dataCustomer.buyTime).format(),
      };
      api
        .post("LuckyWheelApi/ConfirmInfoReward", dtPost)
        .then((res) => {
          if (res.Code == 1) {
            getVoucherWinning();
            setStep(3);
            setLoading(false);
          } else {
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  const getUser = async () => {
    try {
      const { userInfo } = await getUserInfo({});
      console.log("Success getUserInfo", userInfo);
      userInfo.followedOA == true;

      setUserZalo({ ...userInfo });
    } catch (error) {
      // xử lý khi gọi api thất bại
    }
  };
  const follow = async () => {
    try {
      followOA({
        id: dfData.oaId,
        success: async (res) => {
          console.log("SUCCESS FOLLOW", res);
          await getUser();
          //setUserZalo(...{ followedOA: true });
          setIsSpinAllow(true);
          setShowStatus({ ...showStatus, isShow: false });
          //resolve(false);
        },
        fail: (err) => {
          setIsSpinAllow(false);
          setShowStatus({
            ...showStatus,
            message:
              "Bạn vui lòng Quan tâm Zalo WinMart để tham gia chương trình nha!",
          });
        },
      });
    } catch (error) {}
  };

  const handleOpenProfile = async () => {
    try {
      await openProfile({
        type: "oa",
        id: dfData.oaId,
      });
    } catch (error) {}
  };

  const weelColors = (listData) => {
    let arr = [];
    let colors = ["#FF9D00", "#FF0009"];
    listData.forEach((el) => {
      let color = colors.shift();
      arr.push(color);
      colors.push(color);
    });

    return arr;
  };

  const onFinished = (gift) => {
    setIsSpinAllow(false);
    setShow(true);
  };

  const handleClickAwardRule = () => {
    navigate("/awardRules", {
      state: dataWheel?.content,
    });
  };

  const handleClickAwardLuckyWheel = () => {
    navigate("/awardLuckyWheel", {
      state: dataWheel?.listPrize,
    });
  };

  const handleClickHistoryLuckyWheel = () => {
    var dataState = { ...dataPost, content: dataWheel?.content };
    navigate("/historyLuckyWheel", {
      state: dataState,
    });
  };

  const handleClickSpin = () => {
    //Khúc chỗ này gọi api trả về
    setDataWheel({ ...dataWheel, isSpin: false });
    api
      .post("LuckyWheelApi/GetResultSpinVoucher", dataPost)
      .then((res) => {
        console.log("GetResultSpinVoucher res: ", res);
        var obj = { ...res.Data };
        obj.HistorySpinId = res.HistorySpinId;
        setAward({ ...obj });
        getVoucherWinning();
      })
      .catch((err) => {
        console.log("handleClickSpin err: ", err);
        var obj = {
          prizeId: 0,
        };
        setAward({ ...obj });
      });
  };

  return (
    <Page
      className="section-container"
      restoreScrollOnBack={true}
      hideScrollbar={true}
      style={{
        backgroundColor: "#fff",
        backgroundSize: "cover",
        backgroundImage: dataWheel?.data?.backgroundImage
          ? `url(${dataWheel?.data?.backgroundImage})`
          : `url(${dfData.url}/images/winmart/wheel_background_new3.png)`,
      }}
    >
      <div className="divCenter">
        <img
          style={{
            marginTop: "5vh",
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
          src={
            dataWheel?.data?.bannerImage
              ? dataWheel?.data?.bannerImage
              : `${dfData.url}/images/winmart/wheel_text3.png`
          }
        />
      </div>
      <div>
        {dataWheel?.listAward?.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <WheelComponent
              segments={dataWheel?.listAward}
              segColors={weelColors(dataWheel?.listAward)}
              winningSegment={"GT3"}
              onFinished={(winner) => onFinished(winner)}
              primaryColor="#CFFFD7"
              contrastColor="#8A2100"
              needleColor="#fff"
              buttonText="Quay"
              imageGift={`${dfData.url}/images/winmart/1.png`}
              imageSniper={`${dfData.url}/images/winmart/test_spinner_2.png`}
              petesdalImage={`${dfData.url}/images/winmart/wheel_pedestal.png`}
              alertSpin={() => {
                if (userZalo?.followedOA == true) {
                  setShowStatus({
                    ...showStatus,
                    isShow: true,
                    message:
                      "Bạn đã hết lượt quay rồi!\nHẹn gặp bạn ở các chương trình sau nha!",
                  });
                } else {
                  setShowStatus({
                    ...showStatus,
                    isShow: true,
                    message:
                      "Bạn vui lòng Quan tâm Zalo Incom để tham gia chương trình nha!",
                  });
                }
              }}
              isSpinAllow={isSpinAllow}
              listPercent={percent}
              timeUp={5000}
              onClickSpin={() => {
                handleClickSpin();
              }}
            />
          </div>
        )}
      </div>
      <Box style={{ width: "100%", marginTop: -23 }}>
        <Button
          size={"small"}
          fullWidth={true}
          style={{
            borderRadius: 10,
            height: 40,
            border: "1px solid #F7E3A1",
            backgroundColor: "#E92225",
          }}
          className="divCenter"
          onClick={() => {
            handleClickAwardRule();
          }}
        >
          <Text style={{ fontSize: 20, textAlign: "center", fontWeight: 700 }}>
            Thể Lệ Chương Trình
          </Text>
        </Button>
      </Box>
      <Box style={{ display: "flex", marginBottom: 0 }}>
        <Box style={{ width: "100%" }}>
          <Button
            size={"small"}
            fullWidth={true}
            style={{
              borderRadius: 10,
              height: 40,
              border: "1px solid #F7E3A1",
              backgroundColor: "#E92225",
            }}
            className="divCenter"
            onClick={() => {
              handleClickHistoryLuckyWheel();
            }}
          >
            <Text
              style={{ fontSize: 20, textAlign: "center", fontWeight: 700 }}
            >
              Danh Sách Quà Tặng
            </Text>
          </Button>
        </Box>
      </Box>

      <Modal
        visible={show}
        title={
          <Box flex={true} justifyContent={"flex-end"} height={10}>
            <Icon
              style={{ color: "#E92225" }}
              icon="zi-close-circle"
              onClick={() => {
                setShow(false);
              }}
            />
          </Box>
        }
        height={award.prizeId == 0 ? "45%" : "95%"}
        width="95%"
        maskClosable={false}
        onClose={() => {
          setShow(false);
        }}
        style={{ overflowY: "hidden" }}
      >
        {award.prizeId == 0 ? (
          <div>
            <Box className="divCenter">
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: 700,
                  color: "#E92225",
                }}
              >
                {/* Thông báo */}
              </Text>
            </Box>
            <Box mt={2}>
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 400,
                  lineHeight: "30px",
                  color: "#000000",
                  textAlign: "center",
                }}
              >
                {" "}
                Chúc bạn may mắn lần sau!
              </p>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: 400,
                  lineHeight: "30px",
                  color: "#000000",
                }}
              >
                Xem thêm các ưu đãi cực khủng và chương trình hấp dẫn khác tại
                Incom nhé!
              </Text>
            </Box>
            <Box mt={3} className="divCenter">
              <Button
                size={"large"}
                style={{
                  borderRadius: 10,
                  height: 50,
                  backgroundColor: "#EC2027",
                  border: "1px solid #2A458A",
                  width: "70%",
                }}
                className="divCenter"
                onClick={() => {
                  //handleOpenProfile();
                  window.location.href =
                    "https://officialaccount.me/pc?type=article&pageId=300086756699856746&id=6dbc1e3e957b7c25256a";
                }}
              >
                <Text
                  style={{
                    fontSize: 24,
                    textAlign: "center",
                    fontWeight: 400,
                    color: "#FFFFFF",
                  }}
                >
                  Khám phá ngay
                </Text>
              </Button>
            </Box>
          </div>
        ) : (
          <Box
            flex={true}
            flexDirection={"column"}
            style={{
              flex: 1,
              height: "95%",
              overflowY: "hidden",
            }}
          >
            <Box style={{ marginBottom: 0 }}>
              <div className="steps">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <span className="circle active" id="step1">
                    1
                  </span>
                  <p style={{ color: "red", fontWeight: 600 }} id="title-step1">
                    Trúng giải
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <span className="circle" id="step2">
                    2
                  </span>
                  <p id="title-step2" style={{ fontWeight: 600 }}>
                    Điền thông tin
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <span className="circle" id="step3">
                    3
                  </span>
                  <p id="title-step3" style={{ fontWeight: 600 }}>
                    Quà tặng
                  </p>
                </div>
              </div>
            </Box>
            {step == 1 && (
              <Box>
                <Box
                  style={{
                    border: "1px solid #D34C00",
                    borderRadius: 10,
                    marginBottom: 10,
                  }}
                  flex={true}
                  flexDirection="column"
                  style={{
                    flex: 1,
                    overflow: "auto",
                  }}
                >
                  <Box>
                    <Box p={2} className="divCenter">
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: "#BA5014",
                        }}
                      >
                        {" "}
                        {award.prizeOrder}{" "}
                      </Text>
                    </Box>
                    <img
                      style={{
                        width: "100%",
                        height: "250px",
                        objectFit: "contain",
                      }}
                      role="presentation"
                      onClick={() => {
                        handleClick();
                      }}
                      src={award.prizeImage}
                      alt={"img_logo"}
                    />{" "}
                    <Box className={"divCenter"} style={{ marginTop: 8 }}>
                      <Text
                        style={{
                          fontSize: 22,
                          fontWeight: 700,
                          color: "#FF4949",
                        }}
                      >
                        {award.prizeName}
                      </Text>
                    </Box>
                  </Box>
                </Box>

                <Box style={{ height: 60, marginTop: 8 }}>
                  <Button
                    size={"large"}
                    fullWidth={true}
                    style={{
                      borderRadius: 10,
                      height: 50,
                      backgroundColor: "#EC2027",
                      border: "1px solid #D34C00",
                    }}
                    className="divCenter"
                    onClick={() => setStep(2)}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        textAlign: "center",
                        fontWeight: 700,
                        color: "#FFFFFF",
                      }}
                    >
                      Nhập thông tin nhận thưởng
                    </Text>
                  </Button>
                </Box>
              </Box>
            )}
            {step == 2 && (
              <Spin spinning={loading}>
                <Box className="divCenter" p={2}>
                  {" "}
                  <Text.Title
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#EC2027",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Vui lòng hoàn tất thông tin nhận giải
                  </Text.Title>
                </Box>
                <div
                  style={{
                    border: "1px solid #D34C00",
                    borderRadius: 10,
                    padding: "10px 12px",
                    height: 300,
                    overflowY: scroll,
                  }}
                >
                  <Input
                    label={<b>Họ và tên</b>}
                    value={dataCustomer?.FullName}
                    onChange={(event) =>
                      setDataCutomer({
                        ...dataCustomer,
                        FullName: event.target.value,
                      })
                    }
                  />
                  {errMess?.errFullName != "" && (
                    <p className="errMess">{errMess.errFullName}</p>
                  )}

                  <Input
                    label={<b>Số điện thoại</b>}
                    value={dataCustomer.phonenumber}
                    onChange={(event) => {
                      const value = event.target.value.replace(/[^0-9]/g, "");
                      if (value.length < 15) {
                        setDataCutomer({
                          ...dataCustomer,
                          phonenumber: value,
                        });
                      }
                    }}
                  />
                  {errMess?.errPhoneNumber != "" && (
                    <p className="errMess">{errMess.errPhoneNumber}</p>
                  )}

                  <Input
                    label={<b>Số CCCD</b>}
                    value={dataCustomer?.cid}
                    onChange={(event) => {
                      const value = event.target.value.replace(/[^0-9]/g, "");
                      if (value.length < 20) {
                        setDataCutomer({ ...dataCustomer, cid: value });
                      }
                    }}
                  />
                  {errMess?.errCccd != "" && (
                    <p className="errMess">{errMess.errCccd}</p>
                  )}

                  {/* <DatePicker
                    label="Ngày tháng năm mua hàng trong hóa đơn"
                    value={moment(dayOrder).toDate()}
                    endYear={2024}
                    dateFormat="dd/mm/yyyy"
                    onChange={(value) => {
                 setDataCutomer({...dataCustomer,buyTime: value});
                    }}
                    title="Ngày tháng năm mua hàng trong hóa đơn"
                  /> */}
                  {errMess?.errDate != "" && (
                    <p className="errMess">{errMess.errDate}</p>
                  )}
                </div>

                <Box style={{ height: 60, marginTop: 16 }}>
                  <Button
                    fullWidth
                    onClick={() => setConfirmPopup(true)}
                    style={{
                      borderRadius: 10,
                      backgroundColor: "#EC2027",
                      border: "1px solid #D34C00",
                    }}
                  >
                    <Text.Title
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#FFFFFF",
                      }}
                    >
                      Xác nhận
                    </Text.Title>
                  </Button>
                </Box>
              </Spin>
            )}
            {step == 3 && (
              <div>
                <div
                  className="huongdan"
                  style={{
                    border: "1px solid #D34C00",
                    borderRadius: 10,
                    padding: "5px 12px",
                    height: 320,
                    overflowY: "scroll",
                    overflowX: "hidden",
                  }}
                >
                  {/* <Text.Title
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#FFF",
                      textAlign: "center",
                    }}
                  >
                    Hướng dẫn nhắn tin với Zalo WCM
                  </Text.Title> */}
                  {/* <Box flexDirection={"column"}>
                    <p>
                      Bạn vui lòng gửi các thông tin sau đến Zalo WinMart trước{" "}
                      {moment(dataConfirm?.crDateTime)
                        .add(2, "days")
                        .format("HH:mm")}{" "}
                      ngày{" "}
                      {moment(dataConfirm?.crDateTime)
                        .add(2, "days")
                        .format("DD/MM/YYYY")}{" "}
                      để xác thực giải thưởng nhé: {dataConfirm?.prizeName};
                    </p>
                    <p>1. Họ và tên: {dataConfirm?.fullName}</p>
                    <p>
                      2. Số điện thoại mua hàng trên hóa đơn:{" "}
                      {dataConfirm?.phonenumberInBill}
                    </p>
                    <p>3. Mã hóa đơn: {dataConfirm?.spinCode}</p>
                    <p>
                      4. Ngày hóa đơn:{" "}
                      {moment(dataConfirm?.buyTime).format("DD/MM/YYYY")}
                    </p>
                    <p>
                      5. Hình ảnh toàn bộ hóa đơn Sau thời điểm trên nếu WinMart
                      chưa nhận được các thông tin hợp lệ, giải thưởng sẽ bị vô
                      hiệu hóa.
                    </p>
                  </Box> */}
                  <Box flexDirection={"column"}>
                    <Box p={2} className="divCenter">
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: "#BA5014",
                        }}
                      >
                        {" "}
                        {dataVoucher.voucherName}{" "}
                      </Text>
                    </Box>
                    <img
                      style={{
                        width: "100%",
                        height: "250px",
                        objectFit: "contain",
                      }}
                      role="presentation"
                      onClick={() => {
                        handleClick();
                      }}
                      src={dataVoucher.voucherImage}
                      alt={"img_logo"}
                    />{" "}
                    <Box className={"divCenter"} style={{ marginTop: 8 }}></Box>
                  </Box>
                </div>
                <Box style={{ height: 60, marginTop: 16 }}>
                  <Button
                    fullWidth
                    onClick={() => handleClickHistoryLuckyWheel()}
                    style={{
                      borderRadius: 10,
                      backgroundColor: "#EC2027",
                      border: "1px solid #D34C00",
                    }}
                  >
                    <Text.Title
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#fff",
                      }}
                    >
                      {/* Nhắn tin với OA WinMart */}
                      Xem danh sách quà tặng
                    </Text.Title>
                  </Button>
                </Box>
                <Box style={{ height: 60, marginTop: 16 }}>
                  <Button
                    fullWidth
                    onClick={() => saveImage(dataVoucher.voucherImage)}
                    style={{
                      borderRadius: 10,
                      backgroundColor: "#EC2027",
                      border: "1px solid #D34C00",
                    }}
                  >
                    <Text.Title
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#fff",
                      }}
                    >
                      Lưu Voucher về sử dụng
                    </Text.Title>
                  </Button>
                </Box>
              </div>
            )}
          </Box>
        )}
      </Modal>

      <Modal
        visible={isShowRule}
        onClose={() => {
          setIsShowRule(false);
          setIsShowFollow(true);
        }}
      >
        <Box style={{ marginBottom: 4, marginTop: 12 }}>
          <Text
            size="xLarge"
            style={{
              fontWeight: 700,
              fontSize: 25,
              color: "#B56C00",
              textAlign: "center",
              lineHeight: "30px",
            }}
          >
            Nội dung chi tiết thể lệ chương trình khuyến mãi
          </Text>
        </Box>
        {dataWheel?.content && (
          <Box
            style={{ height: 385, overflowY: "scroll" }}
            dangerouslySetInnerHTML={{ __html: dataWheel?.content }}
          ></Box>
        )}

        <Box className="divCenter">
          <Button
            style={{
              borderRadius: 10,
              border: "1px solid #4A72D7",
              backgroundColor: "#fff",
            }}
            onClick={() => {
              setIsShowRule(false);
              setIsShowFollow(true);
            }}
          >
            <Text
              style={{
                fontSize: 20,
                textAlign: "center",
                fontWeight: 700,
                color: "#4A72D7",
              }}
            >
              Đóng
            </Text>
          </Button>
        </Box>
      </Modal>

      <Modal
        width="90vw"
        height="50vw"
        visible={confirmPopUp}
        title={
          <Box flex={true} justifyContent={"flex-end"} height={10}>
            <Icon
              style={{ color: "#E92225" }}
              icon="zi-close-circle"
              onClick={() => {
                setConfirmPopup(false);
              }}
            />
          </Box>
        }
        onClose={() => {
          setConfirmPopup(false);
        }}
      >
        <Box
          style={{
            marginTop: "20px",
            marginBottom: "30px",
            textAlign: "center",
            fontSize: 20,
            fontFamily: "Inter, sans-serif",
          }}
        >
          Bạn chắc chắn các thông tin trên là chính xác?
        </Box>

        <Box flex justifyContent={"space-around"} style={{ marginBottom: 10 }}>
          <Button
            onClick={() => setConfirmPopup(false)}
            style={{ background: "#ddd", color: "black" }}
          >
            Chỉnh sửa
          </Button>

          <Button
            onClick={() => nextStep()}
            style={{ background: "#01A71C", color: "white" }}
          >
            Chắc chắn
          </Button>
        </Box>
      </Modal>

      <Modal
        visible={showStatus.isShow}
        title={
          <Box flex={true} justifyContent={"flex-end"}>
            <Icon
              icon="zi-close-circle"
              onClick={() => {
                setShowStatus({ ...showStatus, isShow: false });
              }}
            />
          </Box>
        }
        onClose={async () => {
          setShowStatus({ ...showStatus, isShow: false });
          if (userZalo?.followedOA == false) {
            await follow();
          }
        }}
        modalClassName="historyStatus"
      >
        <Box>
          <Box flex justifyContent={"center"}>
            <img
              style={{ width: 60, height: 60 }}
              src={`${dfData.url}/images/winmart/icon_ghost_sad2.png`}
            />
          </Box>
          <Box p={2} className={"divCenter"} flexDirection={"column"}>
            <Box textAlign={"center"}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 400,
                  lineHeight: "30px",
                  color: "#fff",
                }}
              >
                {showStatus.message}
              </Text>
            </Box>
            <Box className={"divCenter"}>
              {userZalo?.followedOA == false && (
                <Button
                  size={"large"}
                  style={{
                    borderRadius: 10,
                    height: 50,
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #2A458A",
                    width: "100%",
                  }}
                  className="divCenter"
                  onClick={async () => {
                    await follow();
                  }}
                >
                  <Text
                    style={{
                      fontSize: 24,
                      textAlign: "center",
                      fontWeight: 400,
                      color: "#EC2027",
                    }}
                  >
                    Quan tâm Zalo Incom
                  </Text>
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Modal>
    </Page>
  );
};

export default WheelVoucher;
