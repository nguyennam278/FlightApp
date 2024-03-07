import React, { useState, useEffect } from "react";
import { List, Icon, Page, Box, Button, Text, Input } from "zmp-ui";
import { openWebview, openChat, getUserInfo, clearStorage } from "zmp-sdk/apis";
import api from "../../Common/api";

export default function Search() {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");

  const searchTelCoName = () => {
    if (text) {
      api
        .get("PostApp/SearchTelcoNameByPhone", {
          params: {
            phoneNumber: text,
          },
        })
        .then((res) => {
          if (res.code == 1) {
            switch (res.telcoName) {
              case "viettel":
                setMessage("Số điện thoại thuộc nhà mạng Viettel");
                break;
              case "mobi":
                setMessage("Số điện thoại thuộc nhà mạng Mobiphone");
                break;
              case "vina":
                setMessage("Số điện thoại thuộc nhà mạng VinaPhone");
                break;
              case "vietnammobile":
                setMessage("Số điện thoại thuộc nhà mạng Vietnammobile");
                break;
              case "gtel":
                setMessage("Số điện thoại thuộc nhà mạng Gtel");
                break;
              case "itelecom":
                setMessage("Số điện thoại thuộc nhà mạng Itelecom");
                break;
              case "reddi":
                setMessage("Số điện thoại thuộc nhà mạng Reddi");
                break;
              default:
                break;
            }
          } else {
            setMessage(res.message);
          }
        });
    } else {
      setMessage("Vui lòng nhập số điện thoại để tra cứu");
    }
  };

  return (
    <Page
      className="page"
      //hideScrollbar={true}
      style={{
        backgroundColor: "#fff",
        maxHeight: "100vh",
      }}
    >
      <Box>
        <Text
          size="xLarge"
          style={{
            fontWeight: 700,
            marginTop: 8,
            marginBottom: 8,
          }}
        >
          Tra cứu
        </Text>
      </Box>
      <Box>
        <Input.Search
          label="Label"
          helperText="Helper text"
          placeholder="Tra cứu nhà mạng theo số điện thoại"
          value={text}
          clearable
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
      </Box>
      <Box
        mt={6}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          variant="primary"
          size="large"
          onClick={() => {
            searchTelCoName();
          }}
        >
          Tra cứu
        </Button>
      </Box>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {message !== "" && (
          <Text
            size="xLarge"
            style={{
              fontWeight: 500,
              marginTop: 8,
              marginBottom: 8,
            }}
          >
            {message}
          </Text>
        )}
      </Box>
    </Page>
  );
}
