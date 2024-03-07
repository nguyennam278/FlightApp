import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "zmp-ui";
import dfData from "../../Common/DefaultConfig.json";
import api from "../../Common/api";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

const SwiperSurvey = (props) => {
  const navigate = useNavigate();

  return (
    <Swiper
      loop={true}
      centeredSlides={true}
      slidesPerView={2}
      initialSlide={1}
      spaceBetween={20}
      className="mySwiper"
      direction={"vertical"}
    >
      {props.listSurvey &&
        props.listSurvey.slice(0, 4).map((item, index, el) => {
          return (
            <SwiperSlide className="itemAward">
              <div className="item" key={index}>
                <p
                  style={{
                    maxWidth: "80%",
                    height: 82,
                    marginLeft: "10%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {item.surveyName}
                </p>
                <button
                  style={{
                    right: 0,
                    backgroundColor: "#afafaf",
                    borderRadius: 50,
                    width: 30,
                    height: 30,
                    bottom: "35%",
                    marginRight: " 4%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={() => {
                    navigate("/detail-survey", {
                      state: {
                        id: item.surveyId,
                        name: item.surveyName,
                        desc: item.surveyDesc,
                      },
                    });
                  }}
                >
                  >>
                </button>
              </div>
            </SwiperSlide>
          );
        })}
    </Swiper>
  );
};

export default SwiperSurvey;
