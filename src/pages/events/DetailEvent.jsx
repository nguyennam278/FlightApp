import React, { useState, useEffect, useRef } from "react";
import {
  Page,
  Box,
  Text,
  Modal,
  Button,
  ImageViewer,
  Icon,
  Spinner,
} from "zmp-ui";
import { useLocation } from "react-router-dom";
import "./event.css";
import dfData from "../../Common/DefaultConfig.json";
import useSetHeader from "../../components/hooks/useSetHeader";
import { saveImageToGallery } from "zmp-sdk/apis";

import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import api from "../../Common/api";
import { useNavigate } from "zmp-ui";
import PopupRegister from "../awards/popup/popupRegister";
import PopupSpeakersInfo from "../awards/popup/popupSpeakerInfo";
import { openWebview } from "zmp-sdk/apis";

export default function DetailEvent() {
  const location = useLocation();
  const navigate = useNavigate();
  const popupRegisterRef = useRef(false);
  const popupSpeakerRef = useRef(false);
  const popupSponsorRef = useRef(false);

  const [seminarInfo, setSeminarInfo] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [sponsor, setSponsor] = useState([]);
  const [gallery, setGallery] = useState([]);

  const [colorSeminar, setColorSeminar] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [popupDownloadFile, setPopupDownloadFile] = useState(false);

  const [files, setFiles] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [days, setDays] = useState("00");
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [occur, setOccur] = useState("");
  const [detailSponsor, setDetailSponsor] = useState({
    image: "",
    name: "",
    description: "",
  });
  let interval = useRef();
  const setHeader = useSetHeader();

  useEffect(() => {
    setHeader({
      hasLeftIcon: true,
      type: "secondary",
      title: "Detail Seminar",
      customTitle: false,
    });
  }, []);

  useEffect(() => {
    if (location.state.id != undefined) {
      getDetailSeminar(location.state.id);
    }
  }, [location.state.id]);

  useEffect(() => {
    timer();
  }, []);

  const openUrlInWebview = async (url) => {
    try {
      await openWebview({
        url: url,
        config: {
          style: "bottomSheet",
          leftButton: "back",
        },
      });
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };

  const getDetailSeminar = (id) => {
    api
      .get(`/SeminarApi/GetDetailSeminarById?`, {
        params: {
          seminarId: id,
        },
      })
      .then((res) => {
        setSpeakers([...res.data.speakers]);

        setSponsor([...res.data.listSponsors]);
        setGallery([...res.data.galleries]);
        setSeminarInfo([res.data]);
        setColorSeminar({
          ...colorSeminar,

          backgroundColorBanner: res.data.backgroundColorBanner,
          backgroundColorButton: res.data.backgroundColorButton,
          backgroundColorBottomButton: res.data.backgroundColorBottomButton,
          backgroundColorCountdown: res.data.backgroundColorCountdown,
          backgroundColorSeminarDesc: res.data.backgroundColorSeminarDesc,
          textColorBanner: res.data.textColorBanner,
          textColorBottomButton: res.data.textColorBottomButton,
          textColorButton: res.data.textColorButton,
          textColorCountdown: res.data.textColorCountdown,
          textColorSeminarDesc: res.data.textColorSeminarDesc,
          backgroundSeminar: res.data.backgroundSeminar,
          opacityColorBanner: res.data.opacityColorBanner,
        });
      });
  };

  const timer = () => {
    const end = new Date(`${location.state.startTime}`).getTime();

    interval = setInterval(() => {
      // Find the distance between now and the count down date
      const start = new Date().getTime();
      let distance = end - start;

      // Time calculations for days, hours, minutes and seconds
      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      // If the count down is over, write some text
      if (distance < 0) {
        clearInterval(interval.current);
        setOccur("Sự kiện đang diễn ra");
      } else {
        setDays(days);
        setHours(hours);
        setMinutes(minutes);
      }
    }, 1000);
  };

  const images = [];
  gallery.map((item, index) => {
    images.push({
      src: item.galleryLink,
      alt: index + 1,
      key: index + 1,
    });
  });
  const getFile = (seminarId) => {
    api
      .get("/SeminarApi/GetListSeminarFileBySeminarId?", {
        params: {
          seminarId: seminarId,
        },
      })
      .then((res) => {
        console.log("Check file:", res);
        setFiles(res.data);
        setPopupDownloadFile(true);
      })
      .catch((error) => console.log(error));
  };
  const downloadSeminarFile = (linkfile) => {
    const pdfUrl = linkfile;

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "seminar.pdf"; // specify the filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Modal
        visible={modalVisible}
        maskClosable={false}
        modalClassName="modal-info"
        onClose={() => {
          setModalVisible(false);
        }}
      >
        <Box
          className="sub-award-popup"
          style={{ maxHeight: 600, overflowY: "scroll" }}
        >
          <Box style={{ width: "100%", height: "100%" }}>
            <img
              style={{ width: "317px", height: "317px" }}
              src={detailSponsor?.image}
            />
          </Box>
          <span onClick={() => setModalVisible(false)}>X</span>
          <Box style={{ padding: 10 }}>
            <p className="info-titleAwawrd">{detailSponsor?.name}</p>
            <p>{detailSponsor?.description}</p>
          </Box>
        </Box>
      </Modal>
      <Modal
        visible={popupDownloadFile}
        title="Tài liệu"
        onClose={() => {
          setPopupDownloadFile(false);
        }}
      >
        {files.map((item, index) => {
          return (
            <Box
              p={2}
              key={index}
              style={{
                display: "flex",
                padding: 6,
              }}
            >
              <Text.Title style={{ width: "70vw", overflow: "hidden" }}>
                {" "}
                Tên: {item.seminarFileName}{" "}
              </Text.Title>
              <Button onClick={() => downloadSeminarFile(item.seminarFileLink)}>
                Xem
              </Button>
            </Box>
          );
        })}
      </Modal>
      {seminarInfo.map((item, index) => {
        return (
          <>
            <Page
              hideScrollbar={true}
              style={{
                overflow: "inherit",
                background: colorSeminar.backgroundSeminar,
              }}
              className="seminar-content"
              key={index}
            >
              <div
                className="event-container "
                style={{
                  overflow: "inherit",
                }}
              >
                <Box
                  style={{
                    position: "relative",
                    width: "100vw",
                    height: "550px",
                    padding: 0,
                    opacity: colorSeminar.opacityColorBanner,
                  }}
                >
                  <img
                    style={{ width: "100%", height: "100%" }}
                    className="img-event1"
                    src={item.image}
                  />

                  <div
                    className="timer"
                    style={{
                      color: colorSeminar.textColorCountdown,
                      backgroundColor: colorSeminar.backgroundColorCountdown,
                      position: "absolute",
                      top: "2%",
                      left: "20%",
                    }}
                  >
                    {occur ? (
                      <p style={{ fontSize: 16, fontWeight: "bold" }}>
                        {occur}
                      </p>
                    ) : (
                      <div>
                        <p className="title-first">Sự kiện sẽ diễn ra trong </p>
                        <div className="countdown">
                          <div className="b">
                            <div className="count">{days}</div>
                            <div className="a">Ngày</div>
                          </div>

                          <div className="b">
                            <div className="count">{hours}</div>
                            <div className="a">Giờ</div>
                          </div>

                          <div className="b">
                            <div className="count">{minutes}</div>
                            <div className="a">Phút</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    className="event-item1"
                    style={{
                      width: "95vw",
                      left: "3%",
                      position: "absolute",
                      bottom: "1%",
                      borderRadius: 10,
                      color: colorSeminar.textColorBanner,
                      backgroundColor: colorSeminar.backgroundColorBanner,
                    }}
                  >
                    <div className="event-title">
                      <p>
                        <span className="label">Sự kiện:</span>{" "}
                        {item.statusSeminarName}
                      </p>
                    </div>

                    <div className="event-title">
                      <p>
                        <span className="label">Địa chỉ:</span> {item.address}
                      </p>
                    </div>

                    <div className="event-time">
                      <p>
                        <span className="label">Thời gian bắt đầu: </span>
                        {item.startTime}
                      </p>
                      <p>
                        <span className="label">Thời gian kết thúc: </span>{" "}
                        {item.endTime}
                      </p>
                    </div>
                  </div>
                </Box>

                <Box style={{ padding: 5 }}>
                  {" "}
                  <div
                    className="event-item2"
                    style={{
                      padding: 8,
                      textAlign: "justify",
                      color: colorSeminar.textColorSeminarDesc,
                      backgroundColor: colorSeminar.backgroundColorSeminarDesc,
                    }}
                  >
                    <div
                      className="label1"
                      style={{
                        lineHeight: 1.3,
                        paddingTop: 10,
                      }}
                    >
                      {item.seminarContent}
                    </div>

                    <div className="event-item2">
                      <div
                        className="event-detail"
                        style={{
                          width: "100%",
                          marginBottom: 16,
                          marginRight: 10,
                        }}
                        dangerouslySetInnerHTML={{ __html: item.seminarDesc }}
                      ></div>
                    </div>

                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginRight: 10,
                        paddingBottom: 10,
                        gap: 10,
                      }}
                    >
                      <Button
                        size="small"
                        style={{
                          backgroundColor: colorSeminar.backgroundColorButton,
                          color: colorSeminar.textColorButton,
                        }}
                        onClick={() => {
                          popupRegisterRef.current.open();
                        }}
                      >
                        Đăng ký tham dự tại đây
                      </Button>

                      <Button
                        size="small"
                        style={{
                          backgroundColor: colorSeminar.backgroundColorButton,
                          color: colorSeminar.textColorButton,
                        }}
                        onClick={() => openUrlInWebview(item.registrationLink)}
                      >
                        Xem trực tiếp sự kiện
                      </Button>
                    </Box>
                  </div>
                </Box>

                <Box style={{ padding: "0px 5px" }}>
                  <div
                    style={{
                      maxHeight: 450,
                      borderRadius: 10,
                      backgroundColor: "white",
                      color: "black",
                    }}
                  >
                    <h2 style={{ padding: 10, paddingBottom: 0 }}> Diễn giả</h2>

                    <div
                      style={{
                        maxHeight: 470,
                        display: "flex",
                        flexWrap: "wrap",
                        flexDirection: "column",
                        overflow: "hidden",
                        overflowX: "scroll",
                      }}
                    >
                      {speakers.length > 0 &&
                        speakers.map((speaker, index) => {
                          return (
                            <div
                              style={{
                                width: "45%",
                                height: "188px",
                                display: "flex",
                                // justifyContent: "center",
                                // alignItems: "center",
                                alignItems: "baseline",
                                flexDirection: "column",
                                marginLeft: "3.5%",
                                marginTop: "3%",
                              }}
                              key={index}
                              onClick={() => {
                                popupSpeakerRef.current.open(speaker.speakerId);
                              }}
                            >
                              <img
                                src={speaker.image}
                                style={{
                                  width: "87%",
                                  height: "142px",
                                  borderRadius: 10,
                                }}
                              />
                              <p
                                className="name-speakerAwrard"
                                style={{
                                  marginTop: 0,
                                  marginBottom: 0,
                                  fontSize: 14,
                                  marginLeft: "5%",
                                }}
                              >
                                {speaker.speakerName}
                              </p>
                              <p
                                style={{
                                  marginTop: 0,
                                  fontSize: 12,
                                  marginLeft: "5%",
                                }}
                              >
                                {speaker.position}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </Box>

                <Box style={{ padding: 5 }}>
                  {" "}
                  <Box
                    mt={3}
                    style={{
                      width: "98vw",
                      background: "white",
                      color: "black",
                      padding: 10,
                      borderRadius: 10,
                    }}
                  >
                    <h2 style={{ padding: 10 }}> Nhà tài trợ</h2>
                    {sponsor.length > 0 &&
                      sponsor.map((item, index) => {
                        return (
                          <>
                            <Box style={{ padding: 10 }}>
                              <p
                                style={{
                                  fontSize: +item.sponsorLevel.sizeTitle
                                    ? +item.sponsorLevel.sizeTitle
                                    : "20px",
                                  fontWeight: 700,
                                }}
                              >
                                {item.sponsorLevel.sponsorLevelName}
                              </p>
                            </Box>

                            <Box
                              style={{
                                maxHeight: 200,
                                marginTop: 10,
                                display: "flex",
                                flexWrap: "wrap",
                                flexDirection: "column",
                                overflow: "hidden",
                                overflowX: "scroll",
                              }}
                            >
                              {item.sponsors.map((detail, key) => {
                                return (
                                  <div
                                    style={{
                                      padding: 10,
                                      width: "50%",
                                      height: "100%",

                                      display: "flex",
                                      flexWrap: "wrap",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      flexDirection: "column",
                                    }}
                                    onClick={() => {
                                      setDetailSponsor({
                                        ...detailSponsor,
                                        image: detail.image,
                                        name: detail.sponsorName,
                                        description: detail.introduction,
                                      });
                                      setModalVisible(true);
                                    }}
                                  >
                                    <img
                                      src={detail.image}
                                      style={{
                                        width: "50%",
                                        height: "105px",
                                        borderRadius: 10,
                                      }}
                                    />
                                    <p
                                      style={{
                                        fontSize: +detail.sizeTitle
                                          ? +detail.sizeTitle
                                          : "20px",
                                        fontWeight: 700,
                                      }}
                                    >
                                      {detail.sponsorName}
                                    </p>
                                  </div>
                                );
                              })}
                            </Box>
                          </>
                        );
                      })}
                  </Box>
                </Box>

                <div>
                  <Box mt={6}>
                    <div
                      style={{
                        height: 200,
                        marginTop: 10,
                        paddingBottom: 10,
                        display: "flex",
                        flexWrap: "wrap",
                        flexDirection: "column",
                        overflow: "hidden",
                        overflowX: "scroll",
                      }}
                    >
                      {gallery.length > 0 ? (
                        gallery.map((item, index) => {
                          return (
                            <div
                              style={{
                                padding: 4,
                                width: "33%",
                                height: "50%",
                                display: "flex",
                                paddingBottom: 10,
                              }}
                            >
                              <img
                                style={{ width: "100%", height: "100%" }}
                                src={item.galleryLink}
                                onClick={() => {
                                  setActiveIndex(index);
                                  setVisible(true);
                                }}
                              />
                            </div>
                          );
                        })
                      ) : (
                        <Box
                          textAlign="center"
                          style={{
                            fontSize: 25,
                          }}
                        >
                          <b>Chưa có hình ảnh hội thảo</b>
                        </Box>
                      )}
                    </div>
                  </Box>

                  <Box style={{ textAlign: "center", marginTop: 10 }}>
                    <div
                      fullWidth
                      onClick={() => getFile(location.state)}
                      style={{
                        fontSize: 20,
                        fontWeight: 500,
                        width: "100%",
                        padding: 10,
                        textAlign: "center",
                        backgroundColor: colorSeminar.backgroundColorButton,
                        color: colorSeminar.textColorButton,
                      }}
                    >
                      Tài liệu hội thảo
                      <span>
                        <Icon icon="zi-arrow-down" />
                      </span>
                    </div>
                  </Box>

                  <Box mt={3}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Button
                        prefixIcon={<Icon icon="zi-arrow-left" />}
                        className="btnLast"
                        style={{
                          backgroundColor:
                            colorSeminar.backgroundColorBottomButton,
                          color: colorSeminar.textColorBottomButton,
                        }}
                        onClick={() => {
                          navigate("/event");
                        }}
                      >
                        SỰ KIỆN KHÁC
                      </Button>

                      <Button
                        suffixIcon={<Icon icon="zi-arrow-right" />}
                        className="btnLast"
                        style={{
                          backgroundColor:
                            colorSeminar.backgroundColorBottomButton,
                          color: colorSeminar.textColorBottomButton,
                        }}
                        onClick={() => {
                          navigate("/award");
                        }}
                      >
                        GIẢI THƯỞNG
                      </Button>
                    </div>
                  </Box>
                </div>

                <ImageViewer
                  onClose={() => setVisible(false)}
                  activeIndex={activeIndex}
                  images={images}
                  visible={visible}
                />
              </div>
            </Page>
          </>
        );
      })}
      <PopupRegister ref={popupRegisterRef} seminarId={seminarInfo.seminarId} />
      <PopupSpeakersInfo ref={popupSpeakerRef} />
    </>
  );
}
