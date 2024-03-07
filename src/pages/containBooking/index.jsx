import React from "react";
import { Page, Box, Button, Tabs, List } from "zmp-ui";
import "./contain.css";
import { useNavigate } from "react-router";
import Flight from "./Flight";

const ContainBooking = () => {
  const navigate = useNavigate();
  return (
    <Page hideScrollbar="true" style={{ height: "100vh", paddingTop: 60 }}>
      {/* <Tabs id="contact-list">
        <Tabs.Tab key="tab1" label="Chuyến bay">
          <Flight />
        </Tabs.Tab>
        <Tabs.Tab key="tab2" label="Trạng thái">
          <StatusFlight />
        </Tabs.Tab>
      </Tabs> */}
      <Flight />
    </Page>
  );
};
export default ContainBooking;
