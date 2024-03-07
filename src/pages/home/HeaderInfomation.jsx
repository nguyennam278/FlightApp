import React, { useState, useEffect } from "react";
import { List, Icon, Page, Box, Button, Text, Avatar } from "zmp-ui";
import { useRecoilState } from "recoil";
import { phoneNumberUser, infoUser } from "../../recoil/RecoilState";
import { getSetting } from "zmp-sdk/apis";
import { getUserZalo } from "../../Common/ApiZaloCommon";
import { isEmpty } from "../../Common/utility";
import { Icon as IconIfy } from "@iconify/react";

export default function HeaderInfomation() {
  const [userZalo, setUserZalo] = useRecoilState(infoUser);

  useEffect(() => {
    handleUserZalo();
  }, [userZalo]);

  const handleUserZalo = async () => {
    if (isEmpty(userZalo)) {
      var rs = await getUserZalo();
      setUserZalo({ ...rs });
    }
  };

  return (
    <Box flex={true} flexDirection={"row"} style={{ height: 60 }}>
      <div
        style={{
          width: "15%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Avatar online size={50} src={userZalo?.avatar} />
      </div>
      <div
        style={{
          paddingLeft: 20,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box flex={true} flexDirection={"column"}>
          <div>
            <b>Hello, {userZalo?.name}</b>
          </div>
        </Box>
      </div>
      <div
        style={{
          width: "30%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          marginRight: 10,
        }}
      >
        {/* <Box flex={true} flexDirection="row">
          <text
            style={{
              fontWeight: 400,
              fontSize: 20,
              marginTop: 5,
              marginRight: 5,
              color: "#E4A951",
            }}
          >
            100
          </text>
          <IconIfy
            icon="pepicons-pencil:crown"
            width="25"
            height="28"
            style={{ color: "#E4A951" }}
          />
        </Box> */}
      </div>
    </Box>
  );
}
