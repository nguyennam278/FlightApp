import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "zmp-ui";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

const SwiperBlog = (props) => {
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
      {props.listPost &&
        props.listPost.slice(0, 4).map((item, index, el) => {
          return (
            <SwiperSlide
              className="box_item"
              style={{
                backgroundColor: "#fff",
              }}
            >
              <div
                style={{ width: "100%", height: "160px" }}
                className="item"
                key={index}
                onClick={() => {
                  navigate("/detailPost", {
                    state: item,
                  });
                }}
              >
                <img
                  style={{ width: "100%", height: "70%", position: "relative" }}
                  src={item.url}
                />
                <button
                  style={{
                    position: "absolute",
                    right: 0,
                    bottom: "30%",
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
                      fontSize: "11px",
                      marginBottom: 4,
                      fontWeight: 600,
                    }}
                  >
                    {item.postName}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
    </Swiper>
  );
};

export default SwiperBlog;
