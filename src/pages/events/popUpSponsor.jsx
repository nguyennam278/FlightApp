import React, { useState } from "react";
import { Modal } from "zmp-ui";

const PopUpSponsorSeminar = (props) => {
  const [modalVisible, setModalVisible] = useState(true);
  return (
    <>
      <Modal
        visible={modalVisible}
        modalClassName="modal-info"
        onClose={() => {
          setModalVisible(false);
        }}
      >
        <Box className="sub-award-popup">
          {/* <Box style={{ width: "100%", height: "100%" }}>
        <img src={detailSponsor?.image} />
      </Box> */}
          <span onClick={() => setModalVisible(false)}>X</span>
          <Box style={{ padding: 10 }}>
            <p className="info-titleAwawrd">a</p>
            <p>a{detailSponsor?.description}</p>
          </Box>
        </Box>
      </Modal>
    </>
  );
};
export default PopUpSponsorSeminar;
