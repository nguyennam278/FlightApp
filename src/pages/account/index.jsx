import React, { useState, useEffect } from "react";
import { List, Icon, Page, Box, Button, Text, Avatar } from "zmp-ui";
import { openWebview, getSetting, getUserInfo } from "zmp-sdk/apis";
import api from "../../Common/api";
import { useRecoilState } from "recoil";
import { phoneNumberUser, infoUser } from "../../recoil/RecoilState";
import useSetHeader from "../../components/hooks/useSetHeader";

const { Item } = List;
export default function AccountManager() {
  const [data, setData] = useRecoilState(infoUser);
  const setHeader = useSetHeader();

  useEffect(() => {
    setHeader({
      hasLeftIcon: true,
      type: "secondary",
      title: "Profile",
      customTitle: false,
    });
  }, []);
  return (
    <Page
      className="page"
      //hideScrollbar={true}
      style={{
        backgroundColor: "#fff",
        maxHeight: "100vh",
      }}
    >
      <Text
        size="xLarge"
        style={{
          fontWeight: 700,
          marginTop: 8,
          marginBottom: 8,
        }}
      >
        Thông tin tài khoản
      </Text>
      <Box>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 16,
            paddingBottom: 16,
          }}
        >
          <Avatar online size={50} src={data?.avatar} />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            size="xLarge"
            style={{
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            {data?.name}
          </Text>
        </div>
      </Box>
      <Box
        style={{
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: "#DDDD",
          paddingTop: 16,
          paddingBottom: 16,
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ width: "50%", textAlign: "left" }}>
            <Text
              size="small"
              style={{
                fontWeight: 500,
              }}
            >
              Tên hiển thị
            </Text>
          </div>
          <div
            style={{
              width: "50%",
              textAlign: "right",
            }}
          >
            <Text
              size="small"
              style={{
                fontWeight: 500,
              }}
            >
              <Text
                size="small"
                style={{
                  fontWeight: 500,
                  marginRight: 0,
                }}
              >
                {data?.name}
              </Text>
            </Text>
          </div>
        </div>
      </Box>
      <Box
        style={{
          //borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: "#DDDD",
          paddingTop: 16,
          paddingBottom: 16,
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ width: "50%", textAlign: "left" }}>
            <Text
              size="small"
              style={{
                fontWeight: 500,
              }}
            >
              ID
            </Text>
          </div>
          <div
            style={{
              width: "50%",
              textAlign: "right",
            }}
          >
            <Text
              size="small"
              style={{
                fontWeight: 500,
              }}
            >
              <Text
                size="small"
                style={{
                  fontWeight: 500,
                  marginRight: 0,
                }}
              >
                {data?.id}
              </Text>
            </Text>
          </div>
        </div>
      </Box>
    </Page>
  );
}
