import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Page,
  Box,
  Text,
  Modal,
  Button,
  Input,
  ImageViewer,
  Icon,
} from "zmp-ui";

import api from "../../../Common/api";

const PopupSpeakersInfo = forwardRef((props, ref) => {
  const [popupSpeakerInfo, setpopupSpeakerInfo] = useState(false);
  const [infoSpeaker, setInfoSpeaker] = useState({});

  const open = (id) => {
    getDetailSpeaker(id);
    setpopupSpeakerInfo(true);
  };
  useImperativeHandle(ref, () => ({
    open,
  }));

  const getDetailSpeaker = (speakerId) => {
    api
      .get(`/SeminarApi/GetDetailSpeakerById?`, {
        params: {
          speakerId: speakerId,
        },
      })
      .then((res) => {
        setpopupSpeakerInfo(true);
        setInfoSpeaker(res.data);
      });
  };
  return (
    <>
      <Modal
        maskClosable={false}
        mask={true}
        visible={popupSpeakerInfo}
        onClose={() => {
          setpopupSpeakerInfo(false);
        }}
      >
        <Box
          className="sub-award-popup"
          style={{ maxHeight: 600, overflowY: "scroll" }}
        >
          <Box>
            <img
              style={{ width: "100%", height: "317px" }}
              src={infoSpeaker?.image}
            />
          </Box>
          <span onClick={() => setpopupSpeakerInfo(false)}>X</span>
          <Box style={{ padding: 10 }}>
            <p className="info-titleAwawrd">{infoSpeaker?.speakerName}</p>
            <p style={{ fontSize: 22, fontStyle: "italic", marginTop: "5%" }}>
              {infoSpeaker?.position}
            </p>
            <p
              dangerouslySetInnerHTML={{ __html: infoSpeaker?.introduction }}
            ></p>
          </Box>
        </Box>
      </Modal>
    </>
  );
});

export default PopupSpeakersInfo;
