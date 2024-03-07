import React, { useState, useEffect } from "react";
import { Box, Icon, Page } from "zmp-ui";
import "./error.css";

import WheelComponent from "../luckeywheel/wheel";
export default function Error() {
  const typeMess = {
    baoTri: "Hệ thống chưa cập nhật kịp, xin quý khách vui lòng quay lại sau!",
    chuaBatDau:
      "Chương trình chưa bắt đầu, xin quý khách vui lòng quay lại sau!",
    ketThuc:
      "Chương trình này đã kết thúc. Quý khách vui lòng chờ đợi các chương trình tiếp theo!",
  };

  return (
    <Page hideScrollbar={true} className="error-container">
      <Box className="img">
        <Box className="tree"></Box>
        <Box className="text-box">
          <Box className="text">{typeMess.ketThuc}</Box>
        </Box>
      </Box>
    </Page>
  );
}
