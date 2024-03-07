import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "zmp-ui";
import { Button } from "zmp-ui";
import api from "../../Common/api";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

const SwiperEvent = (props) => {
  const navigate = useNavigate();
  return (
    <Swiper
      loop={true}
      effect={"coverflow"}
      slidesPerView={2}
      centeredSlides={true}
      slidesPerView={2}
      spaceBetween={30}
      className="mySwiper"
    >
      {props.listEvent &&
        props.listEvent.slice(0, 4).map((item, index, el) => {
          return (
            <SwiperSlide
              className="box_item"
              style={{
                backgroundColor: item.backgroundSeminar,
                color: item.textColorSeminarDesc,
              }}
            >
              <div
                style={{ width: "100%", height: "160px" }}
                className="item"
                key={index}
                onClick={() => {
                  navigate("/detail-event", {
                    state: {
                      id: item.seminarId,
                      endTime: item.endTime,
                      startTime: item.startTime,
                    },
                  });
                }}
              >
                <img
                  style={{
                    width: "100%",
                    height: item.seminarContent.length > 40 ? "70%" : "80%",
                    position: "relative",
                  }}
                  src={
                    item.imageHome
                      ? item.imageHome
                      : "https://cdn.pixabay.com/photo/2013/07/12/12/33/toxic-145897_1280.png"
                  }
                />
                <button
                  style={{
                    position: "absolute",
                    right: "0px",
                    bottom: item.seminarContent.length > 40 ? "30%" : "20%",
                  }}
                >
                  Chi tiết &gt;&gt;
                </button>
                <div
                  style={{
                    margin: 0,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      fontWeight: 600,
                      fontSize:
                        item.seminarContent.length > 40 ? "11px" : "15px",
                    }}
                    className="content"
                  >
                    {item.seminarContent}
                  </div>
                  <div style={{ marginLeft: "4px", paddingBottom: "4px" }}>
                    {" "}
                    {item.statusSeminarName === "Đang diễn ra" ? (
                      <div className="textStatus">{item.statusSeminarName}</div>
                    ) : (
                      <div className="textStatusRed">
                        {item.statusSeminarName}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
    </Swiper>
  );
};

export default SwiperEvent;
