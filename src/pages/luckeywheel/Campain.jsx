import React, { useState, useEffect } from "react";
import { List, Icon, Box, Button, Text, useNavigate, Page } from "zmp-ui";
import { openWebview, openChat, followOA, showToast } from "zmp-sdk/apis";
import api from "../../Common/api";
import { useRecoilState } from "recoil";
import { listBlog } from "../../recoil/RecoilState";
import dfData from "../../Common/DefaultConfig.json";

const { Item } = List;
export default function Campain() {
  const [listCampain, setListCampain] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getListCampainCode();
  }, []);

  const getListCampainCode = () => {
    api.get("LuckyWheelApi/GetListCampaign").then((res) => {
      if (res.Code == 1) {
        setListCampain([...res.Data]);
      }
    });
  };

  const renderListItem = () => {
    if (listCampain.length > 0) {
      return (
        <div>
          {listCampain.map((item, index) => {
            return (
              <Box
                style={{
                  marginTop: 20,
                  borderRadius: 20,
                  backgroundSize: "cover",
                  backgroundImage: `url(${dfData.url}/images/winmart/border_frame_2.png)`,
                }}
              >
                <Box
                  flex={true}
                  flexDirection={"row"}
                  style={{
                    width: "100%",
                    height: "132px",
                    padding: 9,
                  }}
                  onClick={() => {
                    navigate(`/luckywheel/${item.campaignCode}`);
                  }}
                >
                  <Box
                    style={{
                      width: "30%",
                      height: "100%",

                      marginRight: 4,
                    }}
                  >
                    <img
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 20,
                        objectFit: "contain",
                      }}
                      src={
                        item.logoCampaign
                          ? item.logoCampaign
                          : item.categoryCampaignId == 1
                            ? `${dfData.url}/images/winmart/WinmartLogo.png`
                            : `${dfData.url}/images/winmart/LogoInochi.png`
                      }
                    />
                  </Box>
                  <Box
                    className={"divCenter"}
                    style={{
                      width: "70%",
                      height: "100%",
                    }}
                  >
                    <text
                      style={{
                        color: "white",
                        fontSize: 23,
                        fontFamily: "Inter, sans-serif",
                        fontWeight: "700",
                        wordWrap: "break-word",
                        textAlign: "center",
                        lineHeight: "30px",
                      }}
                    >
                      {item.campaignName}
                    </text>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  return (
    <Page
      className="section-container"
      restoreScrollOnBack={true}
      hideScrollbar={true}
      style={{
        height: "95vh",
        //backgroundColor: "red",
        backgroundSize: "cover",
        backgroundImage: `url(${dfData.url}/images/winmart/wheel_background_new3.png)`,
        paddingBottom: 80,
      }}
    >
      <Box style={{ marginTop: "10vh" }}>
        <div
          style={{
            width: "100%",
            textAlign: "center",
            color: "white",
            fontSize: 28,
            fontFamily: "Inter, sans-serif",
            fontWeight: "700",
            wordWrap: "break-word",
            lineHeight: "31px",
          }}
        >
          Bạn vui lòng chọn một trong các vòng quay sau
        </div>
      </Box>

      <Box>
        <List>{renderListItem()}</List>
      </Box>
    </Page>
  );
}
