import React, { useState, useEffect } from "react";
import { List, Icon, Page, Box, Button, Text, Avatar } from "zmp-ui";
import { openWebview, openChat, getUserInfo } from "zmp-sdk/apis";
import api from "../../Common/api";

const { Item } = List;
export default function Insurtech() {
  const [link, setLink] = useState(
    "https://baohiem.incom.vn/Home/AllPackageInMiniApp",
  );

  return (
    <Page hideScrollbar={true}>
      <iframe
        src={link}
        style={{ width: "100vw", height: "100vh" }}
        scrolling="no"
      ></iframe>
    </Page>
  );
}
