import React, { useState, useEffect, createRef } from "react";
import { useNavigate, Icon, Page, Box, Button, Text } from "zmp-ui";
import { useLocation } from "react-router-dom";
import useSetHeader from "../../components/hooks/useSetHeader";

const DetailPost = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const containerRef = createRef();
  const setHeader = useSetHeader();

  useEffect(() => {
    setHeader({
      hasLeftIcon: true,
      type: "secondary",
      title: "Detail Blog",
      customTitle: false,
    });
  }, []);
  useEffect(() => {
    setData({ ...location.state });
  }, [location.state]);

  useEffect(() => {
    if (data.content && containerRef.current) {
      containerRef.current.innerHTML = data.content;
    }
  }, [data, containerRef]);

  return (
    <Page
      className="page"
      hideScrollbar={true}
      style={{ backgroundColor: "#fff" }}
    >
      <div>
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
          src={data.url}
          alt={"img_logo"}
        />
      </div>
      <div style={{ marginBottom: 8, marginTop: 8 }}>
        <Text
          size="xLarge"
          style={{
            fontWeight: 700,
          }}
          onClick={() => navigate(-1)}
        >
          Tin tức
        </Text>
      </div>
      <div
        className="section-container"
        style={{ borderColor: "#BBBBBB", borderWidth: 1 }}
      >
        <div style={{ marginBottom: 8 }}>
          <Text
            style={{
              fontWeight: 500,
            }}
            size="xLarge"
          >
            {data?.postName}
          </Text>
        </div>
        <div ref={containerRef}></div>
      </div>
    </Page>
  );
};

export default DetailPost;
