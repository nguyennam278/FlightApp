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

const PopupSponsor = forwardRef((props, ref) => {
  const [popupSponsor, setPopupSponsor] = useState(false);
  const [detailSponsor, setDetailSponsor] = useState([]);
  const open = (id) => {
    getDetailSponsor(id);
    setPopupSponsor(true);
  };
  useImperativeHandle(ref, () => ({
    open,
  }));

  const getDetailSponsor = (sponsorId) => {
    api

      .get(`/SeminarApi/GetDetailSponsorById?`, {
        params: {
          sponsorId: sponsorId,
        },
      })
      .then((res) => {
        setPopupSponsor(true);
        setDetailSponsor(res.data);
      });
  };
  return (
    <>
      <Modal
        maskClosable={false}
        mask={true}
        visible={popupSponsor}
        onClose={() => {
          setPopupSponsor(false);
        }}
      >
        <Box className="sub-award-popup">
          <Box style={{ width: "100%", height: "80%" }}>
            <img src={detailSponsor?.image} />
          </Box>
          <span onClick={() => setPopupSponsor(false)}>X</span>
          <Box style={{ padding: 10 }}>
            <p className="info-titleAwawrd">{detailSponsor?.sponsorName}</p>
            <p
              dangerouslySetInnerHTML={{ __html: detailSponsor?.introduction }}
            ></p>
            <p>Tesst</p>
          </Box>
        </Box>
      </Modal>
    </>
  );
});
export default PopupSponsor;
