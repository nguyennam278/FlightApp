import React, { useState, useEffect, useRef } from "react";
import {
  Page,
  Box,
  Text,
  Modal,
  Button,
  Spinner,
  ImageViewer,
  Icon,
} from "zmp-ui";
import { openWebview } from "zmp-sdk/apis";

import moment from "moment";
import { useLocation } from "react-router-dom";
import "./award.css";
import Subwrap from "./subwrap";
import api from "../../Common/api";
import { useNavigate } from "zmp-ui";
export default function DetailEvent() {
  const location = useLocation();

  const [detailAward, setDetailAward] = useState({});
  const [subDetailAward, setSubDetailAward] = useState([]);
  const [detailSubAward, setDetailSubAward] = useState({
    image: "",
    name: "",
    description: "",
  });
  const [listGallery, setListGallery] = useState([]);
  const [days, setDays] = useState("00");
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [occur, setOccur] = useState("");
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  let interval = useRef();
  const navigate = useNavigate();
  const [colorAward, setColorAward] = useState({});

  useEffect(() => {
    if (location.state != undefined) {
      getDetailAwards(location.state.id);
    }
  }, [location.state]);

  useEffect(() => {
    timer();
  });

  const getDetailAwards = (awardId) => {
    api
      .get(`/AwardApi/GetDetailAwardById?`, {
        params: {
          awardId: awardId,
        },
      })
      .then((res) => {
        setDetailAward({ ...res.data });
        setSubDetailAward([...res.data.subAwards]);
        setListGallery([...res.data.galleries]);
        setColorAward({
          ...colorAward,
          backgroundAward: res.data.backgroundAward,
          backgroundColorAwardDesc: res.data.backgroundColorAwardDesc,
          backgroundColorBanner: res.data.backgroundColorBanner,
          backgroundColorBottomButton: res.data.backgroundColorBottomButton,
          backgroundColorButton: res.data.backgroundColorButton,
          backgroundColorCountdown: res.data.backgroundColorCountdown,

          textColorAwardDesc: res.data.textColorAwardDesc,
          textColorBanner: res.data.textColorBanner,
          textColorBottomButton: res.data.textColorBottomButton,
          textColorButton: res.data.textColorButton,
          textColorCountdown: res.data.textColorCountdown,
          opacity: res.data.opacityBanner,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const timer = () => {
    setLoading(true);
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
        setOccur("Giải thưởng đang diễn ra");
      } else {
        setDays(days);
        setHours(hours);
        setMinutes(minutes);
      }
    }, 1000);
    setLoading(false);
  };

  const images = [];
  listGallery.map((item, index) => {
    images.push({
      src: item.galleryLink,
      alt: index + 1,
      key: index + 1,
    });
  });

  const openUrlInWebview = async () => {
    try {
      await openWebview({
        url: detailAward.awardLink,
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
  return (
    <>
      <Page
        hideScrollbar={true}
        style={{
          backgroundColor: colorAward.backgroundAward,
          overflow: "inherit",
        }}
      >
        <Box className="seminar-content">
          <div className="event-container">
            <div
            // style={{
            //   width: "95vw",
            //   height: "500px",
            //   backgroundImage: `url(${detailAward.image})`,
            //   backgroundSize: "contain",
            //   backgroundRepeat: "no-repeat",
            //   display: "flex",
            //   flexDirection: "column",
            //   justifyContent: "space-between",
            //   ,
            // }}
            >
              <Box
                style={{
                  position: "relative",
                  width: "100vw",
                  height: "550px",
                  opacity: colorAward.opacityColorBanner,
                }}
              >
                <img
                  style={{ width: "100%", height: "100%" }}
                  className="img-event1"
                  src={detailAward.image}
                />
                <div
                  className="timer"
                  style={{
                    color: colorAward.textCountdown,
                    backgroundColor: colorAward.backgroundColorCountdown,
                    position: "absolute",
                    top: "2%",
                    left: "20%",
                  }}
                >
                  {occur ? (
                    <p style={{ fontSize: 16, fontWeight: "bold" }}>{occur}</p>
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
                    left: "2.5%",
                    position: "absolute",
                    bottom: "1%",
                    borderRadius: 10,
                    color: colorAward.textColorBanner,
                    backgroundColor: colorAward.backgroundColorBanner,
                  }}
                >
                  <div className="event-title">
                    <p>
                      <span className="label">Trạng thái:</span>
                      {detailAward.isActive}
                    </p>
                  </div>
                  <div className="event-title">
                    <p>
                      <span className="label">Thời gian:</span>{" "}
                      {moment(detailAward.awardTime).format("DD/MM/YYYY")}
                    </p>
                  </div>
                  <div className="event-title">
                    <p>
                      <span className="label">Địa điểm:</span>{" "}
                      {detailAward.awardAddress}
                    </p>
                  </div>
                </div>
              </Box>
            </div>

            <div
              className="event-item2"
              style={{
                width: "98vw",
                padding: 5,
                color: colorAward.textColorAwardDesc,
                backgroundColor: colorAward.backgroundColorAwardDesc,
              }}
            >
              <div className="event-title">
                <p
                  className="label1"
                  style={{ lineHeight: 1.3, paddingTop: 10 }}
                >
                  {detailAward.awardName}
                </p>
              </div>
              <div className="event-item2">
                <div
                  className="event-detail"
                  style={{
                    marginBottom: 16,
                    color: colorAward.textSeminarDesc,
                    paddingRight: 6,
                    textAlign: "justify",
                  }}
                  dangerouslySetInnerHTML={{ __html: detailAward.awardDesc }}
                ></div>
              </div>
            </div>

            <Box>
              <Box>
                {subDetailAward.length > 0 &&
                  subDetailAward.map((item, index) => {
                    return (
                      <>
                        <Box
                          mt={3}
                          style={{
                            width: "98vw",
                            background: "white",
                            color: "black",
                            margin: " 0 auto",
                            paddingLeft: 10,
                            marginBottom: 10,
                            borderRadius: 10,
                          }}
                        >
                          <Box style={{ padding: 10 }}>
                            <p
                              style={{
                                fontWeight: 700,
                              }}
                            >
                              {item.subAwardName}
                            </p>
                          </Box>

                          <Box
                            style={{
                              height: 160,
                              marginTop: 10,
                              display: "flex",
                              flexWrap: "wrap",
                              flexDirection: "column",
                              overflow: "hidden",
                              overflowX: "scroll",
                            }}
                          >
                            {item.units.map((detail, key) => {
                              return (
                                <div
                                  style={{
                                    padding: 10,
                                    width: "50%",
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                  }}
                                  onClick={() => {
                                    setDetailSubAward({
                                      ...detailSubAward,
                                      image: detail.image,
                                      name: detail.unitName,
                                      description: detail.unitDesc,
                                    });
                                    setModalVisible(true);
                                  }}
                                >
                                  <img
                                    src={detail.image}
                                    style={{
                                      width: "50%",
                                      height: "100%",
                                      borderRadius: 10,
                                    }}
                                  />

                                  <p
                                    style={{
                                      fontWeight: 700,
                                    }}
                                  >
                                    {detail.unitName}
                                  </p>
                                </div>
                              );
                            })}
                          </Box>
                        </Box>
                      </>
                    );
                  })}
              </Box>
            </Box>

            <Box>
              <div
                style={{
                  height: 200,
                  marginTop: 10,
                  display: "flex",
                  flexWrap: "wrap",
                  flexDirection: "column",
                  overflowX: "scroll",
                }}
              >
                {listGallery.length > 0 ? (
                  listGallery.map((item, index) => {
                    return (
                      <div
                        style={{
                          padding: 4,
                          width: "33%",
                          height: "50%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <img
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: 10,
                          }}
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
                    style={{
                      fontSize: 25,
                      textAlign: "center",
                    }}
                  >
                    <b>Chưa có hình ảnh giải thưởng</b>
                  </Box>
                )}
              </div>
            </Box>

            <Box style={{ width: "98vw" }}>
              <a
                onClick={() => {
                  openUrlInWebview();
                }}
                style={{
                  width: "100vw",
                  display: "inline-block",
                  textDecoration: "underline",
                  fontSize: 20,
                  fontWeight: 500,
                  padding: 10,
                  textAlign: "center",
                  backgroundColor: colorAward.backgroundColorButton,
                  color: colorAward.textColorButton,
                }}
              >
                Tài liệu giải thưởng{" "}
                <span>
                  <Icon icon="zi-arrow-down" />
                </span>
              </a>
            </Box>

            <Box mt={3}>
              <div
                style={{
                  width: "100vw",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  className="btnLast"
                  prefixIcon={<Icon icon="zi-arrow-left" />}
                  onClick={() => {
                    navigate("/award");
                  }}
                  style={{
                    paddingBottom: 10,
                    marginBottom: 10,
                    backgroundColor: colorAward.backgroundColorBottomButton,
                    color: colorAward.textColorBottomButton,
                  }}
                >
                  Giải thưởng khác
                </Button>

                <Button
                  className="btnLast"
                  suffixIcon={<Icon icon="zi-arrow-right" />}
                  onClick={() => {
                    navigate("/event");
                  }}
                  style={{
                    paddingBottom: 10,
                    marginBottom: 10,

                    backgroundColor: colorAward.backgroundColorBottomButton,
                    color: colorAward.textColorBottomButton,
                  }}
                >
                  Xem sự kiện
                </Button>
              </div>
            </Box>
          </div>
        </Box>
        <ImageViewer
          onClose={() => setVisible(false)}
          activeIndex={activeIndex}
          images={images}
          visible={visible}
        />
      </Page>
      <Modal
        maskClosable={false}
        mask={true}
        visible={modalVisible}
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
              style={{ width: "100%", height: "317px" }}
              src={detailSubAward?.image}
            />
          </Box>
          <span onClick={() => setModalVisible(false)}>X</span>
          <Box style={{ padding: 10 }}>
            <p className="info-titleAwawrd">{detailSubAward?.name}</p>

            <p
              dangerouslySetInnerHTML={{ __html: detailSubAward?.description }}
            ></p>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
