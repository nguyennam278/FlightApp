import React, { useState, useEffect } from "react";
import { Page, Box, Text, Modal, Button, Icon, useNavigate } from "zmp-ui";
import { useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import dfData from "../../Common/DefaultConfig.json";

const AwardLuckyWheel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [listAward, setListAward] = useState([]);

  const [isShow, setIsShow] = useState(false);
  const [dataShow, setDataShow] = useState({});

  useEffect(() => {
    setListAward([...location.state]);
  }, [location.state]);

  const showTableAward = () => {
    return (
      <Box flex={true} flexDirection={"column"}>
        <Box flex={true} flexDirection={"row"}>
          <Box
            className="divCenter"
            style={{
              height: 40,
              borderTopLeftRadius: 20,
              width: "30%",
              borderTop: "1px solid #000000",
              borderLeft: "1px solid #000000",
              borderBottom: "1px solid #000000",
            }}
          >
            <text
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#BA1414",
              }}
            >
              Giải
            </text>
          </Box>
          <Box
            className="divCenter"
            style={{ height: 40, width: "50%", border: "1px solid #000000" }}
          >
            <text
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#BA1414",
              }}
            >
              Tên quà tặng
            </text>
          </Box>
          <Box
            className="divCenter"
            style={{
              height: 40,
              borderTopRightRadius: 20,
              width: "20%",
              borderTop: "1px solid #000000",
              borderRight: "1px solid #000000",
              borderBottom: "1px solid #000000",
            }}
          >
            <text
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#BA1414",
              }}
            >
              Số giải
            </text>
          </Box>
        </Box>
        {listAward.map((item, index) => {
          if (index < listAward.length - 1) {
            return (
              <Box
                flex={true}
                flexDirection={"row"}
                onClick={() => {
                  setIsShow(true);
                  setDataShow({ ...item });
                }}
              >
                <Box
                  className="divCenter"
                  style={{
                    width: "30%",
                    borderLeft: "1px solid #000000",
                    borderBottom: "1px solid #000000",
                  }}
                  p={2}
                >
                  <text
                    style={{
                      fontSize: 16,
                      fontWeight: 400,
                      color: "#000000",
                    }}
                  >
                    {item.prizeOrder}
                  </text>
                </Box>
                <Box
                  className="divCenter"
                  style={{
                    width: "50%",
                    borderLeft: "1px solid #000000",
                    borderBottom: "1px solid #000000",
                    borderRight: "1px solid #000000",
                  }}
                  p={2}
                >
                  <text
                    style={{
                      fontSize: 16,
                      fontWeight: 400,
                      color: "#000000",
                    }}
                  >
                    {item.prizeName}
                  </text>
                </Box>
                <Box
                  className="divCenter"
                  style={{
                    width: "20%",
                    borderBottom: "1px solid #000000",
                    borderRight: "1px solid #000000",
                  }}
                  p={2}
                >
                  <text
                    style={{
                      fontSize: 16,
                      fontWeight: 400,
                      color: "#000000",
                    }}
                  >
                    {item.prizeAmount}
                  </text>
                </Box>
              </Box>
            );
          } else {
            return (
              <Box
                flex={true}
                flexDirection={"row"}
                onClick={() => {
                  setIsShow(true);
                  setDataShow({ ...item });
                }}
              >
                <Box
                  className="divCenter"
                  style={{
                    width: "30%",
                    borderLeft: "1px solid #000000",
                    borderBottom: "1px solid #000000",
                    borderBottomLeftRadius: 20,
                  }}
                  p={2}
                >
                  <text
                    style={{
                      fontSize: 16,
                      fontWeight: 400,
                      color: "#000000",
                    }}
                  >
                    {item.prizeOrder}
                  </text>
                </Box>
                <Box
                  className="divCenter"
                  style={{
                    width: "50%",
                    borderLeft: "1px solid #000000",
                    borderBottom: "1px solid #000000",
                    borderRight: "1px solid #000000",
                  }}
                  p={2}
                >
                  <text
                    style={{
                      fontSize: 16,
                      fontWeight: 400,
                      color: "#000000",
                    }}
                  >
                    {item.prizeName}
                  </text>
                </Box>
                <Box
                  className="divCenter"
                  style={{
                    width: "20%",
                    borderBottom: "1px solid #000000",
                    borderRight: "1px solid #000000",
                    borderBottomRightRadius: 20,
                  }}
                  p={2}
                >
                  <text
                    style={{
                      fontSize: 16,
                      fontWeight: 400,
                      color: "#000000",
                    }}
                  >
                    {item.prizeAmount}
                  </text>
                </Box>
              </Box>
            );
          }
        })}
      </Box>
    );
  };

  return (
    <Page
      className="section-container"
      restoreScrollOnBack={true}
      hideScrollbar={true}
      style={{
        backgroundColor: "#fff",
      }}
    >
      <Box style={{ padding: 8 }}>
        <Box
          style={{
            height: 50,
            backgroundSize: "contain",
            backgroundImage: `url(${dfData.url}/images/winmart/text_lable.png)`,
          }}
          className="divCenter"
        >
          <Text
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: "#ffff",
              fontFamily: "Inter, sans-serif",
              lineHeight: "36px",
            }}
          >
            Danh sách quà tặng
          </Text>
        </Box>
      </Box>
      <Box style={{ marginTop: 16, marginBottom: 16 }}>
        {listAward.length > 0 && <>{showTableAward()}</>}
      </Box>
      <Box p={2}>
        <Text
          size="xLarge"
          style={{
            fontWeight: 700,
            fontSize: 20,
            color: "#BA1414",
            lineHeight: "30px",
          }}
        >
          Điều kiện áp dụng:
        </Text>
        <Box mt={1}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              color: "#000000",
            }}
          >
            Không có giá trị quy đổi ra tiền mặt
          </Text>
        </Box>
      </Box>
      <Modal
        visible={isShow}
        //title="Giải thưởng"
        onClose={() => {
          setIsShow(false);
        }}
        //coverSrc={imageShow}
        title={
          <Box flex={true} justifyContent={"flex-end"}>
            <Icon
              icon="zi-close-circle"
              onClick={() => {
                setIsShow(false);
              }}
            />
          </Box>
        }
      >
        <Box className="divCenter" p={1} flexDirection={"column"}>
          <Box>
            <img
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              role="presentation"
              onClick={() => {
                handleClick();
              }}
              src={dataShow.prizeImage}
              alt={"img_logo"}
            />
          </Box>
          <Box className={"divCenter"} style={{ marginTop: 8 }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#FF4949",
              }}
            >
              {dataShow.prizeName}
            </Text>
          </Box>
        </Box>
      </Modal>
    </Page>
  );
};

export default AwardLuckyWheel;
