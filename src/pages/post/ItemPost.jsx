import React, { useState, useEffect } from "react";
import { useNavigate, Page, Box, Button, Text, Avatar } from "zmp-ui";
import moment from "moment";

const ItemPost = (props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/detailPost", {
      state: props.data,
    });
  };

  return (
    <div
      style={{
        padding: 8,
      }}
    >
      <Box>
        <img
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 10,
          }}
          role="presentation"
          onClick={() => {
            handleClick();
          }}
          src={props.data.url}
          alt={"img_logo"}
        />
      </Box>
      <div onClick={() => handleClick()}>
        <Box>
          <Text
            size="xLarge"
            style={{
              color: "#003366",
              paddingTop: 4,
              paddingBottom: 4,
            }}
          >
            {props.data.postName}
          </Text>
        </Box>
        <Box>
          <Text>{moment(props.data.crDatetime).format("DD/MM/YYYY h:mm")}</Text>
        </Box>
      </div>
    </div>
  );
};

export default ItemPost;
