import React, { useState, useEffect, createRef } from "react";
import { useNavigate, Icon, Page, Box, Button, Text } from "zmp-ui";
import { useLocation } from "react-router-dom";
import dfData from "../../Common/DefaultConfig.json";

const AwardRules = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState("");
  const containerRef = createRef();

  useEffect(() => {
    setData(location.state);
  }, [location.state]);

  useEffect(() => {
    if (data != "" && containerRef.current) {
      containerRef.current.innerHTML = data;
    }
  }, [data, containerRef]);

  return (
    <Page
      className="page"
      hideScrollbar={true}
      style={{ backgroundColor: "#fff" }}
    >
      <div
        className="divCenter"
        style={{
          marginBottom: 4,
          marginTop: 12,
          height: 50,
          backgroundSize: "contain",
          backgroundImage: `url(${dfData.url}/images/winmart/text_lable.png)`,
        }}
      >
        <Text
          size="xLarge"
          style={{
            fontWeight: 700,
            fontSize: 28,
            color: "#FFF",
            textAlign: "center",
            lineHeight: "30px",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Thể lệ chương trình
        </Text>
      </div>
      <div
        className="section-container"
        //style={{ borderColor: "#BBBBBB", borderWidth: 1 }}
      >
        <div ref={containerRef}></div>
      </div>
    </Page>
  );
};

export default AwardRules;
