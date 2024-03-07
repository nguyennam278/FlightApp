import React, { useState, useEffect, createRef } from "react";
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

const HistoryLuckyWheelGift = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [listHistory, setListHistory] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [data, setData] = useState("");
  const [dataShow, setDataShow] = useState({});
  const [step, setStep] = useState(1);
  const [dataPost, setDataPost] = useState({
    historySpinId: 0,
    phonenumber: "",
    cid: "",
    buyTime: moment().format(),
    fullName: "",
    crDatetime: moment().format(),
    positionStore: "",
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
    errPositionStore: "",
  });

  const [loading, setLoading] = useState(false);
  const containerRef = createRef();

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
      spinCode: location.state.SpinCode,
    });
    setData(location.state.content);
  }, [location.state]);

  useEffect(() => {
    if (data != "" && containerRef.current) {
      containerRef.current.innerHTML = data;
    }
  }, [data, containerRef]);

  useEffect(() => {
    stepper();
  }, [step]);

  const openChatScreen = () => {
    var message = `Xác thực thông tin trúng giải Sự kiện "Tri ân cuối năm - Bốc thăm trúng lớn", tôi đã trúng Giải ${
      dataConfirm?.prizeOrder
    } - ${dataConfirm?.prizeName}.
    \n1. Họ và tên: ${dataConfirm?.fullName}\n2.Số CCCD: ${
      dataConfirm?.cid
    }\n3.SĐT mua hàng trên hóa đơn : ${
      dataConfirm?.phonenumberInBill
    } \n4. Mã hóa đơn: ${dataConfirm?.spinCode}\n5. Ngày xuất hóa đơn: ${moment(
      dataConfirm?.buyTime,
    ).format("DD/MM/YYYY")} \n6.Siêu thị mua hàng trên hóa đơn: ${
      dataConfirm?.positionStore
    } \n7. Hình ảnh toàn bộ hóa đơn: Vui lòng gửi ảnh`;
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
                          width: "50%",
                          backgroundColor: "#E9EAEC",
                          //border: "1px solid #3559D7",
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
                            color: "#000000",
                          }}
                        >
                          Trạng thái
                        </Text>
                      </Button>
                      <Button
                        size={"small"}
                        style={{
                          borderRadius: 10,
                          height: 20,
                          width: "50%",
                          backgroundColor: "#01A71B",
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
                          Nhận quà
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
                      <Button
                        size={"small"}
                        style={{
                          borderRadius: 10,
                          height: 20,
                          width: "50%",
                          backgroundColor: "#E9EAEC",
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
                            color: "#000000",
                          }}
                        >
                          Trạng thái
                        </Text>
                      </Button>
                      <Button
                        size={"small"}
                        style={{
                          borderRadius: 10,
                          height: 20,
                          width: "50%",
                          backgroundColor: "#01A71B",
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
                          Nhận quà
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
    if (dt.isConfirmInfo && dt.statusSpinId == 1) {
      setShowStatus({
        ...showStatus,
        isShow: true,
        isConfirmInfo: dt.isConfirmInfo,
        message: "Chờ xác minh",
      });
    } else if (dt.isConfirmInfo && dt.statusSpinId == 2) {
      setShowStatus({
        ...showStatus,
        isShow: true,
        isConfirmInfo: dt.isConfirmInfo,
        message: "Hợp Lệ",
      });
    } else {
      if (dt.statusSpinId == 5 || dt.statusSpinId == 4) {
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
    if (!dataPost.positionStore) {
      objErr.errPositionStore = "Vui lòng nhập siêu thị mua hàng trên hóa đơn";
      check = false;
    }
    setErrMess({ ...objErr });
    return check;
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
        .post("LuckyWheelApi/ConfirmInfoRewardGift", dataPost)
        .then((res) => {
          if (res.Code == 1) {
            setStep(2);
            setDataConfirm({ ...res.Data });
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
            Lịch sử quay
          </Text>
        </Box>
      </Box>
      <Box style={{ marginTop: 16, marginBottom: 16 }}>
        {listHistory.length > 0 && <>{showTableHistory()}</>}
      </Box>
      <div ref={containerRef}></div>

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
              src={dataShow.prizeImage}
              alt={"img_logo"}
            />
          </Box>
          <Box className={"divCenter"} style={{ marginTop: 8 }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#FF4949",
                textAlign: "center",
              }}
            >
              {dataShow.prizeName}
            </Text>
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
                  Nhận giải
                </p>
              </div>
            </div>
          </Box>

          {step == 1 && (
            <Spin spinning={loading}>
              <Box className="divCenter" p={1}>
                <Text.Title
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#EC2027",
                    fontFamily: "Inter, sans-serif",
                    textAlign: "center",
                  }}
                >
                  Vui lòng hoàn tất thông tin nhận thưởng trong 48h để nhận giải
                </Text.Title>
              </Box>
              <div
                style={{
                  border: "1px solid #D34C00",
                  borderRadius: 10,
                  padding: "5px 12px",
                  height: 290,
                  //overflowY: "scroll",
                  overflowX: "hidden",
                }}
              >
                <Input
                  label={<b>Họ và tên: </b>}
                  value={dataPost?.fullName}
                  onChange={(event) =>
                    setDataPost({ ...dataPost, fullName: event.target.value })
                  }
                />
                {errMess?.errFullName != "" && (
                  <p className="errMess">{errMess.errFullName}</p>
                )}

                <Input
                  label={<b>Số CCCD: </b>}
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

                <Input
                  label={<b>SĐT mua hàng tương ứng với hóa đơn:</b>}
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
                  label={<b>Mã hóa đơn:</b>}
                  value={dataPost?.spinCode}
                  disabled={true}
                />

                <DatePicker
                  label={<b>Ngày tháng năm mua hàng trong hóa đơn: </b>}
                  value={moment(dataPost.buyTime).toDate()}
                  action={{ text: "Hoàn thành", close: true }}
                  endYear={2024}
                  dateFormat="dd/mm/yyyy"
                  onChange={(value) => {
                    setDataPost({ ...dataPost, buyTime: value });
                  }}
                  title="Ngày tháng năm mua hàng trong hóa đơn"
                />
                {errMess?.errDate != "" && (
                  <p className="errMess">{errMess.errDate}</p>
                )}
                <Input
                  label={<b>Siêu thị mua hàng trên hóa đơn:</b>}
                  value={dataPost?.positionStore}
                  onChange={(event) => {
                    setDataPost({
                      ...dataPost,
                      positionStore: event.target.value,
                    });
                  }}
                />
                {errMess?.errPositionStore != "" && (
                  <p className="errMess">{errMess.errPositionStore}</p>
                )}
              </div>

              <Box style={{ height: 55, marginTop: 8 }}>
                <Button
                  fullWidth
                  onClick={() => {
                    //setConfirmPopup(true);
                    nextStep();
                  }}
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
                  Hướng dẫn nhắn tin với Zalo WCM
                </Text.Title>
                <Box flexDirection={"column"}>
                  <p>
                    Bạn vui lòng gửi các thông tin sau đến Zalo WinMart trước{" "}
                    {moment(dataConfirm?.crDateTime)
                      .add(2, "days")
                      .format("HH:mm")}{" "}
                    ngày{" "}
                    {moment(dataConfirm?.crDateTime)
                      .add(2, "days")
                      .format("DD/MM/YYYY")}{" "}
                    để xác thực giải thưởng nhé.Sau thời gian trên, giải thưởng
                    sẽ bị vô hiệu.
                  </p>
                  <div
                    style={{
                      color: "#BA1414",
                      fontSize: 20,
                      fontFamily: "Inter, sans-serif",
                      fontWeight: "700",
                      wordWrap: "break-word",
                    }}
                  >
                    <div>1. Họ và tên </div>
                    <div>2. Số CCCD </div>
                    <div>3. SĐT mua hàng trên hóa đơn</div>
                    <div>4. Mã hóa đơn</div>
                    <div>5. Ngày xuất hóa đơn</div>
                    <div>6. Siêu thị mua hàng trên hoá đơn</div>
                    <div>7. Hình ảnh toàn bộ hóa đơn</div>
                  </div>
                </Box>
              </div>
              <Box style={{ height: 60, marginTop: 16 }}>
                <Button
                  fullWidth
                  onClick={() => openChatScreen()}
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
                    Nhắn tin với Zalo WinMart
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

export default HistoryLuckyWheelGift;
