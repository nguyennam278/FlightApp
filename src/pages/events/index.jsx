import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Page, Box, Text, Spinner, Tabs, List } from "zmp-ui";
import api from "../../Common/api";
import dfData from "../../Common/DefaultConfig.json";
import { clearStorage } from "zmp-sdk/apis";
import useSetHeader from "../../components/hooks/useSetHeader";

export default function Event() {
  const navigate = useNavigate();
  const [listEvent, setListEvent] = useState([]);
  const setHeader = useSetHeader();

  useEffect(() => {
    setHeader({
      hasLeftIcon: true,
      type: "secondary",
      title: "Seminar List",
      customTitle: false,
    });
  }, []);

  useEffect(() => {
    getListSeminar();
    clearData();
  }, []);

  const clearData = async () => {
    try {
      await clearStorage({});
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };

  const getListSeminar = () => {
    api.get(`/SeminarApi/GetListSeminarByMiniAppId?miniAppId`).then((res) => {
      setListEvent([...res.Data]);
    });
  };

  return (
    <Page hideScrollbar={true} className="section-container">
      <Box>
        <Text.Title className="title-event">Danh sách sự kiện</Text.Title>
      </Box>

      <Tabs id="contact-list" className="contact-list">
        <Tabs.Tab key="tab1" label="Đang diễn ra" className="tab1">
          {listEvent ? (
            listEvent.map((item, index) => {
              if (item.statusSeminarName == "Đang diễn ra") {
                return (
                  <div
                    key={index}
                    style={{
                      width: "65vw",
                      margin: "0 auto",
                      borderRadius: 10,
                      marginBottom: 40,
                      boxShadow: "0px 3px 3px 3px #9999",
                      backgroundColor: item.backgroundColorBanner,
                      color: item.textColorBanner,
                    }}
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
                      src={item.imageHome}
                      style={{
                        width: "65vw",
                        height: 120,
                        objectFit: "cover",
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                      }}
                    />
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 13,
                        textAlign: "center",
                        padding: 5,
                      }}
                    >
                      {item.seminarContent}
                    </div>
                  </div>
                );
              }
            })
          ) : (
            <Spinner />
          )}
        </Tabs.Tab>

        <Tabs.Tab key="tab2" label="Sự kiện sắp tới" className="tab2">
          {listEvent.map((item, index) => {
            if (item.statusSeminarName === "Sắp diễn ra") {
              return (
                <div
                  key={index}
                  style={{
                    width: "65vw",
                    margin: "0 auto",
                    borderRadius: 10,
                    marginBottom: 40,

                    boxShadow: "0px 3px 3px 3px #9999",
                    backgroundColor: item.backgroundColorBanner,
                    color: item.textColorBanner,
                  }}
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
                    src={item.image}
                    style={{
                      width: "65vw",
                      height: 120,
                      objectFit: "cover",
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                    }}
                  />
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 13,
                      textAlign: "center",
                      padding: 5,
                    }}
                  >
                    {item.seminarContent}
                  </div>
                </div>
              );
            }
          })}
        </Tabs.Tab>
      </Tabs>
    </Page>
  );
}
