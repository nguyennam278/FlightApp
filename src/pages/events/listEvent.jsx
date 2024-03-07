import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../../Common/api";
import { Box } from "zmp-ui";

const ListEvent = () => {
  const navigate = useNavigate();
  const [listEvent, setListEvent] = useState([]);
  useEffect(() => {
    getListSeminar();
  }, []);

  const getListSeminar = () => {
    api.get(`/SeminarApi/GetListSeminarByMiniAppId?miniAppId`).then((res) => {
      setListEvent([...res.Data]);
      console.log("List Event:", res.Data);
    });
  };
  return (
    <Box>
      {" "}
      {listEvent &&
        listEvent.map((item, index, el) => {
          return (
            <Box
              style={{
                backgroundColor: item.backgroundColorBanner,
                color: item.textColorBanner,
              }}
            >
              <div
                style={{ width: "200px", height: "120px" }}
                className="item"
                key={index}
              >
                <img
                  style={{ width: "100%", height: "80%", position: "relative" }}
                  src={item.image}
                />
                <button
                  style={{ position: "absolute", right: 0, bottom: "24px" }}
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
                  Chi tiết &gt;&gt;
                </button>
                <p style={{ margin: 0 }}>
                  <p
                    style={{
                      textAlign: "center",
                      margin: 0,
                      fontWeight: 600,
                      boxSizing: "border-box",
                      flexWrap: "wrap",
                      color: "black",
                    }}
                  >
                    {item.seminarContent.length > 20
                      ? `${item.seminarContent.substring(0, 20)}...`
                      : item.seminarContent}
                  </p>
                  {item.statusSeminarName === "Đang diễn ra" ? (
                    <p className="textStatus">{item.statusSeminarName}</p>
                  ) : (
                    <p className="textStatusRed">{item.statusSeminarName}</p>
                  )}
                </p>
              </div>
            </Box>
          );
        })}
    </Box>
  );
};

export default ListEvent;
