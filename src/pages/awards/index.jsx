import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Page, Box, Text, Spinner, Tabs, List } from "zmp-ui";
import api from "../../Common/api";
import { handleLogin } from "../../Common/token";
import dfData from "../../Common/DefaultConfig.json";
export default function Award() {
  const navigate = useNavigate();
  const [listAward, setListAward] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getListAward();
    handleLogin();
  }, []);

  const getListAward = () => {
    api.post(`/AwardApi/GetListAwardByCodition?miniAppId`).then((res) => {
      setLoading(true);

      setListAward([...res.Data]);
    });
    setLoading(false);
  };

  return (
    <Page hideScrollbar={true} className="section-container">
      <Box>
        <Text.Title
          style={{
            fontSize: 24,
            fontWeight: 650,
            textAlign: "center",
            marginBottom: 50,
          }}
        >
          Danh sách giải thưởng
        </Text.Title>
      </Box>
      <Box
        style={{
          marginTop: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {listAward ? (
          listAward.map((item, index) => {
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
                  navigate("/detail-award", {
                    state: {
                      id: item.awardId,
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
                  dangerouslySetInnerHTML={{ __html: item?.awardName }}
                ></div>
              </div>
            );
          })
        ) : (
          <Spinner />
        )}
      </Box>
    </Page>
  );
}
