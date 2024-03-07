import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "zmp-ui";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

const SwiperAward = (props) => {
  const navigate = useNavigate();
  return (
    <Swiper
      loop={true}
      centeredSlides={true}
      slidesPerView={2}
      initialSlide={2}
      spaceBetween={30}
      className="SwiperAward"
    >
      {props.listAward &&
        props.listAward.slice(0, 4).map((item, index, el) => {
          return (
            <SwiperSlide
              className="box_item"
              style={{
                backgroundColor: item.backgroundAward,
                color: item.textColorAwardDesc,
              }}
            >
              <div
                style={{ width: "100%", height: "160px" }}
                className="item"
                key={index}
              >
                <img
                  style={{ width: "100%", height: "70%", position: "relative" }}
                  src={
                    item.imageHome
                      ? item.imageHome
                      : "https://drive.google.com/file/d/1SlyEUeqOCyrLnLfUhCs85DgYq9uz9111/view?google_abuse=GOOGLE_ABUSE_EXEMPTION%3DID%3Ddc8d74465fb4adf9:TM%3D1707122495:C%3Dr:IP%3D2402:800:63b9:ff07:5ca5:8dbc:e621:b869-:S%3DxYbOzgXvgHyBCrbFK37UDhg%3B+path%3D/%3B+domain%3Dgoogle.com%3B+expires%3DMon,+05-Feb-2024+11:41:35+GMT"
                  }
                />
                <button
                  style={{
                    position: "absolute",
                    right: 0,
                    bottom: "30%",
                  }}
                  onClick={() => {
                    navigate("/detail-award", {
                      state: {
                        id: item.awardId,
                        endTime: item.endTime,
                        startTime: item.startTime,
                      },
                    });
                  }}
                >
                  Chi tiết >>
                </button>
                <div
                  style={{
                    width: "100%",
                    height: "40%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      textAlign: "center",
                      margin: 0,
                      fontSize: item.awardName.length > 40 ? "11px" : "15px",
                      marginBottom: 4,
                      fontWeight: 600,
                    }}
                  >
                    {item.awardName}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
    </Swiper>
  );
};

export default SwiperAward;
