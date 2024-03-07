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
import { useLocation } from "react-router-dom";
import {
  followOA,
  openChat,
  openProfile,
  saveImageToGallery,
  showToast,
} from "zmp-sdk/apis";
import { Spin } from "antd";
import dfData from "../../Common/DefaultConfig.json";
import api from "../../Common/api";
import moment from "moment";
import "./luckywheel.css";

const HistoryLuckyWheel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [listHistory, setListHistory] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [dataShow, setDataShow] = useState({});
  const [dataVoucher, setDataVoucher] = useState({});
  const [step, setStep] = useState(1);
  const [dataPost, setDataPost] = useState({
    historySpinId: 0,
    phonenumber: "",
    cid: "",
    buyTime: moment().format(),
    fullName: "",
    crDatetime: moment().format(),
  });
  const [show, setShow] = useState(false);
  const [dataConfirm, setDataConfirm] = useState({});
  const [showStatus, setShowStatus] = useState({
    isConfirmInfo: true,
    isShow: false,
    message: "",
  });
  const [errMess, setErrMess] = useState({
    errFullName: "",
    errPhoneNumber: "",
    errCccd: "",
    errDate: "",
  });
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    var obj = {
      campaignCode: location.state.CampaignCode,
      userZaloId: location.state.UserZaloId,
    };
    getHistoryLuckyWheel(obj);
    setDataPost({
      ...dataPost,
      phonenumber: location.state.PhoneNumber,
      fullName: location.state.UserNameZalo,
    });
    getDataVoucher();
    setData(location.state.content);
  }, [location.state]);

  useEffect(() => {
    stepper();
  }, [step]);

  const openChatScreen = () => {
    var message = `Xác thực thông tin trúng giải Sự kiện "Tri ân cuối năm - Bốc thăm trúng lớn", tôi đã trúng Giải ${dataConfirm?.prizeOrder} - ${dataConfirm?.prizeName}.
    \n1. Họ và tên: ${dataConfirm?.fullName}\n2.Số điện thoại: ${dataConfirm?.phonenumberInBill} `;
    openChat({
      type: "oa",
      id: dfData.oaId,
      message: message,
      success: () => {},
      fail: (err) => {},
    });
  };

  const getHistoryLuckyWheel = (dataPost) => {
    api
      .post("LuckyWheelApi/GetHistorySpinByUser", dataPost)
      .then((res) => {
        if (res.Code == 1) {
          setListHistory([...res.Data]);
        }
      })
      .catch((err) => {});
  };

  const saveImage = (src) => {
    saveImageToGallery({
      imageUrl: src,
      success: (res) => {
        // xử lý khi gọi api thành công
        console.log("Save Image Success: ", res);
        showToast({
          message: "Save Voucher Success",
          success: (data) => {
            // xử lý khi gọi api thành công
          },
          fail: (error) => {
            // xử lý khi gọi api thất bại
            console.log(error);
          },
        });
      },
      fail: (error) => {
        // xử lý khi gọi api thất bại
        console.log(error);
      },
    });
  };
  const showTableHistory = () => {
    return (
      <Box flex={true} flexDirection={"column"}>
        <Box flex={true} flexDirection={"row"}>
          <Box
            className="divCenter"
            style={{
              height: 40,
              borderTopLeftRadius: 20,
              width: "15%",
              borderTop: "1px solid #000000",
              borderLeft: "1px solid #000000",
              borderBottom: "1px solid #000000",
            }}
          >
            <text
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#BA1414",
              }}
            >
              STT
            </text>
          </Box>
          <Box
            className="divCenter"
            style={{ height: 40, width: "50%", border: "1px solid #000000" }}
          >
            <text
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#BA1414",
              }}
            >
              {/* Thông tin lượt quay */}
              Quà tặng
            </text>
          </Box>
          <Box
            className="divCenter"
            style={{
              height: 40,
              borderTopRightRadius: 20,
              width: "35%",
              borderTop: "1px solid #000000",
              borderRight: "1px solid #000000",
              borderBottom: "1px solid #000000",
            }}
          >
            <text
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#BA1414",
              }}
            >
              {/* Thời gian */}
              Lượt quay
            </text>
          </Box>
        </Box>
        {listHistory.map((item, index) => {
          if (index < listHistory.length - 1) {
            return (
              <Box flex={true} flexDirection={"row"}>
                <Box
                  className="divCenter"
                  style={{
                    width: "15%",
                    borderLeft: "1px solid #000000",
                    borderBottom: "1px solid #000000",
                  }}
                  p={2}
                >
                  <text
                    style={{
                      fontSize: 16,
                      fontWeight: 400,
                      color: "#000000",
                    }}
                    onClick={() => {
                      if (item.prizeId > 0) {
                        setIsShow(true);
                        setDataShow({ ...item });
                      }
                    }}
                  >
                    {index + 1.0}
                  </text>
                </Box>
                <Box
                  className="divCenter"
                  style={{
                    width: "50%",
                    borderLeft: "1px solid #000000",
                    borderBottom: "1px solid #000000",
                    borderRight: "1px solid #000000",
                  }}
                  p={2}
                  flexDirection="column"
                >
                  <Box>
                    <text
                      style={{
                        fontSize: 16,
                        fontWeight: 400,
                        color: "#000000",
                      }}
                      onClick={() => {
                        if (item.prizeId > 0) {
                          setIsShow(true);
                          setDataShow({ ...item });
                        }
                      }}
                    >
                      {item.prizeName}
                    </text>
                  </Box>

                  {item.prizeId > 0 && (
                    <Box
                      flex={true}
                      flexDirection={"row"}
                      justifyContent={"space-between"}
                      style={{
                        width: "100%",
                      }}
                      flexWrap={true}
                      p={2}
                    >
                      <Button
                        size={"small"}
                        style={{
                          borderRadius: 10,
                          height: 20,
                          width: "70%",
                          backgroundColor: "#14f53d",
                          border: "1px solid #3559D7",
                          padding: 6,
                        }}
                        className="divCenter"
                        onClick={() => {
                          handleOnClickStatus(item);
                        }}
                      >
                        {/* <Text
                          style={{
                            fontSize: 12,
                            textAlign: "center",
                            fontWeight: 700,
                            color: "#fff",
                          }}
                        >
                          Trúng thưởng
                        </Text> */}
                      </Button>
                      <Button
                        size={"small"}
                        style={{
                          borderRadius: 10,
                          height: 20,
                          width: "40%",
                          backgroundColor: "#FF3B3B",
                          padding: 6,
                        }}
                        className="divCenter"
                        onClick={() => {
                          handleOnClickGift(item);
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            textAlign: "center",
                            fontWeight: 700,
                          }}
                        >
                          Xem quà
                        </Text>
                      </Button>
                    </Box>
                  )}
                </Box>
                <Box
                  className="divCenter"
                  style={{
                    width: "35%",
                    borderBottom: "1px solid #000000",
                    borderRight: "1px solid #000000",
                  }}
                  p={2}
                >
                  <text
                    style={{
                      fontSize: 16,
                      fontWeight: 400,
                      color: "#000000",
                    }}
                    onClick={() => {
                      if (item.prizeId > 0) {
                        setIsShow(true);
                        setDataShow({ ...item });
                      }
                    }}
                  >
                    {item.crDatetimeString}
                  </text>
                </Box>
              </Box>
            );
          } else {
            if (item.prizeId == 0) {
              return (
                <Box flex={true} flexDirection={"row"}>
                  <Box
                    className="divCenter"
                    style={{
                      width: "100%",
                      borderLeft: "1px solid #000000",
                      borderBottom: "1px solid #000000",
                      borderRight: "1px solid #000000",
                      borderBottomLeftRadius: 20,
                      borderBottomRightRadius: 20,
                    }}
                    p={2}
                  >
                    <text
                      style={{
                        fontSize: 16,
                        fontWeight: 400,
                        color: "#000000",
                      }}
                    >
                      Ôi tiếc quá, bạn chưa quay thưởng trúng voucher, chúc bạn
                      may mắn vào các mini game sau của WinMart nhé
                    </text>
                  </Box>
                </Box>
              );
            } else {
              return (
                <Box flex={true} flexDirection={"row"}>
                  <Box
                    className="divCenter"
                    style={{
                      width: "15%",
                      borderLeft: "1px solid #000000",
                      borderBottom: "1px solid #000000",
                      borderBottomLeftRadius: 20,
                    }}
                    p={2}
                  >
                    <text
                      style={{
                        fontSize: 16,
                        fontWeight: 400,
                        color: "#000000",
                      }}
                      onClick={() => {
                        if (item.prizeId > 0) {
                          setIsShow(true);
                          setDataShow({ ...item });
                        }
                      }}
                    >
                      {index + 1.0}
                    </text>
                  </Box>
                  <Box
                    className="divCenter"
                    style={{
                      width: "50%",
                      borderLeft: "1px solid #000000",
                      borderBottom: "1px solid #000000",
                      borderRight: "1px solid #000000",
                    }}
                    p={2}
                    flexDirection={"column"}
                  >
                    <Box>
                      <text
                        style={{
                          fontSize: 16,
                          fontWeight: 400,
                          color: "#000000",
                        }}
                        onClick={() => {
                          if (item.prizeId > 0) {
                            setIsShow(true);
                            setDataShow({ ...item });
                          }
                        }}
                      >
                        {item.prizeName}
                      </text>
                    </Box>
                    {item.prizeId > 0 && (
                      <Box
                        flex={true}
                        flexDirection={"row"}
                        justifyContent={"center"}
                        style={{
                          width: "100%",
                          alignItems: "center",
                          alignContent: "center",
                        }}
                        flexWrap={true}
                        p={2}
                      >
                        {/* <Button
                          size={"small"}
                          style={{
                            borderRadius: 10,
                            height: 20,
                            width: "70%",
                            backgroundColor: "#14f53d",
                            border: "1px solid #3559D7",
                            padding: 6,
                          }}
                          className="divCenter"
                          onClick={() => {
                            handleOnClickStatus(item);
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 12,
                              textAlign: "center",
                              fontWeight: 700,
                              color: "#fff",
                            }}
                          >
                            Trúng thưởng
                          </Text>
                        </Button> */}
                        <Button
                          size={"small"}
                          style={{
                            borderRadius: 10,
                            height: 20,
                            width: "40%",
                            backgroundColor: "#FF3B3B",
                            padding: 6,
                          }}
                          className="divCenter"
                          onClick={() => {
                            handleOnClickGift(item);
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 12,
                              textAlign: "center",
                              fontWeight: 700,
                            }}
                          >
                            Xem quà
                          </Text>
                        </Button>
                      </Box>
                    )}
                  </Box>
                  <Box
                    className="divCenter"
                    style={{
                      width: "35%",
                      borderBottom: "1px solid #000000",
                      borderRight: "1px solid #000000",
                      borderBottomRightRadius: 20,
                    }}
                    p={2}
                  >
                    <text
                      style={{
                        fontSize: 16,
                        fontWeight: 400,
                        color: "#000000",
                      }}
                      onClick={() => {
                        if (item.prizeId) {
                          setIsShow(true);
                          setDataShow({ ...item });
                        }
                      }}
                    >
                      {item.crDatetimeString}
                    </text>
                  </Box>
                </Box>
              );
            }
          }
        })}
      </Box>
    );
  };

  const handleOnClickGift = (dt) => {
    setShow(true);
    if (dt.isConfirmInfo) {
      setDataConfirm({ ...dt });
      setStep(2);
    } else {
      setStep(1);
      setDataPost({
        ...dataPost,
        historySpinId: dt.historySpinId,
        cid: dt.cid,
        crDatetime: dt.crDatetime,
      });
    }
  };

  const handleOnClickStatus = (dt) => {
    return 0;
    if (dt.isConfirmInfo) {
      setShowStatus({
        ...showStatus,
        isShow: true,
        isConfirmInfo: dt.isConfirmInfo,
        message: "Chờ xác minh",
      });
    } else {
      if (dt.statusSpinId == 5) {
        setShowStatus({
          ...showStatus,
          isShow: true,
          isConfirmInfo: dt.isConfirmInfo,
          message:
            "Giải trúng không hợp lệ vì quá thời gian gửi thông tin/Hóa đơn không hợp lệ",
        });
      } else {
        setShowStatus({
          ...showStatus,
          isShow: true,
          isConfirmInfo: dt.isConfirmInfo,
          message: "Vui lòng xác minh",
        });
      }
    }
  };

  const stepper = () => {
    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const title1 = document.getElementById("title-step1");
    const title2 = document.getElementById("title-step2");
    if (step === 2) {
      step2.classList.add("active");
      title2.style.color = "red";
      step1.classList.remove("active");
      title1.style.color = "#e0e0e0";
    }
    if (step === 1) {
      step1.classList.add("active");
      title1.style.color = "red";
      step2.classList.remove("active");
      title2.style.color = "#e0e0e0";
    }
  };

  const validateInfoUser = () => {
    var check = true;
    var objErr = { ...errMess };
    if (!dataPost.fullName) {
      objErr.errFullName = "Vui lòng nhập họ và tên";
      check = false;
    }
    if (!dataPost.phonenumber) {
      objErr.errPhoneNumber = "Vui lòng nhập số điện thoại";
      check = false;
    }
    if (!dataPost.cid) {
      objErr.errCccd = "Vui lòng nhập số căn cước công dân";
      check = false;
    }
    if (!dataPost.buyTime) {
      objErr.errDate = "Vui lòng nhập ngày mua hoá đơn";
      check = false;
    }
    setErrMess({ ...objErr });
    return check;
  };
  const getDataVoucher = () => {
    api
      .post("LuckyWheelApi/GetHistoryVoucherWinning", {
        campaignCode: location.state.CampaignCode,
        userZaloId: location.state.UserZaloId,
      })
      .then((res) => {
        if (res.Code == 1) {
          console.log("Callapi GetHistoryVoucherWinning", res);
          setDataVoucher(res.Data);
        } else {
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  const nextStep = () => {
    setLoading(true);
    let check = validateInfoUser();
    if (check == true) {
      setErrMess({
        errFullName: "",
        errPhoneNumber: "",
        errCccd: "",
        errDate: "",
      });
      api
        .post("LuckyWheelApi/ConfirmInfoReward", dataPost)
        .then((res) => {
          if (res.Code == 1) {
            setStep(2);
            setDataConfirm({ ...res.Data });
            getDataVoucher();
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

  return (
    <Page
      className="section-container"
      restoreScrollOnBack={true}
      hideScrollbar={true}
      style={{
        backgroundColor: "#fff",
      }}
    >
      <Box style={{ padding: 8 }}>
        <Box
          style={{
            height: 50,
            backgroundSize: "contain",
            backgroundImage: `url(${dfData.url}/images/winmart/text_lable.png)`,
          }}
          className="divCenter"
        >
          <Text
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: "#ffff",
              fontFamily: "Inter, sans-serif",
              lineHeight: "36px",
            }}
          >
            Danh sách quà tặng
          </Text>
        </Box>
      </Box>
      <Box style={{ marginTop: 16, marginBottom: 16 }}>
        {listHistory.length > 0 && <>{showTableHistory()}</>}
      </Box>
      <Box dangerouslySetInnerHTML={{ __html: data }}></Box>
      <Modal
        visible={isShow}
        onClose={() => {
          setIsShow(false);
        }}
        title={
          <Box flex={true} justifyContent={"flex-end"}>
            <Icon
              icon="zi-close-circle"
              onClick={() => {
                setIsShow(false);
              }}
            />
          </Box>
        }
      >
        <Box className="divCenter" p={1} flexDirection={"column"}>
          <Box>
            <img
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              role="presentation"
              onClick={() => {
                handleClick();
              }}
              src={dataVoucher.voucherImage}
              alt={"img_logo"}
            />
          </Box>
          <Box className={"divCenter"} style={{ marginTop: 8 }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#FF4949",
              }}
            >
              {dataVoucher.voucherName}
            </Text>
          </Box>
          <Box className={"divCenter"}>
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
        </Box>
      </Modal>

      <Modal
        visible={show}
        title={
          <Box flex={true} justifyContent={"flex-end"}>
            <Icon
              icon="zi-close-circle"
              onClick={() => {
                setShow(false);
              }}
            />
          </Box>
        }
        height={"95%"}
        width="95%"
        maskClosable={false}
        onClose={() => {
          setShow(false);
        }}
      >
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
                <p id="title-step1" style={{ fontWeight: 600 }}>
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
                <span className="circle" id="step2">
                  2
                </span>
                <p id="title-step2" style={{ fontWeight: 600 }}>
                  Quà tặng
                </p>
              </div>
            </div>
          </Box>

          {step == 1 && (
            <Spin spinning={loading}>
              <Box className={"divCenter"} p={2}>
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
                  overflowY: "scroll",
                }}
              >
                <Input
                  label={<b>Họ và tên</b>}
                  value={dataPost?.fullName}
                  onChange={(event) =>
                    setDataPost({ ...dataPost, fullName: event.target.value })
                  }
                />
                {errMess?.errFullName != "" && (
                  <p className="errMess">{errMess.errFullName}</p>
                )}

                <Input
                  label={<b>Số điện thoại mua hàng tương ứng với hóa đơn</b>}
                  value={dataPost?.phonenumber}
                  onChange={(event) => {
                    const value = event.target.value.replace(/[^0-9]/g, "");
                    if (value.length < 15) {
                      setDataPost({
                        ...dataPost,
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
                  value={dataPost?.cid}
                  onChange={(event) => {
                    const value = event.target.value.replace(/[^0-9]/g, "");
                    if (value.length < 20) {
                      setDataPost({
                        ...dataPost,
                        cid: value,
                      });
                    }
                  }}
                />
                {errMess?.errCccd != "" && (
                  <p className="errMess">{errMess.errCccd}</p>
                )}

                {/* <DatePicker
                  label="Ngày tháng năm mua hàng trong hóa đơn"
                  value={moment(dataPost.buyTime).toDate()}
                  endYear={2024}
                  dateFormat="dd/mm/yyyy"
                  onChange={(value) => {
                    setDataPost({ ...dataPost, buyTime: value });
                  }}
                  title="Ngày tháng năm mua hàng trong hóa đơn"
                />
                {errMess?.errDate != "" && (
                  <p className="errMess">{errMess.errDate}</p>
                )} */}
              </div>

              <Box style={{ height: 60, marginTop: 16 }}>
                <Button
                  fullWidth
                  onClick={() => nextStep()}
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
          {step == 2 && (
            <div>
              <div
                className="huongdan"
                style={{
                  border: "1px solid #D34C00",
                  borderRadius: 10,
                  padding: "10px 12px",
                  height: 320,
                  overflowY: "scroll",

                  overflowX: "hidden",
                }}
              >
                <Text.Title
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#BA5014",
                    textAlign: "center",
                  }}
                >
                  Thông tin giải thưởng
                </Text.Title>
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
                    // onClick={() => {
                    //   handleClick();
                    // }}
                    src={dataVoucher.voucherImage}
                    alt={"img_logo"}
                  />{" "}
                  {/* <Box className={"divCenter"} style={{ marginTop: 8 }}>
                    <Button onClick={() => saveImage(dataVoucher.voucherImage)}>
                      Lưu Voucher
                    </Button>
                  </Box> */}
                </Box>
              </div>
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
        onClose={() => {
          setShowStatus({ ...showStatus, isShow: false });
        }}
        modalClassName="historyStatus"
      >
        <Box>
          {!showStatus.isConfirmInfo && (
            <Box flex justifyContent={"center"}>
              <img
                style={{ width: 60, height: 60 }}
                src={`${dfData.url}/images/winmart/icon_ghost_sad.png`}
              />
            </Box>
          )}

          <Box p={2} className={"divCenter"}>
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
        </Box>
      </Modal>
    </Page>
  );
};

export default HistoryLuckyWheel;
