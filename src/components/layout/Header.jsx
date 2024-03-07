import React, { useEffect } from "react";
import { Box, Icon } from "zmp-ui";
import { useRecoilValue } from "recoil";
import { headerState } from "../../recoil/RecoilState";
import { useNavigate } from "react-router";
import HeaderInfomation from "../../pages/home/HeaderInfomation";
import { Icon as IconIfy } from "@iconify/react";

const typeColor = {
  primary: {
    headerColor: "bg-primary",
    textColor: "text-white",
    iconColor: "text-white",
  },
  secondary: {
    headerColor: "bg-white",
    textColor: "text-black",
    iconColor: "text-gray-400",
  },
};

const HeaderCustom = () => {
  const { route, hasLeftIcon, rightIcon, title, customTitle, type } =
    useRecoilValue(headerState);

  const { headerColor, textColor, iconColor } = typeColor[type || "primary"];
  const navigate = useNavigate();

  return (
    <div
      className={"header"}
      style={{
        display: "flex",
        flexDirection: "row",
        backgroundColor: customTitle ? "#fff" : "#d41111",
      }}
    >
      <Box
        flex={true}
        flexDirection={"row"}
        flexWrap={true}
        style={{ width: "100%" }}
      >
        <Box
          flex={true}
          flexDirection={"row"}
          flexWrap={true}
          style={{
            width: rightIcon ? "70%" : "100%",
            minHeight: 48,
          }}
        >
          {hasLeftIcon && (
            <div className="divCenter" style={{ width: "15%" }}>
              <span onClick={() => (route ? navigate(route) : navigate(-1))}>
                <IconIfy
                  icon="ic:round-arrow-back"
                  width="30"
                  height="30"
                  style={{ color: "#fff" }}
                />
              </span>
            </div>
          )}
          <div style={{ width: hasLeftIcon ? "70%" : "100%" }}>
            {customTitle ? (
              <HeaderInfomation></HeaderInfomation>
            ) : (
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <b
                  style={{
                    fontWeight: 700,
                    fontSize: 20,
                    textAlign: "center",
                    color: "#FFFFFF",
                  }}
                >
                  {title}
                </b>
              </div>
            )}
          </div>
        </Box>
        <Box style={{ width: customTitle ? "0%" : "15%" }}>
          {rightIcon || " "}
        </Box>
      </Box>
    </div>
  );
};

export default HeaderCustom;
